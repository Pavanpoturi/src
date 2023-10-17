const actions = {
  FETCH_PT_WARRANT_REQUEST: "FETCH_PT_WARRANT_REQUEST",
  FETCH_PT_WARRANT_SUCCESS: "FETCH_PT_WARRANT_SUCCESS",
  FETCH_PT_WARRANT_ERROR: "FETCH_PT_WARRANT_ERROR",

  ADD_PT_WARRANT_REQUEST: "ADD_PT_WARRANT_REQUEST",
  ADD_PT_WARRANT_SUCCESS: "ADD_PT_WARRANT_SUCCESS",
  ADD_PT_WARRANT_ERROR: "ADD_PT_WARRANT_ERROR",

  UPDATE_PT_WARRANT_REQUEST: "UPDATE_PT_WARRANT_REQUEST",
  UPDATE_PT_WARRANT_SUCCESS: "UPDATE_PT_WARRANT_SUCCESS",
  UPDATE_PT_WARRANT_ERROR: "UPDATE_PT_WARRANT_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addPTWarrantDetails: (url, body) => ({
    type: actions.ADD_PT_WARRANT_REQUEST,
    payload: { url, body },
  }),

  updatePTWarrantDetails: (url, body) => ({
    type: actions.UPDATE_PT_WARRANT_REQUEST,
    payload: { url, body },
  }),

  getPTWarrantList: (url) => ({
    type: actions.FETCH_PT_WARRANT_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
