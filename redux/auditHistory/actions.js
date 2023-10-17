const actions = {
  CREATE_AUDIT_HISTORY_REQUEST: "CREATE_AUDIT_HISTORY_REQUEST",
  CREATE_AUDIT_HISTORY_SUCCESS: "CREATE_AUDIT_HISTORY_SUCCESS",
  CREATE_AUDIT_HISTORY_ERROR: "CREATE_AUDIT_HISTORY_ERROR",

  RESET_ACTIONTYPE: "RESET_AUDIT_ACTION_TYPE",

  createAuditHistory: (url, body) => ({
    type: actions.CREATE_AUDIT_HISTORY_REQUEST,
    payload: { url, body },
  }),

  resetAuditActionType: () => {
    return {
      type: actions.RESET_AUDIT_ACTION_TYPE,
    };
  },
};

export default actions;
