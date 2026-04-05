import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {images, SIZES} from '../constants';

const NoData = () => {
  return <Image source={images.noData} style={styles.img} />;
};

export default NoData;

const styles = StyleSheet.create({
  img: {
    height: SIZES.height * 0.5,
    width: SIZES.width * 0.5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
