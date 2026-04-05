import React, {useCallback, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import {signinRequest} from '../../redux/reducers/AuthReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import Header from '../../components/Header';
import Input from '../../components/Input';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const Login = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/signinRequest':
          setLoading(true);
          break;
        case 'Auth/signinSuccess':
          setLoading(false);
          break;
        case 'Auth/signinFailure':
          setLoading(false);
          break;
      }
    }, [AuthReducer.status]),
  );

  const onPressLogin = () => {
    ConnectionRequest()
      .then(res => {
        !email
          ? Toast('Please enter your Email')
          : !constants.EMAIL_REGEX.test(email)
          ? Toast('Please enter a valid Email')
          : !password
          ? Toast('Please enter your Password')
          : dispatch(signinRequest({email, password}));
      })
      .catch(err => Toast('Please check your internet connection'));
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
            <Header noBack={true} />
            <View style={styles.infoCont}>
              <View style={styles.logoCont}>
                <Image source={icons.HomeLogo} style={styles.logo} />
              </View>
              <Text style={styles.txt1}>Login To The Platform</Text>
              <Text style={styles.txt2}>Enter your credential to login</Text>

              <Input
                value={email}
                onChangeText={setEmail}
                title="Email"
                placeholder="Enter Email"
                titleStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.RalewayMedium,
                  fontWeight: '600',
                }}
                containerStyle={{marginBottom: normalize(10)}}
              />
              <Input
                onPress={() => setShowPassword(!showPassword)}
                secureTextEntry={!showPassword}
                rightIcon={showPassword ? icons.eyeOn : icons.eyeOff}
                value={password}
                onChangeText={setPassword}
                title="Password"
                placeholder="Enter Password"
                titleStyle={{
                  color: COLORS.black,
                  fontFamily: FONTS.RalewayMedium,
                  fontWeight: '600',
                }}
                containerStyle={{marginBottom: normalize(10)}}
              />

              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => navigation.navigate('ForgotPassword', {email})}>
                <Text style={styles.txt3}>Forgot Password?</Text>
              </TouchableOpacity>

              <PrimaryButton
                loading={loading}
                label="Login"
                onPress={() => onPressLogin()}
                style={{marginTop: SIZES.paddingMd}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  bgContainer: {height: SIZES.height, width: SIZES.width},
  container: {flex: 1, alignItems: 'center', width: '100%'},
  scrollCont: {flex: 1, width: '100%', paddingHorizontal: normalize(20)},
  infoCont: {
    width: '100%',
    height: SIZES.height * 0.7,
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
  txt3: {
    color: COLORS.tiber,
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(12),
  },
});
