const actions = {
  FETCH_ISSUE_OF_SUMMONS_REQUEST: "FETCH_ISSUE_OF_SUMMONS_REQUEST",
  FETCH_ISSUE_OF_SUMMONS_SUCCESS: "FETCH_ISSUE_OF_SUMMONS_SUCCESS",
  FETCH_ISSUE_OF_SUMMONS_ERROR: "FETCH_ISSUE_OF_SUMMONS_ERROR",

  ADD_ISSUE_OF_SUMMONS_REQUEST: "ADD_ISSUE_OF_SUMMONS_REQUEST",
  ADD_ISSUE_OF_SUMMONS_SUCCESS: "ADD_ISSUE_OF_SUMMONS_SUCCESS",
  ADD_ISSUE_OF_SUMMONS_ERROR: "ADD_ISSUE_OF_SUMMONS_ERROR",

  UPDATE_ISSUE_OF_SUMMONS_REQUEST: "UPDATE_ISSUE_OF_SUMMONS_REQUEST",
  UPDATE_ISSUE_OF_SUMMONS_SUCCESS: "UPDATE_ISSUE_OF_SUMMONS_SUCCESS",
  UPDATE_ISSUE_OF_SUMMONS_ERROR: "UPDATE_ISSUE_OF_SUMMONS_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addIssueOfSummons: (url, body) => ({
    type: actions.ADD_ISSUE_OF_SUMMONS_REQUEST,
    payload: { url, body },
  }),

  updateIssueOfSummons: (url, body) => ({
    type: actions.UPDATE_ISSUE_OF_SUMMONS_REQUEST,
    payload: { url, body },
  }),

  getIssueOfSummonsList: (url) => ({
    type: actions.FETCH_ISSUE_OF_SUMMONS_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
