import { getState } from '../state.js';
import { total, filter, byCategory } from '../finance.js';
import { pie, line } from './charts.js';
import { categories } from '../config/categories.js';

export const render = () => {
	let state = getState();
	let filtered = filter(state.expenses, state.filters);

	document.getElementById('cards').innerHTML =`
		<div class="card">Salario: $${state.salary}</div>
		<div class="card">Gastos: $${total(filtered)}</div>
	`;
	if(!window._datatable){
		window._datatable = $(`table#expensesTable`).DataTable({
			data: filtered,
			columns: [
				{
					data: 'category',
					render: category => {
						return categories.find(c => c.value == category)?.label[window.locale] || category;
					}
				},
				{ data: 'expenseName' },
				{ data: 'amount' },
				{ data: 'date' },
				{
					data: null,
					render: (data, type, row) => `
					<button class="btn edit-btn" onclick="openExpenseModal(${row.expenseId})"><i class="bi bi-pencil-square"></i></button>
					<button class="btn remove-btn" onclick="deleteExpense(${row.expenseId})"><i class="bi bi-trash"></i></button>
				`
				}
			]
		});
	}else {
		window._datatable.clear().rows.add(filtered).draw();
	}
	const hash = window.location.hash.replace('#', '');
	if(!hash || hash == 'dashboard'){
		let cat = byCategory(filtered);
		pie(document.getElementById('pie'), cat);
	
		let trend = [];
		filtered.forEach(e => {
			let m = e.date.slice(0, 7);
			let f = trend.find(x => x.m == m);
			if (!f) { trend.push({ m, total: e.amount }); }
			else f.total += e.amount;
		});
	
		line(document.getElementById('line'), trend);
	}

	let alerts = '';
	if (total(filtered) > state.salary * 0.8)
		alerts = '<div>⚠️ Superaste 80%</div>';

	document.getElementById('alerts').innerHTML = alerts;
};
