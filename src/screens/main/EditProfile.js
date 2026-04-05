import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  getUserRequest,
  updateUserRequest,
  userStatusBreak,
} from '../../redux/reducers/UserReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
import {requestPermission} from '../../utils/helpers/PermissionHangler';

// component
import Header from '../../components/Header';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const EditProfile = ({navigation, route}) => {
  const OsVer = Platform.constants['Release'];
  const dispatch = useDispatch();
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;

  const [showPickOption, setShowPickOption] = useState(false);
  const [profileImage, setProfileImage] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userResponse?.data?.fullName && setName(userResponse?.data?.fullName);
    userResponse?.data?.email && setEmail(userResponse?.data?.email);
    userResponse?.data?.phone && setPhone(userResponse?.data?.phone);
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (UserReducer.status) {
        case 'User/updateUserRequest':
          setLoading(true);
          break;
        case 'User/updateUserSuccess':
          setLoading(false);
          ConnectionRequest()
            .then(() => dispatch(getUserRequest()))
            .catch(() => Toast('Please check your internet connection'));
          break;
        case 'User/updateUserFailure':
          setLoading(false);
          break;
        case 'User/getUserRequest':
          break;
        case 'User/getUserSuccess':
          dispatch(userStatusBreak());
          navigation.goBack();
          break;
        case 'User/getUserFailure':
          break;
      }
    }, [UserReducer.status]),
  );

  // get camera permission
  const getCameraPermission = async () => {
    const hasPermission = await requestPermission('camera');
    if (hasPermission) {
      takePhoto();
    }
  };

  // take photo from camera
  const takePhoto = async () => {
    ImageCropPicker.openCamera({
      width: 2048,
      height: 2048,
      cropping: true,
      // includeBase64: true,
    })
      .then(image => {
        const imageObject = {
          uri: image?.path,
          type: image?.mime,
          name: image?.path?.substring(image?.path?.lastIndexOf('-') + 1),
        };

        setProfileImage(imageObject);
      })
      .catch(error => console.log('error', error));
  };

  // get media image permission
  const getMediaImagePermission = async () => {
    const hasPermission = await requestPermission('media', 'read');
    if (hasPermission) {
      chooseFromLibrary();
    }
  };

  // choose image from library
  const chooseFromLibrary = async () => {
    ImageCropPicker.openPicker({
      width: 2048,
      height: 2048,
      cropping: true,
    })
      .then(image => {
        const obj = {
          uri: image?.path,
          type: image?.mime,
          name: 'profile_picture',
        };
        setProfileImage(obj);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const onPressSaveChanges = () => {
    !name
      ? Toast('Please enter your name')
      : !email
      ? Toast('Please enter your email')
      : !constants.EMAIL_REGEX.test(email)
      ? Toast('Please enter valid email')
      : !phone
      ? Toast('Please enter your phone number')
      : phone.length < 10 || phone.length > 10
      ? Toast('Please enter valid phone number')
      : ConnectionRequest()
          .then(() => {
            let formData = new FormData();
            formData.append('fullName', name);
            formData.append('email', email);
            formData.append('phone', phone);
            Object?.keys(profileImage)?.length > 0 &&
              formData.append('profile_image', profileImage);
            dispatch(updateUserRequest(formData));
          })
          .catch(() => Toast('Please check your internet connection'));
  };

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Header onPress={() => navigation.goBack()} title="Edit Profile" />
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}>
            <View style={globalStyle.WhiteContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowPickOption(true)}
                style={styles.picContainer}>
                <View>
                  <ImageBackground
                    source={
                      profileImage?.uri
                        ? {uri: profileImage?.uri}
                        : userResponse?.data?.profile_image
                        ? {
                            uri:
                              constants.BASE_URL +
                              `/uploads/user/profile_pic/` +
                              userResponse?.data?.profile_image,
                          }
                        : images.avatar
                    }
                    imageStyle={{
                      borderRadius: normalize(15),
                      resizeMode: 'cover',
                    }}
                    style={styles.profileStyle}>
                    <Image
                      source={icons.editCamera}
                      style={[styles.editIconstyle]}
                    />
                  </ImageBackground>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  marginTop: normalize(30),
                  paddingHorizontal: normalize(10),
                }}>
                <Input
                  value={name}
                  onChangeText={setName}
                  title={
                    userResponse?.data?.role?.role === 'contractor'
                      ? "Firm's Name"
                      : userResponse?.data?.role?.role === 'supervisor'
                      ? 'Supervisor Name'
                      : ''
                  }
                  placeholder="Enter supervisor name"
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                />
                <Input
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  title="Email Address"
                  placeholder="Enter email address"
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                  containerStyle={{marginTop: normalize(10)}}
                />
                <Input
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  title="Primary Phone Number"
                  placeholder="Enter phone number"
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: FONTS.RalewayMedium,
                    fontWeight: '600',
                  }}
                  containerStyle={{marginTop: normalize(10)}}
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
                  onPress={() => onPressSaveChanges()}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal animationType="slide" transparent={true} visible={showPickOption}>
        <Pressable
          onPress={() => setShowPickOption(false)}
          style={styles.transparentSec}>
          <Pressable onPress={() => {}} style={styles.buttonContainer}>
            <PrimaryButton
              label="Take Photo"
              onPress={() => {
                getCameraPermission();
                setShowPickOption(false);
              }}
            />
            <PrimaryButton
              style={{marginTop: normalize(20)}}
              label="Choose from Library"
              onPress={() => {
                getMediaImagePermission();
                setShowPickOption(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal transparent={true} visible={loading}>
        <View style={styles.loaderModalCont}>
          <ActivityIndicator size="large" color={COLORS.sushi} />
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  picContainer: {justifyContent: 'center', alignItems: 'center'},
  profileStyle: {
    height: normalize(150),
    width: normalize(150),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconstyle: {
    height: normalize(35),
    width: normalize(35),
    resizeMode: 'contain',
  },
  loaderModalCont: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transparentSec: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    width: '100%',
    padding: normalize(20),
  },
});
