import { FinanceService } from "./application/services/finance_service.js";
import { PreferencesService } from "./application/services/preferences_service.js";
import { BudgetUseCases } from "./domain/usecases/budget_use_cases.js";
import { LocalStorageFinanceRepository } from "./infrastructure/repositories/local_storage_finance_repository.js";
import { ChartManager } from "./presentation/components/chart_manager.js";
import { I18n } from "./presentation/components/i18n.js";
import { AppLoader } from "./presentation/components/loader.js";
import { AppModal } from "./presentation/components/modal.js";
import { bindSwipeActions } from "./presentation/components/swipe_actions.js";
import { ThemeManager } from "./presentation/components/theme_manager.js";
import { readAmount } from "./presentation/components/templates.js";
import { renderDashboard, drawDashboardCharts } from "./presentation/views/dashboard_view.js";
import { renderExpenses } from "./presentation/views/expenses_view.js";
import { renderIncome } from "./presentation/views/income_view.js";
import { renderReports, drawReportCharts } from "./presentation/views/reports_view.js";
import { renderSavings } from "./presentation/views/savings_view.js";
import { renderDataTools } from "./presentation/views/settings_view.js";
import { formatMonth, monthKeyFromDate, monthKeyToString, parseMonthKey, shiftMonth } from "./shared/utils/date_utils.js";
import { toNumber } from "./shared/utils/formatters.js";

const titleKeys = {
  dashboard: 'dashboard',
  expenses: 'expenses',
  income: 'incomeManagement',
  savings: 'savings',
  reports: 'reports'
};

class AppController {
  constructor() {
    const repository = new LocalStorageFinanceRepository();
    const useCases = new BudgetUseCases(repository);
    this.financeService = new FinanceService(repository, useCases);
    this.preferencesService = new PreferencesService();
    this.i18n = new I18n(this.preferencesService.getLanguageMode());
    this.themeManager = new ThemeManager(this.preferencesService.getThemeMode());
    this.loader = new AppLoader();
    this.chartManager = new ChartManager();
    this.route = 'dashboard';
    this.monthKey = monthKeyFromDate();
    this.hasSession = this.preferencesService.hasGuestSession();
    this.appShell = document.getElementById('app-shell');
    this.loginScreen = document.getElementById('login-screen');
    this.view = document.getElementById('app-view');
    this.title = document.getElementById('view-title');
    this.alertArea = document.getElementById('alert-area');
    this.monthPicker = document.getElementById('month-picker');
    this.themeSelect = document.getElementById('theme-select');
    this.languageSelect = document.getElementById('language-select');
    this.sidebar = document.querySelector('.sidebar');
    this.sidebarOverlay = document.getElementById('sidebar-overlay');
    this.menuToggle = document.getElementById('menu-toggle');
  }

  start() {
    this.bindChrome();
    this.applyStaticTranslations();
    this.renderAuthState();
    this.render();
  }

