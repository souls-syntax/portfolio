---
title: "Exploring Stdout Behavior in Zig 0.17.0: Why `>>` Overwrites Your File"
date: 2026-10-31
tags: [programming, zig, c, linux]
series: zig 
---

## The problem

<img src="post_assets/Cheyanne_holding_Systems_Programming_with_Zig.png" alt="Description" width="300" height="200">

Here is a minimal program that writes a line to stdout:

```zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    const io = init.io;
    var stdout_writer = std.Io.File.stdout().writer(io, &.{});
    const stdout = &stdout_writer.interface;

    try stdout.print("I will overwrite as I will reset the positional argument to 0\n", .{});
}
```

To reproduce:

```sh
zig run <filename>.zig > test
cat test
zig run <filename>.zig >> test
cat test
```

Run it once with `>` and once with `>>`. With append redirection you would expect two lines in `test`.

### Behavior on Linux (nushell)

```nushell
□ zig/test
➜ : zig run src/main.zig out> test

□ zig/test
➜ : open test
I will overwrite as I will reset the positional argument to 0

□ zig/test
➜ : zig run src/main.zig out>> test

□ zig/test
➜ : open test
I will overwrite as I will reset the positional argument to 0
I will overwrite as I will reset the positional argument to 0
```

Append works as expected.

### Behavior on macOS (bash)

```bash
➜  zig zig run CWO.zig
I will overwrite as I will reset the positional argument to 0
➜  zig zig run CWO.zig > test
➜  zig cat test
I will overwrite as I will reset the positional argument to 0
➜  zig zig run CWO.zig >> test
➜  zig cat test
I will overwrite as I will reset the positional argument to 0
➜  zig
```

The second run overwrote the file instead of appending to it.

## The cause

The file writer uses `pwrite` internally, and its positional offset starts at zero. The two platforms treat that offset differently when the file was opened with `O_APPEND` (which is what `>>` does):

- **Linux** ignores the offset for `pwrite` on `O_APPEND` files and always appends. This deviates from POSIX, but here it happens to give the behavior we want.
- **macOS** follows POSIX more faithfully and honors the offset. So even under `>>`, every write lands at offset 0.

## Two ways to get the expected behavior

### 1. Use `writerStreaming`

`writerStreaming` uses plain `write` instead of `pwrite`, so it never tracks a positional offset and the shell's redirection semantics behave normally. This is the simplest fix.

### 2. Seek to the end of the file manually

Read the file's length and seed the writer's position with it, which preserves append behavior:

```zig
try stdout_writer.seekTo(try std.Io.File.stdout().length(io));
```

This has two caveats. It only works if you call it **before the first write**, and it is not useful when stdout is a terminal. The next section explains why.

## Why the `seekTo` approach breaks on a terminal

`File.length` calls `io.vtable.fileLength`, which on Linux runs a `statx` syscall:

```zig
fn fileLength(userdata: ?*anyopaque, file: File) File.LengthError!u64 {
    const t: *Threaded = @ptrCast(@alignCast(userdata));

    if (native_os == .linux) {
        const linux = std.os.linux;

        const syscall: Syscall = try .start();
        while (true) {
            var statx = std.mem.zeroes(linux.Statx);
            switch (linux.errno(linux.statx(file.handle, "", linux.AT.EMPTY_PATH, .{ .SIZE = true }, &statx))) {
```

For a terminal, `statx` reports a size of `0`. That alone is harmless, but it interacts badly with the writer's fallback behavior. The writer starts in positional mode, and on a terminal the first `pwrite` fails, so it silently switches to streaming mode. Once it has, `seekTo` goes through the real seek syscall, which a terminal rejects.

### The failing case

This fails because `seekTo(0)` runs after text is already on the terminal:

