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

export function* addCDRDetails() {
  yield takeEvery("ADD_CDR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_CDR_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CDR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CDR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCDRDetails() {
  yield takeEvery("UPDATE_CDR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_CDR_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_CDR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_CDR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* requestCDRDetails() {
  yield takeEvery("REQUEST_CDR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.REQUEST_CDR_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.REQUEST_CDR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.REQUEST_CDR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadCDRRequestDetails() {
  yield takeEvery("UPLOAD_CDR_RESULT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_CDR_RESULT_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_CDR_RESULT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_CDR_RESULT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCDRList() {
  yield takeEvery("FETCH_CDR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CDR_SUCCESS,
          cdrList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_CDR_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CDR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addCDRDetails),
    fork(updateCDRDetails),
    fork(getCDRList),
    fork(requestCDRDetails),
    fork(uploadCDRRequestDetails),
  ]);
}
