import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import actions from "./actions";

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* getRequisitionsList() {
  yield takeEvery("FETCH_REQUISITIONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.FETCH_REQUISITIONS_SUCCESS,
          requisitionsList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_REQUISITIONS_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_REQUISITIONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getRequisitionsList)]);
}
