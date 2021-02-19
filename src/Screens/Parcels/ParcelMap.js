import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  Dimensions,
  Animated,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import {Card, ListItem, Button, SearchBar} from 'react-native-elements';

import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import HeaderWidget from '../../Components/HeaderWidget';
import {SafeAreaView, DrawerActions} from 'react-navigation';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Geolocation from '@react-native-community/geolocation';

import {LocationItem, BottomSheet, SettingsSheet} from '../../Components/';
import * as css from '../../Assets/Styles';
import images from '../../Assets/Images';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {scale} from '../../Services/ResponsiveScreen';

import MapboxGL from '@react-native-mapbox-gl/maps';
MapboxGL.setAccessToken(
  'pk.eyJ1Ijoicm9nZXNtaXRoIiwiYSI6ImNqdHB2OHg5azAwbzA0M3BlZ3dxanZ2NXcifQ.PBWyfzuqPZMB6EaL6mQdvQ',
);
import {GoogleAutoComplete} from 'react-native-google-autocomplete';
import RawBottomSheet from '../../Components/RawBottomSheet';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import Login from '../Auth/Login';

const {height} = Dimensions.get('window');
//const LOVELAND_API_TOKEN = 'yvByetT_qAZ2UGHgX7LNBvxtZoFZhpU3-PTs-kwbfHQkxJR3aLFmUwi8DZmzKvBJ';
const LOVELAND_API_TOKEN =
  'e6zfYjvSq-mDRynqYPsh1VRUwACt6gXsbhXj4ygCSu6BqX854nCFG1ufPBRdxYcP';

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

@inject(
  'termSheetStore',
  'parcelStore',
  'userStore',
  'analyticsStore',
  'themeStore',
)
@autobind
@observer
export default class ParcelMap extends Component {
  /*static navigationOptions = ({navigation}) => ({
    title: '',
    headerStyle: {
      backgroundColor: '#ff6700',
    },
    headerTintColor: '#fff',
    headerLeft: NavIcons.settingsButton(navigation.toggleDrawer),
    headerRight: NavIcons.rightButton(navigation.toggleDrawer)
  });*/
  // static navigationOptions = ({navigation}) => {
  //   //return header with Custom View which will replace the original header
  //   const {params = {}} = navigation.state;
  //   return {
  //     header: () => (
  //       <HeaderWidget
  //         onPressMap={() => navigation.navigate('Parcels')}
  //         onPressWatchlist={() => navigation.navigate('WatchList')}
  //         onPressDeals={() => navigation.navigate('Deals')}
  //         onPressLogin={() => navigation.navigate('Auth', {screen: 'Login'})}
  //         onPressLogout={() => params.promptForLogout()}
  //         isLoggedIn={params.isLoggedIn}
  //         activeScreen="parcels"
  //       />
  //     ),
  //   };
  // };

  static navigationOptions = {
    header: null,
  };

  static defaultProps = {
    draggableRange: {top: height + 100 - 64, bottom: 100},
  };

  _isMounted = true;
  mapView = null;
  mapLoaded = false;
  cameraView = null;
  _draggedValue = new Animated.Value(100);
  @observable selectedParcel = {
    type: '',
    geometry: {},
    properties: {},
  };
  @observable selectedData = [];
  @observable searchInputVisible = true;
  @observable parceledData = null;

