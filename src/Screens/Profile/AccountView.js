import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card, ListItem, Button,Icon, } from 'react-native-elements'

import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import { SafeAreaView, DrawerActions } from 'react-navigation';
import RenderIf from '../../Services/RenderIf';
import { scale } from '../../Services/ResponsiveScreen';

import * as css from "../../Assets/Styles";

@inject('termSheetStore')
@autobind @observer
export default class AccountView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '',
    headerStyle: {
      backgroundColor: '#ff6700',
    },
    headerTintColor: '#fff',
    headerLeft: NavIcons.settingsButton(navigation.toggleDrawer),
    headerRight: NavIcons.rightButton(navigation.toggleDrawer)
  });

  constructor(props) {
    super(props);
    this.state = {
      listData: [
        {
          key: 0,
          name: 'Workspaces',
          image: require('../../Assets/Images/ic_work.png'),
          color: css.colors.theme,
        },
        {
          key: 1,
          name: 'Saved Parcels',
          image: require('../../Assets/Images/ic_bookmark.png'),
          color: css.colors.theme,
        },
        {key: 3, name: 'Log Out', image: '', color: 'red'},
      ],
    };
  }

  _showLogin(){
    this.props.navigation.navigate('Login');
  }

  onPressItem(index) {
    switch (index) {
      case 0:
        this.props.navigation.navigate('WorkSpaces');
        break;
      case 1:
        this.props.navigation.navigate('SavedParcels');
        break;
      case 3:
        this.props.termSheetStore.promptForLogout();
        break;
    }
  }

  render(){
    const renderItem = data => (
      <TouchableOpacity
        activeOpacity={0.5}
        style={screenStyles.container_row}
        onPress={() => this.onPressItem(data.item.key)}>
        {RenderIf(data.item.image != '')(
          <Image
            style={screenStyles.app_icon}
            source={data.item.image}
            resizeMode="contain"
          />,
        )}
        <View style={screenStyles.container_row_text}>
          <Text style={[screenStyles.title_row, {color: data.item.color}]}>
            {data.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );

    return (
      <Fragment>
        { this.props.termSheetStore.isAuthenticated ? (
          <View>
            <Text style={[screenStyles.account_head]}>Account</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              data={this.state.listData}
              renderItem={renderItem}
            />
          </View>
        ) : (
          <View style={css.baseStyles.container}>
            <View style={css.launchScreen.topSection}>
              <Text style={css.launchScreen.tagline}>TermSheet</Text>
              <Text style={css.launchScreen.subTagline}>We make real estate investors better.</Text>
            </View>
            <View style={css.launchScreen.bottomSection}>
              <Button title='Sign In'
                      onPress={this._showLogin}
                      buttonStyle={{borderRadius: 3, backgroundColor: '#ff6700'}}/>
            </View>
          </View>
        )
      }
      </Fragment>
    );
  }
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: css.colors.lightbackground,
  },
  account_head: {
    margin: 20,
    fontSize: scale(30),
    fontWeight: 'bold',
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: css.colors.white,
    borderBottomColor: css.colors.blacklight,
    borderBottomWidth: 1,
    padding: 15,
    height: 60,
  },
  container_row_text: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  title_row: {
    fontSize: scale(20),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansSemiBold,
  },
  app_icon: {
    height: scale(30),
    width: scale(30),
    tintColor: css.colors.theme,
  },
});
