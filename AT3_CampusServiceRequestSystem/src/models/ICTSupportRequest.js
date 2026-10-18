const ServiceRequest = require('./ServiceRequest');

class ICTSupportRequest extends ServiceRequest {
  #deviceType;
  #systemName;
  #faultType;
  #networkImpact;

  constructor({ requestId, requester, title, description, location, priority, deviceType, systemName, faultType, networkImpact }) {
    super({
      requestId,
      requester,
      title,
      description,
      location,
      category: 'ICT Support',
      priority
    });
    this.#deviceType = String(deviceType || '').trim();
    this.#systemName = String(systemName || '').trim();
    this.#faultType = String(faultType || '').trim();
    this.#networkImpact = String(networkImpact || '').trim();
    this.validateSpecialisedFields();
  }

  get deviceType() { return this.#deviceType; }
  get systemName() { return this.#systemName; }
  get faultType() { return this.#faultType; }
  get networkImpact() { return this.#networkImpact; }

  validateSpecialisedFields() {
    if (!this.#deviceType) throw new Error('Device type is required.');
    if (!this.#systemName) throw new Error('System name is required.');
    if (!this.#faultType) throw new Error('Fault type is required.');
    if (!this.#networkImpact) throw new Error('Network impact is required.');
  }

  calculatePriorityScore() {
    let score = 30;
    if (this.networkImpact.toLowerCase().includes('critical')) score += 25;
    if (this.faultType.toLowerCase().includes('security')) score += 20;
    if (this.systemName.toLowerCase().includes('wifi')) score += 15;
    return score;
  }

  getTargetResolutionHours() {
    return 8;
  }

  getRequestSummary() {
    return {
      requestId: this.requestId,
      type: 'ICTSupportRequest',
      title: this.title,
      location: this.location,
      category: this.category,
      priority: this.priority,
      status: this.status,
      assignedTechnicianId: this.assignedTechnicianId,
      deviceType: this.#deviceType,
      systemName: this.#systemName,
      faultType: this.#faultType,
      networkImpact: this.#networkImpact,
      requesterId: this.requester.userId,
      targetResolutionHours: this.getTargetResolutionHours(),
      priorityScore: this.calculatePriorityScore()
    };
  }
}

module.exports = ICTSupportRequest;
