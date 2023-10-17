export const standardPersonalForm = [
  { name: "name", label: "Name", type: "text" },
  { name: "surname", label: "Surname", type: "text" },
  { name: "aliasName", label: "Alias Name", type: "text" },
  { name: "relationType", label: "Relation Type", type: "dropdown" },
  {
    name: "fatherHusbandGuardianName",
    label: "Father/Spouse/Guardian/Mother Name",
    type: "text",
  },
  { name: "gender", label: "Gender", type: "dropdown" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "age", label: "Age", type: "" },
  { name: "occupation", label: "Occupation", type: "dropdown" },
  {
    name: "educationQualification",
    label: "Educational Qualification",
    type: "dropdown",
  },
  { name: "caste", label: "Caste", type: "dropdown" },
  { name: "subCaste", label: "Sub Caste", type: "dropdown" },
  { name: "religion", label: "Religion", type: "dropdown" },
  { name: "nationality", label: "Nationality", type: "dropdown" },
];

export const standardSceneOfOffenceForm = [
  { name: "address1", label: "Address Line 1", type: "text" },
  { name: "address2", label: "Address Line 2", type: "text" },
  { name: "state", label: "State/UT", type: "text" },
  { name: "district", label: "District", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "pincode", label: "Pincode", type: "text" },
  { name: "landmark", label: "Landmark", type: "text" },
];

export const standardAddressForm = [
  { name: "houseNo", label: "House No", type: "text" },
  { name: "streetRoadNo", label: "Street/Road No", type: "text" },
  { name: "wardColony", label: "Ward/Colony", type: "text" },
  { name: "landmarkMilestone", label: "Landmark/Milestone", type: "text" },
  { name: "stateUt", label: "State/UT", type: "dropdown" },
  { name: "district", label: "District", type: "dropdown" },
  { name: "areaMandal", label: "Area/Mandal", type: "text" },
  { name: "localityVillage", label: "Locality/Village", type: "text" },
  { name: "pinCode", label: "PIN Code", type: "text" },
  { name: "residencyType", label: "Residency Type", type: "dropdown" },
];

export const standardPermanentAddressForm = [
  { name: "p_houseNo", label: "House No", type: "text" },
  { name: "p_streetRoadNo", label: "Street/Road No", type: "text" },
  { name: "p_wardColony", label: "Ward/Colony", type: "text" },
  { name: "P_landmarkMilestone", label: "Landmark/Milestone", type: "text" },
  { name: "p_stateUt", label: "State/UT", type: "dropdown" },
  { name: "p_district", label: "District", type: "dropdown" },
  { name: "p_areaMandal", label: "Area/Mandal", type: "text" },
  { name: "p_localityVillage", label: "Locality/Village", type: "text" },
  { name: "p_pinCode", label: "PIN Code", type: "text" },
  { name: "p_residencyType", label: "Residency Type", type: "dropdown" },
];

export const standardContactForm = [
  { name: "phoneNumber", label: "Phone Number", type: "number" },
  { name: "emailId", label: "Email ID", type: "email" },
];

export const witnessDetailsBaseForm = [
  { name: "witnessCode", label: "Witness Code", type: "text" },
  { name: "typeOfWitness", label: "Type Of Witness", type: "dropdown" },
];

export const witnessDetailsSet1 = [
  { name: "categoryOfWitness", label: "Category of Witness", type: "dropdown" },
  {
    name: "statementRecordedBy",
    label: "Statement Recorded by",
    type: "dropdown",
  },
];

export const witnessDetailsSet2 = [
  {
    name: "recordedOnDatetime",
    label: "Date & Time of Recording Statement",
    type: "datetime",
  },
  { name: "selectScribe", label: "Select Scribe if PC", type: "dropdown" },
  { name: "relationToVictim", label: "Relation To Victim", type: "dropdown" },
  { name: "selectVictim", label: "Select Victim", type: "dropdown" },
  { name: "strengthOfWitness", label: "Strength of Witness", type: "dropdown" },
];

export const witnessDetailsSet2Panch = [
  {
    name: "recordedOnDatetime",
    label: "Date & Time of Recording Statement",
    type: "datetime",
  },
  { name: "selectScribe", label: "Select Scribe if PC", type: "dropdown" },
  { name: "strengthOfWitness", label: "Strength of Witness", type: "dropdown" },
];

export const witnessDDFields = [
  {
    name: "docotornamefordd",
    label: "Name of the Doctor Certified for DD",
    type: "text",
  },
  {
    name: "megistratenamefordd",
    label: "Name of the Magistrate who recorded DD",
    type: "text",
  },
  {
    name: "datetimeofrecordingdd",
    label: "Date & Time of Recording DD",
    type: "date",
  },
];

export const expertTeamDetailsForm = [
  { name: "name", label: "Name", type: "text" },
  { name: "role", label: "Role", type: "dropdown" },
];

