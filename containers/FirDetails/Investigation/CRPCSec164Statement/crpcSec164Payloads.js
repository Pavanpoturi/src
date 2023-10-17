const getPayload = (
  values,
  crimeId,
  selectedState,
  checkSummonState,
  supportingProsecutionState,
  magistrateNameDetails,
  crpcURL
) => {
  const result = {
    crimeId: crimeId,
    witnessOrAccusedId: values.witnessOrAccusedId,
    dateOfIssue: values.dateOfIssue,
    personType: selectedState,
    dateOfRequisitionToCourt: values.dateOfRequisitionToCourt,
    courtName: values.courtName,
    dateFixed: values.dateFixed,
    summonServed: checkSummonState === "Yes" ? true : false,
    dateRecorded: values.dateRecorded,
    magistrateName:
      magistrateNameDetails && magistrateNameDetails !== " "
        ? magistrateNameDetails
        : {},
    nameOfCourtRecorded: values.nameOfCourtRecorded,
    statementIsSupportingProsecution:
      supportingProsecutionState === "Yes" ? true : false,
    crpcURL: crpcURL,
    userDate: values.userDate,
  };
  return result;
};

export const addCRPC164Payload = (
  values,
  crimeId,
  selectedState,
  checkSummonState,
  supportingProsecutionState,
  magistrateNameDetails,
  crpcURL
) => {
  const result = getPayload(
    values,
    crimeId,
    selectedState,
    checkSummonState,
    supportingProsecutionState,
    magistrateNameDetails,
    crpcURL
  );
  return result;
};

export const updateCRPC164Payload = (
  values,
  crimeId,
  id,
  selectedState,
  checkSummonState,
  supportingProsecutionState,
  magistrateNameDetails,
  crpcURL
) => {
  const result = {
    _id: id,
    ...getPayload(
      values,
      crimeId,
      selectedState,
      checkSummonState,
      supportingProsecutionState,
      magistrateNameDetails,
      crpcURL
    ),
  };
  return result;
};
