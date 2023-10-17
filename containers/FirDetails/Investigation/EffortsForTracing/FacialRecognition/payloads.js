export const addUpdatePayload = (values, selectedValues) => {
  const result = {
    dateOfChecking: values.dateOfChecking,
    modeOfChecking: values.modeOfChecking,
    checkedBy: values.checkedBy,
    placeOfChecking: {
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
