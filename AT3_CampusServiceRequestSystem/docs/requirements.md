# Requirements Document

## 1. Project Background
Campus services are currently managed through informal methods, making it difficult to track issues, assign technicians, monitor progress, and confirm problem resolution. The Campus Service Request Management System addresses this by giving users a structured way to submit, review, assign, resolve, and close service requests.

## 2. Problem Statement
Students and staff need a system that records issues such as ICT faults, cleaning needs, and facilities problems in a consistent and traceable way. This improves reporting quality and ensures tasks are followed through to closure.

## 3. Project Objectives
- Record and manage campus service requests
- Assign and monitor responsibilities
- Support role-based workflow control
- Restore data using JSON files
- Generate reports and audit records
- Provide automated tests for validation

## 4. Scope
The system includes user registration, request submission, assignment, status updates, cancellation, search, reports, and persistence. It does not use a database.

## 5. Actors and Roles
- Student Requester
- Staff Requester
- Service Officer
- Technician
- System Administrator

## 6. Functional Requirements
- Register users
- Submit requests with category and priority
- View requests by ID and by user
- Search requests by ID or title
- Update eligible requests
- Cancel eligible requests
- Review and assign technician
- Track request progress
- Resolve and close requests
- Produce summary and management reports

## 7. Non-functional Requirements
- Clean and maintainable JavaScript code
- Validation and error handling
- Console-based interface
- JSON persistence with no database
- Automated tests

## 8. Assumptions and Limitations
- This is a console application only.
- Simulated data is used.
- No login system is implemented beyond role-based checks in the logic.

## 9. User Stories
1. As a student, I want to register so I can report an issue.
2. As a staff member, I want to submit a request with a location and description.
3. As a service officer, I want to review incoming requests.
4. As a service officer, I want to assign a technician.
5. As a technician, I want to update progress.
6. As a technician, I want to resolve requests when work is complete.
7. As a service officer, I want to close resolved requests.
8. As an administrator, I want to view report summaries for monitoring.

## 10. Acceptance Notes
This project is intended to satisfy the Pass, Credit and Distinction elements of the AT3 assessment.
