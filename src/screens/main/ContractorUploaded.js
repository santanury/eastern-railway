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
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  areaReportListRequest,
  assignListRequest,
} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import HomeHeader from '../../components/HomeHeader';
import Txt from '../../components/micro/Txt';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';

const TYPES = ['All', 'Dirty', 'Clean'];

const ContractorUploaded = ({navigation, route}) => {
  const dispatch = useDispatch();
  const StationReducer = useSelector(state => state.StationReducer);
  const {filterAssignListResponse, assignListResponse} = StationReducer;

  const [selectedStation, setSelectedStation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [reportList, setReportList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.selectedType) {
      setSelectedType(route.params?.selectedType);
    }

    if (route?.params?.selectedDate && route.params?.selectedType) {
      getAreaReportList({
        area_id: '',
        date: route?.params?.selectedDate,
        type: route?.params?.selectedType,
      });
    }
  }, [route.params?.selectedType]);

  useEffect(() => {
    ConnectionRequest()
      .then(() => {
        dispatch(
          assignListRequest({
            keyword: '',
            perpage: 1000,
            page: 1,
          }),
        );
      })
      .catch(() => Toast('Please check your internet connection'));
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
        case 'Station/assignListRequest':
          break;
        case 'Station/assignListSuccess':
          break;
        case 'Station/assignListFailure':
          break;
      }
    }, [StationReducer.status]),
  );

  const getAreaReportList = data => {
    !data?.date
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

  // station section
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
          <HomeHeader backEnable={true} />
          <View style={globalStyle.WhiteContainer}>
            {/* DATE SECTION */}

            <View style={styles.topContainer}>
              <Text style={styles.txt4}>
                {route?.params?.selectedDate
                  ? moment(route?.params?.selectedDate, 'DD-MM-YYYY').format(
                      'MMMM DD, YYYY',
                    )
                  : 'Select Date'}
              </Text>
              <Image source={icons.calender} style={styles.arrowIcon} />
            </View>

            {/* STATION AND AREA SECTION */}

            <View style={styles.inputContainer}>
              <View style={styles.dropCont}>
                <Txt
                  style={[
                    styles.titleStyle,
                    {
                      color: selectedStation ? COLORS.sushi : COLORS.grayText,
                    },
                  ]}>
                  View Station
                </Txt>

                <Dropdown // station dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.txt3}
                  selectedTextStyle={styles.txt5}
                  containerStyle={styles.dropContainer}
                  maxHeight={normalize(150)}
                  data={
                    assignListResponse?.data
                      ? [{title: 'All', code: ''}, ...assignListResponse?.data]
                      : [{title: 'All', code: ''}]
                  }
                  labelField="title"
                  valueField="code"
                  placeholder="Station"
                  value={selectedStation}
                  onChange={item => {
                    getAreaReportList({
                      area_id: item._id || '',
                      date: route?.params?.selectedDate,
                      type: selectedType,
                    });
                    setSelectedStation(item);
                  }}
                  renderItem={item => (
                    <Text style={styles.dropTxt}>{`${
                      item?.title
                        ? item?.code
                          ? `${item?.title + ` (${item?.code})`}`.length > 10
                            ? `${item?.title + ` (${item?.code})`}`
                                .toUpperCase()
                                .slice(0, 10) + '...'
                            : `${
                                item?.title + ` (${item?.code})`
                              }`.toUpperCase()
                          : item?.title?.length > 10
                          ? item?.title.toUpperCase().slice(0, 10) + '...'
                          : item?.title.toUpperCase()
                        : ''
                    }`}</Text>
                  )}
                  autoScroll={false}
                  search
                  renderInputSearch={onSearch => (
                    <TextInput
                      style={styles.dropInput}
                      onChangeText={onSearch}
                      placeholder="Search"
                      placeholderTextColor={COLORS.grayText}
                    />
                  )}
                />
              </View>

              <View style={[styles.dropCont, {marginLeft: normalize(10)}]}>
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
                  selectedTextStyle={styles.txt5}
                  containerStyle={styles.dropContainer}
                  maxHeight={normalize(150)}
                  data={TYPES.map(item => ({label: item, value: item}))}
                  labelField="label"
                  valueField="value"
                  placeholder="Area"
                  value={selectedType}
                  onChange={item => {
                    getAreaReportList({
                      area_id: selectedStation?._id || '',
                      date: route?.params?.selectedDate,
                      type: item.value,
                    });
                    setSelectedType(item.value);
                  }}
                  renderItem={item => (
                    <Text style={styles.dropTxt}>{item.value}</Text>
                  )}
                />
              </View>
            </View>

            {/* LIST SECTION */}

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

export default ContractorUploaded;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },

  topContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
  },
  arrowIcon: {
    height: normalize(15),
    width: normalize(15),
    tintColor: COLORS.black,
    marginLeft: normalize(10),
    resizeMode: 'contain',
  },
  dateStyle: {fontFamily: FONTS.RalewayMedium},
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // marginTop: normalize(15),
    padding: normalize(10),
  },
  flatListBox1: {
    padding: normalize(12),
    borderRightWidth: normalize(1),
    borderBottomWidth: normalize(1),
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
  dropCont: {
    justifyContent: 'center',
    flex: 1,
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    padding: normalize(10),
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
    fontSize: normalize(11),
    color: COLORS.black,
    fontWeight: '400',
  },
  txt5: {
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
  dropInput: {
    width: '100%',
    height: normalize(35),
    color: COLORS.black,
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    borderRadius: normalize(5),
    paddingHorizontal: normalize(5),
    marginBottom: normalize(5),
    fontFamily: FONTS.RalewayMedium,
  },
  loaderModalCont: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'center',
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
