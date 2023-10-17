export const addArrestbyPolicePayload = (
  values,
  person,
  crimeId,
  uploadMedicalCertificate,
  urlFormData,
  suretyDetails,
  selectedCategory
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    typeOfApprehension: values.arrestType,
    placeOfApprehension: values.placeOfTakenIntoCustody,
    bringingDate: values.dateTimeOfCustody,
    cclCode: values.accusedCode,
    apprehensionDate: values.dateAndTimeOfArrest,
    intimationGivenTo: {
      relationToCCL: values.relationToAccused,
      person: person,
      intimatedDate: values.intimatedDate,
    },
    medicalExamination: {
      hospitalName: values.hospitalName,
      hospitalLocation: values.hospitalLocation,
      isInjured: values.isInjured,
      descriptionOfInjuries: values.descriptionOfInjuries,
      uploadMedicalCertificate: urlFormData,
    },
    suretyDetails: suretyDetails,
    rapeCase: {
      escortPC: values.escortPC,
      hospitalName: values.RChospitalName,
      hospitalLocation: values.RChospitalLocation,
    },
    femaleArrest: {
      officerName: values.officerName,
      rank: values.rank,
    },
    media: uploadMedicalCertificate,
  };

  return result;
};

export const updateArrestbyPolicePayload = (
  values,
  person,
  crimeId,
  arrestId,
  uploadMedicalCertificate,
  urlFormData,
  suretyDetails,
  selectedCategory
) => {
  const result = {
    _id: arrestId,
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    arrestType: values.arrestType,
    typeOfApprehension: values.arrestType,
    placeOfApprehension: values.placeOfTakenIntoCustody,
    bringingDate: values.dateTimeOfCustody,
    cclCode: values.accusedCode,
    apprehensionDate: values.dateAndTimeOfArrest,
    intimationGivenTo: {
      relationToCCL: values.relationToAccused,
      person: person,
      intimatedDate: values.intimatedDate,
    },
    medicalExamination: {
      hospitalName: values.hospitalName,
      hospitalLocation: values.hospitalLocation,
      isInjured: values.isInjured,
      descriptionOfInjuries: values.descriptionOfInjuries,
      uploadMedicalCertificate: urlFormData,
    },
    suretyDetails: suretyDetails,
    rapeCase: {
      escortPC: values.escortPC,
      hospitalName: values.RChospitalName,
      hospitalLocation: values.RChospitalLocation,
    },
    femaleArrest: {
      officerName: values.officerName,
      rank: values.rank,
    },
    media: uploadMedicalCertificate,
  };
  return result;
};
