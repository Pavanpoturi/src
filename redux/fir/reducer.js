import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  isWitnessFeatching: false,
  errorMessage: "",
  successMessage: "",
  witnessOrderErrorMessage: "",
  witnessOrderSuccessMessage: "",
  firList: {},
  higherfirList: {},
  caseMetrics: [],
  graveCrimeList: {},
  recentFirNumList: [],
  crimeLocation: {},
  panchWitnessList: {},
  witnessStatementList: {},
  witnessStatementListNew: {},
  expertTeamList: {},
  materialObjectList: {},
  precrimescene: {},
  crimeclassification: {},
  crimeclassification_: {},
  casepropertymanagement: {},
  arrestList: {},
  historyOptions: {},
  roughSketchList: {},
  complainantList: [],
  isCustomTopBar: false,
  isDashboard: true,
  actionType: "",
  witnessOrderActionType: "",
  crimeScenePhotographsList: [],
  auditType: "",
  professionalList: [],
  selectedWidgetStatus: "",
  updatedPsCode: "",
  selectedCrimeSceneDate: "",
  isOnChange: false,
  transferredZeroFIRHistoryList: [],
  receivedZeroFIRHistoryList: [],
  approvalFIRList: [],
  dropDownData: [],
  graveCrimeListData: {},
  betweenDates: {},
  graveCrimeCount: [],
  selectedYear: "",
});

