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

export function* addProclamationAndPropertyAttachments() {
  yield takeEvery(
    "ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS,
            response: response.data,
            message: "Proclamation And Property Attachments Successfully Added",
          });
        } else {
          yield put({
            type: actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* updateProclamationAndPropertyAttachments() {
  yield takeEvery(
    "UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(putAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS,
            response: response.data,
          });
        } else {
          yield put({
            type: actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* getProclamationAndPropertyAttachmentsList() {
  yield takeEvery(
    "FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response?.status) {
          yield put({
            type: actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS,
            proclamationAndPropertyAttachmentsList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export default function* rootSaga() {
  yield all([
    fork(updateProclamationAndPropertyAttachments),
    fork(getProclamationAndPropertyAttachmentsList),
    fork(addProclamationAndPropertyAttachments),
  ]);
}
