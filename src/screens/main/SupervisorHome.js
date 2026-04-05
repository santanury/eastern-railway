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
import Txt from '../../components/micro/Txt';
import {COLORS, FONTS, icons, images, SIZES} from '../../constants';
import globalStyle from '../../constants/globalStyle';
import {
  assignListRequest,
  stationStatusBreak,
} from '../../redux/reducers/StationReducer';
import ConnectionRequest from '../../utils/helpers/ConnectionRequest';
import normalize from '../../utils/helpers/normalize';

// components
import HomeHeader from '../../components/HomeHeader';
import NoData from '../../components/NoData';

const SupervisorHome = ({navigation, route}) => {
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
      .then(() =>
        dispatch(
          assignListRequest({
            keyword: data?.keyword ? data?.keyword : '',
            perpage: 20,
            page: data?.pageNum,
          }),
        ),
      )
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
      <View style={styles.stationContainer}>
        <Txt style={[styles.txt1, {flex: 1}]}>
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
          onPress={() => navigation.navigate('SupervisorUploaded', {...data})}>
          <Image source={icons.arrowBack} style={styles.arrorBckStyle} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground source={images.mainBg} style={styles.container}>
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <HomeHeader />
          <View
            style={[
              globalStyle.WhiteContainer,
              {
                paddingTop: normalize(10),
                // height: SIZES.height * 0.75,
              },
            ]}>
            <TextInput
              value={keyword}
              placeholder="Search for station"
              onChangeText={text => onChangeText(text)}
              style={styles.searchInput}
              placeholderTextColor={COLORS.grayText}
            />

            <Txt style={styles.boldText}>Uploaded Images</Txt>

            {loading ? null : stationList.length > 0 ? (
              <View style={{flex: 1, width: '100%', marginTop: normalize(20)}}>
                <FlatList
                  data={stationList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <RenderStationList {...{...item, index}} />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    ...(stationList.length >=
                      StationReducer?.assignListResponse?.total && {
                      paddingBottom: normalize(100),
                    }),
                  }}
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

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => navigation?.navigate('SupervisorAssigned')}>
        <Txt style={styles.uploadButtonText}>Upload</Txt>
        <Image source={icons.cameraIcon} style={styles.uploadButtonIcon} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default SupervisorHome;

const styles = StyleSheet.create({
  container: {
    height: SIZES.height,
    width: SIZES.width,
    paddingHorizontal: normalize(20),
    alignItems: 'center',
  },
  scrollCont: {flex: 1, paddingHorizontal: normalize(20)},
  boldText: {fontFamily: FONTS.RalewayBold, paddingHorizontal: normalize(10)},
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: normalize(10),
  },
  arrorBckStyle: {
    width: normalize(25),
    height: normalize(25),
  },
  stationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: normalize(0.5),
    borderTopColor: COLORS.border,
    padding: normalize(10),
    alignItems: 'center',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.sushi,
    width: '35%',
    padding: normalize(10),
    borderRadius: normalize(8),
    position: 'absolute',
    alignSelf: 'flex-end',
    zIndex: 1,
    bottom: 0,
    bottom: normalize(40),
    right: normalize(10),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.RalewayMedium,
  },
  uploadButtonIcon: {
    height: normalize(25),
    width: normalize(25),
  },
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
  txt1: {
    color: COLORS.emparor,
    fontSize: normalize(11),
    fontFamily: FONTS.RalewayRegular,
    alignSelf: 'center',
  },
});
