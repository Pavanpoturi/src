export const prosecutionofAccusedPayload = (values) => {
  const result = {
    forProsecutionOfAccused: {
      offenceForPermission: values.offenceForPermission,
      competentAuthority: values.competentAuthority,
      dateOfSubmissionToUnitOfficer: values.dateOfSubmissionToUnitOfficer,
      superiorOfficerPermission: values.superiorOfficerPermissionAccused,
      reportForwardDate: values.reportForwardDate,
      govSanctionNum: values.govSanctionNum,
      govSanctionDate: values.govSanctionDate,
    },
  };
  return result;
};

export const closureOfCasePayload = (values, uploadedclosureReportMedia) => {
  const result = {
    forClosureOfCase: {
      natureOfClosure: values.natureOfClosure,
      competentAuthority: values.competentAuthorityClosure,
      dateOfRequisitionToSuperiorOfficer:
        values.dateOfRequisitionToSuperiorOfficer,
      superiorOfficerPermission: values.superiorOfficerPermissionCloser,
      orderNumber: values.orderNumber,
      dateOfReceiptOfPermission: values.dateOfReceiptOfPermission,
      orderUrl: uploadedclosureReportMedia,
    },
  };
  return result;
};

export const deletionOfAccusedPayload = (
  values,
  uploadedDeletionReportMedia
) => {
  const result = {
    deletionOfAccused: {
      reasonForDeletion: values.reasonForDeletion,
      competentAuthority: values.competentAuthorityDeletion,
      dateOfRequisitionToSuperiorOfficer:
        values.dateOfRequisitionToSuperiorOfficer,
      superiorOfficerPermission: values.superiorOfficerPermissionDeletion,
      orderNumber: values.orderNumber,
      dateOfReceiptOfPermission: values.dateOfReceiptOfPermission,
      orderUrl: uploadedDeletionReportMedia,
    },
  };
  return result;
};
