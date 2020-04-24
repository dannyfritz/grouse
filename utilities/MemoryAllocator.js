export class MemoryAllocator {
  constructor(totalBytes) {
    this.size = totalBytes;
    this.freeOffset = 0;
  }
  allocate(bytes) {
    const offset = this.freeOffset;
    if (this.freeOffset + bytes >= this.size) {
      throw new Error("Out of memory");
    }
    this.freeOffset += bytes;
    return offset;
  }
}
