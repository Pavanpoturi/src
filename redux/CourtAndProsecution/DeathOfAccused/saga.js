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

export function* addDeathOfAccused() {
  yield takeEvery("ADD_DEATH_OF_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_DEATH_OF_ACCUSED_SUCCESS,
          response: response.data,
          message: "Death Of Accused Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_DEATH_OF_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_DEATH_OF_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateDeathOfAccused() {
  yield takeEvery("UPDATE_DEATH_OF_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(putAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_DEATH_OF_ACCUSED_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_DEATH_OF_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_DEATH_OF_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDeathOfAccusedList() {
  yield takeEvery("FETCH_DEATH_OF_ACCUSED_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_DEATH_OF_ACCUSED_SUCCESS,
          deathOfAccusedList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_DEATH_OF_ACCUSED_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_DEATH_OF_ACCUSED_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateDeathOfAccused),
    fork(getDeathOfAccusedList),
    fork(addDeathOfAccused),
  ]);
}
