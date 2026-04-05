import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

import {
  authStatusBreak,
  changePasswordRequest,
} from '../../redux/reducers/AuthReducer';

// component
import Header from '../../components/Header';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const ChangePassword = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [oldPassword, setOldPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/changePasswordRequest':
          setLoading(true);
          break;
        case 'Auth/changePasswordSuccess':
          setLoading(false);
          dispatch(authStatusBreak());
          navigation.goBack();
          break;
        case 'Auth/changePasswordFailure':
          setLoading(false);
          break;
      }
    }, [AuthReducer.status]),
  );

  const onPressChangePassword = () => {
    !oldPassword
      ? Toast('Please enter old password')
      : !newPassword
      ? Toast('Please enter new password')
      : !confirmPassword
      ? Toast('Please enter confirm password')
      : newPassword?.length < 8 || confirmPassword?.length < 8
      ? Toast('Password must be at least 8 characters')
      : !constants.PASSWORD_REGEX.test(newPassword)
      ? Toast(
          'Must include at least 1 uppercase, 1 lowercase letter, 1 number, and 1 special character',
        )
      : ConnectionRequest()
          .then(() =>
            dispatch(
              changePasswordRequest({
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
              }),
            ),
          )
          .catch(() => Toast('Please check your internet connection'));
  };

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Header onPress={() => navigation.goBack()} title="Change Password" />
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}>
            <View style={[globalStyle.WhiteContainer, {paddingTop: 0}]}>
              <View style={{paddingHorizontal: normalize(10)}}>
                <Input
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  title="Current Password"
                  placeholder="Enter current password"
                  secureTextEntry={!showOldPassword}
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                  containerStyle={{marginTop: normalize(10)}}
                  rightIcon={showOldPassword ? icons.eyeOn : icons.eyeOff}
                  onPress={() => setShowOldPassword(!showOldPassword)}
                />

                <Input
                  value={newPassword}
                  onChangeText={setNewPassword}
                  title="New Password"
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                  containerStyle={{marginTop: normalize(10)}}
                  rightIcon={showNewPassword ? icons.eyeOn : icons.eyeOff}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />

                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  title="Confirm Password"
                  placeholder="Enter confirm password"
                  secureTextEntry={!showConfirmPassword}
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                  containerStyle={{marginTop: normalize(10)}}
                  rightIcon={showConfirmPassword ? icons.eyeOn : icons.eyeOff}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: normalize(10),
                  marginHorizontal: normalize(10),
                }}>
                <PrimaryButton
                  loading={loading}
                  label="Save Changes"
                  onPress={() => onPressChangePassword()}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  picContainer: {justifyContent: 'center', alignItems: 'center'},
});
