const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const User = require('./models/User');
const StudentRequester = require('./models/StudentRequester');
const StaffRequester = require('./models/StaffRequester');
const ServiceOfficer = require('./models/ServiceOfficer');
const Technician = require('./models/Technician');
const ServiceRequest = require('./models/ServiceRequest');
const ICTSupportRequest = require('./models/ICTSupportRequest');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const CleaningRequest = require('./models/CleaningRequest');
const ServiceRequestManager = require('./ServiceRequestManager');
const UserFileRepository = require('./repositories/UserFileRepository');
const ServiceRequestFileRepository = require('./repositories/ServiceRequestFileRepository');
const AuditFileRepository = require('./repositories/AuditFileRepository');
const ServiceRequestFactory = require('./factories/ServiceRequestFactory');

const userRepo = new UserFileRepository('data');
const requestRepo = new ServiceRequestFileRepository('data');
const auditRepo = new AuditFileRepository('data');
const manager = new ServiceRequestManager();

const rl = readline.createInterface({ input, output });

function printMenu() {
  console.log('\n============================================');
  console.log('     CAMPUS SERVICE REQUEST SYSTEM');
  console.log('============================================');
  console.log('1. Register User');
  console.log('2. Submit Service Request');
  console.log('3. View Request by ID');
  console.log('4. View My Requests');
  console.log('5. View All Requests');
  console.log('6. Update My Request');
  console.log('7. Cancel My Request');
  console.log('8. Search Requests');
  console.log('9. View Request Summary');
  console.log('10. Review & Assign Request');
  console.log('11. Start Work / Resolve / Close');
  console.log('12. Generate Reports');
  console.log('13. Exit');
  console.log('============================================');
}

async function logAudit(actorId, action, requestId, description, result) {
  const entry = {
    auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorId,
    action,
    affectedRequestId: requestId || '',
    description,
    dateTime: new Date().toISOString(),
    result
  };
  await auditRepo.create(entry);
}

