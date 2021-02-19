export default class Utils {

  static validateEmail(email) {
    //TODO: Add more robust validation
    if (email.length > 0) {
      return true;
    }
    return false;
  }

  static validatePassword(password) {
    //TODO: Add more robust validation
    if (password.length > 0) {
      return true;
    }
    return false;
  }

  static validateAccount(account) {
    //TODO: Add more robust validation
    if (account) {
      return true;
    }
    return false;
  }
  static validateAmount(amount) {
    //TODO: Add more robust validation
    if (amount && amount > 0) {
      return true;
    }
    return false;
  }
}
