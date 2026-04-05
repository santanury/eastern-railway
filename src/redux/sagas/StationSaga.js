import {call, put, select, takeLatest} from 'redux-saga/effects';
import Toast from '../../components/Toast';
import {postApi} from '../../utils/helpers/ApiRequests';

import {logoutRequest} from '../reducers/AuthReducer';
import {
  areaReportListFailure,
  areaReportListSuccess,
  assignListFailure,
  assignListSuccess,
  filterAssignListFailure,
  filterAssignListSuccess,
  reportDetailsFailure,
  reportDetailsSuccess,
  stationReportAddFailure,
  stationReportAddSuccess,
  stationReportEditFailure,
  stationReportEditSuccess,
  stationReportUpdateFailure,
  stationReportUpdateSuccess,
} from '../reducers/StationReducer';

let getItems = state => state.AuthReducer;

// filter assign list
export function* filterAssignListSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/area/filter-assign-list',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(filterAssignListSuccess(response?.data));
    } else {
      yield put(filterAssignListFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(filterAssignListFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// area report list
export function* areaReportListSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/area/report-list',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(areaReportListSuccess(response?.data));
    } else {
      yield put(areaReportListFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(areaReportListFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// assign list
export function* assignListSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/area/assign-list',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(assignListSuccess(response?.data));
    } else {
      yield put(assignListFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(assignListFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// station report add
export function* stationReportAddSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/report/add',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(stationReportAddSuccess(response?.data));
    } else {
      yield put(stationReportAddFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(stationReportAddFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// station report edit
export function* stationReportEditSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/report/edit',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(stationReportEditSuccess(response?.data));
    } else {
      yield put(stationReportEditFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(stationReportEditFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// station report update
export function* stationReportUpdateSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'multipart/form-data',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/report-update/add',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(stationReportUpdateSuccess(response?.data));
    } else {
      yield put(stationReportUpdateFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(stationReportUpdateFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

// report details
export function* reportDetailsSaga(action) {
  const items = yield select(getItems);
  let header = {
    Accept: 'application/json',
    contenttype: 'application/json',
    authorization: items.token,
  };

  try {
    let response = yield call(
      postApi,
      'api/front/report/details',
      action.payload,
      header,
    );
    if (response?.status == 200) {
      yield put(reportDetailsSuccess(response?.data));
    } else {
      yield put(reportDetailsFailure(response?.data));
      Toast(response?.data?.message);
    }
  } catch (error) {
    yield put(reportDetailsFailure(error));
    error?.response?.data?.message
      ? Toast(error?.response?.data?.message)
      : Toast("There's a problem getting your account, please login again.");
    error?.response?.status == 401 && (yield put(logoutRequest()));
  }
}

const watchFunction = [
  (function* () {
    yield takeLatest('Station/filterAssignListRequest', filterAssignListSaga);
  })(),
  (function* () {
    yield takeLatest('Station/areaReportListRequest', areaReportListSaga);
  })(),
  (function* () {
    yield takeLatest('Station/assignListRequest', assignListSaga);
  })(),
  (function* () {
    yield takeLatest('Station/stationReportAddRequest', stationReportAddSaga);
  })(),
  (function* () {
    yield takeLatest('Station/stationReportEditRequest', stationReportEditSaga);
  })(),
  (function* () {
    yield takeLatest(
      'Station/stationReportUpdateRequest',
      stationReportUpdateSaga,
    );
  })(),
  (function* () {
    yield takeLatest('Station/reportDetailsRequest', reportDetailsSaga);
  })(),
];
export default watchFunction;
