const getArrestByOtherPolice = (values) => {
  const result = {
    accusedCode: values.accusedCode,
    dateTimeOfArrestByOtherPolice: values.dateTimeOfArrestByOtherPolice,
    durationOfJudicialCustody: values.durationOfJudicialCustody,
    isInjured: values.isInjured,
    descriptionOfInjuries: values.descriptionOfInjuries,
    psCrimeConfessed: values.psCrimeConfessed,
    otherPsCrimeNumber: values.otherPsCrimeNumber,
    intimationReceivedDate: values.intimationReceivedDate,
    courtName: values.courtName,
    sectionOfLaw: "",
    jailName: values.jailName,
    underTrialNo: values.underTrialNo,
    dateOfPTWarrantRequisition: values.dateOfPTWarrantRequisition,
    arrestedByOtherPsIoName: values.arrestedByOtherPsIoName,
    otherPsName: values.otherPsName,
    unitOrDistrict: values.unitOrDistrict,
    otherStateSelect: values.otherStateSelect,
    selectTeamToGoOutOfState: values.selectTeamToGoOutOfState,
    requestedOn: "",
    requestStatus: "",
    receivedOn: "",
    dateOfTravelToOtherState: values.dateOfTravelToOtherState,
    ptWarrantIssued: values.ptWarrantIssued,
    warrantIssuedDate: values.warrantIssuedDate,
    warrantorderNumber: values.warrantorderNumber,
    ptWarrantRegularized: values.ptWarrantRegularized,
    warrantRegularizedDate: values.warrantRegularizedDate,
    isPoliceCustodyRequired: values.isPoliceCustodyRequired,
  };

  return result;
};

export const addArrestByOtherPolicePayload = (values, crimeId) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    arrestByOtherPolice: getArrestByOtherPolice(values),
  };

  return result;
};

export const updateArrestbyOtherPolicePayload = (values, crimeId, arrestId) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    arrestByOtherPolice: getArrestByOtherPolice(values),
  };

  return result;
};
