import React, {PureComponent, Fragment} from 'react';
import {
  Image,
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
import {Button, SearchBar, ListItem, ButtonGroup} from 'react-native-elements';
import SwipeUpDown from './SwipeUpDown';
import {SafeAreaView} from 'react-navigation';
import * as css from '../Assets/Styles';
import {observable} from 'mobx';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
//import deepExtend from 'deep-extend';
import Icon from 'react-native-vector-icons/Ionicons';

export default class SettingsSheet extends PureComponent {
  @observable _parcelData = {
    address: '',
    owner: {
      name: '',
      mailingAddress: '',
    },
    taxId: '',
    yearBuilt: '',
    propertyType: '',
    size: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedMap: 0,
    };
    this.updateSelectedMap = this.updateSelectedMap.bind(this);
    this.setSelectedMapIndex();
  }

  _showFull() {
    this.props.onPressParcel();
  }

  updateSelectedMap(selectedIndex) {
    this.setState({selectedMap: selectedIndex});
    if (selectedIndex == 0) {
      this.props.onPressUpdateMapType('mapbox://styles/mapbox/streets-v11');
    } else if (selectedIndex == 1) {
      this.props.onPressUpdateMapType(
        'mapbox://styles/mapbox/satellite-streets-v11',
      );
    } else if (selectedIndex == 5) {
      this.props.onPressUpdateMapType('mapbox://styles/mapbox/satellite-v9');
    } else if (selectedIndex == 2) {
      this.props.onPressUpdateMapType('mapbox://styles/mapbox/light-v10');
    }
  }

  setSelectedMapIndex() {
    if (this.props.selectedMapType == 'mapbox://styles/mapbox/streets-v11') {
      this.setState({selectedMap: 0});
    } else if (
      this.props.selectedMapType == 'mapbox://styles/mapbox/light-v10'
    ) {
      this.setState({selectedMap: 2});
    } else if (
      this.props.selectedMapType ==
      'mapbox://styles/mapbox/satellite-streets-v11'
    ) {
      this.setState({selectedMap: 1});
    }
  }

  _hideSettings() {
    this.props.onPressToggleSettings();
  }

  showRecentlyViewed() {
    this.props.onPressRecentlyViewed();
  }

  showSavedParcelsView() {
    this.props.onPressViewSavedParcels();
  }

  showFilterView() {
    this.props.onPressFilterView();
  }

  render() {
    const {
      parcelData,
      loadedParcel,
      showSettings,
      selectedMapType,
    } = this.props;
    //const extParcelData = deepExtend(this._parcelData, parcelData);
    this.setSelectedMapIndex();

    if (!showSettings) {
      return null;
    }
    const buttons = ['Standard', 'Satellite', 'Light'];
    return (
      <Fragment>
        <View
          style={[
            styles.wrapSwipe,
            {
              height: 150,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'flex-start',
            },
          ]}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={styles.textHeader}>Settings</Text>
              <TouchableOpacity onPress={() => this._hideSettings()}>
                <Icon name="ios-close" style={styles.close} />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={css.baseStyles.formContainer2}>
                <ButtonGroup
                  onPress={this.updateSelectedMap}
                  selectedIndex={this.state.selectedMap}
                  buttons={buttons}
                  selectedButtonStyle={{backgroundColor: '#ff6700'}}
                  textStyle={{fontFamily: css.Fonts.openSans, fontSize: 14}}
                  containerStyle={{height: 30}}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Fragment>
    );
  }
}

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
  close: {
    marginLeft: 10,
    fontSize: 30,
    color: '#555',
    marginTop: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textHeader: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'OpenSans-Bold',
  },
  selectionHeader: {
    fontSize: 14,
    color: '#000',
    fontFamily: css.Fonts.openSans,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrow: {
    marginLeft: 10,
    fontSize: 18,
    color: '#555',
  },
};
