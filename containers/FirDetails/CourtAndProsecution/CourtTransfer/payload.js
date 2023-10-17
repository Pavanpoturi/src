export const addCourtTransferPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    transferredFrom: values?.transferredFrom,
    transferredTo: values?.transferredTo,
    dateOfTransfer: values?.dateOfTransfer,
    courtCaseNo: values?.courtCaseNo,
    reasonForTransfer: values?.reasonforTransfer,
    otherReasonForTransfer: values?.otherReason,
    remarks: values?.remark,
  };
  return result;
};

export const updateCourtTransferPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  id
) => {
  const result = {
    courtTransferId: id,
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    chargesheetId: chargesheetId,
    transferredFrom: values?.transferredFrom,
    transferredTo: values?.transferredTo,
    dateOfTransfer: values?.dateOfTransfer,
    courtCaseNo: values?.courtCaseNo,
    reasonForTransfer: values?.reasonforTransfer,
    otherReasonForTransfer: values?.otherReason,
    remarks: values?.remark,
  };
  return result;
};
