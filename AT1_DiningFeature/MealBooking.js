/*
  Program: Dining Meal Booking Feature
  Student Name: Jerry YAUTI
  Student ID: 240166
  Date: 20th July 2026
  Description: A JavaScript program demonstrating classes,
  objects, constructors, private fields and methods.
*/

class MealBooking {
  #studentId;
  #studentName;
  #mealDate;
  #mealType;
  #quantity;
  #dietaryNote;
  #bookingStatus;

  constructor(studentId, studentName, mealDate, mealType, quantity, dietaryNote) {
    this.#studentId = studentId;
    this.#studentName = studentName;
    this.#mealDate = mealDate;
    this.#mealType = mealType;
    this.#quantity = quantity;
    this.#dietaryNote = dietaryNote;
    this.#bookingStatus = "Pending";
  }


// Getters
  get studentId() { return this.#studentId; }
  get studentName() { return this.#studentName; }
  get mealDate() { return this.#mealDate; }
  get mealType() { return this.#mealType; }
  get quantity() { return this.#quantity; }
  get dietaryNote() { return this.#dietaryNote; }
  get bookingStatus() { return this.#bookingStatus; }


// Validation
validate() {
  if (!this.#studentId) throw new Error (" Missing Student ID!, please Enter your ID Number");
  if (!this.#studentName) throw new Error ("Missing student name!, please your name");
  if (!this.#mealDate) throw new error ("Missing Date!, Please enter todays Date");
  if (!["Breakfast","Lunch","Dinner"].includes(this.#mealType)) throw new Error ("Invalid meal Type!, Enter Brekfast, Lunch, or Dinner");
  if (this.#quantity<1) throw new Error ("Invalid Quantity!,Quantity must be at least 1 and above");
}


// Method to calculate total cost
  calculateTotal() {
    let price = 0;
    if (this.#mealType === "Breakfast") price = 10;
    else if (this.#mealType === "Lunch") price = 15;
    else if (this.#mealType === "Dinner") price = 20;
return price * this.#quantity;
  }

//Booking status methods
confirmBooking() {this.#bookingStatus = "Confirmed";}
cancelBooking() {this.#bookingStatus = "Cancelled"}

// Receipt
getSummary(){
 return`

===================================================================
			DWU DINING MEAL BOOKING
===================================================================

Student: ${this.#studentName}(${this.#studentId})
Meal: ${this.#mealType} x ${this.#quantity}
Date: ${this.#mealDate}
Dietary note: ${this.#dietaryNote}
Status: ${this.#bookingStatus}
Total cost: K${this.calculateTotal().toFixed(2)}

===================================================================
`;
  }
}

module.exports = MealBooking;
