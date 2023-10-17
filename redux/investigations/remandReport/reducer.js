import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  remandReportList: [],
  actionType: "",
});

export default function remandReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_REMAND_REPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_REMAND_REPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        remandReportList: action.remandReportList,
        actionType: actions.FETCH_REMAND_REPORT_SUCCESS,
      };
    case actions.FETCH_REMAND_REPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_REMAND_REPORT_ERROR,
      };

    case actions.ADD_REMAND_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_REMAND_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Remand Report Successfully Added",
        actionType: actions.ADD_REMAND_REPORT_SUCCESS,
      });
    case actions.ADD_REMAND_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_REMAND_REPORT_ERROR,
      });

    case actions.UPDATE_REMAND_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_REMAND_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Remand Report Successfully Updated",
        actionType: actions.UPDATE_REMAND_REPORT_SUCCESS,
      });
    case actions.UPDATE_REMAND_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_REMAND_REPORT_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
