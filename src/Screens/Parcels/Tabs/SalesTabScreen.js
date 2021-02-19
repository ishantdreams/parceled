import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Fragment,
  Linking,
} from 'react-native';
import autobind from 'autobind-decorator'
import { scale } from '../../../Services/ResponsiveScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as css from "../../../Assets/Styles";
import {SwipeListView} from 'react-native-swipe-list-view';
import Moment from 'moment';
import NumberFormat from 'react-number-format';

@autobind
export default class SalesTab extends Component {
  constructor(props) {
    super(props);
  }

  renderItemMortgage(recorder_mortgages){
    if(recorder_mortgages && recorder_mortgages.length > 0){
      return recorder_mortgages.map((item, idx) => {
        return (
          <View key={idx}>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Mortgage Amount</Text>
              <Text style={screenStyles.sub_txt}><NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Lender</Text>
              <Text style={screenStyles.sub_txt}>{item.lender_name}</Text>
            </View>

            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Term</Text>
              <Text style={screenStyles.sub_txt}>{item.term}</Text>
            </View>

          </View>
        );
      })
    }else{
      return null;
    }
  }

  renderGrantor(recorder_grantors){
    if(recorder_grantors && recorder_grantors.length > 0){
      return recorder_grantors.map((item, idx) => {
        return (
          <View key={idx}>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Grantor</Text>
              <Text style={screenStyles.sub_txt}>{item.grantor_name}</Text>
            </View>

          </View>
        );
      })
    }else{
      return null;
    }
  }

  renderGrantee(recorder_grantees){
    if(recorder_grantees && recorder_grantees.length > 0){
      return recorder_grantees.map((item, idx) => {
        return (
          <View key={idx}>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Grantee</Text>
              <Text style={screenStyles.sub_txt}>{item.grantee_name}</Text>
            </View>

          </View>
        );
      })
    }else{
      return null;
    }
  }

  renderItem({item, index}){
    return (
      <View style={{ borderBottomWidth: 1, borderColor: css.colors.blacklight, backgroundColor: index % 2 == 0 ? "#FFFFFF" : css.colors.lightbackground }}>
        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Date</Text>
          <Text style={screenStyles.sub_txt}>{item.recorded_date ? Moment(item.recorded_date).format('MMMM Do YYYY') : (item.publication_date ? Moment(item.publication_date).format('MMMM Do YYYY') : '--')}</Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Sale Amount</Text>
          <Text style={screenStyles.sub_txt}><NumberFormat value={item.document_amount} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <Text>{value}</Text>} /></Text>
        </View>

        <View style={screenStyles.data_row}>
          <Text style={screenStyles.head_txt}>Title Company</Text>
          <Text style={screenStyles.sub_txt}>{item.title_company_name}</Text>
        </View>
        {this.renderGrantor(item.recorder_grantor)}
        {this.renderGrantee(item.recorder_grantee)}
        {this.renderItemMortgage(item.recorder_mortgage)}
      </View>
    )
  }

  render() {
    const {parcelData} = this.props;
    let sortedRecorderData = parcelData.recorder.slice().sort((a, b) => (b.recorded_date || b.publication_date) - (a.recorded_date || a.publication_date))

    return (
      <View style={screenStyles.viewcontainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyExtractor={(item,index) => index.toString()}
          data={sortedRecorderData}
          renderItem={this.renderItem}
        />
      </View>
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
    marginHorizontal:15,
    fontSize: scale(22),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
  },
  title_city: {
    fontSize: scale(14),
    color: css.colors.black,
    fontFamily: css.Fonts.openSans,
    marginLeft:5,
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
