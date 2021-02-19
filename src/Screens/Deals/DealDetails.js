import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  ScrollView,
  Linking,
} from 'react-native';
import { Card, ListItem, Button, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/Entypo';
import Share from 'react-native-share';

import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import { SafeAreaView, DrawerActions } from 'react-navigation';
import { scale } from '../../Services/ResponsiveScreen';
import Carousel from 'react-native-banner-carousel';
import TabScreen from './Tabs/TabsScreen';
import NumberFormat from 'react-number-format';
import Loader from '../../Components/Loader';
import * as css from "../../Assets/Styles";
import openMap from 'react-native-open-maps';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

const Header_Maximum_Height = 260;
const Header_Minimum_Height = 0;

@inject('termSheetStore', 'analyticsStore')
@observer
export default class DealDetails extends Component {
  @observable loading = true;
  @observable zoomEnabled = false;

  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.AnimatedHeaderValue = new Animated.Value(0);
    this.state = {
      project: null,
      images: [],
    }
  }

  componentDidMount() {
    this.loading = true;
    const project = this.props.navigation.getParam('project', null);
    this.props.termSheetStore.loadProject(project.id).then((data) => {
      this.setState({
        project: data.project,
        images: data.project.images,
      })
      this.loading = false;
    });
    if(this.props.termSheetStore.account && this.props.termSheetStore.account.account_integrations.length > 0 && this.props.termSheetStore.account.account_integrations.filter(ai => ai.integration.slug == 'zoom').length > 0){
      this.zoomEnabled = true;
    }
    this.props.analyticsStore.screen('DealDetails');
  }

  _openMap(address){
    openMap({ query: address.address_string });
  }

  showCameraSheet = () => {
    this.cameraActionSheet.show()
  }

  _showCameraRoll(){
    //this.props.navigation.navigate('CameraRollView', {projectId: this.state.project.id})
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      forceJpg: true,
    }).then(images => {
      if(images){
        this.setState({
          images: this.state.images.concat(images)
        })
        this.props.termSheetStore.uploadPhotos(this.state.project.id, images);
      }
    });
  }

  _showCamera(){
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: false,
      mediaType: 'photo',
    }).then(image =>﻿ {
      if(image){
        this.setState({
          images: this.state.images.concat([image])
        })
        this.props.termSheetStore.uploadPhotos(this.state.project.id, [image]);
      }
    })﻿
  }

  showShareActionSheet = () => {
    const url = "https://app.termsheet.com/p/s/"+this.state.project.token;
    const title = this.state.project.title;
    const message = 'Please check this out.';
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
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
    Share.open(options);
  }

  startWalkthrough(){
    Alert.alert('Start Walk-through', 'This will send a notification to your team and send you to Zoom to begin the walk-through. Do you wish to proceed?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: () => { this.startZoomMeeting() }, style: 'destructive'},
      ]
    );
  }

  startZoomMeeting(){
    Linking.openURL("https://app.termsheet.com/integrations/zoom/start_meeting?account_id="+this.props.termSheetStore.accountId.toString()+"&project_id="+this.state.project.id.toString())

  }

  render(){
    const project = this.state.project;
    const images = this.state.images;

    const AnimateHeaderBackgroundColor = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
      outputRange: ['#009688', '#00BCD4'],
      extrapolate: 'clamp',
    });

    const AnimateHeaderHeight = this.AnimatedHeaderValue.interpolate({
      inputRange: [0, Header_Maximum_Height - Header_Minimum_Height],
      outputRange: [Header_Maximum_Height, Header_Minimum_Height],
      extrapolate: 'clamp',
    });

    return (
      <Fragment>
      {
        project ? (
          <SafeAreaView style={{flex: 1}}>
            <ScrollView
              style={[screenStyles.viewcontainer]}
              stickyHeaderIndices={[1]}
              scrollEventThrottle={16}
              contentContainerStyle={{paddingTop: Header_Maximum_Height}}
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
                <View style={{flexDirection: 'row', backgroundColor: 'white'}}>
                  <View style={{flex: 1}}>
                    <Text style={screenStyles.title_row}>{project.title}</Text>
                    <Text style={screenStyles.title_address} onPress={ ()=> this._openMap(project) } >{project.address.street}</Text>
                    <Text style={screenStyles.title_city}>{project.address.city} {project.address.state}, {project.address.postal_code}</Text>

                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {
                      this.zoomEnabled ? (
                        <TouchableOpacity activeOpacity={0.7} onPress={ ()=> this.startWalkthrough() } >
                          <FontAwesome name='video-camera' size={25} style={screenStyles.menu_icon} />
                        </TouchableOpacity>
                      ) : (
                        <Fragment></Fragment>
                      )
                    }
                    <TouchableOpacity activeOpacity={0.7} onPress={ ()=> this.showShareActionSheet() } >
                      <Icon name='share-apple' size={35} style={screenStyles.menu_icon} />
                    </TouchableOpacity>

                  </View>
                </View>
              </View>
              <ActionSheet
                ref={o => this.cameraActionSheet = o}
                title={'Where would you like to access photos from?'}
                options={['Camera', 'Camera Roll', 'Cancel']}
                cancelButtonIndex={3}
                destructiveButtonIndex={1}
                onPress={(index) => { if(index == 1){ this._showCameraRoll() }else if(index == 0){ this._showCamera() }}}
              />
              {/* Tab Screen View */}
              <TabScreen project={project} images={images} onOpenFileUrl={(url, fileName) => this.props.navigation.navigate('FileWebView', {url: url, title: fileName}) } onPressAddPhoto={() => this.showCameraSheet()}/>
            </ScrollView>


            <Animated.View
              style={[
                // styles.HeaderStyle,
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0, //Platform.OS == 'ios' ? (height >= 812 ? 34 : 10) : 0,
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
                    <Image
                      style={{height: BannerHeight, width: BannerWidth}}
                      source={{uri: image.path || image.list_image_url || 'https://s3.amazonaws.com/termsheet-production/asset/images/attachments/000/044/713/original/kettler-dev-cc.jpg?1576274229'}}
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
                  <TouchableOpacity onPress={ ()=> this.showCameraSheet() } >
                    <Image
                      style={screenStyles.top_icon}
                      source={require('../../Assets/Images/ic_camera.png')}
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

                  <TouchableOpacity onPress={() => this.props.navigation.pop()}>
                    <Image
                      style={screenStyles.top_icon}
                      source={require('../../Assets/Images/ic_cancel.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                {/* Status View */}
                <View style={[screenStyles.row_over_style, {position: 'absolute',}]}>
                  <Text style={screenStyles.row_over_txt}>{project.project_stage ? project.project_stage.name : ''}</Text>
                </View>
              </View>
            </Animated.View>


          </SafeAreaView>
        ) : (
          <Fragment>
            <Loader
              loading={this.loading}
            />
          </Fragment>
        )
      }
    </Fragment>
    );
  }
}

const BannerWidth = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const BannerHeight = 260;

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
  menu_icon: {
    marginTop: 10,
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
    marginBottom: 10,
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

const images = [
  require('../../Assets/Images/property.jpeg'),
  require('../../Assets/Images/property.jpeg'),
  require('../../Assets/Images/property.jpeg'),
];
