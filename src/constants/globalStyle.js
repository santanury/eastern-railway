import {Dimensions, Platform, StyleSheet} from 'react-native';
import normalize from '../utils/helpers/normalize';
import {COLORS} from './theme';

export const width = Dimensions.get('screen').width;
export const height = Dimensions.get('screen').height;

const globalStyle = StyleSheet.create({
  logoStyle: {
    height: normalize(40),
    width: normalize(40),
    resizeMode: 'contain',
  },
  profileStyle: {
    height: normalize(30),
    width: normalize(30),
    borderRadius: normalize(100),
    resizeMode: 'cover',
  },
  WhiteContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    height: Platform.OS === 'ios' ? height * 0.8 : height * 0.82,
    borderRadius: normalize(10),
    paddingTop: normalize(20),
  },
});

export default globalStyle;
