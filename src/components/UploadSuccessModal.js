import React from 'react';
import {Image, Modal, StyleSheet, Text, View} from 'react-native';
import {COLORS, FONTS, icons, SIZES} from '../constants';
import normalize from '../utils/helpers/normalize';

// components
import PrimaryButton from './PrimaryButton';

const UploadSuccessModal = props => {
  const {visible, onPress, title, description} = props;

  return (
    <Modal transparent={true} visible={visible}>
      <View style={styles.successContainer}>
        <Image source={icons.checkSelGreen} style={styles.check} />
        <Text style={styles.txt1}>{title}</Text>
        <Text style={styles.txt2}>{description}</Text>
        <PrimaryButton
          style={styles.successCloseBtn}
          onPress={() => onPress() || null}
          label="Continue"
        />
      </View>
    </Modal>
  );
};

export default UploadSuccessModal;

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  check: {
    width: normalize(85),
    height: normalize(85),
    resizeMode: 'contain',
  },
  txt1: {
    fontSize: normalize(20),
    fontFamily: FONTS.RalewayBold,
    color: COLORS.gondola,
    marginTop: normalize(5),
  },
  txt2: {
    fontSize: normalize(11),
    fontFamily: FONTS.RalewayRegular,
    color: COLORS.gondola,
    marginTop: normalize(3),
  },
  successCloseBtn: {
    width: SIZES.width * 0.3,
    marginTop: normalize(15),
    backgroundColor: COLORS.turquoise,
  },
});
