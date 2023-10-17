import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  effortsForTracingList: [],
  actionType: "",
});

export default function effortsForTracingReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_EFFORTS_FOR_TRACING_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_EFFORTS_FOR_TRACING_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        effortsForTracingList: action.effortsForTracingList,
        actionType: actions.FETCH_EFFORTS_FOR_TRACING_SUCCESS,
      };
    case actions.FETCH_EFFORTS_FOR_TRACING_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_EFFORTS_FOR_TRACING_ERROR,
      };

    case actions.ADD_EFFORTS_FOR_TRACING_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_EFFORTS_FOR_TRACING_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_EFFORTS_FOR_TRACING_SUCCESS,
      });
    case actions.ADD_EFFORTS_FOR_TRACING_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_EFFORTS_FOR_TRACING_ERROR,
      });

    case actions.UPDATE_EFFORTS_FOR_TRACING_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_EFFORTS_FOR_TRACING_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
        action.response.message || "Efforts For Tracing Successfully Updated",
        actionType: actions.UPDATE_EFFORTS_FOR_TRACING_SUCCESS,
      });
    case actions.UPDATE_EFFORTS_FOR_TRACING_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_EFFORTS_FOR_TRACING_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        successMessage: "",
        errorMessage: "",
      });
    default:
      return state;
  }
}
