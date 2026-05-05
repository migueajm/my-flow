import { formatCurrency } from "../../shared/utils/formatters.js";
import { metricCard } from "../components/templates.js";

export function renderReports(state) {
  return `
    <section class="grid four">
      ${metricCard('Ingreso', state.salary)}
      ${metricCard('Gastos', state.expenseTotal)}
      ${metricCard('Ahorros/Inversiones', state.savingsTotal)}
      ${metricCard('Disponible gastos', state.expenseRemaining)}
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>Pastel: distribucion de gastos</h2>
        <div class="chart-box"><canvas id="report-pie-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>Barras: gastos diarios</h2>
        <div class="chart-box"><canvas id="daily-bar-chart"></canvas></div>
      </article>
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>Barras: gastos semanales</h2>
        <div class="chart-box"><canvas id="weekly-bar-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>Lineas: evolucion mensual</h2>
        <p class="muted">Gastos vs ahorros/inversiones. Total ahorro actual: ${formatCurrency(state.savingsTotal)}</p>
        <div class="chart-box"><canvas id="monthly-line-chart"></canvas></div>
      </article>
    </section>
  `;
}

export function drawReportCharts(state, chartManager) {
  chartManager.render('report-pie-chart', {
    type: 'pie',
    data: {
      labels: state.categoryTotals.map(item => item.label),
      datasets: [{
        data: state.categoryTotals.map(item => item.total),
        backgroundColor: state.categoryTotals.map(item => item.color)
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  chartManager.render('daily-bar-chart', {
    type: 'bar',
    data: {
      labels: state.dailyTotals.map(item => item.label),
      datasets: [{
        label: 'Gastos diarios',
        data: state.dailyTotals.map(item => item.total),
        backgroundColor: '#1d7a64'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  chartManager.render('weekly-bar-chart', {
    type: 'bar',
    data: {
      labels: state.weeklyTotals.map(item => item.label),
      datasets: [{
        label: 'Gastos semanales',
        data: state.weeklyTotals.map(item => item.total),
        backgroundColor: '#457B9D'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  chartManager.render('monthly-line-chart', {
    type: 'line',
    data: {
      labels: state.monthlyComparison.map(item => item.label),
      datasets: [
        {
          label: 'Gastos',
          data: state.monthlyComparison.map(item => item.expenses),
          borderColor: '#c2413a',
          backgroundColor: 'rgba(194,65,58,.12)',
          tension: 0.35
        },
        {
          label: 'Ahorros/Inversiones',
          data: state.monthlyComparison.map(item => item.savings),
          borderColor: '#1d7a64',
          backgroundColor: 'rgba(29,122,100,.12)',
          tension: 0.35
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
