import {inject, observer} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import NavIcons from '../../Components/NavIcons';
import {scale} from '../../Services/ResponsiveScreen';
import * as css from '../../Assets/Styles';
import {GoogleAutoComplete} from 'react-native-google-autocomplete';
import {LocationItem} from '../../Components/';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';

@inject('themeStore')
@autobind
export default class LocationSearchView extends Component {
  // static navigationOptions = ({navigation}) => ({
  //   title: '',
  //   headerLeft: NavIcons.closeButton(navigation.goBack),
  //   headerStyle: {
  //     backgroundColor: '#ff6700',
  //   },
  //   headerTintColor: '#fff',
  // });

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.state = {
      visible: true,
      isEmptyList: true,
      inputData: '',
      isDark: false,
    };
  }

  hideSpinner() {
    this.setState({visible: false});
  }

  onSubmit() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this._initialCall();
    });
  }

  _initialCall = async () => {
    let isDarkThemeEnabled = await this.props.themeStore._checkAppTheme();
    console.log(' isDarkThemeEnabled ', '@@ ' + isDarkThemeEnabled);
    if (
      isDarkThemeEnabled === undefined ||
      isDarkThemeEnabled === null ||
      isDarkThemeEnabled === false
    ) {
      this.setState({isDark: false});
    } else {
      this.setState({isDark: true});
    }

    console.log('isDarkEnable@@@@ ', '@@@@' + this.state.isDark);
  };

  render() {
    const searchBarStyles = {
      textInput: {
        height: 36,
        width: 300,
        elevation: 1,
        paddingLeft: 8,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        flex: 4,
      },
      inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        borderRadius: 9,
        minHeight: 32,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
      },
      container: {
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
      },
      curentlocation_btn: {
        height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        borderColor: 'lightgray',
        zIndex: 40,
      },
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.isDark
            ? darkColors.background
            : lightColors.background,
        }}>
        <View
          style={{
            top: 10,
            left: 0,
            zIndex: 20,
            position: 'absolute',
            right: 0,
          }}>
          <GoogleAutoComplete
            apiKey="AIzaSyB2-XNYVp_X3MwlwW1Xt3gGjL5rrwQ9OG4"
            queryTypes="geocode|establishment"
            debounce={300}
            minLength={3}>
            {({
              handleTextChange,
              locationResults,
              fetchDetails,
              isSearching,
              inputValue,
              clearSearch,
            }) => (
              <Fragment>
                <View
                  style={[
                    searchBarStyles.container,
                    {marginTop: 16, paddingLeft: 10, paddingRight: 10},
                  ]}>
                  <View style={searchBarStyles.inputContainer}>
                    <TouchableOpacity
                      style={{
                        width: 20,
                      }}
                      onPress={() => {
                        this.props.navigation.pop();
                      }}>
                      <Image
                        resizeMode={'contain'}
                        style={{
                          height: 15,
                          width: 15,
                          alignSelf: 'center',
                          tintColor: this.state.isDark
                            ? darkColors.textColor
                            : lightColors.textColor,
                        }}
                        source={require('../../Assets/Images/ic_arrow_left.png')}
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={searchBarStyles.textInput}
                      placeholder="City, Address, Zip"
                      onChangeText={handleTextChange}
                      value={inputValue}
                      placeholderTextColor={
                        this.state.isDark
                          ? darkColors.inputSearchLocationHint
                          : lightColors.inputSearchLocationHint
                      }
                      ref={ref => (this.emailRef = ref)}
                    />
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        flex: 1,
                        width: 20,
                      }}
                      onPress={() => {
                        clearSearch();
                        handleTextChange('');
                      }}
                      activeOpacity={0.6}>
                      <Image
                        resizeMode={'contain'}
                        style={{height: 15, width: 15}}
                        source={require('../../Assets/Images/ic_x_circle.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <ScrollView
                  style={{
                    zIndex: 400,
                  }}
                  keyboardShouldPersistTaps="always">
                  <TouchableOpacity
                    style={searchBarStyles.curentlocation_btn}
                    onPress={console.log(
                      '@@@@@@@@@@ ',
                      this.emailRef._lastNativeText,
                    )}>
                    <Text style={{color: 'orange'}}>Current Location</Text>
                  </TouchableOpacity>
                  {locationResults.map((el, i) => (
                    <LocationItem
                      {...el}
                      fetchDetails={fetchDetails}
                      isDark={this.state.isDark}
                      key={String(i)}
                      update={(latitude, longitude) => {
                        console.log(
                          'update called' +
                            latitude +
                            'longitude is ' +
                            longitude,
                        );
                        this.props.navigation.state.params.returnData(
                          latitude,
                          longitude,
                          'lovvvvvvvvveeee',
                        );
                        this.props.navigation.goBack();
                      }}
                      {...{clearSearch}}
                      isDataEmpty={() => {
                        this.setState({isEmptyList: false});
                      }}
                    />
                  ))}
                </ScrollView>
              </Fragment>
            )}
          </GoogleAutoComplete>
        </View>
        {this.state.isEmptyList && (
          <View
            style={{
              width: '100%',
              height: '100%',
              flex: 1,
              paddingLeft: 40,
              paddingRight: 40,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: this.state.isDark
                  ? darkColors.textColor
                  : lightColors.textColor,
                textAlign: 'center',
                fontSize: 22,
                fontWeight: '700',
              }}>
              Sorry, we couldn't find "{this.emailRef._lastNativeText}"
            </Text>
            <Text
              style={{
                color: this.state.isDark
                  ? darkColors.lightTextColor
                  : lightColors.lightTextColor,
                textAlign: 'center',
                fontSize: 14,
                marginTop: 8,
              }}>
              Please check the spelling, try cleaning the search box.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  title_row: {
    marginHorizontal: 15,
    fontSize: scale(16),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
  },
});
