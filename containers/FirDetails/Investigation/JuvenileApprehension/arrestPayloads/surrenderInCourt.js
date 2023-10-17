const getSurrenderInCourt = (values, suretyDetails) => {
  const result = {
    sendToJudicialCustody:
      values.surrenderInCourtType === "judicialcustody" ? true : false,
    courtName: values.courtName,
    dateTime: values.dateTime,
    releasedOnBail:
      values.surrenderInCourtType === "releasedonbail" ? true : false,
    judicialCustody: {
      numberOfDays: values.numberOfDays,
      underTrialNo: values.underTrialNo,
      JailName: values.JailName,
      dateTime: values.dateTimeJudicialcustody,
    },
    onBail: {
      conditionsImposed: values.conditionsImposed,
      disNumberOfCourt: values.disNumberOfCourt,
      courtName: values.courtName,
      toAppearBeforeIo: values.toAppearBeforeIo,
      dateTime: values.dateTimeReleaseonBail,
      cooperateWithIo: values.cooperateWithIo,
      selectDaysOfWeek: values.selectDaysOfWeek,
      selectPeriod: values.selectPeriod,
    },
    suretyDetails: suretyDetails,
  };
  return result;
};

export const addSurrenderInCourtPayload = (values, crimeId, suretyDetails) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    isCCL: true,
    surrenderInCourt: getSurrenderInCourt(values, suretyDetails),
  };

  return result;
};

export const updateSurrenderInCourtPayload = (
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
    isCCL: true,
    surrenderInCourt: getSurrenderInCourt(values, suretyDetails),
  };

  return result;
};
