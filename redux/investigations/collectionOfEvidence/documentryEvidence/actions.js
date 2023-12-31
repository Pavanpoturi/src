const actions = {
  FETCH_DOCUMENTRY_EVIDENCE_REQUEST: "FETCH_DOCUMENTRY_EVIDENCE_REQUEST",
  FETCH_DOCUMENTRY_EVIDENCE_SUCCESS: "FETCH_DOCUMENTRY_EVIDENCE_SUCCESS",
  FETCH_DOCUMENTRY_EVIDENCE_ERROR: "FETCH_DOCUMENTRY_EVIDENCE_ERROR",

  ADD_DOCUMENTRY_EVIDENCE_REQUEST: "ADD_DOCUMENTRY_EVIDENCE_REQUEST",
  ADD_DOCUMENTRY_EVIDENCE_SUCCESS: "ADD_DOCUMENTRY_EVIDENCE_SUCCESS",
  ADD_DOCUMENTRY_EVIDENCE_ERROR: "ADD_DOCUMENTRY_EVIDENCE_ERROR",

  UPDATE_DOCUMENTRY_EVIDENCE_REQUEST: "UPDATE_DOCUMENTRY_EVIDENCE_REQUEST",
  UPDATE_DOCUMENTRY_EVIDENCE_SUCCESS: "UPDATE_DOCUMENTRY_EVIDENCE_SUCCESS",
  UPDATE_DOCUMENTRY_EVIDENCE_ERROR: "UPDATE_DOCUMENTRY_EVIDENCE_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  addDocumentryEvidenceDetails: (url, body) => ({
    type: actions.ADD_DOCUMENTRY_EVIDENCE_REQUEST,
    payload: { url, body },
  }),

  updateDocumentryEvidenceDetails: (url, body) => ({
    type: actions.UPDATE_DOCUMENTRY_EVIDENCE_REQUEST,
    payload: { url, body },
  }),

  getDocumentryEvidenceList: (url) => ({
    type: actions.FETCH_DOCUMENTRY_EVIDENCE_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
