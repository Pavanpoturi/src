const actions = {
  FETCH_INQUEST_REQUEST: "FETCH_INQUEST_REQUEST",
  FETCH_INQUEST_SUCCESS: "FETCH_INQUEST_SUCCESS",
  FETCH_INQUEST_ERROR: "FETCH_INQUEST_ERROR",

  ADD_INQUEST_REQUEST: "ADD_INQUEST_REQUEST",
  ADD_INQUEST_SUCCESS: "ADD_INQUEST_SUCCESS",
  ADD_INQUEST_ERROR: "ADD_INQUEST_ERROR",

  UPDATE_INQUEST_REQUEST: "UPDATE_INQUEST_REQUEST",
  UPDATE_INQUEST_SUCCESS: "UPDATE_INQUEST_SUCCESS",
  UPDATE_INQUEST_ERROR: "UPDATE_INQUEST_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addInquestDetails: (url, body) => ({
    type: actions.ADD_INQUEST_REQUEST,
    payload: { url, body },
  }),

  updateInquestDetails: (url, body) => ({
    type: actions.UPDATE_INQUEST_REQUEST,
    payload: { url, body },
  }),

  getInquestList: (url) => ({
    type: actions.FETCH_INQUEST_REQUEST,
    payload: { url },
  }),
  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
