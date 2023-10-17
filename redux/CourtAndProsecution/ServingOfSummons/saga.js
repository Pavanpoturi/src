import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./action";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};
const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};
const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* getservingOfSummonsData() {
  yield takeEvery("FETCH_SERVING_OF_SUMMONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status === true) {
        yield put({
          type: actions.FETCH_SERVING_OF_SUMMONS_SUCCESS,
          savedData: response?.data,
          successMessage: response.message,
        });
      } else {
        yield put({
          type: actions.FETCH_SERVING_OF_SUMMONS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_SERVING_OF_SUMMONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addservingOfSummonsDetails() {
  yield takeEvery("ADD_SERVING_OF_SUMMONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_SERVING_OF_SUMMONS_SUCCESS,
          message: "Serving of Summons Details Added successfully",
          savedData: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_SERVING_OF_SUMMONS_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_SERVING_OF_SUMMONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateservingOfSummonsDetails() {
  yield takeEvery("UPDATE_SERVING_OF_SUMMONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_SERVING_OF_SUMMONS_SUCCESS,
          response: response,
          message: "Serving of Summons Details Updated successfully",
          savedData: response?.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_SERVING_OF_SUMMONS_ERROR,
          errorMessage: response?.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_SERVING_OF_SUMMONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getservingOfSummonsData),
    fork(addservingOfSummonsDetails),
    fork(updateservingOfSummonsDetails),
  ]);
}
