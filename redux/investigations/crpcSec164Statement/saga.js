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

export function* addCRPC164StatementDetails() {
  yield takeEvery("ADD_CRPC_164STATEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_CRPC_164STATEMENT_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_CRPC_164STATEMENT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_CRPC_164STATEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCRPC164StatementDetails() {
  yield takeEvery("UPDATE_CRPC_164STATEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_CRPC_164STATEMENT_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.UPDATE_CRPC_164STATEMENT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_CRPC_164STATEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCRPC164StatementList() {
  yield takeEvery("FETCH_CRPC_164STATEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CRPC_164STATEMENT_SUCCESS,
          crpc164StatementList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_CRPC_164STATEMENT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CRPC_164STATEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addCRPC164StatementDetails),
    fork(updateCRPC164StatementDetails),
    fork(getCRPC164StatementList),
  ]);
}
