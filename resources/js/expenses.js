import { HtmlElementExpectedError } from "./Error/html_element_expected_error.js";
import { FormManager } from "./Utilities/form_manager.js";
import { Loader } from "./Utilities/loader.js";
import { Modal } from "./Utilities/modal.js";
import { expenses } from "./config/expenses.js";
import { texts } from "./l10n/l10n.js";
import { addExpense, deleteExpense } from "./state.js";

export default class Expenses {
	static instance = null;
	id = 'expenses';
	constructor() {
		if (!Expenses.instance) return;
		this.render();
		window.openExpenseModal = this.show.bind(this);
	}

	show(){
		Modal.attachToExistingModal('form-' + this.id);
	}

	render() {
		const container = document.getElementById(this.id);
		if (!container) throw new HtmlElementExpectedError(this.id);
		if(document.querySelector('div.modal-' + this.id)) return;
		new Modal({
			id: 'modal-' + this.id,
			title: texts['es']['expense_details'],
			body: (new FormManager('form-' + this.id, expenses, window.locale)).renderForm(),
			closeText: texts['es']['close'],
			actionText: texts['es']['save'],
			onConfirm: Expenses.save
		});
	}

	static save(id){
		if(id) return Expenses.update(id);
		Loader.show();
		const form = document.getElementById('form-expenses');
		const data = FormManager.getData(form, true);
		addExpense({
			name: data.expenseName,
			amount: parseFloat(data.amount),
			category: data.category,
			date: data.date
		});
		Loader.hide();
	}

	static init() {
		if (!Expenses.instance) Expenses.instance = new Expenses();
		return Expenses.instance;
	}
}
