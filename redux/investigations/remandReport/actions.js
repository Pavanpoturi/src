const actions = {
  FETCH_REMAND_REPORT_REQUEST: "FETCH_REMAND_REPORT_REQUEST",
  FETCH_REMAND_REPORT_SUCCESS: "FETCH_REMAND_REPORT_SUCCESS",
  FETCH_REMAND_REPORT_ERROR: "FETCH_REMAND_REPORT_ERROR",

  ADD_REMAND_REPORT_REQUEST: "ADD_REMAND_REPORT_REQUEST",
  ADD_REMAND_REPORT_SUCCESS: "ADD_REMAND_REPORT_SUCCESS",
  ADD_REMAND_REPORT_ERROR: "ADD_REMAND_REPORT_ERROR",

  UPDATE_REMAND_REPORT_REQUEST: "UPDATE_REMAND_REPORT_REQUEST",
  UPDATE_REMAND_REPORT_SUCCESS: "UPDATE_REMAND_REPORT_SUCCESS",
  UPDATE_REMAND_REPORT_ERROR: "UPDATE_REMAND_REPORT_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addRemandReportDetails: (url, body) => ({
    type: actions.ADD_REMAND_REPORT_REQUEST,
    payload: { url, body },
  }),

  updateRemandReportDetails: (url, body) => ({
    type: actions.UPDATE_REMAND_REPORT_REQUEST,
    payload: { url, body },
  }),

  getRemandReportList: (url) => ({
    type: actions.FETCH_REMAND_REPORT_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
