const actions = {
  CHECK_AUTHORIZATION: "CHECK_AUTHORIZATION",
  LOGIN_REQUEST: "LOGIN_REQUEST",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_ERROR: "LOGIN_ERROR",
  LOGOUT: "LOGOUT",
  RESET_ACTIONTYPE: "RESET_ACTIONTYPE",

  checkAuthorization: () => ({ type: actions.CHECK_AUTHORIZATION }),
  login: (url, body) => ({
    type: actions.LOGIN_REQUEST,
    payload: { url, body },
  }),
  logout: (history) => ({
    type: actions.LOGOUT,
    payload: { history },
  }),
  resetActionType: () => {
    return {
      type: actions.RESET_ACTIONTYPE,
    };
  },
};
export default actions;
