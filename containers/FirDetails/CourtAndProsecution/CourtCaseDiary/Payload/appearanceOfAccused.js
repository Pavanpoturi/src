export const addAppearanceOfAccusedPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  accusedDetails,
  selectedPerson,
  trialFor
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    trialFor: trialFor,
    isAccusedSummonsIssued: values?.summonsIssuedAccused,
    dateOfTrial: values?.ccdDate,
    isIOPresent: values?.presentIO,
    ioCode: values?.iODetails?.paoCode,
    ioName: values?.iODetails?.employeeName,
    ioRank: values?.iODetails?.rankName,
    ioRole: values?.iODetails?.empRoleName,
    ioUnitId: values?.iODetails?.cctns_unit_id,
    ioMobileNo: values?.iODetails?.mobileNo,
    ioEmail: "",
    isPPPresent: values?.presentPP,
    ppName: values?.APPOName,
    ppRank: values?.rank,
    isDefenseCounselPresent: values?.defenseCounselPresent,
    personDefenseCounsel: selectedPerson,
    accusedDetails: accusedDetails,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
  };
  return result;
};

export const updateAppearanceOfAccusedPayload = (
  values,
  crimeId,
  accusedDetails,
  selectedPerson,
  courtCaseDiaryId
) => {
  const result = {
    courtCaseDiaryId: courtCaseDiaryId,
    crimeId: crimeId,
    isAccusedSummonsIssued: values?.summonsIssuedAccused,
    dateOfTrial: values?.ccdDate,
    isIOPresent: values?.presentIO,
    ioCode: values?.iODetails?.paoCode,
    ioName: values?.iODetails?.employeeName,
    ioRank: values?.iODetails?.rankName,
    ioRole: values?.iODetails?.empRoleName,
    ioUnitId: values?.iODetails?.cctns_unit_id,
    ioMobileNo: values?.iODetails?.mobileNo,
    ioEmail: "",
    isPPPresent: values?.presentPP,
    ppName: values?.APPOName,
    ppRank: values?.rank,
    isDefenseCounselPresent: values?.defenseCounselPresent,
    personDefenseCounsel: selectedPerson,
    accusedDetails: accusedDetails,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
  };
  return result;
};
