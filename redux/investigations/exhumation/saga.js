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

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.patch(url, body);
};

export function* addExhumationDetails() {
  yield takeEvery("ADD_EXHUMATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_EXHUMATION_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_EXHUMATION_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_EXHUMATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateExhumationDetails() {
  yield takeEvery("UPDATE_EXHUMATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_EXHUMATION_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.UPDATE_EXHUMATION_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_EXHUMATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getExhumationList() {
  yield takeEvery("FETCH_EXHUMATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_EXHUMATION_SUCCESS,
          exhumationList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_EXHUMATION_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_EXHUMATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addExhumationDetails),
    fork(updateExhumationDetails),
    fork(getExhumationList),
  ]);
}
