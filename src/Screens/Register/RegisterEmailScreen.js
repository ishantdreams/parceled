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
import autobind from 'autobind-decorator';
import * as css from '../../Assets/Styles';
import AsyncStorage from '@react-native-community/async-storage';
import {scale} from '../../Services/ResponsiveScreen';

@inject('parcelStore', 'userStore', 'analyticsStore')
@autobind
export default class RegisterEmailScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    this.props.analyticsStore.screen('RegisterEmail');
  }

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
    const commonInputProps = {
      style: [styles.input, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none',
    };
    return (
      <View style={css.baseStyles.container}>
        <View style={styles.mainContent}>
          <View style={styles.logo_icon_root}>
            <Image
              source={require('../../Assets/Images/logo_icon.jpg')}
              style={styles.logo_icon}
            />
          </View>
          <View style={styles.content_desc}>
            <Text style={styles.subTagline}>
              Please enter your email to continue.
            </Text>
          </View>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                {...commonInputProps}
                autoFocus={false}
                placeholder="Email"
                keyBoardType="email-address"
                returnKeyType="done"
                onSubmitEditing={this._subscribe.bind(this)}
                onChangeText={this.onChangeEmail.bind(this)}
              />
            </View>
            <View style={styles.continue_btn_root}>
              <Button
                title="Continue"
                onPress={this._subscribe}
                buttonStyle={styles.continue_btn_text}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    paddingBottom: 96,
    marginTop: 50,
  },
  subTagline: {
    marginTop: 5,
    fontSize: scale(16),
    fontWeight: '400',
    color: '#999',
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
    marginTop: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent',
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
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
  },
  logo_icon_root: {
    alignItems: 'center',
    textAlign: 'center',
  },
  logo_icon: {
    width: 112,
    height: 125,
  },
  content_desc: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    textAlign: 'center',
  },
  continue_btn_root: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
  },
  continue_btn_text: {
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: '#ff6700',
  },
});
