const actions = {
  FETCH_COURT_COMMITTAl_REQUEST: "FETCH_COURT_COMMITTAl_REQUEST",
  FETCH_COURT_COMMITTAl_SUCCESS: "FETCH_COURT_COMMITTAl_SUCCESS",
  FETCH_COURT_COMMITTAl_ERROR: "FETCH_COURT_COMMITTAl_ERROR",

  ADD_COURT_COMMITTAl_REQUEST: "ADD_COURT_COMMITTAl_REQUEST",
  ADD_COURT_COMMITTAl_SUCCESS: "ADD_COURT_COMMITTAl_SUCCESS",
  ADD_COURT_COMMITTAl_ERROR: "ADD_COURT_COMMITTAl_ERROR",

  UPDATE_COURT_COMMITTAl_REQUEST: "UPDATE_COURT_COMMITTAl_REQUEST",
  UPDATE_COURT_COMMITTAl_SUCCESS: "UPDATE_COURT_COMMITTAl_SUCCESS",
  UPDATE_COURT_COMMITTAl_ERROR: "UPDATE_COURT_COMMITTAl_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  RESET_COURT_COMMITTAl_DATA: "RESET_COURT_COMMITTAl_DATA",

  getcourtcommittalData: (url) => ({
    type: actions.FETCH_COURT_COMMITTAl_REQUEST,
    payload: { url },
  }),

  createcourtcommittal: (url, body) => ({
    type: actions.ADD_COURT_COMMITTAl_REQUEST,
    payload: { url, body },
  }),

  updatecourtcommittal: (url, body) => ({
    type: actions.UPDATE_COURT_COMMITTAl_REQUEST,
    payload: { url, body },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },

  resetcourtcommittalData: () => {
    return {
      type: actions.RESET_COURT_COMMITTAl_DATA,
    };
  },
};

export default actions;
