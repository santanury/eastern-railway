import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import {forgotPasswordNewPasswordRequest} from '../../redux/reducers/AuthReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import Header from '../../components/Header';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const NewPassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/forgotPasswordNewPasswordRequest':
          setLoading(true);
          break;
        case 'Auth/forgotPasswordNewPasswordSuccess':
          setLoading(false);
          navigation.navigate('Login');
          break;
        case 'Auth/forgotPasswordNewPasswordFailure':
          setLoading(false);
          break;
      }
    }, [AuthReducer.status]),
  );

  const onPressSendOTP = () => {
    ConnectionRequest()
      .then(() => {
        newPassword !== confirmPassword
          ? Toast('Passwords do not match')
          : newPassword?.length < 8 || confirmPassword?.length < 8
          ? Toast('Password must be at least 8 characters')
          : !constants.PASSWORD_REGEX.test(newPassword)
          ? Toast(
              'Must include at least 1 uppercase, 1 lowercase letter, 1 number, and 1 special character',
            )
          : dispatch(
              forgotPasswordNewPasswordRequest({
                email: route?.params?.email,
                new_password: newPassword,
                confirm_password: confirmPassword,
              }),
            );
      })
      .catch(() => {
        Toast('Please check your internet connection');
      });
  };

  return (
    <ImageBackground style={styles.bgContainer} source={images.splashBg}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}
            contentContainerStyle={{alignItems: 'center'}}>
            <Header />
            <View style={styles.infoCont}>
              <View style={styles.logoCont}>
                <Image source={icons.HomeLogo} style={styles.logo} />
              </View>
              <Text style={styles.txt1}>Create New Password</Text>
              <Text style={styles.txt2}>
                Please enter your new password to reset your account
              </Text>

              <Input
                onPress={() => setShowNewPassword(!showNewPassword)}
                secureTextEntry={!showNewPassword}
                rightIcon={showNewPassword ? icons.eyeOn : icons.eyeOff}
                value={newPassword}
                onChangeText={setNewPassword}
                title="New Password"
                placeholder="Enter New Password"
                titleStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.RalewayMedium,
                  fontWeight: '600',
                }}
                containerStyle={{marginBottom: normalize(10)}}
              />

              <Input
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                secureTextEntry={!showConfirmPassword}
                rightIcon={showConfirmPassword ? icons.eyeOn : icons.eyeOff}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                title="Confirm Password"
                placeholder="Enter Confirm Password"
                titleStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.RalewayMedium,
                  fontWeight: '600',
                }}
                containerStyle={{marginBottom: normalize(10)}}
              />

              <PrimaryButton
                loading={loading}
                label="Confirm"
                onPress={() => onPressSendOTP()}
                style={{marginTop: SIZES.paddingMd}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  bgContainer: {height: SIZES.height, width: SIZES.width},
  container: {flex: 1, alignItems: 'center', width: '100%'},
  scrollCont: {flex: 1, width: '100%', paddingHorizontal: normalize(20)},
  infoCont: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.paddingSm,
    padding: SIZES.paddingMd,
    paddingTop: normalize(55),
    alignItems: 'center',
    marginTop: SIZES.infoContainerMargin,
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
