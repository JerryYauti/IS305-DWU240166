# Campus Service Request Management System

Student Name: Jerry Yauti
Student ID: 240166

Project Title: Campus Service Request Management System
GitHub Repository: https://github.com/JerryYauti/IS305-DWU240166

Achievement components attempted: Pass, Credit, Distinction

Project Description
This project is a JavaScript and Node.js console application for managing campus service requests submitted by students and staff. It provides a complete workflow from registration through request submission, review, assignment, work progress, resolution, closure, and reporting. The system stores all data as JSON, uses object-oriented design with inheritance and polymorphism, and includes automated tests and documentation.

Features Completed
- User registration with validation
- Service request submission and basic CRUD-like management
- Request search, filter and sort
- Credit-level subclasses and role workflows
- Distinction-level abstract-style base class and polymorphism
- JSON file persistence and repository pattern
- Audit log and request history
- Summary and management reports
- Automated tests using Node.js test runner

Folder Structure
AT3_CampusServiceRequestSystem/
├── data/
│   ├── users.json
│   ├── serviceRequests.json
│   ├── requestHistory.json
│   ├── auditLog.json
├── docs/
│   ├── requirements.md
│   ├── uml-diagrams.md
│   ├── technical-documentation.md
│   ├── user-guide.md
│   └── test-report.md
├── src/
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentRequester.js
│   │   ├── StaffRequester.js
│   │   ├── ServiceOfficer.js
│   │   ├── Technician.js
│   │   ├── ServiceRequest.js
│   │   ├── ICTSupportRequest.js
│   │   ├── MaintenanceRequest.js
│   │   └── CleaningRequest.js
│   ├── repositories/
│   │   ├── UserFileRepository.js
│   │   ├── ServiceRequestFileRepository.js
│   │   └── AuditFileRepository.js
│   ├── factories/
│   │   └── ServiceRequestFactory.js
│   ├── ServiceRequestManager.js
│   ├── CampusServiceApp.js
│   └── reporting.js
├── tests/
│   └── at3.test.js
├── package.json
├── README.md
├── AI_USE_DECLARATION.md
└── .gitignore

Installation
1. Open the project folder in a terminal.
2. Run:
   npm install
3. Start the application:
   npm start

Commands
- Run the app:
  node src/CampusServiceApp.js
- Run tests:
  npm test

JSON Data Files
The system stores user records, service requests, request history, and audit records in the data folder as JSON. These files contain only plain data, not database code or credentials. When the program starts, it loads the saved data automatically and restores the correct object types using the factory class.

How Objects Are Restored from Saved Data
Plain JSON cannot store JavaScript class instances. The system uses `ServiceRequestFactory.createFromData()` to rebuild the correct subclass, such as `ICTSupportRequest`, `MaintenanceRequest`, or `CleaningRequest`, when records are loaded from JSON. This preserves specialised field validation and polymorphic behaviour.

Sample User Scenarios
- Register a student and submit an ICT problem.
- A service officer reviews and assigns a technician.
- The technician updates progress, resolves the request, and the officer closes it.
- Search requests by ID or title, and generate summary reports.

Known Limitations
- This is a console-based application rather than a web or database-driven system.
- The application uses simulated data only, matching the requirements.
- Some advanced UI features are not included because the project uses a command-line interface.

Future Improvements
- Add a proper login system with role-based authentication.
- Add a richer dashboard with filtering and export to CSV.
- Add file backup and restore features.
- Expand request workflows for additional complex scenarios.

Approved AI Use Declaration
This project was developed with assistance from AI for design, structure, code generation, and documentation support. The final implementation was reviewed, validated, and adjusted to fit the assessment requirements.
