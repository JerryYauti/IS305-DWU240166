/*
  Program: Dining Account Distinction Extension
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: Student class for Lab 3. Stores student identity and can be
  assigned a dining account.
*/

const DiningAccount = require('./DiningAccount');

class Student {
  #studentId;
  #firstName;
  #lastName;
  #diningAccount;

  constructor(studentId, firstName, lastName) {
    this.studentId = studentId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.#diningAccount = null;
  }

  get studentId() {
    return this.#studentId;
  }

  set studentId(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('Student ID cannot be empty.');
    }
    this.#studentId = value.toString().trim();
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('First name cannot be empty.');
    }
    this.#firstName = value.toString().trim();
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(value) {
    if (!value || value.toString().trim() === '') {
      throw new Error('Last name cannot be empty.');
    }
    this.#lastName = value.toString().trim();
  }

  get diningAccount() {
    return this.#diningAccount;
  }

  assignDiningAccount(account) {
    if (!account || !(account instanceof DiningAccount)) {
      throw new Error('A valid DiningAccount object is required.');
    }
    this.#diningAccount = account;
    return this.#diningAccount;
  }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `========================================\n` +
      `          STUDENT INFORMATION\n` +
      `========================================\n` +
      `Student ID: ${this.#studentId}\n` +
      `Student Name: ${this.getFullName()}\n` +
      `========================================`;
  }
}

module.exports = Student;
