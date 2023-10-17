import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  bailOppositionsList: [],
  actionType: "",
});

export default function bailOppositionsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_BAIL_OPPOSITIONS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_BAIL_OPPOSITIONS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        bailOppositionsList: action.bailOppositionsList,
        actionType: actions.FETCH_BAIL_OPPOSITIONS_SUCCESS,
      };
    case actions.FETCH_BAIL_OPPOSITIONS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_BAIL_OPPOSITIONS_ERROR,
      };

    case actions.ADD_BAIL_OPPOSITIONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_BAIL_OPPOSITIONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Bail Oppositions Successfully Added",
        actionType: actions.ADD_BAIL_OPPOSITIONS_SUCCESS,
      });
    case actions.ADD_BAIL_OPPOSITIONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_BAIL_OPPOSITIONS_ERROR,
      });

    case actions.UPDATE_BAIL_OPPOSITIONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_BAIL_OPPOSITIONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Bail Oppositions Successfully Updated",
        actionType: actions.UPDATE_BAIL_OPPOSITIONS_SUCCESS,
      });
    case actions.UPDATE_BAIL_OPPOSITIONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_BAIL_OPPOSITIONS_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
