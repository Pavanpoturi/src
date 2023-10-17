import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  prosecutionPermissionList: [],
  actionType: "",
});

export default function prosecutionPermissionReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_PROSECUTION_PERMISSION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_PROSECUTION_PERMISSION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        prosecutionPermissionList: action.prosecutionPermissionList,
        actionType: actions.FETCH_PROSECUTION_PERMISSION_SUCCESS,
      };
    case actions.FETCH_PROSECUTION_PERMISSION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_PROSECUTION_PERMISSION_ERROR,
      };

    case actions.ADD_PROSECUTION_PERMISSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_PROSECUTION_PERMISSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.successMessage,
        actionType: actions.ADD_PROSECUTION_PERMISSION_SUCCESS,
      });
    case actions.ADD_PROSECUTION_PERMISSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_PROSECUTION_PERMISSION_ERROR,
      });

    case actions.UPDATE_PROSECUTION_PERMISSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_PROSECUTION_PERMISSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.successMessage,
        actionType: actions.UPDATE_PROSECUTION_PERMISSION_SUCCESS,
      });
    case actions.UPDATE_PROSECUTION_PERMISSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_PROSECUTION_PERMISSION_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
