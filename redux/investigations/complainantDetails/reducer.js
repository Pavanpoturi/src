import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  complainantErrorMessage: "",
  complainantSuccessMessage: "",
  complainantDetailsList: [],
  complainantActionType: "",
});

export default function complainantDetailsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_COMPLAINANT_DETAILS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_COMPLAINANT_DETAILS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        complainantErrorMessage: "",
        complainantDetailsList: action.complainantDetailsList,
        complainantActionType: actions.FETCH_COMPLAINANT_DETAILS_SUCCESS,
      };
    case actions.FETCH_COMPLAINANT_DETAILS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        complainantErrorMessage: action.complainantErrorMessage,
        complainantActionType: actions.FETCH_COMPLAINANT_DETAILS_ERROR,
      };

    case actions.ADD_COMPLAINANT_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COMPLAINANT_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        complainantErrorMessage: "",
        complainantSuccessMessage: "Complainant Details Successfully Added",
        complainantActionType: actions.ADD_COMPLAINANT_DETAILS_SUCCESS,
      });
    case actions.ADD_COMPLAINANT_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        complainantErrorMessage: action.complainantErrorMessage,
        complainantSuccessMessage: "",
        complainantActionType: actions.ADD_COMPLAINANT_DETAILS_ERROR,
      });

    case actions.UPDATE_COMPLAINANT_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_COMPLAINANT_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        complainantErrorMessage: "",
        complainantSuccessMessage: "Complainant Details Successfully Updated",
        complainantActionType: actions.UPDATE_COMPLAINANT_DETAILS_SUCCESS,
      });
    case actions.UPDATE_COMPLAINANT_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        complainantErrorMessage: action.complainantErrorMessage,
        complainantSuccessMessage: "",
        complainantActionType: actions.UPDATE_COMPLAINANT_DETAILS_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        complainantActionType: "",
      });
    default:
      return state;
  }
}
