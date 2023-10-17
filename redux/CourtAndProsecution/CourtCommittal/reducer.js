import actions from "./action";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  actionType: "",
  savedData: [],
});

export default function createCourtCommittalReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_COURT_COMMITTAl_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_COURT_COMMITTAl_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        savedData: action.savedData,
        actionType: actions.FETCH_COURT_COMMITTAl_SUCCESS,
      };
    case actions.FETCH_COURT_COMMITTAl_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_COURT_COMMITTAl_ERROR,
      };

    case actions.ADD_COURT_COMMITTAl_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COURT_COMMITTAl_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        savedData: action.savedData,
        actionType: actions.ADD_COURT_COMMITTAl_SUCCESS,
      });
    case actions.ADD_COURT_COMMITTAl_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_COURT_COMMITTAl_ERROR,
      });

    case actions.UPDATE_COURT_COMMITTAl_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_COURT_COMMITTAl_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action?.message,
        savedData: action.savedData,
        actionType: actions.UPDATE_COURT_COMMITTAl_SUCCESS,
      });
    case actions.UPDATE_COURT_COMMITTAl_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action?.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_COURT_COMMITTAl_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });

    case actions.RESET_COURT_COMMITTAl_DATA:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
        savedData: [],
      });

    default:
      return state;
  }
}
