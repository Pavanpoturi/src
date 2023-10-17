import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  requisitionsList: [],
  actionType: "",
});

export default function requisitionsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_REQUISITIONS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_REQUISITIONS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        requisitionsList: action.requisitionsList,
        actionType: actions.FETCH_REQUISITIONS_SUCCESS,
      };
    case actions.FETCH_REQUISITIONS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_REQUISITIONS_ERROR,
      };
    default:
      return state;
  }
}
