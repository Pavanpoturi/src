const getPayload = (crimeId, values, grantedState, uploadDocURL) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    dateOfFiling: values.dateOfFiling,
    courtName: values.courtName,
    dateOfOpposed: values.dateOfOpposed,
    argumentsHeldBy: values.argumentsHeldBy,
    writtenArgumentsFiled: values.writtenArgumentsFiled,
    uploadDocURL: uploadDocURL,
    bailGranted: grantedState === "Bail Granted" ? true : false,
    bailPleaDismissed: grantedState === "Bail Plea Dismissed" ? true : false,
    conditionsImposed: values.conditionsImposed,
    toAppearBeforeIo: values.toAppearBeforeIo,
    selectDaysOfWeek: values.selectDaysOfWeek,
    selectPeriod: values.selectPeriod,
    cooperateWithIo: values.cooperateWithIo,
  };
  return result;
};

export const addBailOppositionsPayload = (
  values,
  crimeId,
  grantedState,
  uploadDocURL
) => {
  const result = getPayload(crimeId, values, grantedState, uploadDocURL);
  return result;
};

export const updateBailOppositionsPayload = (
  values,
  crimeId,
  id,
  grantedState,
  uploadDocURL
) => {
  const result = {
    _id: id,
    ...getPayload(crimeId, values, grantedState, uploadDocURL),
  };
  return result;
};
