import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  remandExtensionList: [],
  actionType: "",
});

export default function remandExtensionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_REMAND_EXTENSION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_REMAND_EXTENSION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        remandExtensionList: action.remandExtensionList,
        actionType: actions.FETCH_REMAND_EXTENSION_SUCCESS,
      };
    case actions.FETCH_REMAND_EXTENSION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_REMAND_EXTENSION_ERROR,
      };

    case actions.ADD_REMAND_EXTENSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_REMAND_EXTENSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Remand Extension Successfully Added",
        actionType: actions.ADD_REMAND_EXTENSION_SUCCESS,
      });
    case actions.ADD_REMAND_EXTENSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_REMAND_EXTENSION_ERROR,
      });

    case actions.UPDATE_REMAND_EXTENSION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_REMAND_EXTENSION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Remand Extension Successfully Updated",
        actionType: actions.UPDATE_REMAND_EXTENSION_SUCCESS,
      });
    case actions.UPDATE_REMAND_EXTENSION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_REMAND_EXTENSION_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
