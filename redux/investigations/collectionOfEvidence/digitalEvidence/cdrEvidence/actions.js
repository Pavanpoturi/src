const actions = {
  FETCH_CDR_REQUEST: "FETCH_CDR_REQUEST",
  FETCH_CDR_SUCCESS: "FETCH_CDR_SUCCESS",
  FETCH_CDR_ERROR: "FETCH_CDR_ERROR",

  ADD_CDR_REQUEST: "ADD_CDR_REQUEST",
  ADD_CDR_SUCCESS: "ADD_CDR_SUCCESS",
  ADD_CDR_ERROR: "ADD_CDR_ERROR",

  UPDATE_CDR_REQUEST: "UPDATE_CDR_REQUEST",
  UPDATE_CDR_SUCCESS: "UPDATE_CDR_SUCCESS",
  UPDATE_CDR_ERROR: "UPDATE_CDR_ERROR",

  REQUEST_CDR_REQUEST: "REQUEST_CDR_REQUEST",
  REQUEST_CDR_SUCCESS: "REQUEST_CDR_SUCCESS",
  REQUEST_CDR_ERROR: "REQUEST_CDR_ERROR",

  UPLOAD_CDR_RESULT_REQUEST: "UPLOAD_CDR_RESULT_REQUEST",
  UPLOAD_CDR_RESULT_SUCCESS: "UPLOAD_CDR_RESULT_SUCCESS",
  UPLOAD_CDR_RESULT_ERROR: "UPLOAD_CDR_RESULT_ERROR",

  RESET_REQUEST_CDR_ACTIONTYPE: "RESET_REQUEST_CDR_ACTIONTYPE",
  RESET_CDR_RESULT_ACTION: "RESET_CDR_RESULT_ACTION",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addCDRDetails: (url, body) => ({
    type: actions.ADD_CDR_REQUEST,
    payload: { url, body },
  }),

  updateCDRDetails: (url, body) => ({
    type: actions.UPDATE_CDR_REQUEST,
    payload: { url, body },
  }),

  requestCDRDetails: (url, body) => ({
    type: actions.REQUEST_CDR_REQUEST,
    payload: { url, body },
  }),

  uploadCDRRequestDetails: (url, body) => ({
    type: actions.UPLOAD_CDR_RESULT_REQUEST,
    payload: { url, body },
  }),

  getCDRList: (url) => ({
    type: actions.FETCH_CDR_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },

  resetRequestCDRActionType: () => {
    return {
      type: actions.RESET_REQUEST_CDR_ACTIONTYPE,
    };
  },

  resetCDRRequestActionType: () => {
    return {
      type: actions.RESET_CDR_RESULT_ACTION,
    };
  },
};
export default actions;
