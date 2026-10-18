class ServiceRequest {
  static VALID_CATEGORIES = [
    'ICT Support',
    'Facilities Maintenance',
    'Cleaning and Sanitation',
    'General Campus Service'
  ];

  static VALID_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];
  static STATUS_FLOW = {
    Submitted: ['Reviewed', 'Cancelled'],
    Reviewed: ['Assigned', 'Cancelled'],
    Assigned: ['In Progress', 'Cancelled'],
    'In Progress': ['Resolved', 'Cancelled'],
    Resolved: ['Closed', 'Cancelled'],
    Closed: [],
    Cancelled: []
  };

  #requestId;
  #requester;
  #title;
  #description;
  #location;
  #category;
  #priority;
  #status;
  #dateSubmitted;
  #dateUpdated;
  #assignedTechnicianId;
  #requestHistory;

  constructor({ requestId, requester, title, description, location, category, priority, status = 'Submitted', assignedTechnicianId = null }) {
    this.#requestId = this.sanitize(requestId);
    this.#requester = requester;
    this.#title = this.sanitize(title);
    this.#description = this.sanitize(description);
    this.#location = this.sanitize(location);
    this.#category = this.sanitize(category);
    this.#priority = this.sanitize(priority);
    this.#status = this.sanitize(status) || 'Submitted';
    this.#dateSubmitted = new Date();
    this.#dateUpdated = new Date();
    this.#assignedTechnicianId = assignedTechnicianId ? String(assignedTechnicianId).trim() : null;
    this.#requestHistory = [];
    this.validate();
  }

  sanitize(value) {
    if (value === undefined || value === null) return '';
    return String(value).trim();
  }

  get requestId() { return this.#requestId; }
  get requester() { return this.#requester; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get location() { return this.#location; }
  get category() { return this.#category; }
  get priority() { return this.#priority; }
  get status() { return this.#status; }
  get dateSubmitted() { return this.#dateSubmitted; }
  get dateUpdated() { return this.#dateUpdated; }
  get assignedTechnicianId() { return this.#assignedTechnicianId; }
  get requestHistory() { return this.#requestHistory; }

  set assignedTechnicianId(value) {
    this.#assignedTechnicianId = value ? String(value).trim() : null;
  }

  validate() {
    if (!this.#requestId) throw new Error('Request ID is required.');
    if (!this.#requester || !this.#requester.userId) throw new Error('Valid requester is required.');
    if (!this.#title) throw new Error('Request title is required.');
    if (!this.#description) throw new Error('Request description is required.');
    if (!this.#category || !ServiceRequest.VALID_CATEGORIES.includes(this.#category)) {
      throw new Error(`Unsupported category. Allowed: ${ServiceRequest.VALID_CATEGORIES.join(', ')}`);
    }
    if (!this.#priority || !ServiceRequest.VALID_PRIORITIES.includes(this.#priority)) {
      throw new Error(`Unsupported priority value. Allowed: ${ServiceRequest.VALID_PRIORITIES.join(', ')}`);
    }
    return true;
  }

  getRequestSummary() {
    throw new Error('getRequestSummary() must be implemented by subclass.');
  }

  calculatePriorityScore() {
    throw new Error('calculatePriorityScore() must be implemented by subclass.');
  }

  getTargetResolutionHours() {
    throw new Error('getTargetResolutionHours() must be implemented by subclass.');
  }

  updateDetails(changes = {}, requestingUserId) {
    if (this.#requester.userId !== requestingUserId) {
      throw new Error('Updates attempted by another user are not allowed.');
    }
    if (this.#status !== 'Submitted') {
      throw new Error('Only Submitted requests can be updated by the requester.');
    }

    if (changes.title) this.#title = this.sanitize(changes.title);
    if (changes.description) this.#description = this.sanitize(changes.description);
    if (changes.location) this.#location = this.sanitize(changes.location);
    if (changes.category) {
      if (!ServiceRequest.VALID_CATEGORIES.includes(changes.category)) throw new Error('Unsupported category.');
      this.#category = this.sanitize(changes.category);
    }
    if (changes.priority) {
      if (!ServiceRequest.VALID_PRIORITIES.includes(changes.priority)) throw new Error('Unsupported priority value.');
      this.#priority = this.sanitize(changes.priority);
    }
    this.#dateUpdated = new Date();
    return true;
  }

  cancelRequest(requestingUserId) {
    if (this.#requester.userId !== requestingUserId) {
      throw new Error('Cancellation of another user request is not allowed.');
    }
    if (this.#status === 'Cancelled') {
      throw new Error('This request is already cancelled.');
    }
    const previousStatus = this.#status;
    this.#status = 'Cancelled';
    this.#dateUpdated = new Date();
    this.recordHistory(previousStatus, 'Cancelled', 'cancelRequest', requestingUserId, 'Requester cancelled request');
    return true;
  }

  recordHistory(previousStatus, newStatus, action, actorIdOrRole, comment) {
    this.#requestHistory.push({
      previousStatus,
      newStatus,
      action,
      actorIdOrRole: String(actorIdOrRole || 'system'),
      comment: comment || '',
      dateTime: new Date().toISOString()
    });
  }

  changeStatus(nextStatus, actorIdOrRole, action, comment = '') {
    const allowed = ServiceRequest.STATUS_FLOW[this.#status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid status transition from ${this.#status} to ${nextStatus}.`);
    }
    const previousStatus = this.#status;
    this.#status = nextStatus;
    this.#dateUpdated = new Date();
    this.recordHistory(previousStatus, nextStatus, action, actorIdOrRole, comment);
    return true;
  }

  reviewRequest(actorId) {
    this.changeStatus('Reviewed', actorId, 'reviewRequest', 'Reviewed by service officer');
  }

  assignTechnician(actorId, technicianId) {
    this.#assignedTechnicianId = technicianId;
    this.changeStatus('Assigned', actorId, 'assignTechnician', `Assigned technician ${technicianId}`);
  }

  beginWork(actorId) {
    this.changeStatus('In Progress', actorId, 'beginWork', 'Technician began work');
  }

  recordProgress(actorId, notes) {
    if (this.#assignedTechnicianId && this.#assignedTechnicianId !== actorId) {
      throw new Error('Only the assigned technician can update work progress.');
    }
    this.recordHistory(this.#status, this.#status, 'recordProgress', actorId, notes || 'Progress recorded');
    this.#dateUpdated = new Date();
  }

  resolveRequest(actorId, notes = 'Request resolved') {
    if (this.#assignedTechnicianId && this.#assignedTechnicianId !== actorId) {
      throw new Error('Only the assigned technician can resolve the request.');
    }
    this.changeStatus('Resolved', actorId, 'resolveRequest', notes);
  }

  closeRequest(actorId) {
    if (this.#status !== 'Resolved') {
      throw new Error('Only a Resolved request can be closed by a service officer.');
    }
    this.changeStatus('Closed', actorId, 'closeRequest', 'Service officer verified and closed request');
  }

  toJSON() {
    return {
      requestId: this.#requestId,
      requesterId: this.#requester ? this.#requester.userId : null,
      title: this.#title,
      description: this.#description,
      location: this.#location,
      category: this.#category,
      priority: this.#priority,
      status: this.#status,
      dateSubmitted: this.#dateSubmitted.toISOString(),
      dateUpdated: this.#dateUpdated.toISOString(),
      assignedTechnicianId: this.#assignedTechnicianId,
      requestType: this.constructor.name,
      requestHistory: this.#requestHistory
    };
  }

  static allowedCategories() {
    return [...ServiceRequest.VALID_CATEGORIES];
  }

  static allowedPriorities() {
    return [...ServiceRequest.VALID_PRIORITIES];
  }
}

module.exports = ServiceRequest;
