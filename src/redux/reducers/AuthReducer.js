import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: {},
  isLoading: true,
  error: {},
  message: '',
  userCheckResponse: {},
  signinResponse: {},
  forgotPasswordResponse: {},
  forgotPasswordOtpVerificationResponse: {},
  forgotPasswordNewPasswordResponse: {},
  tempToken: null,
  token: null,
  changePasswordResponse: {},
  logoutResponse: {},
};

const AuthReducer = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    // break status
    authStatusBreak(state, action) {
      state.status = action.type;
    },

    // get token
    getTokenRequest(state, action) {
      state.status = action.type;
    },
    getTokenSuccess(state, action) {
      state.status = action.type;
      state.tempToken = action.payload;
    },
    getTokenFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // user check
    userCheckRequest(state, action) {
      state.status = action.type;
    },
    userCheckSuccess(state, action) {
      state.status = action.type;
      state.userCheckResponse = action.payload;
      state.token = state.tempToken;
      state.tempToken = null;
    },
    userCheckFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
      state.tempToken = null;
      state.token = null;
    },

    // signin
    signinRequest(state, action) {
      state.status = action.type;
    },
    signinSuccess(state, action) {
      state.status = action.type;
      state.signinResponse = action.payload;
      state.token = action.payload?.token;
    },
    signinFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
    },

    // forgot password
    forgotPasswordRequest(state, action) {
      state.status = action.type;
    },
    forgotPasswordSuccess(state, action) {
      state.status = action.type;
      state.forgotPasswordResponse = action.payload;
    },
    forgotPasswordFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
    },

    // forgot password otp verification
    forgotPasswordOtpVerificationRequest(state, action) {
      state.status = action.type;
    },
    forgotPasswordOtpVerificationSuccess(state, action) {
      state.status = action.type;
      state.forgotPasswordOtpVerificationResponse = action.payload;
    },
    forgotPasswordOtpVerificationFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
    },

    // forgot password new password
    forgotPasswordNewPasswordRequest(state, action) {
      state.status = action.type;
    },
    forgotPasswordNewPasswordSuccess(state, action) {
      state.status = action.type;
      state.forgotPasswordNewPasswordResponse = action.payload;
    },
    forgotPasswordNewPasswordFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
    },

    // change password
    changePasswordRequest(state, action) {
      state.status = action.type;
    },
    changePasswordSuccess(state, action) {
      state.status = action.type;
      state.changePasswordResponse = action.payload;
    },
    changePasswordFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
    },

    // logout
    logoutRequest(state, action) {
      state.status = action.type;
    },
    logoutSuccess(state, action) {
      state.status = action.type;
      state.logoutResponse = action.payload;
      state.token = null;
    },
    logoutFailure(state, action) {
      state.status = action.type;
      state.error = action.payload.message;
      state.token = null;
    },
  },
});

export const {
  authStatusBreak,

  getTokenRequest,
  getTokenSuccess,
  getTokenFailure,

  userCheckRequest,
  userCheckSuccess,
  userCheckFailure,

  signinRequest,
  signinSuccess,
  signinFailure,

  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,

  forgotPasswordOtpVerificationRequest,
  forgotPasswordOtpVerificationSuccess,
  forgotPasswordOtpVerificationFailure,

  forgotPasswordNewPasswordRequest,
  forgotPasswordNewPasswordSuccess,
  forgotPasswordNewPasswordFailure,

  changePasswordRequest,
  changePasswordSuccess,
  changePasswordFailure,

  logoutRequest,
  logoutSuccess,
  logoutFailure,
} = AuthReducer.actions;

export default AuthReducer.reducer;
