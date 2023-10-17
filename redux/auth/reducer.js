import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  currentUser: {},
  actionType: "",
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.LOGIN_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        actionType: action.type,
        currentUser: action.currentUser,
      });
    case actions.LOGIN_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        actionType: action.type,
        currentUser: {},
        errorMessage: action.errorMessage,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    case actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
