const getPayload = (crimeId, values, addressDetails, placeOfCompliance) => {
  const result = {
    crimeId: crimeId,
    personId: values.personId,
    dateOfIssue: values.dateOfIssue,
    dateOfCompliance: values.dateOfCompliance,
    placeForCompliance: placeOfCompliance,
    presentAddress: {
      houseNo: addressDetails.houseNo,
      streetRoadNo: addressDetails.streetRoadNo,
      wardColony: addressDetails.wardColony,
      landmarkMilestone: addressDetails.landmarkMilestone,
      localityVillage: addressDetails.localityVillage,
      areaMandal: addressDetails.areaMandal,
      district: addressDetails.district,
      stateUt: addressDetails.stateUt,
      residencyType: addressDetails.residencyType,
      pinCode: addressDetails.pinCode,
    },
    permanentAddress: {
      houseNo: addressDetails.sameAsPresent
        ? addressDetails.houseNo
        : addressDetails.p_houseNo,
      streetRoadNo: addressDetails.sameAsPresent
        ? addressDetails.streetRoadNo
        : addressDetails.p_streetRoadNo,
      wardColony: addressDetails.sameAsPresent
        ? addressDetails.wardColony
        : addressDetails.p_wardColony,
      landmarkMilestone: addressDetails.sameAsPresent
        ? addressDetails.landmarkMilestone
        : addressDetails.p_landmarkMilestone,
      localityVillage: addressDetails.sameAsPresent
        ? addressDetails.localityVillage
        : addressDetails.p_localityVillage,
      areaMandal: addressDetails.sameAsPresent
        ? addressDetails.areaMandal
        : addressDetails.p_areaMandal,
      district: addressDetails.sameAsPresent
        ? addressDetails.district
        : addressDetails.p_district,
      stateUt: addressDetails.sameAsPresent
        ? addressDetails.stateUt
        : addressDetails.p_stateUt,
      residencyType: addressDetails.sameAsPresent
        ? addressDetails.residencyType
        : addressDetails.p_residencyType,
      pinCode: addressDetails.sameAsPresent
        ? addressDetails.pinCode
        : addressDetails.p_pinCode,
    },
    sameAsPresent: addressDetails.sameAsPresent,
    userDate: values.userDate,
  };
  return result;
};

export const add160CrpcPayload = (
  values,
  crimeId,
  addressDetails,
  placeOfCompliance
) => {
  const result = getPayload(crimeId, values, addressDetails, placeOfCompliance);
  return result;
};

export const update160CrpcPayload = (
  values,
  crimeId,
  id,
  addressDetails,
  placeOfCompliance
) => {
  const result = {
    _id: id,
    ...getPayload(crimeId, values, addressDetails, placeOfCompliance),
  };
  return result;
};
