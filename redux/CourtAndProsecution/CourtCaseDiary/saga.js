import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./action";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};
const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};
const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* getCourtCaseDiary() {
  yield takeEvery("FETCH_COURT_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_COURT_CASE_DIARY_SUCCESS,
          courtCaseDiaryList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_COURT_CASE_DIARY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_COURT_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCaseDiaryById() {
  yield takeEvery("FETCH_CASE_DIARY_ID_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_CASE_DIARY_ID_SUCCESS,
          caseDiaryData: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_CASE_DIARY_ID_ERROR,
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

export function* createCourtCaseDiary() {
  yield takeEvery("ADD_COURT_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_COURT_CASE_DIARY_SUCCESS,
          savedData: response?.data,
          message: "Court And Prosecution Added SuccessFully",
        });
      } else {
        yield put({
          type: actions.ADD_COURT_CASE_DIARY_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_COURT_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCourtCaseDiary() {
  yield takeEvery("UPDATE_COURT_CASE_DIARY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_COURT_CASE_DIARY_SUCCESS,
          response: response,
          savedData: response?.data,
          message: "Court And Prosecution Updated SuccessFully",
        });
      } else {
        yield put({
          type: actions.UPDATE_COURT_CASE_DIARY_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_COURT_CASE_DIARY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getCourtCaseDiary),
    fork(createCourtCaseDiary),
    fork(updateCourtCaseDiary),
    fork(getCaseDiaryById),
  ]);
}
