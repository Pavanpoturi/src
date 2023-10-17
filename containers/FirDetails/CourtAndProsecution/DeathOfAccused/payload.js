export const addDeathOfAccusedPayload = (
  values,
  crimeId,
  data1,
  data2,
  updateChargesheetId,
  chargesheetId
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    dateOfTrial: values.dateOfTrial,
    dateOfDeath: values.dateOfDeath,
    dateOfFilingReportWithCopyOfDeathCertificate:
      values.dateOfFilingReportWithCopyOfDeathCertificate,
    deathCertificate: data1,
    ordersOfCourt: data2,
    chargesheetId,
    updateChargesheetId,
  };
  return result;
};

export const updateDeathOfAccusedPayload = (
  values,
  crimeId,
  data1,
  data2,
  id,
  updateChargesheetId,
  chargesheetId
) => {
  const result = {
    deathOfAccusedId: id,
    crimeId: crimeId,
    accusedId: values.accusedId,
    dateOfTrial: values.dateOfTrial,
    dateOfDeath: values.dateOfDeath,
    dateOfFilingReportWithCopyOfDeathCertificate:
      values.dateOfFilingReportWithCopyOfDeathCertificate,
    deathCertificate: data1,
    ordersOfCourt: data2,
    chargesheetId,
    updateChargesheetId,
  };
  return result;
};
