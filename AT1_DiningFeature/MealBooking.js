/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry YAUTI
  Student ID: 240166
  Date: 20th July 2026
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

  constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = "Pending";
  }


// Getters
  get studentId() { return this.#studentId; }
  get studentName() { return this.#studentName; }
  get mealDate() { return this.#mealDate; }
  get mealType() { return this.#mealType; }
  get quantity() { return this.#quantity; }
  get dietaryNote() { return this.#dietaryNote; }
  get bookingStatus() { return this.#bookingStatus; }

  // Setters
  set studentName(name) { this.#studentName = name; }
  set mealDate(date) { this.#mealDate = date; }
  set mealType(type) { this.#mealType = type; }
  set quantity(qty) { this.#quantity = qty; }
  set dietaryNote(note) { this.#dietaryNote = note; }
  set bookingStatus(status) { this.#bookingStatus = status; }

// Method to calculate total cost
  calculateTotal() {
    let price = 0;
    if (this.#mealType === "Breakfast") price = 10;
    else if (this.#mealType === "Lunch") price = 15;
    else if (this.#mealType === "Dinner") price = 20;
    return price * this.#quantity;
  }
