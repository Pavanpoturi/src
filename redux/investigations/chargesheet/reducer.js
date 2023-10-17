import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  chargesheetList: [],
  moStolenList: [],
  actionType: "",
});

export default function chargesheetReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CHARGESHEET_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CHARGESHEET_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        chargesheetList: action.chargesheetList,
        actionType: actions.FETCH_CHARGESHEET_SUCCESS,
      };
    case actions.FETCH_CHARGESHEET_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CHARGESHEET_ERROR,
      };

    case actions.FETCH_MO_STOLEN_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_MO_STOLEN_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        moStolenList: action.moStolenList,
        actionType: actions.FETCH_MO_STOLEN_SUCCESS,
      };
    case actions.FETCH_MO_STOLEN_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_MO_STOLEN_ERROR,
      };

    case actions.ADD_CHARGESHEET_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CHARGESHEET_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Chargesheet added/updated successfully",
        actionType: actions.ADD_CHARGESHEET_SUCCESS,
      });
    case actions.ADD_CHARGESHEET_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CHARGESHEET_ERROR,
      });

    case actions.UPLOAD_CHARGESHEET_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_CHARGESHEET_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Chargesheet uploaded successfully",
        actionType: actions.UPLOAD_CHARGESHEET_SUCCESS,
      });
    case actions.UPLOAD_CHARGESHEET_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPLOAD_CHARGESHEET_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
