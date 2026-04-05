import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {logoutRequest} from '../../redux/reducers/AuthReducer';
import {userStatusBreak} from '../../redux/reducers/UserReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import HomeHeader from '../../components/HomeHeader';
import ProfileCard from '../../components/micro/ProfileCard';
import Txt from '../../components/micro/Txt';
import Toast from '../../components/Toast';

const Profile = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;

  useEffect(() => {
    dispatch(userStatusBreak());
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/logoutRequest':
          break;
        case 'Auth/logoutSuccess':
          // navigation?.navigate('Login');
          break;
        case 'Auth/logoutFailure':
          break;
      }
    }, [AuthReducer.status]),
  );

  const onPressLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          ConnectionRequest()
            .then(() => dispatch(logoutRequest()))
            .catch(() => Toast('Please check your internet connection'));
        },
      },
    ]);
  };

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <HomeHeader backEnable={true} noAppTitle={true} />
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}>
            <View style={globalStyle.WhiteContainer}>
              <View style={styles.PicContainer}>
                <View>
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
                    style={styles.profileStyle}
                  />
                  <View style={{alignItems: 'center'}}>
                    <Txt style={styles.boldText}>
                      {userResponse?.data?.fullName}
                    </Txt>
                    <Txt style={styles.emailTxt}>
                      {userResponse?.data?.email}
                    </Txt>
                  </View>
                </View>
              </View>

              <View
                style={{
                  marginTop: normalize(15),
                  paddingHorizontal: normalize(10),
                }}>
                <ProfileCard
                  IconType={icons.userEdit}
                  Title="Edit Profile"
                  onPress={() => navigation?.navigate('EditProfile')}
                />
                <ProfileCard
                  IconType={icons.userEdit}
                  Title="Change Password"
                  onPress={() => navigation?.navigate('ChangePassword')}
                />
                {userResponse?.data?.role?.role === 'contractor' && (
                  <ProfileCard
                    IconType={icons.document}
                    Title="Contract Agreement"
                    onPress={() => navigation?.navigate('Contract')}
                  />
                )}
              </View>

              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <TouchableOpacity
                  onPress={() => onPressLogout()}
                  style={styles.logoutBtn}>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={icons.logout} style={[styles.iconStyle]} />
                    <Txt style={styles.titleStyle}>Logout</Txt>
                  </View>
                  <Image source={icons.down} style={styles.arrorBckStyle} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  profileStyle: {
    height: normalize(150),
    width: normalize(150),
    borderRadius: normalize(15),
    resizeMode: 'contain',
  },
  PicContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(15),
  },
  boldText: {
    fontFamily: FONTS.RalewayBold,
    marginTop: normalize(10),
  },
  emailTxt: {
    color: COLORS.darkGrey,
    marginTop: normalize(4),
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: normalize(16),
    borderRadius: normalize(5),
    marginVertical: normalize(10),
    marginHorizontal: normalize(10),
    padding: normalize(15),
  },
  arrorBckStyle: {
    width: normalize(20),
    height: normalize(20),
    resizeMode: 'contain',
    transform: [{rotate: '-90deg'}],
  },
  iconStyle: {
    width: normalize(30),
    height: normalize(30),
    resizeMode: 'contain',
  },
  titleStyle: {
    marginLeft: normalize(15),
    fontFamily: FONTS.RalewayMedium,
    fontWeight: '600',
    alignSelf: 'center',
  },
});
