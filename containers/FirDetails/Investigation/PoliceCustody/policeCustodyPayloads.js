export const addPoliceCustodyPayload = (
  values,
  crimeId,
  uploadMedicalCertificate
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values?.accusedId,
    reasonForCustody: values?.reasonForCustody,
    requistionDate: values?.requistionDate,
    numberOfDays: values?.numberOfDays?.toString(),
    numberOfDaysPoliceCustodyGranted:
      values?.numberOfDaysPoliceCustodyGranted?.toString(),
    orderNumber: values?.orderNumber,
    fromDateToDate: values?.fromDateToDate,
    escortTeamWhileBringing: values?.escortTeamWhileBringing,
    escortTeamWhileSending: values?.escortTeamWhileSending,
    medicalExamination: {
      hospitalName: values?.hospitalName,
      otherHospitalName: values?.otherHospitalName,
      hospitalLocation: values?.hospitalLocation,
      isInjured: values?.isInjured,
      descriptionOfInjuries: values?.descriptionOfInjuries,
      uploadMedicalCertificate: uploadMedicalCertificate,
    },
    dateOfReproduction: values?.dateOfReproduction,
  };
  return result;
};

export const updatePoliceCustodyPayload = (
  values,
  crimeId,
  id,
  uploadMedicalCertificate
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    accusedId: values?.accusedId,
    internalFlag: false,
    userDate: values?.userDate,
    deleted: false,
    reasonForCustody: values?.reasonForCustody,
    requistionDate: values?.requistionDate,
    numberOfDays: values?.numberOfDays,
    numberOfDaysPoliceCustodyGranted: values?.numberOfDaysPoliceCustodyGranted,
    orderNumber: values?.orderNumber,
    fromDateToDate: values?.fromDateToDate,
    escortTeamWhileBringing: values?.escortTeamWhileBringing,
    escortTeamWhileSending: values?.escortTeamWhileSending,
    medicalExamination: {
      hospitalName: values?.hospitalName ? values?.hospitalName : "",
      otherHospitalName: values?.otherHospitalName,
      hospitalLocation: values?.hospitalLocation,
      isInjured: values?.isInjured,
      descriptionOfInjuries: values?.descriptionOfInjuries
        ? values?.descriptionOfInjuries
        : "",
      uploadMedicalCertificate: uploadMedicalCertificate,
    },
    dateOfReproduction: values.dateOfReproduction,
  };
  return result;
};
