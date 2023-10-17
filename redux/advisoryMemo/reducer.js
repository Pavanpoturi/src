import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  complianceStatus: {},
  advisoryList: [],
  getAdvisoryNotificationTo: [],
  getCrimeAdvisory: {},
  actionType: "",
});

export default function advisoryMemoReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CREATE_ADVISORY_MEMO_REQUEST:
      return { ...state, isFetching: true };
    case actions.CREATE_ADVISORY_MEMO_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.successMessage,
        actionType: actions.CREATE_ADVISORY_MEMO_SUCCESS,
      };
    case actions.CREATE_ADVISORY_MEMO_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.CREATE_ADVISORY_MEMO_ERROR,
      };

    case actions.GET_ADVISORY_LIST_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_ADVISORY_LIST_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        advisoryList: action.advisoryList,
        actionType: actions.GET_ADVISORY_LIST_SUCCESS,
      };
    case actions.GET_ADVISORY_LIST_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.GET_ADVISORY_LIST_ERROR,
      };

    case actions.SEND_COMPLIANCE_REQUEST:
      return { ...state, isFetching: true };
    case actions.SEND_COMPLIANCE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.successMessage,
        actionType: actions.SEND_COMPLIANCE_SUCCESS,
      };
    case actions.SEND_COMPLIANCE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.SEND_COMPLIANCE_ERROR,
      };

    case actions.APPROVE_ADVISORY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isUpdating: true,
      });
    case actions.APPROVE_ADVISORY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isUpdating: false,
        errorMessage: "",
        successMessage: action.successMessage,
        actionType: actions.APPROVE_ADVISORY_SUCCESS,
      });
    case actions.APPROVE_ADVISORY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isUpdating: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.APPROVE_ADVISORY_ERROR,
      });

    case actions.RESET_COMPLIANCE_REQUEST:
      return {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        actionType: "",
      };
    case actions.GET_ADVISORYDATA_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_ADVISORYDATA_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        advisoryList: action.advisoryList,
        actionType: actions.GET_ADVISORYDATA_SUCCESS,
      };
    case actions.GET_ADVISORYDATA_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.GET_ADVISORYDATA_ERROR,
      };
    case actions.GET_NOTIFICATIONTO_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_NOTIFICATIONTO_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        getAdvisoryNotificationTo: action.getNotification,
        actionType: actions.GET_NOTIFICATIONTO_SUCCESS,
      };
    case actions.GET_NOTIFICATIONTO_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.GET_NOTIFICATIONTO_ERROR,
      };

    case actions.GET_CRIMEAADVISORY_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_CRIMEAADVISORY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        getCrimeAdvisory: action.crimeAdvisory,
        actionType: actions.GET_CRIMEAADVISORY_SUCCESS,
      };
    case actions.GET_CRIMEAADVISORY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.GET_CRIMEAADVISORY_ERROR,
      };

    default:
      return state;
  }
}