  constructor(props) {
    super(props);
    this.state = {
      latitude: 37.78825,
      longitude: -122.4324,
      error: null,
      loadedParcel: false,
      loadedParcels: false,
      markers: [],
      showSettings: false,
      mapType:
        this.props.userStore.userSettings.mapType ||
        'mapbox://styles/mapbox/streets-v11',
      geoLayer: {},
      parcelTileData: null,
      showParcelTiles: true,
      isDark: false,
      countApi: 0,
      modalVisible: false,
    };
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.setState({countApi: 0});
      console.log('count - ', this.state.countApi)
      this._initialCall();
    });

    //console.log('componentDidMount');
    this._isMounted = true;
    //console.log(this._isMounted);

    MapboxGL.setTelemetryEnabled(false);
    //this.goToCurrentLocation()
    this.props.navigation.setParams({
      promptForLogout: this._promptForLogout,
      isLoggedIn: this.props.termSheetStore.isAuthenticated,
    });
    this.props.analyticsStore.screen('ParcelMap');
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

  componentWillUnmount() {
    //console.log('componentWillUnmount');
    //this._isMounted = false;
  }

  getCrosshairsColor() {
    if (this.state.mapType.includes('satellite')) {
      return '#ff6700';
    } else {
      return '#ff6700';
    }
  }

  _promptForLogout() {
    this.props.termSheetStore.logout().then(() => {
      this.props.navigation.setParams({
        promptForLogout: this._promptForLogout,
        isLoggedIn: this.props.termSheetStore.isAuthenticated,
      });
    });
  }

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

  toggleShowSettings() {
    this.setState({
      showSettings: !this.state.showSettings,
    });
  }

  updateMapType(mapType) {
    this.setState({
      mapType: mapType,
    });
    this.props.userStore.userSettings.mapType = mapType;
    this.props.userStore.persistUserSettings();
  }

  async showParcelView(parcelData) {
    console.log('waiying........');
    //console.log(this.parcelData)
    const center = await this.mapView.getCenter();

    //this.props.tsStore.lookupParcel({address: parcelData.address, latitude: center[1], longitude: center[0]}).then((data) => {
    //this.parcelData = data;
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    //this.props.tsStore.addToRecentlyViewed(this.parcelData)
    this.props.navigation.navigate('ParcelDetails', {
      parcelData: parcelData,
      parceledData: this.parceledData,
      latitude: center[1],
      longitude: center[0],
    });
    //});
    /*this.props.tsStore.loadLovelandParcel(LOVELAND_API_TOKEN, parcelData.path).then((data) => {
      if(data){
        let pData = data.properties.fields
        ReactNativeHapticFeedback.trigger("notificationSuccess", hapticOptions);
        this.props.tsStore.addToRecentlyViewed(pData)
        this.props.navigation.navigate('ParcelView', {parcelData: pData});
      }
    });*/
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

  onPressMap(e) {
    this.goToLocation(
      e.geometry.coordinates[1],
      e.geometry.coordinates[0],
      false,
    );
  }

  showLayersView() {
    this.props.navigation.navigate('MapLayersView');
  }

  returnDataFromLocationSearch(lat, lng, name) {
    this.setState({latitude: lat, longitude: lng});
    console.log('latitude is ', lat);
    console.log('longitude is ', lng);
    console.log('name is ', name);
    this.goToLocation(lat, lng, false);
    //this.setState({id: id, name: name});
  }

  showFeedbackView() {
    let url = `https://roger050099.typeform.com/to/yaNNSy?user_token=${
      this.props.userStore.parceledUser.token
    }`;
    this.props.navigation.navigate('FeedbackView', {
      url: url,
      title: 'Parceled Feedback',
    });
  }

  showInputLocationView() {
    this.props.navigation.navigate('LocationSearchView', {
      returnData: this.returnDataFromLocationSearch.bind(this),
    });
  }

  _toggleSearch() {
    this.searchInputVisible = !this.searchInputVisible;
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
    this.findFeature(fromPress);
    //this.mapPress({latitude: lat, longitude: lng});
  }

  async onRegionDidChange() {
    const zoom = await this.mapView.getZoom();
    if (zoom >= 14 && !this.state.showParcelTiles) {
      this.setState({
        showParcelTiles: true,
      });
    } else if (zoom < 14 && this.state.showParcelTiles) {
      this.setState({
        showParcelTiles: false,
      });
    }
    if (zoom >= 14) {
      //console.log('finding............');
      // this.setState({
      //   loadedParcel: false,
      //   loadedParcels:false,
      // });

      this.findFeature();
    }
  }

  async findFeature(fromPress = false) {
    const center = await this.mapView.getCenter();
    const pointInView = await this.mapView.getPointInView(center);
    //const featureCollection = await this.mapView.queryRenderedFeaturesAtPoint(pointInView, null, ['parcelShapeSourceLines'])
    //const featureCollection = await this.mapView.queryRenderedFeaturesAtPoint(pointInView, null, ['parcel-boundaries', 'filtered-parcel-boundaries'])
    const featureCollection = await this.mapView.queryRenderedFeaturesAtPoint(
      pointInView,
      null,
      ['parcel-touchable'],
    );

    if (featureCollection.features.length > 0) {
      let foundFeatures = featureCollection.features.filter(
        feature => 'parcelnumb' in feature.properties,
      );
      if (foundFeatures.length > 0) {
        //RRS: changing here from foundFeatures.length === 1 for deploy: 06/02/2020
        if (foundFeatures.length > 0) {
          let feature = foundFeatures[0];
          if (
            fromPress &&
            this.selectedParcel &&
            this.selectedParcel.properties.fid === feature.properties.fid
          ) {
            //console.log("pressed")
            //console.log(this.selectedParcel)
            this.showParcelView(this.selectedParcel);
          } else {
            if (
              !this.selectedParcel ||
              this.selectedParcel.properties.fid != feature.properties.fid
            ) {
              //console.log("getting details")
              this.props.userStore._loadAuth().then(() => {
                //if(this.props.userStore.isRegistered){
                console.log(
                  'this.props.userStore.parceledUser.token - ',
                  this.props.userStore.parceledUser.token,
                );
                this.props.analyticsStore.identify(
                  this.props.userStore.parceledUser.token,
                );
                //this.props.iapStore.login(this.props.userStore.parceledUser.token)
                this.setState({countApi : this.state.countApi+1});

                if (this.props.termSheetStore.isAuthenticated) {
                  console.log(
                    'this.props.userStore.isAuthenticated - ',
                    this.props.userStore.isAuthenticated,
                  );

                  this.getParcelDetails(
                    this.selectedParcel,
                    center[1],
                    center[0],
                  );

                  this.selectedParcel = feature;
                  //console.log('showiung one......');
                  if (this._isMounted) {
                    this.setState({
                      loadedParcel: true,
                      loadedParcels: false,
                    });
                  }
                } else {
                  if (this.state.countApi > 4) {
                    // alert(this.state.countApi)
                    console.warn('Hello pandey', this.state.countApi);
                    //  this.setState({modalVisible:true})
                    this.RBSheet.open();
                    // this.props.navigation.navigate('SignUpView');
                  } else {
                    this.getParcelDetails(
                      this.selectedParcel,
                      center[1],
                      center[0],
                    );

                    this.selectedParcel = feature;
                    //console.log('showiung one......');
                    if (this._isMounted) {
                      this.setState({
                        loadedParcel: true,
                        loadedParcels: false,
                      });
                    }
                  }
                }
              });
            }
          }
        } else if (foundFeatures.length > 1) {
          let feature = foundFeatures[0];
          if (
            fromPress &&
            this.selectedParcel &&
            this.selectedParcel.properties.fid === feature.properties.fid
          ) {
            this.showParcelView(this.selectedParcel);
          } else {
            if (
              !this.selectedParcel ||
              this.selectedParcel.properties.fid != feature.properties.fid
            ) {
              this.selectedParcel = feature;
              this.selectedData = foundFeatures;
              //console.log('showiung more......');
              if (this._isMounted) {
                this.setState({
                  loadedParcels: true,
                  loadedParcel: false,
                });
                this.getParcelDetails(
                  this.selectedParcel,
                  center[1],
                  center[0],
                );
              }
            }
          }
        }
      }
    } else {
      if (this._isMounted) {
        this.setState({
          loadedParcel: false,
          loadedParcels: false,
        });
      }
    }
  }

  showSelectedParcel() {
    const layerStyles = {
      selectedParcelBoundaryPolyons: {
        fillColor: '#2972e2',
        fillOpacity: 0.5,
        fillOutlineColor: 'black',
      },
    };

    if (this.state.loadedParcel || this.state.loadedParcels) {
      return (
        <MapboxGL.ShapeSource
          id="selectedParcelShapeSource"
          shape={this.selectedParcel}>
          <MapboxGL.FillLayer
            id="selectedParcelShapeSourceFillLayer"
            style={layerStyles.selectedParcelBoundaryPolyons}
          />
        </MapboxGL.ShapeSource>
      );
    } else {
      return null;
    }
  }

  renderSelectedLayers() {
    //RRS
    //return this.props.termSheetStore.selectedLayers.map((layer, i) => {
    //  return this._renderLayer(layer)
    //})
  }

  renderFilters() {
    if (
      this.props.parcelStore.parcelFilters &&
      this.props.parcelStore.parcelFilters.length > 0
    ) {
      let filtersArr = [];
      this.props.parcelStore.parcelFilters.map((filter, i) => {
        if (filter.selected) {
          filtersArr.push(['==', filter.key, filter.val]);
        }
      });
      if (filtersArr.length > 0) {
        let filterElem = ['all'];
        filtersArr.forEach((elem, i) => {
          filterElem.push(elem);
        });
        return (
          <MapboxGL.VectorSource id="filtered-parcel-boundaries">
            <MapboxGL.FillLayer id="parcel-boundaries" filter={filterElem} />
          </MapboxGL.VectorSource>
        );
      }
    }
  }

  renderTileVectors() {
    if (this.state.parcelTileData && this.state.showParcelTiles) {
      return (
        <MapboxGL.VectorSource
          id={this.state.parcelTileData.id}
          url={`https://tiles.makeloveland.com/api/v1/parcels?format=mvt&token=${LOVELAND_API_TOKEN}`}>
          <MapboxGL.LineLayer
            id="parcels"
            sourceID={this.state.parcelTileData.id}
            sourceLayerID={this.state.parcelTileData.id}
            minZoomLevel={10}
            maxZoomLevel={20}
            style={{lineColor: '#ffffff'}}
          />
          <MapboxGL.FillLayer
            id="parcel-touchable"
            sourceID={this.state.parcelTileData.id}
            sourceLayerID={this.state.parcelTileData.id}
            minZoomLevel={10}
            maxZoomLevel={20}
            style={{fillOpacity: 0.1, fillColor: '#72e48e'}}
          />
        </MapboxGL.VectorSource>
      );
    }
  }

  _renderLayer(layer) {
    const layerStyles = {
      parcelBoundaries: {
        lineColor: 'black',
        lineWidth: 1,
        lineOpacity: 0.84,
      },
      parcelBoundaryPolyons: {
        fillColor: 'rgba(255, 255, 255, 0)',
        fillOpacity: 0.5,
        fillOutlineColor: 'black',
      },

      geoPolygons: {
        fillColor: 'black',
        fillOpacity: 0.5,
      },
      symbolIcon: {
        iconImage: images.red_map_dot,
        iconAllowOverlap: true,
        iconIgnorePlacement: true,
        iconSize: Platform.OS === 'android' ? 1 : 0.5,
      },
    };

    if (layer.type == 'fill') {
      return (
        <MapboxGL.ShapeSource id={layer.id} url={layer.url} key={layer.id}>
          <MapboxGL.FillLayer id={layer.id} style={layerStyles.geoPolygons} />
        </MapboxGL.ShapeSource>
      );
    } else if (layer.type == 'heatmap') {
      return (
        <MapboxGL.ShapeSource id={layer.id} url={layer.url} key={layer.id}>
          <MapboxGL.HeatmapLayer
            id="earthquakes"
            sourceID="earthquakes"
            style={{
              heatmapColor: [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)',
              ],
            }}
          />
        </MapboxGL.ShapeSource>
      );
    } else if (layer.type == 'symbol') {
      return (
        <MapboxGL.ShapeSource
          id={layer.id}
          url={layer.url}
          key={layer.id}
          cluster
          clusterRadius={50}>
          <MapboxGL.SymbolLayer
            key="{id}"
            id="{id}"
            style={layerStyles.symbolIcon}
          />
        </MapboxGL.ShapeSource>
      );
    }
  }

  lookupLocation(coordinates) {
    let marker = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
    //console.log('lookupLocation');
    if (this._isMounted) {
      this.setState({
        loadedParcel: false,
        loadedParcels: false,
        markers: [marker],
      });
    }

    this.props.parcelStore.lookupParcel(coordinates).then(data => {
      this.parcelData = data;
      if (this._isMounted) {
        this.setState({
          loadedParcel: true,
          loadedParcels: false,
        });
      }
      this.props.parcelStore.addToRecentlyViewed(this.parcelData);
      this.getParcelDetails(
        this.parcelData,
        coordinates.latitude,
        coordinates.longitude,
      );
    });
  }

  getParcelDetails(parcelData, latitude, longitude) {
    //this.parcelData = null;
    this.parceledData = null;
    //console.log('geting data......');
    //console.log(parcelData)
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
        //console.log('data acquired........', JSON.stringify(data));
        this.parceledData = data;
      });
  }

  renderAnnotation(counter) {
    if (
      this.props.parcelStore.savedParcels[counter].longitude &&
      this.props.parcelStore.savedParcels[counter].latitude
    ) {
      const id = `pointAnnotation${counter}`;
      const coordinate = [
        this.props.parcelStore.savedParcels[counter].longitude,
        this.props.parcelStore.savedParcels[counter].latitude,
      ];

      return (
        <MapboxGL.PointAnnotation
          key={id}
          id={id}
          title="Test"
          coordinate={coordinate}>
          <Image
            source={require('../../Assets/Images/mapbox_icon.png')}
            style={{
              flex: 1,
              resizeMode: 'contain',
              width: 25,
              height: 25,
            }}
          />
        </MapboxGL.PointAnnotation>
      );
    }
  }

  renderAnnotations() {
    const items = [];
    for (let i = 0; i < this.props.parcelStore.savedParcels.length; i++) {
      items.push(this.renderAnnotation(i));
    }
    return items;
  }

  mapPress(coordinates) {
    ReactNativeHapticFeedback.trigger('notificationSuccess', hapticOptions);
    this.lookupLocation(coordinates);
  }

  render() {
    const {top, bottom} = this.props.draggableRange;

    const backgoundOpacity = this._draggedValue.interpolate({
      inputRange: [height - 48, height],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const iconTranslateY = this._draggedValue.interpolate({
      inputRange: [height - 56, height, top],
      outputRange: [0, 56, 100 - 32],
      extrapolate: 'clamp',
    });

    const textTranslateY = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, 8],
      extrapolate: 'clamp',
    });

    const textTranslateX = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, -112],
      extrapolate: 'clamp',
    });

    const textScale = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [1, 0.7],
      extrapolate: 'clamp',
    });

    const geoJson = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [125.6, 10.1],
      },
      properties: {
        name: 'Dinagat Islands',
      },
    };

    const searchBarStyles = {
      textInput: {
        height: 36,
        width: 300,
        elevation: 1,
        paddingLeft: 5,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        flex: 4,
      },
      inputContainer: {
        borderBottomWidth: 0,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        borderRadius: 9,
        minHeight: 32,
        marginLeft: 8,
        marginRight: 8,
        flexDirection: 'row',
        flex: 1,
      },
      container: {
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        paddingBottom: 5,
        paddingTop: 5,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
        borderRadius: 8,
      },
      searchTextBG: {
        height: 36,
        width: 300,
        elevation: 1,
        paddingLeft: 5,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
        flex: 4,
        justifyContent: 'center',
      },
    };

    const styles = {
      map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
      },
      topRightSearchButton: {
        position: 'absolute',
        width: 25,
        height: 25,
        top: 20,
        right: 30,
        zIndex: 10,
      },
      centeredView: {
        height: 400,

        marginTop: '30%',
        justifyContent: 'center',
        marginVertical: '5%',
      },

      topRightLayerButton: {
        position: 'absolute',
        width: 25,
        height: 25,
        top: 100,
        right: 30,
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
        width: 25,
        height: 25,
        bottom: 250,
        right: 30,
        zIndex: 10,
      },
      slideUpContainer: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      },
      mapScreenScreenBar: {
        top: 20,
        left: 10,
        zIndex: 20,
        position: 'absolute',
        right: 10,
      },
      title_row: {
        marginHorizontal: 15,
        fontSize: scale(20),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center',
      },
      termTextStyle: {
        fontSize: scale(12),
        fontWeight: '400',
        color: '#9E9E9E',
        textAlign: 'center',
      },
      mapMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        width: 18,
        height: 18,
        marginTop: -9,
        marginLeft: -9,
      },
      rb_signup_btn: {
        borderRadius: 8,
        width: '90%',
        height: 50,
        alignSelf: 'center',
        marginTop: 25,
        backgroundColor: '#ff6700',
      },
      rb_signin_btn: {
        borderRadius: 8,
        width: '90%',
        height: 50,
        alignSelf: 'center',
        marginTop: 15,
        backgroundColor: '#FFE8DD',
      },
    };

    return (
      <>
        <View
          style={[
            css.baseStyles.container,
            {
              backgroundColor: this.state.isDark
                ? darkColors.background
                : lightColors.background,
            },
          ]}>
          <View style={styles.topRightLayerButton}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 50,
                marginTop: 10,
              }}
              onPress={() => {
                this.toggleShowSettings();
              }}>
              <Image
                resizeMode={'contain'}
                style={{height: 50, width: 50}}
                source={require('../../Assets/Images/frame_b.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 50,
                marginTop: 10,
              }}
              onPress={() => {
                this.RBSheet.open();
                // this.showFeedbackView();
              }}>
              <Image
                resizeMode={'contain'}
                style={{height: 50, width: 50}}
                source={require('../../Assets/Images/frame_a.png')}
              />
            </TouchableOpacity>

            {/* <View
            style={[styles.bottomRightLayerButton, {backgroundColor: 'red'}]}> */}
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                width: 50,
                marginTop: 10,
              }}
              onPress={() => {
                this.goToCurrentLocation();
              }}>
              <Image
                resizeMode={'contain'}
                style={{height: 50, width: 50}}
                source={require('../../Assets/Images/frame_c.png')}
              />
            </TouchableOpacity>
          </View>
          {/* </View> */}
          {/* {this.searchInputVisible ? ( */}
          <View style={styles.mapScreenScreenBar}>
            {/* <GoogleAutoComplete
                apiKey="AIzaSyB2-XNYVp_X3MwlwW1Xt3gGjL5rrwQ9OG4"
                queryTypes="geocode|establishment"
                debounce={300}
                minLength={3}>
                {({
                  handleTextChange,
                  locationResults,
                  fetchDetails,
                  isSearching,
                  inputValue,
                  clearSearch,
                }) => (
                  <Fragment> */}
            <TouchableOpacity
              style={[searchBarStyles.container, {marginTop: 16}]}
              onPress={() => {
                console.log('click me!!!!!');
                this.showInputLocationView();
              }}
              activeOpacity={0.6}>
              <View style={searchBarStyles.inputContainer}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    width: 20,
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{height: 15, width: 15}}
                    source={require('../../Assets/Images/ic_search.png')}
                  />
                </View>
                <View style={searchBarStyles.searchTextBG}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      color: 'gray',
                    }}>
                    City, Address, Zip
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    flex: 1,
                    width: 20,
                  }}>
                  <Image
                    resizeMode={'contain'}
                    style={{height: 15, width: 15}}
                    source={require('../../Assets/Images/shape.png')}
                    //type="font-awesome"
                    onPress={() => {
                      // clearSearch();
                      // handleTextChange('');
                    }}
                    color="gray"
                  />
                </View>
              </View>
            </TouchableOpacity>
            {/* <ScrollView
              style={{
                maxHeight: 200,
                backgroundColor: 'white',
                zIndex: 400,
              }}
              keyboardShouldPersistTaps="always">
              {locationResults.map((el, i) => (
                <LocationItem
                  {...el}
                  fetchDetails={fetchDetails}
                  key={String(i)}
                  update={this.goToLocation}
                  // {...{clearSearch}}
                />
              ))} */}
            {/* </ScrollView> */}
            {/* </Fragment>
                )}
              </GoogleAutoComplete> */}
          </View>
          {/* ) : (
            <Fragment />
          )} */}

          {/* <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          
        >
          
         
            
         
        </Modal>
        */}

          <View style={styles.mapMarker}>
            <Icon size={18} name="plus" type="feather" color="#ff6700" />
          </View>
          <BottomSheet
            parcelData={this.selectedParcel.properties}
            loadedParcel={this.state.loadedParcel}
            onPressParcel={() => this.showParcelView(this.selectedParcel)}
            showSettings={this.state.showSettings}
            isDark={this.state.isDark}
          />

          <MapboxGL.MapView
            ref={ref => (this.mapView = ref)}
            style={styles.map}
            styleURL={this.state.mapType}
            showUserLocation={true}
            rotateEnabled={false}
            pitchEnabled={false}
            logoEnabled={false}
            onRegionDidChange={this.onRegionDidChange}
            regionDidChangeDebounceTime={0}
            onPress={evt => this.onPressMap(evt)}
            onDidFinishLoadingMap={() => this._onMapLoaded()}>
            <MapboxGL.Camera
              ref={ref => (this.cameraView = ref)}
              zoomLevel={16}
              animationMode={'flyTo'}
              centerCoordinate={[this.state.longitude, this.state.latitude]}
            />
            {this.renderTileVectors()}
            {this.renderAnnotations()}

            <MapboxGL.UserLocation visible={true} />
            {this.renderSelectedLayers()}
            {this.showSelectedParcel()}
          </MapboxGL.MapView>

          <SettingsSheet
            showSettings={this.state.showSettings}
            onPressToggleSettings={() => this.toggleShowSettings()}
            onPressRecentlyViewed={() => this.showRecentlyViewed()}
            onPressFilterView={() => this.showFilterView()}
            onPressViewSavedParcels={() => this.showSavedParcels()}
            onPressUpdateMapType={mapType => this.updateMapType(mapType)}
            selectedMapType={this.state.mapType}
          />

          <BottomSheet
            parcelData={this.selectedParcel.properties}
            loadedParcel={this.state.loadedParcel}
            onPressParcel={() => this.showParcelView(this.selectedParcel)}
            showSettings={this.state.showSettings}
            isDark={this.state.isDark}
          />

          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            closeOnPressBack={false}
            height={320}
            closeOnPressMask={false}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                backgroundColor: this.state.isDark
                  ? darkColors.background
                  : lightColors.background,
              },
            }}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: 50,
              }}>
              <Text style={styles.title_row}>
                {'Sign in or create an account'}
              </Text>
              <Button
                title="Sign Up"
                // onPress={this._subscribe}
                buttonStyle={styles.rb_signup_btn}
                onPress={() => {
                  this.RBSheet.close();
                  this.props.navigation.navigate('SignUpView');
                }}
              />

              <Button
                title="Sign In"
                // onPress={this._subscribe}
                buttonStyle={styles.rb_signin_btn}
                titleStyle={{
                  color: '#F9560E',
                }}
                onPress={() => {
                  this.RBSheet.close();
                  this.props.navigation.navigate('SignInView');
                }}
              />

              <Text
                style={[
                  styles.termTextStyle,
                  {alignSelf: 'center', marginTop: 60, marginBottom: 10},
                ]}>
                I accept Term of Use and Privacy Policy
              </Text>
            </View>
          </RBSheet>
        </View>
        {this.state.loadedParcels && (
          <RawBottomSheet
            parcelDataList={this.selectedData}
            onCloseSlider={() => this.setState({loadedParcels: false})}
            loadedParcelList={this.state.loadedParcels}
            onPressParcelItem={item => this.showParcelView(this.selectedParcel)}
            showSettings={this.state.showSettings}
          />
        )}
      </>
    );
  }
}
