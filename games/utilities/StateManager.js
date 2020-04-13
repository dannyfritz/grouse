const copyArrayBufferInto = (src, dest) => {
  var srcF32 = new Float32Array(src);
  var destF32 = new Float32Array(dest);
  destF32.set(srcF32);
};

export class StateManager {
  constructor(size, count) {
    this.statesIndex = 0;
    this.states = [];
    for (let i = 0; i < count; i++) {
      this.states.push(new ArrayBuffer(size));
    }
    this.temp = new ArrayBuffer(size);
    this.current = this.states[this.statesIndex];
    this.next = this.states[(this.statesIndex + 1) % this.states.length];
  }
  commit() {
    this.current = this.next;
    this.statesIndex = (this.statesIndex + 1) % this.states.length;
    this.next = this.states[this.statesIndex];
    copyArrayBufferInto(this.current, this.next);
  }
  prepareTemp() {
    copyArrayBufferInto(this.current, this.temp);
  }
}
