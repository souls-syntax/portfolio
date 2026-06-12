---
title: Retarded take : Episode 0 : some languages are not real programming language
date: 2026-06-12
tags: [retarded, language]
series: tsundere
---

#### Warning: This retarded take series may contain uncouth words.

The way i see it most of the language floating around just don't have a purpose other than providing syntactic sugar, they exist purely to become someones eye-candy.
I call that language grooming. Making a language without any specific purpose just for the sole purpose of having a beautiful on asthetic sense.

I think right term is transpiling languages. one concrete example would be typescript. No perf increase, no change in behaviour just syntactic sugar.

Now one might say souls but doesn't that apply to your favourite language C/C++ too. To that I say nay, they don't have such blemish cause they are divine languages and even flaws are perfection upon them.

any such fake languages should just become a macro defined subset of C++. Brat correction of languages so to say.

Take lua for example, what is it if not a fake language.
you can literaly just write this

```C++
#ifndef MAIN_H
#define MAIN_H

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

#define local auto
#define nil nullptr
#define print(...) std::cout << __VA_ARGS__ << '\n'
#define input(x) std::cin >> x
#define number double
#define string std::string
#define boolean bool
#define table(T) std::vector<T>
#define newtable(T, n) std::vector<T>(n)
#define append(t, v) t.push_back(v)
#define size(t) (int)t.size()

#define if if (
#define then ) {
#define elseif } else if (
#define else } else {
#define end }

#define while while (
#define do ) {

#define begin int main() {
#define stop return 0; }

#endif
```

And there you go your favourite language becoming a submissive slave of C++.

### NOTICE: As name suggests this is a retarded take I don't really view these things in such way. You can think of this as me just ragebaiting you
