export const addUpdatePayload = (values, uploadOption) => {
  const result = {
    dateOfPublishing: values.dateOfPublishing,
    modeOfMedia: values.modeOfMedia,
    remarks: values.remarks,
    uploadClipping: uploadOption,
  };
  return result;
};
