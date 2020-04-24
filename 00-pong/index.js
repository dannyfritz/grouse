import { render } from "./render";
import { getKeyboardInput } from "./controls";
import { drainAudioQueue } from "./audio";

const game = new Worker("./game.js");

game.onmessage = (e) => {
  const state = e.data;
  let lastTick = performance.now();
  const renderLoop = (now) => {
    const dt = now - lastTick;
    lastTick = now;
    game.postMessage(dt);
    render(state);
    drainAudioQueue(state);
    requestAnimationFrame(renderLoop);
    getKeyboardInput();
  };
  requestAnimationFrame(renderLoop);
};
