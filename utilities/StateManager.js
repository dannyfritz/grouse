const copyArrayBufferInto = (src, dest) => {
  const srcF32 = new Float32Array(src);
  const destF32 = new Float32Array(dest);
  destF32.set(srcF32);
};

export class StateManager {
  constructor(size, count) {
    this.statesIndex = 0;
    this.states = [];
    for (let i = 0; i < count; i += 1) {
      this.states.push(new SharedArrayBuffer(size));
    }
    this.render = new SharedArrayBuffer(size);
    this.current = this.states[this.statesIndex];
    this.next = this.states[this.statesIndex + 1];
  }
  commit() {
    this.current = this.next;
    this.statesIndex = (this.statesIndex + 1) % this.states.length;
    this.next = this.states[this.statesIndex];
    copyArrayBufferInto(this.current, this.next);
  }
  prepareRender() {
    copyArrayBufferInto(this.current, this.render);
  }
}
