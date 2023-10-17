import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  crpc160List: [],
  actionType: "",
});

export default function crpc160Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_160_CRPC_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_160_CRPC_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        crpc160List: action.crpc160List,
        actionType: actions.FETCH_160_CRPC_SUCCESS,
      };
    case actions.FETCH_160_CRPC_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_160_CRPC_ERROR,
      };

    case actions.ADD_160_CRPC_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_160_CRPC_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "160 Cr.P.C Notice Successfully Added",
        actionType: actions.ADD_160_CRPC_SUCCESS,
      });
    case actions.ADD_160_CRPC_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_160_CRPC_ERROR,
      });

    case actions.UPDATE_160_CRPC_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_160_CRPC_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "160 Cr.P.C Notice Successfully Updated",
        actionType: actions.UPDATE_160_CRPC_SUCCESS,
      });
    case actions.UPDATE_160_CRPC_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_160_CRPC_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
