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

export function* addNoticeToComplainantDetails() {
  yield takeEvery("ADD_NOTICE_TO_COMPLAINANT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_NOTICE_TO_COMPLAINANT_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_NOTICE_TO_COMPLAINANT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_NOTICE_TO_COMPLAINANT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateNoticeToComplainantDetails() {
  yield takeEvery(
    "UPDATE_NOTICE_TO_COMPLAINANT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_NOTICE_TO_COMPLAINANT_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_NOTICE_TO_COMPLAINANT_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_NOTICE_TO_COMPLAINANT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getNoticeToComplainantList() {
  yield takeEvery(
    "FETCH_NOTICE_TO_COMPLAINANT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_NOTICE_TO_COMPLAINANT_SUCCESS,
            noticeToComplainantList: response,
          });
        } else {
          yield put({
            type: actions.FETCH_NOTICE_TO_COMPLAINANT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_NOTICE_TO_COMPLAINANT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addNoticeToComplainantDetails),
    fork(updateNoticeToComplainantDetails),
    fork(getNoticeToComplainantList),
  ]);
}
