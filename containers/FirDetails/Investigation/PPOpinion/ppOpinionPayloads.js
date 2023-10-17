const getPayload = (values,selectedPerson, uploadOpinion) => {
  const result = {
    ppName: values.ppName,
    courtName: values.courtName,
    dateOfSendingCD: values.dateOfSendingCD,
    uploadOpinion: uploadOpinion,
    opinionOfPP: values.opinionOfPP,
    userDate: values.userDate,
    add_professional :selectedPerson
  };
  return result;
};

export const addPPOninionPayload = (values, crimeId,selectedPerson, uploadOpinion) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values,selectedPerson, uploadOpinion),
  };
  return result;
};

export const updatePPOninionPayload = (values, crimeId,selectedPerson, id, uploadOpinion) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    ...getPayload(values,selectedPerson, uploadOpinion),
  };
  return result;
};
