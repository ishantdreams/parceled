import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import NavIcons from '../../Components/NavIcons';
import { scale } from '../../Services/ResponsiveScreen';
import * as css from "../../Assets/Styles";
import Share from 'react-native-share';

// ...
export default class ReportWebView extends Component {
  static navigationOptions = ({navigation}) => ({
    title: '',
    headerLeft: NavIcons.closeButton(navigation.goBack),
    headerRight: NavIcons.shareButton(navigation.getParam('shareFileUrl')),
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

  _shareFileUrl(){
    const url = this.props.navigation.getParam('url', {});
    const title = this.props.navigation.getParam('title', '');
    const message = 'Please check this out.';
    const options = Platform.select({
      ios: {
        activityItemSources: [
          {
            placeholderItem: { type: 'url', content: url },
            item: {
              default: { type: 'url', content: url },
            },
            subject: {
              default: title,
            },
            linkMetadata: { originalUrl: url, url, title },
          },
          {
            placeholderItem: { type: 'text', content: message },
            item: {
              default: { type: 'text', content: message },
              message: null, // Specify no text to share via Messages app.
            },
          },
        ],
      },
      default: {
        title,
        subject: title,
        message: `${message} ${url}`,
      },
    });
    Share.open(options);
  }

  componentDidMount () {
    this.props.navigation.setParams({ shareFileUrl: this._shareFileUrl.bind(this) });
  }

  render() {
    const url = this.props.navigation.getParam('url', {});
    const title = this.props.navigation.getParam('title', '');
    return (
      <View style={{ flex: 1 }}>
        <View>
          <Text style={screenStyles.title_row}>{ title }</Text>
        </View>
        <WebView
          source={{ uri: url }}
          onLoad={() => this.hideSpinner()}
        />
        {this.state.visible && (
          <ActivityIndicator
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, }}
            size="large"
          />
        )}
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
