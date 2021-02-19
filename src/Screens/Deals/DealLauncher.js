import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Card, ListItem, Button} from 'react-native-elements';

import Icon from 'react-native-vector-icons/FontAwesome';

import {observable} from 'mobx';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import SectionWidget from '../../Components/SectionWidget';
import {SafeAreaView, DrawerActions} from 'react-navigation';
import {scale} from '../../Services/ResponsiveScreen';
import NumberFormat from 'react-number-format';
import DelayInput from 'react-native-debounce-input';

import * as css from '../../Assets/Styles';

@inject('termSheetStore')
@autobind
@observer
export default class DealLauncher extends Component {
  constructor() {
    super();
    //this._bootstrapAsync();
  }

  componentDidMount() {
    if (this.props.termSheetStore.isAuthenticated) {
      this.props.navigation.navigate('Deals');
    } else {
      this.props.navigation.navigate('AuthLoading');
    }
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../Assets/Images/ts_logo.png')}
          style={{width: 112, height: 125}}
        />
        <View style={css.launchScreen.textSection}>
          <Text style={css.launchScreen.tagline}>Parceled by TermSheet</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6700',
  },
});
