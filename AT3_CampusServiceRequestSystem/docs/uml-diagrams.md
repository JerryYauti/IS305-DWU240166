# UML and System Design

## Use Case Diagram
```mermaid
flowchart LR
  User[Requester] --> Submit[Submit Request]
  User --> View[View Requests]
  Officer[Service Officer] --> Review[Review Request]
  Officer --> Assign[Assign Technician]
  Officer --> Close[Close Request]
  Technician --> Progress[Record Progress]
  Technician --> Resolve[Resolve Request]
  Admin[Administrator] --> Report[Generate Reports]
```

## Class Diagram
```mermaid
classDiagram
  class User
  class StudentRequester
  class StaffRequester
  class ServiceOfficer
  class Technician
  class ServiceRequest
  class ICTSupportRequest
  class MaintenanceRequest
  class CleaningRequest
  class ServiceRequestManager
  class UserFileRepository
  class ServiceRequestFileRepository
  class AuditFileRepository
  class ServiceRequestFactory

  User <|-- StudentRequester
  User <|-- StaffRequester
  User <|-- ServiceOfficer
  User <|-- Technician
  ServiceRequest <|-- ICTSupportRequest
  ServiceRequest <|-- MaintenanceRequest
  ServiceRequest <|-- CleaningRequest
  ServiceRequestManager o-- User
  ServiceRequestManager o-- ServiceRequest
  UserFileRepository --> User
  ServiceRequestFileRepository --> ServiceRequest
  AuditFileRepository --> AuditLog
  ServiceRequestFactory --> ServiceRequest
```

## Sequence Diagram: Submit Request
```mermaid
sequenceDiagram
  actor User
  participant App
  participant Manager
  participant Request

  User->>App: Select submit request
  App->>Manager: validate user
  Manager->>Request: create request object
  Request-->>Manager: valid request
  Manager-->>App: request stored
  App-->>User: confirmation message
```

## Sequence Diagram: Assign Technician
```mermaid
sequenceDiagram
  actor Officer
  participant App
  participant Request
  participant Manager

  Officer->>App: review and assign technician
  App->>Manager: find request
  Manager->>Request: reviewRequest
  Request-->>Manager: reviewed
  Manager->>Request: assignTechnician
  Request-->>Manager: assigned
  App-->>Officer: success message
```

## Sequence Diagram: Resolve and Close
```mermaid
sequenceDiagram
  actor Technician
  actor Officer
  participant App
  participant Request

  Technician->>App: resolve request
  App->>Request: resolveRequest
  Request-->>App: Resolved
  Officer->>App: close request
  App->>Request: closeRequest
  Request-->>Officer: Closed
```

## Class Relationship Explanation
The application uses inheritance to represent specialised user and request types. `User` is the base class and each role extends it. `ServiceRequest` is the abstract-style base class for request categories. The manager class coordinates all objects and the repositories handle persistence to JSON.
