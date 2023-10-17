import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  auditErrorMessage: "",
  auditSuccessMessage: "",
  actionType: "",
});

export default function auditHistoryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.CREATE_AUDIT_HISTORY_REQUEST:
      return { ...state, isFetching: true };
    case actions.CREATE_AUDIT_HISTORY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        auditErrorMessage: "",
        actionType: actions.CREATE_AUDIT_HISTORY_SUCCESS,
      };
    case actions.CREATE_AUDIT_HISTORY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        auditErrorMessage: action.errorMessage,
        actionType: actions.CREATE_AUDIT_HISTORY_ERROR,
      };
    case actions.RESET_AUDIT_ACTION_TYPE:
      return Immutable.merge(state, {
        actionType: "",
        auditErrorMessage: "",
        auditSuccessMessage: "",
      });
    default:
      return state;
  }
}
