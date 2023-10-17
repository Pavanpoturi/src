import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

export function* addAccusedDetails() {
  yield takeEvery("ADD_SUSPECT_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_SUSPECT_ACCUSED_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_SUSPECT_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_SUSPECT_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
};

export function* deletePersonDetails() {
  yield takeEvery("DELETE_PERSON_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.DELETE_PERSON_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.DELETE_PERSON_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_PERSON_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAccusedDetails() {
  yield takeEvery("UPDATE_SUSPECT_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_SUSPECT_ACCUSED_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.UPDATE_SUSPECT_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_SUSPECT_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAccusedList() {
  yield takeEvery("FETCH_SUSPECT_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_SUSPECT_ACCUSED_SUCCESS,
          suspectAccusedList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_SUSPECT_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_SUSPECT_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addAccusedDetails),
    fork(updateAccusedDetails),
    fork(getAccusedList),
    fork(deletePersonDetails)
  ]);
}
