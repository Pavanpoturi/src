const getSurrenderBeforeCourt = (values, suretyDetails) => {
  const result = {
    bailName: values.bailName,
    dateTime: values.dateTime,
    highCourtCRLNo: values.highCourtCRLNo,
    surrenderDateInLowerCourt: values.surrenderDateInLowerCourt,
    lowerCourtName: values.lowerCourtName,
    courtDISNo: values.courtDISNo,
    disDate: values.disDate,
    bailConditionsImposed: values.bailConditionsImposed,
    toAppearBeforeIo: values.toAppearBeforeIo,
    selectDaysOfWeek: values.selectDaysOfWeek,
    selectPeriod: values.selectPeriod,
    cooperateWithIo: values.cooperateWithIo,
    suretyDetails: suretyDetails,
  };
  return result;
};

export const addSurrenderBeforeCourtPayload = (
  values,
  crimeId,
  suretyDetails
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    surrenderBeforeCourt: getSurrenderBeforeCourt(values, suretyDetails),
  };

  return result;
};

export const updateSurrenderBeforeCourtPayload = (
  values,
  crimeId,
  arrestId,
  suretyDetails
) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    surrenderBeforeCourt: getSurrenderBeforeCourt(values, suretyDetails),
  };

  return result;
};
