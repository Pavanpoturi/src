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

export function* addCCTVFootageDetails() {
  yield takeEvery("ADD_CCTV_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_CCTV_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CCTV_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CCTV_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCCTVFootageDetails() {
  yield takeEvery("UPDATE_CCTV_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_CCTV_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_CCTV_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_CCTV_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* sendRequisitionDetails() {
  yield takeEvery("SEND_REQUISITION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.SEND_REQUISITION_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.SEND_REQUISITION_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SEND_REQUISITION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadEnhancedDetails() {
  yield takeEvery("UPLOAD_ENHANCED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_ENHANCED_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_ENHANCED_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_ENHANCED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCCTVFootageList() {
  yield takeEvery("FETCH_CCTV_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CCTV_SUCCESS,
          cctvFootageList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_CCTV_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CCTV_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addCCTVFootageDetails),
    fork(updateCCTVFootageDetails),
    fork(sendRequisitionDetails),
    fork(uploadEnhancedDetails),
    fork(getCCTVFootageList),
  ]);
}
