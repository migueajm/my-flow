import { MovementType } from "../../domain/entities/movement.js";
import { formatCurrency, toNumber } from "../../shared/utils/formatters.js";
import { formatDate } from "../../shared/utils/date_utils.js";

export function metricCard(title, amount, subtitle = '', locale = 'es') {
  return `
    <article class="metric">
      <span>${title}</span>
      <strong>${formatCurrency(amount, locale)}</strong>
      ${subtitle ? `<small>${subtitle}</small>` : ''}
    </article>
  `;
}

export function expenseList(state, limit = null) {
  const rows = limit ? state.expenses.slice(0, limit) : state.expenses;
  if (!rows.length) return `<div class="empty">${state.t('noExpenses')}</div>`;
  return `
    <div class="list">
      ${rows.map(expense => {
        const category = state.categories.find(item => item.id === expense.categoryId);
        return `
          <article class="swipe-item" data-swipe-id="${expense.id}" data-swipe-kind="expense">
            <div class="swipe-action edit">${state.t('edit')}</div>
            <div class="swipe-action delete">${state.t('delete')}</div>
            <div class="swipe-content list-item">
              <div class="avatar">${category?.icon ?? '$'}</div>
              <div>
                <strong>${expense.description || category?.name || state.t('expenses')}</strong>
                <div class="muted">${category?.name ?? state.t('category')} - ${formatDate(expense.date, state.locale)}</div>
              </div>
              <div class="amount-negative">${formatCurrency(expense.amount, state.locale)}</div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
}

export function movementList(state) {
  if (!state.movements.length) return `<div class="empty">${state.t('noMovements')}</div>`;
  return `
    <div class="list">
      ${state.movements.map(movement => {
        const account = state.accounts.find(item => item.id === movement.accountId);
        const isWithdrawal = movement.type === MovementType.WITHDRAWAL;
        return `
          <article class="swipe-item" data-swipe-id="${movement.id}" data-swipe-kind="movement">
            <div class="swipe-action edit">${state.t('edit')}</div>
            <div class="swipe-action delete">${state.t('delete')}</div>
            <div class="swipe-content list-item">
              <div class="avatar">${isWithdrawal ? '-' : '+'}</div>
              <div>
                <strong>${movement.description || movement.type}</strong>
                <div class="muted">${account?.name ?? state.t('account')} - ${formatDate(movement.date, state.locale)}</div>
              </div>
              <div class="${isWithdrawal ? 'amount-negative' : 'amount-positive'}">
                ${isWithdrawal ? '-' : '+'}${formatCurrency(movement.amount, state.locale)}
              </div>
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
