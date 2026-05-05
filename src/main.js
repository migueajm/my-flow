import { FinanceService } from "./application/services/finance_service.js";
import { BudgetUseCases } from "./domain/usecases/budget_use_cases.js";
import { LocalStorageFinanceRepository } from "./infrastructure/repositories/local_storage_finance_repository.js";
import { ChartManager } from "./presentation/components/chart_manager.js";
import { readAmount } from "./presentation/components/templates.js";
import { renderDashboard, drawDashboardCharts } from "./presentation/views/dashboard_view.js";
import { renderExpenses } from "./presentation/views/expenses_view.js";
import { renderIncome } from "./presentation/views/income_view.js";
import { renderReports, drawReportCharts } from "./presentation/views/reports_view.js";
import { renderSavings } from "./presentation/views/savings_view.js";
import { renderDataTools } from "./presentation/views/settings_view.js";
import { formatMonth, monthKeyFromDate, monthKeyToString, parseMonthKey, shiftMonth } from "./shared/utils/date_utils.js";
import { toNumber } from "./shared/utils/formatters.js";

const titles = {
  dashboard: 'Dashboard',
  expenses: 'Registro de gastos',
  income: 'Gestion de ingresos',
  savings: 'Ahorros e inversiones',
  reports: 'Reportes'
};

class AppController {
  constructor() {
    const repository = new LocalStorageFinanceRepository();
    const useCases = new BudgetUseCases(repository);
    this.financeService = new FinanceService(repository, useCases);
    this.chartManager = new ChartManager();
    this.route = 'dashboard';
    this.monthKey = monthKeyFromDate();
    this.view = document.getElementById('app-view');
    this.title = document.getElementById('view-title');
    this.alertArea = document.getElementById('alert-area');
    this.monthPicker = document.getElementById('month-picker');
  }

  start() {
    this.bindChrome();
    this.render();
  }

  bindChrome() {
    document.querySelectorAll('[data-route]').forEach(button => {
      button.addEventListener('click', () => {
        this.route = button.dataset.route;
        document.querySelectorAll('[data-route]').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        this.render();
      });
    });

    document.getElementById('previous-month').addEventListener('click', () => {
      this.monthKey = shiftMonth(this.monthKey, -1);
      this.render();
    });

    document.getElementById('next-month').addEventListener('click', () => {
      this.monthKey = shiftMonth(this.monthKey, 1);
      this.render();
    });

    this.monthPicker.addEventListener('change', () => {
      this.monthKey = parseMonthKey(this.monthPicker.value);
      this.render();
    });
  }

  render() {
    this.chartManager.destroyAll();
    const state = this.financeService.getMonthState(this.monthKey);
    this.title.textContent = titles[this.route];
    this.monthPicker.value = monthKeyToString(this.monthKey);
    this.renderAlerts(state);

    if (this.route === 'dashboard') {
      this.view.innerHTML = renderDashboard(state);
      drawDashboardCharts(state, this.chartManager);
    }

    if (this.route === 'expenses') {
      this.view.innerHTML = renderExpenses(state);
      this.bindExpenseForm();
    }

    if (this.route === 'income') {
      this.view.innerHTML = renderIncome(state);
      this.bindIncomeForm();
    }

    if (this.route === 'savings') {
      this.view.innerHTML = renderSavings(state);
      this.bindSavingsForms();
    }

    if (this.route === 'reports') {
      this.view.innerHTML = renderReports(state) + renderDataTools();
      drawReportCharts(state, this.chartManager);
      this.bindDataTools();
    }
  }

  renderAlerts(state) {
    const monthText = formatMonth(this.monthKey);
    const missingIncome = !state.income
      ? `<div class="alert warning">Captura tu salario de ${monthText} para activar el presupuesto 80/20.</div>`
      : '';
    const limitAlert = state.isOverLimit
      ? '<div class="alert danger">Has excedido el presupuesto de gastos del mes.</div>'
      : state.isNearLimit
        ? '<div class="alert warning">Estas cerca de exceder el presupuesto de gastos.</div>'
        : '';
    this.alertArea.innerHTML = missingIncome + limitAlert;
  }

  bindIncomeForm() {
    document.getElementById('income-form').addEventListener('submit', event => {
      event.preventDefault();
      const amount = readAmount(event.currentTarget);
      if (amount <= 0) return;
      this.financeService.saveIncome(amount, this.monthKey);
      event.currentTarget.reset();
      this.render();
    });
  }

  bindExpenseForm() {
    document.getElementById('expense-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const amount = readAmount(event.currentTarget);
      if (amount <= 0) return;
      this.financeService.addExpense({
        date: data.get('date'),
        categoryId: data.get('categoryId'),
        amount,
        description: String(data.get('description') || '').trim()
      });
      this.monthKey = monthKeyFromDate(data.get('date'));
      event.currentTarget.reset();
      this.render();
    });
  }

  bindSavingsForms() {
    document.getElementById('account-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      this.financeService.addAccount({
        name: String(data.get('name') || '').trim(),
        type: data.get('type')
      });
      event.currentTarget.reset();
      this.render();
    });

    document.getElementById('movement-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const amount = toNumber(data.get('amount'));
      if (amount <= 0 || !data.get('accountId')) return;
      this.financeService.addMovement({
        accountId: data.get('accountId'),
        type: data.get('type'),
        amount,
        date: data.get('date'),
        description: String(data.get('description') || '').trim()
      });
      this.monthKey = monthKeyFromDate(data.get('date'));
      event.currentTarget.reset();
      this.render();
    });
  }

  bindDataTools() {
    document.getElementById('clear-data').addEventListener('click', () => {
      const confirmed = window.confirm('Esto eliminara los datos locales de la app. Deseas continuar?');
      if (!confirmed) return;
      this.financeService.clearAll();
      this.render();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AppController().start();
});
