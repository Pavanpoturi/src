export const addFramingOfChargesPayload = (
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
    isCaseDisposed: values?.isCaseDisposed,
    disposalOfAllAccused: values?.disposalForAccused,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};

export const updateFramingOfChargesPayload = (
  values,
  crimeId,
  accusedDetails,
  selectedPerson,
  courtCaseDiaryId
) => {
  const result = {
    courtCaseDiaryId: courtCaseDiaryId,
    crimeId: crimeId,
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
    isCaseDisposed: values?.isCaseDisposed,
    disposalOfAllAccused: values?.disposalForAccused,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};
