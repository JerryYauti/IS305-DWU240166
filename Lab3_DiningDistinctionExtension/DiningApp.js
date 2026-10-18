/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: Console application demonstrates dining account inheritance,
  polymorphism, Student and MealBooking integration, and transaction processing.
*/

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const Student = require('./Student');
const MealBooking = require('./MealBooking');
const DiningAccount = require('./DiningAccount');
const RewardsDiningAccount = require('./RewardsDiningAccount');
const CreditDiningAccount = require('./CreditDiningAccount');

const rl = readline.createInterface({ input, output });

function displayAccountTransactions(account) {
  const transactions = account.getTransactions();
  console.log('\n========================================');
  console.log('          TRANSACTION HISTORY');
  console.log('========================================');
  transactions.forEach((tx, index) => {
    console.log(`${index + 1}. ${tx.type} - K${Number(tx.amount).toFixed(2)}`);
    console.log(`   Description: ${tx.description}`);
    console.log(`   Balance: K${Number(tx.balanceAfter).toFixed(2)}`);
  });
  console.log(`Total Transactions: ${transactions.length}`);
  console.log('========================================\n');
}

function displayBookingHistory(student, bookingsArray) {
  const matches = bookingsArray.filter(b => b.student && b.student.studentId === student.studentId);
  if (matches.length === 0) {
    console.log('No bookings found for this student.');
    return;
  }

  let total = 0;
  matches.forEach((b, index) => {
    const cost = b.calculateTotal();
    total += cost;
    console.log(`${index + 1}. ${b.mealType} - ${b.mealDate}`);
    console.log(`   Quantity: ${b.quantity}`);
    console.log(`   Status: ${b.bookingStatus}`);
    console.log(`   Cost: K${cost.toFixed(2)}`);
  });
  console.log(`Total Bookings: ${matches.length}`);
  console.log(`Combined Cost: K${total.toFixed(2)}`);
}

function runPart1Demos() {
  console.log('\n========================================');
  console.log('       STANDARD DINING ACCOUNT');
  console.log('========================================');
  const standard = new DiningAccount('DA001', 1000);
  standard.deposit(500, 'Weekly meal allowance');
  const paymentSuccess = standard.payForMeal(200, 'Lunch booking');
  console.log(`Account Number: ${standard.accountNumber}`);
  console.log(`Opening Balance: K${1000.00.toFixed(2)}`);
  console.log(`Deposit: K${500.00.toFixed(2)}`);
  console.log(`Meal Payment: K${200.00.toFixed(2)}`);
  console.log(`Payment Status: ${paymentSuccess ? 'Successful' : 'Rejected'}`);
  console.log(`Final Balance: K${standard.getBalance().toFixed(2)}`);
  console.log('========================================\n');

  console.log('========================================');
  console.log('        REWARDS DINING ACCOUNT');
  console.log('========================================');
  const rewards = new RewardsDiningAccount('RA001', 1500, 2.5);
  rewards.deposit(500, 'Bonus funds');
  const reward = rewards.calculateReward();
  console.log(`Account Number: ${rewards.accountNumber}`);
  console.log(`Balance Before Reward: K${rewards.getBalance().toFixed(2)}`);
  console.log(`Reward Rate: ${rewards.rewardRate}%`);
  console.log(`Reward Earned: K${reward.toFixed(2)}`);
  rewards.applyReward();
  console.log(`Final Balance: K${rewards.getBalance().toFixed(2)}`);
  console.log('========================================\n');
}

