import { MemoryAllocator } from "../utilities/MemoryAllocator";

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

export const AUDIO_QUEUE_SIZE = 2;
export const SOUND_CLEAR = 0;
export const SOUND_BLIP = 1;
export const SOUND_HIT = 2;

export const memoryAllocator = new MemoryAllocator(Number.POSITIVE_INFINITY);

const lockOffset = memoryAllocator.allocate(Int32Array.BYTES_PER_ELEMENT * 1);
export const getLock = ((state) => new Int32Array(state, lockOffset, 1));
const ballPosOffset = memoryAllocator.allocate(Float32Array.BYTES_PER_ELEMENT * 2);
export const getBallPos = ((state) => new Float32Array(state, ballPosOffset, 2));
const ballVelOffset = memoryAllocator.allocate(Float32Array.BYTES_PER_ELEMENT * 2);
export const getBallVel = ((state) => new Float32Array(state, ballVelOffset, 2));
const paddleOffset = memoryAllocator.allocate(Float32Array.BYTES_PER_ELEMENT * 1);
export const getPaddlePos = ((state) => new Float32Array(state, paddleOffset, 1));
const inputOffset = memoryAllocator.allocate(Uint8Array.BYTES_PER_ELEMENT * 1);
export const getInput = ((state) => new Uint8Array(state, inputOffset, 1));
const audioIndexOffset = memoryAllocator.allocate(Uint8Array.BYTES_PER_ELEMENT * 1);
export const getAudioIndex = ((state) => new Uint8Array(state, audioIndexOffset, 1));
const audioQueueOffset = memoryAllocator.allocate(Uint8Array.BYTES_PER_ELEMENT * AUDIO_QUEUE_SIZE);
export const getAudioQueue = ((state) => new Uint8Array(state, audioQueueOffset, AUDIO_QUEUE_SIZE));

export const STATE_SIZE = memoryAllocator.freeOffset + (8 - (memoryAllocator.freeOffset % 8));
export const STATE_NUM = 2;
