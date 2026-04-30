import { KeyWasExpectedError } from "../Error/key_was_expected_error.js";

export class SecureStorageManager {
  static registry = {};
  constructor(namespace = 'app-flow-migueajm') {
    this.namespace = namespace;
    this.encoder = new TextEncoder();
    this.decoder = new TextDecoder();
    this.storage = this._detectStorage();
    SecureStorageManager.registry[namespace] = this;
  }

  _detectStorage() {
    try {
      const testKey = '__test_key__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return localStorage;
    } catch (e) {
      try {
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        return sessionStorage;
      } catch (e2) {
        console.warn('No Web Storage available');
        return null;
      }
    }
  }

  _getFullKey(key) {
    return `${this.namespace}:${key}`;
  }

  _encode(value) {
    const wrapped = {
      t: typeof value,
      v: value
    };
    const json = JSON.stringify(wrapped);
    const bytes = this.encoder.encode(json);
    const binary = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binary);
  }

  _decode(encoded) {
    try {
      const binary = atob(encoded);
      const bytes = new Uint8Array([...binary].map(ch => ch.charCodeAt(0)));
      const json = this.decoder.decode(bytes);
      const { t, v } = JSON.parse(json);

      if (t === 'number') return Number(v);
      if (t === 'boolean') return v === true || v === 'true';
      return v;
    } catch (e) {
      console.warn('Error decoding SecureStorage value:', e);
      return null;
    }
  }

  set(key, value) {
    if (!this.storage) return;
    const encoded = this._encode(value);
    this.storage.setItem(this._getFullKey(key), encoded);
  }

  get(key, defaultValue = null) {
    if (!this.storage) return defaultValue;
    const raw = this.storage.getItem(this._getFullKey(key));
    if (!raw) return defaultValue;
    const decoded = this._decode(raw);
    return decoded !== null ? decoded : defaultValue;
  }

  remove(key) {
    if (!this.storage) return;
    this.storage.removeItem(this._getFullKey(key));
  }

  clearAll() {
    if (!this.storage) return;
    Object.keys(this.storage)
      .filter(k => k.startsWith(this.namespace + ':'))
      .forEach(k => this.storage.removeItem(k));
  }

  keys() {
    if (!this.storage) return [];
    return Object.keys(this.storage)
      .filter(k => k.startsWith(this.namespace + ':'))
      .map(k => k.replace(`${this.namespace}:`, ''));
  }

  /**
   * 
   * @param {string} namespace 
   * @returns {SecureStorageManager} instance
   */
  static attachToExisting(namespace) {
    if (!namespace) {
      throw new KeyWasExpectedError('namespace');
    }
    let instance = SecureStorageManager.registry[namespace];
    if (instance) return instance;
    instance = (new SecureStorageManager(namespace));
    SecureStorageManager.registry[namespace] = instance;
    return instance;
  }

  static load(key) {
    const instance = new SecureStorageManager();
    return instance.get(key);
  }

  static save(key, value) {
    const instance = new SecureStorageManager();
    return instance.set(key, value);
  }
}