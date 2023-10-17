import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  ptWarrantList: [],
  actionType: "",
});

export default function ptWarrantReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_PT_WARRANT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_PT_WARRANT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        ptWarrantList: action.ptWarrantList,
        actionType: actions.FETCH_PT_WARRANT_SUCCESS,
      };
    case actions.FETCH_PT_WARRANT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_PT_WARRANT_ERROR,
      };

    case actions.ADD_PT_WARRANT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_PT_WARRANT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Transit Warrant Successfully Added",
        actionType: actions.ADD_PT_WARRANT_SUCCESS,
      });
    case actions.ADD_PT_WARRANT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_PT_WARRANT_ERROR,
      });

    case actions.UPDATE_PT_WARRANT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_PT_WARRANT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Transit Warrant Successfully Updated",
        actionType: actions.UPDATE_PT_WARRANT_SUCCESS,
      });
    case actions.UPDATE_PT_WARRANT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_PT_WARRANT_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
