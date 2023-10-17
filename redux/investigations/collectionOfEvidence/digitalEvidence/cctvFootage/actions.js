const actions = {
  FETCH_CCTV_REQUEST: "FETCH_CCTV_REQUEST",
  FETCH_CCTV_SUCCESS: "FETCH_CCTV_SUCCESS",
  FETCH_CCTV_ERROR: "FETCH_CCTV_ERROR",

  ADD_CCTV_REQUEST: "ADD_CCTV_REQUEST",
  ADD_CCTV_SUCCESS: "ADD_CCTV_SUCCESS",
  ADD_CCTV_ERROR: "ADD_CCTV_ERROR",

  UPDATE_CCTV_REQUEST: "UPDATE_CCTV_REQUEST",
  UPDATE_CCTV_SUCCESS: "UPDATE_CCTV_SUCCESS",
  UPDATE_CCTV_ERROR: "UPDATE_CCTV_ERROR",

  SEND_REQUISITION_REQUEST: "SEND_REQUISITION_REQUEST",
  SEND_REQUISITION_SUCCESS: "SEND_REQUISITION_SUCCESS",
  SEND_REQUISITION_ERROR: "SEND_REQUISITION_ERROR",

  RESET_REQUISITION_ACTION_TYPE: "RESET_REQUISITION_ACTION_TYPE",

  UPLOAD_ENHANCED_REQUEST: "UPLOAD_ENHANCED_REQUEST",
  UPLOAD_ENHANCED_SUCCESS: "UPLOAD_ENHANCED_SUCCESS",
  UPLOAD_ENHANCED_ERROR: "UPLOAD_ENHANCED_ERROR",

  RESET_ENHANCED_ACTION_TYPE: "RESET_ENHANCED_ACTION_TYPE",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addCCTVFootageDetails: (url, body) => ({
    type: actions.ADD_CCTV_REQUEST,
    payload: { url, body },
  }),

  updateCCTVFootageDetails: (url, body) => ({
    type: actions.UPDATE_CCTV_REQUEST,
    payload: { url, body },
  }),

  sendRequisitionDetails: (url, body) => ({
    type: actions.SEND_REQUISITION_REQUEST,
    payload: { url, body },
  }),

  uploadEnhancedDetails: (url, body) => ({
    type: actions.UPLOAD_ENHANCED_REQUEST,
    payload: { url, body },
  }),

  getCCTVFootageList: (url) => ({
    type: actions.FETCH_CCTV_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },

  resetRequisitionActionType: () => {
    return {
      type: actions.RESET_REQUISITION_ACTION_TYPE,
    };
  },

  resetEnhancedActionType: () => {
    return {
      type: actions.RESET_ENHANCED_ACTION_TYPE,
    };
  },
};
export default actions;
