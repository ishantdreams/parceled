import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import { Card, ListItem, Button,Icon, } from 'react-native-elements'

import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import { SafeAreaView, DrawerActions } from 'react-navigation';

import * as css from "../../Assets/Styles";

@inject('termSheetStore')
@autobind @observer
export default class Settings extends Component {

  render(){
    return (
      <SafeAreaView style={css.baseStyles.baseContainer}>


      </SafeAreaView>
    );
  }
}
