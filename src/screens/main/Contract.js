import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Pdf from 'react-native-pdf';
import {COLORS, FONTS, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import normalize from '../../utils/helpers/normalize';

// components
import {useSelector} from 'react-redux';
import Header from '../../components/Header';
import NoData from '../../components/NoData';
import constants from '../../utils/helpers/constants';

const Contract = ({navigation, route}) => {
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;
  const [agreement, setAgreement] = useState('');

  useEffect(() => {
    const contractDocument = userResponse?.data?.contract_document;
    if (contractDocument) {
      if (contractDocument.endsWith('.pdf')) {
        setAgreement(
          constants.BASE_URL +
            '/uploads/user/contract_document/' +
            userResponse?.data?.contract_document,
        );
      }
    }
  }, []);

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Header title="Station Contract" />
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}>
            <View
              style={[globalStyle.WhiteContainer, {justifyContent: 'center'}]}>
              {agreement.length > 0 ? (
                <Pdf
                  source={{
                    uri: agreement,
                    cache: true,
                  }}
                  onLoadComplete={(numberOfPages, filePath) =>
                    console.log(`Number of pages: ${numberOfPages}`)
                  }
                  onPageChanged={(page, numberOfPages) =>
                    console.log(`Current page: ${page}`)
                  }
                  onError={error => console.log(error)}
                  onPressLink={uri => console.log(`Link pressed: ${uri}`)}
                  style={styles.pdf}
                  trustAllCerts={false}
                />
              ) : (
                <NoData />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Contract;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  boldText: {fontFamily: FONTS.RobotoMedium},
  redTxt: {
    fontFamily: FONTS.RobotoMedium,
    color: COLORS.sushi,
    marginTop: normalize(2),
    fontSize: normalize(11),
  },
  lineStyle: {
    padding: 0.5,
    backgroundColor: COLORS.border,
    marginTop: normalize(8),
    marginBottom: normalize(8),
  },
  HeaderText: {
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(12),
  },
  smallTxt: {
    fontFamily: FONTS.RobotoRegular,
    marginTop: normalize(4),
    fontSize: normalize(10),
    lineHeight: normalize(15),
    color: COLORS.emparor,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