export default function firReducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_FIR_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_FIR_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        firList: action.firList,
      };
    case actions.FETCH_FIR_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.FETCH_HIGHERFIR_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_HIGHERFIR_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        higherfirList: action.firList,
      };
    case actions.FETCH_HIGHERFIR_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.FETCH_CASE_METRICS_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_CASE_METRICS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        caseMetrics: action.caseMetrics,
      };
    case actions.FETCH_CASE_METRICS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.FETCH_GRAVECRIMEDATA_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_GRAVECRIMEDATA_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        graveCrimeList: action.graveCrimeData,
      };
    case actions.FETCH_GRAVECRIMEDATA_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.FETCH_APPROVAL_FIR_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_APPROVAL_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        approvalFIRList: action.approvalFIRList,
      };
    case actions.FETCH_APPROVAL_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        transferredZeroFIRHistoryList: action.transferredZeroFIRHistoryList,
      };
    case actions.FETCH_TRANSFERRED_ZERO_FIR_HISTORY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        receivedZeroFIRHistoryList: action.receivedZeroFIRHistoryList,
      };
    case actions.FETCH_RECEIVED_ZERO_FIR_HISTORY_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.FETCH_RECENTFIRNUM_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_RECENTFIRNUM_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        recentFirNumList: action.recentFirNumList,
      };
    case actions.FETCH_RECENTFIRNUM_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.GET_COMPLAINANT_DETAILS_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_COMPLAINANT_DETAILS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        complainantList: action.complainantList,
      };
    case actions.GET_COMPLAINANT_DETAILS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.LOGOUT:
      return initialState;

    case actions.DASHBOARD_URL_UPDATE:
      return Immutable.merge(state, {
        isCustomTopBar: action.isCustomTopBar,
      });

    case actions.DASHBOARD_TOP_BAR_UPDATE:
      return Immutable.merge(state, {
        isDashboard: action.isDashboard,
      });

    case actions.UPDATE_SELECTED_WIDGET:
      return Immutable.merge(state, {
        selectedWidgetStatus: action.selectedWidgetStatus,
      });
    case actions.UPDATE_PS_CODE:
      return Immutable.merge(state, {
        updatedPsCode: action.updatedPsCode,
      });
    case actions.UPDATE_SELECTED_CRIME_SCENE_DATE:
      return Immutable.merge(state, {
        selectedCrimeSceneDate: action.selectedCrimeSceneDate,
      });

    case actions.CHECK_IS_ON_CHANGE:
      return Immutable.merge(state, {
        isOnChange: action.isOnChange,
      });

    case actions.RESET_ACTIONTYPE:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
      });

    case actions.RESET_CRIMECLASSIFICATION:
      return Immutable.merge(state, {
        actionType: "",
        errorMessage: "",
        successMessage: "",
        crimeclassification_: {},
      });

    case actions.PRECRIMECASE_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        actionType: "",
      });
    case actions.PRECRIMECASE_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.PRECRIMECASE_UPDATE_SUCCESS,
      });
    case actions.PRECRIMECASE_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.PRECRIMECASE_UPDATE_SUCCESS,
      });

    case actions.CRIMELOCATION_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CRIMELOCATION_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.CRIMELOCATION_UPDATE_SUCCESS,
        auditType: "Scene of Offence Updated",
      });
    case actions.CRIMELOCATION_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.CRIMELOCATION_UPDATE_ERROR,
      });

    case actions.CRIMELOCATION_CREATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CRIMELOCATION_CREATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.CRIMELOCATION_CREATE_SUCCESS,
        auditType: "Scene of Offence Created",
      });
    case actions.CRIMELOCATION_CREATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.CRIMELOCATION_CREATE_ERROR,
      });

    case actions.CRIMECLASSIFICATION_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CRIMECLASSIFICATION_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.CRIMECLASSIFICATION_UPDATE_SUCCESS,
        auditType: "Crime Classification Updated",
      });
    case actions.CRIMECLASSIFICATION_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.CRIMELOCATION_UPDATE_ERROR,
      });

    case actions.CASEPROPERTYMANAGEMENT_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.CASEPROPERTYMANAGEMENT_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.CASEPROPERTYMANAGEMENT_UPDATE_SUCCESS,
      });
    case actions.CASEPROPERTYMANAGEMENT_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.CASEPROPERTYMANAGEMENT_UPDATE_ERROR,
      });

    case actions.PANCHWITNESS_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PANCHWITNESS_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.PANCHWITNESS_UPDATE_SUCCESS,
        auditType: "Panch Witness Created",
      });
    case actions.PANCHWITNESS_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.PANCHWITNESS_UPDATE_ERROR,
      });

    case actions.PANCHWITNESS_EDIT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PANCHWITNESS_EDIT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.PANCHWITNESS_EDIT_SUCCESS,
        auditType: "Panch Witness Updated",
      });
    case actions.PANCHWITNESS_EDIT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.PANCHWITNESS_EDIT_ERROR,
      });

    case actions.WITNESS_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.WITNESS_UPDATE_SUCCESS,
        auditType: "Panch Witness Created",
      });
    case actions.WITNESS_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.WITNESS_UPDATE_ERROR,
      });

    case actions.PERSON_MEDIA_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.PERSON_MEDIA_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.PERSON_MEDIA_UPDATE_SUCCESS,
        auditType: "PERSON MEDIA Updated",
      });
    case actions.PERSON_MEDIA_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.PERSON_MEDIA_UPDATE_ERROR,
      });

    case actions.WITNESS_EDIT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.WITNESS_EDIT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.WITNESS_EDIT_SUCCESS,
        auditType: "Witness Statement Updated",
      });
    case actions.WITNESS_EDIT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.WITNESS_UPDATE_ERROR,
      });

    case actions.MATERIALOBJECT_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MATERIALOBJECT_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.MATERIALOBJECT_UPDATE_SUCCESS,
        auditType: "Material Objects Created",
      });
    case actions.MATERIALOBJECT_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.MATERIALOBJECT_UPDATE_ERROR,
      });

    case actions.MATERIALOBJECT_EDIT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.MATERIALOBJECT_EDIT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.MATERIALOBJECT_EDIT_SUCCESS,
        auditType: "Material Objects Updated",
      });
    case actions.MATERIALOBJECT_EDIT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.MATERIALOBJECT_EDIT_ERROR,
      });

    case actions.EXPERTTEAM_ADD_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERTTEAM_ADD_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.EXPERTTEAM_ADD_SUCCESS,
        auditType: "Expert Team Details Created",
      });
    case actions.EXPERTTEAM_ADD_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.EXPERTTEAM_ADD_ERROR,
      });

    case actions.EXPERTTEAM_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.EXPERTTEAM_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.EXPERTTEAM_UPDATE_SUCCESS,
        auditType: "Expert Team Details Updated",
      });
    case actions.EXPERTTEAM_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.EXPERTTEAM_UPDATE_ERROR,
      });

    case actions.FETCH_CRIMELOCATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_CRIMELOCATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        crimeLocation: action.crimeLocation,
        actionType: actions.FETCH_CRIMELOCATION_SUCCESS,
      });
    case actions.FETCH_CRIMELOCATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CRIMELOCATION_ERROR,
      });

    case actions.FETCH_PRECRIMECASE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_PRECRIMECASE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        precrimescene: action.precrimescene.data,
        actionType: actions.FETCH_PRECRIMECASE_SUCCESS,
      });
    case actions.FETCH_PRECRIMECASE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_MATERIALOBJECT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_MATERIALOBJECT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        materialObjectList: action.materialObjectList,
        actionType: actions.FETCH_MATERIALOBJECT_SUCCESS,
      });
    case actions.FETCH_MATERIALOBJECT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_WITNESSSTATEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
        isWitnessFeatching: true,
      });
    case actions.FETCH_WITNESSSTATEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        isWitnessFeatching: false,
        errorMessage: "",
        witnessStatementList: action.witnessStatementList,
        actionType: actions.FETCH_WITNESSSTATEMENT_SUCCESS,
      });
    case actions.FETCH_WITNESSSTATEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        isWitnessFeatching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_WITNESSSTATEMENT_NEW_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_WITNESSSTATEMENT_NEW_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        witnessStatementListNew: action.witnessStatementListNew,
        actionType: actions.FETCH_WITNESSSTATEMENT_NEW_SUCCESS,
      });
    case actions.FETCH_WITNESSSTATEMENT_NEW_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_PANCHWITNESS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_PANCHWITNESS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        panchWitnessList: action.panchWitnessList,
        actionType: actions.FETCH_PANCHWITNESS_SUCCESS,
      });
    case actions.FETCH_PANCHWITNESS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_EXPERTTEAM_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_EXPERTTEAM_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        expertTeamList: action.expertTeamList,
        actionType: actions.FETCH_EXPERTTEAM_SUCCESS,
      });
    case actions.FETCH_EXPERTTEAM_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_CRIMECLASSIFICATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_CRIMECLASSIFICATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        crimeclassification: action.crimeclassification,
        actionType: actions.FETCH_CRIMECLASSIFICATION_SUCCESS,
      });
    case actions.FETCH_CRIMECLASSIFICATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CRIMECLASSIFICATION_ERROR,
      });

    // get crime classification data
    case actions.GET_CRIMECLASSIFICATION_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.GET_CRIMECLASSIFICATION_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        crimeclassification_: action.crimeclassification_,
        actionType: actions.GET_CRIMECLASSIFICATION_SUCCESS,
      });
    case actions.GET_CRIMECLASSIFICATION_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.GET_CRIMECLASSIFICATION_ERROR,
      });

    case actions.FETCH_PRECRIMEHISTORY_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_PRECRIMEHISTORY_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        precrimescene: action.precrimescene.data,
        actionType: actions.FETCH_PRECRIMEHISTORY_SUCCESS,
      });
    case actions.FETCH_PRECRIMEHISTORY_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_HISTORYOPTIONS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_HISTORYOPTIONS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        historyOptions: action.historyOptions.data,
        precrimescene: {},
        actionType: actions.FETCH_HISTORYOPTIONS_SUCCESS,
      });
    case actions.FETCH_HISTORYOPTIONS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      });

    case actions.FETCH_CASEPROPERTYMANAGEMENT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_CASEPROPERTYMANAGEMENT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        casepropertymanagement: action.crimeclassification,
        actionType: actions.FETCH_CASEPROPERTYMANAGEMENT_SUCCESS,
      });
    case actions.FETCH_CASEPROPERTYMANAGEMENT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CASEPROPERTYMANAGEMENT_ERROR,
      });

    case actions.FETCH_ARREST_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_ARREST_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        arrestList: action.arrestList.data,
        actionType: actions.FETCH_ARREST_SUCCESS,
      });
    case actions.FETCH_ARREST_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_ARREST_ERROR,
      });

    case actions.ARREST_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ARREST_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.ARREST_UPDATE_SUCCESS,
      });
    case actions.ARREST_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ARREST_UPDATE_ERROR,
      });

    case actions.ARREST_CREATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ARREST_CREATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.ARREST_CREATE_SUCCESS,
      });
    case actions.ARREST_CREATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ARREST_CREATE_ERROR,
      });

    case actions.FETCH_ROUGHSKETCH_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_ROUGHSKETCH_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        roughSketchList: action.roughSketchList,
        actionType: actions.FETCH_ROUGHSKETCH_SUCCESS,
      });
    case actions.FETCH_ROUGHSKETCH_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_ROUGHSKETCH_ERROR,
      });

    case actions.ROUGHSKETCH_UPDATE_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.ROUGHSKETCH_UPDATE_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: action.response.message,
        actionType: actions.ROUGHSKETCH_UPDATE_SUCCESS,
        auditType: "Rough Sketch Updated",
      });
    case actions.ROUGHSKETCH_UPDATE_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        successMessage: "",
        actionType: actions.ROUGHSKETCH_UPDATE_ERROR,
      });

    case actions.UPDATE_WITNESS_ORDER_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_WITNESS_ORDER_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        witnessOrderErrorMessage: "",
        witnessOrderSuccessMessage: "Witness order successfully updated",
        witnessOrderActionType: actions.UPDATE_WITNESS_ORDER_SUCCESS,
      });
    case actions.UPDATE_WITNESS_ORDER_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        witnessOrderErrorMessage: action.errorMessage,
        witnessOrderSuccessMessage: "",
        witnessOrderActionType: actions.UPDATE_WITNESS_ORDER_ERROR,
      });

    case actions.RESET_WITNESS_ORDER_ACTIONTYPE:
      return Immutable.merge(state, {
        witnessOrderActionType: "",
        witnessOrderErrorMessage: "",
        witnessOrderSuccessMessage: "",
      });

    case actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        crimeScenePhotographsList: action.crimeScenePhotographsList,
        actionType: actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_SUCCESS,
      });
    case actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_CRIME_SCENE_PHOTOGRAPHS_ERROR,
      });

    case actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "Crime Scene Photographs Added",
        crimeScenePhotographsList: action.crimeScenePhotographsList,
        actionType: actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_SUCCESS,
        auditType: "Crime Scene Photographs Added",
      });
    case actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.UPDATE_CRIME_SCENE_PHOTOGRAPHS_ERROR,
      });

    case actions.FETCH_PROFESSIONALLIST_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_PROFESSIONALLIST_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        professionalList: action.professionalList,
        actionType: actions.FETCH_PROFESSIONALLIST_SUCCESS,
      });
    case actions.FETCH_PROFESSIONALLIST_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_PROFESSIONALLIST_ERROR,
      });
    case actions.FETCH_DROPDOWNDATA_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_DROPDOWNDATA_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        dropDownData: action.dropDownData,
      };
    case actions.FETCH_DROPDOWNDATA_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.FETCH_GRAVECRIMELIST_REQUEST:
      return { ...state, isFetching: true };
    case actions.FETCH_GRAVECRIMELIST_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        graveCrimeListData: action.graveCrimeListData,
        actionType: actions.FETCH_GRAVECRIMELIST_SUCCESS,
      };
    case actions.FETCH_GRAVECRIMELIST_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_GRAVECRIMELIST_ERROR,
      };
    case actions.RESET_DROPDOWNDATA:
      return Immutable.merge(state, { dropDownData: [] });
    case actions.SET_BETWEEN_DATES:
      return Immutable.merge(state, {
        betweenDates: action.betweenDates,
      });
    case actions.FETCH_GRAVECRIMECOUNT_REQUEST:
      return Immutable.merge(state, {
        isFetching: true,
      });
    case actions.FETCH_GRAVECRIMECOUNT_SUCCESS:
      return Immutable.merge(state, {
        failure: false,
        isFetching: false,
        errorMessage: "",
        graveCrimeCount: action.graveCrimeCount,
        actionType: actions.FETCH_GRAVECRIMECOUNT_SUCCESS,
      });
    case actions.FETCH_GRAVECRIMECOUNT_ERROR:
      return Immutable.merge(state, {
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FETCH_GRAVECRIMECOUNT_ERROR,
      });
    case actions.SET_SELECTED_YEAR:
      return Immutable.merge(state, {
        selectedYear: action.setSelectedYear,
      });
    default:
      return state;
  }
}
