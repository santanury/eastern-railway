import {configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import AuthReducer from './reducers/AuthReducer';
import StationReducer from './reducers/StationReducer';
import UserReducer from './reducers/UserReducer';
import RootSaga from './sagas/RootSaga';

let SagaMiddleware = createSagaMiddleware();
const middleware = [SagaMiddleware, logger];

export default configureStore({
  reducer: {
    AuthReducer,
    UserReducer,
    StationReducer,
  },
  middleware: getDefaultMiddlewre =>
    getDefaultMiddlewre({
      serializableCheck: false,
    }).concat(...middleware),
});
SagaMiddleware.run(RootSaga);
