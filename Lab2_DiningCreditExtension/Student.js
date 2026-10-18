/*
  Program: Dining Meal Booking Feature - Lab 2
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: Student class for Lab 2 - stores student identity and provides
  accessors and display helpers. Demonstrates private fields, getters/setters
  and simple validation.
*/

class Student {
  #studentId;
  #firstName;
  #lastName;

  constructor(studentId, firstName, lastName) {
    this.studentId = studentId; // use setter for validation
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // Getters
  get studentId() {
    return this.#studentId;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  // Setters with validation
  set studentId(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('Student ID cannot be empty.');
    }
    this.#studentId = value.toString().trim();
  }

  set firstName(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('First name cannot be empty.');
    }
    this.#firstName = value.toString().trim();
  }

  set lastName(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('Last name cannot be empty.');
    }
    this.#lastName = value.toString().trim();
  }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `========================================\n` +
      `            STUDENT DETAILS\n` +
      `========================================\n` +
      `Student ID: ${this.#studentId}\n` +
      `Student Name: ${this.getFullName()}\n` +
      `========================================`;
  }
}

module.exports = Student;
