import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isUpdating: false,
  isHistoryFetching: false,
  errorMessage: "",
  successMessage: "",
  casePropertyManagementList: [],
  casePropertyHistoryList: [],
  actionType: "",
  addAckPayload: null,
});

export default function casePropertyManagementReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_CASE_PROPERTY_MANAGEMENT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CASE_PROPERTY_MANAGEMENT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        casePropertyManagementList: action.casePropertyManagementList,
        actionType: actions.FETCH_CASE_PROPERTY_MANAGEMENT_SUCCESS,
      };
    case actions.FETCH_CASE_PROPERTY_MANAGEMENT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CASE_PROPERTY_MANAGEMENT_ERROR,
      };

    case actions.FETCH_CASE_PROPERTY_HISTORY_REQUEST:
      return { ...state, isHistoryFetching: true };
    case actions.FETCH_CASE_PROPERTY_HISTORY_SUCCESS:
      return {
        ...state,
        failure: false,
        isHistoryFetching: false,
        errorMessage: "",
        casePropertyHistoryList: action.casePropertyHistoryList,
        actionType: actions.FETCH_CASE_PROPERTY_HISTORY_SUCCESS,
      };
    case actions.FETCH_CASE_PROPERTY_HISTORY_ERROR:
      return {
        ...state,
        failure: true,
        isHistoryFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CASE_PROPERTY_HISTORY_ERROR,
      };

    case actions.ADD_CASE_PROPERTY_MANAGEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        addAckPayload: action.addAckPayload,
        successMessage:
          action.response.message ||
          "Case Property Management Successfully Added",
        actionType: actions.ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS,
      });
    case actions.ADD_CASE_PROPERTY_MANAGEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CASE_PROPERTY_MANAGEMENT_ERROR,
      });

    case actions.ADD_ACK_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ACK_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        addAckPayload: null,
        actionType: actions.ADD_ACK_SUCCESS,
      });
    case actions.ADD_ACK_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_ACK_ERROR,
      });

    case actions.UPDATE_CASE_PROPERTY_MANAGEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Case Property Management Successfully Updated",
        actionType: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS,
      });
    case actions.UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR,
      });

    case actions.APPROVE_ACK_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isUpdating: true,
      });
    case actions.APPROVE_ACK_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isUpdating: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.APPROVE_ACK_SUCCESS,
      });
    case actions.APPROVE_ACK_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isUpdating: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.APPROVE_ACK_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
