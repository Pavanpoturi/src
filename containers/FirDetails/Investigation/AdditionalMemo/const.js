import { TemplateAdditionalMemo } from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty } from "lodash";
import {
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";

export const additionalMemoTemplates = [
  {
    name: "Generate Additional Memo",
    label: "Generate Additional Memo",
    fileName: "Generate_Additional_Memo",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Generate_Additional_Memo":
      return <TemplateAdditionalMemo fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser
) => {
  const { firNum, district, psName, briefFacts } = selectedFir;
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
  };
  let reportData = {};
  switch (fileName) {
    case "Generate_Additional_Memo":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        userDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
      };
      reportData = { ...commonReportData, ...res };
      break;
    default:
  }
  return reportData;
};

export const additionalMemoForm = [
  {
    name: "informationReceivedDate",
    label: "Information Received Date",
    type: "date",
  },
  {
    name: "additionalMemoDate",
    label: "Additional Memo Date & Time",
    type: "date",
  },
  { name: "courtName", label: "Court Name", type: "dropdown" },
  { name: "graveParticulars", label: "Grave Particulars", type: "dropdown" },
  {
    name: "totalPropertyValue",
    label: "Total Property Value (Rs.)",
    type: "text",
  },
  {
    name: "dateOfDispatchToCourt",
    label: "Date of Dispatch to Court",
    type: "date",
  },
];
