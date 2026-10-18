const User = require('./User');

class Technician extends User {
  #technicalSpeciality;

  constructor(userId, firstName, lastName, email, technicalSpeciality) {
    super(userId, firstName, lastName, email, 'Technician');
    this.#technicalSpeciality = String(technicalSpeciality || '').trim();
    this.validateSpecialisedFields();
  }

  get technicalSpeciality() { return this.#technicalSpeciality; }

  validateSpecialisedFields() {
    if (!this.#technicalSpeciality) throw new Error('Technical speciality is required.');
  }

  displayInfo() {
    const info = super.displayInfo();
    return { ...info, technicalSpeciality: this.#technicalSpeciality };
  }
}

module.exports = Technician;
