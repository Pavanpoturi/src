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

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* addUpdateChargeSheetStatusDetails() {
  yield takeEvery("ADD_CHARGE_SHEET_STATUS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_CHARGE_SHEET_STATUS_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CHARGE_SHEET_STATUS_ERROR,
          errorMessage: response.data.error.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CHARGE_SHEET_STATUS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getUpdateChargeSheetStatusList() {
  yield takeEvery("FETCH_CHARGE_SHEET_STATUS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CHARGE_SHEET_STATUS_SUCCESS,
          chargesheetStatus: response,
        });
      } else {
        yield put({
          type: actions.FETCH_CHARGE_SHEET_STATUS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CHARGE_SHEET_STATUS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addUpdateChargeSheetStatusDetails),
    fork(getUpdateChargeSheetStatusList),
  ]);
}
