import { TemplateBailOppositionsRequisition } from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

export const bailOppositionsTemplates = [
  {
    name: "Generate Bail Oppositions Requisition",
    label: "Generate Bail Oppositions Requisition",
    fileName: "Bail_Oppositions_Requisition",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Bail_Oppositions_Requisition":
      return (
        <TemplateBailOppositionsRequisition fileName={filename} data={data} />
      );
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
  const { name, surname } =
    !isNull(formData) && formData?.accusedId?.personalDetails;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
  switch (fileName) {
    case "Bail_Oppositions_Requisition":
      const res = {
        dateOfFiling: formData?.dateOfFiling ? formData?.dateOfFiling : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        courtName: formData?.courtName,
        dateOfOpposed: formData?.dateOfOpposed ? formData?.dateOfOpposed : "",
      };
      reportData = { ...commonReportData, ...res };
      break;
    default:
  }
  return reportData;
};

export const bailOppositionsForm = [
  {
    name: "dateOfFiling",
    label: "Date & Time of Filing",
    placeholder: "Select Date & Time",
    type: "date",
  },
  {
    name: "courtName",
    label: "Court Name",
    type: "dropdown",
  },
  {
    name: "dateOfOpposed",
    label: "Date when Bail Opposed",
    placeholder: "Select Date",
    type: "date",
  },
  { name: "argumentsHeldBy", label: "Arguments Held By", type: "dropdown" },
];
