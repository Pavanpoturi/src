const actions = {
  FETCH_DECEASED_REQUEST: "FETCH_DECEASED_REQUEST",
  FETCH_DECEASED_SUCCESS: "FETCH_DECEASED_SUCCESS",
  FETCH_DECEASED_ERROR: "FETCH_DECEASED_ERROR",

  ADD_DECEASED_REQUEST: "ADD_DECEASED_REQUEST",
  ADD_DECEASED_SUCCESS: "ADD_DECEASED_SUCCESS",
  ADD_DECEASED_ERROR: "ADD_DECEASED_ERROR",

  UPDATE_DECEASED_REQUEST: "UPDATE_DECEASED_REQUEST",
  UPDATE_DECEASED_SUCCESS: "UPDATE_DECEASED_SUCCESS",
  UPDATE_DECEASED_ERROR: "UPDATE_DECEASED_ERROR",

  FETCH_NOTICE_160_REQUEST: "FETCH_NOTICE_160_REQUEST",
  FETCH_NOTICE_160_SUCCESS: "FETCH_NOTICE_160_SUCCESS",
  FETCH_NOTICE_160_ERROR: "FETCH_NOTICE_160_ERROR",

  ADD_NOTICE_160_REQUEST: "ADD_NOTICE_160_REQUEST",
  ADD_NOTICE_160_SUCCESS: "ADD_NOTICE_160_SUCCESS",
  ADD_NOTICE_160_ERROR: "ADD_NOTICE_160_ERROR",

  UPDATE_NOTICE_160_REQUEST: "UPDATE_NOTICE_160_REQUEST",
  UPDATE_NOTICE_160_SUCCESS: "UPDATE_NOTICE_160_SUCCESS",
  UPDATE_NOTICE_160_ERROR: "UPDATE_NOTICE_160_ERROR",

  RESET_DECEASED_ACTIONTYPE: "RESET_DECEASED_ACTIONTYPE",
  RESET_NOTICE_160_ACTIONTYPE: "RESET_NOTICE_160_ACTIONTYPE",

  addDeceasedDetails: (url, body) => ({
    type: actions.ADD_DECEASED_REQUEST,
    payload: { url, body },
  }),

  updateDeceasedDetails: (url, body) => ({
    type: actions.UPDATE_DECEASED_REQUEST,
    payload: { url, body },
  }),

  getDeceasedList: (url) => ({
    type: actions.FETCH_DECEASED_REQUEST,
    payload: { url },
  }),

  resetDeceasedActionType: () => {
    return {
      type: actions.RESET_DECEASED_ACTIONTYPE,
    };
  },

  addNotice160Details: (url, body) => ({
    type: actions.ADD_NOTICE_160_REQUEST,
    payload: { url, body },
  }),

  updateNotice160Details: (url, body) => ({
    type: actions.UPDATE_NOTICE_160_REQUEST,
    payload: { url, body },
  }),

  getNotice160List: (url) => ({
    type: actions.FETCH_NOTICE_160_REQUEST,
    payload: { url },
  }),

  resetNotice160ActionType: () => {
    return {
      type: actions.RESET_NOTICE_160_ACTIONTYPE,
    };
  },
};
export default actions;
