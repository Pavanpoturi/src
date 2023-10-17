import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  executingOfWarrantsList: [],
  actionType: "",
});

export default function ExecutingOfWarrantsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_EXECUTING_OF_WARRANTS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_EXECUTING_OF_WARRANTS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        executingOfWarrantsList: action.executingOfWarrantsList,
      };
    case actions.FETCH_EXECUTING_OF_WARRANTS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_EXECUTING_OF_WARRANTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_EXECUTING_OF_WARRANTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_EXECUTING_OF_WARRANTS_SUCCESS,
      });
    case actions.ADD_EXECUTING_OF_WARRANTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_EXECUTING_OF_WARRANTS_ERROR,
      });

    case actions.UPDATE_EXECUTING_OF_WARRANTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_EXECUTING_OF_WARRANTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Executing Of Warrants Successfully Updated",
        actionType: actions.UPDATE_EXECUTING_OF_WARRANTS_SUCCESS,
      });
    case actions.UPDATE_EXECUTING_OF_WARRANTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_EXECUTING_OF_WARRANTS_ERROR,
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
