export const getPayload = (
  values,
  crimeId,
  isDraft,
  accusedParticulars,
  richTextContent
) => {
  const result = {
    crimeId: crimeId,
    isDraft: isDraft,
    finalReport: {
      finalReportNo: values.finalReportNo,
      finalReportDate: values.finalReportDate,
      finalReportType: values.finalReportType,
      actionDroppedType: values.actionDroppedType,
      actionTaken: values.actionTaken,
      reasonsForSuicide: values.reasonsForSuicide,
    },
    accusedParticulars: accusedParticulars,
    richTextContent: richTextContent,
    deleted: false,
  };
  return result;
};
