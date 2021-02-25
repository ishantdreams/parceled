import {inject, observer} from 'mobx-react';
import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,ActivityIndicator,Modal
} from 'react-native';
import {Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';
import AsyncStorage from '@react-native-community/async-storage';
@inject('parcelStore', 'themeStore')
@autobind
@observer
export default class SignUpView extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isDark: false,
      full_name:'',
      agreement:true,
      loader:false
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


  onChangeFullName(full_name){
    this.setState({
      full_name
    })
  }

  onChangeEmail(text) {
    this.setState({
      email: text,
    });
  }

  onChangePassword(text) {
    this.setState({
      password: text,
    });
  }

  onAgreement=()=>{
this.setState({
  agreement:!this.state.agreement
})

  }

onSignUp=async()=>{
  this.setState({loader:true})
  const {full_name,email,password,agreement} = this.state
const data = {
full_name,
email,
password,
agreement
}
 const BASE_API = "https://app.termsheet.com/api/register"

const response = await fetch(`${BASE_API}`,{

  method:'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify(data)
})
const jsonData= await response.json()
console.warn("******",jsonData)

if(response.status ==200){
  this.setState({loader:false})
const authToken = jsonData.auth_token
const user = jsonData.user
this.setState({email:'',password:'',full_name})
  await AsyncStorage.setItem('authToken', authToken);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      
this.props.navigation.navigate("ParcelMap")

}




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
        marginTop: 15,
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
      termTextStyle: {
        fontSize: scale(12),
        fontWeight: '400',
        color: '#9E9E9E',
        textAlign: 'center',
      },
      toolbar_view: {
        height: 64,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: '#D3D3D3',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
      },
      toolbar_child: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      back_btn: {
        alignItems: 'center',
        alignSelf: 'center',
      },
      content_root: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        textAlign: 'center',
      },
      signup_btn_root: {
        width: '90%',
        marginTop: 15,
      },
      sign_up_btn: {
        borderRadius: 8,
        height: 50,
        backgroundColor: '#ff6700',
      },
    });

    const commonInputProps = {
      style: [screenStyles.input, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#BDBDBD',
      color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      autoCorrect: false,
      autoCapitalize: 'none',
      fontSize: scale(16),
      fontFamily: css.Fonts.openSans,
    };

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[screenStyles.viewcontainer]}>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor={css.colors.theme}
            translucent={false}
          />
          <View style={screenStyles.toolbar_view}>
            <View style={screenStyles.toolbar_child}>
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

              <Text style={screenStyles.title_row}>{'Sign Up'}</Text>
            </View>
          </View>

          <View style={screenStyles.content_root}>
          <View style={[screenStyles.inputContainer,{marginBottom:"-12%"}]}>
              <TextInput
                {...commonInputProps}
                autoFocus={false}
                placeholder="Full Name"
                keyboardType="default"
                returnKeyType="done"
                // onSubmitEditing={this._subscribe.bind(this)}
                onChangeText={this.onChangeFullName}
                
              />
            </View>

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



            <View style={screenStyles.inputContainerPassword}>
              <TextInput
                {...commonInputProps}
                autoFocus={false}
                placeholder="Password"
                secureTextEntry="true"
                keyBoardType="text"
                returnKeyType="done"
                // onSubmitEditing={this._subscribe.bind(this)}
                onChangeText={this.onChangePassword.bind(this)}
              />
            </View>
            <View style={screenStyles.signup_btn_root}>
              <Button
                title="Sign Up"
                onPress={this.onSignUp}
                //onPress={this._subscribe}
                buttonStyle={screenStyles.sign_up_btn}
              />
            </View>
          </View>
        </View>
        <Text
          style={[
            screenStyles.termTextStyle,
            {alignSelf: 'center', bottom: 50},
          ]}>
          I accept Term of Use and Privacy Policy
        </Text>


        <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.loader}
        
      >
       <View style={{opacity:.9,flex:1,justifyContent:'center',alignItems:'center',}}> 
       <ActivityIndicator
        size="large"
        color="#000"
        /> 
       </View>
      </Modal>
      
      </SafeAreaView>
    );
  }
}
