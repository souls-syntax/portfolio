---
title: me-thinks, Episode - 0 : Is AI gonna kill the SWE ?
date: 2026-05-25
tags: [programming, ai, me-thinks]
series: tsundere
---

# The Spark Problem

AI might freeze the foundations of tech. Worse, it might stop producing the kind of people who would ever question them.

Mathematicians have been having a version of this argument about AI, and I think their worry carries over to software. It doesn't map one to one (at this point it's barely engineering anymore), but the underlying question is the same: what happens to the progression of perspective?

**Two definitions**

By problems I don't mean product problems. I mean things like a slow OS, cache issues, no elegant way to do something (better CSS), a language that's more expressive and faster, a better implementation of an idea.

By brute force I don't mean inefficient. I mean grinding away inside one perspective when the perspective is the actual problem.

Take a spiral that grows forever. In Cartesian coordinates it's ugly: you can't even write it as y = f(x), and the parametric version is x and y tangled up in sines and cosines. You can keep patching approximations forever. Switch to polar and it's r = aθ. One line. The answer didn't get smarter, the frame changed.

Memory safety went the same way. "Manual control with safety" was a mess in the old frame, and Rust's ownership isn't a better pointer, it's a different coordinate system. That's what I mean by a perspective. Elegant isn't "short," it's "you picked the frame where the problem is simple."

**No friction, no new ideas**

Problems used to force new things into existence: better ways, different perspectives. AI is many things, but it's not elegant, and it's not a discoverer of new perspectives. You throw compute at a problem and a solution arrives. That's great for speed, but there's no buzz in it. If today's AI had arrived in 2010, Rust probably wouldn't exist, and neither would a lot of other things.

If LLMs can brute force any solution, people stop running into problems, and elegant ideas stop being needed. Software slowly settles onto the basic tools we have now and just keeps using them. We may never even feel the limit of the current perspective, because the AI absorbs it. With plain Spring, the friction is what eventually produces something like Spring Boot. If the friction never reaches a human, we just stay on Spring.

It also weakens collaboration. Novel ideas spread because of buzz: one discovery excites people, that excitement produces the next discovery, and so on. I think AI kills that loop too. Nobody reads something deeply, thinks "oh, so that's how they did it," and rebuilds it in a neat 50 lines. They hand it to an LLM, which understands it, reproduces it with whatever is already established, and ships it. We never get those 50 lines, the ones that would have been revolutionary and pulled even more people into that perspective.

**No spite, no new foundations**

Spite is one of the best motives ever. Somewhere there's a person who would have been so annoyed at the modern OS that he'd go build a super divine one. Except he never got annoyed, because an LLM smoothed over everything.

And to get annoyed at a design, you have to touch it. Most people now work on "I have this idea, implement it" and go yolo. Maybe the AI is annoyed at its own architecture, who knows, but you certainly aren't, because you never see it. And it will keep getting better, the way image generation went from a thousand-word description to one sentence.

With AI architecture as it is right now, new perspectives probably aren't coming from the machine either. So we climb so high in abstraction that current tech just freezes. That might not even be that bad, but we'll lose some amazing things.

Maybe SI gets good enough to generate new perspectives itself. Unlikely, since we've never seen it. The more likely version is that SI becomes so woven into society that we only notice later. Life is easy, everything works, and if you look even slightly underneath, it's all the same as it was in 2026. That's what AI taking over actually looks like. Not the movies, where AI for some reason wants to kill humans, but a world that works so well that nothing ever changes.

**Hobby and paycheck**

The split will get obvious: people who do this for the love, and people who do it for the money. Nothing wrong with either. But it used to be nerds doing nerd things and getting paid for it. Now it goes back to nerds doing nerd things, with the paycheck coming from somewhere else. Doing things for the sake of things.

**Stuck is the point**

Here's the thing that ties all of this together: you rarely appreciate polar coordinates until you've suffered in Cartesian. The shift only looks like a breakthrough to someone who felt the old frame's limit with their own hands. If an LLM absorbs that pain, you never learn where the limit was, so you never learn a better frame could exist. New perspectives come from people who were stuck.

It's also why we can't predict the future. Imagination is stuck inside the frame of its time, and the real thing usually arrives from a different one. Now say AI can turn our dreams into reality with the tech we already have. Then we never need the new discovery. If they had built flying cars the moment they imagined them, we might never have gotten helicopters or bullet trains. If there had been a separate device for video calls, we might never have gotten smartphones. When imagination quickly becomes reality, we can explore just about every idea, but they all come from the same frame. We get more of the same kind of thing.

Which is why I care less about the tools freezing and more about who stops getting stuck.

**No new nerds**

This is the problem I've been trying to get at all along: new people in this very geeky community.

I didn't get in out of pure curiosity. Everyone told me there was money in it, and then I fell in love. Now imagine the person whose whole starting point is "build me a better YouTube, here's 200k." He'll never fall in love with C. He'll never defend C++ while admitting it's bloated. There's no version of him that hates Rust just because it's Rust, tries Zig, gets header file withdrawal, and crawls back to C to heal his trauma. He'll never start a game engine every other week and bin it after some progress because the shortcuts make him feel like a cheat.

Nerds didn't come out amazed at computers from birth. They saw something and got curious. I think the AI user loses that first ignition, the one that happened to me because I wanted to do something difficult and forced myself to love C out of spite. Hating Java, realising it's kinda good, then meeting Spring Boot and hating it even more. That person doesn't get built, because the next one may not even know whether code is 01, asm, Ruby or R.

"But LLMs can be tutors. They can even spark curiosity."

Lmao. That assumes I, or any engineer, even bothers to chat with it. I read maybe 10% of what it writes, the first bit, and move on. Agent mode is worse: you say "build that," go get coffee, come back to a few permission prompts, and yes yes yes, because you don't understand what it's asking, and carry on with your day. That's the problem.

I don't have a fix. I just know the spark has to come from somewhere, and I'd like the next person to still be able to hate Rust for no reason and love C out of spite.
