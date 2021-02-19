import React, {PureComponent} from 'react';
import {
  View,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {lightColors, darkColors} from '../Assets/Themes/colorThemes';

export default class LocationItem extends PureComponent {
  _handlePress = async () => {
    Keyboard.dismiss();
    this.props.clearSearch();
    const res = await this.props.fetchDetails(this.props.place_id);
    const {location} = res.geometry;
    const latitude = location.lat;
    const longitude = location.lng;
    this.props.update(latitude, longitude);
    this.props.isDataEmpty(false);
  };

  render() {
    const {isDark} = this.props;

    const styles = StyleSheet.create({
      root: {
        height: 50,
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: isDark
          ? darkColors.background
          : lightColors.background,
        zIndex: 40,
        borderColor: 'lightgray',
      },
      textStyle: {
        color: isDark ? darkColors.textColor : lightColors.textColor,
      },
    });
    return (
      <TouchableOpacity style={styles.root} onPress={this._handlePress}>
        <Text style={styles.textStyle}>{this.props.description}</Text>
      </TouchableOpacity>
    );
  }
}
