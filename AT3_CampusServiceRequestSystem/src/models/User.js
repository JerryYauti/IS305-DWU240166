const fs = require('fs');

class User {
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  constructor(userId, firstName, lastName, email, userType = 'Requester') {
    this.#userId = this.sanitize(userId);
    this.#firstName = this.sanitize(firstName);
    this.#lastName = this.sanitize(lastName);
    this.#email = this.sanitize(email);
    this.#userType = this.sanitize(userType);
    this.validate();
  }

  sanitize(value) {
    if (value === undefined || value === null) return '';
    return String(value).trim();
  }

  get userId() { return this.#userId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get email() { return this.#email; }
  get userType() { return this.#userType; }

  set firstName(value) {
    const v = this.sanitize(value);
    if (!v) throw new Error('First name is required.');
    this.#firstName = v;
  }

  set lastName(value) {
    const v = this.sanitize(value);
    if (!v) throw new Error('Last name is required.');
    this.#lastName = v;
  }

  set email(value) {
    const v = this.sanitize(value);
    if (!User.isValidEmail(v)) throw new Error('Invalid email address.');
    this.#email = v;
  }

  set userType(value) {
    const v = this.sanitize(value);
    if (!v) throw new Error('User type is required.');
    this.#userType = v;
  }

  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  validate() {
    if (!this.#userId) throw new Error('User ID is required.');
    if (!this.#firstName) throw new Error('First name is required.');
    if (!this.#lastName) throw new Error('Last name is required.');
    if (!User.isValidEmail(this.#email)) throw new Error('Invalid email address.');
    if (!this.#userType) throw new Error('User type is required.');
    return true;
  }

  displayInfo() {
    return {
      userId: this.#userId,
      fullName: this.getFullName(),
      email: this.#email,
      userType: this.#userType
    };
  }

  static isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
  }
}

module.exports = User;
