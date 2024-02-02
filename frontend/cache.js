// cache.js

class Cache {
    constructor() {
        this.data = new Map();
    }

    // Store data in the cache
    set(key, value) {
        this.data.set(key, value);
    }

    // Retrieve data from the cache
    get(key) {
        return this.data.get(key);
    }

    // Check if data exists in the cache
    has(key) {
        return this.data.has(key);
    }
}

const cache = new Cache();

export default cache;
