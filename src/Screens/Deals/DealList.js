import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, ListItem, Button} from 'react-native-elements';
import HeaderWidget from '../../Components/HeaderWidget';

import Icon from 'react-native-vector-icons/FontAwesome';

import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import Loader from '../../Components/Loader';
import {SafeAreaView, DrawerActions} from 'react-navigation';
import {scale} from '../../Services/ResponsiveScreen';
import NumberFormat from 'react-number-format';
import DelayInput from 'react-native-debounce-input';

import * as css from '../../Assets/Styles';

@inject('termSheetStore', 'analyticsStore')
@autobind
@observer
export default class DealList extends Component {
  static navigationOptions = ({navigation}) => {
    //return header with Custom View which will replace the original header
    const {params = {}} = navigation.state;
    return {
      header: () => (
        <HeaderWidget
          onPressMap={() => navigation.navigate('Parcels')}
          onPressWatchlist={() => navigation.navigate('WatchList')}
          onPressDeals={() => navigation.navigate('Deals')}
          onPressLogin={() => navigation.navigate('Auth', {screen: 'Login'})}
          onPressLogout={() => params.promptForLogout()}
          isLoggedIn={params.isLoggedIn}
          activeScreen="deals"
        />
      ),
    };
  };

  @observable projects = [];
  @observable dealCount = 0;
  @observable first = 20;
  @observable skip = 0;
  @observable loading = true;
  @observable searchText = '';

  constructor(props) {
    super(props);
    //this.store = this.props.screenProps.store;
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this._loadDealsAsync();
    this.props.navigation.setParams({
      promptForLogout: this._promptForLogout,
      isLoggedIn: this.props.termSheetStore.isAuthenticated,
    });
    this.props.analyticsStore.screen('DealList');
  }

  _promptForLogout() {
    this.props.termSheetStore.logout().then(() => {
      this.props.navigation.setParams({
        promptForLogout: this._promptForLogout,
        isLoggedIn: this.props.termSheetStore.isAuthenticated,
      });
    });
  }

  _loadDealsAsync = async (query = null) => {
    const accountId = await AsyncStorage.getItem('accountId');
    this.loading = true;

    if (accountId) {
      this.props.termSheetStore
        .loadProjects(this.first, this.skip, query)
        .then(data => {
          this.projects = [...this.projects, ...data.projects];
          //this.projects = data.projects;
          this.dealCount = data.projects.length;
          this.loading = false;
        });
    } else {
      //this.props.navigation.navigate('AccountList');
      console.log('need to login first');
      this.loading = false;
      this.props.navigation.navigate('AccountList');
    }
  };

  onSearchText(text) {
    this.first = 20;
    this.skip = 0;
    this.projects = [];
    this._loadDealsAsync(this.searchText);
    Keyboard.dismiss();
  }

  _changeTextInputValue(text) {
    this.searchText = text;
  }

  clearText() {
    this.searchText = '';
    this.first = 20;
    this.skip = 0;
    this.projects = [];
    this._loadDealsAsync(this.searchText);
    Keyboard.dismiss();
  }

  _handleLoadMore() {
    this.skip = this.skip + this.first;
    this._loadDealsAsync(this.searchText);
  }

  _showLogin() {
    this.props.navigation.navigate('Login');
  }

