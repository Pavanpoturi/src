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

export function* addProsecutionPermissionDetails() {
  yield takeEvery(
    "ADD_PROSECUTION_PERMISSION_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response?.success) {
          yield put({
            type: actions.ADD_PROSECUTION_PERMISSION_SUCCESS,
            response: response,
            successMessage: "Superior Officers Permission Successfully Added",
          });
        } else {
          yield put({
            type: actions.ADD_PROSECUTION_PERMISSION_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.ADD_PROSECUTION_PERMISSION_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* updateProsecutionPermissionDetails() {
  yield takeEvery(
    "UPDATE_PROSECUTION_PERMISSION_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(patchAPICall, payload);
        if (response?.success) {
          yield put({
            type: actions.UPDATE_PROSECUTION_PERMISSION_SUCCESS,
            response: response,
            successMessage: "Superior Officers Permission Successfully Updated",
          });
        } else {
          yield put({
            type: actions.UPDATE_PROSECUTION_PERMISSION_ERROR,
            errorMessage: response?.data?.error?.description,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_PROSECUTION_PERMISSION_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getProsecutionPermissionList() {
  yield takeEvery(
    "FETCH_PROSECUTION_PERMISSION_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_PROSECUTION_PERMISSION_SUCCESS,
            prosecutionPermissionList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_PROSECUTION_PERMISSION_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_PROSECUTION_PERMISSION_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(addProsecutionPermissionDetails),
    fork(updateProsecutionPermissionDetails),
    fork(getProsecutionPermissionList),
  ]);
}
