class User {
  constructor({ userEmail, userFirstName, userLastName, userTel, dateOfBirth }) {
    this.userEmail = userEmail;
    this.userFirstName = userFirstName;
    this.userLastName = userLastName;
    this.userTel = userTel;
    this.dateOfBirth = dateOfBirth;
  }

  getAge(today = new Date()) {
    const birth = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birth.getUTCFullYear();
    const month = today.getMonth() - birth.getUTCMonth();
    if (month < 0 || (month === 0 && today.getDate() < birth.getUTCDate())) age--;
    return age;
  }
}

module.exports = User;
