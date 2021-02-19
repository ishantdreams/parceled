import Geolocation from '@react-native-community/geolocation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import ImageOverlay from 'react-native-image-overlay';
import RatingRequestor from 'react-native-rating-requestor';
import Share from 'react-native-share';
import {SafeAreaView} from 'react-navigation';
import NumberFormat from 'react-number-format';
import * as css from '../../Assets/Styles';
import Loader from '../../Components/Loader';
import {scale} from '../../Services/ResponsiveScreen';
import autobind from 'autobind-decorator';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';

var parseAddress = require('parse-address');
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoicm9nZXNtaXRoIiwiYSI6ImNqdHB2OHg5azAwbzA0M3BlZ3dxanZ2NXcifQ.PBWyfzuqPZMB6EaL6mQdvQ',
);

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
  'themeStore',
)
@observer
@autobind
export default class ParcelDetails extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  _isMounted = true;
  mapView = null;
  mapLoaded = false;
  cameraView = null;

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
      isNoteAvailable: false,
      parcelTileData: null,
      latitude: 37.78825,
      longitude: -122.4324,
      error: null,
      isDark: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this._initialCall();
    });

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

    console.log('parcel data is following:- @@@@@@@ ', parcelData);
    this.setState({
      parcelData: parcelData,
    });
    this.loading = true;

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

  _openNoteScreen = () => {
    console.log(
      'parcel data is following:- ============= ',
      this.state.parcelData,
    );
    this.props.navigation.navigate('NotesView', {
      returnFromNote: this.returnFromNote.bind(this),
      notes: this.notes,
    });
  };

  _openDataDetailScreen = screenType => {
    console.log(
      'parcel data is following:- ============= ',
      this.cherreParcelData,
    );
    this.props.navigation.navigate(screenType, {
      parcelData: this.cherreParcelData,
    });
  };

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

  returnFromNote(notes) {
    console.log('update note in returnFromNote', notes);
    if (notes !== undefined && notes !== null && notes.length > 0) {
      this.notes = notes;
      this.setState({isNoteAvailable: true});
      this._saveNotes();
    } else {
      this.notes = '';
      this.setState({isNoteAvailable: false});
      this._saveNotes();
    }
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

  _onMapLoaded() {
    if (!this.mapLoaded) {
      this.goToCurrentLocation();
    }
    this.mapLoaded = true;
    this.props.parcelStore.loadLovelandTiles(LOVELAND_API_TOKEN).then(data => {
      if (this._isMounted) {
        this.setState({
          parcelTileData: data,
        });
      }
    });
  }

  goToCurrentLocation() {
    //console.log('goToCurrentLocation');
    Geolocation.getCurrentPosition(
      position => {
        this.goToLocation(position.coords.latitude, position.coords.longitude);
      },
      error => {
        if (this._isMounted) {
          this.setState({error: error.message});
        }
      },
      {enableHighAccuracy: false, timeout: 200000, maximumAge: 1000},
    );
  }

  goToLocation(lat, lng, fromPress = false) {
    //console.log('goToLocation');
    if (this._isMounted) {
      this.setState({
        latitude: lat,
        longitude: lng,
        error: null,
      });
    }
    /*this.mapView.animateToRegion(
     {
       latitude: lat,
       longitude: lng,
       latitudeDelta: 0.00922,
       longitudeDelta: 0.00421,
     }
    )*/
    this.cameraView.setCamera({
      centerCoordinate: [lng, lat],
      zoomLevel: 16,
    });
    // this.findFeature(fromPress);
    //this.mapPress({latitude: lat, longitude: lng});
  }

  renderOwners(tax_assessor_owners) {
    const screenStyles = StyleSheet.create({
      title_value: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontWeight: '400',
        flex: 0.6,
        marginLeft: 4,
      },
      title_type: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: '#7F7F7F',
        flex: 0.4,
        marginRight: 4,
      },
    });

    if (tax_assessor_owners && tax_assessor_owners.length > 0) {
      return tax_assessor_owners.map((item, idx) => {
        return (
          <View key={idx}>
            <View style={{marginTop: 15}}>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={screenStyles.title_type}>Owner</Text>
                <Text style={screenStyles.title_value}>{item.owner_name}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginVertical: 8,
                }}>
                <Text style={screenStyles.title_type}>Owner Type</Text>
                <Text style={screenStyles.title_value}>{item.owner_type}</Text>
              </View>
            </View>
          </View>
        );
      });
    } else {
      return null;
    }
  }

  renderSchoolData(schools) {
    const screenStyles = StyleSheet.create({
      title_value: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontWeight: '400',
        flex: 0.6,
        marginLeft: 4,
      },
      title_type: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: '#7F7F7F',
        flex: 0.4,
        marginRight: 4,
      },
    });

    if (schools && schools.length > 0) {
      return schools.map((item, index) => {
        return (
          <View
            style={{
              marginTop: 15,
            }}
            key={index}>
            {index == 0 ? (
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={screenStyles.title_type}>School District</Text>
                <Text style={screenStyles.title_value}>
                  {item.usa_school ? item.usa_school.district_name : ''}
                </Text>
              </View>
            ) : (
              <Fragment />
            )}
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                marginVertical: 8,
              }}>
              <Text style={screenStyles.title_type}>School Name</Text>
              <Text style={screenStyles.title_value}>
                {item.usa_school ? item.usa_school.institution_name : ''}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
              }}>
              <Text style={screenStyles.title_type}>Educational Climate</Text>
              <Text style={screenStyles.title_value}>
                {item.usa_school
                  ? item.usa_school.educational_climate_index
                  : ''}
              </Text>
            </View>
          </View>
        );
      });
    } else {
      return null;
    }
  }

  // renderParcelDetails() {
  //   const commonInputProps = {
  //     style: [
  //       screenStyles.input,
  //       screenStyles.sub_txt,
  //       css.baseStyles.greyFont,
  //     ],
  //     underlineColorAndroid: 'transparent',
  //     placeholderTextColor: '#AAA',
  //     autoCorrect: false,
  //     autoCapitalize: 'none',
  //   };
  //   if (this.state.parcelData) {
  //     const _parcelData = this.state.parcelData.properties.fields;
  //     const addressObj = parseAddress.parseLocation(_parcelData.address);

  //     return (
  //       <SafeAreaView style={screenStyles.viewcontainer}>
  //         <View style={{backgroundColor: css.colors.lightbackground}}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               height: 50,
  //               width: BannerWidth,
  //               alignItems: 'center',
  //               marginTop:
  //                 Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
  //             }}>
  //             <TouchableOpacity onPress={() => this._saveParcel()}>
  //               <Image
  //                 style={screenStyles.top_icon}
  //                 source={require('../../Assets/Images/ic_bookmark.png')}
  //                 resizeMode="contain"
  //               />
  //             </TouchableOpacity>

  //             <Text
  //               style={{
  //                 flex: 1,
  //                 color: css.colors.white,
  //                 fontSize: scale(20),
  //                 textAlign: 'center',
  //               }}
  //             />

  //             <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
  //               <Image
  //                 style={screenStyles.top_icon}
  //                 source={require('../../Assets/Images/ic_cancel.png')}
  //                 resizeMode="contain"
  //               />
  //             </TouchableOpacity>
  //           </View>

  //           <Text style={screenStyles.title_address}>
  //             {addressObj.number} {addressObj.prefix} {addressObj.street}
  //           </Text>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               marginStart: 10,
  //               alignItems: 'center',
  //               marginBottom: 10,
  //             }}>
  //             <Image
  //               style={screenStyles.loc_icon}
  //               source={require('../../Assets/Images/ic_location.png')}
  //               resizeMode="contain"
  //               tintColor={css.colors.blue}
  //             />
  //             <Text style={screenStyles.title_city}>
  //               {_parcelData.scity}, {_parcelData.szip}
  //             </Text>
  //           </View>
  //           {/* <Text style={styles.title_city}>{this.state.city}</Text> */}
  //         </View>
  //         <Loader loading={this.loading} />
  //         <ScrollView
  //           style={screenStyles.viewcontainer}
  //           bounces={false}
  //           showsVerticalScrollIndicator={false}
  //           //stickyHeaderIndices={[2]}
  //           overScrollMode="never">
  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Owner</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.owner}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Address</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.address}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>County</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               {_parcelData.sourceagent}
  //             </Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Tax #</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.parno}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Owner Mailing Address</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               {_parcelData.mailadd} {_parcelData.mail_city},{' '}
  //               {_parcelData.mail_zip}
  //             </Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Property Type</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               {_parcelData.structstyle}
  //             </Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Year Built</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.yearbuilt}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}># Units</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.structno}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Lot Size</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.ll_gisacre}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Assessed Land Value</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               <NumberFormat
  //                 value={_parcelData.landval}
  //                 displayType={'text'}
  //                 thousandSeparator={true}
  //                 prefix={'$'}
  //                 renderText={value => <Text>{value}</Text>}
  //               />
  //             </Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Market Value</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               <NumberFormat
  //                 value={_parcelData.parval}
  //                 displayType={'text'}
  //                 thousandSeparator={true}
  //                 prefix={'$'}
  //                 renderText={value => <Text>{value}</Text>}
  //               />
  //             </Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Last Sale Date</Text>
  //             <Text style={screenStyles.sub_txt}>{_parcelData.saledate}</Text>
  //           </View>

  //           <View style={screenStyles.data_row}>
  //             <Text style={screenStyles.head_txt}>Is Vacant?</Text>
  //             <Text style={screenStyles.sub_txt}>
  //               {_parcelData.usps_vacancy}
  //             </Text>
  //           </View>

  //           <KeyboardAvoidingView
  //             style={screenStyles.data_row}
  //             behavior="padding">
  //             <Text style={screenStyles.head_txt}>Notes</Text>
  //             <TextInput
  //               {...commonInputProps}
  //               placeholder="Notes"
  //               onSubmitEditing={this._saveNotes.bind(this)}
  //               onChangeText={text => this._updateNotes(text)}
  //               multiline={true}
  //               blurOnSubmit={true}
  //               value={this.notes}
  //               underlineColorAndroid="transparent"
  //               returnKeyType="done"
  //             />
  //           </KeyboardAvoidingView>
  //         </ScrollView>
  //       </SafeAreaView>
  //     );
  //   } else {
  //     return (
  //       <SafeAreaView style={screenStyles.viewcontainer}>
  //         <View style={{backgroundColor: css.colors.lightbackground}}>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               height: 50,
  //               width: BannerWidth,
  //               alignItems: 'center',
  //               marginTop:
  //                 Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
  //             }}>
  //             <TouchableOpacity onPress={() => this._saveParcel()}>
  //               <Image
  //                 style={screenStyles.top_icon}
  //                 source={require('../../Assets/Images/ic_bookmark.png')}
  //                 resizeMode="contain"
  //               />
  //             </TouchableOpacity>

  //             <Text
  //               style={{
  //                 flex: 1,
  //                 color: css.colors.white,
  //                 fontSize: scale(20),
  //                 textAlign: 'center',
  //               }}
  //             />

  //             <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
  //               <Image
  //                 style={screenStyles.top_icon}
  //                 source={require('../../Assets/Images/ic_cancel.png')}
  //                 resizeMode="contain"
  //               />
  //             </TouchableOpacity>
  //           </View>
  //           <Text style={screenStyles.title_address}>No Data Found</Text>
  //         </View>
  //       </SafeAreaView>
  //     );
  //   }
  // }

  renderCherreParcelDetails() {
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
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
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
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
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
      title_property_type: {
        marginHorizontal: 15,
        fontSize: scale(16),
        fontWeight: '400',
        marginBottom: 12,
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      },
      title_address: {
        marginHorizontal: 15,
        fontSize: scale(17),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
      },
      title_city: {
        marginHorizontal: 15,
        fontSize: scale(13),
        marginTop: 2,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      title_msg: {
        marginHorizontal: 15,
        fontSize: scale(10),
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
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
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontFamily: css.Fonts.openSans,
      },
      title_base: {
        fontSize: scale(16),
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontWeight: '700',
        fontFamily: css.Fonts.openSans,
      },
      title_button: {
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: 'tomato',
        marginLeft: 8,
      },
      title_type_header: {
        fontSize: scale(16),
        fontWeight: '600',
        fontFamily: css.Fonts.openSans,
        color: 'tomato',
        marginLeft: 8,
      },
      title_type: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: '#7F7F7F',
        flex: 0.4,
        marginRight: 4,
      },
      title_value: {
        fontSize: scale(15),
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontWeight: '400',
        flex: 0.6,
        marginLeft: 4,
      },
      header_text_view: {
        flex: 1,
        color: css.colors.white,
        fontSize: scale(20),
        textAlign: 'center',
      },
      headerView: {
        flexDirection: 'row',
        position: 'absolute',
        height: 50,
        width: BannerWidth,
        alignItems: 'center',
        marginTop: Platform.OS === 'ios' ? (height >= 812 ? 34 : 10) : 0,
      },
      catTitle: {
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
      },
      childRoot: {
        flexDirection: 'row',
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingTop: 20,
        marginTop: -20,
      },
      share_root: {
        flexDirection: 'row',
        marginTop: 12,
        marginHorizontal: 15,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
      },
      shareBtn: {
        flex: 1,
        marginRight: 6,
        borderColor: 'tomato',
        borderWidth: 1,
        borderRadius: 10,
        height: 40,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
      },
      key_detail: {
        textAlign: 'center',
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        marginLeft: 0,
      },
      map_text: {
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        fontSize: scale(14),
      },
    });

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

      const {parcelData} = this.props;

      console.log('parcel data is following:- ', _parcelData);

      return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView
            style={[screenStyles.viewcontainer]}
            // stickyHeaderIndices={[1]}
            // scrollEventThrottle={16}
            // contentContainerStyle={{paddingTop: Header_Maximum_Height}}
            // onScroll={Animated.event([
            //   {nativeEvent: {contentOffset: {y: this.AnimatedHeaderValue}}},
            // ])}
          >
            <StatusBar
              barStyle={this.state.isDark ? 'light-content' : 'dark-content'}
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
                  <View style={screenStyles.headerView}>
                    <Text style={screenStyles.header_text_view} />

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
                  <Text style={screenStyles.catTitle}>Street View</Text>
                  {/* </View> */}
                </View>
              </Animated.View>

              <View style={screenStyles.childRoot}>
                <View style={{flex: 1}}>
                  <Text style={screenStyles.title_property_type}>
                    {_parcelData.city} {' . '} {_parcelData.zip}
                  </Text>
                  <Text style={screenStyles.title_address}>
                    {_parcelData.house_number} {_parcelData.street_direction}{' '}
                    {_parcelData.street_name} {_parcelData.street_suffix}
                  </Text>
                  <Text style={screenStyles.title_city}>
                    {_parcelData.city}, {_parcelData.state} {_parcelData.zip}
                  </Text>
                  <View style={screenStyles.share_root}>
                    <TouchableOpacity
                      style={screenStyles.shareBtn}
                      activeOpacity={0.7}
                      onPress={() => this.showShareActionSheet(_parcelData)}>
                      <Image
                        resizeMode="contain"
                        source={require('../../Assets/Images/ic_share.png')}
                        style={{width: 25, height: 25, tintColor: 'tomato'}}
                      />
                      <Text
                        style={[
                          screenStyles.title_button,
                          {textAlign: 'center'},
                        ]}>
                        Share
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={screenStyles.shareBtn}
                      activeOpacity={0.7}
                      onPress={() => this._saveParcel()}>
                      <Image
                        resizeMode="contain"
                        source={
                          this.state.isSavedParcel
                            ? require('../../Assets/Images/like.png')
                            : require('../../Assets/Images/vector.png')
                        }
                        style={{width: 25, height: 25, tintColor: 'tomato'}}
                      />
                      <Text
                        style={[
                          screenStyles.title_button,
                          {textAlign: 'center'},
                        ]}>
                        Save
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.isNoteAvailable === false ? (
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        marginHorizontal: 15,
                        marginBottom: 16,
                        marginTop: 12,
                      }}
                      activeOpacity={0.7}
                      onPress={() => {
                        this._openNoteScreen();
                      }}>
                      <Text
                        style={[screenStyles.title_button, {marginLeft: 0}]}>
                        Add Notes
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={{marginHorizontal: 15, marginVertical: 12}}>
                      <Text
                        style={{
                          fontSize: scale(16),
                          fontFamily: css.Fonts.openSans,
                          color: '#3b3b3b',
                        }}>
                        {this.notes}
                      </Text>
                      <TouchableOpacity
                        style={{
                          justifyContent: 'center',
                          marginTop: 12,
                        }}
                        activeOpacity={0.7}
                        onPress={() => {
                          this._openNoteScreen();
                        }}>
                        <Text
                          style={[screenStyles.title_button, {marginLeft: 0}]}>
                          Edit Notes
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <MapboxGL.MapView
                    ref={ref => (this.mapView = ref)}
                    style={{
                      height: 80,
                      flex: 1,
                      marginHorizontal: 15,
                      overflow: 'hidden',
                      borderRadius: 15,
                      marginBottom: 15,
                    }}
                    styleURL={this.state.mapType}
                    showUserLocation={true}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    logoEnabled={false}
                    onRegionDidChange={this.onRegionDidChange}
                    regionDidChangeDebounceTime={0}
                    //onPress={evt => this.onPressMap(evt)}
                    onDidFinishLoadingMap={() => this._onMapLoaded()}>
                    <MapboxGL.Camera
                      ref={ref => (this.cameraView = ref)}
                      zoomLevel={16}
                      animationMode={'flyTo'}
                      centerCoordinate={[
                        this.state.longitude,
                        this.state.latitude,
                      ]}
                    />
                    {/* {this.renderTileVectors()}
                    {this.renderAnnotations()} */}

                    <MapboxGL.UserLocation visible={true} />
                  </MapboxGL.MapView>

                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 15,
                    }}
                    activeOpacity={0.7}>
                    <Text style={screenStyles.map_text}>Map view</Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      marginVertical: 16,
                      borderBottomWidth: 1,
                      marginHorizontal: 15,
                      borderBottomColor: '#D3D3D3',
                    }}
                  />

                  <View
                    style={{
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                      paddingBottom: 16,
                      borderBottomColor: '#D3D3D3',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          screenStyles.title_type_header,
                          screenStyles.key_detail,
                        ]}>
                        Owner
                      </Text>
                    </View>
                    <View>
                      {this.renderOwners(_parcelData.tax_assessor_owner)}

                      <View
                        style={{
                          flexDirection: 'row',
                          flex: 1,
                        }}>
                        <Text style={screenStyles.title_type}>
                          Owner Address
                        </Text>
                        <Text style={screenStyles.title_value}>
                          {_parcelData.one_line_address}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      marginHorizontal: 15,
                      marginTop: 16,
                      borderBottomWidth: 1,
                      paddingBottom: 16,
                      borderBottomColor: '#D3D3D3',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          screenStyles.title_type_header,
                          screenStyles.key_detail,
                        ]}>
                        Key Detail
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this._openDataDetailScreen('ParcelKeyDetail');
                          // this.setState({
                          //   isShowingKeyDetail: !this.state.isShowingKeyDetail,
                          // });
                        }}>
                        <Image
                          resizeMode="contain"
                          source={require('../../Assets/Images/arrow.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {/* {this.state.isShowingKeyDetail && (
                      <View style={{marginTop: 15}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                          <Text style={screenStyles.title_type}>
                            Property type
                          </Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.property_group_type}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>Country</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.situs_county}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>APN</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.assessor_parcel_number_raw}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>Fips Code</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.fips_code}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Year Build
                          </Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.year_built}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>#Units</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.units_count}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>Lot Size</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.lot_size_acre}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginTop: 8,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Building Sq. Ft.
                          </Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.building_sq_ft}
                          </Text>
                        </View>
                      </View>
                    )} */}
                  </View>

                  <View
                    style={{
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                      paddingBottom: 16,
                      marginTop: 16,
                      borderBottomColor: '#D3D3D3',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          screenStyles.title_type_header,
                          screenStyles.key_detail,
                        ]}>
                        Taxes {'&'} value
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this._openDataDetailScreen('ParcelTaxesView');
                          // this.setState({
                          //   isShowingTaxDetail: !this.state.isShowingTaxDetail,
                          // });
                        }}>
                        <Image
                          resizeMode="contain"
                          source={require('../../Assets/Images/arrow.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {/* {this.state.isShowingTaxDetail && (
                      <View style={{marginTop: 15}}>
                        <View style={{flexDirection: 'row', flex: 1}}>
                          <Text style={screenStyles.title_type}>Tax Bill</Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.tax_bill_amount}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />{' '}
                            ({_parcelData.assessed_tax_year})
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Assessed Land Value
                          </Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.assessed_value_land}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Assessed Total Value
                          </Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.assessed_value_total}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Market Land Value
                          </Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.the_value_land}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Market Total Value
                          </Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.market_value_total}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginVertical: 8,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Last Sale Amount
                          </Text>
                          <Text style={screenStyles.title_value}>
                            <NumberFormat
                              value={_parcelData.last_sale_amount}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              renderText={value => <Text>{value}</Text>}
                            />
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                          }}>
                          <Text style={screenStyles.title_type}>
                            Last Sale Date
                          </Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.last_sale_date}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            flex: 1,
                            marginTop: 8,
                          }}>
                          <Text style={screenStyles.title_type}>Zoning</Text>
                          <Text style={screenStyles.title_value}>
                            {_parcelData.zone_code}
                          </Text>
                        </View>
                      </View>
                    )} */}
                  </View>

                  <View
                    style={{
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                      paddingBottom: 16,
                      marginTop: 16,
                      borderBottomColor: '#D3D3D3',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={[
                          screenStyles.title_type_header,
                          screenStyles.key_detail,
                        ]}>
                        School
                      </Text>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                          this._openDataDetailScreen('ParcelSchoolDetailView');
                          // this.setState({
                          //   isShowingSchoolDetail: !this.state
                          //     .isShowingSchoolDetail,
                          // });
                        }}>
                        <Image
                          resizeMode="contain"
                          source={require('../../Assets/Images/arrow.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {/* {this.state.isShowingSchoolDetail &&
                      this.renderSchoolData(
                        _parcelData.tax_assessor_usa_school__bridge,
                      )} */}
                  </View>
                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 15,
                      marginVertical: 16,
                      alignSelf: 'center',
                    }}
                    activeOpacity={0.7}>
                    <Text
                      style={{
                        fontSize: scale(15),
                        fontWeight: '400',
                        fontFamily: css.Fonts.openSans,
                        marginLeft: 0,
                        color: 'tomato',
                      }}>
                      Tell us if something looks wrong
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      borderBottomColor: '#D3D3D3',
                      marginHorizontal: 15,
                      borderBottomWidth: 1,
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      marginVertical: 16,
                      justifyContent: 'center',
                      marginHorizontal: 15,
                      alignSelf: 'center',
                    }}
                    activeOpacity={0.7}>
                    <Text
                      style={{
                        fontSize: scale(15),
                        fontWeight: '400',
                        fontFamily: css.Fonts.openSans,
                        marginLeft: 0,
                        color: 'tomato',
                      }}>
                      Report this listing
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Tab Screen View */}
            {/* <TabScreen
              parcelData={_parcelData}
              isLoggedIn={this.props.termSheetStore.isAuthenticated}
              subscribeToPro={() => this.subscribeToPro()}
              updateNotes={txt => this._updateNotes(txt)}
              saveNotes={() => this._saveNotes()}
              notes={this.notes}
            /> */}
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
