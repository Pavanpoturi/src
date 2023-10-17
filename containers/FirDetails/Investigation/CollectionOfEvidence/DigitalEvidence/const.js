export const cctvFootageForm = [
  {
    name: "placeOfCCTV",
    label: "Place of CCTV",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
  {
    name: "ownerOfCCTV",
    label: "Owner of CCTV",
    actionLink: "addPerson",
    actionName: "Add Person",
    type: "dropdown",
  },
  {
    name: "cctvFootageReqDates",
    label: "CCTV Footage Required",
    type: "date",
  },
  {
    name: "dateOfCollection",
    label: "Date of Collection",
    type: "date",
  },
  {
    name: "crpc91Required",
    label: "91 Cr.PC. Notice required?",
    type: "radio",
  },
  {
    name: "cctvFootageCollectedDevice",
    label: "CCTV Footage Collected in",
    type: "drpdown",
  },
  {
    name: "person65BName",
    label: "Details Of person who gave 65B certificate",
    actionLink: "addPerson",
    actionName: "Add Person",
    type: "drpdown",
  },
  {
    name: "strengthOfEvidence",
    label: "Strength of Evidence",
    type: "drpdown",
  },
];

export const audioVideoClippingForm = [
  {
    name: "sourceofAudioVideo",
    label: "Source of Audio / Video",
    type: "dropdown",
  },
  {
    name: "deviceCollected",
    label: "Device Collected",
    type: "dropdown",
  },
  {
    name: "dateOfCollection",
    label: "Date of Collection",
    type: "date",
  },
  {
    name: "strengthOfEvidence",
    label: "Strength of Evidence",
    type: "drpdown",
  },
];

export const cdrForm = [
  {
    name: "mobileNo",
    label: "Mobile No.",
    type: "text",
  },
  {
    name: "imeiNo",
    label: "IMEI No.",
    type: "text",
  },
  {
    name: "towerIdNo",
    label: "Tower ID No.",
    type: "text",
  },
  {
    name: "telecomServiceProvider",
    label: "Telecom Service Provider",
    type: "drpdown",
  },
  {
    name: "nickName",
    label: "CDR/CAF Of Whom",
    type: "drpdown",
  },
];
