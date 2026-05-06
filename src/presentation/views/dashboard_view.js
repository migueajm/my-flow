import { metricCard, expenseList } from "../components/templates.js";
import { formatCurrency } from "../../shared/utils/formatters.js";

export function renderDashboard(state) {
  return `
    <section class="grid four">
      ${metricCard(state.t('incomeMonthly'), state.salary, '', state.locale)}
      ${metricCard(state.t('expenseBudget'), state.expenseBudget, `${state.t('remaining')} ${formatCurrency(state.expenseRemaining, state.locale)}`, state.locale)}
      ${metricCard(state.t('spent'), state.expenseTotal, '', state.locale)}
      ${metricCard(state.t('savingsBudget'), state.savingsBudget, `${state.t('available')} ${formatCurrency(state.savingsRemaining, state.locale)}`, state.locale)}
    </section>

    <section class="panel" style="margin-top:16px">
      <h2>${state.t('budgetUsage')}</h2>
      <div class="progress"><span style="--value:${Math.round(state.usagePercent * 100)}%"></span></div>
      <p class="muted" style="margin-top:8px">${Math.round(state.usagePercent * 100)}% ${state.t('usedBlock')}</p>
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>${state.t('categoryDistribution')}</h2>
        <div class="chart-box"><canvas id="pie-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>${state.t('latestExpenses')}</h2>
        ${expenseList(state, 5)}
      </article>
    </section>
  `;
}

export function drawDashboardCharts(state, chartManager) {
  chartManager.render('pie-chart', {
    type: 'pie',
    data: {
      labels: state.categoryTotals.map(item => item.label),
      datasets: [{
        data: state.categoryTotals.map(item => item.total),
        backgroundColor: state.categoryTotals.map(item => item.color)
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}
