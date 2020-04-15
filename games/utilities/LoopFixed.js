import { Timer } from "./Timer";

export class LoopFixed {
  constructor(update, render, updateHertz = 30) {
    this.userUpdate = update;
    this.userRender = render;
    this.timer = new Timer(updateHertz);
    this.stats = {
      updates: 0,
      renders: 0,
    };
    this.updateDt = 1000 / updateHertz;
    this.updateDtSeconds = 1 / updateHertz;
    this.runBound = () => this.run();
  }
  run() {
    if (!this.timer.tick()) {
      setTimeout(this.runBound, this.updateDt - this.timer.getDt());
      return;
    }
    this.render();
    this.update();
    setTimeout(this.runBound, this.updateDt - this.timer.getDt());
  }
  update() {
    // this.stats.updates += 1;
    this.userUpdate(this.updateDtSeconds);
  }
  render() {
    // this.stats.renders += 1;
    this.userRender(this.timer.getDt() / 1000);
  }
  stop() {
    this.run = () => {};
  }
}
