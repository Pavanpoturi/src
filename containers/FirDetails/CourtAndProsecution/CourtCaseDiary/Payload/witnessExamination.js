import { getIODetails, uploadFiles } from "../const";
import { getPersonDetails, folderName } from "@containers/FirDetails/fir-util";

export const addWitnessExaminationPayload = async (
  values,
  staffList,
  selectedPerson,
  inputList,
  commonPayload,
  dataSource,
  witnessDataSource,
  setError,
  accusedData
) => {
  const accusedDetails = dataSource.map((accused) => {
    const filteredList = accusedData(accused);
    return {
      person: accused?.person,
      presence: accused?.accusedPresence,
      isDefenseCounselPetitionFiled: accused?.petitionFiledByDefenceCouncil,
      isPleadingGuilty: accused?.accusedPleadedGuilty,
      statusExamination: accused?.accusedExaminationStatus,
      isIssueOfWarrants: filteredList?.isIssueOfWarrants,
      isNoticeToSurety: filteredList?.isNoticeToSurety,
      isProclamation: filteredList?.isProclamation,
    };
  });

  const witnessDetails = [];
  for (let i = 0; i < witnessDataSource.length; i++) {
    let witness = witnessDataSource[i];
    const temp = {
      person: witness?.witnessId,
      presence: witness?.witnessPresence,
      statusExamination: witness?.witnessExaminationStatus,
      statusCrossExamination:
        witness?.crossExaminationStatus === "Examination Completed"
          ? "Examination Completed"
          : "No",
      hasSupportedProsecution: witness?.supportedTheProsecuction,
      statement: await uploadFiles(
        witness?.witnessStatementMedia,
        commonPayload?.crimeId,
        `${commonPayload?.crimeId}/${folderName.WITNESS_STATEMENT}/file`,
        setError
      ),
    };
    witnessDetails.push(temp);
  }

  const payload = {
    ...commonPayload,
    trialFor: "Witness Examination",
    dateOfTrial: values?.ccdDate,
    isIOPresent: values?.presentIO,
    ...getIODetails(values?.IOName, staffList),
    isPPPresent: values?.presentPP,
    ppName: values?.APPOName,
    ppRank: values?.rank,
    isDefenseCounselPresent: values?.defenseCounselPresent,
    personDefenseCounsel: getPersonDetails(selectedPerson, inputList),
    accusedDetails,
    witnessDetails,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    reasonPendingOthers: values?.reasonForOther,
  };

  return payload;
};
export const updateWitnessExaminationPayload = async (
  values,
  staffList,
  selectedPerson,
  inputList,
  commonPayload,
  dataSource,
  witnessDataSource,
  courtCaseDiaryId,
  setError,
  accusedData
) => {
  const accusedDetails = dataSource.map((accused) => {
    const filteredList = accusedData(accused);
    return {
      person: accused?.person,
      presence: accused?.accusedPresence,
      isDefenseCounselPetitionFiled: accused?.petitionFiledByDefenceCouncil,
      isPleadingGuilty: accused?.accusedPleadedGuilty,
      statusExamination: accused?.accusedExaminationStatus,
      isIssueOfWarrants: filteredList?.isIssueOfWarrants,
      isNoticeToSurety: filteredList?.isNoticeToSurety,
      isProclamation: filteredList?.isProclamation,
    };
  });
  const witnessDetails = [];
  for (let i = 0; i < witnessDataSource.length; i++) {
    let witness = witnessDataSource[i];
    const temp = {
      person: witness?.witnessId,
      presence: witness?.witnessPresence,
      statusExamination: witness?.witnessExaminationStatus,
      statusCrossExamination:
        witness?.crossExaminationStatus === "Examination Completed"
          ? "Examination Completed"
          : "No",
      hasSupportedProsecution: witness?.supportedTheProsecuction,
      statement: await uploadFiles(
        !!witness?.witnessStatementMedia ? witness?.witnessStatementMedia : [],
        commonPayload?.crimeId,
        `${commonPayload?.crimeId}/${folderName.WITNESS_STATEMENT}/file`,
        setError
      ),
    };
    witnessDetails.push(temp);
  }

  const payload = {
    ...commonPayload,
    trialFor: "Witness Examination",
    dateOfTrial: values?.ccdDate,
    isIOPresent: values?.presentIO,
    ...getIODetails(values?.IOName, staffList),
    isPPPresent: values?.presentPP,
    ppName: values?.APPOName,
    ppRank: values?.rank,
    isDefenseCounselPresent: values?.defenseCounselPresent,
    personDefenseCounsel: getPersonDetails(selectedPerson, inputList),
    accusedDetails,
    witnessDetails,
    isCasePostedForNextHearing: values?.isCasePostedForNext,
    reasonPending: values?.reasonForPending,
    dateOfNextHearing: values?.nextHearingDate,
    postedFor: values?.postedFor,
    courtProceedings: values?.courtProceedings,
    courtCaseDiaryId: courtCaseDiaryId,
    reasonPendingOthers: values?.reasonForOther,
  };

  return payload;
};
