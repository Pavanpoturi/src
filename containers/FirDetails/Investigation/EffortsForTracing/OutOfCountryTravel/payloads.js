export const addUpdatePayload = (values) => {
  const result = {
    dateOfImmigrationRequisition: values.dateOfImmigrationRequisition,
    dateOfReply: values.dateOfReply,
    dateOfDeparture: values.dateOfDeparture,
    placeOfCountry: values.placeOfCountry,
    dateOfReaching: values.dateOfReaching,
    result: values.result,
  };
  return result;
};
