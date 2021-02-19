import React from 'react'
import {StyleSheet, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

export default {
  closeButton (goBack) {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name='ios-close' style={styles.close}/>
      </TouchableOpacity>
    )
  },
  backButton (goBack) {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name='ios-arrow-back' style={styles.back}/>
      </TouchableOpacity>
    )
  },
  editButton (goBack) {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name='edit' style={styles.close}/>
      </TouchableOpacity>
    )
  },

  settingsButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
        <FontAwesome name='bars' style={styles.settings}/>
      </TouchableOpacity>
    )
  },

  rightButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
        <FontAwesome name='bell' style={styles.rightButton} type='font-awesome'/>
      </TouchableOpacity>
    )
  },
  bookmarkButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
        <FontAwesome name='bookmark' style={styles.bookmarkButton} type='font-awesome'/>
      </TouchableOpacity>
    )
  },
  closeParcelButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
        <FontAwesome name='times-circle' style={styles.closeParcelButton}/>
      </TouchableOpacity>
    )
  },
  shareButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
          <EvilIcon name='share-apple' style={styles.rightButton} />
      </TouchableOpacity>
    )
  },
  saveButton (openDrawer) {
    return (<TouchableOpacity onPress={() => openDrawer()}>
          <FontAwesome name='save' style={styles.rightButton} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  close: {
    marginLeft: 10,
    fontSize: 44,
    color: '#fff'
  },
  back: {
    marginLeft: 10,
    fontSize: 30,
    color: '#000'
  },
  settings: {
    marginLeft: 10,
    fontSize: 28,
    color: '#fff'
  },
  rightButton: {
    marginRight: 10,
    fontSize: 28,
    color: '#fff'
  },
  bookmarkButton: {
    marginLeft: 10,
    fontSize: 20,
    color: '#000'
  },
  closeParcelButton: {
    marginRight: 10,
    fontSize: 20,
    color: '#000'
  }
});
