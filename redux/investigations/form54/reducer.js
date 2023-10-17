import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  form54List: [],
  accidentInformationReport: [],
  actionType: "",
});

export default function form54Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_FORM54_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_FORM54_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        form54List: action.form54List,
        actionType: actions.FETCH_FORM54_SUCCESS,
      };
    case actions.FETCH_FORM54_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_FORM54_ERROR,
      };
    case actions.FETCH_ACCIDENT_INFORMATION_REQUEST:
      return { ...state, isFetching: false, isLoading: true };
    case actions.FETCH_ACCIDENT_INFORMATION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        accidentInformationReport: action.accidentInformationReport,
        actionType: actions.FETCH_ACCIDENT_INFORMATION_SUCCESS,
      };
    case actions.FETCH_ACCIDENT_INFORMATION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        isLoading: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_ACCIDENT_INFORMATION_ERROR,
      };
    case actions.ADD_FORM54_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_FORM54_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: `Form 54 for FIR No.${action.firNum} has been submitted successfully.`,
        actionType: actions.ADD_FORM54_SUCCESS,
      });
    case actions.ADD_FORM54_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_FORM54_ERROR,
      });
    case actions.UPDATE_FORM54_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_FORM54_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: `Form 54 for FIR No.${action.firNum} has been updated successfully.`,
        actionType: actions.UPDATE_FORM54_SUCCESS,
      });
    case actions.UPDATE_FORM54_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_FORM54_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });
    case actions.RESET_ACCIDENT_INFORMATION:
      return Immutable.merge(state, {
        accidentInformationReport: [],
      });
    default:
      return state;
  }
}
