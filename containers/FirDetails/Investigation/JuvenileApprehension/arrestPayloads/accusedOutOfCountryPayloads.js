const getAccusedOutOfCountry = (values, nbwURL) => {
  const result = {
    dateTime: values.dateTime,
    requestCourtNBW: {
      requestForNBW: values.requestForNBW,
      nbwStatus: values.nbwStatus,
      requestedOn: values.nbwRequestedDate,
      nbwReceivedDateTime: values.nbwReceivedDateTime,
      nbwURL: nbwURL,
    },
    requestToCircular: {
      requestForCircular: values.requestForCircular,
      circularStatus: values.circularStatus,
      requestedOn: values.circularRequestedDate,
      circularApprovedDate: values.circularApprovedDate,
    },
  };
  return result;
};

export const addAccusedOutOfCountryPayload = (values, crimeId, nbwURL) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    isCCL: true,
    accusedOutOfCountry: getAccusedOutOfCountry(values, nbwURL),
  };
  return result;
};

export const updateAccusedOutOfCountryPayload = (
  values,
  crimeId,
  arrestId,
  nbwURL
) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.action,
    internalFlag: false,
    isCCL: true,
    userDate: values.userDate,
    deleted: false,
    accusedOutOfCountry: getAccusedOutOfCountry(values, nbwURL),
  };
  return result;
};
