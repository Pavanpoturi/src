import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  inquestList: [],
  actionType: "",
});

export default function inquestReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_INQUEST_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_INQUEST_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        inquestList: action.inquestList,
        actionType: actions.FETCH_INQUEST_SUCCESS,
      };
    case actions.FETCH_INQUEST_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_INQUEST_ERROR,
      };

    case actions.ADD_INQUEST_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_INQUEST_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Inquest Successfully Added",
        actionType: actions.ADD_INQUEST_SUCCESS,
      });
    case actions.ADD_INQUEST_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_INQUEST_ERROR,
      });

    case actions.UPDATE_INQUEST_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_INQUEST_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Inquest Successfully Updated",
        actionType: actions.UPDATE_INQUEST_SUCCESS,
      });
    case actions.UPDATE_INQUEST_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_INQUEST_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
