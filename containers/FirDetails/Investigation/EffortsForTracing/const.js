/* eslint-disable array-callback-return */
import { isEmpty } from "lodash";

export const lookOutNoticesPosterPastedForm = [
  {
    name: "dateOfPoster",
    label: "Poster Sticked On",
    type: "date",
  },
  {
    name: "personnelDeputed",
    label: "Personnel Deputed",
    type: "dropdown",
  },
  {
    name: "placeOfPasting",
    label: "Place of sticking",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
  {
    name: "lookoutNotice",
    label: "Look out Notice / Poster",
    type: "dropdown",
  },
  {
    name: "uploadEvidence",
    label: "",
    type: "button",
  },
];

export const placeOfAddressForm = [
  {
    name: "address1",
    label: "Address 1",
    type: "text",
  },
  {
    name: "address2",
    label: "Address 2",
    type: "text",
  },
  {
    name: "city",
    label: "City",
    type: "text",
  },
  {
    name: "district",
    label: "District",
    type: "text",
  },
  {
    name: "pincode",
    label: "Pin code",
    type: "text",
  },
  {
    name: "landmark",
    label: "Landmark",
    type: "text",
  },
  {
    name: "description",
    label: "description",
    type: "textArea",
  },
  {
    name: "latitude",
    label: "Latitude",
    type: "text",
  },
  {
    name: "longitude",
    label: "Longitude",
    type: "text",
  },
];

export const personnelDeputedList = [
  { label: "BC Mobile" },
  { label: "Crime Staff" },
  { label: "Patrol Mobile" },
  { label: "Supporting Staff" },
];

export const lookOutDataList = [
  { label: "Look out Notice" },
  { label: "Look out Poster" },
];

export const modeOfMediaList = [
  { label: "Print Media" },
  { label: "Electronic Media" },
  { label: "Digital Media" },
  { label: "Social Media" },
];

export const categoryOfChecking = [
  { label: "Arrested Person by Other Police Stations" },
  { label: "Bad character" },
  { label: "Ex. Convict" },
  { label: "Jail Releases" },
  { label: "Missing Person" },
  { label: "MO Criminal" },
  { label: "Suspect" },
  { label: "Unknown Dead Bodies" },
];

export const printAndElectronicMediaForm = [
  {
    name: "dateOfPublishing",
    label: "Date of Publishing",
    type: "date",
  },
  {
    name: "modeOfMedia",
    label: "Mode of Media",
    type: "dropdown",
  },
  {
    name: "uploadClipping",
    label: "",
    type: "button",
  },
  {
    name: "remarks",
    label: "Remarks",
    type: "textArea",
  },
];

export const facialRecognitionFields = [
  {
    name: "dateOfChecking",
    label: "Date of Checking",
    type: "date",
  },
  {
    name: "modeOfChecking",
    label: "Mode of Checking",
    type: "dropdown",
  },
  {
    name: "checkedBy",
    label: "Checked by",
    type: "dropdown",
  },
  {
    name: "placeOfChecking",
    label: "Place of Checking",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
  {
    name: "result",
    label: "Result",
    type: "textArea",
  },
];

export const PassportDetailsTemplates = [
  {
    name: "Template to RPO",
    label: "Template to RPO",
    fileName: "Template_to_RPO",
    templateAvailable: false,
  },
];

export const passportDetailsForm = [
  {
    name: "dateOfRPORequisition",
    label: "Date of Requisition to RPO",
    type: "date",
  },
  {
    name: "dateOfReply",
    label: "Date of Reply",
    type: "date",
  },
  {
    name: "passportNo",
    label: "Passport No.",
    type: "text",
  },
  {
    name: "dateOfIssue",
    label: "Date of Issue",
    type: "date",
  },
  {
    name: "dateOfValidity",
    label: "Valid Upto",
    type: "date",
  },
  {
    name: "addressFromPassport",
    label: "Address as per Passport",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
];

export const OutOfCountryTravelDetailsTemplates = [
  {
    name: "Template to Immigration",
    label: "Template to Immigration",
    fileName: "Template_to_Immigration",
    templateAvailable: false,
  },
];

export const outOfCountryTravelDetailsForm = [
  {
    name: "dateOfImmigrationRequisition",
    label: "Date of Requisition to Immigration",
    type: "date",
  },
  {
    name: "dateOfReply",
    label: "Date of Reply",
    type: "date",
  },
  {
    name: "dateOfDeparture",
    label: "Date of Departure From India",
    type: "date",
  },
  {
    name: "placeOfCountry",
    label: "Place of Country",
    type: "text",
  },
  {
    name: "dateOfReaching",
    label: "Date of Reaching",
    type: "date",
  },
];

export const relativesVerifiedForm = [
  {
    name: "date",
    label: "Date",
    type: "date",
  },
  {
    name: "personnelDeputed",
    label: "Personnel Deputed",
    type: "dropdown",
  },
  {
    name: "relationToPerson",
    label: "Relation to the Person",
    type: "dropdown",
  },
  {
    name: "uploadVersion",
    label: "",
    type: "button",
  },
];

export const MOCriminalTemplates = [
  {
    name: "Missing Persons Report",
    label: "Missing Persons Report",
    fileName: "Missing_Persons_Report",
    templateAvailable: false,
  },
  {
    name: "Unknown Dead Bodies Report",
    label: "Unknown Dead Bodies Report",
    fileName: "Unknown_Dead_Bodies_Report",
    templateAvailable: false,
  },
];

export const MOCriminalForm = [
  {
    name: "dateOfEntrustment",
    label: "Entrusted On",
    type: "date",
  },
  {
    name: "personnelEntrusted",
    label: "Personnel Entrusted",
    type: "dropdown",
  },
  {
    name: "categoryOfChecking",
    label: "Category of Checking",
    type: "dropdown",
  },
  {
    name: "moCriminalList",
    label: "MO Criminal List",
    type: "dropdown",
  },
  {
    name: "dateOfChecking",
    label: "Date of Checking",
    type: "date",
  },
  {
    name: "personChecked",
    label: "Particulars of the Person",
    actionLink: "addPerson",
    actionName: "Add Person",
    type: "dropdown",
  },
  {
    name: "uploadInterrogationReport",
    label: "",
    type: "button",
  },
];

export const teamsSentOutOfStationForm = [
  {
    name: "dateOfDeparture",
    label: "Date of Departure",
    type: "date",
  },
  {
    name: "personnelDeputed",
    label: "Personnel Deputed",
    type: "dropdown",
  },
  {
    name: "dateOfArrivalToPlace",
    label: "Date of Arrival to Place of Visit",
    type: "date",
  },
  {
    name: "nearestPoliceStation",
    label: "Nearest Police Station Reported at Out of Station",
    type: "dropdown",
  },
  {
    name: "placeVisited",
    label: "Place Visited",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
  {
    name: "resultUploadReport",
    label: "",
    type: "dropdown",
  },
];

export const verificationOfHotSpotsByTeamsForm = [
  {
    name: "personnelDeputed",
    label: "Personnel Deputed",
    type: "dropdown",
  },
  {
    name: "dateOfVerification",
    label: "Date of Verification",
    type: "date",
  },
  {
    name: "placeOfHotspot",
    label: "Place of Hot Spot",
    actionLink: "addAddress",
    actionName: "Add Address",
    type: "dropdown",
  },
  {
    name: "natureOfHotspot",
    label: "Nature of Hot Spot",
    type: "dropdown",
  },
  {
    name: "resultUploadReport",
    label: "",
    type: "dropdown",
  },
];

export const rewardsDeclaredFormData = [
  {
    name: "dateOfDeclaration",
    label: "Date of Declaration",
    type: "date",
  },
  {
    name: "personnelDeputed",
    label: "Personnel Deputed",
    type: "dropdown",
  },
  {
    name: "amountOfReward",
    label: "Declared Reward Amount (in INR)",
    type: "text",
  },
  {
    name: "declaredBy",
    label: "Declared by",
    type: "dropdown",
  },
  {
    name: "whetherGiven",
    label: "Whether Published in",
    type: "dropdown",
  },
  {
    name: "uploadPaperClipping",
    label: "",
    type: "button",
  },
  {
    name: "result",
    label: "Result",
    type: "teaxArea",
  },
];

export const getDropdownValues = (items) => {
  let arr = [];
  !isEmpty(items) &&
    items.map((item) => {
      const result = {
        label: item?.entity_value || "",
        entityName: item?.entity_name || "",
        _id: item?._id || "",
      };
      arr.push(result);
    });
  return arr;
};

export const moCrimanalList = [
  { label: "Arrested persons by other police stations" },
  { label: "Bad character" },
  { label: "Ex.convict" },
  { label: "Jail releases" }, 
  { label: "Missing persons" },
  { label: "Unknown dead bodies" },
];
