export const addJuvenileApprehensionPayload = (
  values,
  crimeId,
  person,
  uploadMedicalCertificate,
  suretyDetails
) => {
  const result = {
    crimeId: crimeId,
    accusedId: values.accusedId,
    action: values.action,
    typeOfApprehension: values.typeOfApprehension,
    placeOfApprehension: values.placeOfApprehension,
    bringingDate: values.bringingDate,
    cclCode: values.cclCode,
    apprehensionDate: values.apprehensionDate,
    intimationGivenTo: {
      relationToCCL: values.relationToCCL,
      person: person,
      intimatedDate: values.intimatedDate,
    },
    medicalExamination: {
      hospitalName: values.hospitalName,
      otherHospitalName: values?.otherHospitalName,
      hospitalLocation: values.hospitalLocation,
      isInjured: values.isInjured,
      descriptionOfInjuries: values.descriptionOfInjuries,
      uploadMedicalCertificate: {
        url: uploadMedicalCertificate?.url,
        name: uploadMedicalCertificate?.name,
        type: uploadMedicalCertificate?.mimeType,
        fileId: uploadMedicalCertificate?.id,
      },
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
  };
  return result;
};

export const updateJuvenileApprehensionPayload = (
  values,
  crimeId,
  person,
  id,
  uploadMedicalCertificate,
  suretyDetails
) => {
  const result = {
    _id: id,
    crimeId: crimeId,
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    accusedId: values.accusedId,
    action: values.action,
    typeOfApprehension: values.typeOfApprehension,
    placeOfApprehension: values.placeOfApprehension,
    bringingDate: values.bringingDate,
    cclCode: values.cclCode,
    apprehensionDate: values.apprehensionDate,
    intimationGivenTo: {
      relationToCCL: values.relationToCCL,
      person: person,
      intimatedDate: values.intimatedDate,
    },
    medicalExamination: {
      hospitalName: values.hospitalName,
      otherHospitalName: values?.otherHospitalName,
      hospitalLocation: values.hospitalLocation,
      doctorName: values.doctorName,
      isInjured: values.isInjured,
      descriptionOfInjuries: values.descriptionOfInjuries,
      uploadMedicalCertificate: {
        url: uploadMedicalCertificate?.url,
        name: uploadMedicalCertificate?.name,
        type: uploadMedicalCertificate?.mimeType,
        fileId: uploadMedicalCertificate?.id,
      },
    },
    suretyDetails: suretyDetails,
    rapeCase: {
      escortPC: values.escortPC,
      hospitalName: values.RChospitalName,
      hospitalLocation: values.RChospitalLocation,
      doctorname: values.RCdoctorName,
    },
    femaleArrest: {
      officerName: values.officerName,
      rank: values.rank,
    },
  };
  return result;
};
