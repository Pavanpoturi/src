import { ACPLetterToFSL } from "@containers/GenerateTemplates";
import {
  showPSName,
  getIONameAndRank,
  getTemplatesSectionsData,
  actDatalocal,
  IS_SHO,
  IS_CI,
  IS_DSP,
} from "@containers/FirDetails/fir-util";
import { isEmpty, isUndefined } from "lodash";

export const actionList = ["Forwarded"];

export const transferOfCaseActionList = ["Forwarded", "Returned with Remarks"];

export const transferOfCaseInitietedActionList = ["Forwarded"];

export const uploadLetter = [
  {
    name: "Generate ACP Letter to FSL",
    label: "Generate ACP Letter to FSL",
    fileName: "Generate_ACP_Letter_To_FSL",
    templateAvailable: true,
  },
];

export const tableConfig = [
  {
    type: "fsl",
    typeName: "FSL",
    data: ["propertiesList", "letterToAcp", "letterOfAdvice"],
  },
  {
    type: "transFerofcase",
    typeName: "TransFerOfCase",
    data: ["slno", "lettertounitofficer"],
  },
];
export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Generate_ACP_Letter_To_FSL":
      return <ACPLetterToFSL fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (fileName, selectedFir, actList) => {
  if (!!selectedFir?.firDetail === true) {
    const firDetail = selectedFir?.firDetail;
    const selectedActsData =
      !isEmpty(actList) &&
      !isUndefined(firDetail) &&
      actDatalocal(firDetail, actList);
    const section = firDetail?.actsAndSections.map(function (i) {
      return i.section;
    });
    const merged = [].concat.apply([], section);
    const actsSections = merged?.toString();
    const secdata = !isEmpty(actsSections)
      ? getTemplatesSectionsData(selectedActsData?.uniqActs)
      : firDetail?.section;
    const commonReportData = {
      policeStation: showPSName(firDetail?.psName),
      district: firDetail?.district,
      firNumber: firDetail?.firNum,
      sectionOfLaw: secdata,
      IOName: getIONameAndRank(firDetail?.briefFacts),
    };

    let reportData = {};
    // switch (fileName) {
    //   case "Generate_ACP_Letter_To_FSL":
    reportData = commonReportData;
    //     break;
    //   default:
    // }
    return reportData;
  }
};

export const dataType = {
  SI: "SI (SHO)",
  CI: "CI",
  ACP: "ACP",
  RETURN_WITH_REMARKS: "Returned with Remarks",
  ACP_RETURN_WITH_REMARKS: "ACP Returned with Remarks",
  CI_RETURN_WITH_REMARKS: "CI Returned with Remarks",
  PENDING_WITH_CI: "Pending with CI",
  PENDING_WITH_ACP: "Pending with ACP",
};

export const getRoleName = (selectedItem, currentUser) => {
  let roleVal = "";
  if (
    selectedItem?.approvalAckWith === dataType.SI &&
    currentUser?.emp_role_name === IS_SHO
  ) {
    roleVal = dataType.SI;
  } else if (
    selectedItem?.approvalAckWith === dataType.CI &&
    currentUser?.emp_role_name === IS_CI
  ) {
    roleVal = dataType.CI;
  } else if (
    selectedItem?.approvalAckWith === dataType.ACP &&
    currentUser?.emp_role_name === IS_DSP
  ) {
    roleVal = dataType.ACP;
  }
  return roleVal;
};
