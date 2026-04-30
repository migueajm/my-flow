import { HtmlElementExpectedError } from "../Error/html_element_expected_error.js";
import { ObjectExpectedError } from "../Error/object_expected_error.js";

export class FormManager {
	constructor(id, inputs, locale = 'es') {
		this.inputs = inputs;
		this.formId = id;
		this.locale = locale;
	}

	/**
	 * @returns {HTMLFormElement}
	 */
	renderForm() {
		const form = document.createElement('form');
		form.id = this.formId;
		form.classList.add('row');
		for (const key in this.inputs) {
			const inputProps = this.inputs[key];
			const element = this.renderInputByType(key, inputProps);
			if (element) {
				form.appendChild(element);
			}
		}
		return form;
	}

	renderInputByType(key, inputProps) {
		const type = inputProps.type || 'text';
		const hidden = inputProps.hidden === true;
		const parentClass = inputProps.parentClass || '';
		const label = inputProps.label?.[this.locale] || '';

		const column = document.createElement('div');
		column.className = `${parentClass}`;
		if (hidden) column.hidden = true;
		if (type === 'textarea') {
			return this.buildTextArea(key, inputProps, label, column);
		}
		if (type === 'select') {
			return this.buildSelect(key, inputProps, label, column);
		}
		if (type === 'checkbox') {
			return this.buildCheckbox(key, inputProps, label, column);
		}
		if (type === 'subtitle') {
			const subtitle = document.createElement('p');
			subtitle.className = `fw-bold ${parentClass}`;
			subtitle.style = inputProps.style || '';
			subtitle.textContent = label;
			return subtitle;
		}
		if (type === 'button') {
			inputProps.labelText = label;
			return this.createButton(inputProps);
		}
		return this.buildTextInput(key, inputProps, label, column);
	}

	buildTextInput(key, props, labelText, column) {
		let label = null;
		if (labelText) {
			label = document.createElement('label');
			label.setAttribute('for', key);
			label.className = 'form-label';
			label.textContent = labelText;
			column.appendChild(label);
		}
		const input = document.createElement('input');
		input.type = props.type || 'text';
		input.id = props.id || key;
		input.name = key;
		input.className = ('form-control ' + (props.class || '')).trim();
		input.value = props?.value ?? null;
		if (props.value !== undefined) input.value = props.value;
		if (props.placeholder?.[this.locale]) input.placeholder = props.placeholder[this.locale];
		if (props.required) {
			input.required = true;
		}
		if (props.disabled) input.disabled = true;
		this.applyEvents(input, props);

		column.appendChild(input);
		return column;
	}

	buildTextArea(key, props, labelText, column) {
		let label = null;
		if (labelText) {
			label = document.createElement('label');
			label.setAttribute('for', key);
			label.textContent = labelText;
			column.appendChild(label);
		}
		const textarea = document.createElement('textarea');
		textarea.id = props.id || key;
		textarea.name = key;
		textarea.className = ('form-control ' + (props.class || '')).trim();
		textarea.value = props?.value ?? null;
		if (props.value !== undefined) textarea.value = props.value;
		if (props.placeholder?.[this.locale]) textarea.placeholder = props.placeholder[this.locale];
		if (props.required) {
			textarea.required = true;
		};
		if (props.disabled) textarea.disabled = true;
		this.applyEvents(textarea, props);
		column.appendChild(textarea);
		return column;
	}

	buildSelect(key, props, labelText, column) {
		let label = null;
		if (labelText) {
			label = document.createElement('label');
			label.setAttribute('for', key);
			label.textContent = labelText;
			column.appendChild(label);
		}
		const select = document.createElement('select');
		select.id = props.id || key;
		select.name = key;
		select.className = ('form-select ' + (props.class || '')).trim();
		if (props.required) {
			select.required = true
		};
		if (props.disabled) select.disabled = true;
		FormManager.loadOptions(select, props.options);
		this.applyEvents(select, props);
		column.appendChild(select);
		return column;
	}

	buildCheckbox(key, props, labelText, column) {
		const isSwitch = props.hasOwnProperty('role') && props.role;
		const label = document.createElement('label');
		const input = document.createElement('input');
		input.type = 'checkbox';
		input.id = props.id || key;
		input.name = key;
		input.checked = !!props.value;
		input.className = 'form-check-input';
		column.classList.add('form-check');
		if (isSwitch) {
			input.setAttribute('role', 'switch');
			column.classList.add('form-switch')
		}
		if (props.required) {
			input.required = true
		};
		if (props.disabled) input.disabled = true;
		this.applyEvents(input, props);
		label.appendChild(input);
		label.append(` ${labelText}`);
		label.className = 'form-check-label';
		column.appendChild(label);
		return column;
	}
	applyEvents(element, props) {
		if (props.oninput) element.setAttribute('oninput', props.oninput);
		if (props.onchange) element.setAttribute('onchange', props.onchange);
		if (props.event) {
			Object.entries(props.event).forEach(([eventName, handler]) => {
				element.setAttribute(eventName, handler);
			});
		}
	}

