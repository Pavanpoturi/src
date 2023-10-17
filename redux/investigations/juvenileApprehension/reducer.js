import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  juvenileApprehensionList: [],
  actionType: "",
});

export default function juvenileApprehensionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_JUVENILE_APPREHENSION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_JUVENILE_APPREHENSION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        juvenileApprehensionList: action.juvenileApprehensionList,
        actionType: actions.FETCH_JUVENILE_APPREHENSION_SUCCESS,
      };
    case actions.FETCH_JUVENILE_APPREHENSION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_JUVENILE_APPREHENSION_ERROR,
      };

    case actions.ADD_JUVENILE_APPREHENSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_JUVENILE_APPREHENSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.ADD_JUVENILE_APPREHENSION_SUCCESS,
      });
    case actions.ADD_JUVENILE_APPREHENSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_JUVENILE_APPREHENSION_ERROR,
      });

    case actions.UPDATE_JUVENILE_APPREHENSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_JUVENILE_APPREHENSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.UPDATE_JUVENILE_APPREHENSION_SUCCESS,
      });
    case actions.UPDATE_JUVENILE_APPREHENSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_JUVENILE_APPREHENSION_ERROR,
      });
      case actions.RESET_ACTIONTYPE:
        return Immutable.merge(state, {
          actionType: "",
        });
    default:
      return state;
  }
}
