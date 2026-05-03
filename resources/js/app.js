import { subscribe, setFilter, setSalary, getSalary } from './state.js';
import { FetchService } from './Utilities/fetch_service.js';
import { render } from './Utilities/ui.js';
import { Loader } from './Utilities/loader.js';
import { FormErrorManager } from './Utilities/form_error_manager.js';
import { Modal } from './Utilities/modal.js';
import { texts } from './l10n/l10n.js';
import { Toast } from './Utilities/toast.js';
import { FormManager } from './Utilities/form_manager.js';
import { settings } from './config/settings.js';
import { SecureStorageManager } from './Utilities/storage.js';

document.addEventListener('DOMContentLoaded', () => {
	const hash = window.location.hash.replace('#', '');
	window.locale = (navigator.language || navigator.userLanguage) == 'es' ? 'es' : 'en';
	window.fetchService = new FetchService();
	window.loadClass = async (module, base_path = './') => {
		try {
			const path = base_path + module + '.js';
			const className = await import(path);
			new className.default();
		} catch (error) {
			console.error('Error loading class:', error);
		}
	}
	window.fetchService.setErrorFunction((error, form = null, btn = null) => {
		Loader.hide();
		if (form instanceof HTMLFormElement && error instanceof FormError) {
			const formErrorManager = new FormErrorManager(form);
			Object.keys(error.formError).forEach(key => {
				formErrorManager.showError(key, error.formError[key]);
			});
		}
		if (btn instanceof HTMLButtonElement) {
			btn.disabled = false;
		}
	});
	const sidebar = document.querySelector('.sidebar');
	const toggle = document.querySelector('button.menu-btn');
	const overlay = document.getElementById('overlay');
	window.toggleMenu = () => {
		sidebar.classList.toggle('open');
		toggle.classList.toggle('active');
		overlay?.classList.toggle('active');
	};

	window.overlayClick = () => {
		sidebar.classList.remove('open');
		toggle.classList.remove('active');
		overlay.classList.remove('active');
	};
	document.querySelectorAll('.locale').forEach(el => {
		if (!el.dataset[window.locale]) return;
		el.textContent = el.dataset[window.locale];
	});
	document.addEventListener('click', (e) => {
		const button = e.target.closest('.nav');
		if (!button) return;
		const view = button.dataset.view;
		const container = document.querySelector(`section#${view}`);
		const buttonActive = document.querySelector('.nav.active');
		const viewActive = document.querySelector('.view.active');
		if(!view) return;
		if(view != 'dashboard') window.loadClass(view);
		else render();
		if (view === buttonActive?.dataset.view) return;
		buttonActive?.classList.remove('active');
		viewActive?.classList.remove('active');
		button.classList.add('active');
		if (!container) return;
		container.classList.add('active');
	});
	document.getElementById('filterType').onchange = e => {
		setFilter({ type: e.target.value });
	};
	subscribe(render);
	render();
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('./sw.js');
	}
	document.querySelector('a#' + hash + '-link')?.click();
	document.toggleTheme = () => {
		document.body.classList.toggle('light');
		const button = document.querySelector('button[onclick="toggleTheme()"] i');
		if(document.body.classList.contains('light')){
			(new SecureStorageManager()).setItem('theme', 'light');
			button.classList.remove('bi-sun-fill');
			button.classList.add('bi-moon-fill');
			return;
		}
		button.classList.remove('bi-moon-fill');
		button.classList.add('bi-sun-fill');
		(new SecureStorageManager()).setItem('theme', 'dark');
	}

	document.querySelector('#settings-btn').addEventListener('click', async () => {
		let modal = await Modal.attachToExistingModal('settings-modal', false);
		if(!modal) {
			const body = new FormManager('settings-form', settings, window.locale);
			const form = body.renderForm();
			form.salary.value = getSalary();
			modal = new Modal({
				id: 'settings-modal',
				title: texts[window.locale].setting,
				body: form,
				onConfirm: () => {
					const form = document.querySelector('#settings-form');
					const value = form.salary.value;
					if(!value) return;
					Loader.show();
					setSalary(value);
					Loader.hide();
					Toast.success(texts[window.locale].settingsSaved);
				}
			});
			await modal.create();
			return;
		}
		const form = document.querySelector('#settings-form');
		FormManager.setData(form, {
			salary: getSalary()
		});
		modal.show();
	});
});
