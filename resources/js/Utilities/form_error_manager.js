import { FormError } from "../Error/form_error.js";
import { HtmlElementExpectedError } from "../Error/html_element_expected_error.js";

export class FormErrorManager {
	/**
	 * Inicializa la clase con un formulario.
	 * @param {HTMLFormElement} form - El formulario a gestionar.
	 */
	constructor(form) {
		if (!(form instanceof HTMLFormElement)) {
			throw new HtmlElementExpectedError('An HTMLFormElement must be provided.');
		}
		this.form = form;
		this.init();
	}

	/**
	 * Inicializa eventos para manejar errores automáticamente.
	 */
	init() {
		this.form.addEventListener('input', (event) => {
			const field = event.target;
			this.clearError(field.name);
		});
	}

	/**
	 * Muestra un mensaje de error en un campo del formulario.
	 * 
	 * @param {string} fieldName - El nombre del campo que tiene el error.
	 * @param {string} errorMessage - El mensaje de error a mostrar.
	 */
	showError(fieldName, errorMessage) {
		const symfonyName = `${this.form.name}[${fieldName}]`;
		const field = this.form.querySelector(`[name="${fieldName}"]`) ?? this.form.querySelector(`[name="${symfonyName}"]`);
		if (!field) {
			throw new FormError(fieldName, `The field with the name "${fieldName}" was not found.`);
		}
		this.clearError(field.name);
		const errorElement = document.createElement('span');
		errorElement.className = 'form-error-message';
		errorElement.textContent = errorMessage;
    field.parentNode.appendChild(errorElement);
		field.classList.add('form-error-input');
		field.focus();
	}

	/**
	 * Elimina el mensaje de error de un campo.
	 * 
	 * @param {string} fieldName - El nombre del campo que tiene el error.
	 */
	clearError(fieldName) {
		const field = this.form.querySelector(`[name="${fieldName}"]`);
		if (!field) return;
		let errorElement = null;
		errorElement = field.parentNode.querySelector('.form-error-message');
		if (errorElement) {
			errorElement.remove();
		}
		field.classList.remove('form-error-input');
	}

	/**
	 * Elimina todos los mensajes de error del formulario.
	 */
	clearAllErrors() {
		const errorMessages = this.form.querySelectorAll('.form-error-message');
		errorMessages.forEach((errorElement) => errorElement.remove());
		const fields = this.form.querySelectorAll('input, select, textarea');
		fields.forEach((field) => {
			field.classList.remove('form-error-input');
		});
	}
}