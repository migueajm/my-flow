export const pie = (c, data) => {
	const ctx = c.getContext('2d');

	const rect = c.getBoundingClientRect();
	c.width = rect.width;
	c.height = rect.height;

	ctx.clearRect(0, 0, c.width, c.height);

	const centerX = c.width / 2;
	const centerY = c.height / 2;
	const radius = Math.min(centerX, centerY) - 10;

	let entries = Object.entries(data);
	let total = entries.reduce((a, [, v]) => a + v, 0);
	let start = 0;

	const colors = entries.map((_, i) =>
		`hsl(${(i * 360) / entries.length}, 70%, 55%)`
	);

	entries.forEach(([key, v], i) => {
		let slice = (v / total) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, start, start + slice);
		ctx.fillStyle = colors[i];
		ctx.fill();
		start += slice;
	});
};

export const line = (c, data) => {
	let ctx = c.getContext('2d');
	ctx.clearRect(0, 0, 300, 200);

	let max = Math.max(...data.map(x => x.total));

	ctx.beginPath();
	data.forEach((p, i) => {
		let x = i * 50;
		let y = 200 - (p.total / max) * 150;
		if (i == 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});
	ctx.stroke();
};