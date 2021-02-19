import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {StyleSheet, View, Text, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';
import {scale} from '../../Services/ResponsiveScreen';
import * as css from '../../Assets/Styles';

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96,
  },
  image: {
    width: scale(350),
    height: scale(340),
    marginBottom: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontFamily: css.Fonts.openSans,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: css.Fonts.openSans,
  },
});

const slides = [
  {
    key: 'one',
    title: 'Parcel Maps',
    text: 'Visually see parcel boundaries.',
    image: require('../../Assets/Images/intro_1.png'),
    colors: ['#f28e46', '#EE6F2E'],
  },
  {
    key: 'two',
    title: 'Property Details',
    text: 'Hover over a parcel to see property details.',
    image: require('../../Assets/Images/intro_2.png'),
    colors: ['#f28e46', '#EE6F2E'],
  },
  {
    key: 'three',
    title: 'Watchlist',
    text: 'View and save parcels for later.',
    image: require('../../Assets/Images/intro_3.png'),
    colors: ['#f28e46', '#EE6F2E'],
  },
];

export default class AppIntro extends Component {
  _renderItem = ({item, dimensions}) => (
    <LinearGradient
      style={[styles.mainContent, dimensions]}
      colors={item.colors}
      start={{x: 0, y: 0.1}}
      end={{x: 0.1, y: 1}}>
      <Image source={item.image} style={styles.image} />
      <View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </LinearGradient>
  );

  _onDone() {
    this._appIntroComplete();
    this.props.navigation.navigate('App');
  }

  _appIntroComplete = async () => {
    await AsyncStorage.setItem('appIntroRun', 'abc');
  };

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        bottomButton
        onDone={this._onDone.bind(this)}
      />
    );
  }
}
