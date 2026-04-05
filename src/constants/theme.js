import {Dimensions, StatusBar} from 'react-native';
import normalize from '../utils/helpers/normalize';

const {width, height, fontScale} = Dimensions.get('window');
const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export const FONTS = {
  //   RALEWAY
  RalewayBlack: 'Raleway-Black',
  RalewayBlackItalic: 'Raleway-BlackItalic',
  RalewayBold: 'Raleway-Bold',
  RalewayBoldItalic: 'Raleway-BoldItalic',
  RalewayExtraBold: 'Raleway-ExtraBold',
  RalewayExtraBoldItalic: 'Raleway-ExtraBoldItalic',
  RalewayExtraLight: 'Raleway-ExtraLight',
  RalewayExtraLightItalic: 'Raleway-ExtraLightItalic',
  RalewayItalic: 'Raleway-Italic',
  RalewayLight: 'Raleway-Light',
  RalewayLightItalic: 'Raleway-LightItalic',
  RalewayMedium: 'Raleway-Medium',
  RalewayMediumItalic: 'Raleway-MediumItalic',
  RalewayRegular: 'Raleway-Regular',
  RalewaySemiBold: 'Raleway-SemiBold',
  RalewaySemiBoldItalic: 'Raleway-SemiBoldItalic',
  RalewayThin: 'Raleway-Thin',
  RalewayThinItalic: 'Raleway-ThinItalic',
  //   ROBOTO
  RobotoBlack: 'Roboto-Black',
  RobotoBlackItalic: 'Roboto-BlackItalic',
  RobotoBold: 'Roboto-Bold',
  RobotoBoldItalic: 'Roboto-BoldItalic',
  RobotoItalic: 'Roboto-Italic',
  RobotoLight: 'Roboto-Light',
  RobotoLightItalic: 'Roboto-LightItalic',
  RobotoMedium: 'Roboto-Medium',
  RobotoMediumItalic: 'Roboto-MediumItalic',
  RobotoRegular: 'Roboto-Regular',
  RobotoThin: 'Roboto-Thin',
  RobotoThinItalic: 'Roboto-ThinItalic',
};

export const COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  emparor: '#565454',
  tiber: '#052731',
  alizarinCrimson: '#ED1D24',
  sushi: '#8AB742',
  gondola: '#130B0B',
  turquoise: '#42EA9F',
  transparent: 'transparent',
  border: '#EDECF3',
  grayText: '#ACB3AF',
};

export const SIZES = {
  width,
  height,
  fontScale,
  STATUSBAR_HEIGHT,
  paddingSm: normalize(10),
  paddingMd: normalize(15),
  paddingLg: normalize(20),
  paddingHuge: normalize(25),
  infoContainerMargin: normalize(55),
};

const appTheme = {
  FONTS,
  COLORS,
  SIZES,
};
