export const addCourtDisposalPayload = (
  values,
  crimeId,
  selectedPerson,
  updateChargesheetId,
  chargesheetId
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    disposalType: values?.disposalType,
    dateOfJudgement: values?.dateOfJudgement,
    judgeName: values?.judgeName,
    nameOfPPOrAPP: values?.nameOfPPOrAPP,
    appealPreferred: values?.appealPreferred,
    appealPreferredOthers: values?.appealPreferredOthers,
    personDefenseCounsel: selectedPerson,
  };
  return result;
};

export const updateCourtDisposalPayload = (
  values,
  crimeId,
  selectedPerson,
  updateChargesheetId,
  chargesheetId,
  courtDisposalFormId
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    courtDisposalFormId: courtDisposalFormId,
    chargesheetId: chargesheetId,
    disposalType: values?.disposalType,
    dateOfJudgement: values?.dateOfJudgement,
    judgeName: values?.judgeName,
    nameOfPPOrAPP: values?.nameOfPPOrAPP,
    appealPreferred: values?.appealPreferred,
    appealPreferredOthers: values?.appealPreferredOthers,
    personDefenseCounsel: selectedPerson,
  };
  return result;
};
