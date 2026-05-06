import { SecureStorageManager } from "../../infrastructure/storage/secure_storage_manager.js";

export class PreferencesService {
  constructor(storage = new SecureStorageManager('my-flow-migueajm')) {
    this.storage = storage;
  }

  getThemeMode() {
    return this.storage.get('themeMode', 'system');
  }

  setThemeMode(themeMode) {
    this.storage.set('themeMode', themeMode);
  }

  getLanguageMode() {
    return this.storage.get('languageMode', 'system');
  }

  setLanguageMode(languageMode) {
    this.storage.set('languageMode', languageMode);
  }

  hasGuestSession() {
    return this.storage.get('guestSession', false);
  }

  startGuestSession() {
    this.storage.set('guestSession', true);
  }

  endSession() {
    this.storage.remove('guestSession');
  }
}
