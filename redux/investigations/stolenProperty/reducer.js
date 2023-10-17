import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  stolenPropertyList: [],
  actionType: "",
});

export default function stolenPropertyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_STOLEN_PROPERTY_REQUEST:
      return { ...state, isFetching: true, isLoading: true };
    case actions.FETCH_STOLEN_PROPERTY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        stolenPropertyList: action.stolenPropertyList,
        actionType: actions.FETCH_STOLEN_PROPERTY_SUCCESS,
      };
    case actions.FETCH_STOLEN_PROPERTY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        isLoading: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_STOLEN_PROPERTY_ERROR,
      };

    case actions.ADD_STOLEN_PROPERTY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isLoading: true,
      });
    case actions.ADD_STOLEN_PROPERTY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Stolen Property Successfully Added",
        actionType: actions.ADD_STOLEN_PROPERTY_SUCCESS,
      });
    case actions.ADD_STOLEN_PROPERTY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isLoading: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_STOLEN_PROPERTY_ERROR,
      });

    case actions.DELETE_STOLEN_PROPERTY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isLoading: true,
      });
    case actions.DELETE_STOLEN_PROPERTY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Stolen Property Successfully Deleted",
        actionType: actions.DELETE_STOLEN_PROPERTY_SUCCESS,
      });
    case actions.DELETE_STOLEN_PROPERTY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isLoading: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.DELETE_STOLEN_PROPERTY_ERROR,
      });

    case actions.UPDATE_STOLEN_PROPERTY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isLoading: true,
      });
    case actions.UPDATE_STOLEN_PROPERTY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isLoading: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Stolen Property Successfully Updated",
        actionType: actions.UPDATE_STOLEN_PROPERTY_SUCCESS,
      });
    case actions.UPDATE_STOLEN_PROPERTY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isLoading: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_STOLEN_PROPERTY_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
