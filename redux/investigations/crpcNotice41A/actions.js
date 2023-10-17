const actions = {
  FETCH_41A_CRPC_REQUEST: "FETCH_41A_CRPC_REQUEST",
  FETCH_41A_CRPC_SUCCESS: "FETCH_41A_CRPC_SUCCESS",
  FETCH_41A_CRPC_ERROR: "FETCH_41A_CRPC_ERROR",

  ADD_41A_CRPC_REQUEST: "ADD_41A_CRPC_REQUEST",
  ADD_41A_CRPC_SUCCESS: "ADD_41A_CRPC_SUCCESS",
  ADD_41A_CRPC_ERROR: "ADD_41A_CRPC_ERROR",

  UPDATE_41A_CRPC_REQUEST: "UPDATE_41A_CRPC_REQUEST",
  UPDATE_41A_CRPC_SUCCESS: "UPDATE_41A_CRPC_SUCCESS",
  UPDATE_41A_CRPC_ERROR: "UPDATE_41A_CRPC_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  add41ACrpcDetails: (url, body) => ({
    type: actions.ADD_41A_CRPC_REQUEST,
    payload: { url, body },
  }),

  update41ACrpcDetails: (url, body) => ({
    type: actions.UPDATE_41A_CRPC_REQUEST,
    payload: { url, body },
  }),

  get41ACrpcList: (url) => ({
    type: actions.FETCH_41A_CRPC_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
