import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import ApiSauce from "@services/apiSauce";
import { isEmpty } from "lodash";
import actions from "./actions";

const getCaseMetrics = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const getRecentEditList = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

export function* fetchDashboardDetails() {
  yield takeEvery("FETCH_DASHBOARD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getCaseMetrics, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_DASHBOARD_SUCCESS,
          dashboardDetails: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_DASHBOARD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_DASHBOARD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchRecentEditList() {
  yield takeEvery("FETCH_RECENTEDITLIST_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getRecentEditList, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_RECENTEDITLIST_SUCCESS,
          recentEditList: response.data,
        });
      } else {
        yield put({
          type: actions.FETCH_RECENTEDITLIST_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_RECENTEDITLIST_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCaseCountList() {
  yield takeEvery(
    "FETCH_DASHBOARD_CASE_COUNT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getRecentEditList, payload);
        if (response?.status) {
          yield put({
            type: actions.FETCH_DASHBOARD_CASE_COUNT_SUCCESS,
            caseCountList: response.data,
          });
        } else {
          yield put({
            type: actions.FETCH_DASHBOARD_CASE_COUNT_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_DASHBOARD_CASE_COUNT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(fetchDashboardDetails),
    fork(fetchRecentEditList),
    fork(fetchCaseCountList),
  ]);
}
