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
import Geolocation from 'react-native-geolocation-service';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  areaReportListRequest,
  stationReportAddRequest,
  stationReportEditRequest,
} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';

// components
import Header from '../../components/Header';
import Txt from '../../components/micro/Txt';
import NoData from '../../components/NoData';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';
import UploadSuccessModal from '../../components/UploadSuccessModal';
import {requestPermission} from '../../utils/helpers/PermissionHangler';

const SupervisorUpload = ({navigation, route}) => {
  const dispatch = useDispatch();
  const StationReducer = useSelector(state => state.StationReducer);
  const UserReducer = useSelector(state => state.UserReducer);
  const [reportList, setReportList] = useState([]);
  const [newTempData, setNewTempData] = useState({});
  const [loading, setLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getAreaReportList({
      area_id: route?.params?._id,
      date: moment(new Date()).format('DD-MM-YYYY'),
    });
  }, [route?.params?._id]);

  useFocusEffect(
    useCallback(() => {
      switch (StationReducer.status) {
        case 'Station/areaReportListRequest':
          setLoading(true);
          break;
        case 'Station/areaReportListSuccess':
          setReportList([...StationReducer.areaReportListResponse?.data]);
          setLoading(false);
          setCameraLoading(false);
          break;
        case 'Station/areaReportListFailure':
          setLoading(false);
          setCameraLoading(false);
          break;
        case 'Station/stationReportAddRequest':
          setLoading(true);
          break;
        case 'Station/stationReportAddSuccess':
          setShowSuccess(true);
          setLoading(false);
          setCameraLoading(false);
          setNewTempData({});
          getAreaReportList({
            area_id: route?.params?._id,
            date: moment(new Date()).format('DD-MM-YYYY'),
          });
          break;
        case 'Station/stationReportAddFailure':
          setLoading(false);
          setCameraLoading(false);
          break;
        case 'Station/stationReportEditRequest':
          setLoading(true);
          break;
        case 'Station/stationReportEditSuccess':
          setShowSuccess(true);
          setLoading(false);
          setCameraLoading(false);
          setNewTempData({});
          getAreaReportList({
            area_id: route?.params?._id,
            date: moment(new Date()).format('DD-MM-YYYY'),
          });
          break;
        case 'Station/stationReportEditFailure':
          setLoading(false);
          setCameraLoading(false);
          break;
      }
    }, [StationReducer.status]),
  );

  // get area report list
  const getAreaReportList = data => {
    !data?.area_id
      ? Toast('Please select station')
      : !data?.date
      ? Toast('Please select date')
      : ConnectionRequest()
          .then(() => dispatch(areaReportListRequest(data)))
          .catch(() => Toast('Please check your internet connection'));
  };

  // inititate gps and camera
  const initGpsCamera = async data => {
    setCameraLoading(true);
    await whileInUseLocationPermission(data);
  };

  // get location permission while in use
  const whileInUseLocationPermission = async data => {
    const hasPermission = await requestPermission('location', 'whenInUse');
    if (hasPermission) {
      accessGps(data);
    } else {
      setCameraLoading(false);
    }
  };

  // access gps
  const accessGps = async data => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude: lat, longitude: lng} = position.coords;
        getCameraPermission({...data, lat, lng});
      },
      error => {
        setCameraLoading(false);
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // get camera permission
  const getCameraPermission = async data => {
    const hasPermission = await requestPermission('camera');
    if (hasPermission) {
      onpenCamera(data);
      setCameraLoading(false);
    } else {
      setCameraLoading(false);
    }
  };

  // pick image from camera
  const onpenCamera = async data => {
    ImageCropPicker.openCamera({
      width: 2048,
      height: 2048,
      cropping: true,
    })
      .then(image => {
        const imageObject = {
          uri: image?.path,
          type: image?.mime,
          name: image?.path?.substring(image?.path?.lastIndexOf('-') + 1),
        };
        setNewTempData({...data, imageObject});
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  // upload new image
  const onPressUpload = () => {
    !newTempData?.type
      ? Toast('Please select platform status')
      : !newTempData?.description
      ? Toast('Please enter description')
      : ConnectionRequest()
          .then(() => {
            let formData = new FormData();
            formData.append('area_id', newTempData?.parent_id);
            formData.append('sub_area_id', newTempData?._id);
            formData.append('image', newTempData?.imageObject);
            formData.append('lat', newTempData?.lat);
            formData.append('lng', newTempData?.lng);
            formData.append('type', newTempData?.type);
            formData.append('description', newTempData?.description);
            dispatch(stationReportAddRequest(formData));
          })
          .catch(() => Toast('Please check your internet connection'));
  };

  // update existing image
  const onPressUpdate = () => {
    !newTempData?.type
      ? Toast('Please select platform status')
      : !newTempData?.description
      ? Toast('Please enter description')
      : ConnectionRequest()
          .then(() => {
            let formData = new FormData();
            formData.append('report_id', newTempData?.report_id);
            formData.append('area_id', newTempData?.area_id);
            formData.append('image', newTempData?.imageObject);
            formData.append('lat', newTempData?.lat);
            formData.append('lng', newTempData?.lng);
            formData.append('type', newTempData?.type);
            formData.append('description', newTempData?.description);
            dispatch(stationReportEditRequest(formData));
          })
          .catch(() => Toast('Please check your internet connection'));
  };

  const RenderStationSection = data => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.flatListBox1}>
          <Txt style={{color: COLORS.emparor, fontSize: normalize(11)}}>
            {data?.title?.toUpperCase()}
          </Txt>
        </View>
        <View style={styles.flatListBox2}>
          <FlatList
            contentContainerStyle={{alignItems: 'center'}}
            data={data?.reportDatas ? data?.reportDatas : []}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => {
              const {_id, compress_image, image, type} = item;
              return (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.uploadedContainer}
                  onPress={() => initGpsCamera({...item, report_id: _id})}>
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
                          item?.type == 'Clean'
                            ? COLORS.turquoise
                            : item?.type == 'Dirty'
                            ? COLORS.alizarinCrimson
                            : COLORS.transparent,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
            ListFooterComponent={
              <>
                {data?.reportDatas?.length < 4 && (
                  <TouchableOpacity
                    onPress={() => initGpsCamera(data)}
                    style={styles.uploadContainer}>
                    <Image style={styles.uploadIcon} source={icons.plus} />
                  </TouchableOpacity>
                )}
              </>
            }
          />
        </View>
      </View>
    );
  };

  return (
    <>
      {Object.keys(newTempData).length > 0 ? (
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={styles.previewContainer}>
          <Image
            source={{uri: newTempData?.imageObject?.uri}}
            style={styles.previewImage}
          />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setNewTempData({})}>
            <Image source={icons.close} style={styles.closeBtnIcon} />
          </TouchableOpacity>

          {/* ADDITIONAL DETAILS */}

          <View style={styles.previewInfoCont}>
            {/* STATION INFO SECTION */}

            <View style={styles.stationInfoCont}>
              <Txt style={styles.boldText}>
                {route?.params?.stationName?.toUpperCase()}
              </Txt>
              <Text style={styles.filloutTxt}>Fill out the details</Text>
            </View>

            {/* CLEAN DIRTY SEXRION */}

            <View style={styles.stationInfoCont}>
              <Txt style={[styles.txt3]}>Select Platform Status</Txt>
              <View style={styles.optionCont}>
                <TouchableOpacity
                  onPress={() =>
                    setNewTempData({
                      ...newTempData,
                      type: 'Dirty',
                    })
                  }
                  style={[
                    styles.optionBtn,
                    {
                      borderColor:
                        newTempData?.type == 'Dirty'
                          ? COLORS.alizarinCrimson
                          : COLORS.border,
                    },
                  ]}>
                  <View
                    style={[
                      styles.indicator,
                      {backgroundColor: COLORS.alizarinCrimson},
                    ]}
                  />
                  <Txt style={styles.label}>Dirty</Txt>
                  <Image
                    style={[styles.selIcon]}
                    source={
                      newTempData?.type == 'Dirty'
                        ? icons.checkSelRed
                        : icons.checkDesel
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setNewTempData({
                      ...newTempData,
                      type: 'Clean',
                    })
                  }
                  style={[
                    styles.optionBtn,
                    {
                      marginLeft: normalize(10),
                      borderColor:
                        newTempData?.type == 'Clean'
                          ? COLORS.turquoise
                          : COLORS.border,
                    },
                  ]}>
                  <View
                    style={[
                      styles.indicator,
                      {backgroundColor: COLORS.turquoise},
                    ]}
                  />
                  <Txt style={styles.label}>Clean</Txt>
                  <Image
                    style={[styles.selIcon]}
                    source={
                      newTempData?.type == 'Clean'
                        ? icons.checkSelGreen
                        : icons.checkDesel
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* DESCRIPTION SECTION */}

            <TextInput
              placeholderTextColor={COLORS.grayText}
              placeholder="Description"
              style={styles.descInput}
              value={newTempData?.description}
              onChangeText={text =>
                setNewTempData({...newTempData, description: text})
              }
              multiline={true}
              inputStyle={{
                textAlignVertical: 'top',
                ...(Platform.OS == 'ios' && {
                  marginTop: normalize(10),
                }),
              }}
            />

            {/* SUBMIT BUTTON SECTION */}

            <View style={styles.stationInfoCont}>
              <PrimaryButton
                onPress={() =>
                  newTempData.report_id ? onPressUpdate() : onPressUpload()
                }
                label={newTempData.report_id ? 'Update' : 'Upload'}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <ImageBackground source={images.mainBg} style={styles.container}>
          <SafeAreaView style={{flex: 1}}>
            <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
              <Header title="Upload Images" />
              <View style={globalStyle.WhiteContainer}>
                {loading ? null : reportList.length > 0 ? (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.txt4}>
                        {moment(new Date()).format('MMMM DD, YYYY')}
                      </Text>
                      <Image source={icons.calender} style={styles.arrowIcon} />
                    </View>
                    <FlatList
                      style={{marginTop: normalize(15), flex: 1}}
                      data={reportList}
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
                                <Txt style={styles.txt3}>Work Area</Txt>
                              </View>
                              <View
                                style={[
                                  styles.flatListBox2,
                                  {borderTopWidth: 1},
                                ]}>
                                <Txt
                                  style={[
                                    styles.txt3,
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
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </>
                ) : (
                  <NoData />
                )}
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </ImageBackground>
      )}

      {/* LOADING MODAL */}

      <Modal transparent={true} visible={loading || cameraLoading}>
        <View style={styles.loaderModalCont}>
          <ActivityIndicator size="large" color={COLORS.sushi} />
        </View>
      </Modal>

      {/* SUCCESS MODAL */}

      <UploadSuccessModal
        visible={showSuccess}
        onPress={() => setShowSuccess(false)}
        title="Successfully Submitted"
        description="Your upload has been successful"
      />
    </>
  );
};

export default SupervisorUpload;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  arrowIcon: {
    height: normalize(15),
    width: normalize(15),
    tintColor: COLORS.black,
    marginLeft: normalize(10),
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
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
  uploadContainer: {
    height: normalize(32),
    width: normalize(32),
    borderRadius: normalize(5),
    marginLeft: normalize(8),
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    height: normalize(6),
    width: normalize(6),
    resizeMode: 'contain',
  },
  imageTypeDot: {
    height: normalize(12),
    width: normalize(12),
    borderRadius: normalize(3),
    position: 'absolute',
    bottom: normalize(5),
    right: normalize(5),
  },
  boldText: {fontFamily: FONTS.RalewayBold},
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
  },
  previewImage: {
    width: '100%',
    height: SIZES.height * 0.45,
    resizeMode: 'cover',
  },
  closeBtn: {
    position: 'absolute',
    top: normalize(10),
    left: normalize(10),
  },
  closeBtnIcon: {
    height: normalize(30),
    width: normalize(30),
    transform: [{rotate: '180deg'}],
  },
  previewInfoCont: {
    borderRadius: normalize(10),
    width: '100%',
    height: SIZES.height * 0.55,
    position: 'absolute',
    bottom: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  stationInfoCont: {
    width: '100%',
    padding: normalize(15),
    borderBottomWidth: normalize(1),
    borderColor: COLORS.border,
  },
  filloutTxt: {
    color: COLORS.sushi,
    fontFamily: FONTS.RalewayMedium,
    fontSize: normalize(12),
  },
  optionCont: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: normalize(10),
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(8),
    borderRadius: normalize(5),
    borderWidth: normalize(1),
  },
  indicator: {
    height: normalize(20),
    width: normalize(20),
    borderRadius: normalize(3),
  },
  label: {
    color: COLORS.emparor,
    fontSize: normalize(11),
    flex: 1,
    marginLeft: normalize(3),
  },
  selIcon: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
  descInput: {
    fontFamily: FONTS.RalewayRegular,
    color: COLORS.black,
    fontSize: normalize(12),
    padding: normalize(10),
    flex: 1,
    textAlignVertical: 'top',
    borderBottomWidth: normalize(1),
    borderColor: COLORS.border,
  },
  loaderModalCont: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'center',
  },

  txt3: {fontFamily: FONTS.RalewayMedium},
  txt4: {
    fontSize: normalize(11),
    color: COLORS.black,
    fontWeight: '400',
  },
  txt6: {
    color: COLORS.black,
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(14),
  },
  locataionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: SIZES.height * 0.15,
    width: '100%',
  },
  mapContainer: {flex: 2.5, height: '100%', backgroundColor: 'red'},
  addressContainer: {
    backgroundColor: COLORS.white,
    flex: 2.5,
    height: '100%',
    paddingHorizontal: normalize(10),
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
