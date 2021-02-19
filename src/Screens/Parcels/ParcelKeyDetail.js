import React, {Component} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-navigation';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';

export default class ParcelKeyDetail extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.state = {
      parcelData: this.props.navigation.getParam('parcelData', {}),
    };
  }

  componentDidMount() {
    console.log('parcel data is following:ssss- ', this.state.parcelData);
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={[screenStyles.viewcontainer]}>
          <StatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor={css.colors.theme}
            translucent={false}
          />
          <View
            style={{
              height: 64,
              flexDirection: 'row',
              paddingHorizontal: 10,
              alignItems: 'center',
              borderBottomColor: '#D3D3D3',
              justifyContent: 'space-between',
              borderBottomWidth: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  paddingHorizontal: 12,
                }}
                activeOpacity={0.6}
                onPress={() => {
                  this.props.navigation.pop();
                }}>
                <Image
                  resizeMode={'contain'}
                  // style={{height: 15, width: 15}}
                  source={require('../../Assets/Images/back_arrow.png')}
                />
              </TouchableOpacity>

              <Text style={screenStyles.title_row}>{'Key Details'}</Text>
            </View>
          </View>

          <ScrollView style={{flex: 1, marginHorizontal: 20}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
              }}>
              <Text style={screenStyles.title_type}>Property type</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.property_group_type}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>Country</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.situs_county}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={screenStyles.title_type}>APN</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.assessor_parcel_number_raw}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>Fips Code</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.fips_code}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={screenStyles.title_type}>Year Build</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.year_built}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>#Units</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.units_count}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={screenStyles.title_type}>Lot Size</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.lot_size_acre}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
              }}>
              <Text style={screenStyles.title_type}>Building Sq. Ft.</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.building_sq_ft}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
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

  title_row: {
    marginHorizontal: 15,
    fontSize: scale(18),
    fontWeight: '500',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
    marginBottom: 5,
    marginTop: 5,
    alignSelf: 'center',
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
    color: 'black',
    fontWeight: '400',
    flex: 0.6,
    marginLeft: 4,
  },
});
