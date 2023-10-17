import actions from "./action";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  actionType: "",
  courtCaseDiaryList: [],
  caseDiaryData: {},
});

export default function courtCaseDiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_COURT_CASE_DIARY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_COURT_CASE_DIARY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        courtCaseDiaryList: action.courtCaseDiaryList,
        actionType: actions.FETCH_COURT_CASE_DIARY_SUCCESS,
      };
    case actions.FETCH_COURT_CASE_DIARY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_COURT_CASE_DIARY_ERROR,
      };
    case actions.FETCH_CASE_DIARY_ID_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CASE_DIARY_ID_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        caseDiaryData: action.caseDiaryData,
        actionType: actions.FETCH_CASE_DIARY_ID_SUCCESS,
      };
    case actions.FETCH_CASE_DIARY_ID_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CASE_DIARY_ID_ERROR,
      };
    case actions.ADD_COURT_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COURT_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        savedData: action.savedData,
        actionType: actions.ADD_COURT_CASE_DIARY_SUCCESS,
      });
    case actions.ADD_COURT_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_COURT_CASE_DIARY_ERROR,
      });

    case actions.UPDATE_COURT_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_COURT_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action?.message,
        savedData: action.savedData,
        actionType: actions.UPDATE_COURT_CASE_DIARY_SUCCESS,
      });
    case actions.UPDATE_COURT_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action?.errorMessage,
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: actions.UPDATE_COURT_CASE_DIARY_ERROR,
      });
    case actions.RESET_COURT_CASE_DIARY_DATA:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
        caseDiaryData: {},
      });

    default:
      return state;
  }
}
