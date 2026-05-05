export const MovementType = Object.freeze({
  DEPOSIT: 'deposito',
  WITHDRAWAL: 'retiro',
  RETURN: 'rendimiento'
});

export class Movement {
  constructor({ id, accountId, type, amount, date, description, month, year }) {
    this.id = id;
    this.accountId = accountId;
    this.type = type;
    this.amount = amount;
    this.date = date;
    this.description = description;
    this.month = month;
    this.year = year;
  }

  get signedAmount() {
    return this.type === MovementType.WITHDRAWAL ? -this.amount : this.amount;
  }
}
