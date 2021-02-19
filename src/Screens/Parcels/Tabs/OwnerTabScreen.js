import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
  TextInput,
  Fragment,
  KeyboardAvoidingView,
} from 'react-native';
import {observable} from 'mobx';
import { scale } from '../../../Services/ResponsiveScreen';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import * as css from "../../../Assets/Styles";
import {SwipeListView} from 'react-native-swipe-list-view';
import Moment from 'moment';
import NumberFormat from 'react-number-format';
import autobind from 'autobind-decorator'

@autobind
export default class OwnerTab extends Component {

  @observable _notes;

  constructor(props) {
    super(props);
  }

  _saveParcel(){

  }

  _saveNotes(){

  }

  renderOwners(owners){
    if(owners && owners.length > 0){
      return owners.map((item, index) => {
        return (
          <View style={{ borderBottomWidth: 1, borderColor: css.colors.blacklight, backgroundColor: index % 2 == 0 ? css.colors.lightbackground : "#ffffff" }} key={index}>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Name</Text>
              <Text style={screenStyles.sub_txt}>{item.owner_name ? item.owner_name : ''}</Text>
            </View>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Mailing Address</Text>
              <Text style={screenStyles.sub_txt}>{item.mailing_one_line_address ? item.mailing_one_line_address : ''}</Text>
            </View>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Owner Type</Text>
              <Text style={screenStyles.sub_txt}>{item.owner_type ? item.owner_type : ''}</Text>
            </View>
            <View style={screenStyles.data_row}>
              <Text style={screenStyles.head_txt}>Phone</Text>
              <Text style={screenStyles.sub_txt}>{item.contact_phone_number ? item.contact_phone_number : 'Coming Soon'}</Text>
            </View>
          </View>
        );
      })
    }else{
      return null;
    }
  }

  render() {
    const commonInputProps = {
      style: [screenStyles.input, screenStyles.sub_txt, css.baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none'
    };

    const {parcelData} = this.props;
    return (
      <ScrollView
        style={screenStyles.viewcontainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        //stickyHeaderIndices={[2]}
        overScrollMode="never">
        {this.renderOwners(parcelData.tax_assessor_tax_assessor_id__usa_owner_unmask_tax_assessor_id)}
      </ScrollView>
    )

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
