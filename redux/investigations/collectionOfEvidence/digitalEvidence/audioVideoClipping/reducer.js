import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  audioVideoClippingList: [],
  actionType: "",
});

export default function AudioVideoClippingReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case actions.FETCH_AUDIO_VIDEO_CLIPPINGS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_AUDIO_VIDEO_CLIPPINGS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        audioVideoClippingList: action.audioVideoClippingList,
        actionType: actions.FETCH_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
      };
    case actions.FETCH_AUDIO_VIDEO_CLIPPINGS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_AUDIO_VIDEO_CLIPPINGS_ERROR,
      };

    case actions.ADD_AUDIO_VIDEO_CLIPPINGS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ADD_AUDIO_VIDEO_CLIPPINGS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Audio/Video clippings successfully added",
        actionType: actions.ADD_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
      });
    case actions.ADD_AUDIO_VIDEO_CLIPPINGS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ADD_AUDIO_VIDEO_CLIPPINGS_ERROR,
      });

    case actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Audio/Video clippings successfully updated",
        actionType: actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
      });
    case actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_ERROR,
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
