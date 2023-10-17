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

export function* addScientificEvidenceDetails() {
  yield takeEvery("ADD_SCIENTIFIC_EVIDENCE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_SCIENTIFIC_EVIDENCE_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_SCIENTIFIC_EVIDENCE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_SCIENTIFIC_EVIDENCE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateScientificEvidenceDetails() {
  yield takeEvery("UPDATE_SCIENTIFIC_EVIDENCE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createUpdateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_SCIENTIFIC_EVIDENCE_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_SCIENTIFIC_EVIDENCE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_SCIENTIFIC_EVIDENCE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getScientificEvidenceList() {
  yield takeEvery("FETCH_SCIENTIFIC_EVIDENCE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_SCIENTIFIC_EVIDENCE_SUCCESS,
          scientificEvidenceList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_SCIENTIFIC_EVIDENCE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_SCIENTIFIC_EVIDENCE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addScientificEvidenceDetails),
    fork(updateScientificEvidenceDetails),
    fork(getScientificEvidenceList),
  ]);
}
