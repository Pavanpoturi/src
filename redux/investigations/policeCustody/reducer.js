import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  policeCustodyList: [],
  actionType: "",
});

export default function policeCustodyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_POLICE_CUSTODY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_POLICE_CUSTODY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        policeCustodyList: action.policeCustodyList,
        actionType: actions.FETCH_POLICE_CUSTODY_SUCCESS,
      };
    case actions.FETCH_POLICE_CUSTODY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_POLICE_CUSTODY_ERROR,
      };

    case actions.ADD_POLICE_CUSTODY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_POLICE_CUSTODY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Police Custody Successfully Added",
        actionType: actions.ADD_POLICE_CUSTODY_SUCCESS,
      });
    case actions.ADD_POLICE_CUSTODY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_POLICE_CUSTODY_ERROR,
      });

    case actions.UPDATE_POLICE_CUSTODY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_POLICE_CUSTODY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Police Custody Successfully Updated",
        actionType: actions.UPDATE_POLICE_CUSTODY_SUCCESS,
      });
    case actions.UPDATE_POLICE_CUSTODY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_POLICE_CUSTODY_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
