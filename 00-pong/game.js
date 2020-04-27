import { StateManager } from "../utilities/StateManager";
import {
  STATE_SIZE, STATE_NUM,
  getLock,
  getInput,
  getAudioQueue, SOUND_CLEAR,
} from "./constants";
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

const lock = getLock(stateManager.render);
onmessage = (event) => {
  const { input } = event.data;
  getInput(stateManager.next)[0] = input;
  Atomics.wait(lock, 0, 0);
  const now = performance.now();
  stateManager.prepareRender();
  const audioQueue = getAudioQueue(stateManager.next);
  for (let i = 0; i < audioQueue.length; i += 1) {
    audioQueue[i] = SOUND_CLEAR;
  }
  interpolate((now - lastTick) / 1000, stateManager.current, stateManager.render);
  Atomics.store(lock, 0, 0);
  Atomics.notify(lock, 0);
};
