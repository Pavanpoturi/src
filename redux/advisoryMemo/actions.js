const actions = {
  CREATE_ADVISORY_MEMO_REQUEST: "CREATE_ADVISORY_MEMO_REQUEST",
  CREATE_ADVISORY_MEMO_SUCCESS: "CREATE_ADVISORY_MEMO_SUCCESS",
  CREATE_ADVISORY_MEMO_ERROR: "CREATE_ADVISORY_MEMO_ERROR",

  GET_ADVISORY_LIST_REQUEST: "GET_ADVISORY_LIST_REQUEST",
  GET_ADVISORY_LIST_SUCCESS: "GET_ADVISORY_LIST_SUCCESS",
  GET_ADVISORY_LIST_ERROR: "GET_ADVISORY_LIST_ERROR",

  SEND_COMPLIANCE_REQUEST: "SEND_COMPLIANCE_REQUEST",
  SEND_COMPLIANCE_SUCCESS: "SEND_COMPLIANCE_SUCCESS",
  SEND_COMPLIANCE_ERROR: "SEND_COMPLIANCE_ERROR",

  APPROVE_ADVISORY_REQUEST: "APPROVE_ADVISORY_REQUEST",
  APPROVE_ADVISORY_SUCCESS: "APPROVE_ADVISORY_SUCCESS",
  APPROVE_ADVISORY_ERROR: "APPROVE_ADVISORY_ERROR",

  GET_ADVISORYDATA_REQUEST: "GET_ADVISORYDATA_REQUEST",
  GET_ADVISORYDATA_SUCCESS: "GET_ADVISORYDATA_SUCCESS",
  GET_ADVISORYDATA_ERROR: "GET_ADVISORYDATA_ERROR",

  GET_CRIMEAADVISORY_REQUEST: "GET_CRIMEAADVISORY_REQUEST",
  GET_CRIMEAADVISORY_SUCCESS: "GET_CRIMEAADVISORY_SUCCESS",
  GET_CRIMEAADVISORY_ERROR: "GET_CRIMEAADVISORY_ERROR",

  GET_NOTIFICATIONTO_REQUEST: "GET_NOTIFICATIONTO_REQUEST",
  GET_NOTIFICATIONTO_SUCCESS: "GET_NOTIFICATIONTO_SUCCESS",
  GET_NOTIFICATIONTO_ERROR: "GET_NOTIFICATIONTO_ERROR",

  RESET_COMPLIANCE_REQUEST: "RESET_COMPLIANCE_REQUEST",

  createAdvisoryMemo: (url, body) => ({
    type: actions.CREATE_ADVISORY_MEMO_REQUEST,
    payload: { url, body },
  }),

  getAdvisoryList: (url) => ({
    type: actions.GET_ADVISORY_LIST_REQUEST,
    payload: { url },
  }),

  sendComplianceUpdate: (url, body) => ({
    type: actions.SEND_COMPLIANCE_REQUEST,
    payload: { url, body },
  }),

  actionAdvisoryAck: (url, body) => ({
    type: actions.APPROVE_ADVISORY_REQUEST,
    payload: { url, body },
  }),

  resetComplianceUpdate: () => ({
    type: actions.RESET_COMPLIANCE_REQUEST,
  }),
  getAdvisoryData: (url) => ({
    type: actions.GET_ADVISORYDATA_REQUEST,
    payload: { url },
  }),
  getNotificationTo: (url) => ({
    type: actions.GET_NOTIFICATIONTO_REQUEST,
    payload: { url },
  }),
  getCrimeAdvisory: (url) => ({
    type: actions.GET_CRIMEAADVISORY_REQUEST,
    payload: { url },
  }),
};

export default actions;
