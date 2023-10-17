import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body, headers);
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addAlterationMemoDetails() {
  yield takeEvery("ADD_ALTERATION_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status === true) {
        yield put({
          type: actions.ADD_ALTERATION_MEMO_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_ALTERATION_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ALTERATION_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAlterationMemoDetails() {
  yield takeEvery("UPDATE_ALTERATION_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.status === true) {
        yield put({
          type: actions.UPDATE_ALTERATION_MEMO_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_ALTERATION_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_ALTERATION_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAlterationMemoList() {
  yield takeEvery("FETCH_ALTERATION_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.data) {
        yield put({
          type: actions.FETCH_ALTERATION_MEMO_SUCCESS,
          alterationMemoList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_ALTERATION_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_ALTERATION_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addAlterationMemoDetails),
    fork(updateAlterationMemoDetails),
    fork(getAlterationMemoList),
  ]);
}