export const crimeClassificationForm = [
  { name: "height", label: "Height in cms", type: "number-short" },
  { name: "eyeColor", label: "Color of Eyes", type: "text" },
  { name: "complexion", label: "Complexion", type: "text" },
  { name: "hairColor", label: "Color of Hair", type: "text" },
  { name: "bodyBuiltType", label: "Body Built Type", type: "text" },
  { name: "moles", label: "Moles", type: "text" },
  { name: "teeth", label: "Teeth", type: "text" },
  { name: "beard", label: "Beard", type: "text" },
  { name: "mustache", label: "Mustache", type: "text" },
  { name: "approxAge", label: "Approx. age", type: "number-short" },
  { name: "valuables", label: "Any valuables on the body", type: "text" },
  { name: "gender", label: "Gender", type: "dropdown" },
  {
    name: "tailorMarksDetails",
    label: "Wearing's with Tailor Mark and details",
    type: "text",
  },
  { name: "deformitiesType", label: "Deformities Type", type: "dropdown" },
  { name: "deformities", label: "Deformities", type: "dropdown" },
  {
    name: "visibleInjuries",
    label: "Visible Injuries on the body",
    type: "text",
  },
  { name: "tattooMarks", label: "Tattoo marks", type: "dropdown" },
  {
    name: "killSpotBrought",
    label: "Whether Dead Body Apprears To Be",
    type: "text",
  },
];

export const materialObjectForm = [
  { name: "type", label: "Material Object Type", type: "dropdown" },
  { name: "subType", label: "Material Object Sub-Type", type: "dropdown" },
  {
    name: "panchWitness",
    label: "Select Panch Witness",
    type: "dropdown",
  },
  {
    name: "description",
    label: "Description of Material Objects",
    type: "textarea",
  },
  { name: "seizedFrom", label: "Seized From", type: "dropdown" },
  { name: "seizedDate", label: "Date & Time Of Seizure", type: "date" },
  { name: "seizedBy", label: "Seized By", type: "dropdown" },
  {
    name: "strengthOfEvidence",
    label: "Strength of Evidence",
    type: "dropdown",
  },
  { name: "placeofseizure", label: "Place of Seizure", type: "dropdown" },
];

export const accusedApprovalForm = [
  { name: "isDied", label: "" },
  { name: "stageOfCase", label: "Stage of the Case", type: "dropdown" },
  { name: "approvalFromSrOfficer", label: "" },
];

export const arrrestPersonQuestions = [
  { name: "isDangerous", label: "Is Dangerous?" },
  { name: "previouslyJumpedAnyBail", label: "Previously jumped any bail?" },
  { name: "isGenerallyArmed", label: "Is generally Armed?" },
  { name: "operatesWithAccomplices", label: "Operates with Accomplices?" },
  { name: "isKnownCriminal", label: "Is known/listed Criminal?" },
  { name: "isRecidivist", label: "Is Recidivist?" },
  { name: "isLikelyToJumpBail", label: "Is likely to jump bail?" },
  {
    name: "likelyToCommitCrime",
    label:
      "If released on bail, likely to commit any crime or threaten victims/witnesses?",
  },
  {
    name: "isWantedInOtherCase",
    label: "Is a Wanted Criminal in any other case?",
  },
];

export const surrenderInCourt = [
  { name: "numberOfDays", label: "Number of Days", type: "number" },
  { name: "underTrialNo", label: "Under Trial No.", type: "text" },
  { name: "JailName", label: "Jail Name", type: "dropdown" },
];

export const hospitalDetailsForm = [
  { name: "hospitalName", label: "Hospital Name", type: "text" },
  { name: "otherHospitalName", label: "Other Hospital Name", type: "text" },
  {
    name: "hospitalLocation",
    label: "Hospital Location",
    type: "dropdown",
  },
];

export const RChospitalDetailsForm = [
  { name: "RChospitalName", label: "Hospital Name", type: "text" },
  {
    name: "RChospitalLocation",
    label: "Hospital Location",
    type: "dropdown",
  },
];

export const sendToCourtForm = [
  { name: "cprnumber", label: "CPR Number" },
  { name: "directionbycourt", label: "Direction By Court" },
];

export const disposalForm = [
  {
    name: "detailsofdisposeofproperty",
    label: "Details of Dispose of property",
  },
  { name: "datetimeofdisposal", label: "Date & Time of Disposal" },
  { name: "placeofdisposal", label: "Place of Disposal" },
];
export const returnToVictimForm = [
  { name: "releaseorder", label: "Release Order of Court" },
  { name: "releaseorderdate", label: "Release Order Date" },
  { name: "datetimeofrelease", label: "Date & Time of Release" },
];

export const safeCustodyToPolice = [
  { name: "safecustodyinfo", label: "Safe Custody Information" },
  { name: "placeofcustody", label: "Place of Custody" },
  { name: "datetime", label: "Date & Time" },
  { name: "assigntocustodian", label: "Assign to Custodian" },
  {
    name: "propertyregisterentrynumber",
    label: "Property Register Entry Number",
  },
];

export const transferToOtherPoliceStation = [
  { name: "policestationname", label: "Police Station Name" },
  { name: "districtorunit", label: "District/Unit" },
  { name: "crimenumber", label: "Crime Number" },
  { name: "courtname", label: "Court Name" },
  { name: "datetimeoftransfer", label: "Date & Time of Transfer" },
];

export const sendToFSLGovtExaminer = [
  { name: "cprnumber", label: "CPR Number" },
  { name: "fslacknowledgementnumber", label: "FSL Acknowlegement Number" },
  { name: "fslacknowledgementdate", label: "FSL Acknowlegement Date" },
  { name: "reportrecieved", label: "Report Recieved" },
  { name: "propertyrecievedback", label: "Property Recieved Back" },
];

export const textFieldRules = {
  textFieldMaxLength: { max: 149, message: "Max limit is 150 characters" },
  maxLength: 150,
};

export const textAreaRules = {
  textAreaMaxLength: { max: 4999, message: "Max limit is 5000 characters" },
  maxLength: 5000,
};