```zig
pub fn main(init: std.process.Init) !void {
    const io = init.io;
    var stdout_writer = std.Io.File.stdout().writer(io, &.{});

    const out = &stdout_writer.interface;
    try out.print("Printing the text on terminal to automatically move positional value", .{});

    // length() returns 0 on a terminal, so this tries to rewind to the start
    // of text already printed, but the writer has fallen back to streaming
    try stdout_writer.seekTo(try std.Io.File.stdout().length(io));

    try out.print("I am printing to see if manual positional value update works", .{});
}
```

The output:

```
Printing the text on terminal to automatically move positional valueerror: Unseekable
/opt/zig/lib/std/Io/Threaded.zig:10515:31: 0x1184d12 in posixSeekTo (std.zig)
                    .SPIPE => return error.Unseekable,
                              ^
/opt/zig/lib/std/Io/Threaded.zig:10466:5: 0x1184a89 in fileSeekTo (std.zig)
    return posixSeekTo(file.handle, offset);
    ^
/opt/zig/lib/std/Io/File/Writer.zig:220:17: 0x11ee724 in seekToUnbuffered (std.zig)
                return err;
                ^
/opt/zig/lib/std/Io/File/Writer.zig:201:5: 0x11ee27f in seekTo (std.zig)
    try seekToUnbuffered(w, offset);
    ^
writeCheck.zig:17:5: 0x11e3186 in main (writeCheck.zig)
    try stdout_writer.seekTo(try std.Io.File.stdout().length(io));
    ^
```

The call chain is `seekTo` -> `seekToUnbuffered` -> `fileSeekTo` -> `posixSeekTo`. The underlying seek syscall returns `ESPIPE` ("illegal seek"), which Zig maps to `error.Unseekable`. Terminals, pipes and sockets cannot be seeked, so the kernel rejects the call. That is a property of the file descriptor, not a Zig quirk.

### The working case

This works because `seekTo` runs while the writer is still in positional mode, so it only updates the writer's own offset:

```zig
pub fn main(init: std.process.Init) !void {
    const io = init.io;
    var stdout_writer = std.Io.File.stdout().writer(io, &.{});

    const out = &stdout_writer.interface;

    try stdout_writer.seekTo(try std.Io.File.stdout().length(io));

    try out.print("I am printing to see if manual positional value update works", .{});
}
```

Here `length` returns `0`, so the offset stays at 0. The first write then hits the usual fallback to streaming mode, and everything prints normally.

## Takeaways

- The overwrite on macOS comes from the writer's positional `pwrite` with an offset of 0 being honored on an `O_APPEND` file.
- `writerStreaming` is the simplest fix, since it uses plain `write` and lets the shell's redirection semantics work as usual.
- The `seekTo` workaround only works if it is called before the first write, and it does nothing useful on a terminal.

## Possible fixes in the standard library

This section is about changing Zig's implementation, not about user-level workarounds. The macOS behavior is correct: `pwrite` on an `O_APPEND` file honoring its offset is POSIX-conforming, and Linux ignoring the offset is the documented deviation. The issue is how the writer interacts with those semantics.

<div align="center">
<img src="post_assets/Persicaria_holding_Introduction_to_Zig.png" alt="Description" width="300" height="200">
</div>

### 1. Default to streaming writes for stdout

A program does not open stdout itself. It inherits whatever the shell attached to it: a terminal, a pipe, a file from `>`, or a file from `>>` opened with `O_APPEND`. Plain sequential `write` calls let the OS apply the right semantics for each of those cases, with no positional offset for the application to get wrong.

Note that distinguishing seekable from non-seekable handles would not be enough. A file redirected with `>>` is seekable, yet positional writes at offset 0 still overwrite it on macOS. The writer would have to account for append semantics, not just seekability.

### 2. Make `File.length` clearer for handles without a meaningful size

On Linux, `statx` defines `stx_size` as the size of a regular file or symbolic link. For a terminal, a returned size of `0` is not a real length, only the absence of one. Returning `0` as if it were a usable length is what lets the `seekTo(length)` pattern look valid and then fail with `error.Unseekable` once the writer is in streaming mode. `length` could report that no meaningful length exists for such handles, so code does not mistake "unknown" for "empty".


