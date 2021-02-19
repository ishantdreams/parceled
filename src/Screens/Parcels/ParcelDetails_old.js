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
  ScrollView,
  TouchableHighlight,
  TouchableNativeFeedback,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import {Card, ListItem, Button} from 'react-native-elements';

import Icon from 'react-native-vector-icons/EvilIcons';
import Carousel from 'react-native-banner-carousel';
import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import {SafeAreaView, DrawerActions} from 'react-navigation';
import {scale} from '../../Services/ResponsiveScreen';
import NumberFormat from 'react-number-format';
var parseAddress = require('parse-address');
import Loader from '../../Components/Loader';
import TabScreen from './Tabs/TabScreen';
import Foundation from 'react-native-vector-icons/Foundation';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageOverlay from 'react-native-image-overlay';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import RatingRequestor, {buttonTypes} from 'react-native-rating-requestor';
import * as css from '../../Assets/Styles';

const RatingTracker = new RatingRequestor('1511253428', {
  title: 'Enjoying Parceled?',
  message:
    'If you like Parceled, we would greatly appreciate it if you could rate the app in the App Store. Thanks for your support.',
  actionLabels: {
    decline: 'Never Ask Again',
    delay: 'Not Now',
    accept: 'Rate Parceled',
  },
});
const BannerWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const BannerHeight = 260;

const LOVELAND_API_TOKEN =
  'e6zfYjvSq-mDRynqYPsh1VRUwACt6gXsbhXj4ygCSu6BqX854nCFG1ufPBRdxYcP';

const Header_Maximum_Height = 260;
const Header_Minimum_Height = 0;

