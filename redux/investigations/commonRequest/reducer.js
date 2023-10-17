import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isLoading: false,
  commonErrorMessage: "",
  commonSuccessMessage: "",
  deceasedList: [],
  notice160List: [],
  actionName: "",
});

export default function commonReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_DECEASED_REQUEST:
      return { ...state, isLoading: true };
    case actions.FETCH_DECEASED_SUCCESS:
      return {
        ...state,
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        deceasedList: action.deceasedList,
        actionName: actions.FETCH_DECEASED_SUCCESS,
      };
    case actions.FETCH_DECEASED_ERROR:
      return {
        ...state,
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        actionName: actions.FETCH_DECEASED_ERROR,
      };

    case actions.ADD_DECEASED_REQUEST:
      return Immutable.merge(state, {
        isLoading: true,
      });
    case actions.ADD_DECEASED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        commonSuccessMessage:
          action.response.message || "Deceased Successfully Added",
        actionName: actions.ADD_DECEASED_SUCCESS,
      });
    case actions.ADD_DECEASED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        commonSuccessMessage: "",
        actionName: actions.ADD_DECEASED_ERROR,
      });

    case actions.UPDATE_DECEASED_REQUEST:
      return Immutable.merge(state, {
        isLoading: true,
      });
    case actions.UPDATE_DECEASED_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        commonSuccessMessage:
          action.response.message || "Deceased Successfully Updated",
        actionName: actions.UPDATE_DECEASED_SUCCESS,
      });
    case actions.UPDATE_DECEASED_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        commonSuccessMessage: "",
        actionName: actions.UPDATE_DECEASED_ERROR,
      });

    case actions.RESET_DECEASED_ACTIONTYPE:
      return Immutable.merge(state, {
        actionName: "",
      });

    case actions.FETCH_NOTICE_160_REQUEST:
      return { ...state, isLoading: true };
    case actions.FETCH_NOTICE_160_SUCCESS:
      return {
        ...state,
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        notice160List: action.notice160List,
        actionName: actions.FETCH_NOTICE_160_SUCCESS,
      };
    case actions.FETCH_NOTICE_160_ERROR:
      return {
        ...state,
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        actionName: actions.FETCH_NOTICE_160_ERROR,
      };

    case actions.ADD_NOTICE_160_REQUEST:
      return Immutable.merge(state, {
        isLoading: true,
      });
    case actions.ADD_NOTICE_160_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        commonSuccessMessage:
          action.response.message || "Person Details Successfully Added",
        actionName: actions.ADD_NOTICE_160_SUCCESS,
      });
    case actions.ADD_NOTICE_160_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        commonSuccessMessage: "",
        actionName: actions.ADD_NOTICE_160_ERROR,
      });

    case actions.UPDATE_NOTICE_160_REQUEST:
      return Immutable.merge(state, {
        isLoading: true,
      });
    case actions.UPDATE_NOTICE_160_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isLoading: false,
        commonErrorMessage: "",
        commonSuccessMessage:
          action.response.message || "Person Details Successfully Updated",
        actionName: actions.UPDATE_NOTICE_160_SUCCESS,
      });
    case actions.UPDATE_NOTICE_160_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isLoading: false,
        commonErrorMessage: action.errorMessage,
        commonSuccessMessage: "",
        actionName: actions.UPDATE_NOTICE_160_ERROR,
      });

    case actions.RESET_NOTICE_160_ACTIONTYPE:
      return Immutable.merge(state, {
        actionName: "",
      });
    default:
      return state;
  }
}
