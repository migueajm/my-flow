export class Loader {
	static loaderId = 'app-loader-backdrop';

	static show(message = '...') {
		document.body.style.pointerEvents = 'none';
		if (!document.getElementById(this.loaderId)) {
			const backdrop = document.createElement('div');
			backdrop.id = this.loaderId;
			backdrop.className = 'app-loader-backdrop';
			backdrop.innerHTML = `
          <div class="app-loader">
            <div class="app-loader-spinner"></div>
            <div class="app-loader-message"></div>
          </div>
        `;
			document.body.appendChild(backdrop);
			const messageDiv = backdrop.querySelector('.app-loader-message');
			messageDiv.innerHTML = `${message}`;
			return;
		}
		const backdrop = document.getElementById(this.loaderId);
		backdrop.style.display = 'flex';
		const messageDiv = backdrop.querySelector('.app-loader-message');
		messageDiv.innerHTML = `${message}`;
	}

	static hide() {
		const backdrop = document.getElementById(this.loaderId);
		if (backdrop) {
			backdrop.style.display = 'none';
		}
		document.body.style.pointerEvents = 'auto';
	}
}