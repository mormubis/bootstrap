import memoryStorage from './memoryStorage';

class Storage {
  provider = localStorage;

  constructor() {
    try {
      this.set('check', true);
      if (this.get('check') !== true) {
        this.provider = memoryStorage;
        this.remove('check');
      }
    } catch (e) {
      this.provider = memoryStorage;
    }
  }

  clear() {
    this.provider.clear();
  }

  get(key) {
    try {
      const item = this.provider.getItem(key);
      if (item === undefined) return item;
      return JSON.parse(item);
    } catch (e) {
      return undefined;
    }
  }

  keys() {
    const keys = [];

    for (let i = 0; i < this.provider.length; i += 1) {
      keys.push(this.provider.key(i));
    }

    return keys;
  }

  remove(key) {
    this.provider.removeItem(key);
  }

  set(key, value) {
    this.provider.setItem(key, JSON.stringify(value));
  }
}

const storage = new Storage();

function useStorage() {
  return storage;
}

export { useStorage };

export default storage;
