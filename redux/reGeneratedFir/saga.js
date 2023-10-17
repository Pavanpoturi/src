import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import { isEmpty } from "lodash";
import actions from "./actions";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const createAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.post(url, body, headers);
};

export function* fetchTransferOfCaseCase() {
  yield takeEvery(
    "FETCH_DASHBOARD_TRANSFER_OF_CASE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (!isEmpty(response)) {
          yield put({
            type: actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_SUCCESS,
            DashboardTransferCases: response?.data?.transferred,
            DashboardReceiveCases: response?.data?.received,
          });
        } else {
          yield put({
            type: actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_DASHBOARD_TRANSFER_OF_CASE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* postransferOfCaseCase() {
  yield takeEvery(
    "DASHBOARD_TRANSFER_OF_CASE_POST_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        const { url, body } = payload;
        if (!isEmpty(response)) {
          yield put({
            type: actions.DASHBOARD_TRANSFER_OF_CASE_POST_SUCCESS,
            successMessage:
              Object.keys(body).length !== 0
                ? response?.message
                : "FIR Re-Register SuccessFully Saved in the Draft FIR",
          });
        } else {
          yield put({
            type: actions.DASHBOARD_TRANSFER_OF_CASE_POST_ERROR,
            errorMessage: !!response?.message
              ? response?.message
              : response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.DASHBOARD_TRANSFER_OF_CASE_POST_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([fork(fetchTransferOfCaseCase), fork(postransferOfCaseCase)]);
}
