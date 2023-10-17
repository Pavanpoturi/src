import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  confessionalStatementsList: [],
  actionType: "",
});

export default function confessionalStatementsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_CONFESSIONAL_STATEMENTS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CONFESSIONAL_STATEMENTS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        confessionalStatementsList: action.confessionalStatementsList,
        actionType: actions.FETCH_CONFESSIONAL_STATEMENTS_SUCCESS,
      };
    case actions.FETCH_CONFESSIONAL_STATEMENTS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CONFESSIONAL_STATEMENTS_ERROR,
      };

    case actions.ADD_CONFESSIONAL_STATEMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CONFESSIONAL_STATEMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Confessional Statements Successfully Added",
        actionType: actions.ADD_CONFESSIONAL_STATEMENTS_SUCCESS,
      });
    case actions.ADD_CONFESSIONAL_STATEMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CONFESSIONAL_STATEMENTS_ERROR,
      });

    case actions.UPDATE_CONFESSIONAL_STATEMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CONFESSIONAL_STATEMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Confessional Statements Successfully Updated",
        actionType: actions.UPDATE_CONFESSIONAL_STATEMENTS_SUCCESS,
      });
    case actions.UPDATE_CONFESSIONAL_STATEMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CONFESSIONAL_STATEMENTS_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
