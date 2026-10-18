# Technical Documentation

## Project Folder Structure
- `src/models`: domain classes and entity definitions
- `src/repositories`: file-based repositories for users requests and audit logs
- `src/factories`: restore JSON data to object instances
- `src/ServiceRequestManager.js`: central manager for arrays and workflow logic
- `src/CampusServiceApp.js`: console-driven workflow and menu
- `data`: JSON files storing simulated records
- `tests`: automated tests using Node.js test runner

## Responsibility of Each Class
- `User`: base class for system users
- `StudentRequester`: student details and validation
- `StaffRequester`: staff details and validation
- `ServiceOfficer`: officer role and duties
- `Technician`: technician role and validation
- `ServiceRequest`: base request class with workflow, validation, and history
- `ICTSupportRequest`: specialised ICT request logic
- `MaintenanceRequest`: facilities maintenance logic
- `CleaningRequest`: cleaning and sanitation logic
- `ServiceRequestManager`: central array management, filtering, status workflow and reporting
- `UserFileRepository`: user JSON persistence
- `ServiceRequestFileRepository`: request JSON persistence
- `AuditFileRepository`: audit record persistence
- `ServiceRequestFactory`: restore JSON data into subclasses

## Encapsulation
Private fields are used extensively in the model classes, such as `#userId`, `#email`, and `#requestId`. These are accessed through getters and controlled methods so the internal state cannot be modified directly.

## Inheritance and Constructor Chaining
Subclass constructors in `StudentRequester`, `StaffRequester`, `ServiceOfficer`, and `Technician` call `super(...)` from the base `User` class. Specialized request classes call `super(...)` before setting their own fields.

## Overriding and Polymorphism
The specialized request classes override `getRequestSummary()`, `calculatePriorityScore()`, and `getTargetResolutionHours()`. Because each subclass implements these methods differently, a single collection of request objects can be processed uniformly using a common method call.

## Workflow Control
Requests follow a controlled status flow: Submitted → Reviewed → Assigned → In Progress → Resolved → Closed. `ServiceRequest.changeStatus()` enforces valid transitions and prevents invalid state changes.

## Validation and Error Handling
Validation is performed in constructors and setter logic. Invalid categories, duplicate IDs, unsupported priorities, and illegal transitions all throw clear error messages.

## JSON Storage and Restoration
JSON files are used in the `data` folder. The repository classes read and write JSON. When the application restarts, `ServiceRequestFactory.createFromData()` rehydrates saved request objects into the correct subclass.

## Testing Organisation
Tests are placed in the `tests` folder and run using the Node.js built-in test runner. They cover validation, workflow, report generation, and object restoration.

## Known Limitations
- Console interface only
- No external database
- Simulated data only
- No advanced GUI or multi-user persistence beyond JSON files

## Future Improvements
- Login and authentication system
- Web or desktop UI
- Role permissions integration with user sessions
- More detailed reporting dashboard
