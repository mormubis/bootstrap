import storage from 'Providers/storage';

class Cache {
  store = storage;

  get(key) {
    const hit = this.store.get(key);

    if (hit) {
      const { timestamp, ttl, value } = hit;

      if (timestamp + ttl > Date.now()) {
        return value;
      }

      this.store.remove(key);
    }
  }

  set(key, value, ttl = 2 * 60 * 1e3) {
    this.store.set(key, { timestamp: Date.now(), ttl, value });
  }
}

export default new Cache();
