const getPayload = (values) => {
  const result = {
    informationReceivedDate: values.informationReceivedDate,
    additionalMemoDate: values.additionalMemoDate,
    courtName: values.courtName,
    graveParticulars: values.graveParticulars,
    totalPropertyValue: values.totalPropertyValue,
    dateOfDispatchToCourt: values.dateOfDispatchToCourt,
    userDate: values.userDate,
  };
  return result;
};

export const addAdditionalMemoPayload = (values, crimeId) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};

export const updateAdditionalMemoPayload = (values, crimeId, id) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};
