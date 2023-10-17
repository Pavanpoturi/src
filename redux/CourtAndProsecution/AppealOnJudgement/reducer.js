import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  appealOnJudgementList: [],
  actionType: "",
});

export default function AppealOnJudgementReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_APPEAL_ON_JUDGEMENT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_APPEAL_ON_JUDGEMENT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        appealOnJudgementList: action.appealOnJudgementList,
      };
    case actions.FETCH_APPEAL_ON_JUDGEMENT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_APPEAL_ON_JUDGEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_APPEAL_ON_JUDGEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_APPEAL_ON_JUDGEMENT_SUCCESS,
      });
    case actions.ADD_APPEAL_ON_JUDGEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_APPEAL_ON_JUDGEMENT_ERROR,
      });

    case actions.UPDATE_APPEAL_ON_JUDGEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_APPEAL_ON_JUDGEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Appeal On Judgement Successfully Updated",
        actionType: actions.UPDATE_APPEAL_ON_JUDGEMENT_SUCCESS,
      });
    case actions.UPDATE_APPEAL_ON_JUDGEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_APPEAL_ON_JUDGEMENT_ERROR,
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
