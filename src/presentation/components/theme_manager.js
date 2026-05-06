export class ThemeManager {
  constructor(themeMode = 'system') {
    this.themeMode = themeMode;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.listener = () => this.apply();
    this.mediaQuery.addEventListener?.('change', this.listener);
    this.apply(themeMode);
  }

  setThemeMode(themeMode) {
    this.themeMode = themeMode;
    this.apply();
  }

  getResolvedTheme() {
    if (this.themeMode === 'dark' || this.themeMode === 'light') return this.themeMode;
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  apply(themeMode = this.themeMode) {
    this.themeMode = themeMode;
    document.documentElement.dataset.theme = this.getResolvedTheme();
    document.documentElement.dataset.themeMode = this.themeMode;
  }
}
