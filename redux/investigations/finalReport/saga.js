import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body, headers);
};

const uploadCall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* addFinalReportDetails() {
  yield takeEvery("ADD_FINALREPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_FINALREPORT_SUCCESS,
          response: response.data,
          message: response?.message
        });
      } else {
        yield put({
          type: actions.ADD_FINALREPORT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_FINALREPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* finalReportUpload() {
  yield takeEvery("UPLOAD_FINALREPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(uploadCall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_FINALREPORT_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_FINALREPORT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_FINALREPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFinalReportList() {
  yield takeEvery("FETCH_FINALREPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_FINALREPORT_SUCCESS,
          finalReportList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_FINALREPORT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_FINALREPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addFinalReportDetails),
    fork(getFinalReportList),
    fork(finalReportUpload),
  ]);
}
