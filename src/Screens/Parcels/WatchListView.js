import React, {Component} from 'react';
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
  Image
} from 'react-native';
import { Card, ListItem, Button,Icon, } from 'react-native-elements'

import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import { SafeAreaView, DrawerActions } from 'react-navigation';
import { scale } from '../../Services/ResponsiveScreen';
import HeaderWidget from '../../Components/HeaderWidget';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';

import * as css from "../../Assets/Styles";

@inject('termSheetStore', 'parcelStore', 'analyticsStore')
@autobind @observer
export default class WatchListView extends Component {
  static navigationOptions = ({ navigation }) => {
    //return header with Custom View which will replace the original header
    const { params = {} } = navigation.state;
    return {
      header: () =>
        <HeaderWidget
          onPressMap={() => navigation.navigate('Parcels')}
          onPressWatchlist={() => navigation.navigate('WatchList')}
          onPressDeals={() => navigation.navigate('Deals')}
          onPressLogin={() => navigation.navigate('Auth', { screen: 'Login' })}
          onPressLogout={() => params.promptForLogout() }
          isLoggedIn={ params.isLoggedIn }
          activeScreen='watchlist'
        />
    };
  };

  @observable parcels = [];

  componentDidMount() {
    this.props.navigation.setParams({ promptForLogout: this._promptForLogout, isLoggedIn: this.props.termSheetStore.isAuthenticated });
    this._refreshSavedParcels();
    this.props.analyticsStore.screen('WatchList');
  }

  _promptForLogout(){
    this.props.termSheetStore.logout().then(() => {
      this.props.navigation.setParams({ promptForLogout: this._promptForLogout, isLoggedIn: this.props.termSheetStore.isAuthenticated });
    });
  }

  _refreshSavedParcels(){
    this.parcels = this.props.parcelStore.savedParcels;
  }

  _renderItem(data) {
    const index = data.item.id;

    const swipeSettings = {
      autoClose: true,
      backgroundColor: css.colors.lightbackground,
      onClose: (secId, rowId, direction) => {

      },
      onOpen: (secId, rowId, direction) => {

      },
      right: [
        {
          onPress: () => {
            Alert.alert('Alert', 'Are you sure that you want to remove?',
              [
                {
                  text: 'No', onPress: () => {
                }, style: 'cancel'
                },
                {text: 'Yes', onPress: () => {
                  this.props.parcelStore.removeFromSavedParcels(data.item);
                  this._refreshSavedParcels();
                }, style: 'destructive'},
              ],
              {cancellable: true}
            );
          },
          text: 'Delete', type: 'delete'
        }
      ],
      rowId: index,
      sectionId: 1
    }

    return (
      <Swipeout {...swipeSettings}>
        <View activeOpacity={0.5} style={screenStyles.container_row}>
          <View style={screenStyles.container_row_text}>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('ParcelDetails', {parcelData: data.item, parceledData: null, latitude: null, longitude: null})}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={[screenStyles.address_row]}>{data.item.address}</Text>
                <Image
                  style={screenStyles.app_icon}
                  source={require('../../Assets/Images/ic_bookmark.png')}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate('ParcelDetails', {parcelData: data.item, parceledData: null, latitude: null, longitude: null})}>
              <Text style={[screenStyles.city_row]}>{data.item.owner}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeout>
    )
  }

  render(){
    return (
      <SafeAreaView
        style={[screenStyles.container]}>
      <View style={screenStyles.container}>

        <View
          style={{
            margin: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View style={{ flex: 1 }}>
            <Text style={screenStyles.head_txt}>Watching</Text>
            <Text style={screenStyles.sub_txt}>{this.parcels.length} Parcels</Text>
          </View>
          {/*<TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('AddDeals')}>
            <Image
              style={screenStyles.menu_icon}
              source={require('../../Assets/Images/ic_add_circle.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>*/}

          <TouchableOpacity activeOpacity={0.7} onPress={() => this._refreshSavedParcels() }>
            <Icon name='refresh' size={26} style={screenStyles.menu_icon}/>
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item,index) => index.toString()}
          data={this.parcels}
          renderItem={this._renderItem}
        />
      </View>
      </SafeAreaView>
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
  head_txt: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: css.colors.black,
    fontFamily: css.Fonts.openSans
  },
  sub_txt: {
    fontSize: scale(15),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans
  },
  menu_icon: {
    marginHorizontal: 10,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical:16,
    backgroundColor: css.colors.white,
    borderRadius: 5,
    elevation: 3,
    shadowRadius: 5,
    shadowColor: css.colors.gray,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
  },
  container_row_text: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  address_row: {
    flex: 1,
    fontSize: scale(18),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansBold,
  },
  city_row: {
    fontSize: scale(15),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  app_icon: {
    height: scale(20),
    width: scale(20),
    marginTop:-10,
    tintColor: css.colors.theme,
  },
});
