const getPTWarrant = (values, selectedState, grantedState, ptWarrantURL) => {
  const result = {
    warrentType: values.warrentType ? values.warrentType : selectedState,
    dateTimeOfArrest: values.dateTimeOfArrest,
    placeOfArrest: values.placeOfArrest,
    otherState: values.otherState,
    district: values.district,
    dateOfPTWarrantRequistion: values.dateOfPTWarrantRequistion,
    courtName: values.courtName,
    selectTeamToGoOut: values.selectTeamToGoOut,
    dateOfRequestForUnitOfficer: values.dateOfRequestForUnitOfficer,
    dateOfTravelToOtherState: values.dateOfTravelToOtherState,
    courtOrders: {
      grantType: values.grantType ? values.grantType : grantedState,
      conditionsImposed: values.conditionsImposed,
      ptWarrantURL: ptWarrantURL,
      dateTimeOfArrivalToPS: values.dateTimeOfArrivalToPS,
      toAppearBeforeIo: values.toAppearBeforeIo,
      selectDaysOfWeek: values.selectDaysOfWeek,
      selectPeriod: values.selectPeriod,
      cooperateWithIo: values.cooperateWithIo,
    },
  };
  return result;
};

export const addPTWarrantPayload = (
  values,
  crimeId,
  selectedState,
  grantedState,
  ptWarrantURL
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    ptWarrant: getPTWarrant(values, selectedState, grantedState, ptWarrantURL),
  };
  return result;
};

export const updatePTWarrantPayload = (
  values,
  crimeId,
  id,
  selectedState,
  grantedState,
  ptWarrantURL
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    accusedId: values?.accusedId[0],
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    ptWarrant: getPTWarrant(values, selectedState, grantedState, ptWarrantURL),
  };
  return result;
};
