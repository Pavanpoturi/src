import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  actionType: "",
  DashboardTransferCases: [],
  DashboardReceiveCases: [],
});

export default function reGeneratedFirReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        DashboardTransferCases: action?.DashboardTransferCases,
        DashboardReceiveCases: action?.DashboardReceiveCases,
        actionType: "",
      };
    case actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        DashboardTransferCases: [],
        DashboardReceiveCases: [],
        errorMessage: action.errorMessage,
        actionType: "",
      };

    case actions.DASHBOARD_TRANSFER_OF_CASE_POST_REQUEST:
      return { ...state, isFetching: true };
    case actions.DASHBOARD_TRANSFER_OF_CASE_POST_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action?.successMessage,
        actionType: actions.DASHBOARD_TRANSFER_OF_CASE_POST_SUCCESS,
      };
    case actions.DASHBOARD_TRANSFER_OF_CASE_POST_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        successMessage: "",
        errorMessage: action.errorMessage,
        actionType: actions.DASHBOARD_TRANSFER_OF_CASE_POST_ERROR,
      };

    default:
      return state;
  }
}
