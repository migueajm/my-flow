export class AppModal {
  static activeModal = null;

  constructor(options = {}) {
    this.options = {
      title: 'Aviso',
      message: '',
      type: 'info',
      confirmText: 'Aceptar',
      cancelText: 'Cancelar',
      showCancel: false,
      closeOnOverlay: true,
      ...options
    };
    this.element = null;
    this.resolve = null;
  }

  static alert(options = {}) {
    return new AppModal({
      ...options,
      showCancel: false
    }).open();
  }

  static confirm(options = {}) {
    return new AppModal({
      title: 'Confirmar accion',
      type: 'warning',
      confirmText: 'Confirmar',
      showCancel: true,
      ...options
    }).open();
  }

  static success(message, title = 'Listo') {
    return AppModal.alert({
      title,
      message,
      type: 'success'
    });
  }

  static error(message, title = 'Ocurrio un problema') {
    return AppModal.alert({
      title,
      message,
      type: 'danger'
    });
  }

  open() {
    AppModal.closeActive(false);
    this.element = this.createElement();
    document.body.appendChild(this.element);
    AppModal.activeModal = this;
    this.bindEvents();
    requestAnimationFrame(() => {
      this.element.classList.add('open');
      this.element.querySelector('[data-modal-confirm]').focus();
    });

    return new Promise(resolve => {
      this.resolve = resolve;
    });
  }

  createElement() {
    const wrapper = document.createElement('div');
    wrapper.className = `modal-overlay modal-${this.options.type}`;
    wrapper.setAttribute('role', 'presentation');
    wrapper.innerHTML = `
      <section class="app-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-icon">${this.icon}</div>
        <div class="modal-body">
          <h2 id="modal-title">${this.escape(this.options.title)}</h2>
          <p>${this.escape(this.options.message)}</p>
        </div>
        <div class="modal-actions">
          ${this.options.showCancel ? `
            <button class="modal-button secondary" type="button" data-modal-cancel>
              ${this.escape(this.options.cancelText)}
            </button>
          ` : ''}
          <button class="modal-button primary" type="button" data-modal-confirm>
            ${this.escape(this.options.confirmText)}
          </button>
        </div>
      </section>
    `;
    return wrapper;
  }

  bindEvents() {
    this.element.querySelector('[data-modal-confirm]').addEventListener('click', () => {
      this.close(true);
    });

    const cancelButton = this.element.querySelector('[data-modal-cancel]');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => this.close(false));
    }

    this.element.addEventListener('click', event => {
      if (event.target === this.element && this.options.closeOnOverlay) {
        this.close(false);
      }
    });

    this.keyHandler = event => {
      if (event.key === 'Escape') this.close(false);
      if (event.key === 'Enter') this.close(true);
    };
    document.addEventListener('keydown', this.keyHandler);
  }

  close(result) {
    if (!this.element) return;
    document.removeEventListener('keydown', this.keyHandler);
    this.element.classList.remove('open');
    const element = this.element;
    this.element = null;
    AppModal.activeModal = null;
    window.setTimeout(() => element.remove(), 180);
    this.resolve?.(result);
  }

  static closeActive(result = false) {
    if (AppModal.activeModal) {
      AppModal.activeModal.close(result);
    }
  }

  escape(value) {
    const div = document.createElement('div');
    div.textContent = String(value ?? '');
    return div.innerHTML;
  }

  get icon() {
    const icons = {
      info: 'i',
      success: 'OK',
      warning: '!',
      danger: '!'
    };
    return icons[this.options.type] ?? icons.info;
  }
}
