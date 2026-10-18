# Lab 2 - Dining Booking Credit Extension

Student Name: Jerry Yauti

Student ID: 240166

Repository: https://github.com/JerryYauti/IS305-DWU240166

Description

This Lab 2 extension builds on the Lab 1 Dining Meal Booking application by
introducing a separate Student class and connecting Student objects to
MealBooking objects. The goal is to avoid duplicated student information and
show how objects can reference other objects.

Files in Lab2_DiningCreditExtension
- Student.js - Defines the Student class with private fields, getters/setters,
  getFullName() and displayInfo(). Setters validate empty values.
- MealBooking.js - Refactored to accept a Student object (stored in #student)
  and to use the Student object when validating and generating summaries.
- DiningApp.js - Runs Lab 2 tests and provides an interactive console flow to
  create students and bookings, show booking history, and demonstrate updating
  student details.

How Lab 2 extends Lab 1
- Previously studentId and studentName were stored directly in each
  MealBooking. Now a Student object holds identity information and MealBooking
  objects reference the Student object. Updating the Student updates all
  connected bookings.

How to run
1. Ensure Node.js v16+ is installed.
2. From the repository root run:

```
node Lab2_DiningCreditExtension/DiningApp.js
```

Tests implemented
- Valid student: creates and displays a Student object.
- Invalid student: attempts to create a Student with empty fields and shows
  validation rejection.
- Student and booking integration: creates a booking connected to a Student
  object and displays the booking summary.
- Updated student name: updates the Student's name and shows the change in
  existing booking summaries.
- Booking history: filters and displays a student's bookings, the total
  number and combined cost.

AI tools used
I used GitHub Copilot to help generate and modify code during development.

