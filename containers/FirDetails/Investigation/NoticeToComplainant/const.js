import moment from "moment";
import { isEmpty } from "lodash";
import {
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import {
  TemplateNoticetoComplainantonDeletion,
  TemplateNoticetoComplainantonFR,
} from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";

export const NoticeToComplainantTemplates = [
  {
    name: "Notice To Complainant",
    label: "Notice To Complainant on FIR",
    fileName: "Notice_To_Complainant",
    templateAvailable: true,
  },
  {
    name: "Notice To Complainant",
    label: "Notice To Complainant on Deletion of accused",
    fileName: "Notice_To_Complainant_on_delete",
    templateAvailable: true,
  },
];

export const NoticeToComplainantForm = [
  {
    name: "nameOfComplainant",
    label: "Name and address of Complainant",
    actionLink: "addPerson",
    actionName: "Add Person",
    type: "dropdown",
  },
  {
    name: "purposeOfIssue",
    label: "Purpose of issue",
    type: "dropdown",
  },
  {
    name: "dateOfNotice",
    label: "Date of notice",
    type: "date",
  },
];

export const purposeOfIssueList = [
  { label: "Charge sheet" },
  { label: "Deletion of accused" },
  { label: "Deletion of Section" },
  { label: "Final Report" },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Notice_To_Complainant_on_delete":
      return (
        <TemplateNoticetoComplainantonDeletion
          fileName={filename}
          data={data}
        />
      );
    case "Notice_To_Complainant":
      return (
        <TemplateNoticetoComplainantonFR fileName={filename} data={data} />
      );

    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser,
  savedFir
) => {
  const { firNum, district, psName, dateOfReport, briefFacts } = selectedFir;
  const selectedActsData = loadState("selectedActDetails");
  var section = selectedFir?.actsAndSections.map(function (i) {
    return i.section;
  });
  var merged = [].concat.apply([], section);
  var actsSections = merged?.toString();
  var secdata = !isEmpty(actsSections)
    ? getTemplatesSectionsData(selectedActsData?.uniqActs)
    : selectedFir?.section;

  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    IOName: getIONameAndRank(briefFacts),
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };
  const AccusedList = savedFir?.accusedDetails;
  let reportData = {};

  // eslint-disable-next-line default-case
  switch (fileName) {
    case "Notice_To_Complainant_on_delete":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        AccusedList: AccusedList,
        dateOfNotice: formData?.dateOfNotice
          ? moment(formData?.dateOfNotice).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...res };
      break;
    case "Notice_To_Complainant":
      const res1 = {
        courtName: formData?.courtName ? formData?.courtName : "",
        dateOfNotice: formData?.dateOfNotice
          ? moment(formData?.dateOfNotice).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...res1 };
      break;
  }
  return reportData;
};
