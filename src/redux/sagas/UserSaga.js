import {call, put, select, takeLatest} from 'redux-saga/effects';
import Toast from '../../components/Toast';
import {getApi, postApi} from '../../utils/helpers/ApiRequests';

import {logoutRequest} from '../reducers/AuthReducer';
import {
  getUserFailure,
  getUserSuccess,
  updateUserFailure,
  updateUserSuccess,
} from '../reducers/UserReducer';

let getItems = state => state.AuthReducer;

// user check
export function* getUserSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(getApi, 'api/front/user/profile', header);
    if (response?.status == 200) {
      yield put(getUserSuccess(response?.data));
    } else {
      yield put(getUserFailure(response?.data));
    }
  } catch (error) {
    yield put(getUserFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// update user
export function* updateUserSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/user/profile-update',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(updateUserSuccess(response?.data));
    } else {
      yield put(updateUserFailure(response?.data));
    }
  } catch (error) {
    yield put(updateUserFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem updating your account, please try again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('User/getUserRequest', getUserSaga);
  })(),

  (function* () {
    yield takeLatest('User/updateUserRequest', updateUserSaga);
  })(),
];
export default watchFunction;
