import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images} from '../constants';
import globalStyle from '../constants/globalStyle';
import constants from '../utils/helpers/constants';
import normalize from '../utils/helpers/normalize';

// components
import Txt from './micro/Txt';

const HomeHeader = props => {
  const {backEnable, noAppTitle} = props;
  const navigation = useNavigation();
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;

  return (
    <View style={styles.container}>
      {backEnable ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.arrowBack} style={styles.backBtn} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.logoCont}
          activeOpacity={0.7}
          onPress={() => {
            if (userResponse?.data?.role?.role == 'supervisor') {
              navigation.navigate('SupervisorHome');
            }
            if (userResponse?.data?.role?.role == 'contractor') {
              navigation.navigate('ContractorHome');
            }
          }}>
          <Image source={icons.HomeLogo} style={globalStyle.logoStyle} />
        </TouchableOpacity>
      )}
      {!noAppTitle && <Text style={styles.appName}>{`EnHMHWH`}</Text>}

      <View style={styles.nameContainer}>
        <Txt style={styles.nameStyle}>{userResponse?.data?.fullName}</Txt>
        <Txt style={styles.dateStyle}>{moment().format('MMM DD, YYYY')}</Txt>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <Image
          source={
            userResponse?.data?.profile_image
              ? {
                  uri:
                    constants.BASE_URL +
                    `/uploads/user/profile_pic/` +
                    userResponse?.data?.profile_image,
                }
              : images.avatar
          }
          style={globalStyle.profileStyle}
        />
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: normalize(10),
    alignItems: 'center',
  },
  logoCont: {
    borderRadius: normalize(10),
    overflow: 'hidden',
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  nameStyle: {
    color: 'white',
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(13),
  },
  dateStyle: {
    color: 'white',
    fontSize: normalize(10),
    fontFamily: FONTS.RalewayMedium,
  },
  nameContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: normalize(10),
    flex: 1,
  },
  backBtn: {
    height: normalize(30),
    width: normalize(30),
    transform: [{rotate: '180deg'}],
    resizeMode: 'contain',
  },
  appName: {
    flex: 0.8,
    color: COLORS.white,
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(10),
    marginLeft: normalize(7),
  },
});
