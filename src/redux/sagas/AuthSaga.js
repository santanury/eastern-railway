import AsyncStorage from '@react-native-async-storage/async-storage';
import {call, put, select, takeLatest} from 'redux-saga/effects';
import Toast from '../../components/Toast';
import {getApi, postApi} from '../../utils/helpers/ApiRequests';
import constants from '../../utils/helpers/constants';
import {
  changePasswordFailure,
  changePasswordSuccess,
  forgotPasswordFailure,
  forgotPasswordNewPasswordFailure,
  forgotPasswordNewPasswordSuccess,
  forgotPasswordOtpVerificationFailure,
  forgotPasswordOtpVerificationSuccess,
  forgotPasswordSuccess,
  getTokenFailure,
  getTokenSuccess,
  logoutFailure,
  logoutSuccess,
  signinFailure,
  signinSuccess,
  userCheckFailure,
  userCheckSuccess,
} from '../reducers/AuthReducer';
import {getUserSuccess} from '../reducers/UserReducer';

let getItems = state => state.AuthReducer;

//get token
export function* getTokenSaga(action) {
  try {
    const response = yield call(AsyncStorage.getItem, constants.TOKEN);

    if (response != null) {
      yield put(getTokenSuccess(response));
    } else {
      yield put(getTokenFailure(null));
    }
  } catch (error) {
    yield put(getTokenFailure(error));
  }
}

// user check
export function* userCheckSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.tempToken,
  };

  try {
    let response = yield call(getApi, 'api/front/user/profile', header);
    if (response?.status == 200) {
      yield put(userCheckSuccess(response?.data));
      yield put(getUserSuccess(response?.data));
    } else {
      yield put(userCheckFailure(response?.data));
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      Toast("There's a problem getting your account, please login again.");
    }
  } catch (error) {
    yield put(userCheckFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    yield call(AsyncStorage.removeItem, constants.TOKEN);
  }
}

// signin
export function* signinSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };

  try {
    let response = yield call(
      postApi,
      'api/front/user/signin',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield call(AsyncStorage.setItem, constants.TOKEN, response?.data?.token);
      // if (action.payload?.remember == true) {
      //   yield call(AsyncStorage.setItem, 'uPhone', action.payload?.phone);
      //   yield call(AsyncStorage.setItem, 'uPass', action.payload?.password);
      // } else {
      //   yield call(AsyncStorage.removeItem, 'uPhone');
      //   yield call(AsyncStorage.removeItem, 'uPass');
      // }
      yield put(signinSuccess(response?.data));
      yield put(getUserSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(signinFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(signinFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

// forgot password
export function* forgotPasswordSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };
  try {
    let response = yield call(
      postApi,
      'api/front/user/forgot-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(forgotPasswordSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(signinFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotPasswordFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

// forgot password otp verification
export function* forgotPasswordOtpVerificationSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };

  try {
    let response = yield call(
      postApi,
      'api/front/user/forget-password-otp-verification',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(forgotPasswordOtpVerificationSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(forgotPasswordOtpVerificationFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotPasswordOtpVerificationFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

// forgot password new password
export function* forgotPasswordNewPasswordSaga(action) {
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
  };

  try {
    let response = yield call(
      postApi,
      'api/front/user/forget-password-change-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(forgotPasswordNewPasswordSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(forgotPasswordNewPasswordFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(forgotPasswordNewPasswordFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

// change password
export function* changePasswordSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/user/change-password',
      action.payload,
      header,
    );

    if (response?.status == 200) {
      yield put(changePasswordSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(changePasswordFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(changePasswordFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

// logout
export function* logoutSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(getApi, 'api/front/user/logout', header);
    if (response?.data?.status == 200) {
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      yield put(logoutSuccess(response?.data));
      Toast(response?.data?.message);
    } else {
      yield put(logoutFailure(response?.data));
      yield call(AsyncStorage.removeItem, constants.TOKEN);
      Toast("There's a problem getting your account, please login again.");
    }
  } catch (error) {
    yield put(logoutFailure(error));
    yield call(AsyncStorage.removeItem, constants.TOKEN);
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast(
          "We can't connect to the server right now, please try again later.",
        );
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Auth/getTokenRequest', getTokenSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/userCheckRequest', userCheckSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/signinRequest', signinSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/forgotPasswordRequest', forgotPasswordSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Auth/forgotPasswordOtpVerificationRequest',
      forgotPasswordOtpVerificationSaga,
    );
  })(),
  (function* () {
    yield takeLatest(
      'Auth/forgotPasswordNewPasswordRequest',
      forgotPasswordNewPasswordSaga,
    );
  })(),

  (function* () {
    yield takeLatest('Auth/changePasswordRequest', changePasswordSaga);
  })(),
  (function* () {
    yield takeLatest('Auth/logoutRequest', logoutSaga);
  })(),
];
export default watchFunction;
