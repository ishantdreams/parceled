import React, {Component, Fragment} from 'react';
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

export default class ParcelSchoolDetailView extends Component {
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

  renderSchoolData(schools) {
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

              <Text style={screenStyles.title_row}>{'School'}</Text>
            </View>
          </View>

          <ScrollView style={{flex: 1, marginHorizontal: 20}}>
            {this.renderSchoolData(
              this.state.parcelData.tax_assessor_usa_school__bridge,
            )}
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
    marginLeft: 4,
    flex: 0.6,
  },
});
