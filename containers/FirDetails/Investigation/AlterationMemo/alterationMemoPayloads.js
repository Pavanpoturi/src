const getPayload = (values, actsAndSections, majorAndMinor, grave) => {
  const result = {
    alteration: {
      gravity: grave,
      actsAndSections: actsAndSections,
      majorMinorClassification: majorAndMinor,
      alterationReason: {
        reasonForSectionAlteration: values.reasonForSectionAlteration,
        alterationDate: values.alterationDate,
        courtName: values.courtName,
        intimationToSuperior: values.intimationToSuperior,
        confirmAlteration: false,
      },
      dispatchToCourt: {
        dateOfRequest: values.dateOfRequest,
        fromCourtName: values.fromCourtName,
        transferredCourtName: values.transferredCourtName,
        dateOfTransfer: values.dateOfTransfer,
      },
      templates: [
        {
          mimeType: "",
          name: "",
          url: "",
          fileId: "",
        },
      ],
    },
  };
  return result;
};

export const addAlterationMemoPayload = (
  values,
  crimeId,
  actsAndSections,
  majorAndMinor,
  grave
) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values, actsAndSections, majorAndMinor, grave),
  };
  return result;
};

export const updateAlterationMemoPayload = (
  values,
  crimeId,
  id,
  actsAndSections,
  majorAndMinor,
  grave
) => {
  const result = {
    alterationId: id,
    crimeId: crimeId,
    ...getPayload(values, actsAndSections, majorAndMinor, grave),
  };
  return result;
};

export const confirmAlterationMemoPayload = (values, crimeId, id, grave) => {
  const result = {
    alterationId: id,
    crimeId: crimeId,
    alteration: {
      gravity: grave,
      actsAndSections: values.actsAndSections,
      majorMinorClassification: values.majorMinorClassification,
      alterationReason: {
        reasonForSectionAlteration:
          values.alterationReason.reasonForSectionAlteration,
        alterationDate: values.alterationReason.alterationDate,
        courtName: values.alterationReason.courtName,
        intimationToSuperior: values.alterationReason.intimationToSuperior,
        confirmAlteration: true,
      },
      dispatchToCourt: values.dispatchToCourt,
      templates: values.templates,
    },
  };
  return result;
};
