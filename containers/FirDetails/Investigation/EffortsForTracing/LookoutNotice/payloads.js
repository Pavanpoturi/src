export const addUpdatePayload = (values, selectedValues, uploadOption) => {
  const result = {
    dateOfPoster: values.dateOfPoster,
    personnelDeputed: values.personnelDeputed,
    placeOfPasting: {
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
    lookoutNotice: values.lookoutNotice,
    uploadEvidence: uploadOption,
  };
  return result;
};
