import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  chargesheetStatus: [],
  actionType: "",
});

export default function updateChargeSheetStatusReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CHARGE_SHEET_STATUS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CHARGE_SHEET_STATUS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        chargesheetStatus: action.chargesheetStatus,
        actionType: actions.FETCH_CHARGE_SHEET_STATUS_SUCCESS,
      };
    case actions.FETCH_CHARGE_SHEET_STATUS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CHARGE_SHEET_STATUS_ERROR,
      };
    case actions.ADD_CHARGE_SHEET_STATUS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CHARGE_SHEET_STATUS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Charge Sheet Status Successfully Updated",
        actionType: actions.ADD_CHARGE_SHEET_STATUS_SUCCESS,
      });
    case actions.ADD_CHARGE_SHEET_STATUS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CHARGE_SHEET_STATUS_ERROR,
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
