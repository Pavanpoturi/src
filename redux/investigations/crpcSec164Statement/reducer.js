import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  crpc164StatementList: [],
  actionType: "",
});

export default function crpc164StatementReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_CRPC_164STATEMENT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CRPC_164STATEMENT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        crpc164StatementList: action.crpc164StatementList,
        actionType: actions.FETCH_CRPC_164STATEMENT_SUCCESS,
      };
    case actions.FETCH_CRPC_164STATEMENT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CRPC_164STATEMENT_ERROR,
      };

    case actions.ADD_CRPC_164STATEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_CRPC_164STATEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Sec.164 CrPC Statement Successfully Added",
        actionType: actions.ADD_CRPC_164STATEMENT_SUCCESS,
      });
    case actions.ADD_CRPC_164STATEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_CRPC_164STATEMENT_ERROR,
      });

    case actions.UPDATE_CRPC_164STATEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CRPC_164STATEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Sec.164 CrPC Statement Successfully Updated",
        actionType: actions.UPDATE_CRPC_164STATEMENT_SUCCESS,
      });
    case actions.UPDATE_CRPC_164STATEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_CRPC_164STATEMENT_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
