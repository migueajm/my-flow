import { categories } from "./config/categories.js";

export const total = e => e.reduce((a, b) => a + b.amount, 0);

export const filter = (e, f) => {
	if (f.type == 'day') return e.filter(x => x.date == f.day);
	if (f.type == 'month') return e.filter(x => x.date.startsWith(f.month));
	if (f.type == 'range') return e.filter(x => x.date >= f.start && x.date <= f.end);
	return e;
};

export const byCategory = e => {
	let r = {};
	e.forEach(x => {
		r[x.category] = {
			total: (r[x.category]?.total || 0) + x.amount,
			category: categories.find(c => c.value == x.category)?.label[window.locale]
		};
	});
	return r;
};