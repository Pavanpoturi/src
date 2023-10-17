import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const createUpdateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* addAudioVideoClippingDetails() {
  yield takeEvery("ADD_AUDIO_VIDEO_CLIPPINGS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_AUDIO_VIDEO_CLIPPINGS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_AUDIO_VIDEO_CLIPPINGS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAudioVideoClippingDetails() {
  yield takeEvery(
    "UPDATE_AUDIO_VIDEO_CLIPPINGS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createUpdateAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_AUDIO_VIDEO_CLIPPINGS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getAudioVideoClippingList() {
  yield takeEvery(
    "FETCH_AUDIO_VIDEO_CLIPPINGS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_AUDIO_VIDEO_CLIPPINGS_SUCCESS,
            audioVideoClippingList: response,
          });
        } else {
          yield put({
            type: actions.FETCH_AUDIO_VIDEO_CLIPPINGS_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_AUDIO_VIDEO_CLIPPINGS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addAudioVideoClippingDetails),
    fork(updateAudioVideoClippingDetails),
    fork(getAudioVideoClippingList),
  ]);
}
