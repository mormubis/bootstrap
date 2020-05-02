class MemoryStorage {
  data = {};

  get length() {
    return Object.keys(this.data).length;
  }

  clear() {
    this.data = {};
  }

  getItem(key) {
    if (!key) {
      return undefined;
    }

    return this.data[key];
  }

  key(number) {
    return Object.keys(this.data)[number];
  }

  removeItem(key) {
    delete this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
  }
}

const memoryStorage = new MemoryStorage();

function useMemoryStorage() {
  return memoryStorage;
}

export { useMemoryStorage };

/* I left this assignation to make easy to debug */
export default window.memoryStorage = memoryStorage;
