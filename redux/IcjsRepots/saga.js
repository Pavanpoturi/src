import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import { isEmpty } from "lodash";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

const getBlobResponse = (payload) => {
  const { url } = payload;
  return ApiSauce.getResponseAsArrayBuffer(url);
};

export function* fetchReportedChargeSheet() {
  yield takeEvery("REPORTED_CHARGESHEET_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.REPORTED_CHARGESHEET_SUCCESS,
          reportedChargeSheet: response.counts,
        });
      } else {
        yield put({
          type: actions.REPORTED_CHARGESHEET_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.REPORTED_CHARGESHEET_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCasesChargeSheet() {
  yield takeEvery("CHARGESHEET_STATUS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.CHARGESHEET_STATUS_SUCCESS,
          chargeSheetStatus: response.data,
        });
      } else {
        yield put({
          type: actions.CHARGESHEET_STATUS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CHARGESHEET_STATUS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* downloadReports() {
  yield takeEvery("ICJS_REPORTS_DOWNLOAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getBlobResponse, payload);
      if (response) {
        yield put({
          type: actions.ICJS_REPORTS_DOWNLOAD_SUCCESS,
          reportDownload: response,
          fileName: payload.fileName,
        });
      } else {
        yield put({
          type: actions.ICJS_REPORTS_DOWNLOAD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ICJS_REPORTS_DOWNLOAD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* downloadPdfReports() {
  yield takeEvery("PDF_REPORTS_DOWNLOAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getBlobResponse, payload);
      if (response) {
        yield put({
          type: actions.PDF_REPORTS_DOWNLOAD_SUCCESS,
          reportDownload: response,
        });
      } else {
        yield put({
          type: actions.PDF_REPORTS_DOWNLOAD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PDF_REPORTS_DOWNLOAD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchReportedChargeSheet),
    fork(fetchCasesChargeSheet),
    fork(downloadReports),
    fork(downloadPdfReports),
  ]);
}
