export const addDefenseWitnessExaminationPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  accusedDetails,
  selectedPerson,
  trialFor,
  witnessDetails
) => {
  const result = {
    crimeId: crimeId,
    chargesheetId: chargesheetId,
    updateChargesheetId: updateChargesheetId,
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
    defenseWitness: witnessDetails,
    accusedDetails: accusedDetails,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};

export const updateDefenseWitnessExaminationPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  accusedDetails,
  selectedPerson,
  trialFor,
  witnessDetails
) => {
  const result = {
    courtCaseDiaryId: "63f47de4e93a5e21b8194c4d",
    crimeId: crimeId,
    chargesheetId: chargesheetId,
    updateChargesheetId: updateChargesheetId,
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
    defenseWitness: witnessDetails,
    accusedDetails: accusedDetails,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    ioDetails: [],
    witnessDetails: [],
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};
