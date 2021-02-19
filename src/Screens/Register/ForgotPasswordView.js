import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-navigation';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';

@inject('parcelStore', 'themeStore')
@autobind
@observer
export default class ForgotPasswordView extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isDark: false,
    };
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

  onChangeEmail(text) {
    this.setState({
      email: text,
    });
  }

  render() {
    const screenStyles = StyleSheet.create({
      container: {
        alignItems: 'center',
      },
      viewcontainer: {
        flex: 1,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
      },
      inputContainer: {
        padding: 10,
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        width: '90%',
        borderRadius: 3,
        marginTop: 60,
        borderColor: '#BDBDBD',
      },
      inputContainerPassword: {
        padding: 10,
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        width: '90%',
        borderRadius: 3,
        marginTop: 20,
        borderColor: '#BDBDBD',
      },
      input: {
        left: 5,
        top: 0,
        right: 5,
        bottom: 0,
        height: 40,
        fontSize: 18,
        padding: 5,
      },
      title_row: {
        marginHorizontal: 15,
        fontSize: scale(18),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center',
      },
      title_button: {
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: 'tomato',
        marginLeft: 8,
      },
      toolbar_style: {
        height: 64,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: '#D3D3D3',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
      },
      toolbar_child_view: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      back_btn: {
        alignItems: 'center',
        alignSelf: 'center',
      },
      root_view: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        textAlign: 'center',
      },
      reset_btn_style: {
        borderRadius: 8,
        height: 50,
        backgroundColor: '#ff6700',
      },
      reset_btn_root: {
        width: '90%',
        marginTop: 15,
      },
      back_text: {
        alignSelf: 'center',
        marginTop: 20,
        color: '#F9560E',
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
      },
    });

    const commonInputProps = {
      style: [screenStyles.input, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#9E9E9E',
      color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      autoCorrect: false,
      autoCapitalize: 'none',
      fontSize: scale(16),
      fontFamily: css.Fonts.openSans,
    };

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={screenStyles.viewcontainer}>
          <StatusBar
            barStyle={this.state.isDark ? 'light-content' : 'dark-content'}
            hidden={false}
            backgroundColor={css.colors.theme}
            translucent={false}
          />
          <View style={screenStyles.toolbar_style}>
            <View style={screenStyles.toolbar_child_view}>
              <TouchableOpacity
                style={screenStyles.back_btn}
                activeOpacity={0.6}
                onPress={() => {
                  this.props.navigation.pop();
                }}>
                <Image
                  resizeMode={'contain'}
                  // style={{height: 15, width: 15}}
                  style={{
                    tintColor: this.state.isDark
                      ? darkColors.textColor
                      : lightColors.textColor,
                  }}
                  source={require('../../Assets/Images/back_arrow.png')}
                />
              </TouchableOpacity>

              <Text style={screenStyles.title_row}>{'Forgot password'}</Text>
            </View>
          </View>

          <View style={screenStyles.root_view}>
            <View style={screenStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                autoFocus={false}
                placeholder="Email address"
                keyBoardType="email-address"
                returnKeyType="done"
                // onSubmitEditing={this._subscribe.bind(this)}
                onChangeText={this.onChangeEmail.bind(this)}
              />
            </View>

            <View style={screenStyles.reset_btn_root}>
              <Button
                title="Reset Password"
                // onPress={this._subscribe}
                buttonStyle={screenStyles.reset_btn_style}
              />
            </View>

            <Text style={screenStyles.back_text}>Back to Sign In</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
