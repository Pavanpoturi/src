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

export default function tipAccusedReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_TIPACCUSED_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_TIPACCUSED_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        TIPAccusedList: action.TIPAccusedList,
        actionType: actions.FETCH_TIPACCUSED_SUCCESS,
      };
    case actions.FETCH_TIPACCUSED_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_TIPACCUSED_ERROR,
      };

    case actions.ADD_TIPACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_TIPACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "TIP Accused Successfully Added",
        actionType: actions.ADD_TIPACCUSED_SUCCESS,
      });
    case actions.ADD_TIPACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_TIPACCUSED_ERROR,
      });

    case actions.UPDATE_TIPACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_TIPACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "TIP Accused Successfully Updated",
        actionType: actions.UPDATE_TIPACCUSED_SUCCESS,
      });
    case actions.UPDATE_TIPACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_TIPACCUSED_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
