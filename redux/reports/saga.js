import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import { isEmpty } from "lodash";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

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

export function* fetchCisDetails() {
  yield takeEvery("GET_CIS_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.GET_CIS_DETAILS_SUCCESS,
          cisDetails: response,
        });
      } else {
        yield put({
          type: actions.GET_CIS_DETAILS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_CIS_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchPsDetails() {
  yield takeEvery("GET_PS_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.GET_PS_DETAILS_SUCCESS,
          psDetails: response,
        });
      } else {
        yield put({
          type: actions.GET_PS_DETAILS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_PS_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchReportedCases() {
  yield takeEvery("REPORTED_CASES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.REPORTED_CASES_SUCCESS,
          reportedCases: response,
        });
      } else {
        yield put({
          type: actions.REPORTED_CASES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.REPORTED_CASES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCasesStatus() {
  yield takeEvery("CASES_STATUS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.CASES_STATUS_SUCCESS,
          caseStatus: response,
        });
      } else {
        yield put({
          type: actions.CASES_STATUS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CASES_STATUS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchMissingCases() {
  yield takeEvery("MISSING_CASES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.MISSING_CASES_SUCCESS,
          missngCases: response,
        });
      } else {
        yield put({
          type: actions.MISSING_CASES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MISSING_CASES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchArrestCases() {
  yield takeEvery("ARREST_CASES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.ARREST_CASES_SUCCESS,
          arrests: response,
        });
      } else {
        yield put({
          type: actions.ARREST_CASES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ARREST_CASES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* downloadReports() {
  yield takeEvery("REPORTS_DOWNLOAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getBlobResponse, payload);
      if (response) {
        yield put({
          type: actions.REPORTS_DOWNLOAD_SUCCESS,
          reportDownload: response,
          fileName: payload.fileName,
        });
      } else {
        yield put({
          type: actions.REPORTS_DOWNLOAD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.REPORTS_DOWNLOAD_ERROR,
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

export function* fetchFSLReports() {
  yield takeEvery("FSL_REPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response && response?.status) {
        yield put({
          type: actions.FSL_REPORT_SUCCESS,
          FSLReports: response?.data?.data,
        });
      } else {
        yield put({
          type: actions.FSL_REPORT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FSL_REPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchTableauReports() {
  yield takeEvery("TABLEAU_REPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.TABLEAU_REPORT_SUCCESS,
          TABLEAUReport: response,
        });
      } else {
        yield put({
          type: actions.TABLEAU_REPORT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.TABLEAU_REPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(fetchCisDetails),
    fork(fetchPsDetails),
    fork(fetchReportedCases),
    fork(fetchCasesStatus),
    fork(fetchMissingCases),
    fork(fetchArrestCases),
    fork(downloadReports),
    fork(downloadPdfReports),
    fork(fetchFSLReports),
    fork(fetchTableauReports),
  ]);
}
