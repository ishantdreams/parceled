import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Button} from 'react-native-elements';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator'
import * as css from "../../Assets/Styles";
import { authorize } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import { scale } from '../../Services/ResponsiveScreen';

const googleConfig = {
  issuer: 'https://accounts.google.com',
  clientId: '473322438042-q8a88baqg4fl5bdq90nm8p4bqdol8og3.apps.googleusercontent.com',
  redirectUrl: 'com.googleusercontent.apps.473322438042-q8a88baqg4fl5bdq90nm8p4bqdol8og3:/oauth2redirect/google',
  scopes: ['openid', 'profile']
};

const cognitoConfig = {
  clientId: '7qhld211h1iop7krpsfqkokpqi',
  redirectUrl: 'com.parceled://oauth/login',
  serviceConfiguration: {
    authorizationEndpoint: 'https://auth.parceled.co/oauth2/authorize',
    tokenEndpoint: 'https://auth.parceled.co/oauth2/token',
    revocationEndpoint: 'https://auth.parceled.co/oauth2/revoke'
  },
  scopes: ['email','profile'],
};

@inject('termSheetStore', 'parcelStore')
@autobind @observer
export default class Launch extends Component {
  static navigationOptions = {
    header: null
  };

  _showLogin(){
    this.props.navigation.navigate('Login');
  }

  _showSignUp(){
    this.props.navigation.navigate('SignUp');
  }

  _skipLogin(){
    this.props.navigation.navigate('App')
  }

  _authorizeLogin = async () => {
    try {
      const result = await authorize(cognitoConfig);
      await AsyncStorage.setItem('parceledAuth', JSON.stringify(result));
      this.props.parcelStore.isAuthenticated = true;
      this.props.navigation.navigate('Parcels');
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      console.log(error);
    }
  }


  render(){
    return (
      <View style={css.baseStyles.container}>
        <View style={styles.mainContent}>
          <View style={{alignItems: 'center', textAlign: 'center'}}>
            <Image
              source={require("../../Assets/Images/logo_icon.jpg")}
              style={{ width: 112, height: 125 }}
            />
          </View>
          <View style={{alignItems: 'center', textAlign: 'center'}}>
            <Text style={styles.subTagline}>Please login to get started.</Text>
          </View>
        </View>

        <View style={css.launchScreen.bottomSection}>
          <Button title='Login'
                  onPress={this._authorizeLogin}
                  buttonStyle={{borderRadius: 3, backgroundColor: '#ff6700'}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 96,
  },
  tagline: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '200',
    color: '#000'
  },
  subTagline: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: '200',
    color: '#000'
  },
  input: {
    left: 5,
    top: 0,
    right: 5,
    bottom: 0,
    height: 40,
    fontSize: 18,
    padding: 5
  },
  inputContainer: {
    padding: 10,
    marginTop: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
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
    fontFamily: css.Fonts.openSans
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans
  },
});
