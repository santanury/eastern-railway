import {useFocusEffect} from '@react-navigation/native';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS, FONTS, SIZES, icons, images} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  assignListRequest,
  stationStatusBreak,
} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import normalize from '../../utils/helpers/normalize';

// components

import Header from '../../components/Header';
import Txt from '../../components/micro/Txt';
import NoData from '../../components/NoData';
import Toast from '../../components/Toast';

const SupervisorAssigned = ({navigation, route}) => {
  const dispatch = useDispatch();
  const StationReducer = useSelector(state => state.StationReducer);

  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stationList, setStationList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setKeyword('');
      setLoading(true);
      setPageNum(1);
      getStationList({pageNum: 1});
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      switch (StationReducer.status) {
        case 'Station/assignListRequest':
          break;
        case 'Station/assignListSuccess':
          setStationList(
            pageNum === 1
              ? [...StationReducer?.assignListResponse?.data]
              : [...stationList, ...StationReducer?.assignListResponse?.data],
          );
          StationReducer?.assignListResponse?.data?.length > 0 &&
            setPageNum(pageNum + 1);
          setRefreshing(false);
          setLoading(false);
          dispatch(stationStatusBreak());
          break;
        case 'Station/assignListFailure':
          setRefreshing(false);
          setLoading(false);
          break;
      }
    }, [StationReducer.status]),
  );

  const getStationList = data => {
    ConnectionRequest()
      .then(() => {
        dispatch(
          assignListRequest({
            keyword: data?.keyword ? data?.keyword : '',
            perpage: 20,
            page: data?.pageNum,
          }),
        );
      })
      .catch(() => Toast('Please check your internet connection'));
  };

  const onChangeText = keyword => {
    setKeyword(keyword);
    getStationList({keyword, pageNum: 1});
    setPageNum(1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getStationList({keyword, pageNum: 1});
    setPageNum(1);
  };

  const RenderStationList = data => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.flatListBox1}>
          <Txt style={styles.dateStyle}>{data?.index + 1}</Txt>
        </View>
        <View
          style={[
            styles.flatListBox2,
            {
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: normalize(10),
            },
          ]}>
          <Txt style={[styles.txt1, {flex: 1.7}]}>
            {`${
              data?.title
                ? data?.code
                  ? `${data?.title + ` (${data?.code})`}`.length > 20
                    ? `${data?.title + ` (${data?.code})`}`
                        .toUpperCase()
                        .slice(0, 20) + '...'
                    : `${data?.title + ` (${data?.code})`}`.toUpperCase()
                  : data?.title?.length > 20
                  ? data?.title.toUpperCase().slice(0, 20) + '...'
                  : data?.title.toUpperCase()
                : ''
            }
          `}
          </Txt>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.uploadButton, {flex: 1}]}
            onPress={() => navigation?.navigate('SupervisorUpload', {...data})}>
            <Txt style={styles.uploadButtonText}>Upload</Txt>
            <Image source={icons.cameraIcon} style={styles.uploadButtonIcon} />
          </TouchableOpacity>
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
          <Header title="Assigned Stations" />
          <View
            style={[globalStyle.WhiteContainer, {paddingTop: normalize(10)}]}>
            <TextInput
              value={keyword}
              placeholder="Search for station"
              onChangeText={text => onChangeText(text)}
              style={styles.searchInput}
              placeholderTextColor={COLORS.grayText}
            />
            <View style={{paddingHorizontal: normalize(10)}}>
              <Txt style={styles.boldText}>Contract</Txt>
              <Txt style={styles.redTxt}>{`${
                StationReducer?.assignListResponse?.total
              } ${
                Number(StationReducer?.assignListResponse?.total) > 1
                  ? `Stations`
                  : `Station`
              }`}</Txt>
            </View>

            <View style={{flexDirection: 'row', marginTop: normalize(15)}}>
              <View style={[styles.flatListBox1, {borderTopWidth: 1}]}>
                <Txt style={styles.dateStyle}>SN</Txt>
              </View>
              <View style={[styles.flatListBox2, {borderTopWidth: 1}]}>
                <Txt style={[styles.dateStyle, {padding: normalize(10)}]}>
                  Assigned Stations
                </Txt>
              </View>
            </View>

            {loading ? null : stationList?.length > 0 ? (
              <View style={{flex: 1, width: '100%'}}>
                <FlatList
                  data={stationList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <RenderStationList {...{...item, index}} />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{}}
                  onEndReached={() => {
                    getStationList({keyword, pageNum});
                  }}
                  refreshing={refreshing}
                  onRefresh={() => onRefresh()}
                />
              </View>
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

export default SupervisorAssigned;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, width: '100%'},
  boldText: {fontFamily: FONTS.RalewayBold},
  txt1: {
    color: COLORS.emparor,
    fontSize: normalize(11),
    fontFamily: FONTS.RalewayRegular,
    marginRight: normalize(3),
    textAlignVertical: 'center',
    justifyContent: 'center',
  },
  redTxt: {
    fontFamily: FONTS.RobotoMedium,
    color: COLORS.sushi,
    marginTop: normalize(2),
  },
  StationContainer: {
    flexDirection: 'row',
    borderTopWidth: normalize(0.5),
    borderTopColor: COLORS.border,
    alignItems: 'center',
  },
  flatListBox1: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    width: '20%',
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListBox2: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
    width: '80%',
    borderColor: COLORS.border,
    paddingVertical: normalize(5),
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.sushi,
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    height: normalize(30),
  },
  uploadButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.RalewayMedium,
  },
  uploadButtonIcon: {
    height: normalize(15),
    width: normalize(15),
    marginLeft: normalize(5),
  },
  dateStyle: {fontFamily: FONTS.RalewayMedium, fontWeight: '600'},
  searchInput: {
    width: '95%',
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    borderRadius: normalize(5),
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(15),
    alignSelf: 'center',
    marginBottom: normalize(20),
    color: COLORS.gondola,
  },
  loaderModalCont: {
    flex: 1,
    backgroundColor: COLORS.emparor + 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
