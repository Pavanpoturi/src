const getPayload = (values, otherData, selectedAccusedValue) => {
  const result = {
    summonsTo: values.summonsTo,
    issuedOn: values.issuedOn,
    dateOfTrial: values.dateOfTrial,
    datePSReceived: values.datePSReceived,
  };
  if (otherData?.length !== 0 && !!otherData) {
    Object.assign(result, { other: otherData });
  } else if (selectedAccusedValue?.length !== 0 && !!selectedAccusedValue) {
    Object.assign(result, { person: selectedAccusedValue });
  }
  return result;
};

export const addIssueOfSummonsPayload = (
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

export const updateIssueOfSummonsPayload = (
  values,
  crimeId,
  id,
  otherData,
  selectedAccusedValue,
  selectedCourtAndProsecution
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    chargesheetId: selectedCourtAndProsecution?._id,
    updateChargesheetId: selectedCourtAndProsecution?.updateChargesheetId,
    courtSummonsId: values?.courtSummonsId,
    ...getPayload(values, otherData, selectedAccusedValue),
  };
  return result;
};
