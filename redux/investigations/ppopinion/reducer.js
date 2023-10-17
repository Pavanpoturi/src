import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  ppopinionList: [],
  actionType: "",
});

export default function ppopinionReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_PPOPINION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_PPOPINION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        ppopinionList: action.ppopinionList,
        actionType: actions.FETCH_PPOPINION_SUCCESS,
      };
    case actions.FETCH_PPOPINION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_PPOPINION_ERROR,
      };

    case actions.ADD_PPOPINION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_PPOPINION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "PP Opinion Successfully Added",
        actionType: actions.ADD_PPOPINION_SUCCESS,
      });
    case actions.ADD_PPOPINION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_PPOPINION_ERROR,
      });

    case actions.UPDATE_PPOPINION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_PPOPINION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "PP Opinion Successfully Updated",
        actionType: actions.UPDATE_PPOPINION_SUCCESS,
      });
    case actions.UPDATE_PPOPINION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_PPOPINION_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: ""
      });
    default:
      return state;
  }
}
