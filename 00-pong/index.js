import { render } from "./render";
import { getKeyboardInput } from "./controls";
import { audio } from "./audio";
import { INPUT_EVENT, RENDER_EVENT } from "./constants";

const game = new Worker("./game.js");

game.onmessage = (e) => {
  const state = e.data;
  const renderLoop = () => {
    game.postMessage({
      type: RENDER_EVENT,
    });
    render(state);
    audio(state);
    const input = getKeyboardInput();
    game.postMessage({
      type: INPUT_EVENT,
      input,
    });
    requestAnimationFrame(renderLoop);
  };
  requestAnimationFrame(renderLoop);
};
