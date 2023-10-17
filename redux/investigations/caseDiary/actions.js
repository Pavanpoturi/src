const actions = {
  FETCH_CASE_DIARY_REQUEST: "FETCH_CASE_DIARY_REQUEST",
  FETCH_CASE_DIARY_SUCCESS: "FETCH_CASE_DIARY_SUCCESS",
  FETCH_CASE_DIARY_ERROR: "FETCH_CASE_DIARY_ERROR",

  ADD_CASE_DIARY_REQUEST: "ADD_CASE_DIARY_REQUEST",
  ADD_CASE_DIARY_SUCCESS: "ADD_CASE_DIARY_SUCCESS",
  ADD_CASE_DIARY_ERROR: "ADD_CASE_DIARY_ERROR",

  UPDATE_CASE_DIARY_REQUEST: "UPDATE_CASE_DIARY_REQUEST",
  UPDATE_CASE_DIARY_SUCCESS: "UPDATE_CASE_DIARY_SUCCESS",
  UPDATE_CASE_DIARY_ERROR: "UPDATE_CASE_DIARY_ERROR",

  DELETE_CASE_DIARY_REQUEST: "DELETE_CASE_DIARY_REQUEST",
  DELETE_CASE_DIARY_SUCCESS: "DELETE_CASE_DIARY_SUCCESS",
  DELETE_CASE_DIARY_ERROR: "DELETE_CASE_DIARY_ERROR",

  GENERATE_CASE_DIARY_REQUEST: "GENERATE_CASE_DIARY_REQUEST",
  GENERATE_CASE_DIARY_SUCCESS: "GENERATE_CASE_DIARY_SUCCESS",
  GENERATE_CASE_DIARY_ERROR: "GENERATE_CASE_DIARY_ERROR",

  UPLOAD_CASE_DIARY_REQUEST: "UPLOAD_CASE_DIARY_REQUEST",
  UPLOAD_CASE_DIARY_SUCCESS: "UPLOAD_CASE_DIARY_SUCCESS",
  UPLOAD_CASE_DIARY_ERROR: "UPLOAD_CASE_DIARY_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  createCaseDiary: (url, body) => ({
    type: actions.ADD_CASE_DIARY_REQUEST,
    payload: { url, body },
  }),

  updateCaseDiary: (url, body) => ({
    type: actions.UPDATE_CASE_DIARY_REQUEST,
    payload: { url, body },
  }),

  generateCaseDiary: (url, body) => ({
    type: actions.GENERATE_CASE_DIARY_REQUEST,
    payload: { url, body },
  }),

  uploadCaseDiary: (url, body) => ({
    type: actions.UPLOAD_CASE_DIARY_REQUEST,
    payload: { url, body },
  }),

  getCaseDiary: (url) => ({
    type: actions.FETCH_CASE_DIARY_REQUEST,
    payload: { url },
  }),

  deleteCaseDiary: (url, body) => ({
    type: actions.DELETE_CASE_DIARY_REQUEST,
    payload: { url, body },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
