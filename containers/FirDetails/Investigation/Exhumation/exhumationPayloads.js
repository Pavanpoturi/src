const getPayload = (
  values,
  exhumationConductedByLocation,
  exhumationPanchnamaURL,
  exhumationMedia,
  addressDetails
) => {
  const result = {
    deceasedType: values.deceasedType,
    unknownDeceased: values.unknownDeceased,
    byOrdersOf: values.byOrdersOf,
    orderNumber: values.orderNumber,
    OrderDate: values.OrderDate,
    dateOfRequisitionForExhumationToTahsildar:
      values.dateOfRequisitionForExhumationToTahsildar,
    exhumationAddress: {
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
    },
    previousPMEConducted: values.previousPMEConducted === "Yes" ? true : false,
    natureOfDeath: values.natureOfDeath,
    natureOfBodyDisposal: values.natureOfBodyDisposal,
    dateOfExhumation: values.dateOfExhumation,
    placeOfExhumation: values.placeOfExhumation,
    exhumationConductedBy: exhumationConductedByLocation,
    exhumationPanchWitness: values.exhumationPanchWitness,
    personAssistedInDiggingGrave: values.personAssistedInDiggingGrave,
    exhumationPanchnamaURL: exhumationPanchnamaURL,
    exhumationMedia: exhumationMedia,
    userDate: values.userDate,
  };
  return result;
};

export const addExhumationPayload = (
  values,
  crimeId,
  exhumationConductedByLocation,
  exhumationPanchnamaURL,
  exhumationMedia,
  addressDetails
) => {
  const result = {
    crimeId: crimeId,
    deceasedPersonId: [values.deceasedPersonId],
    ...getPayload(
      values,
      exhumationConductedByLocation,
      exhumationPanchnamaURL,
      exhumationMedia,
      addressDetails
    ),
  };
  return result;
};

export const updateExhumationPayload = (
  values,
  crimeId,
  id,
  exhumationConductedByLocation,
  exhumationPanchnamaURL,
  exhumationMedia,
  addressDetails,
  deceasedPersonId
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    deceasedPersonId: [deceasedPersonId],
    ...getPayload(
      values,
      exhumationConductedByLocation,
      exhumationPanchnamaURL,
      exhumationMedia,
      addressDetails
    ),
  };
  return result;
};
