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
export default class PendingTab extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {parcelData} = this.props;

    return (
      <View style={css.baseStyles.container}>
        <View style={styles.mainContent}>
          <View style={{alignItems: 'center', textAlign: 'center'}}>
            <Image
              source={require("../../../Assets/Images/logo_icon.jpg")}
              style={{ width: 112, height: 125 }}
            />
          </View>
          <View style={{height: 60, paddingLeft: 15, paddingRight: 15, alignItems: 'center', textAlign: 'center'}}>
            <Text style={styles.subTagline}>This tab will be available in Parceled Pro coming shortly.</Text>
          </View>
        </View>
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

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 96,
  },
  subTagline: {
    marginTop: 5,
    fontSize: scale(16),
    fontWeight: '400',
    color: '#999',
    textAlign: 'center'
  },
  input: {
    left: 5,
    top: 0,
    right: 5,
    bottom: 0,
    height: 40,
    fontSize: 18,
    padding: 5
  },
  inputContainer: {
    padding: 10,
    marginTop: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    height: 40,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  image: {
    width: scale(350),
    height: scale(340),
    marginBottom: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: css.Fonts.openSans
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans
  },
});
