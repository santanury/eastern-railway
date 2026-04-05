import React, {useCallback, useEffect} from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, icons, images, SIZES} from '../../constants';
import {
  getTokenRequest,
  userCheckRequest,
} from '../../redux/reducers/AuthReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import normalize from '../../utils/helpers/normalize';

// components
import Toast from '../../components/Toast';

const Splash = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);

  useEffect(() => {
    setTimeout(() => {
      ConnectionRequest()
        .then(() => dispatch(getTokenRequest()))
        .catch(() => Toast('Please check your internet connection'));
    }, 1000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/getTokenRequest':
          break;
        case 'Auth/getTokenSuccess':
          ConnectionRequest()
            .then(() => dispatch(userCheckRequest()))
            .catch(() => Toast('Please check your internet connection'));
          break;
        case 'Auth/getTokenFailure':
          navigation.navigate('Introduction');
          break;
        case 'Auth/userCheckRequest':
          break;
        case 'Auth/userCheckSuccess':
          break;
        case 'Auth/userCheckFailure':
          navigation.navigate('Introduction');
          break;
      }
    }, [AuthReducer.status]),
  );

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
    height: SIZES.height,
    width: SIZES.width,
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
