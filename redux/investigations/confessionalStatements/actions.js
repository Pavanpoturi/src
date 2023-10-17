const actions = {
  FETCH_CONFESSIONAL_STATEMENTS_REQUEST:
    "FETCH_CONFESSIONAL_STATEMENTS_REQUEST",
  FETCH_CONFESSIONAL_STATEMENTS_SUCCESS:
    "FETCH_CONFESSIONAL_STATEMENTS_SUCCESS",
  FETCH_CONFESSIONAL_STATEMENTS_ERROR: "FETCH_CONFESSIONAL_STATEMENTS_ERROR",

  ADD_CONFESSIONAL_STATEMENTS_REQUEST: "ADD_CONFESSIONAL_STATEMENTS_REQUEST",
  ADD_CONFESSIONAL_STATEMENTS_SUCCESS: "ADD_CONFESSIONAL_STATEMENTS_SUCCESS",
  ADD_CONFESSIONAL_STATEMENTS_ERROR: "ADD_CONFESSIONAL_STATEMENTS_ERROR",

  UPDATE_CONFESSIONAL_STATEMENTS_REQUEST:
    "UPDATE_CONFESSIONAL_STATEMENTS_REQUEST",
  UPDATE_CONFESSIONAL_STATEMENTS_SUCCESS:
    "UPDATE_CONFESSIONAL_STATEMENTS_SUCCESS",
  UPDATE_CONFESSIONAL_STATEMENTS_ERROR: "UPDATE_CONFESSIONAL_STATEMENTS_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addConfessionalStatementsDetails: (url, body) => ({
    type: actions.ADD_CONFESSIONAL_STATEMENTS_REQUEST,
    payload: { url, body },
  }),

  updateConfessionalStatementsDetails: (url, body) => ({
    type: actions.UPDATE_CONFESSIONAL_STATEMENTS_REQUEST,
    payload: { url, body },
  }),

  getConfessionalStatementsList: (url) => ({
    type: actions.FETCH_CONFESSIONAL_STATEMENTS_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
