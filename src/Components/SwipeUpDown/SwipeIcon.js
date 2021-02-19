import React, { Component } from 'react';
import { Image, View, Animated } from 'react-native';
import images from '../../Assets/Images';

export default class SwipeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: images.minus,
      showIcon: false
    };
  }
  componentDidMount() {
    this.props.hasRef && this.props.hasRef(this);
  }

  toggleShowHide(val) {
    this.setState({ showIcon: val });
  }

  render() {
    const { icon, showIcon } = this.state;
    return (
      <View style={{ alignItems: 'center', height: 5, marginBottom: 2 }}>
        {showIcon && (
          <Image
            source={icon}
            style={{ width: 35, height: icon === images.minus ? 5 : 10 }}
          />
        )}
      </View>
    );
  }
}
