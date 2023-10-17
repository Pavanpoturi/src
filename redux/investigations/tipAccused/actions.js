const actions = {
  FETCH_TIPACCUSED_REQUEST: "FETCH_TIPACCUSED_REQUEST",
  FETCH_TIPACCUSED_SUCCESS: "FETCH_TIPACCUSED_SUCCESS",
  FETCH_TIPACCUSED_ERROR: "FETCH_TIPACCUSED_ERROR",

  ADD_TIPACCUSED_REQUEST: "ADD_TIPACCUSED_REQUEST",
  ADD_TIPACCUSED_SUCCESS: "ADD_TIPACCUSED_SUCCESS",
  ADD_TIPACCUSED_ERROR: "ADD_TIPACCUSED_ERROR",

  UPDATE_TIPACCUSED_REQUEST: "UPDATE_TIPACCUSED_REQUEST",
  UPDATE_TIPACCUSED_SUCCESS: "UPDATE_TIPACCUSED_SUCCESS",
  UPDATE_TIPACCUSED_ERROR: "UPDATE_TIPACCUSED_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addTIPAccusedDetails: (url, body) => ({
    type: actions.ADD_TIPACCUSED_REQUEST,
    payload: { url, body },
  }),

  updateTIPAccusedDetails: (url, body) => ({
    type: actions.UPDATE_TIPACCUSED_REQUEST,
    payload: { url, body },
  }),

  getTIPAccusedList: (url) => ({
    type: actions.FETCH_TIPACCUSED_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
