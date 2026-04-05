import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS, SIZES} from '../constants';
import normalize from '../utils/helpers/normalize';

const PrimaryButton = props => {
  const {label, onPress, style, loading} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={loading}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: loading ? COLORS.sushi + 99 : COLORS.sushi,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.sushi,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.paddingSm,
    paddingVertical: normalize(17),
  },
  label: {
    fontFamily: FONTS.RalewaySemiBold,
    color: COLORS.white,
    fontSize: normalize(12),
  },
});
