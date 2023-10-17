const getPayload = (values) => {
  const result = {
    reason: values.reason,
    natureOfEvidence: values.natureOfEvidence,
    slNo: values.slNo,
    date: values.date,
    dateOfFiling: values.dateOfFiling,
    courtOrderNo: values.courtOrderNo,
    courtOrderDate: values.courtOrderDate,
  };
  return result;
};

export const addReopeningOfCasePayload = (values, crimeId) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};

export const updateReopeningOfCasePayload = (values, crimeId, id) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    ...getPayload(values),
  };
  return result;
};
