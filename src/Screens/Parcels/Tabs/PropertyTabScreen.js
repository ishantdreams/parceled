import React, {Component, Fragment} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {observable} from 'mobx';
import {scale} from '../../../Services/ResponsiveScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as css from '../../../Assets/Styles';
import {SwipeListView} from 'react-native-swipe-list-view';
import Moment from 'moment';
import NumberFormat from 'react-number-format';

const screenStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  viewcontainer: {
    flex: 1,
    backgroundColor: css.colors.white,
  },
  input: {
    fontSize: 18,
    minHeight: 250,
  },
  top_icon: {
    margin: 10,
    height: scale(30),
    width: scale(40),
    tintColor: css.colors.theme,
  },
  loc_icon: {
    height: scale(20),
    width: scale(20),
    tintColor: css.colors.blue,
  },
  data_row: {
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? css.colors.blacklight : 'transparent',
  },
  container_row: {
    flex: 1,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 3,
    marginBottom: 40,
  },
  container_row_text: {
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: css.colors.blacklight,
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
    fontSize: scale(22),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
  },
  title_city: {
    fontSize: scale(14),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
    marginLeft: 5,
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
  title_txt: {
    fontSize: scale(25),
    marginTop: 15,
    marginHorizontal: 15,
    fontWeight: 'bold',
    color: css.colors.theme,
    fontFamily: css.Fonts.openSans,
  },
  head_txt: {
    marginTop: 10,
    marginHorizontal: 15,
    fontSize: scale(14),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
  sub_txt: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: scale(17),
    fontFamily: css.Fonts.openSans,
    color: css.colors.theme,
  },
});

export default class PropertyTab extends Component {
  @observable _notes;

  constructor(props) {
    super(props);
  }

  _saveParcel() {}

  _saveNotes() {}

  renderSchoolData(schools) {
    if (schools && schools.length > 0) {
      return schools.map((item, index) => {
        return (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: css.colors.blacklight,
              backgroundColor:
                index % 2 == 0 ? css.colors.lightbackground : '#ffffff',
            }}
            key={index}>
            {index == 0 ? (
              <View style={screenStyles.data_row}>
                <Text style={screenStyles.head_txt}>School District</Text>
                <Text style={screenStyles.sub_txt}>
                  {item.usa_school ? item.usa_school.district_name : ''}
                </Text>
              </View>
            ) : (
              <Fragment />
            )}
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>School Name</Text>
              <Text style={screenStyles.sub_txt}>
                {item.usa_school ? item.usa_school.institution_name : ''}
              </Text>
            </View>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Educational Climate</Text>
              <Text style={screenStyles.sub_txt}>
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

  renderOwners(tax_assessor_owners) {
    if (tax_assessor_owners && tax_assessor_owners.length > 0) {
      return tax_assessor_owners.map((item, idx) => {
        return (
          <View key={idx}>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Owner</Text>
              <Text style={screenStyles.sub_txt}>{item.owner_name}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Owner Type</Text>
              <Text style={screenStyles.sub_txt}>{item.owner_type}</Text>
            </View>
          </View>
        );
      });
    } else {
      return null;
    }
  }

  renderFAR(item) {
    if (item && item.far) {
      return (
        <View>
          <View style={screenStyles.data_row}>
            <Text style={screenStyles.head_txt}>Commercial SF</Text>
            <Text style={screenStyles.sub_txt}>
              <NumberFormat
                value={item.far.commercial_sq_ft}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
              />
            </Text>
          </View>

          <View style={screenStyles.data_row}>
            <Text style={screenStyles.head_txt}>Residential SF</Text>
            <Text style={screenStyles.sub_txt}>
              <NumberFormat
                value={item.far.residential_sq_ft}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
              />
            </Text>
          </View>

          <View style={screenStyles.data_row}>
            <Text style={screenStyles.head_txt}>Built FAR</Text>
            <Text style={screenStyles.sub_txt}>
              <NumberFormat
                value={item.far.built_far}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
              />
            </Text>
          </View>

          <View style={screenStyles.data_row}>
            <Text style={screenStyles.head_txt}>Max. Commercial FAR</Text>
            <Text style={screenStyles.sub_txt}>
              <NumberFormat
                value={item.far.maximum_commercial_far}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
              />
            </Text>
          </View>

          <View style={screenStyles.data_row}>
            <Text style={screenStyles.head_txt}>Max. Residential FAR</Text>
            <Text style={screenStyles.sub_txt}>
              <NumberFormat
                value={item.far.maximum_residential_far}
                displayType={'text'}
                thousandSeparator={true}
                renderText={value => <Text>{value}</Text>}
              />
            </Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
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

    const {parcelData} = this.props;

    return (
      <ScrollView
        style={screenStyles.viewcontainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        //stickyHeaderIndices={[2]}
        overScrollMode="never">
        {this.renderOwners(parcelData.tax_assessor_owner)}

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Address</Text>
          <Text style={screenStyles.sub_txt}>
            {parcelData.one_line_address}
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>County</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.situs_county}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>APN</Text>
          <Text style={screenStyles.sub_txt}>
            {parcelData.assessor_parcel_number_raw}
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Fips Code</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.fips_code}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Owner Mailing Address</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.mailing_address}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Property Type</Text>
          <Text style={screenStyles.sub_txt}>
            {parcelData.property_group_type}
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Year Built</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.year_built}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}># Units</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.units_count}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Lot Size</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.lot_size_acre}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Building Sq. Ft.</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.building_sq_ft}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Tax Bill</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.tax_bill_amount}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />{' '}
            ({parcelData.assessed_tax_year})
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Assessed Land Value</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.assessed_value_land}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Assessed Total Value</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.assessed_value_total}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Market Land Value</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.the_value_land}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Market Total Value</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.market_value_total}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Last Sale Amount</Text>
          <Text style={screenStyles.sub_txt}>
            <NumberFormat
              value={parcelData.last_sale_amount}
              displayType={'text'}
              thousandSeparator={true}
              prefix={'$'}
              renderText={value => <Text>{value}</Text>}
            />
          </Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Last Sale Date</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.last_sale_date}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Zoning</Text>
          <Text style={screenStyles.sub_txt}>{parcelData.zone_code}</Text>
        </View>

        {this.renderFAR(parcelData)}

        {this.renderSchoolData(parcelData.tax_assessor_usa_school__bridge)}

        <KeyboardAvoidingView style={screenStyles.data_row} behavior="padding">
          <Text style={screenStyles.head_txt}>Notes</Text>
          <TextInput
            {...commonInputProps}
            placeholder="Notes"
            onSubmitEditing={() => this.props.saveNotes()}
            onChangeText={text => this.props.updateNotes(text)}
            multiline={true}
            blurOnSubmit={true}
            value={this.props.notes}
            underlineColorAndroid="transparent"
            returnKeyType="done"
          />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}
