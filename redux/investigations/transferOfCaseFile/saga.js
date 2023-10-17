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

export function* addTransferOfCaseFileDetails() {
  yield takeEvery("ADD_TRANSFER_OF_CASE_FILE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_TRANSFER_OF_CASE_FILE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_TRANSFER_OF_CASE_FILE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_TRANSFER_OF_CASE_FILE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* transferFIR() {
  yield takeEvery("TRANSFER_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.TRANSFER_FIR_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.TRANSFER_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.TRANSFER_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* forwardFIR() {
  yield takeEvery("FORWARD_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.FORWARD_FIR_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.FORWARD_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FORWARD_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateTransferOfCaseFileDetails() {
  yield takeEvery(
    "UPDATE_TRANSFER_OF_CASE_FILE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(patchAPICall, payload);
        if (response?.success) {
          yield put({
            type: actions.UPDATE_TRANSFER_OF_CASE_FILE_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.UPDATE_TRANSFER_OF_CASE_FILE_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_TRANSFER_OF_CASE_FILE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getTransferOfCaseFileList() {
  yield takeEvery(
    "FETCH_TRANSFER_OF_CASE_FILE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_TRANSFER_OF_CASE_FILE_SUCCESS,
            transferOfCaseFileList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_TRANSFER_OF_CASE_FILE_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_TRANSFER_OF_CASE_FILE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addTransferOfCaseFileDetails),
    fork(updateTransferOfCaseFileDetails),
    fork(getTransferOfCaseFileList),
    fork(transferFIR),
    fork(forwardFIR),
  ]);
}
