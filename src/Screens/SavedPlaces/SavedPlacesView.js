import {inject, observer} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import {Image, StatusBar, StyleSheet, Text, View, Modal} from 'react-native';
import {
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-navigation';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';
import Icon from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import RBSheet from 'react-native-raw-bottom-sheet';

import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';

const savedPlaceData = [
  {
    id: 1,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Annette Black',
    property_type: 'Residential',
    Notes: '',
  },
  {
    id: 2,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Eleanor Pena',
    property_type: 'Residential',
    Notes:
      'Great price and great location. Looking forward to buy that property.',
  },
  {
    id: 3,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Eleanor Pena',
    property_type: 'Residential',
    Notes: '',
  },
  {
    id: 4,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Eleanor Pena',
    property_type: 'Residential',
    Notes: 'Great Price',
  },
  {
    id: 5,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Eleanor Pena',
    property_type: 'Residential',
    Notes: 'Great price and great location.',
  },
  {
    id: 6,
    address: '4517, Washington Ave.',
    city: 'Manchester',
    state: 'CA',
    postal_code: '39495',
    current_owner: 'Brooklyn Simmons',
    property_type: 'Residential',
    Notes: '',
  },
];

//const invert = require('invert-color');

// const theme = Appearance.getColorScheme();

// const {colors, isDark} = useTheme();

@inject('parcelStore', 'themeStore')
@autobind
@observer
export default class SavedPlacesView extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  // @observable isDark = false;

  constructor(props) {
    super(props);
    this.state = {
      parcelData: null,
      error: null,
      latitude: 37.78825,
      longitude: -122.4324,
      sortType: 'Saved Date',
      listData: [],
      isDark: false,
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
        color: '#FB7A42',
      },
      list_address_style: {
        fontSize: scale(18),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      },
      list_city: {
        fontSize: scale(14),
        marginTop: 4,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      list_owner: {
        fontSize: scale(13),
        marginTop: 10,
        fontWeight: '400',
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      title_sort_bottomsheet: {
        fontSize: scale(12),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: '#8B8B8B',
        alignSelf: 'center',
      },
      item_sort_bottomsheet: {
        fontSize: scale(16),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: '#007AFF',
        textAlign: 'center',
      },
      cancel_sort_bottomsheet: {
        fontSize: scale(17),
        fontWeight: '700',
        fontFamily: css.Fonts.openSans,
        color: '#007AFF',
        alignSelf: 'center',
      },
      rb_view_root: {
        flex: 1,
        width: '90%',
        marginHorizontal: 5,
        alignItems: 'center',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
      },
      rb_view_header: {
        height: 50,
        justifyContent: 'center',
      },
      rb_view_root_child: {
        borderRadius: 15,
        width: '100%',
        backgroundColor: '#E7E7E7',
      },
      line_view: {
        height: 1,
        backgroundColor: '#8B8B8B',
        width: '100%',
      },
      item_root: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
      },
      line_item_view: {
        height: 1,
        backgroundColor: '#CDCDD1',
        width: '100%',
      },
      cancel_root: {
        borderRadius: 15,
        width: '100%',
        marginTop: 10,
        backgroundColor: '#FFFFFF',
      },
      cancel_btn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
      },
      toolbar_view: {
        height: 64,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: '#D3D3D3',
        borderBottomWidth: 1,
      },
      sort_type_btn: {
        marginLeft: 25,
        marginTop: 15,
        flexDirection: 'row',
      },
      sort_type_text: {
        fontSize: scale(16),
        color: '#FB7A42',
        textAlign: 'center',
      },
      sort_type_dropdown: {
        width: 18,
        height: 18,
        alignSelf: 'center',
        marginLeft: 4,
      },
      list_container: {
        paddingHorizontal: 15,
        marginTop: 10,
        paddingVertical: 15,
        borderColor: '#EFEFEF',
        borderRadius: 10,
        borderWidth: 1,
      },
      property_detail_btn: {
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
      line_notes: {
        backgroundColor: '#EFEFEF',
        height: 1,
        marginBottom: 15,
      },
      notes_text: {
        fontSize: scale(16),
        color: '#FB7A42',
      },
      notes_detail: {
        fontSize: scale(16),
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#6B6B6B',
      },
      no_place_logo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
      },
      empty_view_header: {
        fontSize: scale(18),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        alignSelf: 'center',
        marginTop: 15,
        marginHorizontal: 30,
      },
      empty_view_desc: {
        fontWeight: '400',
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
        fontSize: scale(14),
        alignSelf: 'center',
        marginHorizontal: 40,
        textAlign: 'center',
        marginTop: 6,
      },
    });

    return (
      <Fragment>
        <SafeAreaView style={{flex: 1}}>
          <View style={[screenStyles.viewcontainer]}>
            <StatusBar
              barStyle={this.state.isDark ? 'light-content' : 'dark-content'}
              // barStyle={'dark-content'}
              hidden={false}
              backgroundColor={css.colors.theme}
              translucent={false}
            />
            <View style={screenStyles.toolbar_view}>
              <Text style={screenStyles.title_row}>Saved Places</Text>
            </View>

            {this.state.listData.length > 0 && (
              <TouchableOpacity
                style={screenStyles.sort_type_btn}
                onPress={() => {
                  this.RBSheet.open();
                }}>
                <Text style={screenStyles.sort_type_text}>
                  {this.state.sortType}
                </Text>
                <Image
                  resizeMode={'contain'}
                  source={require('../../Assets/Images/ic_chevron_bottom.png')}
                  style={screenStyles.sort_type_dropdown}
                />
              </TouchableOpacity>
            )}
            {this.state.listData.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                bounces={false}
                data={savedPlaceData}
                style={{marginHorizontal: 15, marginBottom: 15}}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({item}) => (
                  <View style={screenStyles.list_container}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flex: 1,
                        }}>
                        <Text style={screenStyles.list_address_style}>
                          {item.address}
                        </Text>
                        <Text style={screenStyles.list_city}>
                          {item.city +
                            ', ' +
                            item.state +
                            ' ' +
                            item.postal_code}
                        </Text>
                        <Text style={screenStyles.list_owner}>
                          {item.current_owner + ' . ' + item.property_type}
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
                          source={require('../../Assets/Images/like.png')}
                          style={{width: 18, height: 18}}
                        />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={screenStyles.property_detail_btn}
                      activeOpacity={0.7}
                      // onPress={() => this.showShareActionSheet(_parcelData)}
                    >
                      <Text
                        style={[
                          screenStyles.title_button,
                          {textAlign: 'center'},
                        ]}>
                        Property Details
                      </Text>
                    </TouchableOpacity>

                    <View style={screenStyles.line_notes} />
                    {item.Notes.length <= 0 ? (
                      <Text style={screenStyles.notes_text}>Notes</Text>
                    ) : (
                      <Text style={screenStyles.notes_detail}>
                        {item.Notes}
                      </Text>
                    )}
                  </View>
                )}
              />
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <View style={screenStyles.no_place_logo}>
                  <Image
                    style={{alignSelf: 'center'}}
                    resizeMode={'contain'}
                    source={require('../../Assets/Images/ic_like.png')}
                  />
                </View>
                <Text style={screenStyles.empty_view_header}>
                  You have no saved places yet.
                </Text>
                <Text style={screenStyles.empty_view_desc}>
                  Favourite and shortlist home to track status changes, price
                  reductions and more.
                </Text>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#FFE8DD',
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: '#FFE8DD',
                    marginVertical: 15,
                    marginHorizontal: 30,
                    height: 40,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.7}
                  onPress={() => {
                    this.setState({listData: savedPlaceData});
                  }}>
                  <Text
                    style={[screenStyles.title_button, {textAlign: 'center'}]}>
                    Browse for places
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* bottom sheet to chose option */}
            <RBSheet
              ref={ref => {
                this.RBSheet = ref;
              }}
              height={273}
              openDuration={250}
              customStyles={{
                container: {
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                },
              }}>
              <View style={screenStyles.rb_view_root}>
                <View style={screenStyles.rb_view_root_child}>
                  <View style={screenStyles.rb_view_header}>
                    <Text style={screenStyles.title_sort_bottomsheet}>
                      {'Sort Places by'}
                    </Text>
                  </View>
                  <View style={screenStyles.line_view} />
                  <View
                    style={{
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      style={screenStyles.item_root}
                      onPress={() => {
                        this.setState({sortType: 'Date'});
                        this.RBSheet.close();
                      }}>
                      <Text style={screenStyles.item_sort_bottomsheet}>
                        Date
                      </Text>
                    </TouchableOpacity>
                    <View style={screenStyles.line_item_view} />
                    <TouchableOpacity
                      style={screenStyles.item_root}
                      onPress={() => {
                        this.setState({sortType: 'Price'});
                        this.RBSheet.close();
                      }}>
                      <Text style={screenStyles.item_sort_bottomsheet}>
                        Price
                      </Text>
                    </TouchableOpacity>
                    <View style={screenStyles.line_item_view} />
                    <TouchableOpacity
                      style={screenStyles.item_root}
                      onPress={() => {
                        this.setState({sortType: 'Something else'});
                        this.RBSheet.close();
                      }}>
                      <Text style={screenStyles.item_sort_bottomsheet}>
                        Something else
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={screenStyles.cancel_root}>
                  <TouchableHighlight
                    style={screenStyles.cancel_btn}
                    onPress={() => {
                      this.RBSheet.close();
                    }}>
                    <Text style={screenStyles.cancel_sort_bottomsheet}>
                      Cancel
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>
            </RBSheet>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
