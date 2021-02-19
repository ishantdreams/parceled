import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {Button} from 'react-native-elements';
import {observer, inject} from 'mobx-react';
import * as css from '../../Assets/Styles';
import AsyncStorage from '@react-native-community/async-storage';
import {scale} from '../../Services/ResponsiveScreen';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';

@inject('parcelStore', 'userStore', 'analyticsStore', 'themeStore')
@autobind
export default class SingInRegisterView extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isTermAccept: true,
      isDark: false,
    };
  }

  componentDidMount() {
    this.props.analyticsStore.screen('RegisterEmail');
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

  _emailRegistered = async data => {
    //await AsyncStorage.setItem('parceledUserAuth', JSON.stringify(data));
    this.props.userStore.persistParceledUser(data);
  };

  _subscribe() {
    this.props.userStore
      .subscribeEmailToParceled(this.state.email)
      .then(data => {
        if (data.is_verified) {
          this._emailRegistered(data);
          this.props.navigation.navigate('Parcels');
        } else {
          this.props.navigation.navigate('ConfirmEmail', {
            email: this.state.email,
          });
        }
      });
    //this.props.navigation.navigate('ConfirmEmail');
  }

  onChangeEmail(text) {
    this.setState({
      email: text,
    });
  }

  render() {
    const styles = StyleSheet.create({
      mainContent: {
        flex: 1,
        paddingBottom: 96,
        marginTop: 50,
        justifyContent: 'center',
      },
      subTagline: {
        fontSize: scale(18),
        fontWeight: '600',
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        textAlign: 'center',
      },
      termTextStyle: {
        fontSize: scale(12),
        fontWeight: '400',
        color: '#9E9E9E',
        textAlign: 'center',
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
      inputContainer: {
        padding: 10,
        height: 50,
        justifyContent: 'center',
        borderWidth: 1,
        width: '90%',
        borderRadius: 6,
        marginTop: 40,
        borderColor: '#BDBDBD',
      },
      image: {
        width: scale(350),
        height: scale(340),
        marginBottom: 32,
      },
      text: {
        color: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
        fontFamily: css.Fonts.openSans,
      },
      content_root: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        textAlign: 'center',
      },
      submit_btn_root: {
        width: '90%',
        marginTop: 20,
      },
      submit_btn: {
        borderRadius: 8,
        height: 50,
        backgroundColor: '#ff6700',
      },
    });

    const commonInputProps = {
      style: [styles.input, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#BDBDBD',
      color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      autoCorrect: false,
      fontSize: scale(16),
      autoCapitalize: 'none',
      fontFamily: css.Fonts.openSans,
    };

    return (
      <View
        style={[
          css.baseStyles.container,
          {
            backgroundColor: this.state.isDark
              ? darkColors.background
              : lightColors.background,
          },
        ]}>
        <View style={styles.mainContent}>
          <View style={styles.content_root}>
            <Text style={styles.subTagline}>Sign in or Register</Text>

            <View style={styles.inputContainer}>
              <TextInput
                {...commonInputProps}
                autoFocus={false}
                placeholder="Enter email address"
                keyBoardType="email-address"
                returnKeyType="done"
                onSubmitEditing={this._subscribe.bind(this)}
                onChangeText={this.onChangeEmail.bind(this)}
              />
            </View>
            <View style={styles.submit_btn_root}>
              <Button
                title="Submit"
                onPress={this._subscribe}
                buttonStyle={styles.submit_btn}
              />
            </View>
          </View>
        </View>

        <Text style={[styles.termTextStyle, {alignSelf: 'center', bottom: 50}]}>
          I accept Term of Use and Privacy Policy
        </Text>
      </View>
    );
  }
}
