import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import {LeafletView} from 'react-native-leaflet-view';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  reportDetailsRequest,
  stationReportUpdateRequest,
} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import constants from '../../utils/helpers/constants';
import normalize from '../../utils/helpers/normalize';
import {requestPermission} from '../../utils/helpers/PermissionHangler';

// components
import Header from '../../components/Header';
import Txt from '../../components/micro/Txt';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';
import UploadSuccessModal from '../../components/UploadSuccessModal';

const UploadDetails = ({navigation, route}) => {
  const dispatch = useDispatch();
  const StationReducer = useSelector(state => state.StationReducer);
  const UserReducer = useSelector(state => state.UserReducer);
  const {userResponse} = UserReducer;
  const [reportData, setReportData] = useState({});
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUpdateData, setTempUpdateData] = useState({});
  const [cameraLoading, setCameraLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (route?.params?.report_id) {
      ConnectionRequest()
        .then(() =>
          dispatch(reportDetailsRequest({report_id: route?.params?.report_id})),
        )
        .catch(() => Toast('Please check your internet connection'));
    }
  }, [route?.params]);

  useFocusEffect(
    useCallback(() => {
      switch (StationReducer.status) {
        case 'Station/reportDetailsRequest':
          setLoading(true);
          break;
        case 'Station/reportDetailsSuccess':
          setReportData(StationReducer.reportDetailsResponse?.data);
          setLoading(false);
          break;
        case 'Station/reportDetailsFailure':
          setLoading(false);
          break;
        case 'Station/stationReportUpdateRequest':
          setLoading(true);
          break;
        case 'Station/stationReportUpdateSuccess':
          setShowSuccess(true);
          setLoading(false);
          setTempUpdateData({});
          ConnectionRequest()
            .then(() =>
              dispatch(reportDetailsRequest({report_id: reportData?._id})),
            )
            .catch(() => Toast('Please check your internet connection'));
          break;
        case 'Station/stationReportUpdateFailure':
          setLoading(false);
          break;
      }
    }, [StationReducer.status]),
  );

  // get camera permission
  const getCameraPermission = async () => {
    const hasPermission = await requestPermission('camera');
    if (hasPermission) {
      changeStatus();
    } else {
      setCameraLoading(false);
    }
  };

  const changeStatus = async () => {
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
        setTempUpdateData({imageObject});
      })
      .catch(error => {});
  };

  const onPressUpdate = () => {
    !tempUpdateData?.type
      ? Toast('Please select platform status')
      : !tempUpdateData?.description
      ? Toast('Please enter description')
      : ConnectionRequest()
          .then(() => {
            let formData = new FormData();
            formData.append('report_id', reportData?._id);
            formData.append('type', tempUpdateData?.type);
            formData.append('description', tempUpdateData?.description);
            formData.append('image', tempUpdateData?.imageObject);
            dispatch(stationReportUpdateRequest(formData));
          })
          .catch(() => Toast('Please check your internet connection'));
  };

  return (
    <>
      {Object.keys(tempUpdateData).length > 0 ? (
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={styles.previewContainer}>
          <Image
            source={{uri: tempUpdateData?.imageObject?.uri}}
            style={styles.previewImage}
          />

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setTempUpdateData({})}>
            <Image source={icons.close} style={styles.closeBtnIcon} />
          </TouchableOpacity>

          {/* ADDITIONAL DETAILS */}

          <View style={styles.previewInfoCont}>
            {/* STATION INFO SECTION */}

            <View style={styles.stationInfoCont}>
              <Txt style={styles.boldText}>Station Name</Txt>
              <Text style={styles.filloutTxt}>Fill out the details</Text>
            </View>

            {/* CLEAN DIRTY SEXRION */}

            <View style={styles.stationInfoCont}>
              <Txt style={[styles.txt3]}>Select Platform Status</Txt>
              <View style={styles.optionCont}>
                <TouchableOpacity
                  onPress={() =>
                    setTempUpdateData({
                      ...tempUpdateData,
                      type: 'Dirty',
                    })
                  }
                  style={[
                    styles.optionBtn,
                    {
                      borderColor:
                        tempUpdateData?.type == 'Dirty'
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
                      tempUpdateData?.type == 'Dirty'
                        ? icons.checkSelRed
                        : icons.checkDesel
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    setTempUpdateData({
                      ...tempUpdateData,
                      type: 'Clean',
                    })
                  }
                  style={[
                    styles.optionBtn,
                    {
                      marginLeft: normalize(10),
                      borderColor:
                        tempUpdateData?.type == 'Clean'
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
                      tempUpdateData?.type == 'Clean'
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
              value={tempUpdateData?.description}
              onChangeText={text =>
                setTempUpdateData({...tempUpdateData, description: text})
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
                onPress={() => onPressUpdate()}
                label="Update Status"
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
              <Header
                onPress={() => navigation.goBack()}
                title="Upload Details"
              />

              <View style={[globalStyle.WhiteContainer, {paddingTop: 0}]}>
                <ScrollView // scrollable container
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  style={styles.scrollCont}>
                  {/* REPORT AREA IMAGE */}

                  <View style={styles.mainImgCont}>
                    <Image
                      style={styles.mainImg}
                      source={
                        reportData?.image
                          ? {
                              uri:
                                constants.BASE_URL +
                                '/uploads/report/image/' +
                                reportData?.image,
                            }
                          : icons.brokenImage
                      }
                    />
                  </View>

                  {/* STATION NAME AND CONDITION */}

                  <View style={styles.rowflex1}>
                    <Text style={[styles.txt1, {flex: 1}]}>
                      {`${
                        reportData?.areaData?.code
                          ? reportData?.areaData?.code?.toUpperCase()
                          : ''
                      }`}
                    </Text>

                    {Object?.keys(reportData)?.length > 0 && (
                      <>
                        {userResponse?.data?.role?.role === 'contractor' && (
                          <TouchableOpacity
                            disabled={reportData?.reportUpdateDatas?.length > 0}
                            activeOpacity={0.7}
                            onPress={() => getCameraPermission()}
                            style={[
                              styles.changeBtn,
                              {
                                ...(!reportData?.reportUpdateDatas?.length >
                                  0 && {
                                  elevation: normalize(5),
                                  shadowColor: COLORS.black,
                                  shadowOffset: {
                                    width: 0,
                                    height: 2,
                                  },
                                  shadowOpacity: 0.25,
                                  borderColor: COLORS.emparor,
                                }),
                              },
                            ]}>
                            <Text
                              style={[
                                styles.txt4,
                                {
                                  ...(reportData?.reportUpdateDatas?.length >
                                    0 && {
                                    color: COLORS.grayText,
                                  }),
                                },
                              ]}>
                              {reportData?.reportUpdateDatas?.length > 0
                                ? 'Status Changed'
                                : 'Change Status'}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {userResponse?.data?.role?.role === 'supervisor' &&
                          reportData?.reportUpdateDatas?.length > 0 && (
                            <TouchableOpacity
                              disabled={true}
                              onPress={() => {}}
                              style={styles.changeBtn}>
                              <Text
                                style={[styles.txt4, {color: COLORS.grayText}]}>
                                Status Changed
                              </Text>
                            </TouchableOpacity>
                          )}
                      </>
                    )}

                    {reportData?.type && (
                      <View
                        style={[
                          styles.typeIndicator,
                          {
                            backgroundColor:
                              reportData?.type === 'Clean'
                                ? COLORS.turquoise
                                : COLORS.alizarinCrimson,
                          },
                        ]}
                      />
                    )}
                    <Text style={styles.txt2}>{reportData?.type}</Text>
                  </View>

                  {/* REPORT DETAILS */}

                  <View style={styles.detailCont}>
                    <Text style={styles.txt1}>Description</Text>
                    <Text style={styles.txt3}>{reportData?.description}</Text>
                  </View>

                  {/* LOCATION DETAILS */}

                  <View style={styles.detailCont}>
                    <Text style={styles.txt1}>Location Details</Text>

                    {reportData?.lat && reportData?.lng && (
                      <View style={styles.mapContainer}>
                        <LeafletView
                          style={{flex: 1}}
                          zoom={15}
                          mapCenterPosition={{
                            lat: reportData?.lat,
                            lng: reportData?.lng,
                          }}
                          mapMarkers={[
                            {
                              position: {
                                lat: reportData?.lat,
                                lng: reportData?.lng,
                              },
                              icon: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon-2x.png',
                              size: [15, 25],
                              iconAnchor: [10, 25],
                            },
                          ]}
                        />
                      </View>
                    )}
                    <Text style={[styles.txt3, {marginTop: normalize(10)}]}>
                      {reportData?.address || 'N/A'}
                    </Text>

                    <View style={styles.rowFlex2}>
                      <Text style={styles.txt1}>{`Latitude: `}</Text>
                      <Text style={styles.txt3}>{reportData.lat || 'N/A'}</Text>
                    </View>

                    <View style={styles.rowFlex2}>
                      <Text style={styles.txt1}>{`Longitude: `}</Text>
                      <Text style={styles.txt3}>{reportData.lng || 'N/A'}</Text>
                    </View>

                    <Text
                      style={[
                        styles.txt3,
                        {lineHeight: normalize(15), marginTop: normalize(5)},
                      ]}>
                      {reportData.createdAt
                        ? moment(reportData.createdAt).format(
                            'MMMM Do YYYY, h:mm a',
                          )
                        : ''}
                    </Text>
                  </View>

                  {/* REPORT UPDATES */}

                  {reportData?.reportUpdateDatas?.length > 0 && (
                    <View style={styles.detailCont}>
                      <Text style={styles.txt1}>Time Line</Text>

                      {reportData?.reportUpdateDatas?.map((item, index) => {
                        return (
                          <View
                            style={[
                              styles.updateCont,
                              {
                                ...(index === 0 && {marginTop: normalize(12)}),
                              },
                            ]}
                            key={index}>
                            <View style={[styles.rowFlex2, {marginTop: 0}]}>
                              <View style={styles.checkBoxCont}>
                                <Image
                                  style={styles.checkBox}
                                  source={icons.checkBox}
                                />
                              </View>
                              <Text
                                style={[
                                  styles.txt1,
                                  {marginLeft: normalize(5)},
                                ]}>
                                {item?.updatedAt
                                  ? moment(item?.updatedAt).format(
                                      'MMMM Do YYYY, h:mm a',
                                    )
                                  : ''}
                              </Text>
                            </View>

                            <Text
                              style={[styles.txt3, {marginTop: normalize(10)}]}>
                              {item?.description}
                            </Text>

                            <Image
                              style={styles.timeLineImg}
                              source={
                                item?.image
                                  ? {
                                      uri:
                                        constants.BASE_URL +
                                        '/uploads/report/image/' +
                                        item?.image,
                                    }
                                  : icons.brokenImage
                              }
                            />

                            <View
                              style={[
                                styles.rowflex1,
                                {paddingHorizontal: 0, borderBottomWidth: 0},
                              ]}>
                              {item?.type && (
                                <View
                                  style={[
                                    styles.typeIndicator,
                                    {
                                      backgroundColor:
                                        item?.type === 'Clean'
                                          ? COLORS.turquoise
                                          : COLORS.alizarinCrimson,
                                    },
                                  ]}
                                />
                              )}
                              <Text style={styles.txt2}>{item?.type}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </ScrollView>
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

export default UploadDetails;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  mainImgCont: {
    width: '100%',
    paddingHorizontal: normalize(20),
    marginTop: normalize(20),
  },
  mainImg: {
    width: '100%',
    height: SIZES.height * 0.4,
    resizeMode: 'cover',
  },
  timeLineImg: {
    width: '100%',
    height: SIZES.height * 0.25,
    resizeMode: 'cover',
    overflow: 'hidden',
    marginTop: normalize(10),
  },
  rowflex1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: normalize(1),
    borderColor: COLORS.border,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  rowFlex2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(5),
  },
  changeBtn: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(3),
    borderWidth: normalize(1),
    borderColor: COLORS.grayText,
    padding: normalize(5),
    marginRight: normalize(5),
  },
  typeIndicator: {
    height: normalize(18),
    width: normalize(18),
    borderRadius: normalize(3),
  },
  txt1: {
    // fontFamily: FONTS.RalewayBold,
    fontWeight: 'bold',
    fontSize: normalize(10),
    color: COLORS.black,
  },
  txt2: {
    fontFamily: FONTS.RalewayRegular,
    fontSize: normalize(10),
    color: COLORS.black,
    textAlign: 'right',
    marginLeft: normalize(5),
  },
  txt3: {
    // fontFamily: FONTS.RalewayRegular,
    fontSize: normalize(10),
    color: COLORS.black,
    textAlign: 'left',
    lineHeight: normalize(15),
  },
  txt4: {
    fontFamily: FONTS.RalewayBold,
    fontSize: normalize(10),
    color: COLORS.black,
  },
  detailCont: {
    width: '100%',
    borderBottomWidth: normalize(1),
    borderColor: COLORS.border,
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  mapContainer: {
    height: normalize(100),
    borderRadius: normalize(10),
    marginTop: normalize(10),
    width: '100%',
    overflow: 'hidden',
  },
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
  boldText: {fontFamily: FONTS.RalewayBold},
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
  updateCont: {
    width: '100%',
    marginLeft: normalize(5),
    paddingLeft: normalize(10),
    borderLeftWidth: normalize(1),
    borderColor: COLORS.border,
  },
  checkBoxCont: {
    backgroundColor: COLORS.white,
    position: 'absolute',
    left: -normalize(21),
  },
  checkBox: {
    height: normalize(20),
    width: normalize(20),
    resizeMode: 'contain',
  },
});
