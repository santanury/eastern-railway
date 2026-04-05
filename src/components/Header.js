import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {FONTS, icons} from '../constants';
import normalize from '../utils/helpers/normalize';
import Txt from './micro/Txt';

const Header = props => {
  const {title, noBack} = props;
  const navigation = useNavigation();
  const UserReducer = useSelector(state => state.UserReducer);

  return (
    <View style={styles.mainContainer}>
      <View style={{flex: 1}}>
        {!noBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={icons.arrowBack} style={styles.backBtn} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
      </View>
      <View style={styles.headerTxtCon}>
        <Txt style={styles.titleStyle}>{title}</Txt>
      </View>

      <View style={{flex: 1}} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    marginVertical: normalize(10),
  },
  backBtn: {
    height: normalize(30),
    width: normalize(30),
    transform: [{rotate: '180deg'}],
    resizeMode: 'contain',
  },
  titleStyle: {
    fontSize: normalize(13),
    color: 'white',
    fontFamily: FONTS.RalewayMedium,
    fontWeight: '600',
  },
  headerTxtCon: {justifyContent: 'center', alignItems: 'center', flex: 2},
});