	/**
	 * 
	 * @param {string} text
	 * @param {HTMLElement|string} icon
	 * @param {Function} onclick
	 * @returns {HTMLElement}
	 */
	createButton = (props, icon = null, onclick = null) => {
		const button = document.createElement('a');
		button.className = 'btn btn-light rounded-pill shadow-sm';
		if (icon instanceof HTMLElement) {
			button.appendChild(icon);
		}
		if (typeof icon === 'string') {
			const i = createIcon(icon);
			button.appendChild(i);
		}
		button.textContent = props.labeltext;
		if (typeof onclick === 'function') {
			button.addEventListener('click', onclick);
		}
		return button;
	}

	/**
 * 
 * @param {string} icon 
 * @returns {HTMLElement}
 */
	createIcon = icon => {
		const i = document.createElement('i');
		const className = 'bi bi-' + icon;
		i.className = className;
		return i;
	}

	static loadOptions(select, data, locale = 'es') {
		const defaultOption = document.createElement('option');
		select.textContent = '';
		defaultOption.value = '';
		defaultOption.selected = true;
		defaultOption.textContent = locale == 'en' ? 'Select an option' : 'Selecione una opción';
		select.appendChild(defaultOption);
		(data || []).forEach(opt => {
			const option = document.createElement('option');
			option.value = opt.value;
			option.textContent = opt.label?.[locale] || opt.label || opt.value;
			if (data.value === opt.value) data.selected = true;
			if (opt?.dataset) {
				const dataset = JSON.parse(opt.dataset);
				Object.entries(dataset).forEach(row => {
					option.dataset[row[0]] = row[1];
				})
			}
			select.appendChild(option);
		});
	}

	/**
	 * Se encarga de llenar un formulario de información.
	 * @param {HTMLFormElement} form Formulario a minipular
	 * @param {object} entity Objecto con los valores a asignar al formulario
	 */
	static setData(form, entity) {
		if (!form instanceof HTMLFormElement) {
			throw new HtmlElementExpectedError(typeof form);
		}
		if (typeof entity != "object") {
			throw new ObjectExpectedError(typeof entity);
		}
		Object.keys(entity).forEach(async key => {
			const element = form.querySelector(`#${key}`);
			if (!element) return;
			if (element.type === 'file') {
				return;
			}
			if (element.type === 'checkbox') {
				element.checked = ((typeof entity[key] == 'boolean' && entity[key]) || entity[key] == 'true' || entity[key] == 1);
				return;
			}
			element.value = entity[key];
		});
	};

	/**
	 * Se encarga de obtener toda la información del formulario.
	 * @param {HTMLFormElement | string} form Formulario a minipular o Id
	 * @param {bool} asJson True si se requiere un objecto; false para un FormData
	 * @param {bool} isSymfonyForm false se encarga de dejar solo el identificador.
	 */
	static getData(form, asJson = false, isSymfonyForm = false) {
		let id = '';
		if (typeof form == 'string') {
			id = form;
			form = document.querySelector('form#' + id);
		}
		if (!form) throw new HtmlElementExpectedError(id);
		const formData = new FormData(form);
		if (!asJson) return formData;
		form.querySelectorAll("select, input, textarea").forEach(select => {
			const key = isSymfonyForm ? select.id : FormManager.processKey(select.id);
			if (!formData.has(key)) {
				formData.append(key, select?.value ?? '');
			}
		});
		const jsonObject = {};
		formData.forEach((value, key) => {
			if (!isSymfonyForm) {
				key = FormManager.processKey(key);
			}
			if (jsonObject.hasOwnProperty(key)) {
				if (!Array.isArray(jsonObject[key])) {
					jsonObject[key] = [jsonObject[key]];
				}
				jsonObject[key].push(value);
			} else {
				const element = form.querySelector(`#${key}`);
				if (!value) {
					if (element && element.type === 'datetime-local') {
						value = (element.getAttribute('value') || null)?.replace('T', ' ');
					}
				}
				if (element.type === 'checkbox') {
					value = element.checked;
				}
				if (element.type === 'number') {
					value = Number.isInteger(value) ? parseInt(value) : parseFloat(value);
				}
				jsonObject[key] = value || null;
			}
		});
		if (form.dataset.hasOwnProperty('id')) {
			jsonObject.id = form.dataset.id;
		}
		return jsonObject;
	}

	static processKey(str) {
		const matches = str.match(/\[(.*?)\]/);
		return matches ? matches[1] : str;
	}
}