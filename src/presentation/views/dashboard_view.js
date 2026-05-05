import { metricCard, expenseList } from "../components/templates.js";
import { formatCurrency } from "../../shared/utils/formatters.js";

export function renderDashboard(state) {
  return `
    <section class="grid four">
      ${metricCard('Ingreso mensual', state.salary)}
      ${metricCard('80% para gastos', state.expenseBudget, `Queda ${formatCurrency(state.expenseRemaining)}`)}
      ${metricCard('Gastado', state.expenseTotal)}
      ${metricCard('20% ahorro/inversion', state.savingsBudget, `Disponible ${formatCurrency(state.savingsRemaining)}`)}
    </section>

    <section class="panel" style="margin-top:16px">
      <h2>Uso del presupuesto de gastos</h2>
      <div class="progress"><span style="--value:${Math.round(state.usagePercent * 100)}%"></span></div>
      <p class="muted" style="margin-top:8px">${Math.round(state.usagePercent * 100)}% usado del bloque de gastos.</p>
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>Distribucion por categoria</h2>
        <div class="chart-box"><canvas id="pie-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>Ultimos gastos</h2>
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
