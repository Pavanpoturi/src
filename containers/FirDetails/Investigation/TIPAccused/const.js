import { isNull, isEmpty } from "lodash";
import {
  GenerateRequisitionforCourt,
  RequisitiontoCourt,
} from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";

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
    case "Generate_Requisition_for_Court":
      return <GenerateRequisitionforCourt fileName={filename} data={data} />;
    case "Requisition_to_Court":
      return <RequisitiontoCourt fileName={filename} data={data} />;
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
  const complainantList = savedFir?.complainantDetails;
  let { complainantname, complainantaddress } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      complainantname =
        data?.person?.personalDetails?.name +
        " " +
        data?.person?.personalDetails?.surname;
      const { presentAddress } = !isNull(data?.person) && data?.person;
      complainantaddress = getPersonAddressTemplate(presentAddress);
    });

  let reportData = {};
  switch (fileName) {
    case "Generate_Requisition_for_Court":
      const resultRequistion = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...formData, ...resultRequistion };
      break;
    case "Requisition_to_Court":
      reportData = { ...commonReportData, ...formData };
      break;
    default:
  }
  return reportData;
};
