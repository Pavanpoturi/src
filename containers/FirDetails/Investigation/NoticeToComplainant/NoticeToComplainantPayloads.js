const getPayload = (values, uploadAcknowledgedNotice, selectedComplainant) => {
  const result = {
    nameOfComplainant: selectedComplainant,
    purposeOfIssue: values.purposeOfIssue,
    dateOfNotice: values.dateOfNotice,
    uploadAcknowledgedNotice: uploadAcknowledgedNotice,
    userDate: values.userDate,
  };
  return result;
};

export const addComplainantNoticePayload = (
  values,
  crimeId,
  uploadAcknowledgedNotice,
  selectedComplainant
) => {
  const result = {
    crimeId: crimeId,
    ...getPayload(values, uploadAcknowledgedNotice, selectedComplainant),
  };
  return result;
};

export const updateComplainantNoticePayload = (
  values,
  crimeId,
  id,
  uploadAcknowledgedNotice,
  selectedComplainant
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    ...getPayload(values, uploadAcknowledgedNotice, selectedComplainant),
  };
  return result;
};
