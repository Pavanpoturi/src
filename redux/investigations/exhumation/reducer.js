import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  exhumationList: [],
  actionType: "",
});

export default function exhumationReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_EXHUMATION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_EXHUMATION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        exhumationList: action.exhumationList,
        actionType: actions.FETCH_EXHUMATION_SUCCESS,
      };
    case actions.FETCH_EXHUMATION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_EXHUMATION_ERROR,
      };

    case actions.ADD_EXHUMATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_EXHUMATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Exhumation Successfully Added",
        actionType: actions.ADD_EXHUMATION_SUCCESS,
      });
    case actions.ADD_EXHUMATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_EXHUMATION_ERROR,
      });

    case actions.UPDATE_EXHUMATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_EXHUMATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Exhumation Successfully Updated",
        actionType: actions.UPDATE_EXHUMATION_SUCCESS,
      });
    case actions.UPDATE_EXHUMATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_EXHUMATION_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
