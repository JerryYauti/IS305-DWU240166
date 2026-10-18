/*
  Program: Dining Meal Booking Feature - Lab 2
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: Refactored MealBooking class that accepts a Student object
  instead of separate student fields. Keeps validation, calculation and
  booking controls.
*/

const Student = require('./Student');

class MealBooking {
  #student; // Student object
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor({ student, mealDate, mealType, quantity = 1, dietaryNote = '', bookingStatus = 'Pending' } = {}) {
    this.#student = student;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = bookingStatus;
  }

  // Getters
  get student() {
    return this.#student;
  }

  get mealDate() {
    return this.#mealDate;
  }

  get mealType() {
    return this.#mealType;
  }

  get quantity() {
    return this.#quantity;
  }

  get dietaryNote() {
    return this.#dietaryNote;
  }

  get bookingStatus() {
    return this.#bookingStatus;
  }

  // Setters
  set student(s) {
    this.#student = s;
  }

  set mealDate(val) {
    this.#mealDate = val;
  }

  set mealType(val) {
    this.#mealType = val;
  }

  set quantity(val) {
    this.#quantity = val;
  }

  set dietaryNote(val) {
    this.#dietaryNote = val;
  }

  set bookingStatus(val) {
    this.#bookingStatus = val;
  }

  validate() {
    // Student must be provided and be a Student instance
    if (!this.#student || !(this.#student instanceof Student)) {
      throw new Error('A valid Student object is required for a booking.');
    }

    // reuse Student setters' validation by accessing fields
    if (!this.#student.studentId || this.#student.studentId.toString().trim() === '') {
      throw new Error('Student ID is required.');
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
      Breakfast: 10.0,
      Lunch: 15.0,
      Dinner: 20.0,
    };
    const price = prices[this.#mealType] || 0;
    return price * this.#quantity;
  }

  confirmBooking() {
    this.#bookingStatus = 'Confirmed';
  }

  cancelBooking() {
    this.#bookingStatus = 'Cancelled';
  }

  getSummary() {
    const total = this.calculateTotal();
    return `----------------------------------------\n` +
      `Student: ${this.#student.getFullName()} (${this.#student.studentId})\n` +
      `Meal: ${this.#mealType} x ${this.#quantity}\n` +
      `Date: ${this.#mealDate}\n` +
      `Dietary note: ${this.#dietaryNote || 'None'}\n` +
      `Status: ${this.#bookingStatus}\n` +
      `Cost: K${total.toFixed(2)}\n` +
      `----------------------------------------`;
  }
}

module.exports = MealBooking;
