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

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const putAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addCourtDisposalForm() {
  yield takeEvery("ADD_COURT_DISPOSAL_FORM_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_COURT_DISPOSAL_FORM_SUCCESS,
          response: response.data,
          message: "Court Disposal Form Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_COURT_DISPOSAL_FORM_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_COURT_DISPOSAL_FORM_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCourtDisposalForm() {
  yield takeEvery(
    "UPDATE_COURT_DISPOSAL_FORM_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_COURT_DISPOSAL_FORM_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_COURT_DISPOSAL_FORM_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_COURT_DISPOSAL_FORM_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getCourtDisposalFormList() {
  yield takeEvery("FETCH_COURT_DISPOSAL_FORM_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_COURT_DISPOSAL_FORM_SUCCESS,
          courtDisposalFormList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_COURT_DISPOSAL_FORM_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_COURT_DISPOSAL_FORM_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateCourtDisposalForm),
    fork(getCourtDisposalFormList),
    fork(addCourtDisposalForm),
  ]);
}
