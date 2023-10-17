import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  caseDiaryList: [],
  actionType: "",
});

export default function caseDiaryReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CASE_DIARY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CASE_DIARY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        caseDiaryList: action.caseDiaryList,
        actionType: actions.FETCH_CASE_DIARY_SUCCESS,
      };
    case actions.FETCH_CASE_DIARY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CASE_DIARY_ERROR,
      };

    case actions.ADD_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Diary Successfully Created",
        actionType: actions.ADD_CASE_DIARY_SUCCESS,
      });
    case actions.ADD_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CASE_DIARY_ERROR,
      });

    case actions.UPDATE_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Diary Successfully Updated",
        actionType: actions.UPDATE_CASE_DIARY_SUCCESS,
      });
    case actions.UPDATE_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CASE_DIARY_ERROR,
      });

    case actions.GENERATE_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.GENERATE_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Diary Successfully Generated",
        actionType: actions.GENERATE_CASE_DIARY_SUCCESS,
      });
    case actions.GENERATE_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.GENERATE_CASE_DIARY_ERROR,
      });

    case actions.UPLOAD_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Diary Successfully Uploaded",
        actionType: actions.GENERATE_CASE_DIARY_SUCCESS,
      });
    case actions.UPLOAD_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPLOAD_CASE_DIARY_ERROR,
      });

    case actions.DELETE_CASE_DIARY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DELETE_CASE_DIARY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Case Diary Successfully Deleted",
        actionType: actions.DELETE_CASE_DIARY_SUCCESS,
      });
    case actions.DELETE_CASE_DIARY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.DELETE_CASE_DIARY_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
