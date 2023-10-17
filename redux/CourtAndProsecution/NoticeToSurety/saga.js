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

const putAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addNoticeToSurety() {
  yield takeEvery("ADD_NOTICE_TO_SURETY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_NOTICE_TO_SURETY_SUCCESS,
          response: response.data,
          message: "Notice to Surety Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_NOTICE_TO_SURETY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_NOTICE_TO_SURETY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateNoticeToSurety() {
  yield takeEvery("UPDATE_NOTICE_TO_SURETY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(putAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_NOTICE_TO_SURETY_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_NOTICE_TO_SURETY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_NOTICE_TO_SURETY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getNoticeToSuretyList() {
  yield takeEvery("FETCH_NOTICE_TO_SURETY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_NOTICE_TO_SURETY_SUCCESS,
          noticeToSuretyList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_NOTICE_TO_SURETY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_NOTICE_TO_SURETY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateNoticeToSurety),
    fork(getNoticeToSuretyList),
    fork(addNoticeToSurety),
  ]);
}
