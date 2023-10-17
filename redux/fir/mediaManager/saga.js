import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, {});
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* uploadMedia() {
  yield takeEvery("UPLOAD_MEDIA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPLOAD_MEDIA_SUCCESS,
          mediaList: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_MEDIA_ERROR,
          uploadErrorMessage: JSON.parse(response.data.error.description)?.error
            .errorKey,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_MEDIA_ERROR,
        uploadErrorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadTemplates() {
  yield takeEvery("UPLOAD_TEMPLATES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPLOAD_TEMPLATES_SUCCESS,
          templateList: response,
        });
      } else {
        yield put({
          type: actions.UPLOAD_TEMPLATES_ERROR,
          uploadErrorMessage: JSON.parse(response.data.error.description)?.error
            .errorKey,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_TEMPLATES_ERROR,
        uploadErrorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMediaList() {
  yield takeEvery("FETCH_MEDIA_REQUEST", function* ({ payload }) {
    try {
      const payloadData = { url: payload.url };
      const response = yield call(getAPICall, payloadData);
      if (response?.success) {
        if (payload.body.isTemplateLogo) {
          yield localStorage.setItem(
            "templatesLogo",
            JSON.stringify(response?.data?.url)
          );
        } else {
          localStorage.removeItem("templatesLogo");
        }
        yield put({
          type: actions.FETCH_MEDIA_SUCCESS,
          mediaList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_MEDIA_ERROR,
          uploadErrorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_MEDIA_ERROR,
        uploadErrorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([fork(uploadMedia), fork(getMediaList), fork(uploadTemplates)]);
}
