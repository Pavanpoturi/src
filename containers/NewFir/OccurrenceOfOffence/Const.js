import moment from "moment";

export const OffenceDateTime = [
  {
    name: "From_date",
    label: "From Date",
    type: "date",
  },
  {
    name: "End_date",
    label: "To Date",
    type: "date",
  },
  {
    name: "Time_period",
    label: "Time Period",
    type: "text",
  },
  {
    name: "Prior_to",
    label: "Prior To",
    type: "date",
  },
  {
    label: "FIR Date & Time",
    name: "FIR_date_time",
    type: "date",
  },
];

export const OffenceInformation = [
  {
    name: "Information_received_at_PS",
    label: "Information Received at PS",
    type: "date",
  },
  {
    name: "Information_type",
    label: "Information Type",
    type: "dropdown",
  },
  {
    name: "GD_number",
    label: "GD Number",
    actionLink: "gdEntry",
    actionName: "GD Entry",
    type: "text",
  },
  {
    name: "GD_date_time",
    label: "GD Date & Time",
    type: "date",
  },
];

export const PlaceOfOffenceOne = [
  {
    name: "Directions_from_ps",
    label: "Directions From PS",
    type: "dropdown",
  },
  {
    name: "distanceFromPS",
    label: "Distance From PS",
    type: "text",
  },
  {
    name: "Beat_no",
    label: "Beat No",
    type: "text",
  },

  {
    name: "Street_road_no",
    label: "Street/Road Number",
    type: "text",
  },
  {
    name: "Jurisdiction_mandal",
    label: "Jurisdiction Area/Mandal ",
    type: "text",
  },
];

export const PlaceOfOffenceTwo = [
  {
    name: "Pleace_house_no",
    label: "Place/House No",
    type: "text",
  },
  {
    name: "Landmark_milestone",
    label: "Landmark/Milestone",
    type: "text",
  },
  {
    name: "Ward_Colony_Village",
    label: "Ward/Colony/Village",
    type: "text",
  },
  {
    name: "pinCode",
    label: "Pin Code",
    type: "dropdown",
  },
];

export const OutsideRadio = [
  {
    name: "state",
    label: "State",
    type: "dropdown",
  },
  {
    name: "City",
    label: "City",
    type: "dropdown",
  },
  {
    name: "pinCode",
    label: "Pin Code",
    type: "dropdown",
  },
  {
    name: "PS",
    label: "PS",
    type: "dropdown",
  },
  {
    name: "Ward_Colony_Village",
    label: "Ward/Colony/Village",
    type: "text",
  },
];

export const informationType = [
  { label: "Mail", name: "Mail" },
  { label: "Oral", name: "Oral" },
  { label: "Received on transfer", name: "Received on transfer" },
  { label: "Referred by court", name: "Referred by court" },
  { label: "Suo-Moto", name: "Suo-Moto" },
  { label: "Written", name: "Written" },
  { label: "Through Post", name: "Through Post" },
];

export const gdDetails = [
  {
    name: "GD_entry_number",
    label: "GD Entry Number",
    type: "text",
  },
  {
    name: "GD_entry_date",
    label: "GD Entry Date",
    type: "date",
  },
  {
    name: "entryOfficerName",
    label: "Entry Officer Name",
    type: "dropdown",
  },
  {
    name: "typeOfGDEntry",
    label: "Type Of GD Entry",
    type: "dropdown",
  },
];

export const disableFIRDateDays = (current) => {
  return (
    current &&
    (current < moment().subtract(11, "days") || current > moment().endOf("day"))
  );
};

export const directionsFromPs = [
  {
    label: "East",
  },
  {
    label: "North",
  },
  {
    label: "North-East",
  },
  {
    label: "North-West",
  },
  {
    label: "South",
  },
  {
    label: "South-East",
  },
  {
    label: "South-West",
  },
  {
    label: "West",
  },
  {
    label: "West-North",
  },
  {
    label: "West-South",
  },
];
