import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import normalize from '../../utils/helpers/normalize';

// components
import PrimaryButton from '../../components/PrimaryButton';

const Introduction = ({navigation, route}) => {
  return (
    <ImageBackground style={styles.bgContainer} source={images.splashBg}>
      <SafeAreaView style={styles.safeCont}>
        <View style={styles.headingCont}>
          <Text style={styles.heading}>
            EnHMHWH
            <Text style={styles.smallHeading}>{`\nWelcomes You`}</Text>
          </Text>
        </View>

        <View style={styles.bottomCont}>
          <View style={styles.logoCont}>
            <Image source={icons.HomeLogo} style={styles.logo} />
          </View>
          <Text style={styles.txt2}>
            Small actions lead to a big impact recycle, reduce, reuse. Keep it
            clean, keep it safe maintain good housekeeping
          </Text>
          <PrimaryButton
            label="Get Started"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  bgContainer: {height: '100%', width: '100%'},
  safeCont: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  headingCont: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    marginTop: normalize(100),
    fontSize: normalize(35),
    color: COLORS.white,
    fontFamily: FONTS.RalewayBold,
    textAlign: 'center',
    width: '80%',
  },
  smallHeading: {
    fontSize: normalize(20),
  },
  bottomCont: {
    width: '95%',
    marginBottom: normalize(10),
    backgroundColor: COLORS.white,
    borderRadius: SIZES.paddingSm,
    padding: SIZES.paddingMd,
    paddingTop: normalize(55),
    alignItems: 'center',
  },
  logoCont: {
    alignSelf: 'center',
    position: 'absolute',
    top: -normalize(40),
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
  txt1: {
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(18),
    color: COLORS.gondola,
    marginBottom: SIZES.paddingSm,
  },
  txt2: {
    fontFamily: FONTS.RalewayRegular,
    fontSize: normalize(11),
    color: COLORS.emparor,
    textAlign: 'center',
    width: '80%',
    lineHeight: normalize(15),
    marginBottom: normalize(40),
  },
});