  bindChrome() {
    const closeMenu = () => {
      this.sidebar.classList.remove('open');
      this.sidebarOverlay.classList.remove('open');
    };

    this.menuToggle.addEventListener('click', () => {
      this.sidebar.classList.add('open');
      this.sidebarOverlay.classList.add('open');
    });

    this.sidebarOverlay.addEventListener('click', closeMenu);

    document.querySelectorAll('[data-route]').forEach(button => {
      button.addEventListener('click', () => {
        this.route = button.dataset.route;
        document.querySelectorAll('[data-route]').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        closeMenu();
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

    this.themeSelect.value = this.preferencesService.getThemeMode();
    this.themeSelect.addEventListener('change', () => {
      this.preferencesService.setThemeMode(this.themeSelect.value);
      this.themeManager.setThemeMode(this.themeSelect.value);
    });

    this.languageSelect.value = this.preferencesService.getLanguageMode();
    this.languageSelect.addEventListener('change', () => {
      this.preferencesService.setLanguageMode(this.languageSelect.value);
      this.i18n.setLanguageMode(this.languageSelect.value);
      this.applyStaticTranslations();
      this.render();
    });

    document.getElementById('guest-login').addEventListener('click', async () => {
      await this.loader.run(async () => {
        this.preferencesService.startGuestSession();
        this.hasSession = true;
        this.renderAuthState();
        this.render();
      }, this.i18n.t('loading'));
    });

    document.getElementById('login-form').addEventListener('submit', async event => {
      event.preventDefault();
      await AppModal.alert({
        title: this.i18n.t('authSoon'),
        message: this.i18n.t('guestButton'),
        type: 'info',
        confirmText: this.i18n.t('confirm')
      });
    });
  }

  render() {
    if (!this.hasSession) return;
    this.chartManager.destroyAll();
    const state = this.financeService.getMonthState(this.monthKey);
    state.t = this.i18n.t.bind(this.i18n);
    state.locale = this.i18n.locale;
    this.title.textContent = this.i18n.t(titleKeys[this.route]);
    this.monthPicker.value = monthKeyToString(this.monthKey);
    this.renderAlerts(state);

    if (this.route === 'dashboard') {
      this.view.innerHTML = renderDashboard(state);
      drawDashboardCharts(state, this.chartManager);
    }

    if (this.route === 'expenses') {
      this.view.innerHTML = renderExpenses(state);
      this.bindExpenseForm();
      this.bindExpenseSwipe();
    }

    if (this.route === 'income') {
      this.view.innerHTML = renderIncome(state);
      this.bindIncomeForm();
    }

    if (this.route === 'savings') {
      this.view.innerHTML = renderSavings(state);
      this.bindSavingsForms();
      this.bindMovementSwipe();
    }

    if (this.route === 'reports') {
      this.view.innerHTML = renderReports(state) + renderDataTools(state);
      drawReportCharts(state, this.chartManager);
      this.bindDataTools();
    }
  }

  renderAlerts(state) {
    const monthText = formatMonth(this.monthKey, this.i18n.locale);
    const missingIncome = !state.income
      ? `<div class="alert warning">${this.i18n.t('captureSalary', { month: monthText })}</div>`
      : '';
    const limitAlert = state.isOverLimit
      ? `<div class="alert danger">${this.i18n.t('overLimit')}</div>`
      : state.isNearLimit
        ? `<div class="alert warning">${this.i18n.t('nearLimit')}</div>`
        : '';
    this.alertArea.innerHTML = missingIncome + limitAlert;
  }

  applyStaticTranslations() {
    document.documentElement.lang = this.i18n.locale;
    document.title = this.i18n.t('appName');
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = this.i18n.t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      element.title = this.i18n.t(element.dataset.i18nTitle);
    });
  }

  renderAuthState() {
    this.loginScreen.classList.toggle('is-hidden', this.hasSession);
    this.appShell.classList.toggle('is-hidden', !this.hasSession);
  }

  bindIncomeForm() {
    document.getElementById('income-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget ?? event.target;
      const amount = readAmount(form);
      if (amount <= 0) return;
      await this.loader.run(async () => {
        this.financeService.saveIncome(amount, this.monthKey);
        form.reset();
        this.render();
      }, this.i18n.t('loading'));
    });
  }

  bindExpenseForm() {
    document.getElementById('expense-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget ?? event.target;
      const data = new FormData(form);
      const amount = readAmount(form);
      if (amount <= 0) return;
      const id = data.get('id');
      const payload = {
        id,
        date: data.get('date'),
        categoryId: data.get('categoryId'),
        amount,
        description: String(data.get('description') || '').trim()
      };
      await this.loader.run(async () => {
        if (id) {
          this.financeService.updateExpense(payload);
        } else {
          this.financeService.addExpense(payload);
        }
        this.monthKey = monthKeyFromDate(data.get('date'));
        form.reset();
        this.render();
      }, this.i18n.t('loading'));
    });

    document.getElementById('expense-cancel-edit').addEventListener('click', () => {
      this.resetExpenseForm();
    });
  }

  bindSavingsForms() {
    document.getElementById('account-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget ?? event.target;
      const data = new FormData(form);
      await this.loader.run(async () => {
        this.financeService.addAccount({
          name: String(data.get('name') || '').trim(),
          type: data.get('type')
        });
        form.reset();
        this.render();
      }, this.i18n.t('loading'));
    });

    document.getElementById('movement-form').addEventListener('submit', async event => {
      event.preventDefault();
      const form = event.currentTarget ?? event.target;
      const data = new FormData(form);
      const amount = toNumber(data.get('amount'));
      if (amount <= 0 || !data.get('accountId')) return;
      const id = data.get('id');
      const payload = {
        id,
        accountId: data.get('accountId'),
        type: data.get('type'),
        amount,
        date: data.get('date'),
        description: String(data.get('description') || '').trim()
      };
      await this.loader.run(async () => {
        if (id) {
          this.financeService.updateMovement(payload);
        } else {
          this.financeService.addMovement(payload);
        }
        this.monthKey = monthKeyFromDate(data.get('date'));
        form.reset();
        this.render();
      }, this.i18n.t('loading'));
    });

