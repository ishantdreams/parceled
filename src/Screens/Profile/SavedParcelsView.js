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
  Image,
} from 'react-native';
import {Card, ListItem, Button, Icon} from 'react-native-elements';

import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import {SafeAreaView, DrawerActions} from 'react-navigation';
import {scale} from '../../Services/ResponsiveScreen';

import * as css from '../../Assets/Styles';

@inject('termSheetStore', 'parcelStore')
@autobind
@observer
export default class SavedParcelsView extends Component {
  render() {
    const renderItem = data => (
      <TouchableOpacity
        activeOpacity={0.5}
        style={screenStyles.container_row}
        onPress={() =>
          this.props.navigation.navigate('ParcelDetails', {
            parcelData: data.item,
            latitude: data.item.latitude,
            longitude: data.item.longitude,
          })
        }>
        <View style={screenStyles.container_row_text}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[screenStyles.address_row]}>
              {data.item.owner.name}
            </Text>
            <Image
              style={screenStyles.app_icon}
              source={require('../../Assets/Images/ic_bookmark.png')}
              resizeMode="contain"
            />
          </View>
          <Text style={[screenStyles.city_row]}>{data.item.address}</Text>
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
                style={screenStyles.back_icon}
                source={require('../../Assets/Images/ic_back.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          <Text style={[screenStyles.account_head]}>Saved Parcels</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={this.props.parcelStore.savedParcels}
            renderItem={renderItem}
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
  container_row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    paddingHorizontal: 15,
    paddingVertical: 16,
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
    fontSize: scale(20),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansBold,
  },
  city_row: {
    fontSize: scale(20),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  app_icon: {
    height: scale(30),
    width: scale(30),
    marginTop: -10,
    tintColor: css.colors.theme,
  },
  back_icon: {
    marginStart: 10,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.white,
  },
});
