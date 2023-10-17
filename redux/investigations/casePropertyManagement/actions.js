const actions = {
  FETCH_CASE_PROPERTY_MANAGEMENT_REQUEST:
    "FETCH_CASE_PROPERTY_MANAGEMENT_REQUEST",
  FETCH_CASE_PROPERTY_MANAGEMENT_SUCCESS:
    "FETCH_CASE_PROPERTY_MANAGEMENT_SUCCESS",
  FETCH_CASE_PROPERTY_MANAGEMENT_ERROR: "FETCH_CASE_PROPERTY_MANAGEMENT_ERROR",

  FETCH_CASE_PROPERTY_HISTORY_REQUEST: "FETCH_CASE_PROPERTY_HISTORY_REQUEST",
  FETCH_CASE_PROPERTY_HISTORY_SUCCESS: "FETCH_CASE_PROPERTY_HISTORY_SUCCESS",
  FETCH_CASE_PROPERTY_HISTORY_ERROR: "FETCH_CASE_PROPERTY_HISTORY_ERROR",

  ADD_CASE_PROPERTY_MANAGEMENT_REQUEST: "ADD_CASE_PROPERTY_MANAGEMENT_REQUEST",
  ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS: "ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS",
  ADD_CASE_PROPERTY_MANAGEMENT_ERROR: "ADD_CASE_PROPERTY_MANAGEMENT_ERROR",

  UPDATE_CASE_PROPERTY_MANAGEMENT_REQUEST:
    "UPDATE_CASE_PROPERTY_MANAGEMENT_REQUEST",
  UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS:
    "UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS",
  UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR:
    "UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR",

  ADD_ACK_REQUEST: "ADD_ACK_REQUEST",
  ADD_ACK_SUCCESS: "ADD_ACK_SUCCESS",
  ADD_ACK_ERROR: "ADD_ACK_ERROR",

  APPROVE_ACK_REQUEST: "APPROVE_ACK_REQUEST",
  APPROVE_ACK_SUCCESS: "APPROVE_ACK_SUCCESS",
  APPROVE_ACK_ERROR: "APPROVE_ACK_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addCasePropertyManagementDetails: (url, body) => ({
    type: actions.ADD_CASE_PROPERTY_MANAGEMENT_REQUEST,
    payload: { url, body },
  }),

  updateCasePropertyManagementDetails: (url, body) => ({
    type: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_REQUEST,
    payload: { url, body },
  }),

  getCasePropertyManagementList: (url) => ({
    type: actions.FETCH_CASE_PROPERTY_MANAGEMENT_REQUEST,
    payload: { url },
  }),

  getCasePropertyHistoryList: (url) => ({
    type: actions.FETCH_CASE_PROPERTY_HISTORY_REQUEST,
    payload: { url },
  }),

  addAckFSL: (url, body) => ({
    type: actions.ADD_ACK_REQUEST,
    payload: { url, body },
  }),

  actionAckFSL: (url, body) => ({
    type: actions.APPROVE_ACK_REQUEST,
    payload: { url, body },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
