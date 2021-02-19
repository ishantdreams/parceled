import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator';
import {Button} from 'react-native-elements';
import NavIcons from '../../Components/NavIcons';
import * as css from "../../Assets/Styles";
import Utils from '../../Services/Utils';
import { scale } from '../../Services/ResponsiveScreen';
import CameraRollPicker from 'react-native-camera-roll-picker';

@inject('termSheetStore', 'parcelStore')
@autobind @observer
export default class CameraRollView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Upload Photos',
    headerLeft: NavIcons.closeButton(navigation.goBack),
    headerRight: NavIcons.saveButton(navigation.getParam('saveSelectedPhotos')),
    headerStyle: {
      backgroundColor: '#ff6700',
    },
    headerTintColor: '#fff',
  });

  @observable email = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      selected: [],
    };
  }

  componentDidMount () {
    this.props.navigation.setParams({ saveSelectedPhotos: this._saveSelectedPhotos.bind(this) });
  }

  _saveSelectedPhotos(){
    const projectId = this.props.navigation.getParam('projectId', {});
    this.props.termSheetStore.uploadPhotos(projectId, this.state.selected);
    this.props.navigation.goBack()
  }

  getSelectedImages(images, current) {
    var num = images.length;

    this.setState({
      num: num,
      selected: images,
    });

    console.log(current);
    console.log(this.state.selected);
  }

  render(){
    return (
      <View style={screenStyles.container}>
        <CameraRollPicker
          groupTypes='All'
          maximum={3}
          selected={this.state.selected}
          assetType='Photos'
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages} />
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6AE2D',
  },
  content: {
    marginTop: 15,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    alignItems: 'center',
    color: '#fff',
  },
  bold: {
    fontWeight: 'bold',
  },
  info: {
    fontSize: 12,
  },
});
