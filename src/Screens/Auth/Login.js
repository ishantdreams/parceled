import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator';
import {Button} from 'react-native-elements';
import NavIcons from '../../Components/NavIcons';
import * as css from "../../Assets/Styles";
import Utils from '../../Services/Utils';
import { scale } from '../../Services/ResponsiveScreen';

@inject('termSheetStore', 'parcelStore', 'analyticsStore')
@observer
export default class Login extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Sign In',
    headerLeft:() => NavIcons.closeButton(navigation.goBack)
  });

  @observable email = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props);
    this.state = {
        email: '',
        password: ''
     }
  }

  _skipLogin(){
    this.props.navigation.navigate('Parcels')
  }

  onChangeEmail(text) {
    this.setState({
      email: text
    })
  }

  onChangePassword(text) {
    this.setState({
      password: text
    })
  }

  _signInAsync = async () => {
    //await AsyncStorage.setItem('userToken', 'abc');
    if(!Utils.validateEmail(this.state.email) || !Utils.validatePassword(this.state.password)){
      return Alert.alert('Error', "Please enter a valid email or password");
    }
    this.loading = true;
    this.props.termSheetStore.login(this.state.email, this.state.password)
    .then(async ([user, authToken])=>{
      await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      this.props.analyticsStore.identify(this.state.email);
      this.props.navigation.navigate('AccountList');
    }).catch(error => {
      console.log(error)
      this.loading = false;
      Alert.alert('Error', 'Login failed, please check your login/password.')
    });
  };

  render(){
    if (this.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: css.colors.theme, fontFamily: css.Fonts.openSans}}>Signing in...</Text>
        </View>
      );
    }

    const commonInputProps = {
      style: [css.baseStyles.input, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none'
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={css.baseStyles.container}>
          <View style={css.baseStyles.inputs}>
            <View style={css.baseStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                autoFocus={true}
                placeholder='Email'
                keyBoardType='email-address'
                returnKeyType='next'
                onChangeText={this.onChangeEmail.bind(this)}
              />
            </View>
            <View style={css.baseStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                secureTextEntry={true}
                placeholder='Password'
                returnKeyType='send'
                onChangeText={this.onChangePassword.bind(this)}
              />
            </View>
            <View style={{height: 60, paddingLeft: 15, paddingRight: 15}}>
              <Button title='Login'
                      onPress={this._signInAsync}
                      buttonStyle={{marginTop: 10, borderRadius: 3, backgroundColor: '#ff6700'}}
                      />
              <Button title='Cancel'
                onPress={this._skipLogin.bind(this)}
                buttonStyle={{borderRadius: 3, backgroundColor: css.colors.grayLight, marginTop:10}}/>
              <View style={{alignItems: 'center'}}>
                <Text style={[
                  screenStyles.linkStyle,
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                  },
                ]} onPress={ ()=> Linking.openURL("https://dashboard.termsheet.com/auth/forgot-password") } >Forgot Password?</Text>
            </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const screenStyles = StyleSheet.create({
  linkStyle: {
    marginLeft: 10,
    color: css.colors.theme,
    textDecorationLine: 'underline',
    fontSize: scale(18),
  },
});
