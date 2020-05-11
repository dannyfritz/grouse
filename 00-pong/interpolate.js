import SAT from "sat";
import {
  getScores,
  getBallPos, getBallVel,
  getPaddlePos,
  getInput,
  getAudioIndex, getAudioQueue, SOUND_BLIP, SOUND_HIT,
  UP_MASK, DOWN_MASK,
  ARENA_WIDTH, ARENA_HEIGHT,
  BALL_SIZE, BALL_SPEED,
  PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_SPEED, AUDIO_QUEUE_SIZE,
} from "./constants";

export const initializeState = (state) => {
  const scores = getScores(state);
  scores[0] = 0;
  scores[1] = 0;
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
  const scores = getScores(nextState);
  const audioIndex = getAudioIndex(nextState);
  const audioQueue = getAudioQueue(nextState);
  const ballPos = getBallPos(nextState);
  const ballVel = getBallVel(nextState);
  {
    ballPos[0] += ballVel[0] * dt;
    ballPos[1] += ballVel[1] * dt;
    if (ballPos[1] - BALL_SIZE < 0) {
      ballVel[1] *= -1;
      ballPos[1] += BALL_SIZE - ballPos[1];
      Atomics.store(audioQueue, audioIndex[0], SOUND_BLIP);
      Atomics.store(audioIndex, 0, (audioIndex[0] + 1) % AUDIO_QUEUE_SIZE);
    } else if (ballPos[1] + BALL_SIZE > ARENA_HEIGHT) {
      ballVel[1] *= -1;
      ballPos[1] -= (ballPos[1] + BALL_SIZE) - ARENA_HEIGHT;
      Atomics.store(audioQueue, audioIndex[0], SOUND_BLIP);
      Atomics.store(audioIndex, 0, (audioIndex[0] + 1) % AUDIO_QUEUE_SIZE);
    }
    if (ballPos[0] - BALL_SIZE < 0) {
      ballVel[0] *= -1;
      ballPos[0] += BALL_SIZE - ballPos[0];
      Atomics.store(audioQueue, audioIndex[0], SOUND_HIT);
      Atomics.store(audioIndex, 0, (audioIndex[0] + 1) % AUDIO_QUEUE_SIZE);
      scores[1] += 1;
    } else if (ballPos[0] + BALL_SIZE > ARENA_WIDTH) {
      ballVel[0] *= -1;
      ballPos[0] -= (ballPos[0] + BALL_SIZE) - ARENA_WIDTH;
      Atomics.store(audioQueue, audioIndex[0], SOUND_BLIP);
      Atomics.store(audioIndex, 0, (audioIndex[0] + 1) % AUDIO_QUEUE_SIZE);
      scores[0] += 1;
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
    Atomics.store(audioQueue, audioIndex[0], SOUND_BLIP);
    Atomics.store(audioIndex, 0, (audioIndex[0] + 1) % AUDIO_QUEUE_SIZE);
  }
};
