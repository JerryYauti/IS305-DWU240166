// src/models/User.js
class User {
  // private fields
  #userId;
  #firstName;
  #lastName;
  #email;
  #userType;

  constructor(userId, firstName, lastName, email, userType = 'Requester') {
    this.#userId = userId?.toString()?.trim();
    this.#firstName = firstName?.toString()?.trim();
    this.#lastName = lastName?.toString()?.trim();
    this.#email = email?.toString()?.trim();
    this.#userType = userType?.toString()?.trim();
    this.validate();
  }

  // Getters
  get userId() { return this.#userId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }
  get email() { return this.#email; }
  get userType() { return this.#userType; }

  // Setters with minimal controlled validation
  set firstName(value) {
    if (!value || !value.toString().trim()) throw new Error('First name is required.');
    this.#firstName = value.toString().trim();
  }
  set lastName(value) {
    if (!value || !value.toString().trim()) throw new Error('Last name is required.');
    this.#lastName = value.toString().trim();
  }
  set email(value) {
    if (!User.isValidEmail(value)) throw new Error('Invalid email address.');
    this.#email = value.toString().trim();
  }
  set userType(value) {
    if (!value || !value.toString().trim()) throw new Error('User type is required.');
    this.#userType = value.toString().trim();
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
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toString().trim());
  }
}

module.exports = User;
