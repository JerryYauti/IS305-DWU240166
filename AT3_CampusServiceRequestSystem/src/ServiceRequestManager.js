const fs = require('fs/promises');
const path = require('path');
const User = require('./models/User');
const StudentRequester = require('./models/StudentRequester');
const StaffRequester = require('./models/StaffRequester');
const ServiceOfficer = require('./models/ServiceOfficer');
const Technician = require('./models/Technician');
const ServiceRequest = require('./models/ServiceRequest');
const ICTSupportRequest = require('./models/ICTSupportRequest');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const CleaningRequest = require('./models/CleaningRequest');
const ServiceRequestFactory = require('./factories/ServiceRequestFactory');

class ServiceRequestManager {
  constructor() {
    this.users = [];
    this.requests = [];
  }

  registerUser(user) {
    if (!(user instanceof User)) throw new Error('Invalid user object.');
    if (this.findUserById(user.userId)) throw new Error('Duplicate user ID.');
    this.users.push(user);
    return user;
  }

  findUserById(userId) {
    return this.users.find((user) => user.userId === userId) || null;
  }

  submitRequest(request) {
    if (!(request instanceof ServiceRequest)) throw new Error('Invalid request object.');
    if (this.findRequestById(request.requestId)) throw new Error('Duplicate request ID.');
    if (!this.findUserById(request.requester.userId)) throw new Error('Requester must be registered.');
    this.requests.push(request);
    return request;
  }

  findRequestById(requestId) {
    return this.requests.find((request) => request.requestId === requestId) || null;
  }

  getRequestsByUser(userId) {
    return this.requests.filter((request) => request.requester.userId === userId);
  }

  getAllRequests() {
    return [...this.requests];
  }

  updateRequest(requestId, userId, changes) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    request.updateDetails(changes, userId);
    return request;
  }

  cancelRequest(requestId, userId) {
    const request = this.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    request.cancelRequest(userId);
    return request;
  }

  searchRequests(searchText) {
    if (!searchText) return [];
    const text = String(searchText).toLowerCase();
    return this.requests.filter((request) =>
      request.requestId.toLowerCase().includes(text) || request.title.toLowerCase().includes(text)
    );
  }

  getRequestSummaryByStatus() {
    const summary = {};
    for (const request of this.requests) {
      summary[request.status] = (summary[request.status] || 0) + 1;
    }
    return summary;
  }

  filterRequests({ category = null, status = null, priority = null, technicianId = null } = {}) {
    return this.requests.filter((request) => {
      if (category && request.category !== category) return false;
      if (status && request.status !== status) return false;
      if (priority && request.priority !== priority) return false;
      if (technicianId && request.assignedTechnicianId !== technicianId) return false;
      return true;
    });
  }

  sortRequests(key = 'dateSubmitted', direction = 'desc') {
    const sorted = [...this.requests];
    sorted.sort((a, b) => {
      const left = key === 'priority' ? this.priorityValue(a.priority) : new Date(a.dateSubmitted).getTime();
      const right = key === 'priority' ? this.priorityValue(b.priority) : new Date(b.dateSubmitted).getTime();
      return direction === 'asc' ? left - right : right - left;
    });
    return sorted;
  }

  priorityValue(value) {
    const order = { Low: 1, Normal: 2, High: 3, Urgent: 4 };
    return order[value] || 0;
  }

  getRequestsByTechnician(technicianId) {
    return this.requests.filter((request) => request.assignedTechnicianId === technicianId);
  }

  getCompletedRequestsByTechnician(technicianId) {
    return this.requests.filter((request) => request.assignedTechnicianId === technicianId && request.status === 'Closed');
  }

  getUrgentRequests() {
    return this.requests.filter((request) => request.priority === 'Urgent');
  }

  getOverdueRequests() {
    return this.requests.filter((request) => {
      const targetHours = request.getTargetResolutionHours();
      const elapsedHours = (Date.now() - new Date(request.dateSubmitted).getTime()) / (1000 * 60 * 60);
      return elapsedHours > targetHours && request.status !== 'Closed';
    });
  }

  getRequestsByLocation() {
    const grouped = {};
    for (const request of this.requests) {
      grouped[request.location] = (grouped[request.location] || 0) + 1;
    }
    return grouped;
  }

  getAverageResolutionTime() {
    const resolved = this.requests.filter((request) => request.status === 'Closed');
    if (!resolved.length) return 0;
    const totalHours = resolved.reduce((sum, request) => {
      const diff = new Date(request.dateUpdated).getTime() - new Date(request.dateSubmitted).getTime();
      return sum + diff / (1000 * 60 * 60);
    }, 0);
    return totalHours / resolved.length;
  }

  getReportByStatus() {
    return this.getRequestSummaryByStatus();
  }

  getReportByCategory() {
    const grouped = {};
    for (const request of this.requests) {
      grouped[request.category] = (grouped[request.category] || 0) + 1;
    }
    return grouped;
  }

  getReportByPriority() {
    const grouped = {};
    for (const request of this.requests) {
      grouped[request.priority] = (grouped[request.priority] || 0) + 1;
    }
    return grouped;
  }

  async loadFromFiles(userRepo, requestRepo, historyRepo) {
    const userData = await userRepo.loadAll();
    const requestData = await requestRepo.loadAll();
    const userMap = {};

    for (const item of userData) {
      const user = this.createUserFromRecord(item);
      this.users.push(user);
      userMap[user.userId] = user;
    }

    for (const item of requestData) {
      const request = ServiceRequestFactory.createFromData(item, userMap);
      this.requests.push(request);
    }

    if (historyRepo) {
      const history = await historyRepo.loadAll();
      return { users: this.users, requests: this.requests, history };
    }
    return { users: this.users, requests: this.requests };
  }

  createUserFromRecord(record) {
    switch (record.userType) {
      case 'Student':
        return new StudentRequester(record.userId, record.firstName, record.lastName, record.email, record.programme, record.yearLevel);
      case 'Staff':
        return new StaffRequester(record.userId, record.firstName, record.lastName, record.email, record.department);
      case 'Service Officer':
        return new ServiceOfficer(record.userId, record.firstName, record.lastName, record.email, record.serviceSection);
      case 'Technician':
        return new Technician(record.userId, record.firstName, record.lastName, record.email, record.technicalSpeciality);
      default:
        return new User(record.userId, record.firstName, record.lastName, record.email, record.userType);
    }
  }
}

module.exports = ServiceRequestManager;
