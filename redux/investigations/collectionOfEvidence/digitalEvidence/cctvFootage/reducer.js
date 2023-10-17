import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  requisitionErrorMessage: "",
  requisitionSuccessMessage: "",
  cctvFootageList: [],
  actionType: "",
  requisitionActionType: "",
  enhancedErrorMessage: "",
  enhancedSuccessMessage: "",
  enhancedActionType: "",
});

export default function cctvFootageReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CCTV_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CCTV_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        cctvFootageList: action.cctvFootageList,
        actionType: actions.FETCH_CCTV_SUCCESS,
      };
    case actions.FETCH_CCTV_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CCTV_ERROR,
      };

    case actions.ADD_CCTV_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CCTV_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "CCTV Footage successfully added",
        actionType: actions.ADD_CCTV_SUCCESS,
      });
    case actions.ADD_CCTV_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CCTV_ERROR,
      });

    case actions.UPDATE_CCTV_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CCTV_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "CCTV Footage successfully updated",
        actionType: actions.UPDATE_CCTV_SUCCESS,
      });
    case actions.UPDATE_CCTV_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CCTV_ERROR,
      });

    case actions.SEND_REQUISITION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.SEND_REQUISITION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        requisitionErrorMessage: "",
        requisitionSuccessMessage: "Requisition send successfully",
        requisitionActionType: actions.SEND_REQUISITION_SUCCESS,
      });
    case actions.SEND_REQUISITION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        requisitionErrorMessage: action.errorMessage,
        requisitionSuccessMessage: "",
        requisitionActionType: actions.SEND_REQUISITION_ERROR,
      });

    case actions.UPLOAD_ENHANCED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_ENHANCED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        enhancedErrorMessage: "",
        enhancedSuccessMessage: "Enhanced details are successfully updated",
        enhancedActionType: actions.UPLOAD_ENHANCED_SUCCESS,
      });
    case actions.UPLOAD_ENHANCED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        enhancedErrorMessage: action.errorMessage,
        enhancedSuccessMessage: "",
        enhancedActionType: actions.UPLOAD_ENHANCED_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: "",
      });

    case actions.RESET_REQUISITION_ACTION_TYPE:
      return Immutable.merge(state, {
        requisitionActionType: "",
        requisitionErrorMessage: "",
        requisitionSuccessMessage: "",
      });

    case actions.RESET_ENHANCED_ACTION_TYPE:
      return Immutable.merge(state, {
        enhancedErrorMessage: "",
        enhancedSuccessMessage: "",
        enhancedActionType: "",
      });
    default:
      return state;
  }
}
