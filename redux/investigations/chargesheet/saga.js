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

export function* addChargesheetDetails() {
  yield takeEvery("ADD_CHARGESHEET_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_CHARGESHEET_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CHARGESHEET_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CHARGESHEET_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMoSeizedForChargeSheet() {
  yield takeEvery("FETCH_MO_STOLEN_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_MO_STOLEN_SUCCESS,
          moStolenList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_MO_STOLEN_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_MO_STOLEN_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadChargesheet() {
  yield takeEvery("UPLOAD_CHARGESHEET_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(uploadCall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_CHARGESHEET_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_CHARGESHEET_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_CHARGESHEET_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getChargesheetList() {
  yield takeEvery("FETCH_CHARGESHEET_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CHARGESHEET_SUCCESS,
          chargesheetList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_CHARGESHEET_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CHARGESHEET_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addChargesheetDetails),
    fork(getChargesheetList),
    fork(uploadChargesheet),
    fork(getMoSeizedForChargeSheet),
  ]);
}
