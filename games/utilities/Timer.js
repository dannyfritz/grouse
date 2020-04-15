export class Timer {
  constructor(hertz) {
    this.begin = performance.now();
    this.tickFreq = 1000 / hertz;
    this.previousTime = performance.now();
    this.tick();
  }
  tick() {
    const leftOver = this.tickFreq - this.getDt();
    if (leftOver > 0) {
      return false;
    }
    this.previousTime = performance.now() - leftOver;
    return true;
  }
  getDt() {
    return performance.now() - this.previousTime;
  }
  getElapsed() {
    return performance.now() - this.begin;
  }
}
