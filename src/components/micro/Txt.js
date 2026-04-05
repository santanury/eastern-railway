// CustomText.js
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {COLORS, FONTS} from '../../constants';
import normalize from '../../utils/helpers/normalize';

export default function Txt(props) {
  return (
    <Text
      numberOfLines={props?.numberOfLines}
      style={[styles.defaultStyle, props.style]}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
    color: COLORS.black,
    fontSize: normalize(12),
    fontFamily: FONTS.RalewayRegular,
  },
});
