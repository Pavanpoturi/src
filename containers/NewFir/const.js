export const FIR_MASTER_DATA_LIST = ["COURTS"];

export const victimTypes = [
  { label: "Deceased", name: "Deceased" },
  { label: "Kidnapped", name: "Kidnapped" },
  { label: "Missing", name: "Missing" },
  { label: "Unknown Dead Body", name: "unknownDeadBody" },
  { label: "Victim", name: "Victim" },
];

export const accusedTypes = [
  { label: "Known", name: "Known" },
  { label: "No Accused", name: "noAccused" },
  { label: "Respondent", name: "Respondent" },
  { label: "Suspect", name: "Suspect" },
  { label: "Unknown", name: "Unknown" },
];

export const isUpdateSuccess = (updateActionType) => {
  const isUpdateSuccess =
    updateActionType === "UPDATE_FIR_SUCCESS" ||
    updateActionType === "ADD_ACTS_SECTIONS_SUCCESS" ||
    updateActionType === "ADD_OCCURRENCE_OF_OFFENCE_SUCCESS" ||
    updateActionType === "ADD_COMPLAINANT_SUCCESS" ||
    updateActionType === "ADD_BRIEF_FACTS_SUCCESS" ||
    updateActionType === "UPLOAD_DOCUMENTS_SUCCESS" ||
    updateActionType === "DELETE_DOCUMENTS_SUCCESS" ||
    updateActionType === "ADD_PROPERTY_DETAILS_SUCCESS" ||
    updateActionType === "ADD_ACCUSED_DETAILS_SUCCESS" ||
    updateActionType === "ADD_VICTIM_DETAILS_SUCCESS";

  return isUpdateSuccess;
};

export const isUpdateError = (updateActionType) => {
  const isUpdateError =
    updateActionType === "UPDATE_FIR_ERROR" ||
    updateActionType === "ADD_ACTS_SECTIONS_ERROR" ||
    updateActionType === "ADD_OCCURRENCE_OF_OFFENCE_ERROR" ||
    updateActionType === "ADD_COMPLAINANT_ERROR" ||
    updateActionType === "ADD_BRIEF_FACTS_ERROR" ||
    updateActionType === "UPLOAD_DOCUMENTS_ERROR" ||
    updateActionType === "DELETE_DOCUMENTS_ERROR" ||
    updateActionType === "ADD_PROPERTY_DETAILS_ERROR" ||
    updateActionType === "ADD_ACCUSED_DETAILS_ERROR" ||
    updateActionType === "ADD_VICTIM_DETAILS_ERROR";

  return isUpdateError;
};

export const accordionTitle = (title, isRequired) => {
  return (
    <div className="headerTextContainer">
      <div className={`panelTitle ${isRequired ? "requiredField" : ""}`}>
        {title}
      </div>
    </div>
  );
};
