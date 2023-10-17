const getPayload = (values, otherData, selectedAccusedValue) => {
  const result = {
    warrantsTo: values.warrantsTo,
    warrantType: values.warrantType,
    dateOfTrial: values.dateOfTrial,
    warrantIssuedDate: values.warrantIssuedDate,
    psReceivedDate: values.psReceivedDate,
  };
  if (otherData?.length !== 0 && !!otherData) {
    Object.assign(result, { other: otherData });
  } else if (selectedAccusedValue?.length !== 0 && !!selectedAccusedValue) {
    Object.assign(result, { person: selectedAccusedValue });
  }
  return result;
};

export const addIssueOfWarrantPayload = (
  values,
  crimeId,
  otherData,
  selectedAccusedValue,
  selectedCourtAndProsecution
) => {
  const result = {
    crimeId: crimeId,
    chargesheetId: selectedCourtAndProsecution?._id,
    updateChargesheetId: selectedCourtAndProsecution?.updateChargesheetId,
    ...getPayload(values, otherData, selectedAccusedValue),
  };
  return result;
};

export const updateIssueOfWarrantPayload = (
  values,
  crimeId,
  otherData,
  selectedAccusedValue,
  selectedCourtAndProsecution
) => {
  const result = {
    crimeId: crimeId,
    chargesheetId: selectedCourtAndProsecution?._id,
    updateChargesheetId: selectedCourtAndProsecution?.updateChargesheetId,
    issueOfWarrantId: values?.issueOfWarrantId,
    ...getPayload(values, otherData, selectedAccusedValue),
  };
  return result;
};
