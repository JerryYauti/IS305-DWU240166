# User Guide

## Installation Requirements
- Node.js 18+
- Internet access for npm install if dependencies are later added
- Terminal/command prompt

## Setup
1. Open the project folder.
2. Run:
   npm install

## Start the Application
- Use:
  node src/CampusServiceApp.js
- Or run:
  npm start

## Register or Select a User
1. Choose menu option 1 to register a user.
2. Enter user ID, names, email and user type.
3. Use the user ID when submitting and updating requests.

## Submit a Request
1. Select option 2.
2. Enter request ID and requester user ID.
3. Enter title, description, campus location and category.
4. Choose priority and special details based on request type.

## Assign and Process a Request
1. Review using a Service Officer account.
2. Use option 10 to review and assign a technician.
3. Use option 11 to begin work, record progress, resolve, or close a request.

## Search and Reports
- Search by ID or title using option 8
- View summary by status using option 9
- Generate aggregated reports using option 12

## Example Console Screenshot
```text
============================================
     CAMPUS SERVICE REQUEST SYSTEM
============================================
1. Register User
2. Submit Service Request
...
13. Exit
============================================
```

## Common Errors and Solutions
- Duplicate ID: choose a unique ID.
- Invalid email: use a valid email like name@example.com.
- Unsupported category: use one of the allowed categories.
- Invalid status transition: ensure the request reaches the correct workflow step.
