const getHighCourtDirections = (values, courtOrderDocumentURL) => {
  const result = {
    dateTime: values?.dateTime,
    receivedDateTime: values?.receivedDateTime,
    icjsDetails: values?.icjsDetails,
    highCourtDirection: values?.highCourtDirection,
    conditionsImposed: values?.conditionsImposed,
    toAppearBeforeIo: values?.toAppearBeforeIo,
    cooperateWithIo: values?.cooperateWithIo,
    courtOrderDocumentURL: courtOrderDocumentURL,
    selectDaysOfWeek: values?.selectDaysOfWeek,
    selectPeriod: values?.selectPeriod,
  };
  return result;
};

export const addHighCourtDirectionsPayload = (
  values,
  crimeId,
  courtOrderDocumentURL
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    isCCL: true,
    highCourtDirections: getHighCourtDirections(values, courtOrderDocumentURL),
  };

  return result;
};

export const updateHighCourtDirectionsPayload = (
  values,
  crimeId,
  arrestId,
  courtOrderDocumentURL
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
    highCourtDirections: getHighCourtDirections(values, courtOrderDocumentURL),
  };

  return result;
};
