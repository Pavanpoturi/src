import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  proclamationAndPropertyAttachmentsList: [],
  actionType: "",
});

export default function ProclamationAndPropertyAttachmentsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        proclamationAndPropertyAttachmentsList:
          action.proclamationAndPropertyAttachmentsList,
      };
    case actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        actionType: actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS,
      });
    case actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
      });

    case actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage:
          action.response.message ||
          "Proclamation And Property Attachments Successfully Updated",
        actionType:
          actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS,
      });
    case actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
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
