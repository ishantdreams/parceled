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
import {lightColors, darkColors} from '../Assets/Themes/colorThemes';

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
    const {parcelData, loadedParcel, isDark} = this.props;
    //const extParcelData = deepExtend(this._parcelData, parcelData);
    extParcelData = parcelData;

    console.log('parcel data is following:-   ==  ', parcelData);

    if (!loadedParcel) {
      return null;
    }

    const screenStyles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: isDark
          ? darkColors.lightbackground
          : lightColors.lightbackground,
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
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
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
      list_address_style: {
        fontSize: scale(18),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: isDark ? darkColors.textColor : lightColors.textColor,
      },
      list_city: {
        fontSize: scale(14),
        marginTop: 4,
        color: isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      list_owner: {
        fontSize: scale(13),
        marginTop: 10,
        fontWeight: '400',
        color: isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      title_button: {
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: '#FB7A42',
      },
    });

    const styles = {
      wrapSwipe: {
        padding: 10,
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
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
        // marginLeft: 10,
        bottom: 0,
      },
      container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
      },
      panel: {
        flex: 1,
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
        position: 'relative',
        zIndex: 20,
      },
      panelHeader: {
        height: 100,
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
        justifyContent: 'flex-end',
        padding: 24,
      },
      textHeader: {
        fontSize: 13,
        color: isDark ? darkColors.textColor : lightColors.textColor,
        fontWeight: 'bold',
      },
      textSubHeader: {
        fontSize: 12,
        color: isDark ? darkColors.textColor : lightColors.textColor,
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
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
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
      rootData: {
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
        paddingHorizontal: 15,
        marginHorizontal: 8,
        marginBottom: 8,
        paddingVertical: 15,
        borderColor: '#EFEFEF',
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
      },
      propertyDetailBtn: {
        flex: 1,
        backgroundColor: '#FFE8DD',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#FFE8DD',
        marginVertical: 15,
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      },
    };

    return (
      <Fragment>
        <View
          style={[
            styles.wrapSwipe2,
            {
              // height: 70,
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
                onPress={() => this._showFull()}
                style={styles.rootData}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <Text style={screenStyles.list_address_style}>
                      {extParcelData.address}
                    </Text>
                    <Text style={screenStyles.list_city}>
                      {'City names' + ', ' + 'state name' + ' ' + 'postal code'}
                    </Text>
                    <Text style={screenStyles.list_owner}>
                      {extParcelData.owner
                        ? extParcelData.owner
                        : 'No owner name' + ' . property type'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{padding: 3}}
                    activeOpacity={0.6}
                    onPress={() => {
                      console.log('you click on like button.');
                    }}>
                    <Image
                      resizeMode={'contain'}
                      source={require('../Assets/Images/like.png')}
                      style={{width: 18, height: 18}}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.propertyDetailBtn}
                  activeOpacity={0.7}
                  // onPress={() => this.showShareActionSheet(_parcelData)}
                >
                  <Text
                    style={[screenStyles.title_button, {textAlign: 'center'}]}>
                    Property Details
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    backgroundColor: '#EFEFEF',
                    height: 1,
                    marginBottom: 15,
                  }}
                />
                {/* {item.Notes.length <= 0 ? ( */}
                <Text
                  style={{
                    fontSize: scale(16),
                    color: '#FB7A42',
                  }}>
                  Notes
                </Text>
                {/* ) : (
                      <Text
                        style={{
                          fontSize: scale(16),
                          fontWeight: '400',
                          fontStyle: 'italic',
                          // fontFamily: css.Fonts.openSans,
                          color: '#6B6B6B',
                        }}>
                        {item.Notes}
                      </Text>
                    )} */}
              </TouchableOpacity>
            </Fragment>
          )}
        </View>
      </Fragment>
    );
  }
}
