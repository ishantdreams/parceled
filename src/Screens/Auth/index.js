module.exports = {
  get LaunchScreen() { return require('./Launch').default; },
  get LoginScreen() { return require('./Login').default; },
  get AppLoadingScreen() { return require('./AppLoading').default; },
  get AppIntroScreen() { return require('./AppIntro').default; },
};
