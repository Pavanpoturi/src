import { TemplateNotice160CrPC } from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

export const CRPC160Templates = [
  {
    name: "Generate notice u/s 160 Cr.P.C",
    label: "Generate notice u/s 160 Cr.P.C",
    fileName: "Notice_u/s_160_Cr.P.C",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Notice_u/s_160_Cr.P.C":
      return <TemplateNotice160CrPC fileName={filename} data={data} />;
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
  const { name, surname, gender } =
    !isNull(formData) && formData?.personId?.personalDetails;
  const { presentAddress } = !isNull(formData) && formData?.personId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
  switch (fileName) {
    case "Notice_u/s_160_Cr.P.C":
      const res = {
        dateOfIssue: formData?.dateOfIssue ? formData?.dateOfIssue : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        gender: gender || "",
      };
      reportData = { ...commonReportData, ...res };
      break;
    default:
  }
  return reportData;
};
