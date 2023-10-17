import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  cdrList: [],
  actionType: "",
  requestCDRErrorMessage: "",
  requestCDRSuccessMessage: "",
  requestCDRActionType: "",
  uploadCDRReportErrorMessage: "",
  uploadCDRReportSuccessMessage: "",
  uploadCDRReportActionType: "",
});

export default function cdrReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CDR_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CDR_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        cdrList: action.cdrList,
        actionType: actions.FETCH_CDR_SUCCESS,
      };
    case actions.FETCH_CDR_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CDR_ERROR,
      };

    case actions.ADD_CDR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CDR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "CDRs/CAF successfully added",
        actionType: actions.ADD_CDR_SUCCESS,
      });
    case actions.ADD_CDR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CDR_ERROR,
      });

    case actions.UPDATE_CDR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CDR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "CDRs/CAF successfully updated",
        actionType: actions.UPDATE_CDR_SUCCESS,
      });
    case actions.UPDATE_CDR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CDR_ERROR,
      });

    case actions.REQUEST_CDR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.REQUEST_CDR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        requestCDRErrorMessage: "",
        requestCDRSuccessMessage: "CDRs Request successfully sent",
        requestCDRActionType: actions.REQUEST_CDR_SUCCESS,
      });
    case actions.REQUEST_CDR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        requestCDRErrorMessage: action.errorMessage,
        requestCDRSuccessMessage: "",
        requestCDRActionType: actions.REQUEST_CDR_ERROR,
      });

    case actions.UPLOAD_CDR_RESULT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_CDR_RESULT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        uploadCDRReportErrorMessage: "",
        uploadCDRReportSuccessMessage: "CDRs Report successfully uploaded",
        uploadCDRReportActionType: actions.UPLOAD_CDR_RESULT_SUCCESS,
      });
    case actions.UPLOAD_CDR_RESULT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        uploadCDRReportErrorMessage: action.errorMessage,
        uploadCDRReportSuccessMessage: "",
        uploadCDRReportActionType: actions.UPLOAD_CDR_RESULT_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: "",
      });

    case actions.RESET_REQUEST_CDR_ACTIONTYPE:
      return Immutable.merge(state, {
        requestCDRErrorMessage: "",
        requestCDRSuccessMessage: "",
        requestCDRActionType: "",
      });

    case actions.RESET_CDR_RESULT_ACTION:
      return Immutable.merge(state, {
        uploadCDRReportErrorMessage: "",
        uploadCDRReportSuccessMessage: "",
        uploadCDRReportActionType: "",
      });
    default:
      return state;
  }
}
