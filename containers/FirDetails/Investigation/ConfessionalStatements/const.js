import { TemplateConfessionReport } from "@containers/GenerateTemplates";
import { showPSName, getIONameAndRank } from "@containers/FirDetails/fir-util";

export const confessionalStatementsForm = [
  { name: "panchWitness", label: "Panch Witnesses", type: "dropdown" },
  {
    name: "dateTimeofApprehension",
    label: "Date & Time of Apprehension",
    placeholder: "Select Date & Time",
    type: "date",
  },
  { name: "apprehendedBy", label: "Apprehended By", type: "dropdown" },
  { name: "placeOfApprehension", label: "Place of Apprehension", type: "text" },
  {
    name: "placeOfRecordingConfession",
    label: "Confession Recorded at",
    type: "dropdown",
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Confession_report":
      return <TemplateConfessionReport fileName={filename} data={data} />;
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
  const { firNum, section, district, psName, briefFacts } = selectedFir;
  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: section,
    IOName: getIONameAndRank(briefFacts),
  };
  let reportData = {};
  switch (fileName) {
    case "Confession_report":
      reportData = { ...commonReportData };
      break;
    default:
  }
  return reportData;
};
