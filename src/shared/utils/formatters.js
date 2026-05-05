export const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN'
});

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

export function toNumber(value) {
  const parsed = Number(String(value ?? '').replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