function runPart2Tests() {
  console.log('Running required Lab 3 tests...\n');

  // Standard account payment succeeds
  try {
    const account = new DiningAccount('DA010', 100);
    const ok = account.payForMeal(50, 'Lunch');
    console.log('Test 1 (Standard payment) ' + (ok ? 'PASSED' : 'FAILED'));
    console.log(`Balance: K${account.getBalance().toFixed(2)}`);
  } catch (e) {
    console.log('Test 1 failed:', e.message);
  }

  // Insufficient standard balance
  try {
    const account = new DiningAccount('DA011', 60);
    const ok = account.payForMeal(100, 'Lunch');
    console.log('Test 2 (Insufficient funds) ' + (!ok ? 'PASSED' : 'FAILED'));
    console.log(`Balance remains: K${account.getBalance().toFixed(2)}`);
  } catch (e) {
    console.log('Test 2 failed:', e.message);
  }

  // Rewards calculation
  try {
    const account = new RewardsDiningAccount('RA010', 2000, 2.5);
    const reward = account.calculateReward();
    console.log('Test 3 (Rewards calculation) ' + (reward === 50 ? 'PASSED' : 'FAILED'));
    console.log(`Reward: K${reward.toFixed(2)}`);
  } catch (e) {
    console.log('Test 3 failed:', e.message);
  }

  // Credit account within limit
  try {
    const account = new CreditDiningAccount('CA010', 1000, 500);
    const ok = account.payForMeal(1500, 'Dinner booking');
    console.log('Test 4 (Credit within limit) ' + (ok ? 'PASSED' : 'FAILED'));
    console.log(`Balance: K${account.getBalance().toFixed(2)}`);
  } catch (e) {
    console.log('Test 4 failed:', e.message);
  }

  // Credit limit exceeded
  try {
    const account = new CreditDiningAccount('CA011', 1000, 500);
    const ok = account.payForMeal(2000, 'Over limit');
    console.log('Test 5 (Credit limit exceeded) ' + (!ok ? 'PASSED' : 'FAILED'));
    console.log(`Balance: K${account.getBalance().toFixed(2)}`);
  } catch (e) {
    console.log('Test 5 failed:', e.message);
  }

  // Polymorphic processing
  try {
    const accounts = [
      new DiningAccount('DA020', 200),
      new RewardsDiningAccount('RA020', 200, 5),
      new CreditDiningAccount('CA020', 1000, 600),
    ];
    console.log('\nTest 6 (Polymorphism):');
    for (const account of accounts) {
      console.log(account.displayAccountSummary());
    }
    console.log('Test 6 PASSED');
  } catch (e) {
    console.log('Test 6 failed:', e.message);
  }

  // Booking payment and duplicate prevention
  try {
    const student = new Student('DWU2026001', 'Maria', 'Kila');
    const account = new RewardsDiningAccount('RA021', 100, 10);
    student.assignDiningAccount(account);

    const booking = new MealBooking({
      student,
      mealDate: '2026-08-12',
      mealType: 'Dinner',
      quantity: 2,
      dietaryNote: 'No peanuts',
    });

    booking.validate();
    const firstPayment = booking.processPayment(account);
    console.log('\nTest 7 (Booking payment) ' + (firstPayment.success ? 'PASSED' : 'FAILED'));
    const duplicatePayment = booking.processPayment(account);
    console.log('Test 8 (Duplicate payment) ' + (!duplicatePayment.success ? 'PASSED' : 'FAILED'));
    console.log(booking.getSummary());
  } catch (e) {
    console.log('Booking test failed:', e.message);
  }
}

async function interactiveFlow() {
  try {
    console.log('\n========================================');
    console.log('          STUDENT DINING ACCOUNT');
    console.log('========================================');

    const studentId = await rl.question('Student ID: ');
    const firstName = await rl.question('First name: ');
    const lastName = await rl.question('Last name: ');
    const student = new Student(studentId.trim(), firstName.trim(), lastName.trim());

    console.log('\nChoose account type:');
    console.log('1. Standard');
    console.log('2. Rewards');
    console.log('3. Credit');
    const choice = await rl.question('Enter 1, 2 or 3: ');

    let account;
    if (choice === '1') {
      const acctNo = await rl.question('Account number: ');
      const balance = Number(await rl.question('Opening balance: '));
      account = new DiningAccount(acctNo.trim(), balance);
    } else if (choice === '2') {
      const acctNo = await rl.question('Account number: ');
      const balance = Number(await rl.question('Opening balance: '));
      const rate = Number(await rl.question('Reward rate (%): '));
      account = new RewardsDiningAccount(acctNo.trim(), balance, rate);
    } else {
      const acctNo = await rl.question('Account number: ');
      const balance = Number(await rl.question('Opening balance: '));
      const limit = Number(await rl.question('Credit limit: '));
      account = new CreditDiningAccount(acctNo.trim(), balance, limit);
    }

    student.assignDiningAccount(account);
    console.log(student.displayInfo());
    console.log(account.displayAccountSummary());

    const mealDate = await rl.question('Meal date (YYYY-MM-DD): ');
    const mealType = await rl.question('Meal type (Breakfast/Lunch/Dinner): ');
    const quantity = Number(await rl.question('Quantity: '));
    const dietaryNote = await rl.question('Dietary note: ');

    const booking = new MealBooking({
      student,
      mealDate: mealDate.trim(),
      mealType: mealType.trim(),
      quantity,
      dietaryNote: dietaryNote.trim(),
    });

    booking.validate();
    const result = booking.processPayment(account);
    console.log('\n========================================');
    console.log('             MEAL BOOKING');
    console.log('========================================');
    console.log(`Meal: ${booking.mealType}`);
    console.log(`Quantity: ${booking.quantity}`);
    console.log(`Total Cost: K${booking.calculateTotal().toFixed(2)}`);
    console.log(`Payment Status: ${result.success ? 'Successful' : 'Rejected'}`);
    console.log(`Booking Status: ${booking.bookingStatus}`);
    console.log(`Remaining Balance: K${account.getBalance().toFixed(2)}`);
    console.log('========================================');

    displayAccountTransactions(account);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

async function main() {
  try {
    runPart1Demos();
    runPart2Tests();

    const runInteractive = await rl.question('\nWould you like to run the interactive Lab 3 flow? (y/n): ');
    if (runInteractive.trim().toLowerCase() === 'y') {
      await interactiveFlow();
    }
  } catch (error) {
    console.log('Unexpected error:', error.message);
  } finally {
    rl.close();
  }
}

main();
