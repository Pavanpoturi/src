import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  lokAdalatDisposalList: [],
  actionType: "",
});

export default function LokAdalatDisposalReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_LOK_ADALAT_DISPOSAL_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_LOK_ADALAT_DISPOSAL_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        lokAdalatDisposalList: action.lokAdalatDisposalList,
      };
    case actions.FETCH_LOK_ADALAT_DISPOSAL_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_LOK_ADALAT_DISPOSAL_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_LOK_ADALAT_DISPOSAL_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_LOK_ADALAT_DISPOSAL_SUCCESS,
      });
    case actions.ADD_LOK_ADALAT_DISPOSAL_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_LOK_ADALAT_DISPOSAL_ERROR,
      });

    case actions.UPDATE_LOK_ADALAT_DISPOSAL_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_LOK_ADALAT_DISPOSAL_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Lok Adalat Disposal Successfully Updated",
        actionType: actions.UPDATE_LOK_ADALAT_DISPOSAL_SUCCESS,
      });
    case actions.UPDATE_LOK_ADALAT_DISPOSAL_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_LOK_ADALAT_DISPOSAL_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: "",
        lokAdalatDisposalList: [],
      });
    default:
      return state;
  }
}
