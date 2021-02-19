import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import NavIcons from '../../Components/NavIcons';
import { scale } from '../../Services/ResponsiveScreen';
import * as css from "../../Assets/Styles";
import TypeformEmbed from "react-native-typeform-embed";

// ...
export default class FeedbackView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '',
    headerLeft: NavIcons.closeButton(navigation.goBack),
    headerStyle: {
      backgroundColor: '#ff6700',
    },
    headerTintColor: '#fff',
  });

  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  onSubmit(){
    this.props.navigation.goBack();
  }

  componentDidMount () {

  }

  render() {
    const title = this.props.navigation.getParam('title', '');
    const url = this.props.navigation.getParam('url', '');
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Text style={screenStyles.title_row}>{ title }</Text>
        </View>
        <TypeformEmbed
          url={url}
          onSubmit={() => this.onSubmit()}
        />
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  title_row: {
    marginHorizontal: 15,
    fontSize: scale(16),
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
    color: css.colors.black,
    marginBottom: 5,
    marginTop: 5,
    textAlign: 'center',
  },
});
