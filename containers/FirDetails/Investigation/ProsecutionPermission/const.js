export const prosecutionofAccusedForm = [
  {
    name: "dateOfSubmissionToUnitOfficer",
    label: "Date of Submission of Report to Unit Officer",
    type: "date",
  },
];

export const prosecutionofAccusedForm2 = [
  {
    name: "reportForwardDate",
    label:
      "Date of forwarding the report by DCRB/CCRB/C1 to Director, SCRB, CID",
    type: "date",
  },
  { name: "govSanctionNum", label: "Government Sanction Number", type: "text" },
  { name: "govSanctionDate", label: "Government Sanction Date", type: "date" },
];

export const prosecutionofAccusedFormNon = [
  {
    name: "dateOfSubmissionToUnitOfficer",
    label: "Date of Submission of Report to Unit Officer",
    type: "date",
  },
  {
    name: "reportForwardDate",
    label:
      "Date of forwarding the report by DCRB/CCRB/C1 to Director, SCRB, CID",
    type: "date",
  },
];

export const closureOfCaseForm = [
  { name: "natureOfClosure", label: "Nature of closure", type: "dropdown" },
  {
    name: "competentAuthorityClosure",
    label: "Competent Authority",
    type: "dropdown",
  },
  {
    name: "dateOfRequisitionToSuperiorOfficer",
    label: "Date of requisition to superior officer",
    type: "date",
  },
];

export const deletionOfAccusedForm = [
  {
    name: "reasonForDeletion",
    label: "Reasons for Deletion",
    type: "dropdown",
  },
  {
    name: "competentAuthorityDeletion",
    label: "Competent Authority",
    type: "dropdown",
  },
  {
    name: "dateOfRequisitionToSuperiorOfficer",
    label: "Date of requisition to superior officer",
    type: "date",
  },
];

export const natureOfPermission = [
  { label: "Closure of Case" },
  { label: "Deletion of Accused" },
  { label: "Deletion of Section" },
  { label: "Prosecution of Accused" },
];

export const natureOfClosure = [
  { label: "Action Abated (death of accused)" },
  { label: "Action Dropped" },
  { label: "Civil Nature" },
  { label: "High Court Quashed proceedings" },
  { label: "Lack of Evidence" },
  { label: "Mistake of Fact" },
  { label: "Non cognizable" },
  { label: "Transferred" },
  { label: "Undetectable" },
  { label: "Any Other" },
];

export const reasonForDeletion = [{ label: "Lack of Evidence" }];

export const OffenceList = [
  { label: "Explosives Substance Act" },
  { label: "Indian Arms Act" },
  { label: "Provisions of Passport Act" },
  { label: "Sec.153(A) IPC" },
  { label: "Sec.120(B) IPC" },
  { label: "Sec.505 IPC" },
  { label: "Any other" },
];

export const prosecutionofAccusedCompetentAuthority = [
  { label: "Collector and District Magistrate" },
  { label: "Commissioner of Police" },
  { label: "DIG of Police" },
  { label: "Government" },
  { label: "IG of Police" },
  { label: "Superintendent of Police" },
];

export const competentAuthorityList = [
  { label: "ACP/DSP" },
  { label: "CP" },
  { label: "DCP/SP" },
  { label: "DIG" },
];
