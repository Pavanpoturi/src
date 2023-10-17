import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  issueOfSummonsList: [],
  actionType: "",
});

export default function IssueOfSummonsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ISSUE_OF_SUMMONS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_ISSUE_OF_SUMMONS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        issueOfSummonsList: action.issueOfSummonsList,
      };
    case actions.FETCH_ISSUE_OF_SUMMONS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_ISSUE_OF_SUMMONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ISSUE_OF_SUMMONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_ISSUE_OF_SUMMONS_SUCCESS,
      });
    case actions.ADD_ISSUE_OF_SUMMONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_ISSUE_OF_SUMMONS_ERROR,
      });

    case actions.UPDATE_ISSUE_OF_SUMMONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_ISSUE_OF_SUMMONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Issue Of Summons Successfully Updated",
        actionType: actions.UPDATE_ISSUE_OF_SUMMONS_SUCCESS,
      });
    case actions.UPDATE_ISSUE_OF_SUMMONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_ISSUE_OF_SUMMONS_ERROR,
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
