import { TemplateExtensionReport } from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  DATE_FORMAT,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
export const extensionReportTemplates = [
  {
    name: "Generate Extension Report",
    label: "Generate Extension Report",
    fileName: "Extension_report",
    templateAvailable: true,
  },
];

export const extensionReportForm = [
  {
    name: "requestForExtensionDate",
    label: "Date of Filing Request for Remand Extension",
    placeholder: "Select Date",
    type: "date",
  },
  { name: "courtName", label: "Court Name", type: "dropdown" },
  { name: "remandExtensionDays", label: "Remand Extension Days", type: "text" },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Extension_report":
      return <TemplateExtensionReport fileName={filename} data={data} />;
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

  const personalDetails = formData && formData?.accusedId?.personalDetails;
  const accusedName =
    formData &&
    `${personalDetails.name ? personalDetails.name : ""} ${
      personalDetails.surname ? personalDetails.surname : ""
    }`;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedCode = !isNull(formData) && formData?.accusedCode;

  switch (fileName) {
    case "Extension_report":
      const data = {
        courtName: formData?.courtName || "",
        accusedName: accusedName,
        accusedCode: accusedCode || "",
        personAddress: personAddress,
        extensiondate: formData?.requestForExtensionDate
          ? moment(formData?.requestForExtensionDate).format(DATE_FORMAT)
          : "",
        extensiondays: formData?.remandExtensionDays
          ? formData?.remandExtensionDays
          : 14,
      };
      reportData = { ...commonReportData, ...data };
      break;
    default:
  }
  return reportData;
};

export const remandList = [
  { label: "RD01" },
  { label: "RD02" },
  { label: "RD03" },
  { label: "RD04" },
  { label: "RD05" },
  { label: "RD06" },
  { label: "RD07" },
  { label: "RD08" },
  { label: "RD09" },
  { label: "RD10" },
];
