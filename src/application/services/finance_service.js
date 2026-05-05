import { MovementType } from "../../domain/entities/movement.js";
import { getWeekOfMonth, monthKeyToString } from "../../shared/utils/date_utils.js";

export class FinanceService {
  constructor(repository, budgetUseCases) {
    this.repository = repository;
    this.budgetUseCases = budgetUseCases;
  }

  getMonthState(monthKey) {
    const categories = this.repository.getCategories();
    const accounts = this.repository.getAccounts();
    const income = this.repository.getIncomeByMonth(monthKey);
    const expenses = this.repository.getExpensesByMonth(monthKey);
    const movements = this.repository.getMovementsByMonth(monthKey);
    const expenseTotal = expenses.reduce((total, expense) => total + expense.amount, 0);
    const savingsTotal = movements.reduce((total, movement) => total + movement.signedAmount, 0);
    const expenseBudget = income?.expenseBudget ?? 0;
    const savingsBudget = income?.savingsBudget ?? 0;

    return {
      monthKey,
      categories,
      accounts,
      income,
      expenses,
      movements,
      salary: income?.amount ?? 0,
      expenseBudget,
      savingsBudget,
      expenseTotal,
      savingsTotal,
      expenseRemaining: expenseBudget - expenseTotal,
      savingsRemaining: savingsBudget - savingsTotal,
      usagePercent: expenseBudget > 0 ? Math.min(expenseTotal / expenseBudget, 1) : 0,
      isNearLimit: expenseBudget > 0 && expenseTotal / expenseBudget >= 0.85,
      isOverLimit: expenseBudget > 0 && expenseTotal > expenseBudget,
      categoryTotals: this.getCategoryTotals(categories, expenses),
      dailyTotals: this.getDailyTotals(expenses),
      weeklyTotals: this.getWeeklyTotals(expenses),
      monthlyComparison: this.getMonthlyComparison()
    };
  }

  saveIncome(amount, monthKey) {
    return this.budgetUseCases.saveMonthlyIncome(amount, monthKey);
  }

  addExpense(payload) {
    return this.budgetUseCases.addExpense(payload);
  }

  addAccount(payload) {
    return this.budgetUseCases.addAccount(payload);
  }

  addMovement(payload) {
    return this.budgetUseCases.addMovement(payload);
  }

  getCategoryTotals(categories, expenses) {
    const totals = new Map();
    for (const expense of expenses) {
      totals.set(expense.categoryId, (totals.get(expense.categoryId) || 0) + expense.amount);
    }
    return [...totals.entries()]
      .map(([categoryId, total]) => {
        const category = categories.find(item => item.id === categoryId);
        return {
          categoryId,
          label: category?.name ?? 'Categoria',
          color: category?.color ?? '#6C757D',
          total
        };
      })
      .sort((a, b) => b.total - a.total);
  }

  getDailyTotals(expenses) {
    const totals = new Map();
    for (const expense of expenses) {
      const label = String(new Date(expense.date).getDate()).padStart(2, '0');
      totals.set(label, (totals.get(label) || 0) + expense.amount);
    }
    return [...totals.entries()]
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([label, total]) => ({ label, total }));
  }

  getWeeklyTotals(expenses) {
    const totals = new Map();
    for (const expense of expenses) {
      const label = `Semana ${getWeekOfMonth(expense.date)}`;
      totals.set(label, (totals.get(label) || 0) + expense.amount);
    }
    return [...totals.entries()]
      .sort(([a], [b]) => Number(a.replace('Semana ', '')) - Number(b.replace('Semana ', '')))
      .map(([label, total]) => ({ label, total }));
  }

  getMonthlyComparison() {
    const incomes = this.repository.getAllIncomes();
    const expenses = this.repository.getAllExpenses();
    const movements = this.repository.getAllMovements();

    return incomes
      .sort((a, b) => monthKeyToString(a).localeCompare(monthKeyToString(b)))
      .slice(-6)
      .map(income => {
        const sameMonth = row => row.month === income.month && row.year === income.year;
        return {
          label: `${String(income.month).padStart(2, '0')}/${income.year}`,
          income: income.amount,
          expenses: expenses.filter(sameMonth).reduce((sum, expense) => sum + expense.amount, 0),
          savings: movements.filter(sameMonth).reduce((sum, movement) => {
            return sum + (movement.type === MovementType.WITHDRAWAL ? -movement.amount : movement.amount);
          }, 0)
        };
      });
  }

  clearAll() {
    this.repository.clearAll();
  }
}
