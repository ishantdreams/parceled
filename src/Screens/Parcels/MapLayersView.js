import React, {Component, Fragment} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Card, ListItem, Button, FormLabel, FormInput, FormValidationMessage, Divider, List } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';


import {observable} from 'mobx';
import autobind from 'autobind-decorator'
import {observer, inject} from 'mobx-react';
import NavIcons from '../../Components/NavIcons';
import * as css from "../../Assets/Styles";
import { SafeAreaView } from 'react-navigation';
import LayerModel from '../../Models/Layer';

@inject('termSheetStore', 'parcelStore')
@autobind @observer
export default class MapLayersView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'View Layers',
    headerLeft: NavIcons.closeButton(navigation.goBack),
    headerStyle: {
      backgroundColor: '#ff6700',
    },
    headerTintColor: '#fff',
  });

  constructor(props) {
    super(props);
  }

  onPressLayer(layer){
    this.props.parcelStore.toggleSelectedLayer(layer)
  }

  _renderLayerCard(layer){
    return (
      <View key={layer.id}>
        <Card
          title={layer.name}
          titleStyle={styles.titleStyle}
          >
          <Text style={styles.cardText}>
            {layer.description}
          </Text>
          <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, backgroundColor: '#37394f'}}
            onPress={() => { this.onPressLayer(layer) }}
            title={ this.props.parcelStore.isLayerSelected(layer) ? 'Hide' : 'Apply'} />
        </Card>
      </View>
    )
  }

  renderLayers(){
    return this.props.parcelStore.layers.map((layer, i) => {
      return this._renderLayerCard(layer)
    })
  }

  render(){
    return (
      <Fragment>
        <ScrollView>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
            {this.renderLayers()}
          </View>
        </ScrollView>
      </Fragment>
    );
  }
}

const styles = {
  titleStyle: {
  },
  cardText: {
    marginBottom: 10,
  }
};
