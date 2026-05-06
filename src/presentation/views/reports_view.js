import { formatCurrency } from "../../shared/utils/formatters.js";
import { metricCard } from "../components/templates.js";

export function renderReports(state) {
  return `
    <section class="grid four">
      ${metricCard(state.t('income'), state.salary, '', state.locale)}
      ${metricCard(state.t('expenses'), state.expenseTotal, '', state.locale)}
      ${metricCard(state.t('savings'), state.savingsTotal, '', state.locale)}
      ${metricCard(state.t('available'), state.expenseRemaining, '', state.locale)}
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>${state.t('pieReport')}</h2>
        <div class="chart-box"><canvas id="report-pie-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>${state.t('dailyBars')}</h2>
        <div class="chart-box"><canvas id="daily-bar-chart"></canvas></div>
      </article>
    </section>

    <section class="grid two" style="margin-top:16px">
      <article class="panel">
        <h2>${state.t('weeklyBars')}</h2>
        <div class="chart-box"><canvas id="weekly-bar-chart"></canvas></div>
      </article>
      <article class="panel">
        <h2>${state.t('monthlyLines')}</h2>
        <p class="muted">${state.t('monthlyLinesHelp')} ${formatCurrency(state.savingsTotal, state.locale)}</p>
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
        label: state.t('dailyBars'),
        data: state.dailyTotals.map(item => item.total),
        backgroundColor: '#2196f3'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  chartManager.render('weekly-bar-chart', {
    type: 'bar',
    data: {
      labels: state.weeklyTotals.map(item => item.label),
      datasets: [{
        label: state.t('weeklyBars'),
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
          label: state.t('expenses'),
          data: state.monthlyComparison.map(item => item.expenses),
          borderColor: '#c2413a',
          backgroundColor: 'rgba(194,65,58,.12)',
          tension: 0.35
        },
        {
          label: state.t('savings'),
          data: state.monthlyComparison.map(item => item.savings),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33,150,243,.12)',
          tension: 0.35
        }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });
}
