const User = require('./User');

class ServiceOfficer extends User {
  #serviceSection;

  constructor(userId, firstName, lastName, email, serviceSection) {
    super(userId, firstName, lastName, email, 'Service Officer');
    this.#serviceSection = String(serviceSection || '').trim();
    this.validateSpecialisedFields();
  }

  get serviceSection() { return this.#serviceSection; }

  validateSpecialisedFields() {
    if (!this.#serviceSection) throw new Error('Service section is required.');
  }

  displayInfo() {
    const info = super.displayInfo();
    return { ...info, serviceSection: this.#serviceSection };
  }
}

module.exports = ServiceOfficer;
