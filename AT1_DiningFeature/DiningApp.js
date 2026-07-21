/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry YAUTI
  Student ID: 240166
  Date: 20th July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

const MealBooking = require('./MealBooking');

// Create a booking object
const booking1 = new MealBooking("240166", "Jerry YAUTI", "20-07-2026", "Lunch", 2, "Vegetarian");

// Display summary
console.log(booking1.getSummary());
