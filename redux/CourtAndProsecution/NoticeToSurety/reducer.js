import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  noticeToSuretyList: [],
  actionType: "",
});

export default function NoticeToSuretyReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_NOTICE_TO_SURETY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_NOTICE_TO_SURETY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        noticeToSuretyList: action.noticeToSuretyList,
      };
    case actions.FETCH_NOTICE_TO_SURETY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_NOTICE_TO_SURETY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_NOTICE_TO_SURETY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_NOTICE_TO_SURETY_SUCCESS,
      });
    case actions.ADD_NOTICE_TO_SURETY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_NOTICE_TO_SURETY_ERROR,
      });

    case actions.UPDATE_NOTICE_TO_SURETY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_NOTICE_TO_SURETY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Notice To Surety Successfully Updated",
        actionType: actions.UPDATE_NOTICE_TO_SURETY_SUCCESS,
      });
    case actions.UPDATE_NOTICE_TO_SURETY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_NOTICE_TO_SURETY_ERROR,
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
