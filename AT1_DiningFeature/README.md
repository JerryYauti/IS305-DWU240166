# AT1 Dining Meal Booking Feature

Student Name: Jerry Yauti

Student ID: 240166

Repository: https://github.com/JerryYauti/IS305-DWU240166

Description:
A Node.js console application that allows DWU students to create dining meal bookings. The program demonstrates classes, private fields, getters/setters, validation, and simple array-based storage without using a database.

Files:
- AT1_DiningFeature/MealBooking.js - Defines the MealBooking class with private fields, validation, calculation and booking control methods.
- AT1_DiningFeature/DiningApp.js - Console application that runs required tests and allows interactive booking via readline/promises.

How to run:
1. Ensure Node.js (v16+) is installed.
2. From the repository root run:

```
node AT1_DiningFeature/DiningApp.js
```

Tests completed:
- Valid booking: created a sample valid booking and displayed correct total (K30.00 for Lunch x2).
- Invalid booking: attempted to create a booking with missing/invalid fields and confirmed validation rejects it.
- Duplicate booking: attempted to create a booking with same student ID, date and meal type and confirmed detection.
