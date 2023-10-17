import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  TIPAccusedList: [],
  actionType: "",
});

export default function tipArticlesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_TIPARTICLES_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_TIPARTICLES_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        TIPAccusedList: action.TIPAccusedList,
        actionType: actions.FETCH_TIPARTICLES_SUCCESS,
      };
    case actions.FETCH_TIPARTICLES_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_TIPARTICLES_ERROR,
      };

    case actions.ADD_TIPARTICLES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_TIPARTICLES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "TIP Articles Successfully Added",
        actionType: actions.ADD_TIPARTICLES_SUCCESS,
      });
    case actions.ADD_TIPARTICLES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_TIPARTICLES_ERROR,
      });

    case actions.UPDATE_TIPARTICLES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_TIPARTICLES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "TIP Articles Successfully Updated",
        actionType: actions.UPDATE_TIPARTICLES_SUCCESS,
      });
    case actions.UPDATE_TIPARTICLES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_TIPARTICLES_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
