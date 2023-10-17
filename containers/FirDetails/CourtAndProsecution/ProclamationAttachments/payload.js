export const addProclamationAttachmentsPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  mediaReport,
  checkedList,
  uploadProclamation,
  addPerson
) => {
  const result = {
    crimeId: crimeId,
    chargesheetId: chargesheetId,
    updateChargesheetId: updateChargesheetId,
    accusedId: values?.accusedId,

    proclamation: {
      typesOfPropertyToAttached: values?.typesOfPropertyToAttached,
      dateOfIssueOf82CRPCProceedings: values?.dateOfIssueOf82CRPCProceedings,
      uploadProclamation: uploadProclamation,
    },

    publishing: {
      publishedDate: values?.publishedDate,
      publishingProclamation: checkedList,
      others: values?.others,
    },

    propertyAttachment: {
      propertyAttachmentsIssuedDate: values?.propertyAttachmentsIssuedDate,
      typeOfPropertyToAttached: values?.typeOfPropertyAttachments,
      valueofmoneybeingForfeited: values?.valueofmoneybeingForfeited,
      panchWitnessId: values?.panchWitnessId,
      addPerson: addPerson,
      mediaReport: mediaReport,
      whetherTheCaseReferredToLPC: values?.whetherTheCaseReferredToLPC,
      whetherTheCaseIsSplitUp: values?.whetherTheCaseIsSplitUp,
      splitUp: values?.splitUp,
    },
  };

  return result;
};

export const updateProclamationAttachmentsPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  mediaReport,
  checkedList,
  uploadProclamation,
  id,
  addPerson
) => {
  const result = {
    crimeId: crimeId,
    chargesheetId: chargesheetId,
    updateChargesheetId: updateChargesheetId,
    accusedId: values?.accusedId,
    proclamationPublishingPropertyId: id,
    proclamation: {
      typesOfPropertyToAttached: values?.typesOfPropertyToAttached,
      dateOfIssueOf82CRPCProceedings: values?.dateOfIssueOf82CRPCProceedings,
      uploadProclamation: uploadProclamation,
    },

    publishing: {
      publishedDate: values?.publishedDate,
      publishingProclamation: checkedList,
      others: values?.others,
    },

    propertyAttachment: {
      propertyAttachmentsIssuedDate: values?.propertyAttachmentsIssuedDate,
      typeOfPropertyToAttached: values?.typeOfPropertyAttachments,
      valueofmoneybeingForfeited: values?.valueofmoneybeingForfeited,
      panchWitnessId: values?.panchWitnessId || null,
      addPerson: addPerson,
      mediaReport: mediaReport,
      whetherTheCaseReferredToLPC: values?.whetherTheCaseReferredToLPC,
      whetherTheCaseIsSplitUp: values?.whetherTheCaseIsSplitUp,
      splitUp: values?.splitUp,
    },
  };

  return result;
};
