import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from 'react-native';

import {Button} from 'react-native-elements';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator';
import * as css from '../../Assets/Styles';
import AsyncStorage from '@react-native-community/async-storage';
import {scale} from '../../Services/ResponsiveScreen';
import NavIcons from '../../Components/NavIcons';

import CodeInput from 'react-native-confirmation-code-input';

@inject('parcelStore', 'analyticsStore', 'userStore')
@autobind
export default class ConfirmEmailScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Confirm Email',
    headerLeft: NavIcons.backButton(navigation.goBack),
  });

  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  componentDidMount() {
    const email = this.props.navigation.getParam('email', {});
    this.setState({
      email: email,
    });
    this.props.analyticsStore.screen('ConfirmEmail');
  }

  onChangeEmail(text) {
    this.setState({
      email: text,
    });
  }

  _emailRegistered = async () => {
    this.props.userStore.persistParceledUser(data);
  };

  _onFulfill(code) {
    this.props.userStore
      .verifyEmailWithParceled(this.state.email, code)
      .then(data => {
        if (data.is_verified) {
          this._emailRegistered(data);
          this.props.navigation.navigate('Parcels');
        } else {
          this.props.navigation.navigate('RegisterEmail');
        }
      });
  }

  render() {
    return (
      <SafeAreaView style={css.baseStyles.container}>
        <View style={styles.mainContent}>
          <View style={styles.logo_icon_parent}>
            <Image
              source={require('../../Assets/Images/logo_icon.jpg')}
              style={styles.logo_icon}
            />
          </View>
          <View style={styles.desc_root}>
            <Text style={styles.subTagline}>
              We sent a code to {this.state.email}. Please enter the 5-digit
              code below.
            </Text>
          </View>
          <View>
            <CodeInput
              ref="codeInputRef2"
              codeLength={5}
              keyboardType="numeric"
              activeColor="#ff6700"
              inactiveColor="#999"
              autoFocus={false}
              ignoreCase={true}
              inputPosition="center"
              size={50}
              onFulfill={code => this._onFulfill(code)}
              containerStyle={{marginTop: 30}}
              codeInputStyle={{borderWidth: 1.5}}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const inputStyles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFiledRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

const CELL_COUNT = 6;

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
  logo_icon: {
    width: 112,
    height: 125,
  },
  logo_icon_parent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  desc_root: {
    height: 60,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    textAlign: 'center',
  },
});
