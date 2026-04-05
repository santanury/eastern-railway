import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
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
import {areaReportListRequest} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import Header from '../../components/Header';
import Input from '../../components/Input';
import Txt from '../../components/micro/Txt';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';

const TYPES = ['All', 'Dirty', 'Clean'];

const SupervisorUploaded = ({navigation, route}) => {
  const dispatch = useDispatch();
  const StationReducer = useSelector(state => state.StationReducer);
  const [selectedType, setSelectedType] = useState('All');
  const [datePickerOpn, setDatePickerOpn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);

  useEffect(() => {
    getAreaReportList({
      area_id: route?.params?._id,
      date: moment(new Date()).format('DD-MM-YYYY'),
      type: 'All',
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (StationReducer.status) {
        case 'Station/areaReportListRequest':
          setLoading(true);
          break;
        case 'Station/areaReportListSuccess':
          setReportList(StationReducer.areaReportListResponse?.data);
          setLoading(false);
          break;
        case 'Station/areaReportListFailure':
          setReportList([]);
          setLoading(false);
          break;
      }
    }, [StationReducer.status]),
  );

  const getAreaReportList = data => {
    !data?.area_id
      ? Toast('Please select station')
      : !data?.date
      ? Toast('Please select date')
      : !data?.type
      ? Toast('Please select area')
      : ConnectionRequest()
          .then(() =>
            dispatch(
              areaReportListRequest({
                ...data,
                ...(data?.type == 'All' && {type: ''}),
              }),
            ),
          )
          .catch(() => Toast('Please check your internet connection'));
  };

  // render station section
  const RenderStationSection = (subItem, subIndex) => {
    const {title, reportDatas} = subItem;
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.flatListBox1}>
          <Txt style={{color: COLORS.emparor, fontSize: normalize(11)}}>
            {title?.toUpperCase()}
          </Txt>
        </View>
        <View style={styles.flatListBox2}>
          <FlatList
            contentContainerStyle={{alignItems: 'center'}}
            data={reportDatas || []}
            horizontal
            renderItem={({item, index}) => {
              const {_id, compress_image, image, type} = item;
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.uploadedContainer}
                  onPress={() =>
                    navigation.navigate('UploadDetails', {report_id: _id})
                  }>
                  <Image
                    style={{resizeMode: 'cover', flex: 1}}
                    source={
                      compress_image || image
                        ? {
                            uri: `${constants.BASE_URL}/uploads/report/image/${
                              compress_image || image
                            }`,
                          }
                        : icons.brokenImage
                    }
                  />

                  <View
                    style={[
                      styles.imageTypeDot,
                      {
                        backgroundColor:
                          type == 'Clean'
                            ? COLORS.turquoise
                            : type == 'Dirty'
                            ? COLORS.alizarinCrimson
                            : COLORS.transparent,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <Header title="Uploaded Images" />
          <View
            style={[globalStyle.WhiteContainer, {paddingTop: normalize(10)}]}>
            <View style={styles.inputContainer}>
              <>
                <TouchableOpacity
                  style={{flex: 1.2}}
                  activeOpacity={0.7}
                  onPress={() => setDatePickerOpn(true)}>
                  <Input
                    value={
                      selectedDate
                        ? moment(selectedDate).format('MMM DD, YY')
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
                    getAreaReportList({
                      area_id: route?.params?._id,
                      date: moment(date).format('DD-MM-YYYY'),
                      type: selectedType,
                    });
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
                  onChange={item => {
                    setSelectedType(item?.value);
                    getAreaReportList({
                      area_id: route?.params?._id,
                      date: moment(selectedDate)?.format('DD-MM-YYYY'),
                      type: item?.value,
                    });
                  }}
                  renderItem={item => (
                    <Text style={styles.dropTxt}>{item?.value}</Text>
                  )}
                />
              </View>
            </View>

            <View style={{marginTop: normalize(10), flex: 1}}>
              {loading ? null : reportList?.length > 0 ? (
                <>
                  <FlatList
                    style={{flex: 1}}
                    data={reportList}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item, index}) => {
                      const {title, code, categoryId, subAareaDatas} = item;
                      return (
                        <>
                          <View style={styles.stationTitleCont}>
                            <Text style={styles.txt6}>{`${title || ''} ${
                              code ? `(${code})` : ''
                            }`}</Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              backgroundColor: COLORS.border + '99',
                            }}>
                            <View style={styles.flatListBox1}>
                              <Txt style={styles.dateStyle}>Work Area</Txt>
                            </View>
                            <View style={styles.flatListBox2}>
                              <Txt
                                style={[
                                  styles.dateStyle,
                                  {
                                    marginLeft: normalize(20),
                                    paddingVertical: normalize(10),
                                  },
                                ]}>
                                Uploaded Images
                              </Txt>
                            </View>
                          </View>

                          {subAareaDatas?.length > 0 &&
                            subAareaDatas?.map((subItem, subIndex) => {
                              return (
                                <RenderStationSection
                                  key={subIndex}
                                  {...{...subItem, subIndex}}
                                />
                              );
                            })}
                        </>
                      );
                    }}
                  />
                </>
              ) : (
                <NoData />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal transparent={true} visible={loading}>
        <View style={styles.loaderModalCont}>
          <ActivityIndicator size="large" color={COLORS.sushi} />
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default SupervisorUploaded;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  dateStyle: {fontFamily: FONTS.RalewayMedium},
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // marginTop: normalize(15),
    paddingHorizontal: normalize(10),
  },
  flatListBox1: {
    padding: normalize(12),
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    width: '40%',
    borderColor: COLORS.border,
    paddingVertical: normalize(15),
  },
  flatListBox2: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    width: '60%',
    borderColor: COLORS.border,
    paddingVertical: normalize(5),
  },
  uploadedContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(5),
    marginLeft: normalize(8),
    overflow: 'hidden',
  },
  imageTypeDot: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(3),
    position: 'absolute',
    bottom: normalize(5),
    right: normalize(5),
  },
  boldText: {fontFamily: FONTS.RalewayBold, textAlign: 'center'},
  dropCont: {
    justifyContent: 'center',
    flex: 1,
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    paddingHorizontal: normalize(10), // strange issue facing with these two
    marginLeft: normalize(10), // shifting the other component while allpying padding
    borderRadius: normalize(10),
  },
  dropTxt: {
    color: COLORS.black,
    paddingVertical: normalize(5),
    paddingHorizontal: normalize(10),
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(13),
  },
  dropdown: {width: '100%'},
  dropContainer: {
    borderRadius: normalize(5),
    overflow: 'hidden',
    backgroundColor: COLORS.white,
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
  txt6: {
    color: COLORS.black,
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(14),
  },
  titleStyle: {
    color: COLORS.grayText,
    fontSize: Platform.OS === 'android' ? normalize(11) : normalize(10),
    fontFamily: FONTS.RalewayMedium,
  },
  loaderModalCont: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationTitleCont: {
    backgroundColor: COLORS.white,
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(10),
    justifyContent: 'center',
    backgroundColor: COLORS.border,
    borderBottomWidth: normalize(1),
    borderColor: COLORS.border,
  },
});
