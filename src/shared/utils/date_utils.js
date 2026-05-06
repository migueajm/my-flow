export function monthKeyFromDate(date = new Date()) {
  const normalized = new Date(date);
  return {
    year: normalized.getFullYear(),
    month: normalized.getMonth() + 1
  };
}

export function monthKeyToString(monthKey) {
  return `${monthKey.year}-${String(monthKey.month).padStart(2, '0')}`;
}

export function parseMonthKey(value) {
  const [year, month] = value.split('-').map(Number);
  return { year, month };
}

export function shiftMonth(monthKey, delta) {
  const date = new Date(monthKey.year, monthKey.month - 1 + delta, 1);
  return monthKeyFromDate(date);
}

export function formatMonth(monthKey, locale = 'es') {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX', {
    month: 'long',
    year: 'numeric'
  }).format(new Date(monthKey.year, monthKey.month - 1, 1));
}

export function formatDate(dateValue, locale = 'es') {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-MX').format(new Date(dateValue));
}

export function getWeekOfMonth(dateValue) {
  const date = new Date(dateValue);
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
}
