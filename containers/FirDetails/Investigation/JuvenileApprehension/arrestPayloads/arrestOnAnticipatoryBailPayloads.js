const getArrestOnAnticipatoryBail = (
  values,
  suretyDetails,
  uploadCourtConditions
) => {
  const result = {
    accusedCode: values.accusedCode,
    isCCL: true,
    dateAndTimeOfSurrender: values.dateAndTimeOfSurrender,
    isInjured: values.isInjured,
    descriptionOfInjuries: values.descriptionOfInjuries,
    bailOrderNumber: values.bailOrderNumber,
    bailOrderDate: values.bailOrderDate,
    courtName: values.courtName,
    uploadCourtConditions: uploadCourtConditions,
    conditionsImposed: values.conditionsImposed,
    toAppearBeforeIo: values.toAppearBeforeIo,
    selectDaysOfWeek: values.selectDaysOfWeek,
    selectPeriod: values.selectPeriod,
    cooperateWithIo: values.cooperateWithIo,
    suretyDetails: suretyDetails,
  };
  return result;
};

export const addArrestOnAnticipatoryBailPayload = (
  values,
  crimeId,
  suretyDetails,
  uploadCourtConditions
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    isCCL: true,
    arrestOnAnticipatoryBail: getArrestOnAnticipatoryBail(
      values,
      suretyDetails,
      uploadCourtConditions
    ),
  };
  return result;
};

export const updateArrestOnAnticipatoryBailPayload = (
  values,
  crimeId,
  arrestId,
  suretyDetails,
  uploadCourtConditions
) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    isCCL: true,
    arrestOnAnticipatoryBail: getArrestOnAnticipatoryBail(
      values,
      suretyDetails,
      uploadCourtConditions
    ),
  };
  return result;
};
