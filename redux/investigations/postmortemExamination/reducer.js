import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  postmortemExaminationList: [],
  actionType: "",
});

export default function postmortemExaminationReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_POSTMORTEM_EXAMINATION_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_POSTMORTEM_EXAMINATION_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        postmortemExaminationList: action.postmortemExaminationList,
        actionType: actions.FETCH_POSTMORTEM_EXAMINATION_SUCCESS,
      };
    case actions.FETCH_POSTMORTEM_EXAMINATION_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_POSTMORTEM_EXAMINATION_ERROR,
      };

    case actions.ADD_POSTMORTEM_EXAMINATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_POSTMORTEM_EXAMINATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Post-mortem Examination Successfully Added",
        actionType: actions.ADD_POSTMORTEM_EXAMINATION_SUCCESS,
      });
    case actions.ADD_POSTMORTEM_EXAMINATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_POSTMORTEM_EXAMINATION_ERROR,
      });

    case actions.UPDATE_POSTMORTEM_EXAMINATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_POSTMORTEM_EXAMINATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Post-mortem Examination Successfully Updated",
        actionType: actions.UPDATE_POSTMORTEM_EXAMINATION_SUCCESS,
      });
    case actions.UPDATE_POSTMORTEM_EXAMINATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_POSTMORTEM_EXAMINATION_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
