import { isEmpty } from "lodash";

export const dnaSamplingForm = [
  {
    name: "fsldnaWitnessList",
    label: "List of Witnesses",
    type: "dropdown",
  },
  {
    name: "fsldnaAccusedList",
    label: "List of Accused",
    type: "dropdown",
  },
  {
    name: "fslbabyOfWitness",
    label: "Baby Of Witness",
    actionLink: "addPerson",
    actionName: "Add Person",
    type: "dropdown",
  },
  {
    name: "fsldateOfAcknowledgement",
    label: "Acknowledgment from FSL received on",
    type: "date",
  },
  {
    name: "fslacknowledgementNo",
    label: "FSL Acknowledgement No.",
    type: "text",
  },
  {
    name: "fsldateOfDNACollection",
    label: "Date of DNA collection FSL",
    type: "date",
  },
  {
    name: "fslFileNofsl",
    label: "FSL File No.",
    type: "text",
  },
];

export const otherCourts = [
  { label: "From Other Court" },
  { label: "Government Dept" },
  { label: "Others" },
];

export const initialQuestionnaireData = { isOpen: false, selectedRecord: {} };

export const getQuestionnairiePayload = (
  questionsData = {},
  selectedRecord = {},
  selectedCrimeID = ""
) => {
  const payload = {};
  payload.crimeId = selectedCrimeID;
  payload.scientificEvidenceId = selectedRecord?._id;
  payload.scientificEvidence = {
    ...selectedRecord,
    propertyQuestions: {
      selectedQuestions: questionsData?.selectedQuestions || [],
      otherQuestions: !isEmpty(questionsData?.otherQuestion)
        ? [questionsData?.otherQuestion]
        : [],
    },
  };
  return payload;
};
