module.exports = {
  get RegisterEmailScreen() {
    return require('./RegisterEmailScreen').default;
  },
  get ConfirmEmailScreen() {
    return require('./ConfirmEmailScreen').default;
  },
  get SingInRegisterView() {
    return require('./SingInRegisterView').default;
  },
  get SignUpView() {
    return require('./SignUpView').default;
  },
  get SignInView() {
    return require('./SignInView').default;
  },
  get ForgotPasswordView() {
    return require('./ForgotPasswordView').default;
  },
};
