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

export function* addAccusedDisposalForm() {
  yield takeEvery("ADD_ACCUSED_DISPOSAL_FORM_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_ACCUSED_DISPOSAL_FORM_SUCCESS,
          response: response.data,
          message: "Accused Disposal Form Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_ACCUSED_DISPOSAL_FORM_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ACCUSED_DISPOSAL_FORM_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAccusedDisposalForm() {
  yield takeEvery(
    "UPDATE_ACCUSED_DISPOSAL_FORM_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        console.log(
          "=======Accused Disposal Form response===========",
          response
        );
        if (response?.status) {
          yield put({
            type: actions.UPDATE_ACCUSED_DISPOSAL_FORM_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_ACCUSED_DISPOSAL_FORM_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_ACCUSED_DISPOSAL_FORM_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getAccusedDisposalFormList() {
  yield takeEvery(
    "FETCH_ACCUSED_DISPOSAL_FORM_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.FETCH_ACCUSED_DISPOSAL_FORM_SUCCESS,
            accusedDisposalFormList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_ACCUSED_DISPOSAL_FORM_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_ACCUSED_DISPOSAL_FORM_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(updateAccusedDisposalForm),
    fork(getAccusedDisposalFormList),
    fork(addAccusedDisposalForm),
  ]);
}
