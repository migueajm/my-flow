import { MovementType } from "../../domain/entities/movement.js";
import { formatCurrency, toNumber } from "../../shared/utils/formatters.js";
import { formatDate } from "../../shared/utils/date_utils.js";

export function metricCard(title, amount, subtitle = '') {
  return `
    <article class="metric">
      <span>${title}</span>
      <strong>${formatCurrency(amount)}</strong>
      ${subtitle ? `<small>${subtitle}</small>` : ''}
    </article>
  `;
}

export function expenseList(state, limit = null) {
  const rows = limit ? state.expenses.slice(0, limit) : state.expenses;
  if (!rows.length) return '<div class="empty">No hay gastos registrados en este mes.</div>';
  return `
    <div class="list">
      ${rows.map(expense => {
        const category = state.categories.find(item => item.id === expense.categoryId);
        return `
          <article class="list-item">
            <div class="avatar">${category?.icon ?? '$'}</div>
            <div>
              <strong>${expense.description || category?.name || 'Gasto'}</strong>
              <div class="muted">${category?.name ?? 'Categoria'} - ${formatDate(expense.date)}</div>
            </div>
            <div class="amount-negative">${formatCurrency(expense.amount)}</div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

export function movementList(state) {
  if (!state.movements.length) return '<div class="empty">No hay movimientos en este mes.</div>';
  return `
    <div class="list">
      ${state.movements.map(movement => {
        const account = state.accounts.find(item => item.id === movement.accountId);
        const isWithdrawal = movement.type === MovementType.WITHDRAWAL;
        return `
          <article class="list-item">
            <div class="avatar">${isWithdrawal ? '-' : '+'}</div>
            <div>
              <strong>${movement.description || movement.type}</strong>
              <div class="muted">${account?.name ?? 'Cuenta'} - ${formatDate(movement.date)}</div>
            </div>
            <div class="${isWithdrawal ? 'amount-negative' : 'amount-positive'}">
              ${isWithdrawal ? '-' : '+'}${formatCurrency(movement.amount)}
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

export function readAmount(form, fieldName = 'amount') {
  return toNumber(new FormData(form).get(fieldName));
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10);
}
