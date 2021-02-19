import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
  TouchableHighlight
} from 'react-native';

export default class FeedbackModal extends PureComponent {

  closeModal(){
    this.props.onCloseFeedback();
  }

  render(){
    return (
      <Modal
        animationType={'slide'}
        visible={this.props.submitFeedback}
        onRequestClose={() => {console.log('close modal')}}>
        <View style={screenStyles.centeredView}>
          <View style={screenStyles.modalView}>
            <Text style={screenStyles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...screenStyles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                this.closeModal();
              }}
            >
              <Text style={screenStyles.textStyle}>Hide Modal</Text>
            </TouchableHighlight>
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
