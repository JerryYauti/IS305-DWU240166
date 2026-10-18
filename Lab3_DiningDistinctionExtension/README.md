/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: CreditDiningAccount extends DiningAccount and allows controlled
  negative balances within a credit limit.
*/

const DiningAccount = require('./DiningAccount');

class CreditDiningAccount extends DiningAccount {
  #creditLimit;

  constructor(accountNumber, openingBalance = 0, creditLimit = 0) {
    super(accountNumber, openingBalance);
    if (creditLimit < 0) {
      throw new Error('Credit limit cannot be negative.');
    }
    this.#creditLimit = Number(creditLimit);
  }

  get creditLimit() {
    return this.#creditLimit;
  }

  payForMeal(amount, description = 'Meal Payment') {
    if (amount <= 0) {
      throw new Error('Meal payment amount must be greater than zero.');
    }

    const newBalance = this.getBalance() - Number(amount);
    if (newBalance < -this.#creditLimit) {
      return false;
    }

    this._setBalance(newBalance);
    this._recordTransaction('Meal Payment', Number(amount), description);
    return true;
  }

  displayAccountSummary() {
    return `========================================\n` +
      `          CREDIT DINING ACCOUNT\n` +
      `========================================\n` +
      `Account Number: ${this.accountNumber}\n` +
      `Account Type: ${this.constructor.name}\n` +
      `Current Balance: K${this.getBalance().toFixed(2)}\n` +
      `Credit Limit: K${this.#creditLimit.toFixed(2)}\n` +
      `========================================`;
  }
}

module.exports = CreditDiningAccount;
