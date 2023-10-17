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

const getData = (payload) => {
  return ApiSauce.get(payload.url);
};

export function* createAdvisoryMemo() {
  yield takeEvery("CREATE_ADVISORY_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.CREATE_ADVISORY_MEMO_SUCCESS,
          successMessage: response?.message,
        });
      } else {
        yield put({
          type: actions.CREATE_ADVISORY_MEMO_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CREATE_ADVISORY_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAdvisoryList() {
  yield takeEvery("GET_ADVISORY_LIST_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response?.status) {
        yield put({
          type: actions.GET_ADVISORY_LIST_SUCCESS,
          advisoryList: response?.data,
        });
      } else {
        yield put({
          type: actions.GET_ADVISORY_LIST_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_ADVISORY_LIST_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* sendComplianceUpdate() {
  yield takeEvery("SEND_COMPLIANCE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.SEND_COMPLIANCE_SUCCESS,
          successMessage: response?.message,
        });
      } else {
        yield put({
          type: actions.SEND_COMPLIANCE_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SEND_COMPLIANCE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* actionAdvisoryAck() {
  yield takeEvery("APPROVE_ADVISORY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      const message =
        payload?.body?.action === "Acknowledged"
          ? "Acknowledged Successfully"
          : "Request Returned with Remarks Successfully";
      if (response && response.status) {
        yield put({
          type: actions.APPROVE_ADVISORY_SUCCESS,
          response: response,
          successMessage: message,
        });
      } else {
        yield put({
          type: actions.APPROVE_ADVISORY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.APPROVE_ADVISORY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* getAdvisoryData() {
  yield takeEvery("GET_ADVISORYDATA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response?.status) {
        yield put({
          type: actions.GET_ADVISORYDATA_SUCCESS,
          advisoryList: response?.data,
        });
      } else {
        yield put({
          type: actions.GET_ADVISORYDATA_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_ADVISORYDATA_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* getNotificationTo() {
  yield takeEvery("GET_NOTIFICATIONTO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response?.status) {
        yield put({
          type: actions.GET_NOTIFICATIONTO_SUCCESS,
          getNotification: response?.data,
        });
      } else {
        yield put({
          type: actions.GET_NOTIFICATIONTO_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_NOTIFICATIONTO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCrimeAdvisory() {
  yield takeEvery("GET_CRIMEAADVISORY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response?.status) {
        yield put({
          type: actions.GET_CRIMEAADVISORY_SUCCESS,
          crimeAdvisory: response?.data,
        });
      } else {
        yield put({
          type: actions.GET_CRIMEAADVISORY_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_CRIMEAADVISORY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(sendComplianceUpdate),
    fork(getAdvisoryList),
    fork(actionAdvisoryAck),
    fork(createAdvisoryMemo),
    fork(getAdvisoryData),
    fork(getNotificationTo),
    fork(getCrimeAdvisory),
  ]);
}
