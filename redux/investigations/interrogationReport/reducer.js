import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  personMedia: [],
  interrogationReportList: [],
  actionType: "",
});

export default function interrogationReportReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_INTERROGATION_REPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_INTERROGATION_REPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        interrogationReportList: action.interrogationReportList,
        actionType: actions.FETCH_INTERROGATION_REPORT_SUCCESS,
      };
    case actions.FETCH_INTERROGATION_REPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_INTERROGATION_REPORT_ERROR,
      };

    case actions.ADD_INTERROGATION_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_INTERROGATION_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message || "Interrogation Report Successfully Added",
        actionType: actions.ADD_INTERROGATION_REPORT_SUCCESS,
      });
    case actions.ADD_INTERROGATION_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_INTERROGATION_REPORT_ERROR,
      });

    case actions.UPDATE_INTERROGATION_REPORT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_INTERROGATION_REPORT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Interrogation Report Successfully Updated",
        actionType: actions.UPDATE_INTERROGATION_REPORT_SUCCESS,
      });
    case actions.UPDATE_INTERROGATION_REPORT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_INTERROGATION_REPORT_ERROR,
      });

    case actions.DELETE_REPORTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DELETE_REPORTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.DELETE_REPORTS_SUCCESS,
      });
    case actions.DELETE_REPORTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.DELETE_REPORTS_ERROR,
      });

    case actions.UPDATE_PERSON_MEDIA_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_PERSON_MEDIA_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        personMedia: action.personMedia,
        successMessage: action.successMessage,
        actionType: actions.UPDATE_PERSON_MEDIA_SUCCESS,
      });
    case actions.UPDATE_PERSON_MEDIA_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_PERSON_MEDIA_ERROR,
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
