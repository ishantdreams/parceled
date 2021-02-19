module.exports = {
  get ParcelDetails() {
    return require('./ParcelDetails').default;
  },
  get ParcelMap() {
    return require('./ParcelMap').default;
  },
  get MapLayersView() {
    return require('./MapLayersView').default;
  },
  get WatchListView() {
    return require('./WatchListView').default;
  },
  get ReportWebView() {
    return require('./ReportWebView').default;
  },
  get FeedbackView() {
    return require('./FeedbackView').default;
  },
  get LocationSearchView() {
    return require('./LocationSearchView').default;
  },
  get NotesView() {
    return require('./NotesView').default;
  },
  get ParcelKeyDetail() {
    return require('./ParcelKeyDetail').default;
  },
  get ParcelTaxesView() {
    return require('./ParcelTaxesView').default;
  },
  get ParcelSchoolDetailView() {
    return require('./ParcelSchoolDetailView').default;
  },
  get SingInRegisterView() {
    return require('../Register/SingInRegisterView').default;
  },
  get SignUpView() {
    return require('../Register/SignUpView').default;
  },
  get SignInView() {
    return require('../Register/SignInView').default;
  },
  get ForgotPasswordView() {
    return require('../Register/ForgotPasswordView').default;
  },
};
