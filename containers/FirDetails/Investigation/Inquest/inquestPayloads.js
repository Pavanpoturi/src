const getPayload = (values, formUrl, inquestFormMedia,inquestConductedByLocation) => {
  const result = {
    deceasedType: values.deceasedType,
    unknownDeceased: values.unknownDeceased,
    placeOfInquest: values.placeOfInquest,
    inquestHeldBy: values.inquestHeldBy,
    witnessOrRelatives: values.witnessOrRelatives,
    hospitalName: values.hospitalName,
    hospitalLocation: values.hospitalLocation,
    doctorName: values.doctorName,
    natureOfDeath: values.natureOfDeath,
    methodOfDeath: values.methodOfDeath,
    apparentCauseOfDeath: values.apparentCauseOfDeath,
    methodOfDeathSubReason: values.reasonSubType ? values.reasonSubType : null,
    apparentCauseOfDeathSubReason: values.apprentSubType
      ? values.apprentSubType
      : null,
    custodialApparent: values.custodialApparent
      ? values.custodialApparent
      : null,
    custodialReason: values.custodialReason ? values.custodialReason : null,
    inquestCommenced: values.inquestCommenced,
    inquestConcluded: values.inquestConcluded,
    inquestFormURL: formUrl,
    inquestFormMedia: inquestFormMedia,
    inquestHeldByOthers:inquestConductedByLocation,
  };
  return result;
};

export const addInquestPayload = (
  values,
  crimeId,
  inquestConductedByLocation,
  formUrl,
  inquestFormMedia
) => {
  const result = {
    crimeId: crimeId,
    victimId: [values.victimId],
    escortPC: [values.escortPC],
    ...getPayload(values, formUrl, inquestFormMedia,inquestConductedByLocation),
  };

  return result;
};

export const updateInquestPayload = (
  values,
  crimeId,
  inquestConductedByLocation,
  id,
  formUrl,
  inquestFormMedia,
  victimId
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    victimId: victimId,
    escortPC: values.escortPC,
    ...getPayload(values, formUrl, inquestFormMedia,inquestConductedByLocation),
  };
  return result;
};
