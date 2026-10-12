---
title: Scathach, Episode - 0
date: 2026-10-13
tags: [programming, game, scathach]
series: scathach
---

---

Hola/Hello/namaskar, So sorry ok, I really have no excuse why I wasn't posting blogs for so long, but this time for sure everything will be done with more planing.

<img src="post_assets/futaba.jpg" alt="Description" width="300" height="200">

Uwwwww, I know I know "What about tohsaka series, you only ever posted one episode." To that I say "Mou, it's too hard reader-kun. I don't want to cheat and make a perfect thing. So this series will be more of my tutorial level where I build something adjacent and related, so we will just need to assemble them to get the finished product without me getting overwhelmed. Humpf aren't I a genius. Praise me"

Anyways coming back to this series introduction, It's gonna be a simple hack and slash game with maybe few levels. Written in SDL2 (cause it's what I found most resource on, so better starting point for building foundation. Atleast such is my reasoning.)

Game's Protagnist is gonna be scathach who just returned to Land of shadows and now gonna clean up her realm. Well all this is just flavor text  so don't worry about that other than that it should be a beginner friendly series.

This is my first time writing `CODING TUTORIAL BLOG` so forgive me if it's not very polished;

---

Now what is SDL? SDL being shorthand for Simple DirectMedia Layer, It's a abstraction layer for graphics development and make code for annoying things such as input processing, window opening and stuff like that easier. You won't belive how annoying it is to manually make window on windows and linux and mac. Lifesaver abstraction layers i tell you. Tho if you are interested in even more low level check out `Homemade Hero` series, one of the GOATs.

Anyways enough talk let's go back to code.

We will try to follow OOP as much as possible,(will help me get grasp of them better and I like them. Makes me feel more professional and pro than I am.)

First see how the file tree looks like.

```
├── CONCEPT.md
├── LICENSE
├── Makefile
├── build
├── headers
│   └── Graphics.h
└── src
    ├── Graphics.cpp
    └── Main.cpp
```

You can get similar output by using `tree` command on GNU/Linux systems.

So starting of with Main.cpp:

*Main.cpp*
```C++
/*
 * Main.cpp
 * Then entry point of the program
 */

auto main(int argc, char *argv[]) -> int {

	while (true) {
    }
    return 0;
}
```
SDL expects the main function to have these two (int, char*[]), parameter for compatibility so be sure to add that. Incase you don't know what that is, I will recommend you to revisit you C++ fundamentals.

Here we are just making an infinite loop so our program doesn't end.

So for us to display something in our program we will need to have a window and a renderer to draw stuff.

Let's get on with the graphics class.


*Graphics.h*
```C++
#ifndef GRAPHICS_H_
#define GRAPHICS_H_

struct SDL_Window;
struct SDL_Renderer;

class Graphics {
public:
	Graphics();
	~Graphics();
private:
    SDL_Window* _window;
    SDL_Renderer* _renderer;
};

#endif // GRAPHICS_H_
```

Standard header gaurd, then we have `SDL_Window` and `SDL_Renderer` both being forward declared.

We are doing so as we will try to minimize including other header in our header file as much as possible as that leads to complications which makes removing such dependency a headache.

We then declare the graphics class, have a constructor and destructor, two private variables of type `SDL_Window` and `SDL_Renderer`. We will use this convention of putting `_` infornt of variables which are private as is the case with variables `_window` and `_renderer`.

And that is it for Graphics.h for this episode.

Now that stuff have been declared it's time for defination so open

*Graphics.cpp*
```C++
#include <SDL2/SDL.h>

#include "../headers/Graphics.h"

/*
 * Graphics class
 * Holds all information dealing with graphics for the game
*/

Graphics::Graphics()
{
    SDL_CreateWindowAndRenderer(640,480,0,&this->_window,&this->_renderer);
    SDL_SetWindowTitle(this->_window, "Scathach");
}

Graphics::~Graphics()
{
	SDL_DestroyRenderer(this->_renderer);
    SDL_DestroyWindow(this->_window);
}
```
Now here we include the SDL2 header file. as well as our Graphics class declaration file.

Next implementation fo the constructor `Graphics::Graphics()`. We do two things in this method.

Use the function `SDL_CreateWindowAndRenderer()` to register the window.
It's parameter list is -> width, height, window_flags(used to modify the behaviour of window.), pointer to window, pointer to renderer.

After that we set the title of our window, it's generally the text on the top bar of window.

Here we name the window to be what the name of our game is Scathach.

After that we write our destructor. Which takes the pointer of thing they destroy and well destroy them. Name is descriptive enough.

Tbh you can just not do that destruction as windows generally live as long as the game will live for us and OS clean up will be faster anyways. But since we are trying to follow "Good practice" we will clean up our own mess.

Now that we have Graphics class implementation done, we will call it in Main.cpp to initialize it.

*Main.cpp*
```C++
.
.
auto main(int argc, char *argv[]) -> int {

	Graphics graphics;
	while (true) {
.
.
```

Initializing graphics of Type Graphics;

---

Now one can't run their program without a compiling it so we will do that next.

Let's write our Makefile.
*Makefile*
```bash
.DEFAULT_GOAL := run

CC = clang++
CFLAGS = -Wall -Wextra -std=c++20

scathach:
	$(CC) $(CFLAGS) src/Main.cpp src/Graphics.cpp $$(pkg-config --cflags --libs sdl2) -o build/scathach

run: scathach
	./build/scathach

clean:
	rm ./build/* *.o
```

Default goal will compile and run our program. The compiler we are using is clang. We are using pkg-config to find the library files. We are using C++20 as it has some convenient functions which I like, Some standard warning flags and that is about it for our makefile. Cool.

run it by typing `make` in the terminal. It should open a window of size 640X480 and should be just a black screen.

You will be unable to close the window as we are not handeling the input so you have two ways to close it right now. Either close the terminal which launched the window or send `SIGKILL` signal to it.

can do that like this
```bash

pgrep -af scathach

---> this should give you PID as output the use it.

kill -9 <PID>

```

Actually no, lemme show you how you can have a rough event handling.
So you can actually close the program nicely.

instead of current while loop in Main.cpp write this


*Main.cpp*
```C++
    SDL_Event e{};
    bool quit = false;

    while (quit == false) {
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_QUIT) {
                quit = true;
            }
        }
    }
```
SDL_Event is a union of all event structures used in SDL. It is used to read event or write events from/in event queue.

It's a pretty important structure in SDL.

Here we have nested while loop. Where the outer loop is the main `Game Loop` and the inner loop is event proccessing loop. It reads event from the event loop and if there is something to read it returns 1 otherwise 0.

We then check what type of event we just read, if it is SDL_QUIT event then we turn `quit = true` hence existing the outer loop and closing our program.

---

That should be fine enough for first episode. If you encounter any difficulty then drop a comment in giscus below or contact me on my socials.

---

