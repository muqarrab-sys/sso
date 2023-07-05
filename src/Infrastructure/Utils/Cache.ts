import NodeCache from "node-cache";

class Cache {
  private cache = new NodeCache();

  static instance = new Cache();

  constructor() {
    if (Cache.instance !== null) {
      return Cache.instance;
    }
  }

  async get<T = any>(key: string): Promise<T> {
    return this.cache.get<T>(key);
  }

  async set<T = any>(key: string, value: T, options?: { ttl?: number }) {
    return this.cache.set(key, value, options.ttl);
  }

  async delete(key: string) {
    return this.cache.del(key);
  }
}

export default Cache.instance;
