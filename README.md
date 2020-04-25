# Grouse Low-Level JavaScript Game Examples

Grouse is a collection of sample games and utilities to demonstrate low-level game development with only JavaScript. Many of the patterns used are less ergonomic for developers, but offer incredible time and memory benefits. The code and mental model required to write this way is closer to C than traditional JavaScript. Just the fact this type of code is possible on the web without WebAssembly is a testament to how far the web has come and how flexible JavaScript is.

## Game Roadmap

- [x] Pong
- [ ] Breakout
- [ ] Flappy Bird
- [ ] Bejeweled
- [ ] Angry Birds
- [ ] Peggle
- [ ] DOS Jump n Bump
- [ ] Atari Joust
- [ ] NES Hockey
- [ ] GB Pokemon Red/Blue
- [ ] NES Super Mario Bros.
- [ ] NES The Legend of Zelda
- [ ] SNES Mario Kart
- [ ] SNES Kirby Dream Course

## Guidelines

* Allocate your memory up-front and work within that region.
* Store everything in `TypedArrays` with a `SharedArrayBuffers`.
* Use `Bitwise Ops` to store booleans in an `Int8`.
* Avoid using `Objects` because they cannot be passed between threads.
  * If you do use `Objects` within your interpolation, keep them around as singletons to avoid creating new ones.
* Rely on `requestAnimationFrame` for rendering and `setTimeout(..., 0)` for fixed updates.

## Patterns and Ideas Used

* A [linear memory model](https://en.wikipedia.org/wiki/Region-based_memory_management) with access to arrays of Int, UInt, BigInt, and Float
* A [Ring Buffer](https://en.wikipedia.org/wiki/Circular_buffer) for storing your game states
* Small memory footprint with very performant copying of entire gamestates
* Variable render and fixed update [gameloop](https://www.gafferongames.com/post/fix_your_timestep/)
* Game logic computed [in parallel](https://dassur.ma/things/when-workers/)

## Development

`yarn` or `npm install`
`yarn start:pong` or `npm run start:pong`
Point your browser to [http://localhost:1234/](http://localhost:1234/)

## Platform Features Required

* [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
* [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
* [TypedArrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays#Buffers_and_views_typed_array_architecture)
* [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker)
* [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
* [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
