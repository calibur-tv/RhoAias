export default {
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
    return this.get(key);
  },

  get(key, def = null) {
    try {
      return localStorage.getItem(key) || def;
    } catch (e) {
      return def;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {}
  }
};
