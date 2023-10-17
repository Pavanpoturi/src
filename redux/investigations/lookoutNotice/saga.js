import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.patch(url, body);
};

export function* addLookoutNoticeDetails() {
  yield takeEvery("ADD_LOOKOUT_NOTICE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_LOOKOUT_NOTICE_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_LOOKOUT_NOTICE_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_LOOKOUT_NOTICE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateLookoutNoticeDetails() {
  yield takeEvery("UPDATE_LOOKOUT_NOTICE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_LOOKOUT_NOTICE_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_LOOKOUT_NOTICE_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_LOOKOUT_NOTICE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getLookoutNoticeList() {
  yield takeEvery("FETCH_LOOKOUT_NOTICE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.FETCH_LOOKOUT_NOTICE_SUCCESS,
          lookoutNoticeList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_LOOKOUT_NOTICE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_LOOKOUT_NOTICE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addLookoutNoticeDetails),
    fork(updateLookoutNoticeDetails),
    fork(getLookoutNoticeList),
  ]);
}
