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

export function* generateNewFIRDetails() {
  yield takeEvery("ADD_GENERATE_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        const successMessage = "Acts & Sections saved successfully.";
        yield put({
          type: actions.ADD_GENERATE_FIR_SUCCESS,
          savedFir: response?.data,
          message: successMessage,
        });
      } else {
        yield put({
          type: actions.ADD_GENERATE_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_GENERATE_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateFIR() {
  yield takeEvery("UPDATE_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPDATE_FIR_SUCCESS,
          response: response,
          message: response?.message,
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addActsSections() {
  yield takeEvery("ADD_ACTS_SECTIONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_ACTS_SECTIONS_SUCCESS,
          response: response,
          message: "Acts & Sections updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_ACTS_SECTIONS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ACTS_SECTIONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addOccurrenceOfOffence() {
  yield takeEvery("ADD_OCCURRENCE_OF_OFFENCE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_OCCURRENCE_OF_OFFENCE_SUCCESS,
          response: response,
          message: "Occurrence Of Offence updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_OCCURRENCE_OF_OFFENCE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_OCCURRENCE_OF_OFFENCE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addComplainant() {
  yield takeEvery("ADD_COMPLAINANT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_COMPLAINANT_SUCCESS,
          response: response,
          message: "Complainant Details updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_COMPLAINANT_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_COMPLAINANT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addBriefFacts() {
  yield takeEvery("ADD_BRIEF_FACTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_BRIEF_FACTS_SUCCESS,
          response: response,
          message: "Brief Facts updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_BRIEF_FACTS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_BRIEF_FACTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadDocumentDetails() {
  yield takeEvery("UPLOAD_DOCUMENTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_DOCUMENTS_SUCCESS,
          response: response,
          message: "Document Uploaded successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_DOCUMENTS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_DOCUMENTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* deleteDocumentDetails() {
  yield takeEvery("DELETE_DOCUMENTS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.DELETE_DOCUMENTS_SUCCESS,
          response: response,
          message: "Document Deleted successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.DELETE_DOCUMENTS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_DOCUMENTS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addPropertyDetails() {
  yield takeEvery("ADD_PROPERTY_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_PROPERTY_DETAILS_SUCCESS,
          response: response,
          message: "Property Details Updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_PROPERTY_DETAILS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_PROPERTY_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addAccusedDetails() {
  yield takeEvery("ADD_ACCUSED_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_ACCUSED_DETAILS_SUCCESS,
          response: response,
          message: "Accused Details Updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_ACCUSED_DETAILS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_ACCUSED_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addVictimDetails() {
  yield takeEvery("ADD_VICTIM_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.ADD_VICTIM_DETAILS_SUCCESS,
          response: response,
          message: "Victim Details Updated successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.ADD_VICTIM_DETAILS_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ADD_VICTIM_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* uploadFIR() {
  yield takeEvery("UPLOAD_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.UPLOAD_FIR_SUCCESS,
          response: response,
          message: "FIR Uploaded successfully",
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.UPLOAD_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPLOAD_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFIRData() {
  yield takeEvery("FETCH_GENERATE_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_GENERATE_FIR_SUCCESS,
          savedFir: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_GENERATE_FIR_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_GENERATE_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* deleteFIRData() {
  yield takeEvery("DELETE_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.DELETE_FIR_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.DELETE_FIR_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DELETE_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDefaultMajorHead() {
  yield takeEvery("FETCH_DEFAULT_MAJOR_HEAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_DEFAULT_MAJOR_HEAD_SUCCESS,
          majorHeadList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_DEFAULT_MAJOR_HEAD_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_DEFAULT_MAJOR_HEAD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFirMasterData() {
  yield takeEvery("FETCH_FIR_MASTER_DATA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_FIR_MASTER_DATA_SUCCESS,
          firMasterDataList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_FIR_MASTER_DATA_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_FIR_MASTER_DATA_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getGDNumbers() {
  yield takeEvery("FETCH_GD_NUMBER_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_GD_NUMBER_SUCCESS,
          gdNumberList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_GD_NUMBER_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_GD_NUMBER_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(generateNewFIRDetails),
    fork(getFIRData),
    fork(updateFIR),
    fork(addActsSections),
    fork(addOccurrenceOfOffence),
    fork(addComplainant),
    fork(addBriefFacts),
    fork(uploadDocumentDetails),
    fork(deleteDocumentDetails),
    fork(addPropertyDetails),
    fork(addAccusedDetails),
    fork(addVictimDetails),
    fork(deleteFIRData),
    fork(getDefaultMajorHead),
    fork(getFirMasterData),
    fork(getGDNumbers),
    fork(uploadFIR),
  ]);
}
