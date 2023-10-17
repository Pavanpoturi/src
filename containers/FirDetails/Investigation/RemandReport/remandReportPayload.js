const getRemandReport = (values) => {
  const result = {
    producedDateTime: values.producedDateTime,
    fromToDates: values.fromToDates,
    selectPeriod: values.selectPeriod,
    selectDaysOfWeek: values.selectDaysOfWeek,
    userDate: values.userDate,
    courtName: values.courtName,
    courtOrders: values.courtOrders,
    remandedUTNumber: values.remandedUTNumber,
    nameOfJail: values.nameOfJail,
    releasedOn: values.releasedOn,
    conditionsImposed: values.conditionsImposed,
    toAppearBeforeIo: values.toAppearBeforeIo,
    cooperateWithIo: values.cooperateWithIo,
    remandID: values.remandID,
  };
  return result;
};

export const addRemandReportPayload = (
  values,
  crimeId,
  selectedSuretyDetails
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    suretyDetails: selectedSuretyDetails,
    ...getRemandReport(values),
  };

  return result;
};

export const updateRemandReportPayload = (
  values,
  crimeId,
  id,
  selectedSuretyDetails
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    accusedId: values.accusedId,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    suretyDetails: selectedSuretyDetails,
    ...getRemandReport(values),
  };

  return result;
};
