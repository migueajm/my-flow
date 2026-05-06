import { expenseList, todayInputValue } from "../components/templates.js";
import { formatCurrency } from "../../shared/utils/formatters.js";

export function renderExpenses(state) {
  return `
    <section class="grid two">
      <article class="panel">
        <h2>${state.t('registerExpense')}</h2>
        <form id="expense-form" class="form-grid">
          <input name="id" type="hidden" />
          <label>
            ${state.t('date')}
            <input name="date" type="date" value="${todayInputValue()}" required />
          </label>
          <label>
            ${state.t('category')}
            <select name="categoryId" required>
              ${state.categories.map(category => `<option value="${category.id}">${category.icon} ${category.name}</option>`).join('')}
            </select>
          </label>
          <label>
            ${state.t('amount')}
            <input name="amount" type="number" min="0" step="0.01" required />
          </label>
          <label>
            ${state.t('description')}
            <input name="description" type="text" maxlength="90" placeholder="Supermercado" />
          </label>
          <div class="full">
            <button class="primary-button" id="expense-submit" type="submit">${state.t('addExpense')}</button>
            <button class="secondary-button is-hidden" id="expense-cancel-edit" type="button">${state.t('cancelEdit')}</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <h2>${state.t('available')}</h2>
        <p style="font-size:2rem;font-weight:800;margin-bottom:8px">${formatCurrency(state.expenseRemaining, state.locale)}</p>
        <div class="progress"><span style="--value:${Math.round(state.usagePercent * 100)}%"></span></div>
      </article>
    </section>

    <section class="table-card" style="margin-top:16px">
      <h2>${state.t('monthExpenses')}</h2>
      ${expenseList(state)}
    </section>
  `;
}
