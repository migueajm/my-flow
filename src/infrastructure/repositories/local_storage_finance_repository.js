import { FinanceRepository } from "../../domain/repositories/finance_repository.js";
import { Category } from "../../domain/entities/category.js";
import { Expense } from "../../domain/entities/expense.js";
import { Income } from "../../domain/entities/income.js";
import { Movement } from "../../domain/entities/movement.js";
import { SavingsAccount } from "../../domain/entities/savings_account.js";
import { SecureStorageManager } from "../storage/secure_storage_manager.js";

const DEFAULT_CATEGORIES = [
  { id: 'cat_food', name: 'Comida', color: '#E76F51', icon: 'CO' },
  { id: 'cat_transport', name: 'Transporte', color: '#457B9D', icon: 'TR' },
  { id: 'cat_home', name: 'Vivienda', color: '#2A9D8F', icon: 'VI' },
  { id: 'cat_services', name: 'Servicios', color: '#E9C46A', icon: 'SE' },
  { id: 'cat_health', name: 'Salud', color: '#8AB17D', icon: 'SA' },
  { id: 'cat_fun', name: 'Ocio', color: '#9B5DE5', icon: 'OC' },
  { id: 'cat_other', name: 'Otros', color: '#6C757D', icon: 'OT' }
];

export class LocalStorageFinanceRepository extends FinanceRepository {
  constructor(storage = new SecureStorageManager('my-flow-migueajm')) {
    super();
    this.storage = storage;
    this._ensureSeedData();
  }

  _ensureSeedData() {
    if (!this.storage.get('categories')) {
      this.storage.set('categories', DEFAULT_CATEGORIES);
    }
    for (const key of ['incomes', 'expenses', 'accounts', 'movements']) {
      if (!this.storage.get(key)) this.storage.set(key, []);
    }
  }

  _readCollection(key) {
    return this.storage.get(key, []);
  }

  _writeCollection(key, rows) {
    this.storage.set(key, rows);
  }

  getCategories() {
    return this._readCollection('categories').map(item => new Category(item));
  }

  saveIncome(income) {
    const incomes = this._readCollection('incomes');
    const next = incomes.filter(item => !(item.month === income.month && item.year === income.year));
    next.push(income);
    this._writeCollection('incomes', next);
  }

  getIncomeByMonth(monthKey) {
    const item = this._readCollection('incomes')
      .find(row => row.month === monthKey.month && row.year === monthKey.year);
    return item ? new Income(item) : null;
  }

  getAllIncomes() {
    return this._readCollection('incomes').map(item => new Income(item));
  }

  addExpense(expense) {
    const expenses = this._readCollection('expenses');
    expenses.push(expense);
    this._writeCollection('expenses', expenses);
  }

  updateExpense(expense) {
    const expenses = this._readCollection('expenses');
    this._writeCollection(
      'expenses',
      expenses.map(item => item.id === expense.id ? expense : item)
    );
  }

  deleteExpense(expenseId) {
    const expenses = this._readCollection('expenses');
    this._writeCollection('expenses', expenses.filter(item => item.id !== expenseId));
  }

  getExpensesByMonth(monthKey) {
    return this._readCollection('expenses')
      .filter(row => row.month === monthKey.month && row.year === monthKey.year)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(item => new Expense(item));
  }

  getAllExpenses() {
    return this._readCollection('expenses').map(item => new Expense(item));
  }

  addAccount(account) {
    const accounts = this._readCollection('accounts');
    accounts.push(account);
    this._writeCollection('accounts', accounts);
  }

  getAccounts() {
    return this._readCollection('accounts')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(item => new SavingsAccount(item));
  }

  addMovement(movement) {
    const movements = this._readCollection('movements');
    movements.push(movement);
    this._writeCollection('movements', movements);
  }

  updateMovement(movement) {
    const movements = this._readCollection('movements');
    this._writeCollection(
      'movements',
      movements.map(item => item.id === movement.id ? movement : item)
    );
  }

  deleteMovement(movementId) {
    const movements = this._readCollection('movements');
    this._writeCollection('movements', movements.filter(item => item.id !== movementId));
  }

  getMovementsByMonth(monthKey) {
    return this._readCollection('movements')
      .filter(row => row.month === monthKey.month && row.year === monthKey.year)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(item => new Movement(item));
  }

  getAllMovements() {
    return this._readCollection('movements').map(item => new Movement(item));
  }

  clearAll() {
    this.storage.clearAll();
    this._ensureSeedData();
  }
}
