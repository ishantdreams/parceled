import {inject, observer} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Switch,
  Alert,SafeAreaView
} from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
//import {SafeAreaView} from 'react-navigation';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';
import autobind from 'autobind-decorator';
import {observable} from 'mobx';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
// import {useTheme} from '../../Assets/Themes/ThemeContext';

@inject('parcelStore', 'themeStore', 'userStore')
@autobind
@observer
export default class ProfileView extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  @observable isDark = 'false';

  constructor(props) {
    super(props);
    this.state = {
      parcelData: null,
      isDarkModeOn: false,
      user: null,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.initialSetup();
      
      // this.props.userStore._loadAuth().then(() => {
      //   //if(this.props.userStore.isRegistered){
      //   console.log(
      //     'this.props.userStore.parceledUser.token - ',
      //     this.props.userStore,
      //   );

      //   //this.props.iapStore.login(this.props.userStore.parceledUser.token)
      // });
    });
  }

onSignIn=async()=>{
  const parceledUser = await AsyncStorage.getItem('parceledUserAuth');
  console.warn(parceledUser)
  this.props.navigation.navigate('SignInView')
}


  onLogOut = () => {
    Alert.alert('', 'Are you sure want to Log Out?', [
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('userData');
          this.setState({user:null})

          

          // const resetAction = NavigationActions.reset({
          //   index: 0,
          //   actions: [NavigationActions.navigate({routeName: 'Search'})],
          //   key: null
          // });

          // this.props.navigation.dispatch(resetAction);

          // let toLogin = StackActions.reset({
          //   index: 0,
          //   actions: [NavigationActions.navigate({routeName: 'App'})],
          //   key:'App'
          // });
          // this.props.navigation.dispatch(toLogin);
        },
      },
      {
        text: 'No',
      },
    ]);
    console.warn('hello');
  };

  initialSetup = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('userData'));

    console.log('user - ', user);
    this.setState({user: user});

    let isDarkThemeEnabled = await this.props.themeStore._checkAppTheme();

    if (
      isDarkThemeEnabled === undefined ||
      isDarkThemeEnabled === null ||
      isDarkThemeEnabled === false
    ) {
      this.setState({isDarkModeOn: false});
    } else this.setState({isDarkModeOn: true});
  };

  updateAppTheme = value => {
    this.setState({isDarkModeOn: value});
    console.log('updated value is update', value);
    this.props.themeStore._setAppTheme(value);
  };

  render() {
    // const {setScheme, isDark} = useTheme();
console.warn("______",this.state.user? this.state.user.avatar_url:null)
    const screenStyles = StyleSheet.create({
      container: {
        alignItems: 'center',
      },
      root_view: {
        marginHorizontal: 20,
        marginVertical: 15,
      },
      viewcontainer: {
        flex: 1,
        backgroundColor: this.state.isDarkModeOn
          ? darkColors.background
          : lightColors.background,
      },
      title_row: {
        marginHorizontal: 15,
        fontSize: scale(18),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDarkModeOn
          ? darkColors.textColor
          : lightColors.textColor,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center',
      },
      title_button: {
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: '#FB7A42',
      },
      list_address_style: {
        fontSize: scale(18),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDarkModeOn
          ? darkColors.textColor
          : lightColors.textColor,
      },
      list_city: {
        fontSize: scale(14),
        marginTop: 4,
        color: this.state.isDarkModeOn
          ? darkColors.textColor
          : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      list_owner: {
        fontSize: scale(14),
        fontWeight: '400',
        color: this.state.isDarkModeOn
          ? darkColors.textColor
          : lightColors.textColor,
        marginHorizontal: 15,
        fontFamily: css.Fonts.openSans,
      },
      item_root: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center',
      },
      view_image: {
        height: scale(25),
        width: scale(25),
        alignItems: 'center',
      },
      line_border: {
        backgroundColor: '#EFEFEF',
        height: 1,
        marginVertical: 8,
      },
      profile_view: {
        height: 64,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
      },
      avatar: {
        height: scale(40),
        width: scale(40),
        borderRadius: 20,
      },
    });

    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <View style={[screenStyles.viewcontainer]}>
            <StatusBar
              barStyle={
                this.state.isDarkModeOn ? 'light-content' : 'dark-content'
              }
              hidden={false}
              backgroundColor={css.colors.theme}
              translucent={false}
            />
            <View style={[screenStyles.profile_view,{backgroundColor:'',}]}>
              <Text style={screenStyles.title_row}>
                {this.state.user !== null
                  ? this.state.user.full_name
                  : 'Not signed in'}
              </Text>
              <TouchableOpacity onPress={this.onSignIn}><Text  style={[screenStyles.title_row,{textDecorationLine:'underline',}]}>{this.state.user !== null
                  ? null
                  : 'Sign In'}</Text></TouchableOpacity>
              {this.state.user !==null ? <TouchableOpacity style={{marginRight: 15}} onPress={() => {}}>
                <Image
                  style={screenStyles.avatar}
                  source={
                    this.state.user !== null
                      ? {uri: this.state.user.avatar_url}
                      : require('../../Assets/Images/medium_avatar.png')
                  }
                  resizeMode="contain"
                />

               
              </TouchableOpacity>:null}
            </View>

            <View style={screenStyles.root_view}>
              {/* dark mode view */}
              <View style={screenStyles.item_root}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_sun.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>
                  Dark Mode
                </Text>
                <Switch
                  trackColor={'white'}
                  ios_backgroundColor={'white'}
                  value={this.state.isDarkModeOn}
                  style={{alignItems: 'center'}}
                  // value={isDark}
                  // onValueChange={
                  //   isDark ? setScheme('light') : setScheme('dark')
                  // }
                  onValueChange={async value => {
                    this.updateAppTheme(value);
                  }}
                />
              </View>
              <View style={screenStyles.line_border} />

              {/* deals view */}
              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_grid.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>Deals</Text>
              </View>

              <View style={screenStyles.line_border} />

              {/* share view */}
              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_share.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>Share</Text>
              </View>
              <View style={screenStyles.line_border} />

              {/* notification view */}

              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_bell.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>
                  Notifications
                </Text>
              </View>
              <View style={screenStyles.line_border} />

              {/* about view */}
              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_info.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>About</Text>
              </View>
              <View style={screenStyles.line_border} />

              {/* help view */}
              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_help_circle.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>Help</Text>
              </View>
              <View style={screenStyles.line_border} />
              {/* notification view */}

              <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                <Image
                  style={screenStyles.view_image}
                  source={require('../../Assets/Images/ic_settings_new.png')}
                  resizeMode="contain"
                />
                <Text style={[screenStyles.list_owner, {flex: 1}]}>
                  Settings
                </Text>
              </View>
              {this.state.user !== null && (
                <View style={screenStyles.line_border} />
              )}

              {/* setting view */}


              {this.state.user !== null && (
                <TouchableOpacity onPress={this.onLogOut}>
                  <View style={[screenStyles.item_root, {opacity: 0.5}]}>
                    <FontAwesome size={25} color="black" name="sign-out" />
                    <Text style={[screenStyles.list_owner, {flex: 1}]}>
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <View style={screenStyles.line_border} />
            </View>
          </View>


        </SafeAreaView>
      </Fragment>
    );
  }
}
