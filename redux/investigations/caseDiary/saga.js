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

export function* createCaseDiary() {
  yield takeEvery("ADD_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_CASE_DIARY_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CASE_DIARY_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCaseDiary() {
  yield takeEvery("UPDATE_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_CASE_DIARY_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_CASE_DIARY_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* generateCaseDiary() {
  yield takeEvery("GENERATE_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.GENERATE_CASE_DIARY_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.GENERATE_CASE_DIARY_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GENERATE_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadCaseDiary() {
  yield takeEvery("UPLOAD_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPLOAD_CASE_DIARY_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_CASE_DIARY_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCaseDiary() {
  yield takeEvery("FETCH_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.FETCH_CASE_DIARY_SUCCESS,
          caseDiaryList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_CASE_DIARY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* deleteCaseDiary() {
  yield takeEvery("DELETE_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.DELETE_CASE_DIARY_SUCCESS,
          caseDiaryList: response.data,
        });
      } else {
        yield put({
          type: actions.DELETE_CASE_DIARY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(createCaseDiary),
    fork(updateCaseDiary),
    fork(getCaseDiary),
    fork(generateCaseDiary),
    fork(uploadCaseDiary),
    fork(deleteCaseDiary),
  ]);
}
