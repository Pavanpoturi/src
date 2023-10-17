import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import actions from "./actions";
import ApiSauce from "@services/apiSauce";
import { camelCase, mapKeys } from "lodash";

const getData = (payload) => {
  return ApiSauce.get(payload.url);
};

export function* getGendersList() {
  yield takeEvery("GENDER_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.GENDER_SUCCESS,
          gendersList: response,
        });
      } else {
        yield put({
          type: actions.GENDER_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GENDER_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCasteList() {
  yield takeEvery("CASTE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.CASTE_SUCCESS,
          casteList: response,
        });
      } else {
        yield put({
          type: actions.CASTE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CASTE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getNoticeSuretyList() {
  yield takeEvery("NOTICETOSURETY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.NOTICETOSURETY_SUCCESS,
          noticetosuretyList: response?.data,
        });
      } else {
        yield put({
          type: actions.NOTICETOSURETY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.NOTICETOSURETY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getSubCasteList() {
  yield takeEvery("SUB_CASTE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.SUB_CASTE_SUCCESS,
          subCasteList: response,
        });
      } else {
        yield put({
          type: actions.SUB_CASTE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SUB_CASTE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getNationalityList() {
  yield takeEvery("NATIONALITY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.NATIONALITY_SUCCESS,
          nationalityList: response,
        });
      } else {
        yield put({
          type: actions.NATIONALITY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.NATIONALITY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getReligionList() {
  yield takeEvery("RELIGION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.RELIGION_SUCCESS,
          religionList: response,
        });
      } else {
        yield put({
          type: actions.RELIGION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.RELIGION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getOccupationList() {
  yield takeEvery("OCCUPATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.OCCUPATION_SUCCESS,
          occupationList: response,
        });
      } else {
        yield put({
          type: actions.OCCUPATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.OCCUPATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getEducationQualificationList() {
  yield takeEvery("EDUCATIONAL_QUALIFICATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EDUCATIONAL_QUALIFICATION_SUCCESS,
          educationQualificationList: response,
        });
      } else {
        yield put({
          type: actions.EDUCATIONAL_QUALIFICATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EDUCATIONAL_QUALIFICATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getStateDistrictList() {
  yield takeEvery("STATE_DISTRICT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.STATE_DISTRICT_SUCCESS,
          stateDistrictList: response,
        });
      } else {
        yield put({
          type: actions.STATE_DISTRICT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.STATE_DISTRICT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDistrictList() {
  yield takeEvery("DISTRICT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.DISTRICT_SUCCESS,
          districtList: response,
        });
      } else {
        yield put({
          type: actions.DISTRICT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DISTRICT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDistrictVillage() {
  yield takeEvery("VILLAGE_PINCODE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.VILLAGE_PINCODE_SUCCESS,
          villagePincodeList: response,
        });
      } else {
        yield put({
          type: actions.VILLAGE_PINCODE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.VILLAGE_PINCODE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMaterialTypeList() {
  yield takeEvery("MATERIAL_OBJECT_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MATERIAL_OBJECT_TYPE_SUCCESS,
          materialTypeList: response,
        });
      } else {
        yield put({
          type: actions.MATERIAL_OBJECT_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MATERIAL_OBJECT_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMaterialSubTypeList() {
  yield takeEvery("MATERIAL_OBJECT_SUBTYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MATERIAL_OBJECT_SUBTYPE_SUCCESS,
          materialSubTypeList: response,
        });
      } else {
        yield put({
          type: actions.MATERIAL_OBJECT_SUBTYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MATERIAL_OBJECT_SUBTYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getStaffList() {
  yield takeEvery("STAFF_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      function getParameterByName(name, url = payload.url) {
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
      let cctns_unit_id = getParameterByName("policestationcode");

      if (response) {
        var staffData = [];
        JSON.parse(response.data).forEach((element) => {
          var camelcaseObj = {};
          //attaching psCode/circleCodes
          camelcaseObj.cctns_unit_id = cctns_unit_id;
          mapKeys(element, (v, k) => (camelcaseObj[camelCase(k)] = v));
          staffData.push(camelcaseObj);
        });
        yield put({
          type: actions.STAFF_SUCCESS,
          staffList: staffData,
        });
      } else {
        yield put({
          type: actions.STAFF_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.STAFF_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getAllStaffList() {
  yield takeEvery("STAFF_ALL_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response.success) {
        const { data = [] } = response;
        const staffData = [];
        data.forEach((element) => {
          var camelcaseObj = {};
          //attaching psCode/circleCodes
          mapKeys(element, (v, k) => {
            if (k !== "cctns_unit_id") {
              camelcaseObj[camelCase(k)] = v;
            } else {
              camelcaseObj[k] = v;
            }
          });
          staffData.push(camelcaseObj);
        });
        yield put({
          type: actions.STAFF_ALL_SUCCESS,
          allStaffList: staffData,
        });
      } else {
        yield put({
          type: actions.STAFF_ALL_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.STAFF_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getUnitMapping() {
  yield takeEvery("UNIT_MAPPING_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.UNIT_MAPPING_SUCCESS,
          unitMappingList: [...response],
        });
      } else {
        yield put({
          type: actions.UNIT_MAPPING_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UNIT_MAPPING_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getTsHierarchy() {
  yield takeEvery("TS_HIERARCHY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.TS_HIERARCHY_SUCCESS,
          tsHierarchyList: [...response],
        });
      } else {
        yield put({
          type: actions.TS_HIERARCHY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.TS_HIERARCHY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getExpertList() {
  yield takeEvery("EXPERT_ROLE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        var expertTeamData = [];
        JSON.parse(response.data).forEach((element) => {
          var camelcaseObj = {};
          mapKeys(element, (v, k) => (camelcaseObj[camelCase(k)] = v));
          expertTeamData.push(camelcaseObj);
        });
        yield put({
          type: actions.EXPERT_ROLE_SUCCESS,
          expertList: expertTeamData,
        });
      } else {
        yield put({
          type: actions.EXPERT_ROLE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EXPERT_ROLE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getExpertRoleList() {
  yield takeEvery("EXPERT_TEAM_ROLE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EXPERT_TEAM_ROLE_SUCCESS,
          expertRoleList: response,
        });
      } else {
        yield put({
          type: actions.EXPERT_TEAM_ROLE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EXPERT_TEAM_ROLE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getWitnessTypeList() {
  yield takeEvery("WITNESS_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.WITNESS_TYPE_SUCCESS,
          witnessTypeList: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getWitnessRelationList() {
  yield takeEvery("WITNESS_RELATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.WITNESS_RELATION_SUCCESS,
          witnessRelationList: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_RELATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_RELATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getWitnessStrengthList() {
  yield takeEvery("WITNESS_STRENGTH_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.WITNESS_STRENGTH_SUCCESS,
          witnessStrengthList: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_STRENGTH_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_STRENGTH_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getIdentityTypeList() {
  yield takeEvery("IDENTITY_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.IDENTITY_TYPE_SUCCESS,
          identityTypeList: response,
        });
      } else {
        yield put({
          type: actions.IDENTITY_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.IDENTITY_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCrimeClassificationList() {
  yield takeEvery("CRIME_CLASSIFICATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.CRIME_CLASSIFICATION_SUCCESS,
          crimeClassificationList: response,
        });
      } else {
        yield put({
          type: actions.CRIME_CLASSIFICATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CRIME_CLASSIFICATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFIRMasterList() {
  yield takeEvery("CRIME_SUB_CLASSIFICATION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.CRIME_SUB_CLASSIFICATION_SUCCESS,
          FIRMasterData: response,
        });
      } else {
        yield put({
          type: actions.CRIME_SUB_CLASSIFICATION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.CRIME_SUB_CLASSIFICATION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getResidencyTypeList() {
  yield takeEvery("RESIDENCY_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.RESIDENCY_TYPE_SUCCESS,
          residencyTypeList: response,
        });
      } else {
        yield put({
          type: actions.RESIDENCY_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.RESIDENCY_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getPersonTypeList() {
  yield takeEvery("PERSON_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.PERSON_TYPE_SUCCESS,
          personTypeList: response,
        });
      } else {
        yield put({
          type: actions.PERSON_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PERSON_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getRelationTypeList() {
  yield takeEvery("RELATION_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.RELATION_TYPE_SUCCESS,
          relationTypeList: response,
        });
      } else {
        yield put({
          type: actions.RELATION_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.RELATION_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getModeOfIntemationList() {
  yield takeEvery("MODE_OF_INTEMATION_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MODE_OF_INTEMATION_TYPE_SUCCESS,
          modeOfIntemationList: response,
        });
      } else {
        yield put({
          type: actions.MODE_OF_INTEMATION_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MODE_OF_INTEMATION_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getExpertTeamsList() {
  yield takeEvery("EXPERT_TEAMS_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EXPERT_TEAMS_TYPE_SUCCESS,
          expertTeamList: response,
        });
      } else {
        yield put({
          type: actions.EXPERT_TEAMS_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EXPERT_TEAMS_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getRanks() {
  yield takeEvery("RANK_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.RANK_SUCCESS,
          rankList: response,
        });
      } else {
        yield put({
          type: actions.RANK_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.RANK_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCourtsName() {
  yield takeEvery("COURTS_NAME_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.COURTS_NAME_SUCCESS,
          courtsNameList: response,
        });
      } else {
        yield put({
          type: actions.COURTS_NAME_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.COURTS_NAME_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getJailsName() {
  yield takeEvery("JAILS_NAME_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.JAILS_NAME_SUCCESS,
          jailsNameList: response,
        });
      } else {
        yield put({
          type: actions.JAILS_NAME_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.JAILS_NAME_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getStatesName() {
  yield takeEvery("STATES_NAME_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      // This is hack. API Team should take care this
      if (response && response.status !== 404) {
        yield put({
          type: actions.STATES_NAME_SUCCESS,
          statesNameList: response,
        });
      } else {
        yield put({
          type: actions.STATES_NAME_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.STATES_NAME_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getHighCourtDirections() {
  yield takeEvery("HIGH_COURT_DIRECTIONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.HIGH_COURT_DIRECTIONS_SUCCESS,
          highCourtDirectionsList: response,
        });
      } else {
        yield put({
          type: actions.HIGH_COURT_DIRECTIONS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.HIGH_COURT_DIRECTIONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* getStatementRecords() {
  yield takeEvery("STATEMENT_RECORDED_BY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.STATEMENT_RECORDED_BY_SUCCESS,
          statementRecordList: response,
        });
      } else {
        yield put({
          type: actions.STATEMENT_RECORDED_BY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.STATEMENT_RECORDED_BY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getWitnessCategories() {
  yield takeEvery("WITNESS_CATEGORY_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.WITNESS_CATEGORY_SUCCESS,
          witnessCategoryList: response,
        });
      } else {
        yield put({
          type: actions.WITNESS_CATEGORY_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.WITNESS_CATEGORY_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getPoliceCustodyReasons() {
  yield takeEvery("POLICE_CUSTODY_REASONS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.POLICE_CUSTODY_REASONS_SUCCESS,
          policeCustodyReasonsList: response,
        });
      } else {
        yield put({
          type: actions.POLICE_CUSTODY_REASONS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.POLICE_CUSTODY_REASONS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getPlaceOfRecordingsList() {
  yield takeEvery("PLACE_OF_RECORDINGS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.PLACE_OF_RECORDINGS_SUCCESS,
          placeOfRecordingsList: response,
        });
      } else {
        yield put({
          type: actions.PLACE_OF_RECORDINGS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PLACE_OF_RECORDINGS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getApprehensionTypes() {
  yield takeEvery("APPREHENSION_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.APPREHENSION_TYPE_SUCCESS,
          apprehensionTypeList: response,
        });
      } else {
        yield put({
          type: actions.APPREHENSION_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.APPREHENSION_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getPlaceOfArrestList() {
  yield takeEvery("PLACE_OF_ARREST_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.PLACE_OF_ARREST_TYPE_SUCCESS,
          placeOfArrestList: response,
        });
      } else {
        yield put({
          type: actions.PLACE_OF_ARREST_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.PLACE_OF_ARREST_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMajorHeadList() {
  yield takeEvery("MAJOR_HEAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MAJOR_HEAD_SUCCESS,
          majorHeadList: response,
        });
      } else {
        yield put({
          type: actions.MAJOR_HEAD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MAJOR_HEAD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMinorHeadList() {
  yield takeEvery("MINOR_HEAD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MINOR_HEAD_SUCCESS,
          minorHeadList: response,
        });
      } else {
        yield put({
          type: actions.MINOR_HEAD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MINOR_HEAD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getRoadAccidentList() {
  yield takeEvery("ROAD_ACCIDENT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.ROAD_ACCIDENT_SUCCESS,
          roadAccidentList: response,
        });
      } else {
        yield put({
          type: actions.ROAD_ACCIDENT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.ROAD_ACCIDENT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getBodyTypeList() {
  yield takeEvery("BODY_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.BODY_TYPE_SUCCESS,
          bodyTypeList: response,
        });
      } else {
        yield put({
          type: actions.BODY_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.BODY_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getBeardList() {
  yield takeEvery("BEARD_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.BEARD_SUCCESS,
          beardList: response,
        });
      } else {
        yield put({
          type: actions.BEARD_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.BEARD_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getHairColorList() {
  yield takeEvery("HAIR_COLOR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.HAIR_COLOR_SUCCESS,
          hairColorList: response,
        });
      } else {
        yield put({
          type: actions.HAIR_COLOR_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.HAIR_COLOR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getEyeColorList() {
  yield takeEvery("EYE_COLOR_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EYE_COLOR_SUCCESS,
          eyeColorList: response,
        });
      } else {
        yield put({
          type: actions.EYE_COLOR_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EYE_COLOR_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

//Io details List

export function* getIoDetailsList() {
  yield takeEvery("GET_IO_DETAILS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.GET_IO_DETAILS_SUCCESS,
          IOList: response,
        });
      } else {
        yield put({
          type: actions.GET_IO_DETAILS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.GET_IO_DETAILS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getTeethList() {
  yield takeEvery("TEETH_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.TEETH_SUCCESS,
          teethList: response,
        });
      } else {
        yield put({
          type: actions.TEETH_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.TEETH_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMustachesList() {
  yield takeEvery("MUSTACHES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MUSTACHES_SUCCESS,
          mustachesList: response,
        });
      } else {
        yield put({
          type: actions.MUSTACHES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MUSTACHES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMolesList() {
  yield takeEvery("MOLES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MOLES_SUCCESS,
          molesList: response,
        });
      } else {
        yield put({
          type: actions.MOLES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MOLES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getLanguagesList() {
  yield takeEvery("LANGUAGES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.LANGUAGES_SUCCESS,
          languagesList: response,
        });
      } else {
        yield put({
          type: actions.LANGUAGES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.LANGUAGES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDeformitiesList() {
  yield takeEvery("DEFORMITIES_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.DEFORMITIES_SUCCESS,
          deformitiesList: response,
        });
      } else {
        yield put({
          type: actions.DEFORMITIES_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DEFORMITIES_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getComplexionList() {
  yield takeEvery("COMPLEXION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.COMPLEXION_SUCCESS,
          complexionList: response,
        });
      } else {
        yield put({
          type: actions.COMPLEXION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.COMPLEXION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getHospitalsList() {
  yield takeEvery("HOSPITALS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.HOSPITALS_SUCCESS,
          hospitalsList: response,
        });
      } else {
        yield put({
          type: actions.HOSPITALS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.HOSPITALS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getBodyDisposalList() {
  yield takeEvery("BODY_DISPOSAL_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.BODY_DISPOSAL_SUCCESS,
          bodyDisposalList: response,
        });
      } else {
        yield put({
          type: actions.BODY_DISPOSAL_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.BODY_DISPOSAL_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getEffortForTracingList() {
  yield takeEvery("EFFORTS_TRACING_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EFFORTS_TRACING_SUCCESS,
          effortsForTracingList: response,
        });
      } else {
        yield put({
          type: actions.EFFORTS_TRACING_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EFFORTS_TRACING_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getUnitsList() {
  yield takeEvery("UNITS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.UNITS_SUCCESS,
          unitList: response,
        });
      } else {
        yield put({
          type: actions.UNITS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UNITS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getEvidenceCollectionList() {
  yield takeEvery("EVIDENCE_COLLECTION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.EVIDENCE_COLLECTION_SUCCESS,
          evidenceCollectionList: response,
        });
      } else {
        yield put({
          type: actions.EVIDENCE_COLLECTION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.EVIDENCE_COLLECTION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCisActList() {
  yield takeEvery("CIS_ACT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.CIS_ACT_SUCCESS,
          cisActList: response,
        });
      } else {
        yield put({
          type: actions.CIS_ACT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SECTION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getActList() {
  yield takeEvery("ACT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.ACT_SUCCESS,
          actList: response,
        });
      } else {
        yield put({
          type: actions.ACT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SECTION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getSectionList() {
  yield takeEvery("SECTION_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.SECTION_SUCCESS,
          sectionList: response,
        });
      } else {
        yield put({
          type: actions.SECTION_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.SECTION_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getDirectionFromPSList() {
  yield takeEvery("DIRECTION_FROM_PS_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.DIRECTION_FROM_PS_SUCCESS,
          directionFromPS: response,
        });
      } else {
        yield put({
          type: actions.DIRECTION_FROM_PS_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.DIRECTION_FROM_PS_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getMandalList() {
  yield takeEvery("MANDAL_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.MANDAL_SUCCESS,
          mandalList: response,
        });
      } else {
        yield put({
          type: actions.MANDAL_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.MANDAL_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}
export function* getVillageFromPsList() {
  yield takeEvery("VILLAGE_FROM_PSCODE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.VILLAGE_FROM_PSCODE_SUCCESS,
          villageFromPSList: response,
        });
      } else {
        yield put({
          type: actions.VILLAGE_FROM_PSCODE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.VILLAGE_FROM_PSCODE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getUnitsFromDistrict() {
  yield takeEvery("UNIT_FROM_DISTRICT_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.UNIT_FROM_DISTRICT_SUCCESS,
          unitsFromDistrict: response,
        });
      } else {
        yield put({
          type: actions.UNIT_FROM_DISTRICT_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.UNIT_FROM_DISTRICT_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getCourtsBasedonPsCode() {
  yield takeEvery("COURTS_FROM_PSCODE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.COURTS_FROM_PSCODE_SUCCESS,
          courtsFromPSList: response,
        });
      } else {
        yield put({
          type: actions.COURTS_FROM_PSCODE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.COURTS_FROM_PSCODE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFSLExpertTypeList() {
  yield takeEvery("FSL_EXPERT_TYPE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.FSL_EXPERT_TYPE_SUCCESS,
          FSLExpertList: response,
        });
      } else {
        yield put({
          type: actions.FSL_EXPERT_TYPE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FSL_EXPERT_TYPE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export function* getFSLQuestionnairie() {
  yield takeEvery("FSL_QUESTIONNAIRIE_REQUEST", function* ({ payload }) {
    try {
      const response = yield call(getData, payload);
      if (response) {
        yield put({
          type: actions.FSL_QUESTIONNAIRIE_SUCCESS,
          FSLQuestionnairie: response?.data,
        });
      } else {
        yield put({
          type: actions.FSL_QUESTIONNAIRIE_ERROR,
          errorMessage: response?.errorMessage,
        });
      }
    } catch (error) {
      yield put({
        type: actions.FSL_QUESTIONNAIRIE_ERROR,
        errorMessage: "Something went wrong. Please try after some time.",
      });
    }
  });
}

export default function* rootSaga() {
  yield all([
    fork(getGendersList),
    fork(getCasteList),
    fork(getSubCasteList),
    fork(getNationalityList),
    fork(getReligionList),
    fork(getOccupationList),
    fork(getEducationQualificationList),
    fork(getStateDistrictList),
    fork(getDistrictList),
    fork(getMaterialTypeList),
    fork(getMaterialSubTypeList),
    fork(getStaffList),
    fork(getUnitMapping),
    fork(getTsHierarchy),
    fork(getExpertList),
    fork(getWitnessTypeList),
    fork(getWitnessRelationList),
    fork(getWitnessStrengthList),
    fork(getIdentityTypeList),
    fork(getCrimeClassificationList),
    fork(getFIRMasterList),
    fork(getResidencyTypeList),
    fork(getPersonTypeList),
    fork(getExpertRoleList),
    fork(getRelationTypeList),
    fork(getModeOfIntemationList),
    fork(getExpertTeamsList),
    fork(getRanks),
    fork(getCourtsName),
    fork(getJailsName),
    fork(getStatesName),
    fork(getHighCourtDirections),
    fork(getDistrictVillage),
    fork(getWitnessCategories),
    fork(getStatementRecords),
    fork(getPoliceCustodyReasons),
    fork(getPlaceOfRecordingsList),
    fork(getApprehensionTypes),
    fork(getPlaceOfArrestList),
    fork(getMajorHeadList),
    fork(getMinorHeadList),
    fork(getRoadAccidentList),
    fork(getBodyTypeList),
    fork(getBeardList),
    fork(getHairColorList),
    fork(getEyeColorList),
    fork(getIoDetailsList),
    fork(getTeethList),
    fork(getMustachesList),
    fork(getMolesList),
    fork(getLanguagesList),
    fork(getDeformitiesList),
    fork(getComplexionList),
    fork(getHospitalsList),
    fork(getBodyDisposalList),
    fork(getEffortForTracingList),
    fork(getUnitsList),
    fork(getEvidenceCollectionList),
    fork(getActList),
    fork(getSectionList),
    fork(getDirectionFromPSList),
    fork(getMandalList),
    fork(getVillageFromPsList),
    fork(getCourtsBasedonPsCode),
    fork(getUnitsFromDistrict),
    fork(getFSLExpertTypeList),
    fork(getCisActList),
    fork(getFSLQuestionnairie),
    fork(getNoticeSuretyList),
    fork(getAllStaffList),
  ]);
}
