import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  status: {},
  isLoading: true,
  error: {},
  message: '',
  filterAssignListResponse: {},
  areaReportListResponse: {},
  assignListResponse: {},
  stationReportAddResponse: {},
  stationReportUpdateResponse: {},
  stationRepostEditResponse: {},
  reportDetailsResponse: {},
};

const StationReducer = createSlice({
  name: 'Station',
  initialState,
  reducers: {
    // break status
    stationStatusBreak(state, action) {
      state.status = action.type;
    },

    // gilter assign list
    filterAssignListRequest(state, action) {
      state.status = action.type;
    },
    filterAssignListSuccess(state, action) {
      state.status = action.type;
      state.filterAssignListResponse = action.payload;
    },
    filterAssignListFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // area report list
    areaReportListRequest(state, action) {
      state.status = action.type;
    },
    areaReportListSuccess(state, action) {
      state.status = action.type;
      state.areaReportListResponse = action.payload;
    },
    areaReportListFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // assign list
    assignListRequest(state, action) {
      state.status = action.type;
    },
    assignListSuccess(state, action) {
      state.status = action.type;
      state.assignListResponse = action.payload;
    },
    assignListFailure(state, action) {
      state.status = action.type;
      state.error = action;
    },

    // station report add
    stationReportAddRequest(state, action) {
      state.status = action.type;
    },
    stationReportAddSuccess(state, action) {
      state.status = action.type;
      state.stationReportAddResponse = action.payload;
    },
    stationReportAddFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // station report edit
    stationReportEditRequest(state, action) {
      state.status = action.type;
    },
    stationReportEditSuccess(state, action) {
      state.status = action.type;
      state.stationRepostEditResponse = action.payload;
    },
    stationReportEditFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // station report update
    stationReportUpdateRequest(state, action) {
      state.status = action.type;
    },
    stationReportUpdateSuccess(state, action) {
      state.status = action.type;
      state.stationReportUpdateResponse = action.payload;
    },
    stationReportUpdateFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },

    // report detail
    reportDetailsRequest(state, action) {
      state.status = action.type;
    },
    reportDetailsSuccess(state, action) {
      state.status = action.type;
      state.reportDetailsResponse = action.payload;
    },
    reportDetailsFailure(state, action) {
      state.status = action.type;
      state.error = action.payload;
    },
  },
});

export const {
  stationStatusBreak,

  filterAssignListRequest,
  filterAssignListSuccess,
  filterAssignListFailure,

  areaReportListRequest,
  areaReportListSuccess,
  areaReportListFailure,

  assignListRequest,
  assignListSuccess,
  assignListFailure,

  stationReportAddRequest,
  stationReportAddSuccess,
  stationReportAddFailure,

  stationReportEditRequest,
  stationReportEditSuccess,
  stationReportEditFailure,

  stationReportUpdateRequest,
  stationReportUpdateSuccess,
  stationReportUpdateFailure,

  reportDetailsRequest,
  reportDetailsSuccess,
  reportDetailsFailure,
} = StationReducer.actions;

export default StationReducer.reducer;
