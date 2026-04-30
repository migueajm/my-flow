import { CustomError } from "./custom_error.js";

export class FormError extends CustomError {
	/**
	 * Crea un error personalizado para formularios.
	 * 
	 * @param {object} formError - El nombre del campo que tiene el error.
	 * @param {string} message - El mensaje de error a mostrar.
	 */
	constructor(formError, message) {
		super('FormError', message, 400)
		this.formError = formError;
		this.statusText = 'Bad request.';
	}
}