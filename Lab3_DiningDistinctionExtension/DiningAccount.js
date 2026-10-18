/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: DiningAccount base class with deposit, payment, balance and
  transaction support. Demonstrates default parameters and simulated overload.
*/

class DiningAccount {
  #accountNumber;
  #balance;
  #transactions;

  constructor(accountNumber, openingBalance = 0) {
    if (!accountNumber || accountNumber.toString().trim() === '') {
      throw new Error('Account number cannot be empty.');
    }
    if (openingBalance < 0) {
      throw new Error('Opening balance cannot be negative.');
    }

    this.#accountNumber = accountNumber.toString().trim();
    this.#balance = Number(openingBalance);
    this.#transactions = [];
    this._recordTransaction('Deposit', Number(openingBalance), 'Opening balance');
  }

  get accountNumber() {
    return this.#accountNumber;
  }

  get balance() {
    return this.#balance;
  }

  get transactions() {
    return this.#transactions;
  }

  getBalance() {
    return this.#balance;
  }

  getTransactions() {
    return this.#transactions.map(tx => ({ ...tx }));
  }

  _recordTransaction(type, amount, description = 'Transaction') {
    this.#transactions.push({
      type,
      amount: Number(amount),
      description,
      timestamp: new Date().toISOString(),
      balanceAfter: Number(this.#balance),
    });
  }

  _setBalance(value) {
    this.#balance = value;
  }

  deposit(amount, description = 'Deposit') {
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero.');
    }
    this.#balance += Number(amount);
    this._recordTransaction('Deposit', Number(amount), description);
    return this.#balance;
  }

  payForMeal(amount, description = 'Meal Payment') {
    if (amount <= 0) {
      throw new Error('Meal payment amount must be greater than zero.');
    }
    if (this.#balance < amount) {
      return false;
    }
    this.#balance -= Number(amount);
    this._recordTransaction('Meal Payment', Number(amount), description);
    return true;
  }

  displayAccountSummary() {
    return `========================================\n` +
      `          STANDARD DINING ACCOUNT\n` +
      `========================================\n` +
      `Account Number: ${this.#accountNumber}\n` +
      `Account Type: ${this.constructor.name}\n` +
      `Current Balance: K${this.#balance.toFixed(2)}\n` +
      `========================================`;
  }
}

module.exports = DiningAccount;
