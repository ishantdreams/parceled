import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import ImageViewer from '@dwqs/react-native-image-viewer';
import GalleryImage from './GalleryImage';

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      shown: false,
    };
  }

  openLightbox(index){
    this.setState({
      index,
      shown: true,
    });
  }

  hideLightbox(){
    this.setState({
      index: 0,
      shown: false,
    });
  }

  _renderImages(images){
    return images.map((image, idx) => {
      return (
        <GalleryImage
          index={idx}
          key={idx}
          onPress={this.openLightbox.bind(this)}
          uri={image.thumb_image_url}
        />
      );
    })
  }

  _imagesToJS(images){
    return images.map((image, idx) => {
      return (image.list_image_url)
    })
  }

  render() {
    const { images } = this.props;
    const { index, shown } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {this._renderImages(images)}
        <ImageViewer
          shown={shown}
          imageUrls={this._imagesToJS(images)}
          onClose={this.hideLightbox.bind(this)}
          index={index}
        />
      </View>
    );
  }
}
Gallery.propTypes = {
  images: PropTypes.array,
};
