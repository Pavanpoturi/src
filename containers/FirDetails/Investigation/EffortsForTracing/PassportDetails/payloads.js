export const addUpdatePayload = (values, selectedValues) => {
  const result = {
    dateOfRPORequisition: values.dateOfRPORequisition,
    dateOfReply: values.dateOfReply,
    passportNo: values.passportNo,
    dateOfIssue: values.dateOfIssue,
    dateOfValidity: values.dateOfValidity,
    addressFromPassport: {
      address1: selectedValues?.address1 || "",
      address2: selectedValues?.address2 || "",
      city: selectedValues?.city || "",
      district: selectedValues?.district || "",
      pincode: selectedValues?.pincode || "",
      landmark: selectedValues?.landmark || "",
      description: selectedValues?.description || "",
      latitude: selectedValues?.latitude || "",
      longitude: selectedValues?.longitude || "",
    },
    result: values.result,
  };
  return result;
};
