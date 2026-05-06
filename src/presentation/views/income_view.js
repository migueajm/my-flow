import { metricCard } from "../components/templates.js";

export function renderIncome(state) {
  return `
    <section class="grid two">
      <article class="panel">
        <h2>${state.t('incomeManagement')}</h2>
        <form id="income-form" class="form-grid">
          <label class="full">
            ${state.t('monthlySalary')}
            <input name="amount" type="number" min="0" step="0.01" placeholder="25000" required />
          </label>
          <div class="full">
            <button class="primary-button" type="submit">${state.t('saveIncome')}</button>
          </div>
        </form>
      </article>
      <article class="panel">
        <h2>${state.t('autoRule')}</h2>
        <p>${state.t('autoRuleText')}</p>
      </article>
    </section>

    <section class="grid three" style="margin-top:16px">
      ${metricCard(state.t('salary'), state.salary, '', state.locale)}
      ${metricCard(state.t('expenseBudget'), state.expenseBudget, '', state.locale)}
      ${metricCard(state.t('savingsBudget'), state.savingsBudget, '', state.locale)}
    </section>
  `;
}
