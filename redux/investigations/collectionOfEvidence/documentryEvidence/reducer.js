import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  documentryEvidenceList: [],
  actionType: "",
});

export default function documentryEvidenceReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_DOCUMENTRY_EVIDENCE_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_DOCUMENTRY_EVIDENCE_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        documentryEvidenceList: action.documentryEvidenceList,
        actionType: actions.FETCH_DOCUMENTRY_EVIDENCE_SUCCESS,
      };
    case actions.FETCH_DOCUMENTRY_EVIDENCE_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_DOCUMENTRY_EVIDENCE_ERROR,
      };

    case actions.ADD_DOCUMENTRY_EVIDENCE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_DOCUMENTRY_EVIDENCE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Documentary evidence successfully added",
        actionType: actions.ADD_DOCUMENTRY_EVIDENCE_SUCCESS,
      });
    case actions.ADD_DOCUMENTRY_EVIDENCE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_DOCUMENTRY_EVIDENCE_ERROR,
      });

    case actions.UPDATE_DOCUMENTRY_EVIDENCE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_DOCUMENTRY_EVIDENCE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Documentary evidence successfully updated",
        actionType: actions.UPDATE_DOCUMENTRY_EVIDENCE_SUCCESS,
      });
    case actions.UPDATE_DOCUMENTRY_EVIDENCE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_DOCUMENTRY_EVIDENCE_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
      });
    default:
      return state;
  }
}
