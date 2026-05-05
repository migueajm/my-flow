export class Income {
  constructor({ id, amount, expenseBudget, savingsBudget, month, year, createdAt }) {
    this.id = id;
    this.amount = amount;
    this.expenseBudget = expenseBudget;
    this.savingsBudget = savingsBudget;
    this.month = month;
    this.year = year;
    this.createdAt = createdAt;
  }
}
