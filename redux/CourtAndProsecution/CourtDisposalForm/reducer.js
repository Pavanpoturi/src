import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  courtDisposalFormList: [],
  actionType: "",
});

export default function CourtDisposalFormReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_COURT_DISPOSAL_FORM_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_COURT_DISPOSAL_FORM_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        courtDisposalFormList: action.courtDisposalFormList,
      };
    case actions.FETCH_COURT_DISPOSAL_FORM_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_COURT_DISPOSAL_FORM_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COURT_DISPOSAL_FORM_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_COURT_DISPOSAL_FORM_SUCCESS,
      });
    case actions.ADD_COURT_DISPOSAL_FORM_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_COURT_DISPOSAL_FORM_ERROR,
      });

    case actions.UPDATE_COURT_DISPOSAL_FORM_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_COURT_DISPOSAL_FORM_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Court Disposal Form Successfully Updated",
        actionType: actions.UPDATE_COURT_DISPOSAL_FORM_SUCCESS,
      });
    case actions.UPDATE_COURT_DISPOSAL_FORM_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_COURT_DISPOSAL_FORM_ERROR,
      });
    case actions.RESET_COURT_DISPOSAL_FORM_REQUEST:
      return Immutable.merge(state, { courtDisposalFormList: [] });
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
