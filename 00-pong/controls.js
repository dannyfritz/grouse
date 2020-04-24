import { Keyboard } from "../utilities/Keyboard";
import {
  UP_MASK, DOWN_MASK,
} from "./constants";

const keyboard = new Keyboard(document);

export const getKeyboardInput = () => {
  keyboard.update();
  let input = 0b000_0000;
  if (keyboard.isDown("ArrowUp")) input |= UP_MASK;
  if (keyboard.isDown("ArrowDown")) input |= DOWN_MASK;
  return input;
};
