import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addPPOpinionDetails() {
  yield takeEvery("ADD_PPOPINION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_PPOPINION_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_PPOPINION_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_PPOPINION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updatePPOpinionDetails() {
  yield takeEvery("UPDATE_PPOPINION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_PPOPINION_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_PPOPINION_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_PPOPINION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getPPOpinionList() {
  yield takeEvery("FETCH_PPOPINION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_PPOPINION_SUCCESS,
          ppopinionList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PPOPINION_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_PPOPINION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addPPOpinionDetails),
    fork(updatePPOpinionDetails),
    fork(getPPOpinionList),
  ]);
}
