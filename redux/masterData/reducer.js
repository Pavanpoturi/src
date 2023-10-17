import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isLoading: false,
  errorMessage: "",
  successMessage: "",
  gendersList: [],
  casteList: [],
  subCasteList: [],
  nationalityList: [],
  religionList: [],
  occupationList: [],
  educationQualificationList: [],
  stateDistrictList: [],
  materialTypeList: [],
  materialSubTypeList: [],
  staffList: [],
  unitMappingList: [],
  tsHierarchyList: [],
  expertList: [],
  witnessTypeList: [],
  witnessRelationList: [],
  witnessStrengthList: [],
  identityTypeList: [],
  crimeClassificationList: [],
  FIRMasterData: [],
  residencyTypeList: [],
  personTypeList: [],
  expertRoleList: [],
  relationTypeList: [],
  modeOfIntemationList: [],
  expertTeamList: [],
  rankList: [],
  courtsNameList: [],
  jailsNameList: [],
  statesNameList: [],
  highCourtDirectionsList: [],
  villagePincodeList: [],
  statementRecordList: [],
  witnessCategoryList: [],
  policeCustodyReasonsList: [],
  placeOfRecordingsList: [],
  apprehensionTypeList: [],
  placeOfArrestList: [],
  districtLists: [],
  majorHeadList: [],
  minorHeadList: [],
  roadAccidentList: [],
  bodyTypeList: [],
  beardList: [],
  hairColorList: [],
  eyeColorList: [],
  teethList: [],
  mustachesList: [],
  molesList: [],
  languagesList: [],
  deformitiesList: [],
  complexionList: [],
  hospitalsList: [],
  noticetoSuretyList: [],
  bodyDisposalList: [],
  effortsForTracingList: [],
  unitList: [],
  evidenceCollectionList: [],
  actList: [],
  sectionList: [],
  directionFromPS: [],
  mandalList: [],
  villageFromPSList: [],
  unitsFromDistrict: [],
  courtsFromPSList: [],
  FSLExpertList: [],
  cisActList: [],
  FSLQuestionnairie: [],
  allStaffList: [],
  IOList: [],
});

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case actions.EVIDENCE_COLLECTION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EVIDENCE_COLLECTION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        evidenceCollectionList: action.evidenceCollectionList,
      });
    case actions.EVIDENCE_COLLECTION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.UNITS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UNITS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        unitList: action.unitList,
      });
    case actions.UNITS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EFFORTS_TRACING_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EFFORTS_TRACING_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        effortsForTracingList: action.effortsForTracingList,
      });
    case actions.EFFORTS_TRACING_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.BODY_DISPOSAL_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.BODY_DISPOSAL_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        bodyDisposalList: action.bodyDisposalList,
      });
    case actions.BODY_DISPOSAL_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.GENDER_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.GENDER_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        gendersList: action.gendersList,
      });
    case actions.GENDER_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.CASTE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CASTE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        casteList: action.casteList,
      });
    case actions.CASTE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.NOTICETOSURETY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.NOTICETOSURETY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        noticetoSuretyList: action.noticetosuretyList,
      });
    case actions.NOTICETOSURETY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.SUB_CASTE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.SUB_CASTE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        subCasteList: action.subCasteList,
      });
    case actions.SUB_CASTE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.NATIONALITY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.NATIONALITY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        nationalityList: action.nationalityList,
      });
    case actions.NATIONALITY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.STATE_DISTRICT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.STATE_DISTRICT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        stateDistrictList: action.stateDistrictList,
      });
    case actions.STATE_DISTRICT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.DISTRICT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DISTRICT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        districtLists: action.districtList,
      });
    case actions.DISTRICT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.VILLAGE_PINCODE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.VILLAGE_PINCODE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        villagePincodeList: action.villagePincodeList,
      });
    case actions.VILLAGE_PINCODE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MATERIAL_OBJECT_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MATERIAL_OBJECT_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        materialTypeList: action.materialTypeList,
      });
    case actions.MATERIAL_OBJECT_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MATERIAL_OBJECT_SUBTYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MATERIAL_OBJECT_SUBTYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        materialSubTypeList: action.materialSubTypeList,
      });
    case actions.MATERIAL_OBJECT_SUBTYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.STAFF_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.STAFF_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        staffList: action.staffList,
      });
    case actions.STAFF_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.STAFF_ALL_REQUEST:
      return Immutable.merge(state, {
        isLoading: true,
      });
    case actions.STAFF_ALL_SUCCESS:
      return {
        ...initialState,
        failure: false,
        isLoading: false,
        errorMessage: "",
        allStaffList: action.allStaffList,
      };
    case actions.STAFF_ALL_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isLoading: false,
        errorMessage: action.errorMessage,
      });

    case actions.UNIT_MAPPING_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UNIT_MAPPING_SUCCESS:
      return {
        ...initialState,
        failure: false,
        isFetching: false,
        errorMessage: "",
        unitMappingList: action.unitMappingList,
      };
    case actions.UNIT_MAPPING_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.TS_HIERARCHY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.TS_HIERARCHY_SUCCESS:
      return {
        ...initialState,
        failure: false,
        isFetching: false,
        errorMessage: "",
        tsHierarchyList: action.tsHierarchyList,
      };
    case actions.TS_HIERARCHY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EXPERT_ROLE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERT_ROLE_SUCCESS:
      return {
        ...initialState,
        failure: false,
        isFetching: false,
        errorMessage: "",
        expertList: action.expertList,
      };
    case actions.EXPERT_ROLE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EXPERT_TEAM_ROLE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERT_TEAM_ROLE_SUCCESS:
      return {
        ...initialState,
        failure: false,
        isFetching: false,
        errorMessage: "",
        expertRoleList: action.expertRoleList,
      };
    case actions.EXPERT_TEAM_ROLE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.WITNESS_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        witnessTypeList: action.witnessTypeList,
      });
    case actions.WITNESS_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.WITNESS_RELATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_RELATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        witnessRelationList: action.witnessRelationList,
      });
    case actions.WITNESS_RELATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.WITNESS_STRENGTH_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_STRENGTH_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        witnessStrengthList: action.witnessStrengthList,
      });
    case actions.WITNESS_STRENGTH_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.IDENTITY_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.IDENTITY_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        identityTypeList: action.identityTypeList,
      });
    case actions.IDENTITY_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.RELIGION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.RELIGION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        religionList: action.religionList,
      });
    case actions.RELIGION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.OCCUPATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.OCCUPATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        occupationList: action.occupationList,
      });
    case actions.OCCUPATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EDUCATIONAL_QUALIFICATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EDUCATIONAL_QUALIFICATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        educationQualificationList: action.educationQualificationList,
      });
    case actions.EDUCATIONAL_QUALIFICATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EXPERTTEAM_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERTTEAM_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        expertTeamList: action.expertTeamList,
      });
    case actions.EXPERTTEAM_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.SUPPORTSTAFF_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.SUPPORTSTAFF_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        supportStaffList: action.supportStaffList,
      });
    case actions.SUPPORTSTAFF_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.CRIME_CLASSIFICATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CRIME_CLASSIFICATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        crimeClassificationList: action.crimeClassificationList,
      });
    case actions.CRIME_CLASSIFICATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.CRIME_SUB_CLASSIFICATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CRIME_SUB_CLASSIFICATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        FIRMasterData: action.FIRMasterData,
      });
    case actions.CRIME_SUB_CLASSIFICATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.RESIDENCY_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.RESIDENCY_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        residencyTypeList: action.residencyTypeList,
      });
    case actions.RESIDENCY_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.PERSON_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PERSON_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        personTypeList: action.personTypeList,
      });
    case actions.PERSON_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.RELATION_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.RELATION_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        relationTypeList: action.relationTypeList,
      });
    case actions.RELATION_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MODE_OF_INTEMATION_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MODE_OF_INTEMATION_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        modeOfIntemationList: action.modeOfIntemationList,
      });
    case actions.MODE_OF_INTEMATION_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EXPERT_TEAMS_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERT_TEAMS_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        expertTeamList: action.expertTeamList,
      });
    case actions.EXPERT_TEAMS_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.RANK_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.RANK_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        rankList: action.rankList,
      });
    case actions.RANK_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.COURTS_NAME_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.COURTS_NAME_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        courtsNameList: action.courtsNameList,
      });
    case actions.COURTS_NAME_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.JAILS_NAME_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.JAILS_NAME_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        jailsNameList: action.jailsNameList,
      });
    case actions.JAILS_NAME_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.STATES_NAME_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.STATES_NAME_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        statesNameList: action.statesNameList,
      });
    case actions.STATES_NAME_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.HIGH_COURT_DIRECTIONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.HIGH_COURT_DIRECTIONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        highCourtDirectionsList: action.highCourtDirectionsList,
      });
    case actions.HIGH_COURT_DIRECTIONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.WITNESS_CATEGORY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_CATEGORY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        witnessCategoryList: action.witnessCategoryList,
      });
    case actions.WITNESS_CATEGORY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.STATEMENT_RECORDED_BY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.STATEMENT_RECORDED_BY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        statementRecordList: action.statementRecordList,
      });
    case actions.STATEMENT_RECORDED_BY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.POLICE_CUSTODY_REASONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.POLICE_CUSTODY_REASONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        policeCustodyReasonsList: action.policeCustodyReasonsList,
      });
    case actions.POLICE_CUSTODY_REASONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.PLACE_OF_RECORDINGS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PLACE_OF_RECORDINGS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        placeOfRecordingsList: action.placeOfRecordingsList,
      });
    case actions.PLACE_OF_RECORDINGS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.APPREHENSION_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.APPREHENSION_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        apprehensionTypeList: action.apprehensionTypeList,
      });
    case actions.APPREHENSION_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.PLACE_OF_ARREST_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PLACE_OF_ARREST_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        placeOfArrestList: action.placeOfArrestList,
      });
    case actions.PLACE_OF_ARREST_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MAJOR_HEAD_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MAJOR_HEAD_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        majorHeadList: action.majorHeadList,
      });
    case actions.MAJOR_HEAD_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MINOR_HEAD_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MINOR_HEAD_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        minorHeadList: action.minorHeadList,
      });
    case actions.MINOR_HEAD_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.ROAD_ACCIDENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ROAD_ACCIDENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        roadAccidentList: action.roadAccidentList,
      });
    case actions.ROAD_ACCIDENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.BODY_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.BODY_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        bodyTypeList: action.bodyTypeList,
      });
    case actions.BODY_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.BEARD_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.BEARD_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        beardList: action.beardList,
      });
    case actions.BEARD_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.HAIR_COLOR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.HAIR_COLOR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        hairColorList: action.hairColorList,
      });
    case actions.HAIR_COLOR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.EYE_COLOR_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EYE_COLOR_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        eyeColorList: action.eyeColorList,
      });
    case actions.EYE_COLOR_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    //Io details List
    case actions.GET_IO_DETAILS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.GET_IO_DETAILS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        IOList: action.IOList,
      });
    case actions.GET_IO_DETAILS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.COMPLEXION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.COMPLEXION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        complexionList: action.complexionList,
      });
    case actions.COMPLEXION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.DEFORMITIES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DEFORMITIES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        deformitiesList: action.deformitiesList,
      });
    case actions.DEFORMITIES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MOLES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MOLES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        molesList: action.molesList,
      });
    case actions.MOLES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.LANGUAGES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.LANGUAGES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        languagesList: action.languagesList,
      });
    case actions.LANGUAGES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.MUSTACHES_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MUSTACHES_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        mustachesList: action.mustachesList,
      });
    case actions.MUSTACHES_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.TEETH_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.TEETH_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        teethList: action.teethList,
      });
    case actions.TEETH_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.HOSPITALS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.HOSPITALS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        hospitalsList: action.hospitalsList,
      });
    case actions.HOSPITALS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.ACT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ACT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        actList: action.actList,
      });
    case actions.ACT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });
    case actions.CIS_ACT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CIS_ACT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        cisActList: action.cisActList,
      });
    case actions.CIS_ACT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });
    case actions.SECTION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.SECTION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        sectionList: action.sectionList,
      });
    case actions.SECTION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.DIRECTION_FROM_PS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.DIRECTION_FROM_PS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        directionFromPS: action.directionFromPS,
      });
    case actions.DIRECTION_FROM_PS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });
    case actions.MANDAL_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MANDAL_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        mandalList: action.mandalList,
      });
    case actions.MANDAL_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });
    case actions.VILLAGE_FROM_PSCODE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.VILLAGE_FROM_PSCODE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        villageFromPSList: action.villageFromPSList,
      });
    case actions.VILLAGE_FROM_PSCODE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.UNIT_FROM_DISTRICT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UNIT_FROM_DISTRICT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        unitsFromDistrict: action.unitsFromDistrict,
      });
    case actions.UNIT_FROM_DISTRICT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.COURTS_FROM_PSCODE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.COURTS_FROM_PSCODE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        courtsFromPSList: action.courtsFromPSList,
      });
    case actions.COURTS_FROM_PSCODE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FSL_EXPERT_TYPE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FSL_EXPERT_TYPE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        FSLExpertList: action.FSLExpertList,
      });
    case actions.FSL_EXPERT_TYPE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FSL_QUESTIONNAIRIE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FSL_QUESTIONNAIRIE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        FSLQuestionnairie: action.FSLQuestionnairie,
      });
    case actions.FSL_QUESTIONNAIRIE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    default:
      return state;
  }
}