async function registerUser() {
  try {
    const userId = await rl.question('User ID: ');
    const firstName = await rl.question('First name: ');
    const lastName = await rl.question('Last name: ');
    const email = await rl.question('Email: ');
    const userType = await rl.question('User type (Student/Staff/Service Officer/Technician): ');

    let user;
    if (userType === 'Student') {
      const programme = await rl.question('Programme: ');
      const yearLevel = await rl.question('Year level: ');
      user = new StudentRequester(userId, firstName, lastName, email, programme, yearLevel);
    } else if (userType === 'Staff') {
      const department = await rl.question('Department: ');
      user = new StaffRequester(userId, firstName, lastName, email, department);
    } else if (userType === 'Service Officer') {
      const serviceSection = await rl.question('Service section: ');
      user = new ServiceOfficer(userId, firstName, lastName, email, serviceSection);
    } else if (userType === 'Technician') {
      const technicalSpeciality = await rl.question('Technical speciality: ');
      user = new Technician(userId, firstName, lastName, email, technicalSpeciality);
    } else {
      user = new User(userId, firstName, lastName, email, userType || 'Requester');
    }

    manager.registerUser(user);
    await userRepo.create({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      programme: user.programme || '',
      yearLevel: user.yearLevel || '',
      department: user.department || '',
      serviceSection: user.serviceSection || '',
      technicalSpeciality: user.technicalSpeciality || ''
    });
    await logAudit(user.userId, 'user registration', '', 'User registered', 'success');
    console.log('User registered successfully');
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
}

async function submitRequest() {
  try {
    const requestId = await rl.question('Request ID: ');
    const requesterId = await rl.question('Requester User ID: ');
    const requester = manager.findUserById(requesterId);
    if (!requester) throw new Error('Requester not found.');

    const title = await rl.question('Title: ');
    const description = await rl.question('Description: ');
    const location = await rl.question('Campus location: ');
    const category = await rl.question(`Category (${ServiceRequestV().join(', ')}): `);
    const priority = await rl.question(`Priority (${ServiceRequest.allowedPriorities().join(', ')}): `);

    let request;
    if (category === 'ICT Support') {
      const deviceType = await rl.question('Device type: ');
      const systemName = await rl.question('System name: ');
      const faultType = await rl.question('Fault type: ');
      const networkImpact = await rl.question('Network impact: ');
      request = new ICTSupportRequest({ requestId, requester, title, description, location, priority, deviceType, systemName, faultType, networkImpact });
    } else if (category === 'Facilities Maintenance') {
      const building = await rl.question('Building: ');
      const roomNumber = await rl.question('Room number: ');
      const hazardLevel = await rl.question('Hazard level: ');
      const equipmentAffected = await rl.question('Equipment affected: ');
      request = new MaintenanceRequest({ requestId, requester, title, description, location, priority, building, roomNumber, hazardLevel, equipmentAffected });
    } else if (category === 'Cleaning and Sanitation') {
      const cleaningArea = await rl.question('Cleaning area: ');
      const hygieneRisk = await rl.question('Hygiene risk: ');
      const serviceType = await rl.question('Service type: ');
      const preferredServiceTime = await rl.question('Preferred service time: ');
      request = new CleaningRequest({ requestId, requester, title, description, location, priority, cleaningArea, hygieneRisk, serviceType, preferredServiceTime });
    } else {
      request = new ServiceRequest({ requestId, requester, title, description, location, category, priority });
    }

    manager.submitRequest(request);
    await requestRepo.create(request.toJSON());
    await logAudit(requester.userId, 'request creation', request.requestId, 'Request created', 'success');
    console.log('Request submitted successfully.');
  } catch (error) {
    console.error('Submit request failed:', error.message);
  }
}

function ServiceRequestV() {
  return ServiceRequest.allowedCategories();
}

async function viewRequestById() {
  const requestId = await rl.question('Request ID: ');
  const request = manager.findRequestById(requestId);
  if (!request) {
    console.log('Request not found.');
    return;
  }
  console.log(JSON.stringify(request.getRequestSummary(), null, 2));
}

async function viewMyRequests() {
  const userId = await rl.question('User ID: ');
  const requests = manager.getRequestsByUser(userId);
  if (!requests.length) console.log('No requests found.');
  else requests.forEach((request) => console.log(JSON.stringify(request.getRequestSummary(), null, 2)));
}

async function viewAllRequests() {
  const requests = manager.getAllRequests();
  if (!requests.length) console.log('No requests exist.');
  else requests.forEach((request) => console.log(JSON.stringify(request.getRequestSummary(), null, 2)));
}

async function updateMyRequest() {
  try {
    const userId = await rl.question('Your user ID: ');
    const requestId = await rl.question('Request ID: ');
    const changes = {};
    const title = await rl.question('New title (blank to skip): ');
    const description = await rl.question('New description (blank to skip): ');
    const location = await rl.question('New location (blank to skip): ');
    const category = await rl.question('New category (blank to skip): ');
    const priority = await rl.question('New priority (blank to skip): ');
    if (title) changes.title = title;
    if (description) changes.description = description;
    if (location) changes.location = location;
    if (category) changes.category = category;
    if (priority) changes.priority = priority;
    const updated = manager.updateRequest(requestId, userId, changes);
    await requestRepo.update(requestId, updated.toJSON());
    await logAudit(userId, 'request update', requestId, 'Request updated', 'success');
    console.log('Request updated.');
  } catch (error) {
    console.error('Update failed:', error.message);
  }
}

async function cancelMyRequest() {
  try {
    const userId = await rl.question('Your User ID: ');
    const requestId = await rl.question('Request ID to cancel: ');
    const cancelled = manager.cancelRequest(requestId, userId);
    await requestRepo.update(requestId, cancelled.toJSON());
    await logAudit(userId, 'request cancellation', requestId, 'Request cancelled', 'success');
    console.log('Request cancelled.');
  } catch (error) {
    console.error('Cancellation failed:', error.message);
  }
}

async function searchRequests() {
  const text = await rl.question('Search text: ');
  const results = manager.searchRequests(text);
  if (!results.length) console.log('No matching requests.');
  else results.forEach((request) => console.log(JSON.stringify(request.getRequestSummary(), null, 2)));
}

async function viewRequestSummary() {
  console.log(JSON.stringify(manager.getRequestSummaryByStatus(), null, 2));
}

async function reviewAndAssignRequest() {
  try {
    const officerId = await rl.question('Service Officer ID: ');
    const requestId = await rl.question('Request ID: ');
    const request = manager.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    request.reviewRequest(officerId);
    const technicianId = await rl.question('Technician ID: ');
    request.assignTechnician(officerId, technicianId);
    await requestRepo.update(requestId, request.toJSON());
    await logAudit(officerId, 'technician assignment', requestId, `Assigned technician ${technicianId}`, 'success');
    console.log('Request reviewed and assigned.');
  } catch (error) {
    console.error('Review/assignment failed:', error.message);
  }
}

async function startWorkResolveClose() {
  try {
    const actorId = await rl.question('Actor ID (Technician or Officer): ');
    const requestId = await rl.question('Request ID: ');
    const request = manager.findRequestById(requestId);
    if (!request) throw new Error('Request not found.');
    const action = await rl.question('Choose action: begin|progress|resolve|close: ');
    if (action === 'begin') request.beginWork(actorId);
    if (action === 'progress') {
      const notes = await rl.question('Progress notes: ');
      request.recordProgress(actorId, notes);
    }
    if (action === 'resolve') {
      const notes = await rl.question('Resolution notes: ');
      request.resolveRequest(actorId, notes);
    }
    if (action === 'close') {
      request.closeRequest(actorId);
    }
    await requestRepo.update(requestId, request.toJSON());
    await logAudit(actorId, action, requestId, `${action} request`, 'success');
    console.log('Workflow action completed.');
  } catch (error) {
    console.error('Workflow failed:', error.message);
  }
}

async function generateReports() {
  console.log('Status report:');
  console.log(JSON.stringify(manager.getReportByStatus(), null, 2));
  console.log('Category report:');
  console.log(JSON.stringify(manager.getReportByCategory(), null, 2));
  console.log('Priority report:');
  console.log(JSON.stringify(manager.getReportByPriority(), null, 2));
  console.log('Urgent requests:');
  console.log(JSON.stringify(manager.getUrgentRequests().map((r) => r.getRequestSummary()), null, 2));
  console.log('Location report:');
  console.log(JSON.stringify(manager.getRequestsByLocation(), null, 2));
  console.log('Average resolution time (hours):', manager.getAverageResolutionTime());
}

async function bootstrap() {
  const userData = await userRepo.loadAll();
  const requestData = await requestRepo.loadAll();
  const userMap = {};

  for (const item of userData) {
    const user = manager.createUserFromRecord(item);
    manager.users.push(user);
    userMap[user.userId] = user;
  }

  for (const item of requestData) {
    const restoredRequest = ServiceRequestFactory.createFromData(item, userMap);
    manager.requests.push(restoredRequest);
  }
}

async function mainLoop() {
  await bootstrap();
  let running = true;
  while (running) {
    printMenu();
    const choice = await rl.question('Select option: ');
    switch (choice.trim()) {
      case '1': await registerUser(); break;
      case '2': await submitRequest(); break;
      case '3': await viewRequestById(); break;
      case '4': await viewMyRequests(); break;
      case '5': await viewAllRequests(); break;
      case '6': await updateMyRequest(); break;
      case '7': await cancelMyRequest(); break;
      case '8': await searchRequests(); break;
      case '9': await viewRequestSummary(); break;
      case '10': await reviewAndAssignRequest(); break;
      case '11': await startWorkResolveClose(); break;
      case '12': await generateReports(); break;
      case '13': running = false; break;
      default: console.log('Invalid choice.');
    }
  }
  console.log('Goodbye.');
  rl.close();
}

if (require.main === module) {
  mainLoop().catch((error) => {
    console.error('Application error:', error.message);
    process.exit(1);
  });
}

module.exports = { manager, bootstrap, logAudit };
