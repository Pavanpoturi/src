export const addJugmentPayload = (
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
    isLastCCD: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    remarks: values?.remarks,
    postedFor: values?.postedFor,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};

export const updateJugmentPayload = (
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
    isLastCCD: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    remarks: values?.remarks,
    postedFor: values?.postedFor,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};
