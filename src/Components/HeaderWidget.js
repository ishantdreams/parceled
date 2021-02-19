import React, {Component, PureComponent, Fragment, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import {Icon, Button, SearchBar, ListItem} from 'react-native-elements';
import SwipeUpDown from './SwipeUpDown';
import * as css from '../Assets/Styles';
import {observable} from 'mobx';
import RenderIf from '../Services/RenderIf';
import {scale} from '../Services/ResponsiveScreen';
import autobind from 'autobind-decorator';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import Utils from '../Services/Utils';
import {set} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

@autobind
export default class HeaderWidget extends Component {
  loginListData = [
    {
      key: 'parcels',
      name: 'View Map',
      image: require('../Assets/Images/ic_near_me.png'),
      color: css.colors.theme,
      onPress: () => {
        this._toggleModalVisible();
        this.props.onPressMap();
      },
    },
    {
      key: 'watchlist',
      name: 'View Watchlist',
      image: require('../Assets/Images/ic_bookmark.png'),
      color: css.colors.theme,
      onPress: () => {
        this._toggleModalVisible();
        this.props.onPressWatchlist();
      },
    },
    {
      key: 'deals',
      name: 'View Deals',
      image: require('../Assets/Images/ic_business.png'),
      color: css.colors.theme,
      onPress: () => {
        this._toggleModalVisible();
        this.props.onPressDeals();
      },
    },
    {
      key: 'logout',
      name: 'Log Out',
      image: '',
      color: 'red',
      onPress: () => {
        this.props.onPressLogout();
        this._toggleModalVisible();
      },
    },
  ];

  guestListData1 = [
    {
      key: 'parcels',
      name: 'View Map',
      image: require('../Assets/Images/ic_near_me.png'),
      color: css.colors.orange,
      onPress: () => {
        console.log('VIEW MAP');
        this._toggleModalVisible();
        this.props.onPressMap();
      },
    },
    {
      key: 'watchlist',
      name: 'View Watchlist',
      image: require('../Assets/Images/ic_bookmark.png'),
      color: css.colors.theme,
      onPress: () => {
        this._toggleModalVisible();
        this.props.onPressWatchlist();
      },
    },
  ];

  guestListData2 = [
    {
      key: 0,
      name: 'Login',
      color: css.colors.theme,
      onPress: () => {
        this.setState({modalVisible: false});
        this.props.onPressLogin();
      },
    },
    {
      key: 1,
      name: 'Learn more about Termsheet',
      color: css.colors.theme,
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  _toggleModalVisible() {
    console.log('_toggleModalVisible');
    this.setState({
      modalVisible: !this.state.modalVisible,
    });
  }

  _onPressLogin() {
    this.setState({modalVisible: false});
    this.props.onPressLogin();
  }

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#ff6700',
          height: Platform.OS === 'android' ? 50 : 80,
          paddingTop: 30,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            style={{
              marginStart: 10,
              height: scale(32),
              width: scale(40),
              tintColor: css.colors.white,
            }}
            source={require('../Assets/Images/parceled_logo_icon_white.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={{
            color: css.colors.white,
            fontWeight: 'bold',
            fontSize: scale(20),
            flex: 1,
            textAlign: 'left',
            marginLeft: 10,
            fontFamily: css.Fonts.openSansSemiBold,
          }}>
          Parceled
        </Text>

        <TouchableOpacity
          onPress={() => {
            this._toggleModalVisible();
          }}>
          {!this.state.modalVisible ? (
            <FontAwesome
              size={scale(25)}
              style={{
                marginEnd: 15,
              }}
              name="bars"
              type="font-awesome"
              color={css.colors.white}
            />
          ) : (
            <FontAwesome
              size={scale(25)}
              style={{
                marginEnd: 20,
              }}
              name="times"
              type="font-awesome"
              color={css.colors.white}
            />
          )}
        </TouchableOpacity>
        <Modal
          animationType="none"
          //presentationStyle="pageSheet"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this._toggleModalVisible();
          }}>
          <TouchableOpacity
            style={{
              paddingTop: Platform.OS === 'android' ? 50 : 80,
              backgroundColor: 'rgba(0,0,0,0.2)',
              flex: 1,
            }}
            onPress={() => {
              this.setState({modalVisible: false});
            }}>
            <View style={{backgroundColor: 'white'}}>
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={
                  this.props.isLoggedIn
                    ? this.loginListData
                    : this.guestListData1
                }
                keyExtractor={(item, index) => item.key.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={screenStyles.container_row}
                    onPress={() => {
                      item.onPress();
                    }}>
                    {RenderIf(item.image != '')(
                      <Image
                        style={[
                          screenStyles.app_icon,
                          {
                            tintColor:
                              item.key == this.props.activeScreen
                                ? css.colors.orange
                                : item.color,
                          },
                        ]}
                        source={{uri: item.image}}
                        resizeMode="contain"
                      />,
                    )}
                    <Text
                      style={[
                        screenStyles.title_row,
                        {
                          color:
                            item.key == this.props.activeScreen
                              ? css.colors.orange
                              : item.color,
                        },
                      ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {!this.props.isLoggedIn && (
                <View>
                  <View style={screenStyles.titleHeadContainer}>
                    <Text style={screenStyles.title_head}>
                      Are you a Termsheet user?
                    </Text>
                    <Text
                      style={screenStyles.linkStyle}
                      onPress={() => this._onPressLogin()}>
                      Login
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  viewcontainer: {
    flex: 1,
    backgroundColor: css.colors.theme,
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
    flex: 1,
    marginLeft: 15,
    fontSize: scale(17),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansSemiBold,
  },
  titleHeadContainer: {
    marginVertical: 20,
    marginLeft: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  title_head: {
    fontSize: scale(16),
    color: css.colors.grey,
    fontFamily: css.Fonts.openSansSemiBold,
    textAlign: 'left',
  },
  linkStyle: {
    marginLeft: 10,
    color: css.colors.theme,
    textDecorationLine: 'underline',
    fontSize: scale(18),
  },
  row_view: {
    flex: 1,
    fontSize: scale(20),
    color: css.colors.theme,
    fontFamily: css.Fonts.openSansSemiBold,
  },
  app_icon: {
    height: scale(25),
    width: scale(25),
    tintColor: css.colors.theme,
  },
});
