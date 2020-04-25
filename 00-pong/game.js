import { StateManager } from "../utilities/StateManager";
import { STATE_SIZE, STATE_NUM, INPUT_EVENT, RENDER_EVENT, getInput, getAudioQueue, SOUND_CLEAR } from "./constants";
import { initializeState, interpolate } from "./interpolate";

export const stateManager = new StateManager(STATE_SIZE, STATE_NUM);
console.log(`${STATE_NUM + 1} x ${STATE_SIZE} = ${(STATE_NUM + 1) * STATE_SIZE} bytes used to store Pong's data`);

initializeState(stateManager.next);
stateManager.commit();

const targetFps = 120;
const targetDt = 1000 / targetFps;
const targetDtSeconds = targetDt / 1000;
let lastTick = performance.now();
// eslint-disable-next-line no-unused-vars
let ticks = 0;
// eslint-disable-next-line no-unused-vars
let loops = 0;
const loop = () => {
  const now = performance.now();
  loops += 1;
  while ((now - lastTick) >= targetDt) {
    ticks += 1;
    lastTick += targetDt;
    interpolate(targetDtSeconds, stateManager.current, stateManager.next);
    stateManager.commit();
  }
};

setInterval(loop, 0);
postMessage(stateManager.render);

onmessage = (event) => {
  switch (event?.data?.type) {
    case RENDER_EVENT:
    {
      stateManager.prepareRender();
      const now = performance.now();
      interpolate((now - lastTick) / 1000, stateManager.current, stateManager.render);
      const audioQueue = getAudioQueue(stateManager.next);
      for (let i = 0; i < audioQueue.length; i += 1) {
        Atomics.store(audioQueue, i, SOUND_CLEAR);
      }
      break;
    }
    case INPUT_EVENT:
    {
      const { input } = event.data;
      getInput(stateManager.next)[0] = input;
      break;
    }
    default:
      throw new Error(`Unrecognized event: ${event.data.type}`);
  }
};
