class Student {
  #studentId;
  #firstName;
  #lastName;

  constructor(studentId, firstName, lastName) {
    if (!studentId || !firstName || !lastName) {
      throw new Error("❌ Student ID, first name, and last name are required");
    }
    this.#studentId = studentId;
    this.#firstName = firstName;
    this.#lastName = lastName;
  }

  // Getters
  get studentId() { return this.#studentId; }
  get firstName() { return this.#firstName; }
  get lastName() { return this.#lastName; }

  // Setters with validation
  set studentId(id) {
    if (!id) throw new Error("❌ Student ID cannot be empty");
    this.#studentId = id;
  }

  set firstName(name) {
    if (!name) throw new Error("❌ First name cannot be empty");
    this.#firstName = name;
  }

  set lastName(name) {
    if (!name) throw new Error("❌ Last name cannot be empty");
    this.#lastName = name;
  }

  // Methods
  getFullName() {
    return `${this.#firstName} ${this.#lastName}`;
  }

  displayInfo() {
    return `
========================================
             STUDENT DETAILS
========================================
Student ID: ${this.#studentId}
Student Name: ${this.getFullName()}
========================================
`;
  }
}

module.exports = Student;

