import SAT from "sat";
import {
  getBallPos, getBallVel,
  getPaddlePos,
  getInput,
  UP_MASK, DOWN_MASK,
  ARENA_WIDTH, ARENA_HEIGHT,
  BALL_SIZE, BALL_SPEED,
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED,
} from "./constants";

export const initializeState = (state) => {
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

const response = new SAT.Response();
const ballShape = new SAT.Circle(new SAT.Vector(0, 0), BALL_SIZE);
const paddle1Shape = new SAT.Box(new SAT.Vector(10, 0), PADDLE_WIDTH, PADDLE_HEIGHT);

export const interpolate = (dt, currentState, nextState) => {
  // TODO: Atomics on nextState and currentState
  const ballPos = getBallPos(nextState);
  const ballVel = getBallVel(nextState);
  {
    ballPos[0] += ballVel[0] * dt;
    ballPos[1] += ballVel[1] * dt;
    if (ballPos[1] - BALL_SIZE < 0) {
      ballVel[1] *= -1;
      ballPos[1] += BALL_SIZE - ballPos[1];
      // blipSound.play();
    } else if (ballPos[1] + BALL_SIZE > ARENA_HEIGHT) {
      ballVel[1] *= -1;
      ballPos[1] -= (ballPos[1] + BALL_SIZE) - ARENA_HEIGHT;
      // blipSound.play();
    }
    if (ballPos[0] - BALL_SIZE < 0) {
      ballVel[0] *= -1;
      ballPos[0] += BALL_SIZE - ballPos[0];
      // hitSound.play();
    } else if (ballPos[0] + BALL_SIZE > ARENA_WIDTH) {
      ballVel[0] *= -1;
      ballPos[0] -= (ballPos[0] + BALL_SIZE) - ARENA_WIDTH;
      // blipSound.play();
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
  [ballShape.pos.x, ballShape.pos.y] = ballPos;
  [paddle1Shape.pos.y] = paddlePos;
  if (SAT.testCirclePolygon(ballShape, paddle1Shape.toPolygon(), response)) {
    ballVel[0] *= -1;
    ballPos[0] -= response.overlapV.x * 2;
    ballPos[1] -= response.overlapV.y * 2;
    // blipSound.play();
  }
};
