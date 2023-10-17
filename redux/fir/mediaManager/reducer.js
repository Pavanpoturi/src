import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isUploading: false,
  uploadErrorMessage: "",
  uploadSuccessMessage: "",
  mediaList: [],
  templateList: [],
  uploadActionType: "",
});

export default function mediaManagerReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_MEDIA_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_MEDIA_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        isUploading: false,
        uploadErrorMessage: "",
        mediaList: action.mediaList,
        uploadActionType: actions.FETCH_MEDIA_SUCCESS,
      };
    case actions.FETCH_MEDIA_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        isUploading: false,
        uploadErrorMessage: action.uploadErrorMessage,
        uploadActionType: actions.FETCH_MEDIA_ERROR,
      };
    case actions.UPLOAD_MEDIA_REQUEST:
      return Immutable.merge(state, {
        isUploading: true,
      });
    case actions.UPLOAD_MEDIA_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isUploading: false,
        uploadErrorMessage: "",
        uploadSuccessMessage: "File Uploaded Successfully",
        uploadActionType: actions.UPLOAD_MEDIA_SUCCESS,
        mediaList: action.mediaList,
      });
    case actions.UPLOAD_MEDIA_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isUploading: false,
        uploadErrorMessage: action.uploadErrorMessage,
        uploadSuccessMessage: "",
        uploadActionType: actions.UPLOAD_MEDIA_ERROR,
      });
    case actions.UPLOAD_TEMPLATES_REQUEST:
      return Immutable.merge(state, {
        isUploading: true,
      });
    case actions.UPLOAD_TEMPLATES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isUploading: false,
        uploadErrorMessage: "",
        uploadSuccessMessage: "Template Uploaded Successfully",
        uploadActionType: actions.UPLOAD_TEMPLATES_SUCCESS,
        templateList: action.templateList,
      });
    case actions.UPLOAD_TEMPLATES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isUploading: false,
        uploadErrorMessage: action.uploadErrorMessage,
        uploadSuccessMessage: "",
        uploadActionType: actions.UPLOAD_TEMPLATES_ERROR,
      });
    case actions.RESET_TEMPLATES_ACTION_TYPE:
      return Immutable.merge(state, {
        uploadActionType: "",
      });
    default:
      return state;
  }
}
