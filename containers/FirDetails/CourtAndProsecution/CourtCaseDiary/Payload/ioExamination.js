export const addIoExaminationPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  ioExaminationAccusedData,
  ioExaminationIoData,
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
    personDefenseCounsel: selectedPerson?.personalDetails?.name
      ? selectedPerson
      : null,
    accusedDetails: ioExaminationAccusedData,
    ioDetails: ioExaminationIoData,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};

export const updateIoExaminationPayload = (
  values,
  crimeId,
  ioExaminationAccusedData,
  ioExaminationIoData,
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
    personDefenseCounsel: selectedPerson?.personalDetails?.name
      ? selectedPerson
      : null,
    accusedDetails: ioExaminationAccusedData,
    ioDetails: ioExaminationIoData,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };
  return result;
};
