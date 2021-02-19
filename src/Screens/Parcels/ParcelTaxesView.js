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
import NumberFormat from 'react-number-format';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';

export default class ParcelTaxesView extends Component {
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

              <Text style={screenStyles.title_row}>{'Taxes & Value '}</Text>
            </View>
          </View>

          <ScrollView style={{flex: 1, marginHorizontal: 20}}>
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <Text style={screenStyles.title_type}>Tax Bill</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.tax_bill_amount}
                  displayType={'text'}
                  thousandSeparator={true}
                  prefix={'$'}
                  renderText={value => <Text>{value}</Text>}
                />{' '}
                ({this.state.parcelData.assessed_tax_year})
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>Assessed Land Value</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.assessed_value_land}
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
              }}>
              <Text style={screenStyles.title_type}>Assessed Total Value</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.assessed_value_total}
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
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>Market Land Value</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.the_value_land}
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
              }}>
              <Text style={screenStyles.title_type}>Market Total Value</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.market_value_total}
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
                marginVertical: 16,
              }}>
              <Text style={screenStyles.title_type}>Last Sale Amount</Text>
              <Text style={screenStyles.title_value}>
                <NumberFormat
                  value={this.state.parcelData.last_sale_amount}
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
              }}>
              <Text style={screenStyles.title_type}>Last Sale Date</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.last_sale_date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 16,
              }}>
              <Text style={screenStyles.title_type}>Zoning</Text>
              <Text style={screenStyles.title_value}>
                {this.state.parcelData.zone_code}
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
