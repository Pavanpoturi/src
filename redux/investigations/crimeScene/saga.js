import { all, takeEvery, put, call, fork } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const uploadCall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body, headers);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* uploadCDFSheet() {
  yield takeEvery("UPLOAD_CDF_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(uploadCall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_CDF_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_CDF_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_CDF_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getVehicleData() {
  yield takeEvery("FETCH_VEHICLE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status === true) {
        yield put({
          type: actions.FETCH_VEHICLE_SUCCESS,
          vehicleDetails: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_VEHICLE_ERROR,
          errorMessage: response.data.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_VEHICLE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([fork(uploadCDFSheet)]);
  yield all([fork(getVehicleData)]);
}
