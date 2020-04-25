const copyArrayBufferInto = (src, dest) => {
  const srcF64 = new Float64Array(src);
  const destF64 = new Float64Array(dest);
  destF64.set(srcF64);
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
