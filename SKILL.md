# Portfolio Skill — Aakarsh Kashyap's Personal Site

> Drop this file to give an agent instant full context on this project.
> Workspace: `/home/souls-end/Documents/Coding/souls-syntax-repos/portfolio`

---

## Who & What

This is a **retro/oldweb-style personal portfolio** for Aakarsh Kashyap (GitHub: `souls-syntax`).
The aesthetic is deliberately 1999–2004 web: plain HTML, table layouts, `<marquee>`, blinkies, pixel GIFs, no CSS framework, no build step, no JS framework. It is a static site deployed as-is.

**Owner profile:**
- Systems programmer, GPU compute / compiler nerd, chronic C user
- 3rd year CSE @ GLA University + B.S. Data Science & AI @ IIT Madras
- Arch Linux + NeoVim (no LSP, no syntax highlighting — by choice)
- Projects: sauceOS (x86-64 hobby OS), soft-cuda (hybrid CPU/GPU tensor runtime), sush (POSIX shell), tsundere-runtime (game-loop web runtime in Zig)
- Long-term goal: GPU compute or compiler work in Germany

---

## File Structure

```
portfolio/
├── index.html          # Home / About Me
├── resume.html         # Resume page
├── blog.html           # Blog index — posts loaded from posts.json via JS
├── projects.html       # Projects with tab switcher (p1–p4)
├── social.html         # Socials (X, GitHub, LinkedIn)
├── guestbook.html      # Guestbook — powered by HTMLCommentBox (external, auto-moderated)
├── template.html       # Template to copy when making new pages
├── posts.json          # Blog post manifest [{slug, title, date, tags, series, url}]
├── posts/
│   └── tsun_0.html     # Blog post (tsundere-runtime episode 0)
├── gifs/               # All GIF assets (banner, blinkies, anime gifs, etc.)
├── buttons/            # 88x31 pixel buttons (firefox, vim, underconstruction, etc.)
├── weird/              # Sub-pages: now.html, logs.html, uses.html, links.html,
│                       #            garden.html, buttons.html, shrine.html, realshrine.html
├── professional/       # Clean/professional version of the portfolio (separate aesthetic)
├── resume/             # resume.pdf lives here
├── bgm.mp3             # Background music (looped, toggled by [play]/[stop] link)
├── nowplaying.json     # {artist, track} — updated by music_update.sh
├── music_update.sh     # Shell script that updates nowplaying.json
├── guestbook-api/      # Unused Vercel KV API scaffold (kept for reference, not deployed)
│   └── api/comments.js
└── nowplaying.json     # Also exists in weird/ subdirectory
```

---

## Layout Convention (every page follows this exactly)

Every page is a **3-column HTML table** at `width="100%"`:

```
┌──────────────────────────────────────────────────────┐
│ <marquee>page-specific tagline</marquee>  <hr>        │
├──────────────┬──────────────────────┬────────────────┤
│ LEFT (150px) │ MAIN CONTENT (flex)  │ RIGHT (140px)  │
│              │                      │                │
│ banner.gif   │ <b>PageTitle</b><hr> │ "Stuff" label  │
│ Menu links   │ page content here    │ 4 anime GIFs   │
│ Friends      │                      │ BGM toggle     │
│ Status       │                      │                │
│ Now Playing  │                      │                │
│ blinkies     │                      │                │
│ main_header  │                      │                │
└──────────────┴──────────────────────┴────────────────┘
│ footer: 88x31 buttons | webring | visit counter | credit │
```

- Left `<td width="150">` has `border-right: 1px solid black`
- Right `<td width="140">` has `border-left: 1px solid black`
- All pages share identical left sidebar and right sidebar content
- Active menu item is wrapped in `<b>` tags

---

## Head Block Convention

