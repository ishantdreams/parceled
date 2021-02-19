import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator
} from 'react-native';

export default class Loader extends PureComponent {
  render(){
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={this.props.loading}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={screenStyles.modalBackground}>
          <View style={screenStyles.activityIndicatorWrapper}>
            <ActivityIndicator
              animating={this.props.loading} />
          </View>
        </View>
      </Modal>
    )
  }
}

const screenStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
