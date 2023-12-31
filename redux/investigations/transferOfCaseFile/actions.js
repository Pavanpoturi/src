const actions = {
  FETCH_TRANSFER_OF_CASE_FILE_REQUEST: "FETCH_TRANSFER_OF_CASE_FILE_REQUEST",
  FETCH_TRANSFER_OF_CASE_FILE_SUCCESS: "FETCH_TRANSFER_OF_CASE_FILE_SUCCESS",
  FETCH_TRANSFER_OF_CASE_FILE_ERROR: "FETCH_TRANSFER_OF_CASE_FILE_ERROR",

  ADD_TRANSFER_OF_CASE_FILE_REQUEST: "ADD_TRANSFER_OF_CASE_FILE_REQUEST",
  ADD_TRANSFER_OF_CASE_FILE_SUCCESS: "ADD_TRANSFER_OF_CASE_FILE_SUCCESS",
  ADD_TRANSFER_OF_CASE_FILE_ERROR: "ADD_TRANSFER_OF_CASE_FILE_ERROR",

  UPDATE_TRANSFER_OF_CASE_FILE_REQUEST: "UPDATE_TRANSFER_OF_CASE_FILE_REQUEST",
  UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS: "UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS",
  UPDATE_TRANSFER_OF_CASE_FILE_ERROR: "UPDATE_TRANSFER_OF_CASE_FILE_ERROR",

  UPDATE_TRANSFER_OF_ARREST_CASE_FILE_REQUEST:
    "UPDATE_TRANSFER_OF_ARREST_CASE_FILE_REQUEST",
  UPDATE_TRANSFER_OF_ARREST_CASE_FILE_SUCCESS:
    "UPDATE_TRANSFER_OF_ARREST_CASE_FILE_SUCCESS",
  UPDATE_TRANSFER_OF_ARREST_CASE_FILE_ERROR:
    "UPDATE_TRANSFER_OF_ARREST_CASE_FILE_ERROR",

  TRANSFER_FIR_REQUEST: "TRANSFER_FIR_REQUEST",
  TRANSFER_FIR_SUCCESS: "TRANSFER_FIR_SUCCESS",
  TRANSFER_FIR_ERROR: "TRANSFER_FIR_ERROR",

  FORWARD_FIR_REQUEST: "FORWARD_FIR_REQUEST",
  FORWARD_FIR_SUCCESS: "FORWARD_FIR_SUCCESS",
  FORWARD_FIR_ERROR: "FORWARD_FIR_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addTransferOfCaseFileDetails: (url, body) => ({
    type: actions.ADD_TRANSFER_OF_CASE_FILE_REQUEST,
    payload: { url, body },
  }),

  transferFIR: (url, body) => ({
    type: actions.TRANSFER_FIR_REQUEST,
    payload: { url, body },
  }),

  forwardFIR: (url, body) => ({
    type: actions.FORWARD_FIR_REQUEST,
    payload: { url, body },
  }),

  updateTransferOfCaseFileDetails: (url, body) => ({
    type: actions.UPDATE_TRANSFER_OF_CASE_FILE_REQUEST,
    payload: { url, body },
  }),

  updateTransferOfArrestCaseFileDetails: (url, body) => ({
    type: actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_REQUEST,
    payload: { url, body },
  }),

  getTransferOfCaseFileList: (url) => ({
    type: actions.FETCH_TRANSFER_OF_CASE_FILE_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
