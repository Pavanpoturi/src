const actions = {
  FETCH_160_CRPC_REQUEST: "FETCH_160_CRPC_REQUEST",
  FETCH_160_CRPC_SUCCESS: "FETCH_160_CRPC_SUCCESS",
  FETCH_160_CRPC_ERROR: "FETCH_160_CRPC_ERROR",

  ADD_160_CRPC_REQUEST: "ADD_160_CRPC_REQUEST",
  ADD_160_CRPC_SUCCESS: "ADD_160_CRPC_SUCCESS",
  ADD_160_CRPC_ERROR: "ADD_160_CRPC_ERROR",

  UPDATE_160_CRPC_REQUEST: "UPDATE_160_CRPC_REQUEST",
  UPDATE_160_CRPC_SUCCESS: "UPDATE_160_CRPC_SUCCESS",
  UPDATE_160_CRPC_ERROR: "UPDATE_160_CRPC_ERROR",

  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  add160CrpcDetails: (url, body) => ({
    type: actions.ADD_160_CRPC_REQUEST,
    payload: { url, body },
  }),

  update160CrpcDetails: (url, body) => ({
    type: actions.UPDATE_160_CRPC_REQUEST,
    payload: { url, body },
  }),

  get160CrpcList: (url) => ({
    type: actions.FETCH_160_CRPC_REQUEST,
    payload: { url },
  }),

  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
