import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  gdFailure: false,
  isGdFetching: false,
  errorMessage: "",
  successMessage: "",
  actionType: "",
  updateActionType: "",
  uploadActionType: "",
  savedFir: {},
  firMasterDataList: [],
  updateErrorMessage: "",
  updateSuccessMessage: "",
  uploadErrorMessage: "",
  uploadSuccessMessage: "",
  filteredMajorHeadList: [],
  gdNumberList: [],
});

export default function createFIRReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_GENERATE_FIR_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_GENERATE_FIR_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        savedFir: action.savedFir,
        actionType: actions.FETCH_GENERATE_FIR_SUCCESS,
      };
    case actions.FETCH_GENERATE_FIR_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_GENERATE_FIR_ERROR,
      };

    case actions.FETCH_GD_NUMBER_REQUEST:
      return { ...state, isGdFetching: true };
    case actions.FETCH_GD_NUMBER_SUCCESS:
      return {
        ...state,
        gdFailure: false,
        isGdFetching: false,
        errorMessage: "",
        gdNumberList: action.gdNumberList,
        actionType: actions.FETCH_GD_NUMBER_SUCCESS,
      };
    case actions.FETCH_GD_NUMBER_ERROR:
      return {
        ...state,
        gdFailure: true,
        isGdFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_GD_NUMBER_ERROR,
      };

    case actions.FETCH_FIR_MASTER_DATA_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_FIR_MASTER_DATA_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        firMasterDataList: action.firMasterDataList,
      });
    case actions.FETCH_FIR_MASTER_DATA_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_DEFAULT_MAJOR_HEAD_REQUEST:
      return { ...state, isFetching: false };
    case actions.FETCH_DEFAULT_MAJOR_HEAD_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        filteredMajorHeadList: action.majorHeadList,
        actionType: actions.FETCH_DEFAULT_MAJOR_HEAD_SUCCESS,
      };
    case actions.FETCH_DEFAULT_MAJOR_HEAD_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_DEFAULT_MAJOR_HEAD_ERROR,
      };

    case actions.ADD_GENERATE_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_GENERATE_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.message,
        savedFir: action.savedFir,
        actionType: actions.ADD_GENERATE_FIR_SUCCESS,
      });
    case actions.ADD_GENERATE_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_GENERATE_FIR_ERROR,
      });

    case actions.UPDATE_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.UPDATE_FIR_SUCCESS,
      });
    case actions.UPDATE_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.UPDATE_FIR_ERROR,
      });

    case actions.ADD_ACTS_SECTIONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ACTS_SECTIONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_ACTS_SECTIONS_SUCCESS,
      });
    case actions.ADD_ACTS_SECTIONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_ACTS_SECTIONS_ERROR,
      });

    case actions.ADD_OCCURRENCE_OF_OFFENCE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_OCCURRENCE_OF_OFFENCE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_OCCURRENCE_OF_OFFENCE_SUCCESS,
      });
    case actions.ADD_OCCURRENCE_OF_OFFENCE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_OCCURRENCE_OF_OFFENCE_ERROR,
      });

    case actions.ADD_COMPLAINANT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_COMPLAINANT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_COMPLAINANT_SUCCESS,
      });
    case actions.ADD_COMPLAINANT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_COMPLAINANT_ERROR,
      });

    case actions.ADD_BRIEF_FACTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_BRIEF_FACTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_BRIEF_FACTS_SUCCESS,
      });
    case actions.ADD_BRIEF_FACTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_BRIEF_FACTS_ERROR,
      });

    case actions.UPLOAD_DOCUMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_DOCUMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.UPLOAD_DOCUMENTS_SUCCESS,
      });
    case actions.UPLOAD_DOCUMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.UPLOAD_DOCUMENTS_ERROR,
      });

    case actions.DELETE_DOCUMENTS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DELETE_DOCUMENTS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.DELETE_DOCUMENTS_SUCCESS,
      });
    case actions.DELETE_DOCUMENTS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.DELETE_DOCUMENTS_ERROR,
      });

    case actions.ADD_PROPERTY_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_PROPERTY_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_PROPERTY_DETAILS_SUCCESS,
      });
    case actions.ADD_PROPERTY_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_PROPERTY_DETAILS_ERROR,
      });

    case actions.ADD_ACCUSED_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_ACCUSED_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_ACCUSED_DETAILS_SUCCESS,
      });
    case actions.ADD_ACCUSED_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_ACCUSED_DETAILS_ERROR,
      });

    case actions.ADD_VICTIM_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_VICTIM_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        updateErrorMessage: "",
        successMessage: "",
        updateSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        updateActionType: actions.ADD_VICTIM_DETAILS_SUCCESS,
      });
    case actions.ADD_VICTIM_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: action.errorMessage,
        actionType: "",
        updateActionType: actions.ADD_VICTIM_DETAILS_ERROR,
      });

    case actions.UPLOAD_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPLOAD_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        uploadErrorMessage: "",
        successMessage: "",
        uploadSuccessMessage: action.message,
        savedFir: action.savedFir,
        actionType: "",
        uploadActionType: actions.UPLOAD_FIR_SUCCESS,
      });
    case actions.UPLOAD_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        uploadSuccessMessage: "",
        uploadErrorMessage: action.errorMessage,
        actionType: "",
        uploadActionType: actions.UPLOAD_FIR_ERROR,
      });

    case actions.DELETE_FIR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DELETE_FIR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "FIR deleted successfully",
        actionType: actions.DELETE_FIR_SUCCESS,
      });
    case actions.DELETE_FIR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.DELETE_FIR_ERROR,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });

    case actions.RESET_FIR_DATA:
      return Immutable.merge(state, {
        actionType: "",
        updateActionType: "",
        errorMessage: "",
        successMessage: "",
        updateSuccessMessage: "",
        updateErrorMessage: "",
        savedFir: {},
      });

    case actions.RESET_UPDATE_ACTIONTYPE:
      return Immutable.merge(state, {
        updateActionType: "",
        updateSuccessMessage: "",
        updateErrorMessage: "",
        uploadActionType: "",
        uploadErrorMessage: "",
        uploadSuccessMessage: "",
      });
    default:
      return state;
  }
}
