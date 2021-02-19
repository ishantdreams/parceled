import React, { Component } from 'react'
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator, SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';

@inject('termSheetStore', 'parcelStore')
@observer
export default class DrawerWithLogoutButton extends Component {
  constructor(props) {
    super(props);
  }

  _renderLoginLogoutButton(){
    if(this.props.termSheetStore.isAuthenticated){
      return (
        <TouchableOpacity onPress={() => { this.props.termSheetStore.promptForLogout(); }}>
          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Icon name='ios-log-out' size={25} color='tomato' />
            </View>
            <Text style={styles.label}>Log Out</Text>
          </View>
        </TouchableOpacity>
      )
    }else{
      return (
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login'); }}>
          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Icon name='ios-log-in' size={25} color='tomato' />
            </View>
            <Text style={styles.label}>Log In</Text>
          </View>
        </TouchableOpacity>
      )
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{flex: 1,  flexDirection: 'column', justifyContent: 'space-between' }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...this.props} />
        </SafeAreaView>
        {this._renderLoginLogoutButton()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 40,
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .87)',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  }
});
