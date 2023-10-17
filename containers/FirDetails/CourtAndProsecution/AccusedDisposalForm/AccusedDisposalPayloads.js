export const addAccusedDisposalPayload = (
  values,
  crimeId,
  accusedId,
  updateChargesheetId,
  chargesheetId,
  actsAndSections
) => {
  const actsAndSectionlist = actsAndSections.map((val) => {
    const result = {
      actDescription: val?.actDescription,
      section: val?.section,
      rwRequired: val?.rwRequired,
    };
    return result;
  });

  const result = {
    crimeId: crimeId,
    accusedId: accusedId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    dateOfJudgement: values.dateOfJudgement,
    fingerPrintsTaken: values.fingerPrintsTaken,
    disposalType: values.disposalType,
    typeOfPunishment: values.typeOfPunishment,
    accusedPunishmentPeriod: values.accusedPunishmentPeriod,
    fineAmount: values.fineAmount,
    accusedBondPeriod: values.accusedBondPeriod,
    actsAndSections: actsAndSectionlist,
    remarks: values.remarks,
  };
  return result;
};

export const updateAccusedDisposalPayload = (
  values,
  crimeId,
  accusedId,
  updateChargesheetId,
  chargesheetId,
  id,
  actsAndSections
) => {
  const actsAndSectionlist = actsAndSections.map((val) => {
    const result = {
      actDescription: val?.actDescription,
      section: val?.section,
      rwRequired: val?.rwRequired,
    };
    return result;
  });

  const result = {
    accusedDisposalId: id,
    crimeId: crimeId,
    accusedId: accusedId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    dateOfJudgement: values.dateOfJudgement,
    fingerPrintsTaken: values.fingerPrintsTaken,
    disposalType: values.disposalType,
    typeOfPunishment: values.typeOfPunishment,
    accusedPunishmentPeriod: values.accusedPunishmentPeriod,
    fineAmount: values.fineAmount,
    accusedBondPeriod: values.accusedBondPeriod,
    actsAndSections: actsAndSectionlist,
    remarks: values.remarks,
  };
  return result;
};
