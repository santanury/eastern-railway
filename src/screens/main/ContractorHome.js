import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useState} from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  filterAssignListRequest,
  stationStatusBreak,
} from '../../redux/reducers/StationReducer';
import {userStatusBreak} from '../../redux/reducers/UserReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import normalize from '../../utils/helpers/normalize';

// components
import HomeHeader from '../../components/HomeHeader';
import Input from '../../components/Input';
import Txt from '../../components/micro/Txt';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';

const TYPES = ['All', 'Dirty', 'Clean'];

const ContractorHome = ({navigation, route}) => {
  const dispatch = useDispatch();
  const UserReducer = useSelector(state => state.UserReducer);
  const StationReducer = useSelector(state => state.StationReducer);

  const [datePickerOpn, setDatePickerOpn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      switch (UserReducer.status) {
        case 'User/getUserRequest':
          break;
        case 'User/getUserSuccess':
          dispatch(userStatusBreak());
          break;
        case 'User/getUserFailure':
          break;
      }
    }, [UserReducer.status]),
  );

  useFocusEffect(
    useCallback(() => {
      switch (StationReducer.status) {
        case 'Station/filterAssignListRequest':
          setLoading(true);
          break;
        case 'Station/filterAssignListSuccess':
          setLoading(false);
          dispatch(stationStatusBreak());
          navigation.navigate('ContractorUploaded', {
            /*
                SENDING DATE AS FORMATTED STRING FOR FOLLOWING WARNING IN NEXT SCREEN:
                Non-serializable values were found in the navigation state. Check:
                ContractorUploaded > params.selectedDate (Mon Aug 19 2024 12:39:00 GMT+0530 (India Standard Time))
             */
            selectedDate: moment(selectedDate, '').format('DD-MM-YYYY'),
            selectedType,
          });
          break;
        case 'Station/filterAssignListFailure':
          setLoading(false);
          break;
      }
    }, [StationReducer.status]),
  );

  const onPressContinue = () => {
    !selectedDate
      ? Toast('Please select date')
      : !selectedType
      ? Toast('Please select area')
      : ConnectionRequest()
          .then(
            dispatch(
              filterAssignListRequest({
                date: moment(selectedDate, '').format('DD-MM-YYYY'),
                type: selectedType === 'All' ? '' : selectedType,
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
          <HomeHeader />
          <ScrollView // scrollable container
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollCont}>
            <View
              style={[
                globalStyle.WhiteContainer,
                {paddingHorizontal: normalize(10)},
              ]}>
              <Txt style={styles.txt1}>Explore Reports</Txt>
              <Txt style={styles.txt2}>Select filter to view results.</Txt>

              <>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDatePickerOpn(true)}>
                  <Input
                    value={
                      selectedDate
                        ? moment(selectedDate).format('MMMM DD, YYYY')
                        : ''
                    }
                    title="Select Date"
                    placeholder="Date"
                    rightIcon={icons.calender}
                    editable={false}
                    onPress={() => setDatePickerOpn(true)}
                    titleStyle={{
                      color: selectedDate ? COLORS.sushi : COLORS.grayText,
                    }}
                    containerStyle={{marginBottom: normalize(10)}}
                  />
                </TouchableOpacity>

                <DatePicker
                  modal
                  open={datePickerOpn}
                  date={selectedDate ? selectedDate : new Date()}
                  maximumDate={new Date()}
                  mode="date"
                  onConfirm={date => {
                    setDatePickerOpn(false);
                    setSelectedDate(date);
                  }}
                  onCancel={() => setDatePickerOpn(false)}
                />
              </>

              <View style={styles.dropCont}>
                <Txt
                  style={[
                    styles.titleStyle,
                    {
                      color: selectedType ? COLORS.sushi : COLORS.grayText,
                    },
                  ]}>
                  View Area
                </Txt>

                <Dropdown // area dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.txt3}
                  selectedTextStyle={styles.txt4}
                  containerStyle={styles.dropContainer}
                  maxHeight={normalize(150)}
                  data={TYPES.map(item => ({label: item, value: item}))}
                  labelField="label"
                  valueField="value"
                  placeholder="Area"
                  value={selectedType}
                  onChange={item => setSelectedType(item.value)}
                  renderItem={item => (
                    <Text style={styles.dropTxt}>{item.value}</Text>
                  )}
                />
              </View>
              <View style={{marginTop: normalize(10)}}>
                <PrimaryButton
                  loading={loading}
                  label="Continue"
                  onPress={() => onPressContinue()}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ContractorHome;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  txt1: {
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(18),
    textAlign: 'center',
    color: COLORS.gondola,
    marginBottom: SIZES.paddingSm,
  },
  txt2: {
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(11),
    color: COLORS.gondola,
    textAlign: 'center',
    lineHeight: normalize(15),
    marginBottom: normalize(40),
  },
  txt3: {
    color: COLORS.grayText,
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(13),
  },
  txt4: {
    color: COLORS.black,
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(13),
  },
  dropCont: {
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(10),
    borderRadius: normalize(10),
    marginBottom: normalize(10),
  },
  dropTxt: {
    color: COLORS.black,
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    fontFamily: FONTS.RalewayMedium,
  },
  dropdown: {width: '100%'},
  dropContainer: {
    borderRadius: normalize(5),
    overflow: 'hidden',
    backgroundColor: COLORS.white,
  },
  titleStyle: {
    color: COLORS.grayText,
    fontSize: Platform.OS === 'android' ? normalize(11) : normalize(10),
    fontFamily: FONTS.RalewayMedium,
  },
});
