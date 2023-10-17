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

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* addInterrogationReportDetails() {
  yield takeEvery("ADD_INTERROGATION_REPORT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.ADD_INTERROGATION_REPORT_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_INTERROGATION_REPORT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_INTERROGATION_REPORT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateInterrogationReportDetails() {
  yield takeEvery(
    "UPDATE_INTERROGATION_REPORT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_INTERROGATION_REPORT_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_INTERROGATION_REPORT_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_INTERROGATION_REPORT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getInterrogationReportList() {
  yield takeEvery(
    "FETCH_INTERROGATION_REPORT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_INTERROGATION_REPORT_SUCCESS,
            interrogationReportList: response,
          });
        } else {
          yield put({
            type: actions.FETCH_INTERROGATION_REPORT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_INTERROGATION_REPORT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* deleteInterrogationReport() {
  yield takeEvery("DELETE_REPORTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.DELETE_REPORTS_SUCCESS,
          response: response,
          message: "Interrogation Report Deleted successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.DELETE_REPORTS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_REPORTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updatePersonMedia() {
  yield takeEvery("UPDATE_PERSON_MEDIA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.UPDATE_PERSON_MEDIA_SUCCESS,
          personMedia: response?.data,
          successMessage: "File Uploaded Successfully",
        });
      } else {
        yield put({
          type: actions.UPDATE_PERSON_MEDIA_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_PERSON_MEDIA_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addInterrogationReportDetails),
    fork(updateInterrogationReportDetails),
    fork(getInterrogationReportList),
    fork(deleteInterrogationReport),
    fork(updatePersonMedia),
  ]);
}
