import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  reportedCases: {},
  caseStatus: {},
  missngCases: {},
  arrests: {},
  reportDownload: "",
  FSLReports: [],
  psDetails: [],
  CisDetails: [],
  TABLEAUReport: [],
});

export default function reportsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REPORTED_CASES_REQUEST:
      return { ...state, isFetching: true };
    case actions.REPORTED_CASES_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        reportedCases: action.reportedCases,
      };
    case actions.REPORTED_CASES_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.GET_CIS_DETAILS_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_CIS_DETAILS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        CisDetails: action.cisDetails,
      };
    case actions.GET_CIS_DETAILS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        CisDetails: [],
      };
    case actions.GET_PS_DETAILS_REQUEST:
      return { ...state, isFetching: true };
    case actions.GET_PS_DETAILS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        psDetails: action.psDetails,
      };
    case actions.GET_PS_DETAILS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.CASES_STATUS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case actions.CASES_STATUS_SUCCESS:
      let caseStatus = action.caseStatus?.data?.caseStatus;
      let array = [];
      array.push(caseStatus);
      action.caseStatus.data["caseStatus"] = array;
      let reasonForUI = action.caseStatus?.data?.reasonForUI;
      let arrayUi = [];
      arrayUi.push(reasonForUI);
      action.caseStatus.data["reasonForUI"] = arrayUi;
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        caseStatus: action.caseStatus,
      };
    case actions.CASES_STATUS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.MISSING_CASES_REQUEST:
      return {
        ...state,
        failure: false,
        isFetching: true,
      };
    case actions.MISSING_CASES_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        missngCases: action.missngCases,
      };
    case actions.MISSING_CASES_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.ARREST_CASES_REQUEST:
      return {
        ...state,
        failure: false,
        isFetching: true,
      };
    case actions.ARREST_CASES_SUCCESS:
      let arrested = action.arrests?.data?.yetToArrested;
      let arr = [];
      arr.push(arrested);
      action.arrests.data["yetToArrested"] = arr;
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        arrests: action.arrests,
      };
    case actions.ARREST_CASES_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.REPORTS_DOWNLOAD_REQUEST:
      return {
        ...state,
        failure: false,
        isFetching: true,
      };
    case actions.REPORTS_DOWNLOAD_SUCCESS:
      let blob = new Blob([action.reportDownload], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = `${action.fileName}.xlsx`;
      a.click();
      break;
    case actions.REPORTS_DOWNLOAD_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };
    case actions.PDF_REPORTS_DOWNLOAD_REQUEST:
      return {
        ...state,
        failure: false,
        isFetching: true,
      };
    case actions.PDF_REPORTS_DOWNLOAD_SUCCESS:
      let PdfBlob = new Blob([action.reportDownload], {
        type: "application/pdf",
      });
      let pdfurl = window.URL.createObjectURL(PdfBlob);
      let anchor = document.createElement("a");
      anchor.href = pdfurl;
      anchor.download = "DSR_Reported_Cases_Report.pdf";
      anchor.click();
      break;
    case actions.PDF_REPORTS_DOWNLOAD_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.FSL_REPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.FSL_REPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        FSLReports: action.FSLReports,
        actionType: actions.FSL_REPORT_SUCCESS,
      };
    case actions.FSL_REPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.FSL_REPORT_ERROR,
      };

    case actions.RESET_REPORT_REQUEST:
      return {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        reportedCases: {},
        caseStatus: {},
        missngCases: {},
        arrests: {},
        reportDownload: "",
        FSLReports: [],
      };
    case actions.TABLEAU_REPORT_REQUEST:
      return { ...state, isFetching: true };
    case actions.TABLEAU_REPORT_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        TABLEAUReport: action.TABLEAUReport,
        actionType: actions.TABLEAU_REPORT_SUCCESS,
      };
    case actions.TABLEAU_REPORT_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
        actionType: actions.TABLEAU_REPORT_ERROR,
      };

    default:
      return state;
  }
}