@inject(
  'termSheetStore',
  'parcelStore',
  'analyticsStore',
  'iapStore',
  'userStore',
)
@observer
export default class ParcelDetailsOld extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  @observable loading = false;
  @observable notes = '';
  @observable cherreParcelData = null;
  @observable submitFeedback = false;

  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      parcelData: null,
      searchingPhoneRecords: false,
      modalVisible: false,
      phoneRecords: [],
      latitude: null,
      longitude: null,
      isSavedParcel: false,
    };
  }

  componentDidMount() {
    const parcelData = this.props.navigation.getParam('parcelData', {});
    const parceledData = this.props.navigation.getParam('parceledData', {});
    let latitude = this.props.navigation.getParam('latitude', {});
    let longitude = this.props.navigation.getParam('longitude', {});

    this.notes = parcelData.notes;

    if (longitude && latitude) {
      this.setState({
        longitude: longitude,
        latitude: latitude,
      });
    } else if (parcelData.latitude && parcelData.longitude) {
      this.setState({
        longitude: parcelData.longitude,
        latitude: parcelData.latitude,
      });
      longitude = parcelData.longitude;
      latitude = parcelData.latitude;
    }
    this.props.analyticsStore.screen('ParcelDetails', {
      latitude: latitude,
      longitude: longitude,
    });
    /*this.setState({
      parcelData: parcelData
    })*/
    this.loading = true;
    /*this.props.parcelStore.lookupParcel({address: parcelData.address, latitude: latitude, longitude: longitude}).then((data) => {
      this.setState({
        parcelData: data
      })
      this.props.parcelStore.addToRecentlyViewed(data)
      this.loading = false;
    });*/
    //let _this = this;
    /*this.props.parcelStore.loadLovelandParcel(LOVELAND_API_TOKEN, parcelData.properties.path).then((data) => {
      this.setState({
        parcelData: data,
      })
      if(this.state.latitude && this.state.longitude){
        let parcelData = this.state.parcelData;
        parcelData.latitude = this.state.latitude;
        parcelData.longitude = this.state.longitude;
        this.setState({
          parcelData: data,
        })
      }
      this.props.parcelStore.addToRecentlyViewed(data)
      this.loading = false;
      console.log(this.state.parcelData)
    })*/
    this.props.navigation.setParams({saveParcel: this._saveParcel.bind(this)});
    try {
      if (parceledData !== null) {
        if (
          parceledData &&
          parceledData.tax_assessor_point &&
          parceledData.tax_assessor_point.length > 0
        ) {
          this.cherreParcelData = parceledData.tax_assessor_point[0];
          if (parceledData.far) {
            this.cherreParcelData.far = parceledData.far;
          }
          console.log(this.cherreParcelData);
          this.loading = false;
          this.props.analyticsStore.track('Viewed Parcel', {
            apn: this.cherreParcelData.assessor_parcel_number_raw,
            latitude: latitude,
            longitude: longitude,
          });
          let parcelObj = this._buildParcelObject();
          if (this.props.parcelStore.isInWatchlist(parcelObj)) {
            this.setState({
              isSavedParcel: true,
            });
          }
        }
      } else {
        console.log('loading.............');
        //CHERRE
        let apn = '';
        if (parcelData.properties) {
          apn = parcelData.properties.parcelnumb;
        } else if (parcelData.parcelId) {
          apn = parcelData.parcelId;
        }

        this.props.parcelStore
          .loadCherreParcel(
            latitude,
            longitude,
            this.props.userStore.parceledUser.token,
            apn,
          )
          .then(data => {
            if (
              data &&
              data.tax_assessor_point &&
              data.tax_assessor_point.length > 0
            ) {
              this.cherreParcelData = data.tax_assessor_point[0];
              this.loading = false;
              this.props.analyticsStore.track('Viewed Parcel', {
                apn: this.cherreParcelData.assessor_parcel_number_raw,
                latitude: latitude,
                longitude: longitude,
              });
              let parcelObj = this._buildParcelObject();
              if (this.props.parcelStore.isInWatchlist(parcelObj)) {
                this.setState({
                  isSavedParcel: true,
                });
              }
            } else if (
              data &&
              data.tax_assessor_point &&
              data.tax_assessor_point.length === 0
            ) {
              this.loading = false;
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  _saveParcel() {
    let parcelObj = this._buildParcelObject();
    if (!this.props.parcelStore.isInWatchlist(parcelObj)) {
      this.props.parcelStore.addToSavedParcels(parcelObj);
      this.props.parcelStore.saveFavoriteToServer(
        parcelObj.parcelId,
        true,
        this.props.userStore.parceledUser.token,
      );
      //Alert.alert('Parcel Saved');
      this.props.analyticsStore.track('Saved Parcel', parcelObj);
      this.setState({
        isSavedParcel: true,
      });

      //since the user did something delightful prompt for review
      RatingTracker.handlePositiveEvent();
      //RatingTracker.showRatingDialog();
    } else {
      this.props.parcelStore.removeFromSavedParcels(parcelObj);
      this.props.parcelStore.saveFavoriteToServer(
        parcelObj.parcelId,
        false,
        this.props.userStore.parceledUser.token,
      );
      this.setState({
        isSavedParcel: false,
      });
    }
  }

  _buildParcelObject() {
    return {
      id: this.cherreParcelData.assessor_parcel_number_raw,
      parcelId: this.cherreParcelData.assessor_parcel_number_raw,
      address: this.cherreParcelData.one_line_address,
      owner:
        this.cherreParcelData.tax_assessor_owner.length > 0
          ? this.cherreParcelData.tax_assessor_owner[0].owner_name
          : '',
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      notes: '',
    };
  }

  onCloseFeedback() {
    this.submitFeedback = false;
  }

  _updateNotes(text) {
    this.notes = text;
  }

  _saveNotes() {
    let parcelObj = this._buildParcelObject();
    parcelObj.notes = this.notes;
    this.props.parcelStore.addToSavedParcels(parcelObj);
  }

  _submitFeedback(parcelDetails) {
    //this.submitFeedback = true;
    let url = `https://roger050099.typeform.com/to/shpZnG?apn=${
      parcelDetails.assessor_parcel_number_raw
    }&address=${parcelDetails.one_line_address}&user_token=${
      this.props.userStore.parceledUser.token
    }`;
    this.props.navigation.navigate('FeedbackView', {
      url: url,
      apn: parcelDetails.assessor_parcel_number_raw,
      title: parcelDetails.one_line_address,
    });
  }

  _camelCase(str) {
    if (str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
          return index == 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
    } else {
      return '';
    }
  }

  subscribeToPro() {
    this.props.iapStore.buy('com.termsheet.com.parceled.pro').then(() => {
      //check user from server to see if it went through
      this.props.userStore.loadParcledUser();
    });
  }

  promptForPro() {
    Alert.alert(
      'Parceled Pro',
      'This is part of Parceled Pro. Do you wish to subscribe to unlimited reports for $19.99 per month?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.subscribeToPro();
          },
          style: 'destructive',
        },
      ],
    );
  }

  viewPdfReport(parcelDetails) {
    if (
      this.props.termSheetStore.isAuthenticated ||
      this.props.userStore.isProSubsciptionEnabled ||
      !this.props.userStore.pdfReport ||
      this.props.userStore.pdfReport == parcelDetails.assessor_parcel_number_raw
    ) {
      let url = this.props.parcelStore.getReportUrl(
        parcelDetails.assessor_parcel_number_raw,
        this.props.userStore.parceledUser.token,
      );
      this.props.analyticsStore.track('Viewed Parcel Report', {
        apn: parcelDetails.assessor_parcel_number_raw,
      });
      this.props.userStore.persistSavedPdfReport(
        parcelDetails.assessor_parcel_number_raw,
      );
      this.props.navigation.navigate('ReportWebView', {
        url: url,
        title: parcelDetails.one_line_address,
      });
    } else {
      this.promptForPro();
    }
  }

  showShareActionSheet = parcelDetails => {
    let parcelObj = this._buildParcelObject();
    this.props.analyticsStore.track('Shared Parcel', parcelObj);

    const url =
      'https://parceled.termsheet.com/p/v/' +
      parcelDetails.assessor_parcel_number_raw;
    const title =
      parcelDetails.house_number +
      parcelDetails.street_direction +
      ' ' +
      parcelDetails.street_name +
      parcelDetails.street_suffix;
    const message = "I'm sharing this property from Parceled.";
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: {type: 'url', content: url},
            item: {
              default: {type: 'url', content: url},
            },
            subject: {
              default: title,
            },
            linkMetadata: {originalUrl: url, url, title},
          },
          {
            placeholderItem: {type: 'text', content: message},
            item: {
              default: {type: 'text', content: message},
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });
    Share.open(options)
      .then(res => {
        RatingTracker.handlePositiveEvent();
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  renderParcelDetails() {
    const commonInputProps = {
      style: [
        screenStyles.input,
        screenStyles.sub_txt,
        css.baseStyles.greyFont,
      ],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none',
    };
    if (this.state.parcelData) {
      const _parcelData = this.state.parcelData.properties.fields;
      const addressObj = parseAddress.parseLocation(_parcelData.address);

      return (
        <SafeAreaView style={screenStyles.viewcontainer}>
          <View style={{backgroundColor: css.colors.lightbackground}}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: BannerWidth,
                alignItems: 'center',
                marginTop:
                  Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
              }}>
              <TouchableOpacity onPress={() => this._saveParcel()}>
                <Image
                  style={screenStyles.top_icon}
                  source={require('../../Assets/Images/ic_bookmark.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text
                style={{
                  flex: 1,
                  color: css.colors.white,
                  fontSize: scale(20),
                  textAlign: 'center',
                }}
              />

              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  style={screenStyles.top_icon}
                  source={require('../../Assets/Images/ic_cancel.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <Text style={screenStyles.title_address}>
              {addressObj.number} {addressObj.prefix} {addressObj.street}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginStart: 10,
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <Image
                style={screenStyles.loc_icon}
                source={require('../../Assets/Images/ic_location.png')}
                resizeMode="contain"
                tintColor={css.colors.blue}
              />
              <Text style={screenStyles.title_city}>
                {_parcelData.scity}, {_parcelData.szip}
              </Text>
            </View>
            {/* <Text style={styles.title_city}>{this.state.city}</Text> */}
          </View>
          <Loader loading={this.loading} />
          <ScrollView
            style={screenStyles.viewcontainer}
            bounces={false}
            showsVerticalScrollIndicator={false}
            //stickyHeaderIndices={[2]}
            overScrollMode="never">
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Owner</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.owner}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Address</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.address}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>County</Text>
              <Text style={screenStyles.sub_txt}>
                {_parcelData.sourceagent}
              </Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Tax #</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.parno}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Owner Mailing Address</Text>
              <Text style={screenStyles.sub_txt}>
                {_parcelData.mailadd} {_parcelData.mail_city},{' '}
                {_parcelData.mail_zip}
              </Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Property Type</Text>
              <Text style={screenStyles.sub_txt}>
                {_parcelData.structstyle}
              </Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Year Built</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.yearbuilt}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}># Units</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.structno}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Lot Size</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.ll_gisacre}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Assessed Land Value</Text>
              <Text style={screenStyles.sub_txt}>
                <NumberFormat
                  value={_parcelData.landval}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={value => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Market Value</Text>
              <Text style={screenStyles.sub_txt}>
                <NumberFormat
                  value={_parcelData.parval}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={value => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Last Sale Date</Text>
              <Text style={screenStyles.sub_txt}>{_parcelData.saledate}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Is Vacant?</Text>
              <Text style={screenStyles.sub_txt}>
                {_parcelData.usps_vacancy}
              </Text>
            </View>

            <KeyboardAvoidingView
              style={screenStyles.data_row}
              behavior="padding">
              <Text style={screenStyles.head_txt}>Notes</Text>
              <TextInput
                {...commonInputProps}
                placeholder="Notes"
                onSubmitEditing={this._saveNotes.bind(this)}
                onChangeText={text => this._updateNotes(text)}
                multiline={true}
                blurOnSubmit={true}
                value={this.notes}
                underlineColorAndroid="transparent"
                returnKeyType="done"
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={screenStyles.viewcontainer}>
          <View style={{backgroundColor: css.colors.lightbackground}}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                width: BannerWidth,
                alignItems: 'center',
                marginTop:
                  Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
              }}>
              <TouchableOpacity onPress={() => this._saveParcel()}>
                <Image
                  style={screenStyles.top_icon}
                  source={require('../../Assets/Images/ic_bookmark.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <Text
                style={{
                  flex: 1,
                  color: css.colors.white,
                  fontSize: scale(20),
                  textAlign: 'center',
                }}
              />

              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                <Image
                  style={screenStyles.top_icon}
                  source={require('../../Assets/Images/ic_cancel.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <Text style={screenStyles.title_address}>No Data Found</Text>
          </View>
        </SafeAreaView>
      );
    }
  }

  renderCherreParcelDetails() {
    const commonInputProps = {
      style: [
        screenStyles.input,
        screenStyles.sub_txt,
        css.baseStyles.greyFont,
      ],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none',
    };
    if (this.cherreParcelData) {
      const _parcelData = this.cherreParcelData;

      const AnimateHeaderBackgroundColor = this.AnimatedHeaderValue.interpolate(
        {
          inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
          outputRange: ['#009688', '#00BCD4'],
          extrapolate: 'clamp',
        },
      );

      const AnimateHeaderHeight = this.AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
        outputRange: [Header_Maximum_Height, Header_Minimum_Height],
        extrapolate: 'clamp',
      });

      const images = [
        `https://maps.googleapis.com/maps/api/streetview?key=AIzaSyDv7GjiEXfaV-oWTZBL5gJcwniQTBElk0I&size=600x600&location=${
          _parcelData.one_line_address
        }`,
      ];

      return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            style={[screenStyles.viewcontainer]}
            stickyHeaderIndices={[1]}
            scrollEventThrottle={16}
            // contentContainerStyle={{paddingTop: Header_Maximum_Height}}
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {y: this.AnimatedHeaderValue}}},
            ])}>
            <StatusBar
              barStyle="dark-content"
              hidden={false}
              backgroundColor={css.colors.theme}
              translucent={false}
            />
            <View>
              <Animated.View
                style={[
                  {
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: AnimateHeaderHeight,
                    backgroundColor: AnimateHeaderBackgroundColor,
                  },
                ]}>
                <View style={{overflow: 'hidden'}}>
                  {/* Image Carousel */}
                  <Carousel
                    autoplay
                    autoplayTimeout={5000}
                    loop
                    index={0}
                    pageIndicatorContainerStyle={{alignSelf: 'flex-end'}}>
                    {images.map((image, index) => (
                      <ImageOverlay
                        source={{uri: image}}
                        containerStyle={{
                          height: BannerHeight,
                          width: BannerWidth,
                        }}
                        contentPosition={'center'}
                        overlayAlpha={0.3}
                        key={index}
                      />
                    ))}
                  </Carousel>

                  {/* Header View */}
                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      height: 50,
                      width: BannerWidth,
                      alignItems: 'center',
                      marginTop:
                        Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
                    }}>
                    <Text
                      style={{
                        flex: 1,
                        color: css.colors.white,
                        fontSize: scale(20),
                        textAlign: 'center',
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => this.props.navigation.pop()}>
                      <Image
                        style={screenStyles.top_icon}
                        source={require('../../Assets/Images/ic_cancel.png')}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* <View
                    style={{
                      flex: 1,
                      position: 'absolute',
                      bottom: 10,
                      height: undefined,
                      alignSelf: 'center',
                    }}> */}
                  <Text
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      position: 'absolute',
                      color: css.colors.white,
                      fontSize: scale(20),
                      paddingHorizontal: 15,
                      borderRadius: 15,
                      fontSize: 15,
                      paddingTop: 4,
                      paddingBottom: 4,
                      bottom: 30,
                      backgroundColor: 'rgba(52, 52, 52, 1)',
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}>
                    AAAAAA
                  </Text>
                  {/* </View> */}
                </View>
              </Animated.View>

              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: 'white',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  paddingTop: 20,
                  marginTop: -20,
                }}>
                <View style={{flex: 1}}>
                  <Text style={screenStyles.title_address}>
                    {_parcelData.house_number} {_parcelData.street_direction}{' '}
                    {_parcelData.street_name} {_parcelData.street_suffix}
                  </Text>
                  <Text style={screenStyles.title_city}>
                    {_parcelData.city}, {_parcelData.state} {_parcelData.zip}
                  </Text>
                  <Text
                    style={screenStyles.title_msg}
                    onPress={() => this._submitFeedback(_parcelData)}>
                    Tell us if something looks wrong&nbsp;
                    <FontAwesome
                      raised
                      size={13}
                      name="share-square-o"
                      color="#ff6700"
                    />
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.showShareActionSheet(_parcelData)}>
                    <Icon
                      name="share-apple"
                      size={35}
                      style={screenStyles.menu_icon}
                    />
                  </TouchableOpacity>
                  {this.state.isSavedParcel ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this._saveParcel()}>
                      <FontAwesome
                        name="star"
                        size={30}
                        style={screenStyles.menu_icon}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this._saveParcel()}>
                      <FontAwesome
                        name="star-o"
                        size={30}
                        style={screenStyles.menu_icon}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            {/* Tab Screen View */}
            <TabScreen
              parcelData={_parcelData}
              isLoggedIn={this.props.termSheetStore.isAuthenticated}
              subscribeToPro={() => this.subscribeToPro()}
              updateNotes={txt => this._updateNotes(txt)}
              saveNotes={() => this._saveNotes()}
              notes={this.notes}
            />
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 20,
            borderTopWidth: 0,
            marginTop: 10,
            marginBottom: 10,
            textAlign: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    }
  }

  render() {
    //const parcelData = this.props.navigation.getParam('parcelData', {});
    //let _parcelData = parcelData;
    return <Fragment>{this.renderCherreParcelDetails()}</Fragment>;
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
  loc_icon: {
    height: scale(20),
    width: scale(20),
    tintColor: css.colors.blue,
  },
  top_icon: {
    margin: 10,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.white,
  },
  overlayText: {
    fontWeight: 'bold',
    color: css.colors.white,
    fontSize: scale(15),
    fontFamily: css.Fonts.openSans,
  },
  overlay_icon: {
    marginTop: 10,
    height: scale(80),
    width: scale(80),
    tintColor: css.colors.theme,
  },
  menu_icon: {
    marginTop: 10,
    height: scale(30),
    width: scale(40),
    color: '#ff6700',
  },
  menu_icon2: {
    marginTop: 12,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
  container_row: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 3,
  },
  row_image_container: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  row_image: {
    height: 180,
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  row_over_style: {
    backgroundColor: css.colors.green,
    borderRadius: 20,
    paddingHorizontal: 15,
    left: 10,
    bottom: 10,
    position: 'absolute',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row_over_txt: {
    fontWeight: '700',
    color: css.colors.white,
    fontSize: scale(16),
    fontFamily: css.Fonts.openSans,
  },
  container_row_text: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  title_row: {
    marginTop: 10,
    marginHorizontal: 15,
    fontSize: scale(14),
    fontFamily: css.Fonts.openSans,
    color: css.colors.blue,
  },
  title_address: {
    marginHorizontal: 15,
    fontSize: scale(18),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
  },
  title_city: {
    marginHorizontal: 15,
    fontSize: scale(16),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  title_msg: {
    marginHorizontal: 15,
    fontSize: scale(10),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
    marginBottom: 10,
    marginTop: 5,
  },
  linkStyle: {
    marginLeft: 10,
    color: css.colors.theme,
    textDecorationLine: 'underline',
    fontSize: scale(18),
  },
  title_head: {
    fontSize: scale(15),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
  },
  title_base: {
    fontSize: scale(16),
    color: css.colors.black,
    fontWeight: '700',
    fontFamily: css.Fonts.openSans,
  },
});
