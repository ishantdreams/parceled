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

import * as css from "../../Assets/Styles";

@inject('termSheetStore')
@autobind @observer
export default class WorkSpacesView extends Component {
  @observable accounts;

  componentDidMount() {
    this.props.termSheetStore.loadAccounts().then((data) => {
      this.accounts = data.accounts
    });
  }

  _selectAccount(item){
    this.props.termSheetStore.setAccountId(item.id.toString());
    Alert.alert('Workspace Selected');
  }

  render() {
    const renderItem = data => (
      <TouchableOpacity activeOpacity={0.8} style={screenStyles.container_row} onPress={() => { this._selectAccount(data.item); }}>
        <View style={{paddingHorizontal: 15,paddingVertical:10, backgroundColor: css.colors.lightBlue}}>
          <Text style={[screenStyles.head_row]}>{data.item.name}</Text>
        </View>

        <View style={screenStyles.container_row_text}>
          <View style={{flex: 1, marginVertical: 5,marginStart:20,}}>
            <Text style={[screenStyles.title_row]}>Subdomain</Text>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={screenStyles.row_icon}
                source={require('../../Assets/Images/ic_business.png')}
                resizeMode="contain"
              />
              <Text style={[screenStyles.desc_row]}>{data.item.subdomain}.termsheet.com</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <SafeAreaView
        style={[screenStyles.container, {backgroundColor: css.colors.theme}]}>
      <View style={screenStyles.container}>
        {/* Header View */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: css.colors.theme,
            height: Platform.OS === 'android' ? 50 : 44,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => this.props.navigation.pop()}>
            <Image
              style={{
                marginStart: 10,
                height: scale(30),
                width: scale(40),
                tintColor: css.colors.white,
              }}
              source={require('../../Assets/Images/ic_back.png')}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[screenStyles.account_head]}>Workspaces</Text>
          {/*<Image
            style={screenStyles.app_icon}
            source={require('../../Assets/Images/ic_add_circle.png')}
            resizeMode="contain"
          />*/}
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={this.accounts}
          renderItem={renderItem}
        />

      {/*<View style={screenStyles.bottomView}>
          <TouchableOpacity activeOpacity={0.7} style={screenStyles.btn_style}>
            <Text style={screenStyles.btn_txt}>Add New Workspace</Text>
          </TouchableOpacity>
        </View>*/}
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
    flex: 1,
    margin: 20,
    fontSize: scale(30),
    fontWeight: 'bold',
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  container_row: {
    justifyContent: 'center',
    margin:10,
    backgroundColor: css.colors.white,
    borderRadius: 5,
    elevation: 3,
    shadowRadius: 5,
    shadowColor: css.colors.gray,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
  },
  container_row_text: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding:10,
  },

  head_row: {
    fontSize: scale(22),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansBold,
  },
  title_row: {
    marginStart:30,
    fontSize: scale(16),
    color: css.colors.grey,
    fontFamily: css.Fonts.openSans,
  },
  desc_row: {
      marginStart:10,
    fontSize: scale(18),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  app_icon: {
    height: scale(30),
    width: scale(30),
    marginHorizontal: 20,
    tintColor: css.colors.theme,
  },
  row_icon: {
    height: scale(25),
    width: scale(25),
    tintColor: css.colors.theme,
  },
  bottomView: {
    width: '100%',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  btn_style: {
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 5,
    padding: 10,
    backgroundColor: css.colors.orange,
    alignItems: 'center',
  },
  btn_txt: {
    fontSize: scale(22),
    fontWeight: 'bold',
    color: css.colors.white,
  },
});
