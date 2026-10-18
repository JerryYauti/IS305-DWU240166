/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: MealBooking class extended to use a Student object and process
  payments through a DiningAccount or subclass.
*/

const Student = require('./Student');
const DiningAccount = require('./DiningAccount');

class MealBooking {
  #student;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;
  #paid;

  constructor({ student, mealDate, mealType, quantity = 1, dietaryNote = '', bookingStatus = 'Pending' } = {}) {
    this.#student = student;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = bookingStatus;
    this.#paid = false;
  }

  get student() {
    return this.#student;
  }

  set student(value) {
    if (!value || !(value instanceof Student)) {
      throw new Error('A valid Student object is required.');
    }
    this.#student = value;
  }

  get mealDate() {
    return this.#mealDate;
  }

  set mealDate(value) {
    this.#mealDate = value;
  }

  get mealType() {
    return this.#mealType;
  }

  set mealType(value) {
    this.#mealType = value;
  }

  get quantity() {
    return this.#quantity;
  }

  set quantity(value) {
    this.#quantity = value;
  }

  get dietaryNote() {
    return this.#dietaryNote;
  }

  set dietaryNote(value) {
    this.#dietaryNote = value;
  }

  get bookingStatus() {
    return this.#bookingStatus;
  }

  validate() {
    if (!this.#student || !(this.#student instanceof Student)) {
      throw new Error('A valid Student object is required for a booking.');
    }
    if (!this.#mealDate || this.#mealDate.toString().trim() === '') {
      throw new Error('Meal date is required.');
    }
    const validTypes = ['Breakfast', 'Lunch', 'Dinner'];
    if (!validTypes.includes(this.#mealType)) {
      throw new Error('Meal type must be Breakfast, Lunch or Dinner.');
    }
    if (!Number.isInteger(this.#quantity) || this.#quantity < 1) {
      throw new Error('Quantity must be an integer >= 1.');
    }
    return true;
  }

  calculateTotal() {
    const prices = {
      Breakfast: 10,
      Lunch: 15,
      Dinner: 20,
    };
    return (prices[this.#mealType] || 0) * this.#quantity;
  }

  confirmBooking() {
    this.#bookingStatus = 'Confirmed';
  }

  cancelBooking() {
    this.#bookingStatus = 'Cancelled';
  }

  processPayment(diningAccount) {
    if (!diningAccount || !(diningAccount instanceof DiningAccount)) {
      throw new Error('A valid DiningAccount is required for payment.');
    }

    if (this.#paid || this.#bookingStatus === 'Confirmed') {
      return {
        success: false,
        message: 'This booking has already been paid for or confirmed.',
        total: this.calculateTotal(),
        remainingBalance: diningAccount.getBalance(),
      };
    }

    const total = this.calculateTotal();
    const paymentSucceeded = diningAccount.payForMeal(total, `${this.#mealType} booking for ${this.#student.getFullName()}`);

    if (paymentSucceeded) {
      this.#paid = true;
      this.#bookingStatus = 'Confirmed';
      return {
        success: true,
        message: 'Payment successful.',
        total,
        remainingBalance: diningAccount.getBalance(),
      };
    }

    this.#bookingStatus = 'Pending';
    return {
      success: false,
      message: 'Payment rejected. Insufficient funds or credit limit reached.',
      total,
      remainingBalance: diningAccount.getBalance(),
    };
  }

  getSummary() {
    return `========================================\n` +
      `             MEAL BOOKING\n` +
      `========================================\n` +
      `Student: ${this.#student.getFullName()} (${this.#student.studentId})\n` +
      `Meal: ${this.#mealType}\n` +
      `Quantity: ${this.#quantity}\n` +
      `Dietary note: ${this.#dietaryNote || 'None'}\n` +
      `Status: ${this.#bookingStatus}\n` +
      `Total Cost: K${this.calculateTotal().toFixed(2)}\n` +
      `========================================`;
  }
}

module.exports = MealBooking;
