const actions = {
  FETCH_EXHUMATION_REQUEST: "FETCH_EXHUMATION_REQUEST",
  FETCH_EXHUMATION_SUCCESS: "FETCH_EXHUMATION_SUCCESS",
  FETCH_EXHUMATION_ERROR: "FETCH_EXHUMATION_ERROR",

  ADD_EXHUMATION_REQUEST: "ADD_EXHUMATION_REQUEST",
  ADD_EXHUMATION_SUCCESS: "ADD_EXHUMATION_SUCCESS",
  ADD_EXHUMATION_ERROR: "ADD_EXHUMATION_ERROR",

  UPDATE_EXHUMATION_REQUEST: "UPDATE_EXHUMATION_REQUEST",
  UPDATE_EXHUMATION_SUCCESS: "UPDATE_EXHUMATION_SUCCESS",
  UPDATE_EXHUMATION_ERROR: "UPDATE_EXHUMATION_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addExhumationDetails: (url, body) => ({
    type: actions.ADD_EXHUMATION_REQUEST,
    payload: { url, body },
  }),

  updateExhumationDetails: (url, body) => ({
    type: actions.UPDATE_EXHUMATION_REQUEST,
    payload: { url, body },
  }),

  getExhumationList: (url) => ({
    type: actions.FETCH_EXHUMATION_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
