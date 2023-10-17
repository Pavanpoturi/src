export const addUpdatePayload = (values, selectedValues, uploadOption) => {
  console.log("values2", values);
  const result = {
    dateOfDeparture: values.dateOfDeparture,
    personnelDeputed: values.personnelDeputed,
    dateOfArrivalToPlace: values.dateOfArrivalToPlace,
    nearestPoliceStation: values.nearestPoliceStation,
    otherNearestPoliceStation: values.otherNearestPoliceStation,
    placeVisited: {
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
    resultUploadReport: uploadOption,
  };
  return result;
};
