export class Modal {
	static modalsRegistry = {};

	constructor({
		id,
		title = '',
		body = '',
		closeText = 'Cerrar',
		actionText = 'Confirmar',
		hiddenAction = false,
		className = '',
		size = '',
		onConfirm = null
	}) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.closeText = closeText;
		this.actionText = actionText;
		this.hiddenAction = hiddenAction;
		this.className = className;
		this.size = size;
		this.modalElement = null;
		this.bsModal = null;
		this.isInitialized = false;
		this.onConfirm = onConfirm;
	}

	_createModalElement() {
		const bodyContent = this.body instanceof HTMLElement ? '' : this.body;
		const isHtmlElement = this.body instanceof HTMLElement;

		const html = `
			<div class="modal fade ${this.className} modal-${this.size}" id="${this.id}" tabindex="-1">
				<div class="modal-dialog modal-${this.size}">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title">${this.title}</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
						</div>
						<div class="modal-body">${bodyContent}</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary cancel-btn" data-bs-dismiss="modal">${this.closeText}</button>
							<button type="button" class="btn confirm-btn ${this.hiddenAction ? 'd-none' : ''}">${this.actionText}</button>
						</div>
					</div>
				</div>
			</div>
		`;

		document.body.insertAdjacentHTML("beforeend", html);
		this.modalElement = document.getElementById(this.id);

		if (isHtmlElement) {
			this.modalElement.querySelector('.modal-body').appendChild(this.body);
		}

		this._initializeModalLogic();
	}

	setBody(body){
		const bodyElement = this.modalElement.querySelector('.modal-body');
		bodyElement.textContent = '';
		body instanceof HTMLElement ? bodyElement.appendChild(body) : bodyElement.innerHTML = body;
	}

	setTitle(title){
		const titleElement = this.modalElement.querySelector('.modal-header h5.modal-title');
		titleElement.textContent = '';
		title instanceof HTMLElement ? titleElement.appendChild(title) : titleElement.innerHTML = title;
	}

	_initializeModalLogic() {
		const confirmBtn = this.modalElement.querySelector('.confirm-btn');
		confirmBtn?.addEventListener('click', (e) => {
			if (typeof this.onConfirm === 'function') {
				this.onConfirm(e.currentTarget);
			}
			this.resolvePromise?.(true);
			this.bsModal.hide();
		});

		this.modalElement.addEventListener('hidden.bs.modal', () => {
			this.resolvePromise?.(false);
		});

		this.bsModal = new bootstrap.Modal(this.modalElement, {
			backdrop: 'static',
			keyboard: false
		});

		Modal.modalsRegistry[this.id] = this;
		this.isInitialized = true;
	}

	_createPromise() {
		return new Promise((resolve) => {
			this.resolvePromise = resolve;
		});
	}

	create() {
		if (!this.isInitialized) {
			this._createModalElement();
		}
		this.bsModal.show();
		return this._createPromise();
	}

	show() {
		return this.create();
	}

	static async attachToExistingModal(existingId, show = true) {
		const instance = Modal.modalsRegistry[existingId];
		if (instance) {
			if(show) return instance.show();
			instance.bsModal.hide();
			return instance;
		}
		const el = document.getElementById(existingId);
		if (el) {
			const modalInstance = new Modal({ id: existingId });
			modalInstance.modalElement = el;
			modalInstance._initializeModalLogic();
			if(show) return modalInstance.show();
			modalInstance.bsModal.hide();
			return modalInstance;
		}
		return null;
	}
}
