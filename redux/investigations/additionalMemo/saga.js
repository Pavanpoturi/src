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

export function* addAdditionalMemoDetails() {
  yield takeEvery("ADD_ADDITIONAL_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_ADDITIONAL_MEMO_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_ADDITIONAL_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ADDITIONAL_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAdditionalMemoDetails() {
  yield takeEvery("UPDATE_ADDITIONAL_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_ADDITIONAL_MEMO_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_ADDITIONAL_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_ADDITIONAL_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAdditionalMemoList() {
  yield takeEvery("FETCH_ADDITIONAL_MEMO_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.FETCH_ADDITIONAL_MEMO_SUCCESS,
          additionalMemoList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_ADDITIONAL_MEMO_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_ADDITIONAL_MEMO_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateAdditionalMemoDetails),
    fork(getAdditionalMemoList),
    fork(addAdditionalMemoDetails),
  ]);
}
