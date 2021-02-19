import React, {PureComponent, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as css from '../Assets/Styles';
import {scale} from '../Services/ResponsiveScreen';
import SwipeablePanel from 'rn-swipeable-panel';

export default class RawBottomSheet extends PureComponent {
  SwipeablePanel = null;
  constructor(props) {
    super(props);
    //setting default state
    this.state = {extParcelData: [], loaded: false, text: '',};
    this.arrayholder = [];
    this._hideFull = this._hideFull.bind(this);
  }

  componentDidMount() {
    console.log('state initilized');
    const {parcelDataList, loadedParcelList} = this.props;
    console.log(parcelDataList)
    console.log(loadedParcelList)
    this.setState({
      extParcelData: parcelDataList,
      loaded: loadedParcelList,
      initial: true,
    });
    this.arrayholder = parcelDataList;
    // var logData = JSON.stringify(parcelDataList);
    // console.log('list: ', logData);
  }

  _showFull(parcelItem) {
    this.props.onPressParcelItem(parcelItem);
  }

  _hideFull() {
    console.log('press close');
    this.props.onCloseSlider();
  }

  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function(item) {
      //applying filter for the inserted text in search bar
      const itemData = item.properties.address
        ? item.properties.address.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      extParcelData: newData,
      text: text,
    });
  }

  render() {
    //const {parcelDataList, loadedParcelList} = this.props;
    //extParcelData = parcelDataList;
    //this.arrayholder = parcelDataList;
    if (!this.state.loaded) {
      return null;
    }
    return (
      <SwipeablePanel
        ref={ref => (this.SwipeablePanel = ref)}
        style={{
          backgroundColor: css.colors.theme,
          position: 'absolute',
          zIndex: 111,
        }}
        fullWidth={true}
        isActive={true}
        noBackgroundOpacity={false}
        onClose={this._hideFull}
        //onPressCloseButton={this.closePanel}
      >
        <TextInput
          style={screenStyles.textInputStyle}
          onChangeText={text => {
            this.SearchFilterFunction(text);
          }}
          value={this.state.text}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode={'never'}
          data={this.state.extParcelData}
          renderItem={({item}) => (
            <TouchableOpacity
              activeOpacity={0.5}
              style={screenStyles.container_row}
              onPress={() => this._showFull(item)}>
              <View style={screenStyles.container_row_text}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={[screenStyles.address_row]}>
                    {item.properties.address} [{item.properties.parcelnumb}]
                  </Text>
                  <Ionicon raised size={30} name="md-open" color="black" />
                </View>
                {item.properties.owner ? (
                  <Text style={[screenStyles.city_row]}>
                    {item.properties.owner}
                  </Text>
                ) : (
                  <Fragment />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </SwipeablePanel>
    );
  }
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: css.colors.lightbackground,
  },
  textInputStyle: {
    height: 45,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: css.colors.theme,
    backgroundColor: '#FFFFFF',
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
    padding: 15,
    backgroundColor: css.colors.white,
    borderBottomColor: css.colors.gray,
    borderBottomWidth: 1,
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
