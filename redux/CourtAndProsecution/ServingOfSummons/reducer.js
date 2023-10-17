import actions from "./action";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  actionType: "",
  savedData: [],
});

export default function createservingOfSummonsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_SERVING_OF_SUMMONS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_SERVING_OF_SUMMONS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        savedData: action.savedData,
        actionType: actions.FETCH_SERVING_OF_SUMMONS_SUCCESS,
      };
    case actions.FETCH_SERVING_OF_SUMMONS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_SERVING_OF_SUMMONS_ERROR,
      };

    case actions.ADD_SERVING_OF_SUMMONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_SERVING_OF_SUMMONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        savedData: action.savedData,
        actionType: actions.ADD_SERVING_OF_SUMMONS_SUCCESS,
      });
    case actions.ADD_SERVING_OF_SUMMONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_SERVING_OF_SUMMONS_ERROR,
      });

    case actions.UPDATE_SERVING_OF_SUMMONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_SERVING_OF_SUMMONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action?.message,
        savedData: action.savedData,
        actionType: actions.UPDATE_SERVING_OF_SUMMONS_SUCCESS,
      });
    case actions.UPDATE_SERVING_OF_SUMMONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action?.errorMessage,
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: actions.UPDATE_SERVING_OF_SUMMONS_SUCCESS,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });

    case actions.RESET_SERVING_OF_SUMMONS_DATA:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
        savedData: [],
      });

    default:
      return state;
  }
}
