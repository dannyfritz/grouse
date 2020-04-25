import { render } from "./render";
import { getKeyboardInput } from "./controls";
import { audio } from "./audio";

const game = new Worker("./game.js");

game.onmessage = (e) => {
  const state = e.data;
  const renderLoop = () => {
    const input = getKeyboardInput();
    game.postMessage({
      input,
    });
    render(state);
    audio(state);
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);
};
