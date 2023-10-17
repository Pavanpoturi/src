import { isString, isArray, isEmpty } from "lodash";

import { IS_SHO, IS_CI, IS_DSP } from "@containers/FirDetails/fir-util";

export const advisoryTableConfig = [
  "S.No",
  "PsName",
  "Cr.No",
  "sectionOfLaw",
  "advisoryMemoIssuedBy",
  "advisoryMemoIssuedTo",
  "advisoryMemo",
  "complianceTime",
  "remarks",
  "complianceReport",
  "complianceRemark",
  "complianceStatus",
  "workflowStatus",
  "actions",
];
export const adviosoryAckTable = [
  {
    type: "advisoryAck",
    typeName: "advisory-and-ack",
    data: [
      "S.No",
      "Cr.No",
      "sectionOfLaw",
      "dateOfInitiation",
      "natureOfAck",
      "dateOfAck",
      "requestFromPS",
      "workflowStatus",
      "remarks",
    ],
  },
];

export const advisoryHistoryTableConfig = [
  "remarkDate",
  "remarkFrom",
  "remarkTo",
  "status",
  "Remark",
  "uploadedDocs",
];

export const actionList = ["Acknowledged", "Returned with Remarks"];

export const dataType = {
  IO: "IO",
  SI: "SI",
  CI: "CI",
  ACP: "ACP",
  ACKNOWLEDGED: "Acknowledged",
  RETURN_WITH_REMARKS: "Returned with Remarks",
  ACP_RETURN_WITH_REMARKS: "ACP Returned with Remarks",
  CI_RETURN_WITH_REMARKS: "CI Returned with Remarks",
  SI_RETURN_WITH_REMARKS: "SI Returned with Remarks",
  PENDING_WITH_SI: "Pending with SI",
  PENDING_WITH_CI: "Pending with CI",
  PENDING_WITH_ACP: "Pending with ACP",
};

export const getRoleName = (selectedItem, currentUser) => {
  let roleVal = "";
  const advisoryWith = selectedItem?.with;
  const employeeRoleName = currentUser?.emp_role_name;
  if (advisoryWith === dataType.SI && employeeRoleName === IS_SHO) {
    roleVal = dataType.SI;
  } else if (advisoryWith === dataType.CI && employeeRoleName === IS_CI) {
    roleVal = dataType.CI;
  } else if (advisoryWith === dataType.ACP && employeeRoleName === IS_DSP) {
    roleVal = dataType.ACP;
  } else if (advisoryWith === dataType.IO && employeeRoleName === "RECEPTION") {
    roleVal = dataType.IO;
  } else {
    roleVal = "";
  }
  return roleVal;
};

export const getAdvisoryInstructionRoleName = (selectedItem, currentUser) => {
  let roleVal = "";
  const instructionTo = selectedItem?.instructionTo;
  const employeeRoleName = currentUser?.emp_role_name;
  if (instructionTo === dataType.SI && employeeRoleName === IS_SHO) {
    roleVal = dataType.SI;
  } else if (instructionTo === dataType.CI && employeeRoleName === IS_CI) {
    roleVal = dataType.CI;
  } else if (instructionTo === dataType.ACP && employeeRoleName === IS_DSP) {
    roleVal = dataType.ACP;
  } else if (
    instructionTo === dataType.IO &&
    employeeRoleName === "RECEPTION"
  ) {
    roleVal = dataType.IO;
  } else {
    roleVal = "";
  }
  return roleVal;
};

export const enableReturnWithRemarkActions = (item, activeUser) => {
  const withCurrentRole = getRoleName(item?.advisory?.workflow, activeUser);
  const workFlow = item?.advisory?.workflow;
  const withWhoom = workFlow?.with;
  const workflowStatus = workFlow?.status;
  const isACPReturned =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.ACP_RETURN_WITH_REMARKS;
  const isCIReturned =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.CI_RETURN_WITH_REMARKS;
  const isSIReturned =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.SI_RETURN_WITH_REMARKS;
  const enableAction = isACPReturned || isCIReturned || isSIReturned;
  return enableAction;
};

export const enablePendingWithActions = (item, activeUser) => {
  const withCurrentRole = getRoleName(item?.advisory?.workflow, activeUser);
  const workFlow = item?.advisory?.workflow;
  const withWhoom = workFlow?.with;
  const workflowStatus = workFlow?.status;
  const isPendingWithACP =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.PENDING_WITH_ACP;
  const isPendingWithCI =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.PENDING_WITH_CI;
  const isPendingWithSI =
    withWhoom === withCurrentRole &&
    workflowStatus === dataType.PENDING_WITH_SI;
  const enableAction = isPendingWithACP || isPendingWithCI || isPendingWithSI;
  return enableAction;
};

export const joinStrings = (
  strings = [],
  wrapString = null,
  separator = ", "
) => {
  if (isArray(strings)) {
    const filteredStrings = strings.filter(
      (str) => isString(str) && !isEmpty(str)
    );
    let joinedString = filteredStrings.join(separator);
    if (!isEmpty(joinedString) && isArray(wrapString))
      if (isString(wrapString?.[0]) && isString(wrapString?.[1]))
        joinedString = wrapString[0] + joinedString + wrapString[1];
    return joinedString;
  }
  return "";
};
