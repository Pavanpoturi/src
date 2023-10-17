import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  deathOfAccusedList: [],
  actionType: "",
});

export default function DeathOfAccusedReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DEATH_OF_ACCUSED_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_DEATH_OF_ACCUSED_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        deathOfAccusedList: action.deathOfAccusedList,
      };
    case actions.FETCH_DEATH_OF_ACCUSED_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_DEATH_OF_ACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_DEATH_OF_ACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_DEATH_OF_ACCUSED_SUCCESS,
      });
    case actions.ADD_DEATH_OF_ACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_DEATH_OF_ACCUSED_ERROR,
      });

    case actions.UPDATE_DEATH_OF_ACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_DEATH_OF_ACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Death Of Accused Successfully Updated",
        actionType: actions.UPDATE_DEATH_OF_ACCUSED_SUCCESS,
      });
    case actions.UPDATE_DEATH_OF_ACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_DEATH_OF_ACCUSED_ERROR,
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
