import React from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';

import {COLORS, icons, images} from '../../constants';
import normalize from '../../utils/helpers/normalize';

const Splash = ({navigation, route}) => {
  return (
    <ImageBackground style={styles.bgContainer} source={images.splashBg}>
      <View style={styles.logoCont}>
        <Image style={styles.logo} source={icons.HomeLogo} />
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCont: {
    borderRadius: normalize(20),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logo: {
    width: normalize(80),
    height: normalize(80),
    resizeMode: 'contain',
  },
});
