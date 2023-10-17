import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addDeceasedDetails() {
  yield takeEvery("ADD_DECEASED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_DECEASED_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_DECEASED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_DECEASED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateDeceasedDetails() {
  yield takeEvery("UPDATE_DECEASED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_DECEASED_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_DECEASED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_DECEASED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDeceasedList() {
  yield takeEvery("FETCH_DECEASED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_DECEASED_SUCCESS,
          deceasedList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_DECEASED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_DECEASED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addNotice160Details() {
  yield takeEvery("ADD_NOTICE_160_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_NOTICE_160_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_NOTICE_160_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_NOTICE_160_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateNotice160Details() {
  yield takeEvery("UPDATE_NOTICE_160_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_NOTICE_160_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_NOTICE_160_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_NOTICE_160_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getNotice160List() {
  yield takeEvery("FETCH_NOTICE_160_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_NOTICE_160_SUCCESS,
          notice160List: response,
        });
      } else {
        yield put({
          type: actions.FETCH_NOTICE_160_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_NOTICE_160_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addDeceasedDetails),
    fork(updateDeceasedDetails),
    fork(getDeceasedList),
    fork(addNotice160Details),
    fork(updateNotice160Details),
    fork(getNotice160List)
  ]);
}
