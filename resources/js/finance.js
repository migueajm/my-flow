export const total = e => e.reduce((a, b) => a + b.amount, 0);

export const filter = (e, f) => {
	if (f.type == 'day') return e.filter(x => x.date == f.day);
	if (f.type == 'month') return e.filter(x => x.date.startsWith(f.month));
	if (f.type == 'range') return e.filter(x => x.date >= f.start && x.date <= f.end);
	return e;
};

export const byCategory = e => {
	let r = {};
	e.forEach(x => r[x.category] = (r[x.category] || 0) + x.amount);
	return r;
};