import { Timer } from "./Timer";

export class LoopIndependent {
  constructor(update, render, updateHertz = 120) {
    this.userUpdate = update;
    this.userRender = render;
    this.lastRender = performance.now();
    this.timer = new Timer(updateHertz);
    this.stats = {
      updates: 0,
      renders: 0,
    };
    this.updateDt = 1000 / updateHertz;
    this.updateDtSeconds = 1 / updateHertz;
    this.runBound = () => this.run();
    this.renderBound = () => this.render();
    this.refId = null;
  }
  run() {
    if (!this.timer.tick()) {
      setTimeout(this.runBound, this.updateDt - this.timer.getDt());
      return;
    }
    this.update();
    setTimeout(this.runBound, this.updateDt - this.timer.getDt());
  }
  update() {
    // this.stats.updates += 1;
    this.userUpdate(this.updateDtSeconds);
  }
  runRender() {
    this.rafId = requestAnimationFrame(this.renderBound);
  }
  render() {
    this.rafId = requestAnimationFrame(this.renderBound);
    // this.stats.renders += 1;
    this.userRender(this.timer.getDt() / 1000);
  }
  stop() {
    this.runBound = () => {};
    cancelAnimationFrame(this.rafId);
  }
}
