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

export function* addIssueOfWarrants() {
  yield takeEvery("ADD_ISSUE_OF_WARRANTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_ISSUE_OF_WARRANTS_SUCCESS,
          response: response.data,
          message: "Issue Of Warrants Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_ISSUE_OF_WARRANTS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ISSUE_OF_WARRANTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateIssueOfWarrants() {
  yield takeEvery("UPDATE_ISSUE_OF_WARRANTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(putAPICall, payload);
      console.log("======= Saga Response===========", response);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_ISSUE_OF_WARRANTS_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_ISSUE_OF_WARRANTS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_ISSUE_OF_WARRANTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getIssueOfWarrantsList() {
  yield takeEvery("FETCH_ISSUE_OF_WARRANTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_ISSUE_OF_WARRANTS_SUCCESS,
          issueOfWarrantsList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_ISSUE_OF_WARRANTS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_ISSUE_OF_WARRANTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateIssueOfWarrants),
    fork(getIssueOfWarrantsList),
    fork(addIssueOfWarrants),
  ]);
}
