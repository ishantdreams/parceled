import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  TouchableHighlight,
  TouchableNativeFeedback,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Image } from 'react-native-animatable';
const WIDTH = Dimensions.get('window').width;

export default class GalleryImage extends Component {
  render() {
    const { uri, index, onPress } = this.props;

    return (
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#fff"
        onPress={() => onPress(index)}
        style={{
          backgroundColor: 'transparent',
          height: 80,
          width: WIDTH / 4,
          marginRight: 20,
        }}
      >
        <Image
          animation={'bounceIn'}
          delay={100 * index}
          duration={500}
          source={{uri: uri}}
          style={{
            height: 80,
            borderRadius: 5,
            left: 0,
            position: 'absolute',
            resizeMode: 'cover',
            top: 0,
            width: WIDTH / 3,
          }}
        />
      </TouchableHighlight>
    );
  }
}
GalleryImage.propTypes = {
  uri: PropTypes.string,
  index: PropTypes.number,
  onPress: PropTypes.func,
};
