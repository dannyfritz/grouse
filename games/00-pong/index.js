import { Application, Circle, Graphics, Rectangle } from "pixi.js";
import SAT from "sat";
import { Howl, Howler } from 'howler';
import { MemoryAllocator } from "../utilities/MemoryAllocator";
import { StateManager } from "../utilities/StateManager";
import { Keyboard } from "../utilities/Keyboard";
import blipSoundAsset from "./blip.wav";
import hitSoundAsset from "./hit.wav";

const blipSound = new Howl({
  src: [blipSoundAsset],
  volume: 0.1,
});
const hitSound = new Howl({
  src: [hitSoundAsset],
  volume: 0.2,
})

const PADDLE_HEIGHT = 60;
const PADDLE_WIDTH = 10;
const PADDLE_SPEED = 300;
const BALL_SIZE = 5;
const BALL_SPEED = 200;
const ARENA_HEIGHT = 300;
const ARENA_WIDTH = 500;

const application = new Application({
  width: ARENA_WIDTH,
  height: ARENA_HEIGHT,
});

const memoryAllocator = new MemoryAllocator(STATE_SIZE);

const ballPosOffset = memoryAllocator.allocate(2 * Float32Array.BYTES_PER_ELEMENT);
const getBallPos = ((state) => new Float32Array(state, ballPosOffset, 2));
const ballVelOffset = memoryAllocator.allocate(2 * Float32Array.BYTES_PER_ELEMENT);
const getBallVel = ((state) => new Float32Array(state, ballVelOffset, 2));
const paddleOffset = memoryAllocator.allocate(1 * Float32Array.BYTES_PER_ELEMENT);
const getPaddlePos = ((state) => new Float32Array(state, paddleOffset, 1));
const inputOffset = memoryAllocator.allocate(1 * Uint8Array.BYTES_PER_ELEMENT);
const getInput = ((state) => new Uint8Array(state, inputOffset, 1));

const STATE_SIZE = memoryAllocator.freeOffset + (4 - (memoryAllocator.freeOffset % 4));
console.log(`${STATE_SIZE} * 2 bytes used to store Pong's data`);
const stateManager = new StateManager(STATE_SIZE, 2);

const initializeState = (state) => {
  const ballPos = getBallPos(state);
  ballPos[0] = 100;
  ballPos[1] = 150;
  const ballVel = getBallVel(state);
  const ballVelV = new SAT.Vector(Math.random(), Math.random() - 0.5).normalize();
  ballVel[0] = ballVelV.x * BALL_SPEED;
  ballVel[1] = ballVelV.y * BALL_SPEED;
  const paddlePos = getPaddlePos(state);
  paddlePos[0] = 150;
  const input = getInput(state);
  input[0] = 0b0000_0000;
};

initializeState(stateManager.next);
stateManager.commit();

const response = new SAT.Response();
const ballShape = new SAT.Circle(new SAT.Vector(0, 0), BALL_SIZE);
const paddle1Shape = new SAT.Box(new SAT.Vector(10, 0), PADDLE_WIDTH, PADDLE_HEIGHT);

const interpolate = (dt, currentState, nextState) => {
  const ballPos = getBallPos(nextState);
  const ballVel = getBallVel(nextState);
  {
    ballPos[0] += ballVel[0] * dt;
    ballPos[1] += ballVel[1] * dt;
    if (ballPos[1] - BALL_SIZE < 0) {
      ballVel[1] *= -1;
      ballPos[1] += BALL_SIZE - ballPos[1];
      blipSound.play();
    } else if (ballPos[1] + BALL_SIZE > ARENA_HEIGHT) {
      ballVel[1] *= -1;
      ballPos[1] -= (ballPos[1] + BALL_SIZE) - ARENA_HEIGHT;
      blipSound.play();
    }
    if (ballPos[0] - BALL_SIZE < 0) {
      ballVel[0] *= -1;
      ballPos[0] += BALL_SIZE - ballPos[0];
      hitSound.play();
    } else if (ballPos[0] + BALL_SIZE > ARENA_WIDTH) {
      ballVel[0] *= -1;
      ballPos[0] -= (ballPos[0] + BALL_SIZE) - ARENA_WIDTH;
      blipSound.play();
    }
  }
  const paddlePos = getPaddlePos(nextState);
  const input = getInput(currentState);
  {
    let paddleSpeed = 0;
    if (input[0] & UP_MASK) {
      paddleSpeed -= PADDLE_SPEED;
    }
    if (input[0] & DOWN_MASK) {
      paddleSpeed += PADDLE_SPEED;
    }
    paddlePos[0] = Math.min(300 - PADDLE_HEIGHT, Math.max(0, paddlePos[0] + paddleSpeed * dt));
  }
  ballShape.pos.x = ballPos[0];
  ballShape.pos.y = ballPos[1];
  paddle1Shape.pos.y = paddlePos[0];
  if (SAT.testCirclePolygon(ballShape, paddle1Shape.toPolygon(), response)) {
    ballVel[0] *= -1
    ballPos[0] -= response.overlapV.x * 2;
    ballPos[1] -= response.overlapV.y * 2;
    blipSound.play();
  }
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

document.body.appendChild(application.view);
const circle = new Circle(0, 0, BALL_SIZE);
const rectangle = new Rectangle(10, 0, PADDLE_WIDTH, PADDLE_HEIGHT);
const graphics = new Graphics();
application.stage.addChild(graphics);

const render = (dt) => {
  const ballPos = getBallPos(stateManager.last);
  circle.x = ballPos[0];
  circle.y = ballPos[1];
  const paddlePos = getPaddlePos(stateManager.last);
  rectangle.y = paddlePos[0];
  graphics.clear();
  graphics.beginFill(0xFFFFFF);
  graphics.drawShape(circle);
  graphics.drawShape(rectangle);
  graphics.endFill();
};

application.ticker.add((dt) => {
  const dtSeconds = application.ticker.elapsedMS / 1000;
  update(dtSeconds);
  render(dtSeconds);
});
