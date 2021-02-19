module.exports = {
  get SettingsScreen() {
    return require('./Settings').default;
  },
  get AccountView() {
    return require('./AccountView').default;
  },
  get WorkSpacesView() {
    return require('./WorkSpacesView').default;
  },
  get SavedParcelsView() {
    return require('./SavedParcelsView').default;
  },
  get ProfileView() {
    return require('./ProfileView').default;
  },
};
