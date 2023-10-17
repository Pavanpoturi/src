import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const putAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

export function* addComplainantDetailsDetails() {
  yield takeEvery("ADD_COMPLAINANT_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(putAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_COMPLAINANT_DETAILS_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.ADD_COMPLAINANT_DETAILS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_COMPLAINANT_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateComplainantDetailsDetails() {
  yield takeEvery(
    "UPDATE_COMPLAINANT_DETAILS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        if (response?.success) {
          yield put({
            type: actions.UPDATE_COMPLAINANT_DETAILS_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.UPDATE_COMPLAINANT_DETAILS_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_COMPLAINANT_DETAILS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getComplainantDetailsList() {
  yield takeEvery("FETCH_COMPLAINANT_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_COMPLAINANT_DETAILS_SUCCESS,
          complainantDetailsList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_COMPLAINANT_DETAILS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_COMPLAINANT_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addComplainantDetailsDetails),
    fork(updateComplainantDetailsDetails),
    fork(getComplainantDetailsList),
  ]);
}
