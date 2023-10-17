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

export function* addAppealOnJudgement() {
  yield takeEvery("ADD_APPEAL_ON_JUDGEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_APPEAL_ON_JUDGEMENT_SUCCESS,
          response: response.data,
          message: "Appeal On Judgement Successfully Added",
        });
      } else {
        yield put({
          type: actions.ADD_APPEAL_ON_JUDGEMENT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_APPEAL_ON_JUDGEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateAppealOnJudgement() {
  yield takeEvery(
    "UPDATE_APPEAL_ON_JUDGEMENT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_APPEAL_ON_JUDGEMENT_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_APPEAL_ON_JUDGEMENT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_APPEAL_ON_JUDGEMENT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getAppealOnJudgementList() {
  yield takeEvery("FETCH_APPEAL_ON_JUDGEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_APPEAL_ON_JUDGEMENT_SUCCESS,
          appealOnJudgementList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_APPEAL_ON_JUDGEMENT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_APPEAL_ON_JUDGEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(updateAppealOnJudgement),
    fork(getAppealOnJudgementList),
    fork(addAppealOnJudgement),
  ]);
}
