import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addEffortsForTracingDetails() {
  yield takeEvery("ADD_EFFORTS_FOR_TRACING_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_EFFORTS_FOR_TRACING_SUCCESS,
          response: response.data,
          message: response.message
        });
      } else {
        yield put({
          type: actions.ADD_EFFORTS_FOR_TRACING_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_EFFORTS_FOR_TRACING_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateEffortsForTracingDetails() {
  yield takeEvery(
    "UPDATE_EFFORTS_FOR_TRACING_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(patchAPICall, payload);
        if (response?.requestStatus) {
          yield put({
            type: actions.UPDATE_EFFORTS_FOR_TRACING_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_EFFORTS_FOR_TRACING_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_EFFORTS_FOR_TRACING_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getEffortsForTracingList() {
  yield takeEvery("FETCH_EFFORTS_FOR_TRACING_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_EFFORTS_FOR_TRACING_SUCCESS,
          effortsForTracingList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_EFFORTS_FOR_TRACING_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_EFFORTS_FOR_TRACING_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addEffortsForTracingDetails),
    fork(updateEffortsForTracingDetails),
    fork(getEffortsForTracingList),
  ]);
}
