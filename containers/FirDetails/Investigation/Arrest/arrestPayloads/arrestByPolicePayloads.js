const getArrestByPolice = (
  values,
  person,
  uploadMedicalCertificate,
  urlFormData,
  suretyDetails,
  selectedCategory
) => {
  const fileData = [];

  uploadMedicalCertificate.forEach((file) => {
    fileData.push({ ...file, ["category"]: selectedCategory });
  });
  const result = {
    placeOfTakenIntoCustody: values.placeOfTakenIntoCustody,
    dateTimeOfCustody: values.dateTimeOfCustody,
    apprehendedBy: values.apprehendedBy,
    iOAssistedBy: values.iOAssistedBy,
    accusedCode: values.accusedCode,
    placeOfArrest: values.placeOfArrest,
    courtName: values.courtName,
    dateAndTimeOfArrest: values.dateAndTimeOfArrest,
    intimationOfArrest: {
      relationToAccused: values.relationToAccused,
      selectPerson: person,
      modeOfIntimation: values.modeOfIntimation,
      intimatedDate: values.intimatedDate,
    },
    medicalExamination: {
      hospitalName: values.hospitalName,
      otherHospitalName: values?.otherHospitalName,
      hospitalLocation: values.hospitalLocation,
      isInjured: values.isInjured,
      descriptionOfInjuries: values.descriptionOfInjuries,
      uploadMedicalCertificate: urlFormData,
    },
    rapeCase: {
      escortPC: values.escortPC,
      hospitalName: values.RChospitalName,
      hospitalLocation: values.RChospitalLocation,
    },
    femaleArrest: {
      officerName: values.officerName,
      rank: values.rank,
    },
    policeRecords: {
      isDangerous: values.isDangerous,
      isDangerousDetails: values.isDangerousDetails,
      previouslyJumpedAnyBail: values.previouslyJumpedAnyBail,
      previouslyJumpedAnyBailDetails: values.previouslyJumpedAnyBailDetails,
      isGenerallyArmed: values.isGenerallyArmed,
      isGenerallyArmedDetails: values.isGenerallyArmedDetails,
      operatesWithAccomplices: values.operatesWithAccomplices,
      operatesWithAccomplicesDetails: values.operatesWithAccomplicesDetails,
      isKnownCriminal: values.isKnownCriminal,
      isKnownCriminalDetails: values.isKnownCriminalDetails,
      isRecidivist: values.isRecidivist,
      isRecidivistDetails: values.isRecidivistDetails,
      isLikelyToJumpBail: values.isLikelyToJumpBail,
      isLikelyToJumpBailDetails: values.isLikelyToJumpBailDetails,
      likelyToCommitCrime: values.likelyToCommitCrime,
      likelyToCommitCrimeDetails: values.likelyToCommitCrimeDetails,
      isWantedInOtherCase: values.isWantedInOtherCase,
      isWantedInOtherCaseDetails: values.isWantedInOtherCaseDetails,
    },
    suretyDetails: suretyDetails,
    media: uploadMedicalCertificate,
  };
  return result;
};

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
    arrestByPolice: getArrestByPolice(
      values,
      person,
      uploadMedicalCertificate,
      urlFormData,
      suretyDetails,
      selectedCategory
    ),
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
    internalFlag: false,
    userDate: values.userDate,
    deleted: false,
    arrestByPolice: getArrestByPolice(
      values,
      person,
      uploadMedicalCertificate,
      urlFormData,
      suretyDetails,
      selectedCategory
    ),
  };

  return result;
};
