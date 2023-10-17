export const PendingList = [
  { label: "Address not found" },
  { label: "Door Locked" },
  { label: "Rejected by Person" },
  { label: "Other" },
];

export const ReturnToCourtList = [
  { label: "For Fresh Summons" },
  { label: "Returned un-served" },
  { label: "Retuned after service " },
  { label: "Summon not served hence requesting for issue of Warrant" },
  { label: "Other" },
];

export const getHeaderTitle = (
  title,
  actionName,
  activeKey,
  isRequired = false
) => {
  return (
    <div className="headerTextContainer" onClick={() => actionName(activeKey)}>
      <div className={`panelTitle ${isRequired ? "requiredField" : ""}`}>
        {title}
      </div>
    </div>
  );
};
