import { AccountType } from "../../domain/entities/savings_account.js";
import { MovementType } from "../../domain/entities/movement.js";
import { formatCurrency } from "../../shared/utils/formatters.js";
import { metricCard, movementList, todayInputValue } from "../components/templates.js";

const accountLabelKeys = {
  [AccountType.SAVINGS]: 'savingsType',
  [AccountType.INVESTMENT]: 'investmentType'
};

const movementLabelKeys = {
  [MovementType.DEPOSIT]: 'deposit',
  [MovementType.WITHDRAWAL]: 'withdrawal',
  [MovementType.RETURN]: 'return'
};

export function renderSavings(state) {
  return `
    <section class="grid two">
      ${metricCard(state.t('goal20'), state.savingsBudget, '', state.locale)}
      ${metricCard(state.t('netMovements'), state.savingsTotal, `${state.t('remaining')} ${formatCurrency(state.savingsRemaining, state.locale)}`, state.locale)}
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>${state.t('createAccount')}</h2>
        <form id="account-form" class="form-grid">
          <label>
            ${state.t('name')}
            <input name="name" type="text" placeholder="Fondo de emergencia" required />
          </label>
          <label>
            ${state.t('type')}
            <select name="type">
              ${Object.values(AccountType).map(type => `<option value="${type}">${state.t(accountLabelKeys[type])}</option>`).join('')}
            </select>
          </label>
          <div class="full">
            <button class="primary-button" type="submit">${state.t('createAccount')}</button>
          </div>
        </form>
      </article>

      <article class="panel">
        <h2>${state.t('movement')}</h2>
        <form id="movement-form" class="form-grid">
          <input name="id" type="hidden" />
          <label>
            ${state.t('account')}
            <select name="accountId" required>
              ${state.accounts.map(account => `<option value="${account.id}">${account.name} - ${state.t(accountLabelKeys[account.type])}</option>`).join('')}
            </select>
          </label>
          <label>
            ${state.t('type')}
            <select name="type">
              ${Object.values(MovementType).map(type => `<option value="${type}">${state.t(movementLabelKeys[type])}</option>`).join('')}
            </select>
          </label>
          <label>
            ${state.t('amount')}
            <input name="amount" type="number" min="0" step="0.01" required />
          </label>
          <label>
            ${state.t('date')}
            <input name="date" type="date" value="${todayInputValue()}" required />
          </label>
          <label class="full">
            ${state.t('description')}
            <input name="description" type="text" maxlength="90" placeholder="Deposito mensual" />
          </label>
          <div class="full">
            <button class="primary-button" id="movement-submit" type="submit" ${state.accounts.length ? '' : 'disabled'}>${state.t('saveMovement')}</button>
            <button class="secondary-button is-hidden" id="movement-cancel-edit" type="button">${state.t('cancelEdit')}</button>
          </div>
        </form>
      </article>
    </section>

    <section class="table-card" style="margin-top:16px">
      <h2>${state.t('monthMovements')}</h2>
      ${movementList(state)}
    </section>
  `;
}
