const getArrestOnSurrenderInPoliceStation = (values, suretyDetails) => {
  const result = {
    arrest: values.arrestSurrenderType === "Arrest" ? true : null,
    dateOfSurrender: values.dateOfSurrender,
    releasedOnStationBail:
      values.arrestSurrenderType === "Released On Station Bail" ? true : null,
    intimationToSeniorOfficer: values.intimationToSeniorOfficer,
    stationBailDate: values.stationBailDate,
    issue41ANotice:
      values.arrestSurrenderType === "Issue 41A Cr.P.C Notice" ? true : null,
    suretyDetails: suretyDetails,
  };
  return result;
};

export const addArrestOnSurrenderInPoliceStationPayload = (
  values,
  crimeId,
  suretyDetails
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    arrestOnSurrenderInPoliceStation: getArrestOnSurrenderInPoliceStation(
      values,
      suretyDetails
    ),
  };
  return result;
};

export const updateArrestOnSurrenderInPoliceStationPayload = (
  values,
  crimeId,
  arrestId,
  suretyDetails
) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    arrestOnSurrenderInPoliceStation: getArrestOnSurrenderInPoliceStation(
      values,
      suretyDetails
    ),
  };
  return result;
};
