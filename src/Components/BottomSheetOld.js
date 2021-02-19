import React, {PureComponent, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {Button, SearchBar, ListItem, Image} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';

import SwipeUpDown from './SwipeUpDown';
import {SafeAreaView} from 'react-navigation';
import * as css from '../Assets/Styles';
import {observable} from 'mobx';
import {scale} from '../Services/ResponsiveScreen';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Utils from '../Services/Utils';

export default class BottomSheet extends PureComponent {
  /*@observable _parcelData = {
    address: '',
    owner: {
      name: '',
      mailingAddress: '',
    },
    taxId: '',
    yearBuilt: '',
    propertyType: '',
    size: ''
  }*/

  constructor(props) {
    super(props);
  }

  _showFull() {
    this.props.onPressParcel();
  }

  render() {
    const {parcelData, loadedParcel} = this.props;
    //const extParcelData = deepExtend(this._parcelData, parcelData);
    extParcelData = parcelData;

    if (!loadedParcel) {
      return null;
    }

    return (
      <Fragment>
        <View
          style={[
            styles.wrapSwipe2,
            {
              height: 70,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            },
          ]}>
          {!loadedParcel ? (
            <Fragment>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={100} />
                <PlaceholderLine width={80} />
              </Placeholder>
            </Fragment>
          ) : (
            <Fragment>
              <TouchableOpacity
                activeOpacity={0.5}
                style={screenStyles.container_row}
                onPress={() => this._showFull()}>
                <View style={screenStyles.container_row_text}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[screenStyles.address_row]}>
                      {extParcelData.address}
                    </Text>
                    <Ionicon raised size={30} name="md-open" color="black" />
                  </View>
                  {extParcelData.owner ? (
                    <Text style={[styles.city_row]}>{extParcelData.owner}</Text>
                  ) : (
                    <Fragment />
                  )}
                </View>
              </TouchableOpacity>
            </Fragment>
          )}
        </View>
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
    width: scale(325),
  },
  container_row_text: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  address_row: {
    flex: 1,
    fontSize: scale(15),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansBold,
  },
  city_row: {
    fontSize: scale(13),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  app_icon: {
    height: scale(30),
    width: scale(30),
    marginTop: -10,
    tintColor: css.colors.theme,
  },
});

const styles = {
  wrapSwipe: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    marginLeft: 0,
    marginRight: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  wrapSwipe2: {
    position: 'absolute',
    marginLeft: 10,
    bottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 20,
  },
  panelHeader: {
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    padding: 24,
  },
  textHeader: {
    fontSize: 13,
    color: '#000',
    fontWeight: 'bold',
  },
  textSubHeader: {
    fontSize: 12,
    color: '#000',
    marginTop: 2,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    zIndex: 1,
  },
  iconBg: {
    backgroundColor: '#2b8a3e',
    position: 'absolute',
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 1,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  panelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textInput: {
    height: 40,
    width: 300,
    elevation: 1,
    paddingLeft: 5,
    backgroundColor: 'white',
    borderRadius: 3,
    shadowOpacity: 0.75,
    shadowRadius: 1,
    shadowColor: 'gray',
    shadowOffset: {height: 0, width: 0},
  },
  inputWrapper: {
    marginTop: 30,
    flexDirection: 'row',
  },
};
