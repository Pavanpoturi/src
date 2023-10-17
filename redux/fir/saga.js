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

const getAPICall = (payload) => {
  const { url } = payload;
  return ApiSauce.get(url);
};

const updateAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.put(url, body);
};

const patchAPICall = (payload) => {
  const { url, body } = payload;
  return ApiSauce.patch(url, body);
};

export function* updatePrecrimeCase() {
  yield takeEvery("PRECRIMECASE_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.PRECRIMECASE_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.PRECRIMECASE_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PRECRIMECASE_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateCrimeLocation() {
  yield takeEvery("CRIMELOCATION_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.CRIMELOCATION_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.CRIMELOCATION_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CRIMELOCATION_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* createCrimeLocation() {
  yield takeEvery("CRIMELOCATION_CREATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.CRIMELOCATION_CREATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.CRIMELOCATION_CREATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CRIMELOCATION_CREATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addUpdateCrimeClassification() {
  yield takeEvery(
    "CRIMECLASSIFICATION_UPDATE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(updateAPICall, payload);
        if (response.status) {
          yield put({
            type: actions.CRIMECLASSIFICATION_UPDATE_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.CRIMECLASSIFICATION_UPDATE_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.CRIMECLASSIFICATION_UPDATE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* updateCasePropertyManagement() {
  yield takeEvery(
    "CASEPROPERTYMANAGEMENT_UPDATE_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(updateAPICall, payload);
        if (response.status) {
          yield put({
            type: actions.CASEPROPERTYMANAGEMENT_UPDATE_SUCCESS,
            response: response,
          });
        } else {
          yield put({
            type: actions.CASEPROPERTYMANAGEMENT_UPDATE_ERROR,
            errorMessage: response.message,
          });
        }
      } catch (error) {
        yield put({
          type: actions.CASEPROPERTYMANAGEMENT_UPDATE_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* updatePunchWitness() {
  yield takeEvery("PANCHWITNESS_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.PANCHWITNESS_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.PANCHWITNESS_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PANCHWITNESS_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* editPunchWitness() {
  yield takeEvery("PANCHWITNESS_EDIT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.PANCHWITNESS_EDIT_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.PANCHWITNESS_EDIT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PANCHWITNESS_EDIT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateWitnessStatement() {
  yield takeEvery("WITNESS_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.WITNESS_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updatePersonMediaDetails() {
  yield takeEvery("PERSON_MEDIA_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.PERSON_MEDIA_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.PERSON_MEDIA_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PERSON_MEDIA_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateRoughSketch() {
  yield takeEvery("ROUGHSKETCH_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.ROUGHSKETCH_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ROUGHSKETCH_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ROUGHSKETCH_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* editWitnessStatement() {
  yield takeEvery("WITNESS_EDIT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.WITNESS_EDIT_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_EDIT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_EDIT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* createMaterialObject() {
  yield takeEvery("MATERIALOBJECT_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.MATERIALOBJECT_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.MATERIALOBJECT_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MATERIALOBJECT_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* editMaterialObject() {
  yield takeEvery("MATERIALOBJECT_EDIT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.MATERIALOBJECT_EDIT_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.MATERIALOBJECT_EDIT_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MATERIALOBJECT_EDIT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* addExpertTeam() {
  yield takeEvery("EXPERTTEAM_ADD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.EXPERTTEAM_ADD_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.EXPERTTEAM_ADD_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EXPERTTEAM_ADD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateExpertTeam() {
  yield takeEvery("EXPERTTEAM_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response.status) {
        yield put({
          type: actions.EXPERTTEAM_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.EXPERTTEAM_UPDATE_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EXPERTTEAM_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchFIRList() {
  yield takeEvery("FETCH_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_FIR_SUCCESS,
          firList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_FIR_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* fetchHigherFIRList() {
  yield takeEvery("FETCH_HIGHERFIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_HIGHERFIR_SUCCESS,
          firList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_HIGHERFIR_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_FIR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* fetchCaseMetrics() {
  yield takeEvery(actions.FETCH_CASE_METRICS_REQUEST, function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_CASE_METRICS_SUCCESS,
          caseMetrics: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_CASE_METRICS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CASE_METRICS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchRecentFIRNumList() {
  yield takeEvery("FETCH_RECENTFIRNUM_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_RECENTFIRNUM_SUCCESS,
          recentFirNumList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_RECENTFIRNUM_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_RECENTFIRNUM_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchExpertTeamList() {
  yield takeEvery("FETCH_EXPERTTEAM_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_EXPERTTEAM_SUCCESS,
          expertTeamList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_EXPERTTEAM_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_EXPERTTEAM_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchRoughSketchList() {
  yield takeEvery("FETCH_ROUGHSKETCH_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_ROUGHSKETCH_SUCCESS,
          roughSketchList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_ROUGHSKETCH_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_ROUGHSKETCH_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCrimeLocation() {
  yield takeEvery("FETCH_CRIMELOCATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CRIMELOCATION_SUCCESS,
          crimeLocation: response,
        });
      } else {
        yield put({
          type: actions.FETCH_CRIMELOCATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CRIMELOCATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCrimeClassification() {
  yield takeEvery("FETCH_CRIMECLASSIFICATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_CRIMECLASSIFICATION_SUCCESS,
          crimeclassification: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_CRIMECLASSIFICATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_CRIMECLASSIFICATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCrimeClassification() {
  yield takeEvery("GET_CRIMECLASSIFICATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.GET_CRIMECLASSIFICATION_SUCCESS,
          crimeclassification_: response?.data,
        });
      } else {
        yield put({
          type: actions.GET_CRIMECLASSIFICATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_CRIMECLASSIFICATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCasePropertyManagement() {
  yield takeEvery(
    "FETCH_CASEPROPERTYMANAGEMENT_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (!isEmpty(response)) {
          yield put({
            type: actions.FETCH_CASEPROPERTYMANAGEMENT_SUCCESS,
            casepropertymanagement: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_CASEPROPERTYMANAGEMENT_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_CASEPROPERTYMANAGEMENT_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* fetchMaterialObjectList() {
  yield takeEvery("FETCH_MATERIALOBJECT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_MATERIALOBJECT_SUCCESS,
          materialObjectList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_MATERIALOBJECT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_MATERIALOBJECT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchWitnessDetailsList() {
  yield takeEvery("FETCH_WITNESSSTATEMENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_WITNESSSTATEMENT_SUCCESS,
          witnessStatementList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_WITNESSSTATEMENT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_WITNESSSTATEMENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchWitnessStatementsList() {
  yield takeEvery(
    "FETCH_WITNESSSTATEMENT_NEW_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_WITNESSSTATEMENT_NEW_SUCCESS,
            witnessStatementListNew: response.data,
          });
        } else {
          yield put({
            type: actions.FETCH_WITNESSSTATEMENT_NEW_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_WITNESSSTATEMENT_NEW_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* fetchPanchWitnessList() {
  yield takeEvery("FETCH_PANCHWITNESS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_PANCHWITNESS_SUCCESS,
          panchWitnessList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PANCHWITNESS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_PANCHWITNESS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchPreCrimeCase() {
  yield takeEvery("FETCH_PRECRIMECASE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_PRECRIMECASE_SUCCESS,
          precrimescene: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PRECRIMECASE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_PRECRIMECASE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchPreCrimeHistory() {
  yield takeEvery("FETCH_PRECRIMEHISTORY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_PRECRIMEHISTORY_SUCCESS,
          precrimescene: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PRECRIMEHISTORY_ERROR,
          errorMessage: "response?.errorMessage",
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_PRECRIMEHISTORY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchHistoryOptions() {
  yield takeEvery("FETCH_HISTORYOPTIONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        response.data?.push("Now");
        yield put({
          type: actions.FETCH_HISTORYOPTIONS_SUCCESS,
          historyOptions: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PRECRIMEHISTORY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_HISTORYOPTIONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchArrest() {
  yield takeEvery("FETCH_ARREST_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_ARREST_SUCCESS,
          arrestList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_ARREST_ERROR,
          errorMessage: response?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_ARREST_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateArrest() {
  yield takeEvery("ARREST_UPDATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(patchAPICall, payload);
      if (response.success) {
        yield put({
          type: actions.ARREST_UPDATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ARREST_UPDATE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ARREST_UPDATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* createArrest() {
  yield takeEvery("ARREST_CREATE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.success) {
        yield put({
          type: actions.ARREST_CREATE_SUCCESS,
          response: response,
        });
      } else {
        yield put({
          type: actions.ARREST_CREATE_ERROR,
          errorMessage: response?.data?.error?.description,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ARREST_CREATE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* updateWitnessOrder() {
  yield takeEvery("UPDATE_WITNESS_ORDER_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(updateAPICall, payload);
      if (response?.status) {
        localStorage.removeItem("selectedWitness");
        yield put({
          type: actions.UPDATE_WITNESS_ORDER_SUCCESS,
          response: response.data,
        });
      } else {
        yield put({
          type: actions.UPDATE_WITNESS_ORDER_ERROR,
          errorMessage: response.message,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UPDATE_WITNESS_ORDER_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchComplainantList() {
  yield takeEvery("GET_COMPLAINANT_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      localStorage.removeItem("complainantList");
      yield localStorage.setItem("complainantList", JSON.stringify(response));
      if (!isEmpty(response)) {
        yield put({
          type: actions.GET_COMPLAINANT_DETAILS_SUCCESS,
          complainantList: response,
        });
      } else {
        yield put({
          type: actions.GET_COMPLAINANT_DETAILS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_COMPLAINANT_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchCrimeScenePhotographsList() {
  yield takeEvery(
    "FETCH_CRIME_SCENE_PHOTOGRAPHS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (response) {
          yield put({
            type: actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_SUCCESS,
            crimeScenePhotographsList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* updateCrimeScenePhotographsList() {
  yield takeEvery(
    "UPDATE_CRIME_SCENE_PHOTOGRAPHS_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(createAPICall, payload);
        if (response) {
          yield put({
            type: actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_SUCCESS,
            crimeScenePhotographsList: response,
          });
        } else {
          yield put({
            type: actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* fetchProfessionalList() {
  yield takeEvery("FETCH_PROFESSIONALLIST_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (response) {
        yield put({
          type: actions.FETCH_PROFESSIONALLIST_SUCCESS,
          professionalList: response,
        });
      } else {
        yield put({
          type: actions.FETCH_PROFESSIONALLIST_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_PROFESSIONALLIST_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchTransferredZeroFIRHistory() {
  yield takeEvery(
    "FETCH_TRANSFERRED_ZERO_FIR_HISTORY_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (!isEmpty(response)) {
          yield put({
            type: actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_SUCCESS,
            transferredZeroFIRHistoryList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* fetchReceivedZeroFIRHistory() {
  yield takeEvery(
    "FETCH_RECEIVED_ZERO_FIR_HISTORY_REQUEST",
    function* ({ payload }) {
      try {
        const response = yield call(getAPICall, payload);
        if (!isEmpty(response)) {
          yield put({
            type: actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_SUCCESS,
            receivedZeroFIRHistoryList: response?.data,
          });
        } else {
          yield put({
            type: actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_ERROR,
            errorMessage: response?.errorMessage,
          });
        }
      } catch (error) {
        yield put({
          type: actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_ERROR,
          errorMessage: "Something went wrong. Please try after some time.",
        });
      }
    }
  );
}

export function* fetchApprovalFIRList() {
  yield takeEvery("FETCH_APPROVAL_FIR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getAPICall, payload);
      if (!isEmpty(response)) {
        yield put({
          type: actions.FETCH_APPROVAL_SUCCESS,
          approvalFIRList: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_APPROVAL_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_APPROVAL_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* fetchDropdownData() {
  yield takeEvery("FETCH_DROPDOWNDATA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_DROPDOWNDATA_SUCCESS,
          dropDownData: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_DROPDOWNDATA_ERROR,
          errorMessage: response?.error,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_DROPDOWNDATA_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* fetchGravecrimeData() {
  yield takeEvery("FETCH_GRAVECRIMEDATA_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_GRAVECRIMEDATA_SUCCESS,
          graveCrimeData: response?.data,
        });
      } else {
        yield put({
          type: actions.FETCH_GRAVECRIMEDATA_ERROR,
          errorMessage: response?.error,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_GRAVECRIMEDATA_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* getGraveList() {
  yield takeEvery("FETCH_GRAVECRIMELIST_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_GRAVECRIMELIST_SUCCESS,
          graveCrimeListData: response?.data,
        });
        console.log(response);
      } else {
        yield put({
          type: actions.FETCH_GRAVECRIMELIST_ERROR,
          errorMessage: response?.error,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_GRAVECRIMELIST_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getGraveCountList() {
  yield takeEvery("FETCH_GRAVECRIMECOUNT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(createAPICall, payload);
      if (response?.status) {
        yield put({
          type: actions.FETCH_GRAVECRIMECOUNT_SUCCESS,
          graveCrimeCount: response,
        });
        console.log(response);
      } else {
        yield put({
          type: actions.FETCH_GRAVECRIMECOUNT_ERROR,
          errorMessage: response?.error,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FETCH_GRAVECRIMECOUNT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(fetchFIRList),
    fork(fetchRecentFIRNumList),
    fork(updatePrecrimeCase),
    fork(updateCrimeLocation),
    fork(createCrimeLocation),
    fork(addUpdateCrimeClassification),
    fork(updateCasePropertyManagement),
    fork(updatePunchWitness),
    fork(editPunchWitness),
    fork(updateWitnessStatement),
    fork(updatePersonMediaDetails),
    fork(editWitnessStatement),
    fork(addExpertTeam),
    fork(updateExpertTeam),
    fork(createMaterialObject),
    fork(editMaterialObject),
    fork(fetchCrimeLocation),
    fork(fetchCrimeClassification),
    fork(getCrimeClassification),
    fork(fetchCasePropertyManagement),
    fork(fetchPanchWitnessList),
    fork(fetchWitnessDetailsList),
    fork(fetchWitnessStatementsList),
    fork(fetchExpertTeamList),
    fork(fetchMaterialObjectList),
    fork(fetchPreCrimeCase),
    fork(fetchPreCrimeHistory),
    fork(fetchHistoryOptions),
    fork(fetchRoughSketchList),
    fork(updateRoughSketch),
    fork(fetchArrest),
    fork(createArrest),
    fork(updateArrest),
    fork(updateWitnessOrder),
    fork(fetchComplainantList),
    fork(fetchCrimeScenePhotographsList),
    fork(updateCrimeScenePhotographsList),
    fork(fetchProfessionalList),
    fork(fetchTransferredZeroFIRHistory),
    fork(fetchReceivedZeroFIRHistory),
    fork(fetchApprovalFIRList),
    fork(fetchDropdownData),
    fork(fetchHigherFIRList),
    fork(fetchCaseMetrics),
    fork(fetchGravecrimeData),
    fork(getGraveList),
    fork(getGraveCountList),
  ]);
}
