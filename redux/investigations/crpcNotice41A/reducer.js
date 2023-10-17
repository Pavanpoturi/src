import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  crpc41AList: [],
  actionType: "",
});

export default function crpc41AReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_41A_CRPC_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_41A_CRPC_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        crpc41AList: action.crpc41AList,
        actionType: actions.FETCH_41A_CRPC_SUCCESS,
      };
    case actions.FETCH_41A_CRPC_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_41A_CRPC_ERROR,
      };

    case actions.ADD_41A_CRPC_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_41A_CRPC_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "41A Cr.P.C Notice Successfully Added",
        actionType: actions.ADD_41A_CRPC_SUCCESS,
      });
    case actions.ADD_41A_CRPC_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_41A_CRPC_ERROR,
      });

    case actions.UPDATE_41A_CRPC_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_41A_CRPC_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "41A Cr.P.C Notice Successfully Updated",
        actionType: actions.UPDATE_41A_CRPC_SUCCESS,
      });
    case actions.UPDATE_41A_CRPC_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_41A_CRPC_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
