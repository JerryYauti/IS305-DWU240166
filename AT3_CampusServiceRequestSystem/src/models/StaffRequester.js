const User = require('./User');

class StaffRequester extends User {
  #department;

  constructor(userId, firstName, lastName, email, department) {
    super(userId, firstName, lastName, email, 'Staff');
    this.#department = String(department || '').trim();
    this.validateSpecialisedFields();
  }

  get department() { return this.#department; }

  validateSpecialisedFields() {
    if (!this.#department) throw new Error('Staff department is required.');
  }

  displayInfo() {
    const info = super.displayInfo();
    return { ...info, department: this.#department };
  }
}

module.exports = StaffRequester;
