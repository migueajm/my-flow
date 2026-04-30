import { subscribe, setSalary, setFilter } from './state.js';
import { FetchService } from './Utilities/fetch_service.js';
import { render } from './Utilities/ui.js';
import { Loader } from './Utilities/loader.js';
import { FormErrorManager } from './Utilities/form_error_manager.js';

document.addEventListener('DOMContentLoaded', () => {
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
});

/* document.getElementById('saveSalary').onclick = () => {
	setSalary(parseFloat(salary.value));
}; */

document.getElementById('filterType').onchange = e => {
	setFilter({ type: e.target.value });
};

subscribe(render);
render();

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js');
}

document.addEventListener('click', (e) => {
	const button = e.target.closest('.nav');
	if (!button) return;
	const view = button.dataset.view;
	const container = document.querySelector(`section#${view}`);
	const buttonActive = document.querySelector('.nav.active');
	const viewActive = document.querySelector('.view.active');
	window.loadClass(view);
	if (view === buttonActive?.dataset.view) return;
	buttonActive?.classList.remove('active');
	viewActive?.classList.remove('active');
	button.classList.add('active');
	if (!container) return;
	container.classList.add('active');
});