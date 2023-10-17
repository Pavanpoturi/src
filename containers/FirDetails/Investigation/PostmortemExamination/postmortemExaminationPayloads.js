const getPayload = (
  crimeId,
  values,
  pmeReportURL,
  pmeMedia,
  pmeConductedDetails,
  selectedDeceasedValue
) => {
  const result = {
    crimeId: crimeId,
    deceasedType: values.deceasedType,
    graveParticulars: values.graveParticulars,
    deceasedPersonId: [selectedDeceasedValue],
    timeOfPME: values.timeOfPME,
    placeOfPME: values.placeOfPME,
    disposalOfBody: values.disposalOfBody,
    pmeConductedBy: pmeConductedDetails,
    pmeNumber: values.pmeNumber,
    hospitalName: values.hospitalName,
    hospitalLocation: values.hospitalLocation,
    finalOpinion: values.finalOpinion,
    pmeReportURL: pmeReportURL,
    pmeMedia: pmeMedia,
    userDate: values.userDate,
  };
  return result;
};

export const addPostmortemExaminationPayload = (
  values,
  crimeId,
  pmeReportURL,
  pmeMedia,
  pmeConductedDetails,
  selectedDeceasedValue
) => {
  const result = {
    escortPC: [values.escortPC],
    ...getPayload(
      crimeId,
      values,
      pmeReportURL,
      pmeMedia,
      pmeConductedDetails,
      selectedDeceasedValue
    ),
  };

  return result;
};

export const updatePostmortemExaminationPayload = (
  values,
  crimeId,
  id,
  pmeReportURL,
  pmeMedia,
  pmeConductedDetails,
  selectedDeceasedValue
) => {
  const result = {
    _id: id,
    escortPC: values.escortPC,
    ...getPayload(
      crimeId,
      values,
      pmeReportURL,
      pmeMedia,
      pmeConductedDetails,
      selectedDeceasedValue
    ),
  };
  return result;
};
