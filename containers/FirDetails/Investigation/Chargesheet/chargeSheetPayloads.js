export const getPayload = (
  values,
  crimeId,
  isDraft,
  accusedParticulars,
  Charge_Sheet_Date,
  richTextContent,
  linkingOfActs,
  actsAndSections,
  isCCL,
  witnessDetails
) => {
  const result = {
    crimeId: crimeId,
    isDraft: isDraft,
    isCCL: isCCL,
    chargeSheet: {
      chargeSheetNo: values.Charge_Sheet_No || "",
      chargeSheetDate: Charge_Sheet_Date,
      courtName: values.Court_Name,
      chargeSheetType: values.Charge_Sheet_Type,
    },
    chargeSheetNoForICJS: values?.Charge_Sheet_No_For_ICJS,
    accusedParticulars: accusedParticulars,
    linkingOfActs: linkingOfActs,
    actsAndSections: actsAndSections,
    uploadChargeSheet: {
      category: "",
      mimeType: "",
      name: "",
      url: "",
      fileId: "",
    },
    richTextContent: richTextContent,
    deleted: false,
    memoOfEvidences: witnessDetails,
  };
  return result;
};
