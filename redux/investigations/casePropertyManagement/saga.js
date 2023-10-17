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

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.patch(url, body);
};

export function* addCasePropertyManagementDetails() {
  yield takeEvery(
    "ADD_CASE_PROPERTY_MANAGEMENT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response && response.status) {
          const crimeId = payload.body.crimeId;
          const isSendToFSL = payload.body.status === "Send To FSL";
          const casePropertyId = response?.data?._id;
          if (isSendToFSL) {
            const payLoad = {
              crimeId: crimeId,
              casePropertyId: casePropertyId,
            };
            yield put({
              type: actions.ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS,
              addAckPayload: payLoad,
              response: response,
            });
          } else {
            yield put({
              type: actions.ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS,
              response: response,
            });
          }
        } else {
          yield put({
            type: actions.ADD_CASE_PROPERTY_MANAGEMENT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.ADD_CASE_PROPERTY_MANAGEMENT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* addAckFSL() {
  yield takeEvery("ADD_ACK_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response && response.status) {
        yield put({
          type: actions.ADD_ACK_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ADD_ACK_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ACK_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCasePropertyManagementDetails() {
  yield takeEvery(
    "UPDATE_CASE_PROPERTY_MANAGEMENT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(patchAPICall, payload);
        if (response && response.status) {
          yield put({
            type: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getCasePropertyManagementList() {
  yield takeEvery(
    "FETCH_CASE_PROPERTY_MANAGEMENT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_CASE_PROPERTY_MANAGEMENT_SUCCESS,
            casePropertyManagementList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_CASE_PROPERTY_MANAGEMENT_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_CASE_PROPERTY_MANAGEMENT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getCasePropertyHistoryList() {
  yield takeEvery(
    "FETCH_CASE_PROPERTY_HISTORY_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);

        if (response.status) {
          yield put({
            type: actions.FETCH_CASE_PROPERTY_HISTORY_SUCCESS,
            casePropertyHistoryList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_CASE_PROPERTY_HISTORY_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_CASE_PROPERTY_HISTORY_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* actionAckFSL() {
  yield takeEvery("APPROVE_ACK_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response && response.status) {
        yield put({
          type: actions.APPROVE_ACK_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.APPROVE_ACK_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.APPROVE_ACK_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(addCasePropertyManagementDetails),
    fork(updateCasePropertyManagementDetails),
    fork(getCasePropertyManagementList),
    fork(getCasePropertyHistoryList),
    fork(actionAckFSL),
    fork(addAckFSL),
  ]);
}
