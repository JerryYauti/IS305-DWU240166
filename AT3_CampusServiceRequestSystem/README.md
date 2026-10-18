# Campus Service Request Management System

Student Name: Jerry Yauti
Student ID: 240166

Project Title: Campus Service Request Management System
GitHub Repository: https://github.com/JerryYauti/IS305-DWU240166

Achievement components completed: Pass, Credit, Distinction

Overview
This Node.js console application records, assigns, processes and monitors campus service requests (ICT, Facilities, Cleaning and General services). The project implements object-oriented design with inheritance and polymorphism, JSON file persistence, repository classes, a factory for object restoration, audit trails, reporting and automated tests — meeting the Distinction requirements for the AT3 assignment.

What is included in the Moodle ZIP
The Moodle submission ZIP must contain everything listed below (the included `create_moodle_zip` script produces this ZIP):
- complete source code (folder: src/)
- data/ (safe simulated JSON files: users.json, serviceRequests.json, requestHistory.json, auditLog.json)
- package.json and package-lock.json (if generated)
- README.md
- docs/ (requirements, UML, technical documentation, user guide, test report)
- tests/ (automated tests)
- AI_USE_DECLARATION.md

How to run the application locally
1. Change into the project folder:
   cd AT3_CampusServiceRequestSystem
2. Install dependencies (Node.js 18+):
   npm install
3. Start the application (console menu):
   npm start
4. Run automated tests:
   npm test

How to create the Moodle ZIP (automated)
1. From the project folder (AT3_CampusServiceRequestSystem) run:
   npm install
   npm run build-zip
2. The script will produce a file named:
   240166_AT3_CampusServiceSystem.zip
3. Verify the ZIP contains the required files listed above before uploading to Moodle.

Notes about JSON data files
- All data files are stored in the `data/` folder and contain only simulated data (no executable code or confidential information).
- On first run the application will create empty JSON arrays if files are missing.
- The application restores class instances from JSON using `src/factories/ServiceRequestFactory.js`.

Testing and verification
- Tests use the Node.js built-in test runner.
- Run `npm test` to execute the automated test suite in `tests/`.
- Tests include constructor validation, duplicate ID checking, role permissions, controlled status transitions, factory restoration and report calculations.

Submission checklist (for Moodle)
- [x] Complete source code in `src/`
- [x] Safe simulated JSON files in `data/`
- [x] Documentation: requirements, UML, technical documentation, user guide, test report
- [x] README.md with installation and run instructions
- [x] Automated tests in `tests/`
- [x] AI Use Declaration
- [x] ZIP produced by `npm run build-zip` and ready to upload to Moodle

Contact / Support
If anything fails during installation or you want minor edits to the README or ZIP contents, tell me what to change and I will update the repository files and re-create the ZIP.
