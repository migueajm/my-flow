export class AppLoader {
  constructor() {
    this.element = document.getElementById('global-loader');
    this.label = this.element?.querySelector('[data-loader-label]');
  }

  show(message = 'Loading...') {
    if (!this.element) return;
    if (this.label) this.label.textContent = message;
    this.element.classList.add('open');
  }

  hide() {
    this.element?.classList.remove('open');
  }

  async run(task, message = 'Loading...') {
    this.show(message);
    try {
      await new Promise(resolve => window.setTimeout(resolve, 220));
      return await task();
    } finally {
      this.hide();
    }
  }
}
