export const ChargeSheetForm = [
  {
    name: "Charge_Sheet_No",
    label: "Charge Sheet No.",
    type: "text",
    isRequired: false,
  },
  {
    name: "Charge_Sheet_No_For_ICJS",
    label: "Charge Sheet No For ICJS",
    type: "",
    isRequired: true,
  },
  {
    name: "Charge_Sheet_Date",
    label: "Charge Sheet Date",
    type: "date",
    isRequired: true,
  },
  {
    name: "Court_Name",
    label: "Court Name",
    type: "dropdown",
    isRequired: true,
  },
  {
    name: "Charge_Sheet_Type",
    label: "Charge Sheet Type",
    type: "dropdown",
    isRequired: true,
  },
];

export const chargetSheetTypes = [
  { label: "Combined Charge" },
  { label: "Original" },
  { label: "Supplementary" },
  { label: "Separate" },
];

export const accusedChargeTypes = [
  { label: "Charged" },
  { label: "Absconding" },
  { label: "NotCharged" },
];

export const ActsAndSection = [
  {
    name: "Act",
    label: "Act",
    type: "dropdown",
  },
  {
    name: "Section",
    label: "Section",
    type: "dropdown",
  },
];

export const LinkSection = [
  {
    name: "accusedPersonId",
    label: "Select Accused",
    type: "dropdown",
  },
  {
    name: "existingActsSection",
    label: "Existing Acts & Sections",
    type: "dropdown",
  },
];
