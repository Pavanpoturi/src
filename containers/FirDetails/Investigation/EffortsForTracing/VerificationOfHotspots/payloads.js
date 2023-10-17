export const addUpdatePayload = (values, selectedValues, uploadOption) => {
  const result = {
    personnelDeputed: values.personnelDeputed,
    dateOfVerification: values.dateOfVerification,
    placeOfHotspot: {
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
    natureOfHotspot: values.natureOfHotspot || "",
    resultUploadReport: uploadOption,
  };
  return result;
};
