import { LoopIndependent as Loop } from "../utilities/LoopIndependent";
import { autoDetectRenderer, Container, Circle, Graphics, Rectangle } from "pixi.js";
import { StateManager } from "../utilities/StateManager";
import { Keyboard } from "../utilities/Keyboard";

const STATE_SIZE = 1024;
const PADDLE_HEIGHT = 60;
const PADDLE_SPEED = 100;

const stateManager = new StateManager(STATE_SIZE, 2);

const getBallPos = ((state) => new Float64Array(state, 0, 2));
const getBallVel = ((state) => new Float64Array(state, 2 * Float64Array.BYTES_PER_ELEMENT, 2));
const getPaddlePos = ((state) => new Float64Array(state, 4 * Float64Array.BYTES_PER_ELEMENT, 1));
const getInput = ((state) => new Uint8Array(state, 5 * Float64Array.BYTES_PER_ELEMENT, 2));

const initializeState = (state) => {
  const ballPos = getBallPos(state);
  ballPos[0] = 20;
  ballPos[1] = 150;
  const ballVel = getBallVel(state);
  ballVel[0] = 101;
  ballVel[1] = 0;
  const paddlePos = getPaddlePos(state);
  paddlePos[0] = 150;
  const input = getInput(state);
  input[0] = 0b0000_0001;
};

initializeState(stateManager.next);
stateManager.commit();

const interpolate = (dt, currentState, nextState) => {
  // console.time("interpolate");
  const ballPos = getBallPos(nextState);
  const ballVel = getBallVel(currentState);
  ballPos[0] += ballVel[0] * dt;
  ballPos[1] += ballVel[1] * dt;
  const paddlePos = getPaddlePos(nextState);
  const input = getInput(currentState);
  let paddleSpeed = 0;
  if (input[0] & UP) {
    paddleSpeed -= PADDLE_SPEED;
  }
  if (input[0] & DOWN) {
    paddleSpeed += PADDLE_SPEED;
  }
  paddlePos[0] = Math.min(300 - PADDLE_HEIGHT, Math.max(0, paddlePos[0] + paddleSpeed * dt));
  // console.timeEnd("interpolate");
};

const keyboard = new Keyboard(document);
const UP   = 0b0000_0001;
const DOWN = 0b0000_0010;

const setInput = (state) => {
  let mask = 0;
  if (keyboard.isDown("ArrowUp")) {
    mask = mask | UP;
  }
  if (keyboard.isDown("ArrowDown")) {
    mask = mask | DOWN;
  }
  const input = getInput(state);
  input[0] = mask;
}

const update = (dt) => {
  interpolate(dt, stateManager.current, stateManager.next);
  setInput(stateManager.next);
  keyboard.update();
  stateManager.commit();
};

const renderer = autoDetectRenderer({
  width: 500,
  height: 300,
});
const stage = new Container();
const circle = new Circle(0, 0, 5);
const rectangle = new Rectangle(10, 0, 10, PADDLE_HEIGHT);
const graphics = new Graphics();
document.body.appendChild(renderer.view);
stage.addChild(graphics);

const render = (dt) => {
  // console.log(dt);
  // console.time("render");
  stateManager.prepareTemp();
  interpolate(dt, stateManager.current, stateManager.temp);
  const ballPos = getBallPos(stateManager.temp);
  circle.x = ballPos[0];
  circle.y = ballPos[1];
  const paddlePos = getPaddlePos(stateManager.temp);
  rectangle.y = paddlePos[0];
  graphics.clear();
  graphics.beginFill(0xFFFFFF);
  graphics.drawShape(circle);
  graphics.drawShape(rectangle);
  graphics.endFill();
  renderer.clear();
  renderer.render(stage);
  // console.timeEnd("render");
};

const loop = new Loop(update, render, 120);

loop.run();
loop.runRender();

setTimeout(() => {
  loop.stop()
  console.log((loop.timer.getElapsed() / 1000).toFixed(2), "seconds");
  console.log(loop.stats);
  // console.log(getBallPos(stateManager.current))
}, 4000);
