export const postmortemExaminationForm = [
  {
    name: "timeOfPME",
    label: "Date & Time of PME",
    type: "date",
  },
  {
    name: "placeOfPME",
    label: "Place of PME",
    type: "dropdown",
  },
  {
    name: "disposalOfBody",
    label: "Disposal of Body",
    type: "dropdown",
  },
  {
    name: "escortPC",
    label: "Escort PC",
    type: "dropdown",
  },
  {
    name: "pmeConductedBy",
    label: "PME Conducted By",
    actionLink: "addProfessional",
    actionName: "Add Professional",
    type: "text",
  },
  { name: "pmeNumber", label: "PME No.", type: "text" },
];

export const placeOfPME = [{ label: "Crime Scene" }, { label: "Hospital" }];

export const displayOfBody = [
  {
    label: "Handed Over to blood relatives",
    name: "handedoverToBloodRelatives",
  },
  {
    label: "Handed Over to municipal authorities for disposal",
    name: "handedOverToMunicipalAuthoritiesForDisposal",
  },
  {
    label: "Preserved for identification",
    name: "preservedforIdentification",
  },
];
