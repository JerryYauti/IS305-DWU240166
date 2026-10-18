/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: RewardsDiningAccount inherits from DiningAccount and adds reward
  calculation and application.
*/

const DiningAccount = require('./DiningAccount');

class RewardsDiningAccount extends DiningAccount {
  #rewardRate;

  constructor(accountNumber, openingBalance = 0, rewardRate = 0) {
    super(accountNumber, openingBalance);
    if (rewardRate < 0) {
      throw new Error('Reward rate cannot be negative.');
    }
    this.#rewardRate = Number(rewardRate);
  }

  get rewardRate() {
    return this.#rewardRate;
  }

  calculateReward() {
    return (this.getBalance() * this.#rewardRate) / 100;
  }

  applyReward() {
    const reward = this.calculateReward();
    if (reward > 0) {
      this.deposit(reward, 'Reward earned');
    }
    return reward;
  }

  displayAccountSummary() {
    return `========================================\n` +
      `         REWARDS DINING ACCOUNT\n` +
      `========================================\n` +
      `Account Number: ${this.accountNumber}\n` +
      `Account Type: ${this.constructor.name}\n` +
      `Current Balance: K${this.getBalance().toFixed(2)}\n` +
      `Reward Rate: ${this.#rewardRate}%\n` +
      `========================================`;
  }
}

module.exports = RewardsDiningAccount;
