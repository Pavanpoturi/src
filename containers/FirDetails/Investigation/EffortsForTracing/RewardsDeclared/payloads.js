export const addUpdatePayload = (values, uploadOption) => {
  const result = {
    dateOfDeclaration: values.dateOfDeclaration,
    personnelDeputed: values.personnelDeputed,
    amountOfReward: values.amountOfReward,
    declaredBy: values.declaredBy,
    whetherGiven: values.whetherGiven,
    uploadPaperClipping: uploadOption,
    result: values.result,
  };
  return result;
};
