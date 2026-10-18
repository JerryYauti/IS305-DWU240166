const ServiceRequest = require('./ServiceRequest');

class CleaningRequest extends ServiceRequest {
  #cleaningArea;
  #hygieneRisk;
  #serviceType;
  #preferredServiceTime;

  constructor({ requestId, requester, title, description, location, priority, cleaningArea, hygieneRisk, serviceType, preferredServiceTime }) {
    super({
      requestId,
      requester,
      title,
      description,
      location,
      category: 'Cleaning and Sanitation',
      priority
    });
    this.#cleaningArea = String(cleaningArea || '').trim();
    this.#hygieneRisk = String(hygieneRisk || '').trim();
    this.#serviceType = String(serviceType || '').trim();
    this.#preferredServiceTime = String(preferredServiceTime || '').trim();
    this.validateSpecialisedFields();
  }

  get cleaningArea() { return this.#cleaningArea; }
  get hygieneRisk() { return this.#hygieneRisk; }
  get serviceType() { return this.#serviceType; }
  get preferredServiceTime() { return this.#preferredServiceTime; }

  validateSpecialisedFields() {
    if (!this.#cleaningArea) throw new Error('Cleaning area is required.');
    if (!this.#hygieneRisk) throw new Error('Hygiene risk is required.');
    if (!this.#serviceType) throw new Error('Service type is required.');
    if (!this.#preferredServiceTime) throw new Error('Preferred service time is required.');
  }

  calculatePriorityScore() {
    let score = 15;
    if (this.#hygieneRisk.toLowerCase().includes('high')) score += 25;
    if (this.#hygieneRisk.toLowerCase().includes('critical')) score += 30;
    if (this.#serviceType.toLowerCase().includes('deep')) score += 15;
    return score;
  }

  getTargetResolutionHours() {
    return 12;
  }

  getRequestSummary() {
    return {
      requestId: this.requestId,
      type: 'CleaningRequest',
      title: this.title,
      location: this.location,
      category: this.category,
      priority: this.priority,
      status: this.status,
      assignedTechnicianId: this.assignedTechnicianId,
      cleaningArea: this.#cleaningArea,
      hygieneRisk: this.#hygieneRisk,
      serviceType: this.#serviceType,
      preferredServiceTime: this.#preferredServiceTime,
      requesterId: this.requester.userId,
      targetResolutionHours: this.getTargetResolutionHours(),
      priorityScore: this.calculatePriorityScore()
    };
  }
}

module.exports = CleaningRequest;
