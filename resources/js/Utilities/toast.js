export class Toast {
	static containerId = 'toast-container';
	static delay = 4000;

	static ensureContainer() {
		let container = document.getElementById(this.containerId);
		if (!container) {
			container = document.createElement('div');
			container.id = this.containerId;
			container.className = 'app-toast-container';
			document.body.appendChild(container);
		}
		return container;
	}

	static show(message, type = 'success', delay = Toast.delay) {
		const container = this.ensureContainer();
		const toast = document.createElement('div');
		toast.className = `app-toast app-toast-${type}`;

		toast.innerHTML = `
			<div class="app-toast-header">
				<div style="display: flex; align-items: center;">
					<span class="app-icon"></span>
					<span>${this.capitalize(type)}</span>
				</div>
				<button class="app-close-btn" onclick="this.closest('.app-toast').remove()">×</button>
			</div>
			<div class="app-toast-body">
				${message}
			</div>
		`;

		container.appendChild(toast);

		setTimeout(() => {
			toast.remove();
		}, delay);
	}

	static success(message, delay = Toast.delay) {
		this.show(message, 'success', delay);
	}

	static warning(message, delay = Toast.delay) {
		this.show(message, 'warning', delay);
	}

	static error(message, delay = Toast.delay) {
		this.show(message, 'error', delay);
	}

	static capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}
