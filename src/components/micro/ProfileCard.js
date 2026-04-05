import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {COLORS, FONTS, icons} from '../../constants';
import normalize from '../../utils/helpers/normalize';
import Txt from './Txt';

const ProfileCard = ({IconType, Title, onPress}) => {
  return (
    <View>
      <View style={[styles.container]}>
        <View style={{flexDirection: 'row'}}>
          <Image source={IconType} style={[styles.iconStyle]} />
          <Txt style={[styles.titleStyle]}>{Title}</Txt>
        </View>
        <TouchableOpacity onPress={onPress}>
          <Image source={icons.arrowBack} style={[styles.arrorBckStyle]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    padding: normalize(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: normalize(16),
    borderRadius: normalize(5),
    marginTop: normalize(5),
  },
  arrorBckStyle: {
    width: normalize(25),
    height: normalize(25),
    resizeMode: 'contain',
  },
  iconStyle: {
    width: normalize(20),
    height: normalize(20),
    resizeMode: 'contain',
  },
  titleStyle: {
    marginLeft: normalize(15),
    fontFamily: FONTS.RalewayMedium,
    fontWeight: '600',
    alignSelf: 'center',
  },
});
