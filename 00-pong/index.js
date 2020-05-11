import "../utilities/asyncWait.polyfill";
import { render } from "./render";
import { getKeyboardInput } from "./controls";
import { audio } from "./audio";
import { getLock } from "./constants";

const game = new Worker("./game.js");

game.onmessage = (e) => {
  const state = e.data;
  const lock = getLock(state);
  const renderLoop = async () => {
    const input = getKeyboardInput();
    Atomics.store(lock, 0, 1);
    game.postMessage({
      input,
    });
    await Atomics.waitAsync(lock, 0, 1);
    render(state);
    audio(state);
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);
};
