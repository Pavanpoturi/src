import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.patch(url, body);
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

export function* addform54Details() {
  yield takeEvery("ADD_FORM54_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ADD_FORM54_SUCCESS,
          response: response?.data?.form54Details,
          firNum: payload?.firNum,
        });
      } else {
        yield put({
          type: actions.ADD_FORM54_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_FORM54_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateform54Details() {
  yield takeEvery("UPDATE_FORM54_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.UPDATE_FORM54_SUCCESS,
          response: response?.data,
          firNum: payload?.firNum,
        });
      } else {
        yield put({
          type: actions.UPDATE_FORM54_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_FORM54_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getform54List() {
  yield takeEvery("FETCH_FORM54_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_FORM54_SUCCESS,
          form54List: response?.data?.form54Details,
        });
      } else {
        yield put({
          type: actions.FETCH_FORM54_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_FORM54_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAccidentInformationReport() {
  yield takeEvery(
    "FETCH_ACCIDENT_INFORMATION_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_ACCIDENT_INFORMATION_SUCCESS,
            accidentInformationReport:
              response?.data?.accidentInformationReport,
          });
        } else {
          yield put({
            type: actions.FETCH_ACCIDENT_INFORMATION_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_ACCIDENT_INFORMATION_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addform54Details),
    fork(updateform54Details),
    fork(getform54List),
    fork(getAccidentInformationReport),
  ]);
}
