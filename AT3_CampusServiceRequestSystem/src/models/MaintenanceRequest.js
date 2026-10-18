const ServiceRequest = require('./ServiceRequest');

class MaintenanceRequest extends ServiceRequest {
  #building;
  #roomNumber;
  #hazardLevel;
  #equipmentAffected;

  constructor({ requestId, requester, title, description, location, priority, building, roomNumber, hazardLevel, equipmentAffected }) {
    super({
      requestId,
      requester,
      title,
      description,
      location,
      category: 'Facilities Maintenance',
      priority
    });
    this.#building = String(building || '').trim();
    this.#roomNumber = String(roomNumber || '').trim();
    this.#hazardLevel = String(hazardLevel || '').trim();
    this.#equipmentAffected = String(equipmentAffected || '').trim();
    this.validateSpecialisedFields();
  }

  get building() { return this.#building; }
  get roomNumber() { return this.#roomNumber; }
  get hazardLevel() { return this.#hazardLevel; }
  get equipmentAffected() { return this.#equipmentAffected; }

  validateSpecialisedFields() {
    if (!this.#building) throw new Error('Building is required.');
    if (!this.#roomNumber) throw new Error('Room number is required.');
    if (!this.#hazardLevel) throw new Error('Hazard level is required.');
    if (!this.#equipmentAffected) throw new Error('Equipment affected is required.');
  }

  calculatePriorityScore() {
    let score = 25;
    if (this.#hazardLevel.toLowerCase().includes('high')) score += 30;
    if (this.#hazardLevel.toLowerCase().includes('critical')) score += 25;
    if (this.#equipmentAffected.toLowerCase().includes('lift')) score += 20;
    return score;
  }

  getTargetResolutionHours() {
    return 16;
  }

  getRequestSummary() {
    return {
      requestId: this.requestId,
      type: 'MaintenanceRequest',
      title: this.title,
      location: this.location,
      category: this.category,
      priority: this.priority,
      status: this.status,
      assignedTechnicianId: this.assignedTechnicianId,
      building: this.#building,
      roomNumber: this.#roomNumber,
      hazardLevel: this.#hazardLevel,
      equipmentAffected: this.#equipmentAffected,
      requesterId: this.requester.userId,
      targetResolutionHours: this.getTargetResolutionHours(),
      priorityScore: this.calculatePriorityScore()
    };
  }
}

module.exports = MaintenanceRequest;
