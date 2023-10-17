import { getPersonDetails } from "@containers/FirDetails/fir-util";

export const addUpdatePayload = (
  values,
  selectedPerson,
  uploadOption,
  inputList
) => {
  const result = {
    dateOfEntrustment: values.dateOfEntrustment,
    personnelEntrusted: values.personnelEntrusted,
    categoryOfChecking: values.categoryOfChecking,
    moCriminalList: values.moCriminalList,
    dateOfChecking: values.dateOfChecking,
    personChecked: getPersonDetails(selectedPerson, inputList, []),
    uploadInterrogationReport: uploadOption,
  };
  return result;
};
