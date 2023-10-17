import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  suspectAccusedList: [],
  actionType: "",
});

export default function firReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_SUSPECT_ACCUSED_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_SUSPECT_ACCUSED_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        suspectAccusedList: action.suspectAccusedList,
        actionType: actions.FETCH_SUSPECT_ACCUSED_SUCCESS,
      };
    case actions.FETCH_SUSPECT_ACCUSED_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_SUSPECT_ACCUSED_ERROR,
      };

    case actions.ADD_SUSPECT_ACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_SUSPECT_ACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Accused Details successfully added",
        actionType: actions.ADD_SUSPECT_ACCUSED_SUCCESS,
      });
    case actions.ADD_SUSPECT_ACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_SUSPECT_ACCUSED_ERROR,
      });
      case actions.DELETE_PERSON_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DELETE_PERSON_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Deleted Person successfully",
        actionType: actions.DELETE_PERSON_SUCCESS,
      });
    case actions.DELETE_PERSON_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.DELETE_PERSON_ERROR,
      });

    case actions.UPDATE_SUSPECT_ACCUSED_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_SUSPECT_ACCUSED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Accused Details successfully updated",
        actionType: actions.UPDATE_SUSPECT_ACCUSED_SUCCESS,
      });
    case actions.UPDATE_SUSPECT_ACCUSED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_SUSPECT_ACCUSED_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });
    default:
      return state;
  }
}
