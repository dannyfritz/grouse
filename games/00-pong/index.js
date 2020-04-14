import { autoDetectRenderer, Container, Circle, Graphics, Rectangle } from "pixi.js";
import { LoopIndependent as Loop } from "../utilities/LoopIndependent";
import { MemoryAllocator } from "../utilities/MemoryAllocator";
import { StateManager } from "../utilities/StateManager";
import { Keyboard } from "../utilities/Keyboard";

const STATE_SIZE = 1024;
const PADDLE_HEIGHT = 60;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 100;
const BALL_SIZE = 25;

const stateManager = new StateManager(STATE_SIZE, 2);
const memoryAllocator = new MemoryAllocator(STATE_SIZE);

const ballPosOffset = memoryAllocator.allocate(2 * Float64Array.BYTES_PER_ELEMENT);
const getBallPos = ((state) => new Float64Array(state, ballPosOffset, 2));
const ballVelOffset = memoryAllocator.allocate(2 * Float64Array.BYTES_PER_ELEMENT);
const getBallVel = ((state) => new Float64Array(state, ballVelOffset, 2));
const paddleOffset = memoryAllocator.allocate(1 * Float64Array.BYTES_PER_ELEMENT);
const getPaddlePos = ((state) => new Float64Array(state, paddleOffset, 1));
const inputOffset = memoryAllocator.allocate(1 * Uint8Array.BYTES_PER_ELEMENT);
const getInput = ((state) => new Uint8Array(state, inputOffset, 2));

const initializeState = (state) => {
  const ballPos = getBallPos(state);
  ballPos[0] = 20;
  ballPos[1] = 150;
  const ballVel = getBallVel(state);
  ballVel[0] = 0; //Math.random() * 100;
  ballVel[1] = 0; //(Math.random() - 0.5) * 100;
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
  if (input[0] & UP_MASK) {
    paddleSpeed -= PADDLE_SPEED;
  }
  if (input[0] & DOWN_MASK) {
    paddleSpeed += PADDLE_SPEED;
  }
  paddlePos[0] = Math.min(300 - PADDLE_HEIGHT, Math.max(0, paddlePos[0] + paddleSpeed * dt));
  // console.timeEnd("interpolate");
};

const keyboard = new Keyboard(document);
const UP_MASK   = 0b0000_0001;
const DOWN_MASK = 0b0000_0010;

const setInput = (state) => {
  let mask = 0;
  if (keyboard.isDown("ArrowUp")) {
    mask = mask | UP_MASK;
  }
  if (keyboard.isDown("ArrowDown")) {
    mask = mask | DOWN_MASK;
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
const circle = new Circle(0, 0, BALL_SIZE);
const rectangle = new Rectangle(10, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
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

setTimeout(() => {
  loop.run();
  loop.runRender();
  setTimeout(() => {
    loop.stop()
    console.log((loop.timer.getElapsed() / 1000).toFixed(2), "seconds");
    console.log(loop.stats);
    // console.log(getBallPos(stateManager.current))
  }, 5000);
}, 0);

