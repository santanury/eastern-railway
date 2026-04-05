import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: {},
  isLoading: true,
  error: {},
  userResponse: {},
  updateUserResponse: {},
};

const UserReducer = createSlice({
  name: 'User',
  initialState,
  reducers: {
    userStatusBreak(state, action) {
      state.status = action.type;
    },

    // get user
    getUserRequest(state, action) {
      state.status = action.type;
    },
    getUserSuccess(state, action) {
      state.status = action.type;
      state.userResponse = action.payload;
    },
    getUserFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // update user
    updateUserRequest(state, action) {
      state.status = action.type;
    },
    updateUserSuccess(state, action) {
      state.status = action.type;
      state.updateUserResponse = action.payload;
    },
    updateUserFailure(state, action) {
      state.status = action.type;
      state.error = action;
    },
  },
});

export const {
  userStatusBreak,

  getUserRequest,
  getUserSuccess,
  getUserFailure,

  updateUserRequest,
  updateUserSuccess,
  updateUserFailure,
} = UserReducer.actions;

export default UserReducer.reducer;
