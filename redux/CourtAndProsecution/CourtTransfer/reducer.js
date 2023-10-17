import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  courtTransferList: [],
  actionType: "",
});

export default function CourtTransferReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_COURT_TRANSFER_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_COURT_TRANSFER_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        courtTransferList: action.courtTransferList,
      };
    case actions.FETCH_COURT_TRANSFER_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_COURT_TRANSFER_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COURT_TRANSFER_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_COURT_TRANSFER_SUCCESS,
      });
    case actions.ADD_COURT_TRANSFER_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_COURT_TRANSFER_ERROR,
      });

    case actions.UPDATE_COURT_TRANSFER_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_COURT_TRANSFER_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Court Transfer Successfully Updated",
        actionType: actions.UPDATE_COURT_TRANSFER_SUCCESS,
      });
    case actions.UPDATE_COURT_TRANSFER_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_COURT_TRANSFER_ERROR,
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
