const actions = {
  FETCH_FORM54_REQUEST: "FETCH_FORM54_REQUEST",
  FETCH_FORM54_SUCCESS: "FETCH_FORM54_SUCCESS",
  FETCH_FORM54_ERROR: "FETCH_FORM54_ERROR",

  ADD_FORM54_REQUEST: "ADD_FORM54_REQUEST",
  ADD_FORM54_SUCCESS: "ADD_FORM54_SUCCESS",
  ADD_FORM54_ERROR: "ADD_FORM54_ERROR",

  UPDATE_FORM54_REQUEST: "UPDATE_FORM54_REQUEST",
  UPDATE_FORM54_SUCCESS: "UPDATE_FORM54_SUCCESS",
  UPDATE_FORM54_ERROR: "UPDATE_FORM54_ERROR",

  FETCH_ACCIDENT_INFORMATION_REQUEST: "FETCH_ACCIDENT_INFORMATION_REQUEST",
  FETCH_ACCIDENT_INFORMATION_SUCCESS: "FETCH_ACCIDENT_INFORMATION_SUCCESS",
  FETCH_ACCIDENT_INFORMATION_ERROR: "FETCH_ACCIDENT_INFORMATION_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  RESET_ACCIDENT_INFORMATION: "RESET_ACCIDENT_INFORMATION",

  addform54Details: (url, body, firNum) => ({
    type: actions.ADD_FORM54_REQUEST,
    payload: { url, body, firNum },
  }),

  updateform54Details: (url, body, firNum) => ({
    type: actions.UPDATE_FORM54_REQUEST,
    payload: { url, body, firNum },
  }),

  getform54List: (url) => ({
    type: actions.FETCH_FORM54_REQUEST,
    payload: { url },
  }),

  getAccidentInformationReport: (url) => ({
    type: actions.FETCH_ACCIDENT_INFORMATION_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },

  resetAccidentInformationReport: () => {
    return {
      type: actions.RESET_ACCIDENT_INFORMATION,
    };
  },
};

export default actions;
