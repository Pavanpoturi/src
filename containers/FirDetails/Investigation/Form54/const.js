import {
  TemplateAcknowledgement,
  TemplateRoadAccidentInsurance,
  TemplateDetailedAccidentReport,
} from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty } from "lodash";
import {
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";

export const form54Templates = [
  {
    name: "Acknowledgement_template_letter",
    label: "Acknowledgement template letter",
    fileName: "Acknowledgement_template_letter",
    templateAvailable: true,
  },
  {
    name: "Road_accident_insurance_template_letter",
    label: "Form-1",
    fileName: "Road_accident_insurance_template_letter",
    templateAvailable: true,
  },
  {
    name: "Detailed_Accident_Report_template_letter",
    label: "Form-2",
    fileName: "Detailed_Accident_Report_template_letter",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Acknowledgement_template_letter":
      return <TemplateAcknowledgement fileName={filename} data={data} />;
    case "Road_accident_insurance_template_letter":
      return <TemplateRoadAccidentInsurance fileName={filename} data={data} />;
    case "Detailed_Accident_Report_template_letter":
      return <TemplateDetailedAccidentReport fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser,
  firDetails,
  savedFir
) => {
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
    policeStation: selectedFir?.psName ? showPSName(selectedFir?.psName) : "",
    district: selectedFir?.district,
    firNumber: selectedFir?.firNum,
    sectionOfLaw: secdata,
    IOName: selectedFir?.briefFacts
      ? getIONameAndRank(selectedFir?.briefFacts)
      : "",
  };
  let reportData = {};
  switch (fileName) {
    case "Acknowledgement_template_letter":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        userDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
        firDate: selectedFir?.occurenceOfOffence?.firDate,
        firDetails: firDetails,
        savedFir: savedFir,
      };
      reportData = { ...commonReportData, ...res };
      break;
    case "Road_accident_insurance_template_letter":
      const response = {
        courtName: formData?.courtName ? formData?.courtName : "",
        userDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
        firDate: selectedFir?.occurenceOfOffence?.firDate,
        firDetails: firDetails,
      };
      reportData = { ...commonReportData, ...response };
      break;
    case "Detailed_Accident_Report_template_letter":
      const result = {
        courtName: formData?.courtName ? formData?.courtName : "",
        userDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
        firDate: selectedFir?.occurenceOfOffence?.firDate,
        firDetails: firDetails,
      };
      reportData = { ...commonReportData, ...result };
      break;
    default:
  }
  return reportData;
};