    document.getElementById('movement-cancel-edit').addEventListener('click', () => {
      this.resetMovementForm();
    });
  }

  bindExpenseSwipe() {
    bindSwipeActions({
      selector: '[data-swipe-kind="expense"]',
      onEdit: id => this.startEditingExpense(id),
      onDelete: id => this.confirmDeleteExpense(id)
    });
  }

  bindMovementSwipe() {
    bindSwipeActions({
      selector: '[data-swipe-kind="movement"]',
      onEdit: id => this.startEditingMovement(id),
      onDelete: id => this.confirmDeleteMovement(id)
    });
  }

  startEditingExpense(id) {
    const state = this.financeService.getMonthState(this.monthKey);
    const expense = state.expenses.find(item => item.id === id);
    const form = document.getElementById('expense-form');
    if (!expense || !form) return;
    form.elements.id.value = expense.id;
    form.elements.date.value = expense.date;
    form.elements.categoryId.value = expense.categoryId;
    form.elements.amount.value = expense.amount;
    form.elements.description.value = expense.description;
    document.getElementById('expense-submit').textContent = this.i18n.t('updateExpense');
    document.getElementById('expense-cancel-edit').classList.remove('is-hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  resetExpenseForm() {
    const form = document.getElementById('expense-form');
    if (!form) return;
    form.reset();
    form.elements.id.value = '';
    document.getElementById('expense-submit').textContent = this.i18n.t('addExpense');
    document.getElementById('expense-cancel-edit').classList.add('is-hidden');
  }

  async confirmDeleteExpense(id) {
    const confirmed = await AppModal.confirm({
      title: this.i18n.t('deleteExpenseTitle'),
      message: this.i18n.t('deleteExpenseMessage'),
      type: 'danger',
      confirmText: this.i18n.t('delete'),
      cancelText: this.i18n.t('cancel')
    });
    if (!confirmed) return;
    await this.loader.run(async () => {
      this.financeService.deleteExpense(id);
      this.render();
    }, this.i18n.t('loading'));
  }

  startEditingMovement(id) {
    const state = this.financeService.getMonthState(this.monthKey);
    const movement = state.movements.find(item => item.id === id);
    const form = document.getElementById('movement-form');
    if (!movement || !form) return;
    form.elements.id.value = movement.id;
    form.elements.accountId.value = movement.accountId;
    form.elements.type.value = movement.type;
    form.elements.amount.value = movement.amount;
    form.elements.date.value = movement.date;
    form.elements.description.value = movement.description;
    document.getElementById('movement-submit').textContent = this.i18n.t('updateMovement');
    document.getElementById('movement-cancel-edit').classList.remove('is-hidden');
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  resetMovementForm() {
    const form = document.getElementById('movement-form');
    if (!form) return;
    form.reset();
    form.elements.id.value = '';
    document.getElementById('movement-submit').textContent = this.i18n.t('saveMovement');
    document.getElementById('movement-cancel-edit').classList.add('is-hidden');
  }

  async confirmDeleteMovement(id) {
    const confirmed = await AppModal.confirm({
      title: this.i18n.t('deleteMovementTitle'),
      message: this.i18n.t('deleteMovementMessage'),
      type: 'danger',
      confirmText: this.i18n.t('delete'),
      cancelText: this.i18n.t('cancel')
    });
    if (!confirmed) return;
    await this.loader.run(async () => {
      this.financeService.deleteMovement(id);
      this.render();
    }, this.i18n.t('loading'));
  }

  bindDataTools() {
    document.getElementById('clear-data').addEventListener('click', async () => {
      const confirmed = await AppModal.confirm({
        title: this.i18n.t('clearDataTitle'),
        message: this.i18n.t('clearDataMessage'),
        type: 'danger',
        confirmText: this.i18n.t('clearDataConfirm'),
        cancelText: this.i18n.t('keepData')
      });
      if (!confirmed) return;
      await this.loader.run(async () => {
        this.financeService.clearAll();
        this.render();
      }, this.i18n.t('loading'));
      await AppModal.success(this.i18n.t('dataDeleted'), this.i18n.t('ready'));
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AppController().start();
});
