const actions = {
    FETCH_PPOPINION_REQUEST: "FETCH_PPOPINION_REQUEST",
    FETCH_PPOPINION_SUCCESS: "FETCH_PPOPINION_SUCCESS",
    FETCH_PPOPINION_ERROR: "FETCH_PPOPINION_ERROR",
  
    ADD_PPOPINION_REQUEST: "ADD_PPOPINION_REQUEST",
    ADD_PPOPINION_SUCCESS: "ADD_PPOPINION_SUCCESS",
    ADD_PPOPINION_ERROR: "ADD_PPOPINION_ERROR",
  
    UPDATE_PPOPINION_REQUEST: "UPDATE_PPOPINION_REQUEST",
    UPDATE_PPOPINION_SUCCESS: "UPDATE_PPOPINION_SUCCESS",
    UPDATE_PPOPINION_ERROR: "UPDATE_PPOPINION_ERROR",
  
    RESET_ACTIONTYPE: "RESET_ACTIONTYPE",
  
    addPPOpinionDetails: (url, body) => ({
      type: actions.ADD_PPOPINION_REQUEST,
      payload: { url, body },
    }),
  
    updatePPOpinionDetails: (url, body) => ({
      type: actions.UPDATE_PPOPINION_REQUEST,
      payload: { url, body },
    }),
  
    getPPOpinionList: (url) => ({
      type: actions.FETCH_PPOPINION_REQUEST,
      payload: { url },
    }),
  
    resetActionType: () => {
      return {
        type: actions.RESET_ACTIONTYPE,
      };
    },
  };
  export default actions;
  