Every page `<head>` must have:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PageName - Aakarsh Kashyap</title>
<style>
a:visited { color: #0000EE; }
img { max-width: 100%; height: auto; }
@media (max-width: 600px) {
  table[width="100%"] > tbody > tr { display: block; }
  table[width="100%"] > tbody > tr > td,
  table[width="100%"] > tr > td {
    display: block;
    width: 100% !important;
    border-right: none !important;
    border-left: none !important;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }
}
</style>
</head>
```

The media query stacks the 3-column table vertically on mobile (≤600px). Desktop is unaffected.

**Do NOT add any other CSS frameworks, external fonts, or additional stylesheets** unless absolutely required (blog posts may use highlight.js for code blocks).

---

## Script Block Convention

Every page `<body>` ends with a `<script>` block containing:

```javascript
// 1. Now Playing fetch
fetch('nowplaying.json')  // or '../nowplaying.json' in subdirectories
  .then(function(r){ return r.json(); })
  .then(function(d){
    document.getElementById('np-artist').textContent = d.artist || '---';
    document.getElementById('np-track').textContent  = d.track  || '---';
  })
  .catch(function(){});

// 2. BGM toggle
function toggleBGM() {
  var a   = document.getElementById('bgm');
  var btn = document.getElementById('bgm-btn');
  if (a.paused) { a.play();  btn.textContent = '[stop]'; }
  else          { a.pause(); a.currentTime = 0; btn.textContent = '[play]'; }
  return false;
}

// 3. Visit counter
fetch('https://visit-counter-kohl.vercel.app/api/count')
  .then(function(r){ return r.json(); })
  .then(function(d){
    document.getElementById('visit-count').textContent = 'visitors: ' + d.count;
  })
  .catch(function(){});
```

Use `var` not `let`/`const`. Use `.then(function(){})` not arrow functions. Keep it oldweb-compatible.

---

## External Services

| Service | URL | Purpose |
|---|---|---|
| Visit Counter | `https://visit-counter-kohl.vercel.app/api/count` | GET → `{count: N}` |
| HTMLCommentBox | `htmlcommentbox.com` | Guestbook comments, auto-moderated, free |
| highlight.js | cdnjs (github-dark theme) | Code syntax highlighting in blog posts only |

---

## Adding a New Page

1. Copy `template.html`
2. Update `<title>` and the `<marquee>` tagline
3. Set the active menu item with `<b>` in the left sidebar
4. Add the `<meta viewport>` and the mobile media query CSS to `<head>` (see Head Block Convention)
5. Write content in the middle `<td>`
6. The right column (gifs + BGM) is always identical
7. The footer (buttons + webring + visit counter) is always identical
8. Adjust asset paths (`../gifs/` instead of `gifs/` for pages inside subdirectories)

---

## Adding a New Blog Post

1. Write the post as `posts/<slug>.html` — use `posts/tsun_0.html` as the reference template
2. Blog posts use a 2-column layout (no right gif column), include `highlight.js` for code, and hide the sidebar on mobile via `.side-panel { display: none }` at ≤600px
3. Add an entry to `posts.json`:
```json
{
  "slug": "your_slug",
  "title": "Full Post Title",
  "date": "YYYY-MM-DD",
  "tags": ["tag1", "tag2"],
  "series": "series-name-or-empty-string",
  "url": "posts/your_slug.html"
}
```
4. `blog.html` automatically picks it up via the JS that fetches `posts.json`

---

## Design Rules (never break these)

- **No Tailwind, no Bootstrap, no React, no build tools** — plain HTML + vanilla JS + vanilla CSS only
- **No `let`/`const`/arrow functions** in shared scripts — keep oldweb JS style
- **No external fonts** — browser default serif/sans is intentional
- **Fixed pixel sizes on GIFs** are intentional — `width="88" height="31"` for buttons, etc.
- **`<marquee>` on every page** — it's a feature, not a bug
- **`<b>` not `<strong>`**, `<i>` not `<em>` — oldweb HTML conventions
- **`bgcolor`, `text`, `link`, `vlink` on `<body>`** — intentional, matches retro style
- **White background (`#ffffff`), black text (`#000000`), classic blue links (`#0000ee`)** — do not change the color scheme
- The site deliberately looks like it was made in 2001. Preserve that at all costs.

---

## Mobile Responsiveness

Added retroactively. The approach:
- Viewport meta tag on every page
- `img { max-width: 100%; height: auto; }` globally
- A single `@media (max-width: 600px)` query that converts the table from 3 horizontal columns to 3 stacked blocks
- On mobile, order is: Left sidebar → Main content → Right sidebar (gifs)
- Desktop is completely unaffected

---

## `weird/` Subdirectory

Personal sub-pages, less structured, same layout conventions. Asset paths use `../gifs/`, `../buttons/`, etc. Pages:
- `now.html` — what Aakarsh is currently working on
- `logs.html` — day-to-day activity log
- `uses.html` — hardware/software setup and opinions
- `links.html` — curated link collection
- `garden.html` — digital thought garden / notes
- `buttons.html` — collection of 88x31 pixel buttons
- `shrine.html` / `realshrine.html` — fan shrine pages (don't judge)
