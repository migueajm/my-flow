export const AccountType = Object.freeze({
  SAVINGS: 'ahorro',
  INVESTMENT: 'inversion'
});

export class SavingsAccount {
  constructor({ id, name, type, createdAt }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.createdAt = createdAt;
  }
}
