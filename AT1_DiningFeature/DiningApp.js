/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry YAUTI
  Student ID: 240166
  Date: 20th July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/


const readline = require("readline");
const Student = require("./Student");
const MealBooking = require("./MealBooking");

const bookings = [];

function isDuplicate(studentId, mealDate, mealType) {
  return bookings.some(
    (b) => b.studentId === studentId && b.mealDate === mealDate && b.mealType === mealType
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}


async function main() {
  try {
    // Student details
    const studentId = await ask("Enter Student ID: ");
    const firstName = await ask("Enter First Name: ");
    const lastName = await ask("Enter Last Name: ");

    const student = new Student(studentId, firstName, lastName);
    console.log(student.displayInfo());

    // Booking details
    const mealDate = await ask("Enter Meal Date (YYYY-MM-DD): ");
    const mealType = await ask("Enter Meal Type (Breakfast/Lunch/Dinner): ");
    const quantity = parseInt(await ask("Enter Quantity: "), 10);
    const dietaryNote = await ask("Enter Dietary Note: ");

    if (isDuplicate(studentId, mealDate, mealType)) {
      console.log("❌ Duplicate booking detected. Booking rejected.");
      rl.close();
      return;
    }

    const booking = new MealBooking(studentId, student.getFullName(), mealDate, mealType, quantity, dietaryNote);
    booking.validate();

    bookings.push(booking);

    console.log("\n✅ Booking created successfully!");
    console.log(booking.getSummary());

  } catch (err) {
    console.error(err.message);
  } finally {
    rl.close();
  }
}

main();

