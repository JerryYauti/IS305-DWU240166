const test = require('node:test');
const assert = require('node:assert/strict');

const User = require('../src/models/User');
const StudentRequester = require('../src/models/StudentRequester');
const ServiceRequest = require('../src/models/ServiceRequest');
const ICTSupportRequest = require('../src/models/ICTSupportRequest');
const MaintenanceRequest = require('../src/models/MaintenanceRequest');
const CleaningRequest = require('../src/models/CleaningRequest');
const ServiceRequestManager = require('../src/ServiceRequestManager');
const ServiceRequestFactory = require('../src/factories/ServiceRequestFactory');

const manager = new ServiceRequestManager();

test('valid user registration', () => {
  const user = new User('U001', 'Jerry', 'Yauti', 'jerry@example.com', 'Student');
  manager.registerUser(user);
  assert.equal(manager.findUserById('U001').userId, 'U001');
});

test('duplicate user ID rejected', () => {
  const user = new User('U001', 'Jane', 'Doe', 'jane@example.com', 'Student');
  assert.throws(() => manager.registerUser(user), /Duplicate user ID/);
});

test('valid request submission', () => {
  const student = manager.findUserById('U001');
  const request = new ICTSupportRequest({
    requestId: 'REQ001',
    requester: student,
    title: 'Wi-Fi not working',
    description: 'Campus Wi-Fi disconnects often',
    location: 'Library Level 2',
    priority: 'High',
    deviceType: 'Laptop',
    systemName: 'Campus WiFi',
    faultType: 'Connectivity',
    networkImpact: 'Critical'
  });
  manager.submitRequest(request);
  assert.equal(request.status, 'Submitted');
});

test('invalid request category rejected', () => {
  const student = manager.findUserById('U001');
  assert.throws(() => new ServiceRequest({
    requestId: 'REQ002',
    requester: student,
    title: 'Bad request',
    description: 'Purpose',
    location: 'Hall',
    category: 'Unsupported Type',
    priority: 'Normal'
  }), /Unsupported category/);
});

test('request updates by another user rejected', () => {
  const student = manager.findUserById('U001');
  const request = manager.findRequestById('REQ001');
  assert.throws(() => request.updateDetails({ title: 'New title' }, 'U999'), /another user/i);
  request.updateDetails({ title: 'Updated title' }, student.userId);
  assert.match(request.title, /Updated title/);
});

test('service officer assign technician works', () => {
  const req = manager.findRequestById('REQ001');
  req.reviewRequest('OFF001');
  req.assignTechnician('OFF001', 'TECH001');
  assert.equal(req.status, 'Assigned');
  assert.equal(req.assignedTechnicianId, 'TECH001');
});

test('invalid workflow transitions rejected', () => {
  const req = manager.findRequestById('REQ001');
  assert.throws(() => req.closeRequest('OFF001'), /Only a Resolved request/);
});

test('specialised request behaviour works', () => {
  const req = new MaintenanceRequest({
    requestId: 'REQ002',
    requester: manager.findUserById('U001'),
    title: 'Broken air conditioner',
    description: 'AC not cooling',
    location: 'Block A Room 3',
    priority: 'Urgent',
    building: 'Block A',
    roomNumber: '3',
    hazardLevel: 'High',
    equipmentAffected: 'Air Conditioner'
  });
  assert.equal(req.calculatePriorityScore(), 55);
  assert.equal(req.getTargetResolutionHours(), 16);
});

test('polymorphism works across request types', () => {
  const requests = [
    new ICTSupportRequest({
      requestId: 'REQ003',
      requester: manager.findUserById('U001'),
      title: 'Printer offline',
      description: 'Printer not printing',
      location: 'Admin Office',
      priority: 'Normal',
      deviceType: 'Printer',
      systemName: 'Campus Print',
      faultType: 'Hardware',
      networkImpact: 'Low'
    }),
    new CleaningRequest({
      requestId: 'REQ004',
      requester: manager.findUserById('U001'),
      title: 'Toilet cleaning',
      description: 'Need urgent cleaning',
      location: 'Main Hall',
      priority: 'High',
      cleaningArea: 'Main Hall toilets',
      hygieneRisk: 'High',
      serviceType: 'Deep cleaning',
      preferredServiceTime: 'Today 15:00'
    })
  ];
  for (const request of requests) {
    assert.ok(request.getRequestSummary());
    assert.ok(request.calculatePriorityScore() > 0);
    assert.ok(request.getTargetResolutionHours() > 0);
  }
});

test('factory restores object from saved data', () => {
  const saved = {
    requestId: 'REQ005',
    requesterId: 'U001',
    title: 'Lab projector issue',
    description: 'Projector flickers',
    location: 'Science Block',
    category: 'ICT Support',
    priority: 'High',
    status: 'Submitted',
    assignedTechnicianId: null,
    requestType: 'ICTSupportRequest',
    deviceType: 'Projector',
    systemName: 'Lab System',
    faultType: 'Display',
    networkImpact: 'Medium'
  };
  const request = ServiceRequestFactory.createFromData(saved, { U001: manager.findUserById('U001') });
  assert.equal(request.constructor.name, 'ICTSupportRequest');
  assert.equal(request.title, 'Lab projector issue');
});

test('reports calculate correctly', () => {
  const rep = manager.getReportByStatus();
  assert.ok(rep['Submitted'] || rep['Assigned'] || rep['Closed']);
  const byPriority = manager.getReportByPriority();
  assert.ok(byPriority.High || byPriority.Urgent || byPriority.Normal);
});

test('missing or empty data files are handled', async () => {
  const fs = require('node:fs/promises');
  const path = require('node:path');
  const testDir = path.join(__dirname, 'tmpdata');
  await fs.mkdir(testDir, { recursive: true });
  const repo = require('../src/repositories/UserFileRepository');
  const r = new repo(testDir);
  const data = await r.loadAll();
  assert.deepEqual(data, []);
  await fs.rm(testDir, { recursive: true, force: true });
});

