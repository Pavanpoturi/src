import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  lookoutNoticeList: [],
  actionType: "",
});

export default function lookoutNoticeReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_LOOKOUT_NOTICE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_LOOKOUT_NOTICE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        lookoutNoticeList: action.lookoutNoticeList,
        actionType: actions.FETCH_LOOKOUT_NOTICE_SUCCESS,
      };
    case actions.FETCH_LOOKOUT_NOTICE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_LOOKOUT_NOTICE_ERROR,
      };

    case actions.ADD_LOOKOUT_NOTICE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_LOOKOUT_NOTICE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Lookout Notice Successfully Added",
        actionType: actions.ADD_LOOKOUT_NOTICE_SUCCESS,
      });
    case actions.ADD_LOOKOUT_NOTICE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_LOOKOUT_NOTICE_ERROR,
      });

    case actions.UPDATE_LOOKOUT_NOTICE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_LOOKOUT_NOTICE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Lookout Notice Successfully Updated",
        actionType: actions.UPDATE_LOOKOUT_NOTICE_SUCCESS,
      });
    case actions.UPDATE_LOOKOUT_NOTICE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_LOOKOUT_NOTICE_ERROR,
      });
    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
