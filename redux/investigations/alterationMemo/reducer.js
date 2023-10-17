import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  alterationMemoList: {},
  actionType: "",
});

export default function alterationMemoReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_ALTERATION_MEMO_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_ALTERATION_MEMO_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        alterationMemoList: action.alterationMemoList,
        actionType: actions.FETCH_ALTERATION_MEMO_SUCCESS,
      };
    case actions.FETCH_ALTERATION_MEMO_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_ALTERATION_MEMO_ERROR,
      };

    case actions.ADD_ALTERATION_MEMO_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ALTERATION_MEMO_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Alteration Memo Successfully Added",
        actionType: actions.ADD_ALTERATION_MEMO_SUCCESS,
      });
    case actions.ADD_ALTERATION_MEMO_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_ALTERATION_MEMO_ERROR,
      });

    case actions.UPDATE_ALTERATION_MEMO_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_ALTERATION_MEMO_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Alteration Memo Successfully Updated",
        actionType: actions.UPDATE_ALTERATION_MEMO_SUCCESS,
      });
    case actions.UPDATE_ALTERATION_MEMO_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_ALTERATION_MEMO_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });
    default:
      return state;
  }
}