  _renderRow({item}) {
    let pressed = () => {
      //this.props.navigation.navigate('NavigationDispatcher', { to: 'DealDetails', deal: item, goBack: 'DealList' })
      this.props.navigation.navigate('DealDetails', {project: item});
      //this.props.navigation.navigate({
      //  routeName: 'DealDetails',
      //  params: {deal: item},
      //  key: item.id.toString(),
      //});
    };

    let actualRowComponent = (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.24,
          shadowRadius: 2,
          elevation: 5,
          minHeight: 100,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 20,
        }}>
        <Image
          source={{
            uri:
              'https://s3.amazonaws.com/termsheet-production/asset/images/attachments/000/044/713/original/kettler-dev-cc.jpg?1576274229',
          }}
          style={{
            height: 150,
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            resizeMode: 'cover',
          }}
        />
        <View
          style={{
            paddingTop: 10,
            borderTopColor: '#F2F2F2',
            borderTopWidth: 1,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
          }}>
          <Text style={{color: '#457DC7', lineHeight: 16, fontWeight: '600'}}>
            MULTIFAMILY
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 5}}>
            685 Market St
          </Text>
          <Text>San Francisco, CA 94105</Text>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              borderTopColor: '#F2F2F2',
              borderTopWidth: 1,
              height: 50,
              paddingTop: 10,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                borderRightColor: '#F2F2F2',
                borderRightWidth: 1,
                alignItems: 'center',
              }}>
              <Text>Guidance Price</Text>
              <Text style={{fontWeight: 'bold'}}>$2,900,000</Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                flex: 1,
                borderRightColor: '#F2F2F2',
                borderRightWidth: 1,
                alignItems: 'center',
              }}>
              <Text>Bid Price</Text>
              <Text style={{fontWeight: 'bold'}}>$2,500,000</Text>
            </View>
            <View
              style={{flexDirection: 'column', flex: 1, alignItems: 'center'}}>
              <Text>Cap Rate</Text>
              <Text style={{fontWeight: 'bold'}}>5.5%</Text>
            </View>
          </View>
        </View>
      </View>
    );
    let touchableWrapperIos = (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#fff"
        onPress={pressed}>
        {actualRowComponent}
      </TouchableHighlight>
    );

    let touchableWrapperAndroid = (
      <TouchableNativeFeedback
        useForeground={true}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPress={pressed}>
        {actualRowComponent}
      </TouchableNativeFeedback>
    );

    if (require('react-native').Platform.OS === 'ios') {
      return touchableWrapperIos;
    } else return touchableWrapperAndroid;
  }

  _renderFooter() {
    if (!this.loading) return null;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          textAlign: 'center',
          justifyContent: 'center',
          borderColor: css.colors.gray,
        }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  render() {
    const CardListDesign = ({item}) => (
      <TouchableOpacity
        activeOpacity={0.7}
        style={screenStyles.container_row}
        onPress={() =>
          this.props.navigation.navigate('DealDetails', {project: item})
        }>
        <View style={screenStyles.row_image_container}>
          <Image
            style={screenStyles.row_image}
            source={{
              uri:
                item.featured_image_url ||
                'https://s3.amazonaws.com/termsheet-production/asset/images/attachments/000/044/713/original/kettler-dev-cc.jpg?1576274229',
            }}
            resizeMode="cover"
          />
          <View style={screenStyles.row_over_txt}>
            <Text
              style={[
                {
                  fontWeight: '700',
                  color: css.colors.white,
                  fontSize: scale(16),
                  fontFamily: css.Fonts.openSans,
                },
              ]}>
              {item.project_stage ? item.project_stage.name : ''}
            </Text>
          </View>
        </View>

        <Text style={screenStyles.title_row}>{item.address_string}</Text>
        <Text style={screenStyles.title_address}>{item.title}</Text>
        <Text style={screenStyles.title_city}>
          {item.property_type ? item.property_type.name : ''}
        </Text>
        <View style={{height: 1, backgroundColor: css.colors.blacklight}} />
      </TouchableOpacity>
    );

    return (
      <Fragment>
        {this.props.termSheetStore.isAuthenticated ? (
          <SafeAreaView style={css.baseStyles.baseContainer}>
            <View style={searchBarStyles.mapScreenScreenBar}>
              <Fragment>
                <View style={searchBarStyles.container}>
                  <View style={searchBarStyles.inputContainer}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        width: 20,
                      }}>
                      <Icon size={15} name="search" color={css.colors.theme} />
                    </View>
                    <TextInput
                      autoCorrect={false}
                      placeholder="Filter deals by name or address"
                      onChangeText={text => this._changeTextInputValue(text)}
                      onSubmitEditing={() => this.onSearchText()}
                      returnKeyType={'search'}
                      style={searchBarStyles.textInput}
                      value={this.searchText}
                    />
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        flex: 1,
                        width: 20,
                        paddingRight: 10,
                      }}>
                      <TouchableOpacity onPress={() => this.clearText()}>
                        <Icon
                          size={15}
                          name="times-circle"
                          type="font-awesome"
                          color={css.colors.theme}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Fragment>
            </View>

            <Loader loading={this.loading} />
            <FlatList
              ListHeaderComponent={
                <View
                  style={{
                    marginVertical: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 1, marginStart: 10}}>
                    <Text style={screenStyles.head_txt}>Deals</Text>
                    <Text style={screenStyles.sub_txt}>
                      {this.dealCount} Deals
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this._loadDealsAsync(this.searchText)}>
                    <Icon
                      name="refresh"
                      size={20}
                      style={screenStyles.menu_icon}
                    />
                  </TouchableOpacity>
                </View>
              }
              style={{marginHorizontal: 8}}
              showsVerticalScrollIndicator={false}
              bounces={false}
              data={this.projects}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({item}) => <CardListDesign item={item} />}
            />
          </SafeAreaView>
        ) : (
          <View style={css.baseStyles.container}>
            <View style={css.launchScreen.topSection}>
              <Text style={css.launchScreen.tagline}>TermSheet</Text>
              <Text style={css.launchScreen.subTagline}>
                We make real estate investors better.
              </Text>
            </View>
            <View style={css.launchScreen.bottomSection}>
              <Button
                title="Sign In"
                onPress={this._showLogin}
                buttonStyle={{borderRadius: 3, backgroundColor: '#ff6700'}}
              />
            </View>
          </View>
        )}
      </Fragment>
    );
  }
}

const screenStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  viewcontainer: {
    flex: 1,
    backgroundColor: css.colors.white,
  },
  head_txt: {
    fontSize: scale(30),
    fontWeight: 'bold',
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  sub_txt: {
    fontSize: scale(15),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  menu_icon: {
    marginHorizontal: 0,
    height: scale(30),
    width: scale(40),
    color: css.colors.theme,
  },
  container_row: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    shadowRadius: 5,
    shadowColor: css.colors.gray,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.24,
  },
  row_image_container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  row_image_container_Normal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
  },
  row_image: {
    height: 180,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  row_image_Normal: {
    margin: 7,
    height: scale(80),
    width: scale(80),
    borderRadius: 5,
  },
  row_over_txt: {
    backgroundColor: css.colors.blue,
    borderRadius: 20,
    paddingHorizontal: 15,
    position: 'absolute',
    alignSelf: 'flex-end',
    end: 10,
    bottom: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_row_text: {
    marginHorizontal: 10,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title_row: {
    marginTop: 15,
    marginHorizontal: 15,
    fontSize: scale(14),
    color: css.colors.blue,
    fontWeight: '600',
    fontFamily: css.Fonts.openSans,
  },
  title_row_normal: {
    marginTop: 7,
    marginHorizontal: 5,
    fontSize: scale(14),
    color: css.colors.blue,
    fontWeight: '600',
    fontFamily: css.Fonts.openSans,
  },
  title_address: {
    marginHorizontal: 15,
    fontSize: scale(18),
    fontWeight: 'bold',
    marginTop: 5,
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  title_address_normal: {
    marginHorizontal: 5,
    fontSize: scale(18),
    fontWeight: 'bold',
    marginTop: 5,
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  title_city: {
    marginHorizontal: 15,
    fontSize: scale(16),
    color: css.colors.black,
    marginBottom: 10,
    fontFamily: css.Fonts.openSans,
  },
  title_city_normal: {
    marginHorizontal: 5,
    fontSize: scale(16),
    color: css.colors.black,
    marginBottom: 10,
    fontFamily: css.Fonts.openSans,
    marginTop: 4,
  },
  title_head: {
    fontSize: scale(14),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  title_base: {
    fontSize: scale(14),
    fontWeight: '600',
    color: css.colors.black,
  },
  tab_container_style: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 15,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  row_tab_txt: {
    fontSize: scale(14),
    fontWeight: '700',
    color: css.colors.white,
    fontFamily: css.Fonts.openSans,
  },
  row_tab_no: {
    fontSize: scale(14),
    marginStart: 5,
    fontWeight: '700',
    color: css.colors.white,
    fontFamily: css.Fonts.openSans,
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
  header: {height: 50, backgroundColor: '#e6e6e6'},
  text: {textAlign: 'center', fontWeight: '100'},
  dataWrapper: {marginTop: -1},
  row: {height: 40, backgroundColor: '#ffffff'},
});

const images = [
  require('../../Assets/Images/property.jpeg'),
  require('../../Assets/Images/property.jpeg'),
  require('../../Assets/Images/property.jpeg'),
];

const layerStyles = {
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  topRightLayerButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 100,
    right: 40,
    zIndex: 10,
  },
  topLeftLayerButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 100,
    left: 5,
    zIndex: 10,
  },
  bottomRightLayerButton: {
    position: 'absolute',
    width: 20,
    height: 20,
    bottom: 250,
    right: 40,
    zIndex: 10,
  },
  slideUpContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const searchBarStyles = {
  textInput: {
    height: 40,
    width: 300,
    elevation: 1,
    paddingLeft: 5,
    backgroundColor: '#ffffff',
    color: '#000000',
    flex: 4,
  },
  inputContainer: {
    borderBottomWidth: 0,
    backgroundColor: '#ffffff',
    borderRadius: 9,
    minHeight: 36,
    marginLeft: 8,
    marginRight: 8,
    flexDirection: 'row',
    flex: 1,
  },
  container: {
    backgroundColor: '#ffffff',
    paddingBottom: 5,
    paddingTop: 5,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    paddingLeft: 10,
  },
  mapScreenScreenBar: {
    zIndex: 20,
    borderBottomColor: '#F2F2F2',
    borderBottomWidth: 1,
    marginBottom: 0,
  },
};
