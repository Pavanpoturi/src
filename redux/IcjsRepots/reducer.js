import actions from "./actions";
import Immutable from "seamless-immutable";

const initialState = Immutable({
  failure: false,
  isFetching: false,
  errorMessage: "",
  successMessage: "",
  reportedChargeSheet: [],
  chargeSheetStatus: [],
});

export default function reportsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.REPORTED_CHARGESHEET_REQUEST:
      return { ...state, isFetching: true };
    case actions.REPORTED_CHARGESHEET_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        reportedChargeSheet: action.reportedChargeSheet,
      };
    case actions.REPORTED_CHARGESHEET_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.CHARGESHEET_STATUS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case actions.CHARGESHEET_STATUS_SUCCESS:
      return {
        ...state,
        failure: false,
        isFetching: false,
        errorMessage: "",
        chargeSheetStatus: action.chargeSheetStatus,
      };
    case actions.CHARGESHEET_STATUS_ERROR:
      return {
        ...state,
        failure: true,
        isFetching: false,
        errorMessage: action.errorMessage,
      };

    case actions.ICJS_REPORTS_DOWNLOAD_REQUEST:
      return {
        ...state,
        failure: false,
        isFetching: true,
      };
    case actions.ICJS_REPORTS_DOWNLOAD_SUCCESS:
      let blob = new Blob([action.reportDownload], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let url = window.URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = `${action.fileName}.xlsx`;
      a.click();
      break;
    case actions.ICJS_REPORTS_DOWNLOAD_ERROR:
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

    case actions.RESET_REPORT_REQUEST:
      return {
        failure: false,
        isFetching: false,
        errorMessage: "",
        successMessage: "",
        reportedChargeSheet: [],
        chargeSheetStatus: [],
      };
    default:
      return state;
  }
}
