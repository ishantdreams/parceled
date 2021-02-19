import React, {Component} from 'react';
import {
  ActivityIndicator,
  Button,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator'
import * as css from "../../Assets/Styles";
import TouchID from 'react-native-touch-id';

@inject('termSheetStore', 'parcelStore', 'analyticsStore', 'userStore', 'iapStore')
@autobind @observer
export default class AppLoading extends Component {
  constructor() {
    super();
  }

  componentDidMount(){
    this._bootstrapAsync();
  }

  delayTime = 0; //1500

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const appIntroRun = await AsyncStorage.getItem('appIntroRun');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if(appIntroRun){
      //RRS re-enable for Touch ID
      /*TouchID.isSupported()
      .then(biometryType => {
        if (biometryType === 'TouchID') {
          TouchID.authenticate('Authenticate with fingerprint') // Show the Touch ID prompt
            .then(success => {
              setTimeout(() => {
                this.props.navigation.navigate('App');
              }, this.delayTime)
            })
            .catch(error => {
              // Touch ID Authentication failed (or there was an error)!
              // Also triggered if the user cancels the Touch ID prompt
              // On iOS and some Android versions, `error.message` will tell you what went wrong
            });
        } else if (biometryType === 'FaceID') {
          TouchID.authenticate('Authenticate with your face') // Show the Touch ID prompt
            .then(success => {
              setTimeout(() => {
                this.props.navigation.navigate('App');
              }, this.delayTime)
            })
            .catch(error => {
              // Touch ID Authentication failed (or there was an error)!
              // Also triggered if the user cancels the Touch ID prompt
              // On iOS and some Android versions, `error.message` will tell you what went wrong
            });
        } else if (biometryType === true) {
          // Touch ID is supported on Android
        }
      })
      .catch(error => {
        // User's device does not support Touch ID (or Face ID)
        // This case is also triggered if users have not enabled Touch ID on their device
        setTimeout(() => {
          this.props.navigation.navigate('App');
        }, this.delayTime)
      });*/
      this.props.userStore._loadAuth().then(() => {
        //if(this.props.userStore.isRegistered){
          console.log("this.props.userStore.parceledUser.token - ", this.props.userStore.parceledUser.token)
          this.props.analyticsStore.identify(this.props.userStore.parceledUser.token);
          //this.props.iapStore.login(this.props.userStore.parceledUser.token)

          if(this.props.termSheetStore.isAuthenticated){
          console.log("this.props.userStore.isAuthenticated - ", this.props.userStore.isAuthenticated)

            setTimeout(() => {
              this.props.navigation.navigate('Search');
            }, this.delayTime)
          }else{
          console.log("parcel - ")
            setTimeout(() => {
              this.props.navigation.navigate('Search');
            }, this.delayTime)
          }
        /*}else{
          setTimeout(() => {
            //this.props.navigation.navigate('App');
            this.props.navigation.navigate('Register');
              //this.props.navigation.navigate('Launch');
          }, this.delayTime)
        }*/
      });
    }else{
      setTimeout(() => {
        //this.props.navigation.navigate('Auth');
        this.props.navigation.navigate('AppIntro');
      }, this.delayTime)
    }
    //this.props.navigation.navigate(authToken ? 'App' : 'Auth');
  };


  // Render any loading content that you like here
  render() {
    return (
      <Image
        source={require("../../Assets/Images/NewSplash.jpg")}
        style={{ flex: 1, width: null, height: null, }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff6700"
  }
});
