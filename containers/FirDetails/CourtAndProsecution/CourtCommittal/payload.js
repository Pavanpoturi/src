export const addCourtCommittalPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  media
) => {
  const result = {
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    isAllAccusedPresent: values?.isAllAccusedPresent,
    isAllDocumentsVerified: values?.isAllDocumentsVerified,
    isPropertyDeposited: values?.isPropertyDeposited,
    propertyDeposited: values?.propertyDeposited,
    reasonPropertyNotDeposited: values?.reasonPropertyNotDeposited,
    isSessionsCourtCommitted: values?.isSessionsCourtCommitted,
    sessionsCourtName: values?.sessionsCourtName,
    sessionsCourtCommittalDate: values?.sessionsCourtCommittalDate,
    sessionsCourtOrder: media,
    chargesheetId: chargesheetId,
    reasonNonCommittal: values?.reasonNonCommittal,
    noncommittalNextDatePosting: values?.noncommittalNextDatePosting,
    sessionsCourtType: values?.sessionsCourtType,
    scNoIssueDate: values?.scNoIssueDate,
    scNo: values?.scNo,
    remarksCommittal: values?.remarksCommittal,
    committalNextDatePosting: values?.committalNextDatePosting,
  };
  return result;
};

export const updateCourtCommittalPayload = (
  values,
  crimeId,
  updateChargesheetId,
  chargesheetId,
  media
) => {
  const result = {
    crimeId: crimeId,
    courtCommittalId: values?.courtCommittalId,
    crimeId: crimeId,
    updateChargesheetId: updateChargesheetId,
    isAllAccusedPresent: values?.isAllAccusedPresent,
    isAllDocumentsVerified: values?.isAllDocumentsVerified,
    isPropertyDeposited: values?.isPropertyDeposited,
    propertyDeposited: values?.propertyDeposited,
    reasonPropertyNotDeposited: values?.reasonPropertyNotDeposited,
    isSessionsCourtCommitted: values?.isSessionsCourtCommitted,
    sessionsCourtName: values?.sessionsCourtName,
    sessionsCourtCommittalDate: !!values?.sessionsCourtCommittalDate
      ? values?.sessionsCourtCommittalDate
      : "",
    sessionsCourtOrder: media,
    chargesheetId: chargesheetId,
    reasonNonCommittal: values?.reasonNonCommittal,
    noncommittalNextDatePosting: values?.noncommittalNextDatePosting,
    sessionsCourtType: values?.sessionsCourtType,
    scNoIssueDate: !!values?.scNoIssueDate ? values?.scNoIssueDate : "",
    scNo: values?.scNo,
    remarksCommittal: values?.remarksCommittal,
    committalNextDatePosting: !!values?.committalNextDatePosting
      ? values?.committalNextDatePosting
      : "",
  };
  return result;
};
