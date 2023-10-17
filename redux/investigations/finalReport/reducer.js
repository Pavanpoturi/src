import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  finalReportList: [],
  actionType: "",
});

export default function finalReportReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_FINALREPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_FINALREPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        finalReportList: action.finalReportList,
        actionType: actions.FETCH_FINALREPORT_SUCCESS,
      };
    case actions.FETCH_FINALREPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_FINALREPORT_ERROR,
      };

    case actions.ADD_FINALREPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_FINALREPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_FINALREPORT_SUCCESS,
      });
    case actions.ADD_FINALREPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_FINALREPORT_ERROR,
      });

    case actions.UPLOAD_FINALREPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_FINALREPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Final Report Successfully Uploaded",
        actionType: actions.UPLOAD_FINALREPORT_SUCCESS,
      });
    case actions.UPLOAD_FINALREPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPLOAD_FINALREPORT_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
