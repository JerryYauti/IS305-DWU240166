/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry Yauti
  Student ID: 240166
  Date: 17 July 2026
  Description: A Node.js console app for booking meals using MealBooking class.
*/

const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');
const MealBooking = require('./AT1_DiningFeature/MealBooking');

const rl = readline.createInterface({ input, output });

const bookings = [];

async function promptBooking() {
  try {
    console.log('========================================');
    console.log('       DWU DINING MEAL BOOKING');
    console.log('========================================\n');

    const studentId = await rl.question('Student ID: ');
    const studentName = await rl.question('Student name: ');
    const mealDate = await rl.question('Meal date (YYYY-MM-DD): ');
    const mealType = await rl.question('Meal type (Breakfast/Lunch/Dinner): ');
    const quantityStr = await rl.question('Quantity: ');
    const dietaryNote = await rl.question('Dietary note: ');

    const quantity = parseInt(quantityStr, 10);

    const booking = new MealBooking({
      studentId: studentId.trim(),
      studentName: studentName.trim(),
      mealDate: mealDate.trim(),
      mealType: mealType.trim(),
      quantity: Number.isNaN(quantity) ? quantityStr : quantity,
      dietaryNote: dietaryNote.trim(),
    });

    // validate
    booking.validate();

    // check duplicate
    const duplicate = bookings.find(b =>
      b.studentId === booking.studentId &&
      b.mealDate === booking.mealDate &&
      b.mealType === booking.mealType
    );

    if (duplicate) {
      console.log('\nError: Duplicate booking detected for the same student, date and meal type.');
      return;
    }

    bookings.push(booking);

    console.log('\n========================================');
    console.log('          BOOKING CREATED');
    console.log('========================================');
    console.log(booking.getSummary());

    // demonstrate confirm/cancel
    const action = await rl.question('\nEnter C to confirm, X to cancel, or any other key to leave as Pending: ');
    if (action.toUpperCase() === 'C') {
      booking.confirmBooking();
      console.log('\nBooking confirmed.');
    } else if (action.toUpperCase() === 'X') {
      booking.cancelBooking();
      console.log('\nBooking cancelled.');
    }

    console.log('\nFinal booking receipt:');
    console.log(booking.getSummary());
  } catch (err) {
    console.log('\nError:', err.message);
  }
}

async function runTests() {
  console.log('Running required tests...\n');

  // 1. Valid booking
  try {
    const b1 = new MealBooking({
      studentId: 'DWU2026001',
      studentName: 'Maria Kila',
      mealDate: '2026-07-18',
      mealType: 'Lunch',
      quantity: 2,
      dietaryNote: 'No peanuts',
    });
    b1.validate();
    bookings.push(b1);
    console.log('Test 1 (Valid booking) PASSED:');
    console.log(b1.getSummary());
  } catch (e) {
    console.log('Test 1 (Valid booking) FAILED:', e.message);
  }

  // 2. Invalid booking
  try {
    const b2 = new MealBooking({
      studentId: '',
      studentName: '',
      mealDate: '',
      mealType: 'Brunch',
      quantity: 0,
    });
    b2.validate();
    console.log('Test 2 (Invalid booking) FAILED: invalid booking accepted');
  } catch (e) {
    console.log('Test 2 (Invalid booking) PASSED:', e.message);
  }

  // 3. Duplicate booking
  try {
    const b3 = new MealBooking({
      studentId: 'DWU2026001',
      studentName: 'Maria Kila',
      mealDate: '2026-07-18',
      mealType: 'Lunch',
      quantity: 1,
    });
    b3.validate();
    const dup = bookings.find(b =>
      b.studentId === b3.studentId &&
      b.mealDate === b3.mealDate &&
      b.mealType === b3.mealType
    );
    if (dup) {
      console.log('Test 3 (Duplicate booking) PASSED: duplicate detected');
    } else {
      console.log('Test 3 (Duplicate booking) FAILED: duplicate not detected');
    }
  } catch (e) {
    console.log('Test 3 (Duplicate booking) ERROR:', e.message);
  }

  console.log('\nTests complete.');
}

async function main() {
  try {
    await runTests();

    const again = await rl.question('\nWould you like to create a booking now? (y/n): ');
    if (again.trim().toLowerCase() === 'y') {
      await promptBooking();
    }
  } catch (e) {
    console.log('Unexpected error:', e.message);
  } finally {
    rl.close();
  }
}

main();
