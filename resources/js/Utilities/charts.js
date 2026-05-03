export const pie = (c, data) => {
	const ctx = c.getContext('2d');

	c.width = 300;
	c.height = 300;

	ctx.clearRect(0, 0, c.width, c.height);

	const centerX = c.width / 2;
	const centerY = c.height / 2;
	const radius = Math.max(0, Math.min(centerX, centerY) - 10);

	let entries = Object.entries(data);
	let total = 0;
	entries.forEach(([, v]) => {
		total += v.total;
	});

	if (!entries.length || total === 0) return;

	let start = 0;

	const colors = entries.map((_, i) =>
		`hsl(${(i * 360) / entries.length}, 70%, 55%)`
	);

	entries.forEach(([key, v], i) => {
		let slice = (v.total / total) * Math.PI * 2;
		ctx.beginPath();
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, start, start + slice);
		ctx.fillStyle = colors[i];
		ctx.fill();
		start += slice;
	});
};

export const line = (c, data) => {
	const ctx = c.getContext('2d');

	c.width = 300;
	c.height = 200;

	ctx.clearRect(0, 0, c.width, c.height);

	if (!data.length) return;

	let max = Math.max(...data.map(x => x.total));
	if (max === 0) return;

	const padding = 20;
	const stepX = (c.width - padding * 2) / (data.length - 1);

	ctx.beginPath();

	data.forEach((p, i) => {
		let x = padding + i * stepX;
		let y = c.height - padding - (p.total / max) * (c.height - padding * 2);

		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});

	ctx.stroke();
};