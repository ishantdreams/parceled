import React, { Component } from 'react'
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { Card, ListItem, Button, Icon, Divider } from 'react-native-elements'
import * as css from "../Assets/Styles";

export default class SectionWidget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={css.baseStyles.widgetContainer}>
        <View style={css.baseStyles.widgetHeaderContaner}>
             <Text style={css.baseStyles.widgetTitleText}>{this.props.title}</Text>
        </View>
        <Divider style={{ backgroundColor: '#ccc', marginLeft: 10, marginRight: 10 }} />
        <View style={css.baseStyles.widgetBodyContainer}>
          {this.props.children}
        </View>
      </View>
    );
  }
}
