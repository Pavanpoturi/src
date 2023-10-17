import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  noticeToComplainantList: [],
  actionType: "",
});

export default function noticeToComplainantReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_NOTICE_TO_COMPLAINANT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_NOTICE_TO_COMPLAINANT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        noticeToComplainantList: action.noticeToComplainantList,
        actionType: actions.FETCH_NOTICE_TO_COMPLAINANT_SUCCESS,
      };
    case actions.FETCH_NOTICE_TO_COMPLAINANT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_NOTICE_TO_COMPLAINANT_ERROR,
      };

    case actions.ADD_NOTICE_TO_COMPLAINANT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_NOTICE_TO_COMPLAINANT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Notice To Complainant Successfully Added",
        actionType: actions.ADD_NOTICE_TO_COMPLAINANT_SUCCESS,
      });
    case actions.ADD_NOTICE_TO_COMPLAINANT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_NOTICE_TO_COMPLAINANT_ERROR,
      });

    case actions.UPDATE_NOTICE_TO_COMPLAINANT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_NOTICE_TO_COMPLAINANT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Notice To Complainant Successfully Updated",
        actionType: actions.UPDATE_NOTICE_TO_COMPLAINANT_SUCCESS,
      });
    case actions.UPDATE_NOTICE_TO_COMPLAINANT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_NOTICE_TO_COMPLAINANT_ERROR,
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
