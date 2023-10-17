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

export function* addReassignmentOfCaseDetails() {
  yield takeEvery("ADD_REASSIGNMENT_OF_CASE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_REASSIGNMENT_OF_CASE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_REASSIGNMENT_OF_CASE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_REASSIGNMENT_OF_CASE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateReassignmentOfCaseDetails() {
  yield takeEvery(
    "UPDATE_REASSIGNMENT_OF_CASE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(patchAPICall, payload);
        if (response?.success) {
          yield put({
            type: actions.UPDATE_REASSIGNMENT_OF_CASE_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.UPDATE_REASSIGNMENT_OF_CASE_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_REASSIGNMENT_OF_CASE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getReassignmentOfCaseList() {
  yield takeEvery(
    "FETCH_REASSIGNMENT_OF_CASE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_REASSIGNMENT_OF_CASE_SUCCESS,
            reassignmentOfCaseList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_REASSIGNMENT_OF_CASE_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_REASSIGNMENT_OF_CASE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addReassignmentOfCaseDetails),
    fork(updateReassignmentOfCaseDetails),
    fork(getReassignmentOfCaseList),
  ]);
}
