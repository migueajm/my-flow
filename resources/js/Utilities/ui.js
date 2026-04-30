import { getState, deleteExpense } from '../state.js';
import { total, filter, byCategory } from '../finance.js';
import { pie, line } from './charts.js';

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
				{ data: 'category' },
				{ data: 'expenseName' },
				{ data: 'amount' },
				{ data: 'date' },
				{
					data: null,
					render: (data, type, row) => `
					<button class="edit-btn" onclick="edit(${row.id})" class="default-btn"><i class="bi bi-pencil-square"></i></button>
					<button class="remove-btn" onclick="del(${row.id})" class="default-btn"><i class="bi bi-trash"></i></button>
				`
				}
			]
		});
	}else {
		window._datatable.clear().rows.add(filtered).draw();
	}

	window.del = id => deleteExpense(id);

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

	let alerts = '';
	if (total(filtered) > state.salary * 0.8)
		alerts = '<div>⚠️ Superaste 80%</div>';

	document.getElementById('alerts').innerHTML = alerts;
};
