import React, {useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS, FONTS} from '../constants';
import normalize from '../utils/helpers/normalize';
import Txt from './micro/Txt';

const Input = props => {
  const {
    secureTextEntry,
    containerStyle,
    titleStyle,
    title,
    value,
    onChangeText,
    placeholder,
    placeholderTextColor,
    onFocus,
    onBlur,
    autoCapitalize,
    enterKeyHint,
    inputMode,
    keyboardType,
    multiline,
    numberOfLines,
    editable,
    maxLength,
    inputFieldHeight,
    onPress,
    rightIcon,
  } = props;

  const [isExpanded, setExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const onFocusFunction = () => {
    setIsFocused(true);
  };

  const onBlurFunction = () => {
    setIsFocused(false);
  };

  return (
    <View style={[styles.inputContainer, containerStyle]}>
      <Txt style={[styles.titleStyle, titleStyle]}>{title}</Txt>

      <View style={{flexDirection: 'row'}}>
        <TextInput
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            placeholderTextColor ? placeholderTextColor : COLORS.grayText
          }
          style={[
            styles.inputStyle,
            multiline && {
              height: inputFieldHeight,
              textAlignVertical: 'top',
              marginTop: normalize(3),
            },
          ]}
          onFocus={onFocus ? onFocus : onFocusFunction}
          onBlur={onBlur ? onBlur : onBlurFunction}
          autoCapitalize={autoCapitalize}
          autoComplete="off"
          enterKeyHint={enterKeyHint}
          inputMode={inputMode}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
        />
        {rightIcon && (
          <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <Image source={rightIcon} style={[styles.arrowIcon]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    padding: normalize(10),
    borderRadius: normalize(10),
    width: '100%',
    backgroundColor: COLORS.white,
  },
  titleStyle: {
    color: COLORS.grayText,
    fontSize: Platform.OS === 'android' ? normalize(11) : normalize(10),
    fontFamily: FONTS.RalewayMedium,
  },
  inputStyle: {
    color: COLORS.black,
    fontSize: normalize(12),
    flex: 1,
    padding: 0,
    height: normalize(20),
    marginLeft: normalize(2),
  },
  arrowIcon: {
    height: normalize(18),
    width: normalize(18),
    marginLeft: normalize(10),
    resizeMode: 'contain',
    bottom: Platform.OS == 'ios' ? normalize(5) : normalize(6),
  },
});
