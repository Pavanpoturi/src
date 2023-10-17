import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  isCaseCountFeatching: false,
  dashboardDetails: [],
  recentEditList: [],
  caseCountList: [],
  selectedDashboard: "",
  isPersnolized: "",
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DASHBOARD_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_DASHBOARD_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        dashboardDetails: action.dashboardDetails,
      });
    case actions.FETCH_DASHBOARD_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_RECENTEDITLIST_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_RECENTEDITLIST_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        recentEditList: action.recentEditList,
      });
    case actions.FETCH_RECENTEDITLIST_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.GET_SELECTED_WIDGET_DATA:
      return Immutable.merge(state, {
        selectedDashboard: action.selecteDashboard,
      });
    case actions.FETCH_DASHBOARD_CASE_COUNT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isCaseCountFeatching: true,
      });
    case actions.FETCH_DASHBOARD_CASE_COUNT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isCaseCountFeatching: false,
        errorMessage: "",
        caseCountList: action.caseCountList,
      });
    case actions.FETCH_DASHBOARD_CASE_COUNT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isCaseCountFeatching: false,
        errorMessage: action.errorMessage,
      });
    case actions.SET_VIEW_PERSNOLIZED:
      return Immutable.merge(state, {
        isPersnolized: action.isPersnolized,
      });
    case actions.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
