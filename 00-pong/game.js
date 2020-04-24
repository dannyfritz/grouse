import { StateManager } from "../utilities/StateManager";
import { STATE_SIZE } from "./constants";
import { initializeState, interpolate } from "./interpolate";

export const stateManager = new StateManager(STATE_SIZE, 3);

initializeState(stateManager.next);
stateManager.commit();

const targetFps = 240;
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
  stateManager.prepareRender();
  interpolate(event.data / 1000, stateManager.current, stateManager.render);
};
