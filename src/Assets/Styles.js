var React = require('react-native');
var {StyleSheet, Dimensions, Platform} = React;


export const Fonts = {
    openSans: 'OpenSans-Light',
    openSansRegular: 'OpenSans-Regular',
    openSansSemiBold: 'OpenSans-Semibold',
    openSansBold: 'OpenSans-Bold',
    Precious: "Precious",
}

export const colors = {
  "secondary": '#0686E4',
  "tertiary": '#ffffff',
  "background_dark": '#F0F0F0',
  "text_light": '#ffffff',
  "text_medium": '#464646',
  "text_dark": '#263238',
  "weather_text_color": '#464646',
  "transparent_white": '#FFFFFF00',
  "separator_background": '#E2E2E2',
  lightBlue: '#e9f3ff',
  theme: '#29333f',
  gray: '#b3b3b3',
  grey: '#8B8486',
  lightgrey: '#929292',
  white: '#FFFFFF',
  black: '#221E1F',
  blacklight: '#32221E1F',
  dimgrey: '#EFECED',
  darkgrey: '#808080',
  green: '#B1E3DA',
  darkgreen: '#29DB95',
  lightgreen: '#F0F9F8',
  pink: '#F287B1',
  lightpink: '#FCE7F0',
  blue: '#3379c4',
  green: '#57b889',
  purple: '#4a5192',
  brown: '#a67359',
  skew: '#556d8b',
  orange: '#ef8047',
  blueTab: '#457DC7',
  lightbackground: '#f7f7f7',
  grayLight: '#E0E0E0',
  backGroundColor: '#e6e6e6',
  orangeEE702E: '#EE702E',
};

// workaround since on iOS NotoSans works, but not NotoSans-Regular
// on Android it works as expected (ie NotoSans-Regular)
export const getFont = () => {
  if (require('react-native').Platform.OS === 'ios') {
    return 'NotoSans';
  }
  else return 'NotoSans-Regular';
};

export const values = {
  //"font_body": getFont(),
  "font_body_size": 14,
  "font_title_size": 20,
  "font_time_size": 12,
  //"font_place_size": 20,
  "font_place_size": 16,
  "font_temp_size": 27,
  'border_radius': 2,
  "tiny_icon_size": 22,
  "small_icon_size": 40,
  "large_icon_size": 110,
};

export const baseStyles = {
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  baseContainer: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'flex-start'
  },
  flatListContainer: {
    marginTop: 0,
    alignSelf: "stretch",
  },
  inputs: {
    marginTop: 15,
    flex: 1,
  },
  inputContainer: {
    padding: 10,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  widgetContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
  },
  widgetHeaderContaner: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 60,
    marginBottom: 30,
    width: '100%',
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  widgetTitleText: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '200',
    marginBottom: 10
  },
  widgetBodyContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    width: '100%',
  },
  dealRowWidgetContainer: {
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    width: '100%',
  },

  formContainer: {
    marginTop: 40,
    alignSelf: "stretch",
  },
  input: {
    position: 'absolute',
    left: 5,
    top: 0,
    right: 5,
    bottom: 0,
    height: 40,
    fontSize: 18,
    padding: 5
  },
  greyFont: {
    color: '#555'
  },
  darkFont: {
    color: '#000'
  },
  titleText: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '200',
    marginBottom: 10
  },
  descriptionText: {
    fontSize: 15,
    textAlign: 'left',
    color: "#cdcdcd",
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '100',
  },
  galleryImages: {
    marginLeft: 5,
    marginRight: 5,
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: .15,
  },
  scrollContainer: {
    flex: .85,
  },
  priceText: {
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '100',
  },
  subText: {
    fontSize: 15,
    textAlign: 'center',
    color: "#31D8A0",
    fontWeight: '100',
  },
  subText2: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '100',
  },
  formRow: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: colors.tertiary,
    flex: 1,
    flexDirection: 'row',  // main axis
    justifyContent: 'space-between', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 0,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 0,
    marginBottom: 6,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  formText: {
    fontSize: 18,
    fontWeight: '200'
  },
  formTextLight: {
    fontSize: 18,
    fontWeight: '200',
    color: "#cdcdcd",
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
    flex: 0,
    paddingBottom: 15
  },
  rightChevron: {
    marginRight: 10,
    fontSize: 20,
    color: '#ccc'
  }
}

export const loadingScreen = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export const launchScreen = {
  logo: {
    resizeMode: 'contain',
    width: 280,
    height: 80
  },
  tagline: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '200',
    color: '#fff'
  },
  subTagline: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '200',
    color: '#999'
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    flex: 0,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 140
  },
  textSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
}

export const settingsScreen = {
  signoutButton: {
    borderRadius: 5,
    borderWidth: 0,
    borderColor: '#777'
  },
  listTitleText: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '200',
    marginTop: 10,
    marginBottom: 0,
  },
  listTitleContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 0,
    width: '100%',
  },
  listItemTitle: {
    color: colors.weather_text_color,
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: values.font_place_size,
    fontFamily: values.font_body,
    fontWeight: '100',
  },
  listItemSubtitle: {
    fontSize: values.font_time_size,
    fontFamily: values.font_body,
    fontWeight: '200',
  },
}

export const drawerScreen = {
  menuItem:{
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#d6d7da'
  },
  scrollView: {
    marginTop: 50,
  }
}

export const dealList = {
  row: {
    elevation: 1,
    borderRadius: 2,
    backgroundColor: colors.tertiary,
    flex: 1,
    flexDirection: 'row',  // main axis
    justifyContent: 'flex-start', // main axis
    alignItems: 'center', // cross axis
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 6,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  row_cell_temp: {
    color: colors.weather_text_color,
    paddingLeft: 16,
    flex: 0,
    fontSize: values.tiny_icon_size,
    fontFamily: values.font_body,
    fontWeight: '300',
  },
  rowTitle: {
    color: colors.weather_text_color,
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: 0,
    fontSize: values.font_time_size,
    fontFamily: values.font_body,
    fontWeight: '200',
  },
  rowSymbol: {
    color: colors.weather_text_color,
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: 0,
    fontSize: values.font_place_size,
    fontFamily: values.font_body,
    fontWeight: '200',
  },
}

/*module.exports.colors = {
  accentColor: '#31D8A0'
};*/
