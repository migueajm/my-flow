export class Expense {
  constructor({ id, date, categoryId, amount, description, month, year }) {
    this.id = id;
    this.date = date;
    this.categoryId = categoryId;
    this.amount = amount;
    this.description = description;
    this.month = month;
    this.year = year;
  }
}
