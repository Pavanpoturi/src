import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  transferOfCaseFileList: {},
  actionType: "",
});

export default function transferOfCaseFileReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_TRANSFER_OF_CASE_FILE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_TRANSFER_OF_CASE_FILE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        transferOfCaseFileList: action.transferOfCaseFileList,
        actionType: actions.FETCH_TRANSFER_OF_CASE_FILE_SUCCESS,
      };
    case actions.FETCH_TRANSFER_OF_CASE_FILE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_TRANSFER_OF_CASE_FILE_ERROR,
      };

    case actions.ADD_TRANSFER_OF_CASE_FILE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_TRANSFER_OF_CASE_FILE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Transfer of case successfully",
        actionType: actions.ADD_TRANSFER_OF_CASE_FILE_SUCCESS,
      });
    case actions.ADD_TRANSFER_OF_CASE_FILE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_TRANSFER_OF_CASE_FILE_ERROR,
      });

    case actions.TRANSFER_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.TRANSFER_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "FIR Transfered successfully",
        actionType: actions.TRANSFER_FIR_SUCCESS,
      });
    case actions.TRANSFER_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.TRANSFER_FIR_ERROR,
      });

    case actions.FORWARD_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FORWARD_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "FIR Forwarded successfully",
        actionType: actions.FORWARD_FIR_SUCCESS,
      });
    case actions.FORWARD_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.FORWARD_FIR_ERROR,
      });

    case actions.UPDATE_TRANSFER_OF_CASE_FILE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Transfer of case successfully",
        actionType: actions.UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS,
      });
    case actions.UPDATE_TRANSFER_OF_CASE_FILE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_TRANSFER_OF_CASE_FILE_ERROR,
      });
    case actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Transfer of case successfully",
        actionType: actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_SUCCESS,
      });
    case actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_TRANSFER_OF_ARREST_CASE_FILE_ERROR,
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
