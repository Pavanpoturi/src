import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  reopeningOfCaseList: [],
  actionType: "",
});

export default function reopeningOfCaseReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_REOPENING_OF_CASE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_REOPENING_OF_CASE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        reopeningOfCaseList: action.reopeningOfCaseList,
        actionType: actions.FETCH_REOPENING_OF_CASE_SUCCESS,
      };
    case actions.FETCH_REOPENING_OF_CASE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_REOPENING_OF_CASE_ERROR,
      };

    case actions.ADD_REOPENING_OF_CASE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_REOPENING_OF_CASE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Re-Opening Of Case Successfully Initiated",
        actionType: actions.ADD_REOPENING_OF_CASE_SUCCESS,
      });
    case actions.ADD_REOPENING_OF_CASE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_REOPENING_OF_CASE_ERROR,
      });

    case actions.UPDATE_REOPENING_OF_CASE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_REOPENING_OF_CASE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Re-opened Successfully",
        actionType: actions.UPDATE_REOPENING_OF_CASE_SUCCESS,
      });
    case actions.UPDATE_REOPENING_OF_CASE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_REOPENING_OF_CASE_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });
    default:
      return state;
  }
}
