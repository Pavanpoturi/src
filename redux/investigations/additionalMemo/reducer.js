import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  additionalMemoList: [],
  actionType: "",
});

export default function additionalMemoReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ADDITIONAL_MEMO_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_ADDITIONAL_MEMO_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        additionalMemoList: action.additionalMemoList,
      };
    case actions.FETCH_ADDITIONAL_MEMO_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_ADDITIONAL_MEMO_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ADDITIONAL_MEMO_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Additional Memo Successfully Added",
        actionType: actions.ADD_ADDITIONAL_MEMO_SUCCESS,
      });
    case actions.ADD_ADDITIONAL_MEMO_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_ADDITIONAL_MEMO_ERROR,
      });

    case actions.UPDATE_ADDITIONAL_MEMO_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_ADDITIONAL_MEMO_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Additional Memo Successfully Updated",
        actionType: actions.UPDATE_ADDITIONAL_MEMO_SUCCESS,
      });
    case actions.UPDATE_ADDITIONAL_MEMO_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_ADDITIONAL_MEMO_ERROR,
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
