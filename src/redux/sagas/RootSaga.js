import {all} from 'redux-saga/effects';
import AuthSaga from './AuthSaga';
import StationSaga from './StationSaga';
import UserSaga from './UserSaga';

const combinedSaga = [...AuthSaga, ...UserSaga, ...StationSaga];

export default function* RootSaga() {
  yield all(combinedSaga);
}
