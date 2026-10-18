# Test Report

| Test ID | Feature Tested | Test Input | Expected Result | Actual Result | Result |
|---|---|---|---|---|---|
| T01 | valid user registration | create valid User | successful registration | passed | Pass |
| T02 | duplicate ID validation | same user ID twice | second user rejected | passed | Pass |
| T03 | valid request submission | submit ICT request | request stored | passed | Pass |
| T04 | invalid category validation | unsupported category | error thrown | passed | Pass |
| T05 | ownership update validation | update request with wrong user | rejected | passed | Pass |
| T06 | technician assignment | officer assigns technician | assigned status changed | passed | Pass |
| T07 | invalid workflow transition | close unresolved request | error thrown | passed | Pass |
| T08 | specialised request behaviour | custom priority scoring | correct output | passed | Pass |
| T09 | polymorphism | array of specialised requests | all methods work | passed | Pass |
| T10 | factory restore | restore from JSON | subclass recreated | passed | Pass |
| T11 | reports | generate summaries | values returned | passed | Pass |
| T12 | empty file handling | temporary folder | no crash | passed | Pass |

This report reflects the automated tests run via Node.js test runner.
