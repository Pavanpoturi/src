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

export function* addStolenPropertyDetails() {
  yield takeEvery("ADD_STOLEN_PROPERTY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_STOLEN_PROPERTY_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_STOLEN_PROPERTY_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_STOLEN_PROPERTY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* deleteStolenPropertyDetails() {
  yield takeEvery("DELETE_STOLEN_PROPERTY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.DELETE_STOLEN_PROPERTY_SUCCESS,
          response: response?.message,
        });
      } else {
        yield put({
          type: actions.DELETE_STOLEN_PROPERTY_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_STOLEN_PROPERTY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateStolenPropertyDetails() {
  yield takeEvery("UPDATE_STOLEN_PROPERTY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_STOLEN_PROPERTY_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.UPDATE_STOLEN_PROPERTY_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_STOLEN_PROPERTY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getStolenPropertyList() {
  yield takeEvery("FETCH_STOLEN_PROPERTY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_STOLEN_PROPERTY_SUCCESS,
          stolenPropertyList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_STOLEN_PROPERTY_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_STOLEN_PROPERTY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addStolenPropertyDetails),
    fork(updateStolenPropertyDetails),
    fork(getStolenPropertyList),
    fork(deleteStolenPropertyDetails)
  ]);
}
