import { GenerateRequisitionforArticles } from "@containers/GenerateTemplates";
import { showPSName, getIONameAndRank } from "@containers/FirDetails/fir-util";

export const TIPAccusedTemplates = [
  {
    name: "Requisition to Court",
    label: "Requisition to Court",
    fileName: "Requisition_to_Court",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Requisition_to_Court":
      return <GenerateRequisitionforArticles fileName={filename} data={data} />;
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
    case "Requisition_to_Court":
      reportData = { ...commonReportData, ...formData };
      break;
    default:
  }
  return reportData;
};

export const natureOFItems = [
  { name: "Auto Mobile", type: "Item", itemId: "I3", url: "url3", _id: "1" },
  { name: "Electronics", type: "Item", itemId: "I2", url: "url2", _id: "2" },
  { name: "Explosives", type: "Item", itemId: "I1", url: "url1", _id: "3" },
];
