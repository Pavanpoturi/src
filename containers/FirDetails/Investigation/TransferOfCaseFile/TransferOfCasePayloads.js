const getPayload = (values) => {
  const result = {
    reason: values?.reason,
    transferTo: values?.transferOption,
    transferToName: !!values?.transferToName ? values?.transferToName : "",
    transferToPSCode: !!values?.transferToPSCode
      ? values?.transferToPSCode
      : "",
    reportDatedToUnitOfficerForTransfer:
      values?.reportDatedToUnitOfficerForTransfer,
    letterToUnitOfficer: values?.letterToUnitOfficer,
    statusOfCase: values?.statusofCase,
    requestedBy: values?.requestedBy,
    requestedByName: values?.requestedByName,
    requestedByRole: !!values?.requestedByRole ? values?.requestedByRole : "",
    requestedByRank: values?.requestedByRank,
    dateOfintimationToCourt: values?.dateOfintimationToCourt,
    intimationToCourt: values?.intimationToCourt,
    competentAuthorityDate: values.competentAuthorityDate,
    letterOfCompetentAuthority: {},
  };
  return result;
};

export const addTransferOfCasePayload = (values, crimeId) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};

export const updateTransferOfCasePayload = (values, crimeId, id) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};
