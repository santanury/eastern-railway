import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import {
  authStatusBreak,
  forgotPasswordOtpVerificationRequest,
  forgotPasswordRequest,
} from '../../redux/reducers/AuthReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import normalize from '../../utils/helpers/normalize';

// components
import Header from '../../components/Header';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const OTPVerification = ({navigation, route}) => {
  const dispatch = useDispatch();
  const AuthReducer = useSelector(state => state.AuthReducer);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const timerRef = useRef(null);

  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [coolDown, setCoolDown] = useState(60);

  useFocusEffect(
    useCallback(() => {
      switch (AuthReducer.status) {
        case 'Auth/forgotPasswordOtpVerificationRequest':
          setLoading(true);
          break;
        case 'Auth/forgotPasswordOtpVerificationSuccess':
          navigation.replace('NewPassword', {email: route?.params?.email});
          setLoading(false);
          break;
        case 'Auth/forgotPasswordOtpVerificationFailure':
          setPin1('');
          setPin2('');
          setPin3('');
          setPin4('');
          setLoading(false);
          break;

        case 'Auth/forgotPasswordRequest':
          setResending(true);
          setCoolDown(60);
          break;
        case 'Auth/forgotPasswordSuccess':
          setResending(false);
          dispatch(authStatusBreak());
          startTimer();
          break;
        case 'Auth/forgotPasswordFailure':
          setResending(false);
          break;
      }
    }, [AuthReducer.status]),
  );

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (coolDown === 0) {
      clearInterval(timerRef.current);
    }
  }, [coolDown]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCoolDown(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timerRef.current);
          return 0;
        }
      });
    }, 1000);
  };

  const onPressVerify = () => {
    ConnectionRequest()
      .then(() => {
        let otp = pin1 + pin2 + pin3 + pin4;
        dispatch(
          forgotPasswordOtpVerificationRequest({
            email: route?.params?.email,
            otp,
          }),
        );
      })
      .catch(() => {
        Toast('Please check your internet connection');
      });
  };

  const onPressResendOTP = () => {
    if (coolDown === 0) {
      ConnectionRequest()
        .then(() =>
          dispatch(forgotPasswordRequest({email: route?.params?.email})),
        )
        .catch(() => {
          Toast('Please check your internet connection');
        });
    }
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
              <Text style={styles.txt1}>Verify OTP</Text>
              <Text style={styles.txt2}>
                Please enter the OTP sent to your email address
              </Text>

              <View style={styles.otpCont}>
                <TextInput
                  keyboardType="numeric"
                  ref={inputRef1}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        pin1.length > 0 ? COLORS.black : COLORS.border,
                    },
                  ]}
                  value={pin1}
                  onChangeText={text => {
                    setPin1(text?.length >= 1 ? text[text?.length - 1] : text);
                    if (text?.length > 0) {
                      inputRef2.current.focus();
                    } else {
                      inputRef1.current.focus();
                    }
                  }}
                />
                <TextInput
                  keyboardType="numeric"
                  ref={inputRef2}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        pin2.length > 0 ? COLORS.black : COLORS.border,
                    },
                  ]}
                  value={pin2}
                  onChangeText={text => {
                    setPin2(text?.length >= 1 ? text[text?.length - 1] : text);
                    if (text?.length > 0) {
                      inputRef3.current.focus();
                    } else {
                      inputRef1.current.focus();
                    }
                  }}
                />
                <TextInput
                  keyboardType="numeric"
                  ref={inputRef3}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        pin3.length > 0 ? COLORS.black : COLORS.border,
                    },
                  ]}
                  value={pin3}
                  onChangeText={text => {
                    setPin3(text?.length >= 1 ? text[text?.length - 1] : text);
                    if (text?.length > 0) {
                      inputRef4.current.focus();
                    } else {
                      inputRef2.current.focus();
                    }
                  }}
                />
                <TextInput
                  keyboardType="numeric"
                  ref={inputRef4}
                  style={[
                    styles.input,
                    {
                      borderColor:
                        pin4.length > 0 ? COLORS.black : COLORS.border,
                    },
                  ]}
                  value={pin4}
                  onChangeText={text => {
                    setPin4(text?.length >= 1 ? text[text?.length - 1] : text);
                    if (text?.length > 0) {
                      inputRef4.current.focus();
                    } else {
                      inputRef3.current.focus();
                    }
                  }}
                />
              </View>

              <TouchableOpacity
                disabled={resending || coolDown > 0}
                onPress={() => onPressResendOTP()}>
                <Text style={[styles.txt2, {marginBottom: 0}]}>
                  {resending
                    ? 'Resending ...'
                    : coolDown > 0
                    ? `Resend in ${coolDown} seconds`
                    : 'Resend OTP'}
                </Text>
              </TouchableOpacity>

              <PrimaryButton
                loading={loading}
                label="Verify"
                onPress={() => onPressVerify()}
                style={{marginTop: SIZES.paddingMd}}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OTPVerification;

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
  otpCont: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: normalize(10),
  },
  input: {
    width: normalize(40),
    height: normalize(40),
    borderWidth: normalize(1),
    borderRadius: normalize(5),
    textAlign: 'center',
    // fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(14),
    color: COLORS.black,
  },
});
