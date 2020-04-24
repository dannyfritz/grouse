import { MemoryAllocator } from "../utilities/MemoryAllocator";

export const STATE_SIZE = 24;

export const ARENA_HEIGHT = 300;
export const ARENA_WIDTH = 500;
export const BALL_SIZE = 5;
export const BALL_SPEED = 200;
export const PADDLE_HEIGHT = 60;
export const PADDLE_WIDTH = 10;
export const PADDLE_SPEED = 300;

/* eslint-disable no-multi-spaces */
export const UP_MASK   = 0b0000_0001;
export const DOWN_MASK = 0b0000_0010;
/* eslint-enable no-multi-spaces */

export const memoryAllocator = new MemoryAllocator(24);
console.log(`2 x ${STATE_SIZE} bytes used to store Pong's data`);

const ballPosOffset = memoryAllocator.allocate(2 * Float32Array.BYTES_PER_ELEMENT);
export const getBallPos = ((state) => new Float32Array(state, ballPosOffset, 2));
const ballVelOffset = memoryAllocator.allocate(2 * Float32Array.BYTES_PER_ELEMENT);
export const getBallVel = ((state) => new Float32Array(state, ballVelOffset, 2));
const paddleOffset = memoryAllocator.allocate(1 * Float32Array.BYTES_PER_ELEMENT);
export const getPaddlePos = ((state) => new Float32Array(state, paddleOffset, 1));
const inputOffset = memoryAllocator.allocate(1 * Uint8Array.BYTES_PER_ELEMENT);
export const getInput = ((state) => new Uint8Array(state, inputOffset, 1));