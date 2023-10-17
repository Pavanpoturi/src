import {
  Requisitions,
  GenerateReceipt,
  GenerateLetterOfAdvice,
  GenerateForm60,
  LetterToExpert,
  LetterToACP,
  CourtLetterToFSL,
} from "@containers/GenerateTemplates";
import { isEmpty, first } from "lodash";
import {
  showPSName,
  getIONameAndRank,
  getTemplatesSectionsData,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

export const CasePropertyTemplates = [
  {
    name: "Generate Form 60",
    label: "Generate Form 60",
    displayVal: "Form 60",
    fileName: "Generate_Form_60",
    fieldName: "generateForm60",
    templateAvailable: true,
  },
];

export const forwardingThroughACPList = [
  {
    name: "Generate Letter to ACP",
    label: "Generate Letter to ACP",
    displayVal: "Letter to ACP",
    fileName: "Generate_Letter_to_ACP",
    fieldName: "generateLetterToACP",
    templateAvailable: true,
  },
  {
    name: "Generate Letter of Advice",
    label: "Generate Letter of Advice",
    displayVal: "Letter of Advice",
    fileName: "Generate_Letter_of_Advice",
    fieldName: "generateLetterOfAdvice",
    templateAvailable: true,
  },
];

export const forwardingThroughCourtList = [
  {
    name: "Generate Court Letter to FSL",
    label: "Generate Court Letter to FSL",
    displayVal: "Court Letter to FSL",
    fileName: "Generate_Court_Letter_to_FSL",
    fieldName: "generateCourtLetterToFSL",
    templateAvailable: true,
  },
  {
    name: "Generate Letter of Advice",
    label: "Generate Letter of Advice",
    displayVal: "Letter of Advice",
    fileName: "Generate_Letter_of_Advice",
    fieldName: "generateLetterOfAdvice",
    templateAvailable: true,
  },
  {
    name: "Generate Form 60",
    label: "Generate Form 60",
    displayVal: "Form 60",
    fileName: "Generate_Form_60",
    fieldName: "generateForm60",
    templateAvailable: true,
  },
];

export const LetterToExpertTemplate = [
  {
    name: "Generate Letter of Expert",
    label: "Generate Letter of Expert",
    displayVal: "Letter of Expert",
    fileName: "Generate_Letter_of_Expert",
    fieldName: "generateLetterOfExpert",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Generate_Receipt":
      return <GenerateReceipt fileName={filename} data={data} />;
    case "Generate_Letter_of_Advice":
      return <GenerateLetterOfAdvice fileName={filename} data={data} />;
    case "Generate_Form_60":
      return <GenerateForm60 fileName={filename} data={data} />;
    case "Requisitions":
      return <Requisitions fileName={filename} data={data} />;
    case "Generate_Letter_of_Expert":
      return <LetterToExpert fileName={filename} data={data} />;
    case "Generate_Letter_to_ACP":
      return <LetterToACP fileName={filename} data={data} />;
    case "Generate_Court_Letter_to_FSL":
      return <CourtLetterToFSL fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const dataType = {
  SI: "SI (SHO)",
  CI: "CI",
  ACP: "ACP",
  RETURN_WITH_REMARKS: "Returned with Remarks",
  FORWARDED_TO_FSL: "Forwarded to FSL",
  CI_RETURN_WITH_REMARKS: "CI Returned with Remarks",
  SI_RETURN_WITH_REMARKS: "SI (SHO) Returned with Remarks",
  PENDING_WITH_SI: "Pending with SI (SHO)",
  PENDING_WITH_CI: "Pending with CI",
  PENDING_WITH_ACP: "Pending with ACP",
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  savedFir,
  otherQuestion
) => {
  const { firNum, district, psName, briefFacts } = selectedFir;
  const selectedActsData = loadState("selectedActDetails");
  const section = selectedFir?.actsAndSections.map(function (i) {
    return i.section;
  });
  const merged = [].concat.apply([], section);
  const actsSections = merged?.toString();
  const secdata = !isEmpty(actsSections)
    ? getTemplatesSectionsData(selectedActsData?.uniqActs)
    : selectedFir?.section;

  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    savedFir: savedFir,
    IOName: getIONameAndRank(briefFacts),
  };

  let reportData = {};
  switch (fileName) {
    case "Generate_Form_60":
      reportData = { ...commonReportData, formData };
      break;
    case "Generate_Letter_of_Advice":
      reportData = {
        ...commonReportData,
        formData,
        otherQuestion: !isEmpty(otherQuestion) && first(otherQuestion),
      };
      break;
    case "Requisitions":
      reportData = { ...commonReportData, formData };
      break;
    case "Generate_Letter_of_Expert":
      reportData = { ...commonReportData, formData };
      break;
    case "Generate_Letter_to_ACP":
      reportData = { ...commonReportData, formData };
      break;
    case "Generate_Court_Letter_to_FSL":
      reportData = { ...commonReportData, formData };
      break;
    default:
  }
  return reportData;
};

export const sendToCourtDrop = [
  "Diffused/Destruction",
  "Release To Victim/Accused",
  "Safe Custody To Police",
];

export const forwardingThroughList = ["ACP", "Court"];
