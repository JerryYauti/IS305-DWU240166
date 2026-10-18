/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

class MealBooking {
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor({
    studentId,
    studentName,
    mealDate,
    mealType,
    quantity = 1,
    dietaryNote = '',
    bookingStatus = 'Pending',
  } = {}) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = bookingStatus;
  }

  // Getters
  get studentId() {
    return this.#studentId;
  }

  get studentName() {
    return this.#studentName;
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
  set studentId(val) {
    this.#studentId = val;
  }

  set studentName(val) {
    this.#studentName = val;
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
    if (!this.#studentId || this.#studentId.toString().trim() === '') {
      throw new Error('Student ID is required.');
    }
    if (!this.#studentName || this.#studentName.toString().trim() === '') {
      throw new Error('Student name is required.');
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
    return `========================================\n` +
      `Student: ${this.#studentName} (${this.#studentId})\n` +
      `Meal: ${this.#mealType} x ${this.#quantity}\n` +
      `Date: ${this.#mealDate}\n` +
      `Dietary note: ${this.#dietaryNote}\n` +
      `Status: ${this.#bookingStatus}\n` +
      `Total cost: K${total.toFixed(2)}\n` +
      `========================================`;
  }
}

module.exports = MealBooking;
