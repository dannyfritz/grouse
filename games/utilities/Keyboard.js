export const KEY_STATUS = {
  UP: 0,
  PRESSED: 1,
  DOWN: 2,
  RELEASED: 3,
};

export class Keyboard {
  constructor(target) {
    this.keyStatuses = [];
    this.onKeyDownBound = (e) => this.onKeyDown(e);
    this.onKeyUpBound = (e) => this.onKeyUp(e);
    target.addEventListener("keydown", this.onKeyDownBound);
    target.addEventListener("keyup", this.onKeyUpBound);
  }
  onKeyDown(e) {
    if (e.repeat) {
      return;
    }
    this.keyStatuses[e.code] = KEY_STATUS.PRESSED;
  }
  onKeyUp(e) {
    this.keyStatuses[e.code] = KEY_STATUS.RELEASED;
  }
  update() {
    for (const key in this.keyStatuses) {
      if (this.keyStatuses[key] === KEY_STATUS.PRESSED) {
        this.keyStatuses[key] = KEY_STATUS.DOWN;
      } else if (this.keyStatuses[key] === KEY_STATUS.RELEASED) {
        this.keyStatuses[key] = KEY_STATUS.UP;
      }
    }
  }
  isPressed(code) {
    return this.keyStatuses[code] === KEY_STATUS.PRESSED;
  }
  isReleased(code) {
    return this.keyStatuses[code] === KEY_STATUS.RELEASED;
  }
  isDown(code) {
    return this.keyStatuses[code] === KEY_STATUS.DOWN
      || this.keyStatuses[code] === KEY_STATUS.PRESSED;
  }
  isUp(code) {
    return this.keyStatuses[code] === KEY_STATUS.UP
      || this.keyStatuses === KEY_STATUS.RELEASED
      || !this.keyStatuses[code];
  }
}
