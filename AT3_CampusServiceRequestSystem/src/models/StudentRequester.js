const User = require('./User');

class StudentRequester extends User {
  #programme;
  #yearLevel;

  constructor(userId, firstName, lastName, email, programme, yearLevel) {
    super(userId, firstName, lastName, email, 'Student');
    this.#programme = String(programme || '').trim();
    this.#yearLevel = String(yearLevel || '').trim();
    this.validateSpecialisedFields();
  }

  get programme() { return this.#programme; }
  get yearLevel() { return this.#yearLevel; }

  validateSpecialisedFields() {
    if (!this.#programme) throw new Error('Student programme is required.');
    if (!this.#yearLevel) throw new Error('Student year level is required.');
  }

  displayInfo() {
    const info = super.displayInfo();
    return { ...info, programme: this.#programme, yearLevel: this.#yearLevel };
  }
}

module.exports = StudentRequester;
