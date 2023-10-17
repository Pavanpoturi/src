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

export function* addLokAdalatDisposal() {
  yield takeEvery("ADD_LOK_ADALAT_DISPOSAL_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_LOK_ADALAT_DISPOSAL_SUCCESS,
          response: response?.data,
          message: response?.message,
        });
      } else {
        yield put({
          type: actions.ADD_LOK_ADALAT_DISPOSAL_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_LOK_ADALAT_DISPOSAL_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateLokAdalatDisposal() {
  yield takeEvery(
    "UPDATE_LOK_ADALAT_DISPOSAL_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_LOK_ADALAT_DISPOSAL_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_LOK_ADALAT_DISPOSAL_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_LOK_ADALAT_DISPOSAL_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getLokAdalatDisposalList() {
  yield takeEvery("FETCH_LOK_ADALAT_DISPOSAL_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_LOK_ADALAT_DISPOSAL_SUCCESS,
          lokAdalatDisposalList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_LOK_ADALAT_DISPOSAL_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_LOK_ADALAT_DISPOSAL_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateLokAdalatDisposal),
    fork(getLokAdalatDisposalList),
    fork(addLokAdalatDisposal),
  ]);
}
