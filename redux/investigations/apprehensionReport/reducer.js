import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  apprehensionReportList: [],
  actionType: "",
});

export default function apprehensionReportReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_APPREHENSION_REPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_APPREHENSION_REPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        apprehensionReportList: action.apprehensionReportList,
        actionType: actions.FETCH_APPREHENSION_REPORT_SUCCESS,
      };
    case actions.FETCH_APPREHENSION_REPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_APPREHENSION_REPORT_ERROR,
      };

    case actions.ADD_APPREHENSION_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_APPREHENSION_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Apprehension Report Successfully Generated",
        actionType: actions.ADD_APPREHENSION_REPORT_SUCCESS,
      });
    case actions.ADD_APPREHENSION_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_APPREHENSION_REPORT_ERROR,
      });

    case actions.UPDATE_APPREHENSION_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_APPREHENSION_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Apprehension Report Successfully Updated",
        actionType: actions.UPDATE_APPREHENSION_REPORT_SUCCESS,
      });
    case actions.UPDATE_APPREHENSION_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_APPREHENSION_REPORT_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
