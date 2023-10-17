import { TemplateppOpinionform67 } from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty } from "lodash";
import {
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import moment from "moment";

export const RequisitionToPPTemplates = [
  {
    name: "Requisition to PP",
    label: "Requisition to PP (Form 67)",
    fileName: "Requisition_to_PP",
    templateAvailable: true,
  },
];

export const PPOpinionForm = [
  {
    name: "ppName",
    label: "Name of the PP",
    actionLink: "addProfessional",
    actionName: "Add Professional",
    type: "dropdown",
  },
  {
    name: "courtName",
    label: "Court Name",
    type: "dropdown",
  },
  {
    name: "dateOfSendingCD",
    label: "Date of sending CD file to PP",
    type: "date",
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Requisition_to_PP":
      return <TemplateppOpinionform67 fileName={filename} data={data} />;
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

  let reportData = {};
  switch (fileName) {
    case "Requisition_to_PP":
      const resTahsildar = {
        dateOfSendingCD: formData?.dateOfSendingCD
          ? moment(formData?.dateOfSendingCD).format(DATE_FORMAT)
          : "",
      };
      reportData = { ...commonReportData, ...resTahsildar };
      break;

    default:
  }
  return reportData;
};
