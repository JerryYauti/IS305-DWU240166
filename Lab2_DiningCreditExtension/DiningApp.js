/*
  Program: Dining Meal Booking Feature - Lab 2
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: Console application that demonstrates Student and MealBooking
  integration. Runs required tests and provides interactive flows.
*/

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const Student = require('./Lab2_DiningCreditExtension/Student');
const MealBooking = require('./Lab2_DiningCreditExtension/MealBooking');

const rl = readline.createInterface({ input, output });

const bookings = [];

function displayBookingHistory(student, bookingsArray) {
  console.log('\n========================================');
  console.log('           BOOKING HISTORY');
  console.log('========================================');
  const studentBookings = bookingsArray.filter(b => b.student && b.student.studentId === student.studentId);

  if (studentBookings.length === 0) {
    console.log('No bookings found for', student.getFullName());
    console.log('========================================');
    return;
  }

  let combinedCost = 0;
  studentBookings.forEach((b, idx) => {
    const cost = b.calculateTotal();
    combinedCost += cost;
    console.log(`${idx + 1}. ${b.mealType} - ${b.mealDate}`);
    console.log(`   Quantity: ${b.quantity}`);
    console.log(`   Status: ${b.bookingStatus}`);
    console.log(`   Cost: K${cost.toFixed(2)}\n`);
  });

  console.log(`Total Bookings: ${studentBookings.length}`);
  console.log(`Combined Cost: K${combinedCost.toFixed(2)}`);
  console.log('========================================\n');
}

async function runLab2Tests() {
  console.log('Running Lab 2 required tests...\n');

  // Test 1: Valid Student object
  try {
    const s1 = new Student('DWU2026001', 'Maria', 'Kila');
    console.log('Test 1 (Valid Student) PASSED:');
    console.log(s1.displayInfo());
  } catch (e) {
    console.log('Test 1 (Valid Student) FAILED:', e.message);
  }

  // Test 2: Invalid Student information
  try {
    const s2 = new Student('', '', '');
    console.log('Test 2 (Invalid Student) FAILED: invalid student accepted');
  } catch (e) {
    console.log('Test 2 (Invalid Student) PASSED:', e.message);
  }

  // Test 3: Student and booking integration
  try {
    const s3 = new Student('DWU2026002', 'John', 'Doe');
    const b1 = new MealBooking({
      student: s3,
      mealDate: '2026-08-12',
      mealType: 'Lunch',
      quantity: 2,
      dietaryNote: 'No nuts',
    });
    b1.validate();
    bookings.push(b1);
    console.log('\nTest 3 (Integration) PASSED: booking created using Student object');
    console.log(b1.getSummary());
  } catch (e) {
    console.log('Test 3 (Integration) FAILED:', e.message);
  }

  // Test 4: Updated student name appears in existing booking summaries
  try {
    const s4 = new Student('DWU2026003', 'Alice', 'Smith');
    const b2 = new MealBooking({ student: s4, mealDate: '2026-08-13', mealType: 'Dinner', quantity: 1 });
    b2.validate();
    bookings.push(b2);
    console.log('\nBefore name update:');
    console.log(b2.getSummary());
    // update name
    s4.firstName = 'Alicia';
    console.log('\nAfter name update:');
    console.log(b2.getSummary());
    console.log('Test 4 (Student update propagation) PASSED');
  } catch (e) {
    console.log('Test 4 FAILED:', e.message);
  }

  // Test 5: Booking history
  try {
    const sHist = new Student('DWU2026002', 'John', 'Doe');
    console.log('\nTest 5 (Booking history) - showing bookings for John Doe:');
    displayBookingHistory(sHist, bookings);
    console.log('Test 5 (Booking history) COMPLETED');
  } catch (e) {
    console.log('Test 5 FAILED:', e.message);
  }

  console.log('\nLab 2 tests complete.');
}

async function promptInteractiveFlow() {
  try {
    console.log('\n========================================');
    console.log('       DWU DINING MEAL BOOKING - Lab 2');
    console.log('========================================\n');

    // Create Student
    const studentId = await rl.question('Student ID: ');
    const firstName = await rl.question('First name: ');
    const lastName = await rl.question('Last name: ');

    let student;
    try {
      student = new Student(studentId.trim(), firstName.trim(), lastName.trim());
    } catch (e) {
      console.log('Error creating student:', e.message);
      return;
    }

    console.log('\nStudent created:');
    console.log(student.displayInfo());

    // Create Booking
    const mealDate = await rl.question('Meal date (YYYY-MM-DD): ');
    const mealType = await rl.question('Meal type (Breakfast/Lunch/Dinner): ');
    const quantityStr = await rl.question('Quantity: ');
    const dietaryNote = await rl.question('Dietary note: ');

    const quantity = parseInt(quantityStr, 10);

    const booking = new MealBooking({
      student,
      mealDate: mealDate.trim(),
      mealType: mealType.trim(),
      quantity: Number.isNaN(quantity) ? quantityStr : quantity,
      dietaryNote: dietaryNote.trim(),
    });

    try {
      booking.validate();
    } catch (e) {
      console.log('Booking validation error:', e.message);
      return;
    }

    // duplicate detection
    const duplicate = bookings.find(b => b.student.studentId === booking.student.studentId && b.mealDate === booking.mealDate && b.mealType === booking.mealType);
    if (duplicate) {
      console.log('\nError: Duplicate booking detected for the same student, date and meal type.');
      return;
    }

    bookings.push(booking);

    console.log('\nBooking created:');
    console.log(booking.getSummary());

    // display booking history for this student
    displayBookingHistory(student, bookings);

    // allow updating student name
    const update = await rl.question('Update student name? (y/n): ');
    if (update.trim().toLowerCase() === 'y') {
      const newFirst = await rl.question('New first name: ');
      const newLast = await rl.question('New last name: ');
      try {
        student.firstName = newFirst.trim();
        student.lastName = newLast.trim();
        console.log('\nStudent updated:');
        console.log(student.displayInfo());
        console.log('\nBooking summaries after update:');
        console.log(booking.getSummary());
      } catch (e) {
        console.log('Error updating student:', e.message);
      }
    }

  } catch (e) {
    console.log('Unexpected error:', e.message);
  }
}

async function main() {
  try {
    await runLab2Tests();

    const runInteractive = await rl.question('\nWould you like to run the interactive Lab 2 flow now? (y/n): ');
    if (runInteractive.trim().toLowerCase() === 'y') {
      await promptInteractiveFlow();
    }
  } catch (e) {
    console.log('Unexpected error in main:', e.message);
  } finally {
    rl.close();
  }
}

main();
