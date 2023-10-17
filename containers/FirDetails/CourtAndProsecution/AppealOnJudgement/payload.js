export const addAppealOnJudgementPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  data1
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    dateOfJudgement: values?.judgementDate,
    dateOfFilingForCertifiedCopies: values?.dateOfFiling,
    dateOfReceivingCertifiedCopies: values?.dateOfReceiving,
    dateOfSubmittingToPPForOpinion: values?.dateOfSubmittingPP,
    media: data1,
    natureOfOpinionOfPP: values?.natureOfOpinionPP,
    dateOfForwardingPPOpinionToUnitOffice: values?.dateOfForwordingJudgmentCopy,
    petitionFiledForAppeal: values?.petitionFiledAppeal,
    nameOfTheAppealCourt: values?.appealCourtName,
    appealOrders: values?.appealOrders,
    appealCourtNo: values?.appealCourtNo,
  };
  return result;
};

export const updateAppealOnJudgementPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  id,
  data1
) => {
  const result = {
    appealId: id,
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    dateOfJudgement: values?.judgementDate,
    dateOfFilingForCertifiedCopies: values?.dateOfFiling,
    dateOfReceivingCertifiedCopies: values?.dateOfReceiving,
    dateOfSubmittingToPPForOpinion: values?.dateOfSubmittingPP,
    media: data1,
    natureOfOpinionOfPP: values?.natureOfOpinionPP,
    dateOfForwardingPPOpinionToUnitOffice: values?.dateOfForwordingJudgmentCopy,
    petitionFiledForAppeal: values?.petitionFiledAppeal,
    nameOfTheAppealCourt: values?.appealCourtName,
    appealOrders: values?.appealOrders,
    appealCourtNo: values?.appealCourtNo,
  };
  return result;
};
