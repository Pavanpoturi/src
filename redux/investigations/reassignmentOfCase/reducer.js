import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  reassignmentOfCaseList: [],
  actionType: "",
});

export default function reassignmentOfCaseReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_REASSIGNMENT_OF_CASE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_REASSIGNMENT_OF_CASE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        reassignmentOfCaseList: action.reassignmentOfCaseList,
        actionType: actions.FETCH_REASSIGNMENT_OF_CASE_SUCCESS,
      };
    case actions.FETCH_REASSIGNMENT_OF_CASE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_REASSIGNMENT_OF_CASE_ERROR,
      };

    case actions.ADD_REASSIGNMENT_OF_CASE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_REASSIGNMENT_OF_CASE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Re-Assignment Of Case Successfully Added",
        actionType: actions.ADD_REASSIGNMENT_OF_CASE_SUCCESS,
      });
    case actions.ADD_REASSIGNMENT_OF_CASE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_REASSIGNMENT_OF_CASE_ERROR,
      });

    case actions.UPDATE_REASSIGNMENT_OF_CASE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_REASSIGNMENT_OF_CASE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Re-Assignment Of Case Successfully Updated",
        actionType: actions.UPDATE_REASSIGNMENT_OF_CASE_SUCCESS,
      });
    case actions.UPDATE_REASSIGNMENT_OF_CASE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_REASSIGNMENT_OF_CASE_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: "",
      });
    default:
      return state;
  }
}
