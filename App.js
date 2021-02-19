import React, {Component, useEffect} from 'react';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  Image,
} from 'react-native';
import {
  createAppContainer,
  createSwitchNavigator,
  SafeAreaView,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {Provider} from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';

import {
  LaunchScreen,
  LoginScreen,
  AppLoadingScreen,
  AppIntroScreen,
} from './src/Screens/Auth';
import {
  RegisterEmailScreen,
  ConfirmEmailScreen,
  SingInRegisterView,
  SignUpView,
  SignInView,
  ForgotPasswordView,
} from './src/Screens/Register';
import {
  SettingsScreen,
  WorkSpacesView,
  AccountView,
  SavedParcelsView,
  ProfileView,
} from './src/Screens/Profile';
import {AccountList} from './src/Screens/Account';
import {SavedPlacesView} from './src/Screens/SavedPlaces';
import {
  DealDetails,
  DealList,
  DealLauncher,
  FileWebView,
  CameraRollView,
} from './src/Screens/Deals';
import {
  ParcelDetails,
  ParcelMap,
  MapLayersView,
  WatchListView,
  ReportWebView,
  FeedbackView,
  LocationSearchView,
  NotesView,
  ParcelKeyDetail,
  ParcelTaxesView,
  ParcelSchoolDetailView,
} from './src/Screens/Parcels';
import DrawerWithLogoutButton from './src/Components/DrawerWithLogoutButton';
import stores from './src/Stores';
import PushNotificationManager from './src/Services/PushNotificationManager';

import NavIcons from './src/Components/NavIcons';
import analytics from '@segment/analytics-react-native';

const AuthStack = createStackNavigator(
  {
    Login: {screen: LoginScreen},
    Launch: {screen: LaunchScreen},
  },
  {mode: 'modal'},
);

const RegisterStack = createStackNavigator({
  SignInView: {screen: SignInView},
  SignUpView: {screen: SignUpView},
  ForgotPasswordView: {screen: ForgotPasswordView},
  SingInRegisterView: {screen: SingInRegisterView},

  RegisterEmail: {screen: RegisterEmailScreen},
  ConfirmEmail: {screen: ConfirmEmailScreen},
});

const DealStack = createStackNavigator(
  {
    DealList: {screen: DealList},
    DealDetails: {screen: DealDetails},
    FileWebView: {screen: FileWebView},
    CameraRollView: {screen: CameraRollView},
  },
  {mode: 'modal'},
);

const ParcelStack = createStackNavigator(
  {
    ParcelMap: {screen: ParcelMap},
    ParcelDetails: {screen: ParcelDetails},
    MapLayersView: {screen: MapLayersView},
    ReportWebView: {screen: ReportWebView},
    FeedbackView: {screen: FeedbackView},
    LocationSearchView: {screen: LocationSearchView},
    NotesView: {screen: NotesView},
    ParcelKeyDetail: {screen: ParcelKeyDetail},
    ParcelTaxesView: {screen: ParcelTaxesView},
    ParcelSchoolDetailView: {screen: ParcelSchoolDetailView},

    SignInView: {screen: SignInView},
    SignUpView: {screen: SignUpView},
    ForgotPasswordView: {screen: ForgotPasswordView},
    SingInRegisterView: {screen: SingInRegisterView},
  },
  {mode: 'modal'},
);

const WatchListStack = createStackNavigator(
  {
    WatchList: {screen: WatchListView},
    ParcelDetails: {screen: ParcelDetails},
  },
  {mode: 'modal'},
);

const ProfileStack = createStackNavigator(
  {
    ProfileView: {screen: ProfileView},
    AccountView: {screen: AccountView},
    WorkSpaces: {screen: WorkSpacesView},
    SavedParcels: {screen: SavedParcelsView},
    ProfileView: {screen: ProfileView},
  },
  {mode: 'modal'},
);

const AccountStack = createStackNavigator(
  {
    AccountList: {screen: AccountList},
  },
  {mode: 'modal'},
);

const SavedPlaceStack = createStackNavigator(
  {
    SavedPlacesView: {screen: SavedPlacesView},
  },
  {mode: 'modal'},
);

const TabNavigator = createBottomTabNavigator(
  {
    Search: ParcelStack,
    Saved: SavedPlaceStack,
    Profile: ProfileStack,
  },
  {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        let IconComponent = Image;
        let iconName;
        if (routeName === 'Saved') {
          iconName = require('./src/Assets/Images/ic_like.png');
          // Sometimes we want to add badges to some icons.
          // You can check the implementation below.
          //IconComponent = HomeIconWithBadge;
        } else if (routeName === 'Profile') {
          iconName = require('./src/Assets/Images/ic_user.png');
        } else if (routeName === 'Search') {
          iconName = require('./src/Assets/Images/menu_ic_search.png');
        }

        // You can return any component that you like here! require('../../Assets/Images/ts_logo.png')
        return (
          <IconComponent
            source={iconName}
            style={{width: 25, height: 25, tintColor: tintColor}}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  },
);

const DrawNavigator = createDrawerNavigator(
  {
    Deals: {
      screen: DealStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-pulse" size={25} color="tomato" />,
      },
    },
    Parcels: {
      screen: ParcelStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-apps" size={25} color="tomato" />,
      },
    },
    WatchList: {
      screen: WatchListStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-apps" size={25} color="tomato" />,
      },
    },
    Account: {
      screen: ProfileStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-options" size={25} color="tomato" />,
      },
    },
    Auth: {
      screen: AuthStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-options" size={25} color="tomato" />,
      },
    },
    Register: {
      screen: RegisterStack,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerIcon: <Icon name="ios-options" size={25} color="tomato" />,
      },
    },
    DealLauncher: {
      screen: DealLauncher,
      navigationOptions: {
        drawerLockMode: 'locked-closed',
        drawerLabel: () => null,
      },
    },
  },
  {
    initialRouteName: 'DealLauncher',
    contentOptions: {
      activeTintColor: '#e91e63',
    },
    contentComponent: DrawerWithLogoutButton,
  },
);

const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AppLoadingScreen,
      AppIntro: AppIntroScreen,
      App: TabNavigator,
      AccountList: AccountStack,
      Register: RegisterStack,
      Deals: DealStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);

type Props = {};
@autobind
@observer
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    //this.store = new Store();
  }

  componentDidMount() {
    //BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }

  componentWillUnmount() {
    //BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    return true; // Do nothing when back button is pressed
  };

  _loadAnalytics = async () => {
    await analytics.setup('kK09XCVStw6cG2L0anCPbierpagBd2VH', {
      // Record screen views automatically!
      recordScreenViews: true,
      // Record certain application events automatically!
      trackAppLifecycleEvents: true,
    });
  };

  render() {
    this._loadAnalytics();
    return (
      <Provider {...stores}>
        <PushNotificationManager>
          <AppContainer />
        </PushNotificationManager>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 40,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .87)',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
});
