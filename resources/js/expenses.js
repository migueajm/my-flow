import { HtmlElementExpectedError } from "./Error/html_element_expected_error.js";
import { FormManager } from "./Utilities/form_manager.js";
import { Loader } from "./Utilities/loader.js";
import { Modal } from "./Utilities/modal.js";
import { expenses } from "./config/expenses.js";
import { texts } from "./l10n/l10n.js";
import { addExpense, deleteExpense, updateExpense, getExpense } from "./state.js";

export default class Expenses {
	static instance = null;
	static id = 'expenses';
	constructor() {
		if(document.querySelector('#modal-' + Expenses.id)) return;
		window.openExpenseModal = Expenses.show;
		window.deleteExpense = Expenses.delete;
		this.render();
	}

	static show(id){
		const form = document.getElementById('form-expenses');
		let data = {};
		if(id){
			data = { ...data, ...getExpense(id) };
		}
		FormManager.setData(form, data);
		Modal.attachToExistingModal('modal-' + Expenses.id);
	}

	render() {
		const container = document.getElementById(Expenses.id);
		if (!container) throw new HtmlElementExpectedError(Expenses.id);
		if(document.querySelector('div.modal-' + Expenses.id)) return;
		const modal = new Modal({
			id: 'modal-' + Expenses.id,
			title: texts['es']['expense_details'],
			body: (new FormManager('form-' + Expenses.id, expenses, window.locale)).renderForm(),
			closeText: texts['es']['close'],
			actionText: texts['es']['save'],
			onConfirm: Expenses.save,
			size: 'md'
		});
		modal._createModalElement();
	}

	static save(id){
		const form = document.getElementById('form-expenses');
		const data = FormManager.getData(form, true);
		if(data.id) return Expenses.update(id, data);
		Loader.show();
		addExpense(data);
		Loader.hide();
	}

	static update(id, entity){
		Loader.show();
		updateExpense(id, entity);
		Loader.hide();
	}

	static async delete(id){
		let modal = await Modal.attachToExistingModal('modal-confirm-expense', false);
		if(!modal) {
			modal = await (new Modal({
				id: 'modal-confirm-expense',
				title: texts[window.locale]['confirm_delete'],
				body: texts[window.locale]['confirm_delete_message'],
				closeText: texts[window.locale]['cancel'],
				actionText: texts[window.locale]['delete'],
				onConfirm: () => {
					Loader.show();
					deleteExpense(id);
					Loader.hide();
				}
			})).create();
			return;
		}
		modal.show();
	}

	static init() {
		if (!Expenses.instance) Expenses.instance = new Expenses();
		return Expenses.instance;
	}
}
