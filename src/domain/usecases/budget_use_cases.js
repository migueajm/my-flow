import { Income } from "../entities/income.js";
import { Expense } from "../entities/expense.js";
import { Movement } from "../entities/movement.js";
import { monthKeyFromDate } from "../../shared/utils/date_utils.js";
import { uid } from "../../shared/utils/formatters.js";

export class BudgetUseCases {
  constructor(repository) {
    this.repository = repository;
  }

  saveMonthlyIncome(amount, monthKey) {
    const income = new Income({
      id: `${monthKey.year}-${monthKey.month}`,
      amount,
      expenseBudget: amount * 0.8,
      savingsBudget: amount * 0.2,
      month: monthKey.month,
      year: monthKey.year,
      createdAt: new Date().toISOString()
    });
    this.repository.saveIncome(income);
    return income;
  }

  addExpense({ date, categoryId, amount, description }) {
    const key = monthKeyFromDate(date);
    const expense = new Expense({
      id: uid('expense'),
      date,
      categoryId,
      amount,
      description,
      month: key.month,
      year: key.year
    });
    this.repository.addExpense(expense);
    return expense;
  }

  updateExpense({ id, date, categoryId, amount, description }) {
    const key = monthKeyFromDate(date);
    const expense = new Expense({
      id,
      date,
      categoryId,
      amount,
      description,
      month: key.month,
      year: key.year
    });
    this.repository.updateExpense(expense);
    return expense;
  }

  deleteExpense(expenseId) {
    this.repository.deleteExpense(expenseId);
  }

  addAccount({ name, type }) {
    const account = {
      id: uid('account'),
      name,
      type,
      createdAt: new Date().toISOString()
    };
    this.repository.addAccount(account);
    return account;
  }

  addMovement({ accountId, type, amount, date, description }) {
    const key = monthKeyFromDate(date);
    const movement = new Movement({
      id: uid('movement'),
      accountId,
      type,
      amount,
      date,
      description,
      month: key.month,
      year: key.year
    });
    this.repository.addMovement(movement);
    return movement;
  }

  updateMovement({ id, accountId, type, amount, date, description }) {
    const key = monthKeyFromDate(date);
    const movement = new Movement({
      id,
      accountId,
      type,
      amount,
      date,
      description,
      month: key.month,
      year: key.year
    });
    this.repository.updateMovement(movement);
    return movement;
  }

  deleteMovement(movementId) {
    this.repository.deleteMovement(movementId);
  }
}
