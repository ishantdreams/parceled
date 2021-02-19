import {observable} from 'mobx';
import {inject, observer} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import * as css from '../../Assets/Styles';
import {scale} from '../../Services/ResponsiveScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {lightColors, darkColors} from '../../Assets/Themes/colorThemes';
import autobind from 'autobind-decorator';

@inject('parcelStore', 'themeStore')
@autobind
@observer
export default class NotesView extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
  });

  @observable loading = false;
  @observable notes = '';
  @observable cherreParcelData = null;

  constructor(props) {
    super(props);
    this.state = {
      isDark: false,
    };
  }

  componentDidMount() {
    this.notes = this.props.navigation.getParam('notes', '');
    this.props.navigation.addListener('willFocus', () => {
      this._initialCall();
    });
  }

  _initialCall = async () => {
    let isDarkThemeEnabled = await this.props.themeStore._checkAppTheme();
    console.log(' isDarkThemeEnabled ', '@@ ' + isDarkThemeEnabled);
    if (
      isDarkThemeEnabled === undefined ||
      isDarkThemeEnabled === null ||
      isDarkThemeEnabled === false
    ) {
      this.setState({isDark: false});
    } else {
      this.setState({isDark: true});
    }

    console.log('isDarkEnable@@@@ ', '@@@@' + this.state.isDark);
  };

  _updateNotes(text) {
    this.notes = text;
  }

  renderCherreParcelDetails() {
    const screenStyles = StyleSheet.create({
      container: {
        alignItems: 'center',
      },
      viewcontainer: {
        flex: 1,
        backgroundColor: this.state.isDark
          ? darkColors.background
          : lightColors.background,
      },
      title_row: {
        marginHorizontal: 15,
        fontSize: scale(18),
        fontWeight: '500',
        fontFamily: css.Fonts.openSans,
        color: this.state.isDark ? darkColors.textColor : lightColors.textColor,
        marginBottom: 5,
        marginTop: 5,
        alignSelf: 'center',
      },
      title_button: {
        fontSize: scale(16),
        fontWeight: '400',
        fontFamily: css.Fonts.openSans,
        color: 'tomato',
        marginLeft: 8,
      },
      toolbar: {
        height: 64,
        flexDirection: 'row',
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: '#D3D3D3',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
      },
    });

    const commonInputProps = {
      style: [
        screenStyles.input,
        screenStyles.sub_txt,
        css.baseStyles.greyFont,
      ],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none',
    };
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={screenStyles.viewcontainer}>
          <StatusBar
            barStyle={this.state.isDark ? 'light-content' : 'dark-content'}
            hidden={false}
            backgroundColor={css.colors.theme}
            translucent={false}
          />
          <View style={screenStyles.toolbar}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
                activeOpacity={0.6}
                onPress={() => {
                  this.props.navigation.pop();
                }}>
                <Image
                  resizeMode={'contain'}
                  // style={{height: 15, width: 15}}
                  style={{
                    tintColor: this.state.isDark
                      ? darkColors.textColor
                      : lightColors.textColor,
                  }}
                  source={require('../../Assets/Images/back_arrow.png')}
                />
              </TouchableOpacity>

              <Text style={screenStyles.title_row}>{'Notes'}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                this.props.navigation.state.params.returnFromNote(this.notes);
                this.props.navigation.goBack();
              }}>
              <Text style={screenStyles.title_button}>Save</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            style={{height: '50%', paddingHorizontal: 10, paddingVertical: 10}}
            behavior="padding">
            <TextInput
              {...commonInputProps}
              placeholder="Write a Note"
              onChangeText={text => this._updateNotes(text)}
              multiline={true}
              // blurOnSubmit={true}
              value={this.notes}
              underlineColorAndroid="transparent"
              // returnKeyType="done"
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }

  render() {
    return <Fragment>{this.renderCherreParcelDetails()}</Fragment>;
  }
}
