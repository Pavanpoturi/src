export const addUpdatePayload = (values, uploadOption) => {
  const result = {
    date: values.date,
    personnelDeputed: values.personnelDeputed,
    relationToPerson: values.relationToPerson,
    uploadVersion: uploadOption,
  };
  return result;
};
