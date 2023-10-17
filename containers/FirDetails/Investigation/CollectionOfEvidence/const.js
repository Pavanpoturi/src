/* eslint-disable array-callback-return */
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import { isNull, isEmpty } from "lodash";
import {
  DATE_FORMAT,
  TIME_FORMAT,
  getPersonAddressTemplate,
  DATE_TIME_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import {
  Template65BEvidenceActCertificate,
  TemplateCCTVFootage,
  TemplateCDRRequestDCPToServiceProvider,
  TemplateCDRRequestIOToDCP,
  TemplateCDRRequisitionFormatToDCP,
  TemplateLetterToCompanies,
  TemplateLetterToCoopHousingSociety,
  TemplateLetterToCoopRegistrarHousingSociety,
  TemplateLetterToEducationalInstitutions,
  TemplateLetterToEmployerOnGenuinessOfIncomeCertificateAndParticulars,
  TemplateLetterToFinancialInstitution,
  TemplateLetterToGHMCOnApprovedPlan,
  TemplateLetterToGHMCOnDateOfBirthCertificate,
  TemplateLetterToGHMCOnTaxPaidAndHouseNo,
  TemplateLetterToIncomeTaxDeptOnItReturns,
  TemplateLetterToRailwayRecruitmentBoard,
  TemplateLetterToRegionalPassportOfficer,
  TemplateLetterToRtaOnDrivingLicence,
  TemplateLetterToSCSTBCWelfareCorporation,
  TemplateLetterToSROForCertifiedCopies,
  TemplateLetterToSurveyAndSettlement,
  TemplateLetterToTahsildarForClarificationOfLand,
  TemplateLetterToTahsildarForPahaniCopies,
  TemplateLetterToTahsildarOnCasteCertificate,
  TemplateLetterToUnitOfficePassportSectionOnFakeVerification,
  TemplateLetterToVillageSecretary,
  TemplateCourtLetterForReturnOfFS,
  TemplateCourtLetterToFSLSampleSignature,
  TemplateCourtLetterToFSLVoiceRecordings,
  TemplateLetterByCourtToFSLForD,
  TemplateLetterByCourtToSRO,
  TemplateLetterToCourtToCourtFor,
  TemplateReminderForFSLReport,
  TemplateLetterForCollectingVoice,
  TemplateLetterForForwardingPhoneAn,
  TemplateLetterOfAdvice,
  TemplateLetterToCourtForDnaCollec,
  TemplateLetterToCourtForObtaining,
  TemplateLetterToCourtForRegisters,
  TemplateLetterToCourtWithLetterOf,
  TemplateLetterToTakingSampleSignat,
  TemplateLetterForPMEClarification,
  TemplateLetterToExperts,
  TemplateLetterToLadyMedicalOfficerFinalOpinion,
  TemplateMedicoLegalRequisition,
  TemplateDnaAccusedThroughACP,
  TemplateDnaBabyThroughACP,
  TemplateDnaVictimThroughACP,
  TemplateLetterOfadvice,
  LetterToACP,
  GenerateLetterOfAdvice,
} from "@containers/GenerateTemplates";

export const digitalEvidenceCCTVTemplates = [
  {
    name: "C C T V Footage",
    label: "C C T V Footage",
    fileName: "C_C_T_V_Footage",
    templateAvailable: true,
  },
  {
    name: "65B Evidence Act Certificate",
    label: "65B Evidence Act Certificate",
    fileName: "65B_Evidence_Act_Certificate",
    templateAvailable: true,
  },
];

export const digitalEvidenceAudioTemplates = [
  {
    name: "65B Evidence Act Certificate",
    label: "65B Evidence Act Certificate",
    fileName: "65B_Evidence_Act_Certificate",
    templateAvailable: true,
  },
];

export const digitalEvidenceCDRTemplates = [
  {
    name: "CDR Request DCP To ServiceProvider",
    label: "CDR Request DCP To Service Provider",
    fileName: "CDR_Request_DCP_To_Service_Provider",
    templateAvailable: true,
  },
  {
    name: "CDR Request IO To DCP",
    label: "CDR Request IO To DCP",
    fileName: "CDR_Request_IO_To_DCP",
    templateAvailable: true,
  },
  {
    name: "CDR Requisition Format To DCP",
    label: "CDR Requisition Format To DCP",
    fileName: "CDR_Requisition_Format_To_DCP",
    templateAvailable: true,
  },
];

export const documentryEvidenceTemplates = [
  {
    name: "Letter To Companies",
    label: "Letter To Companies",
    fileName: "Letter_To_Companies",
    templateAvailable: true,
  },
  {
    name: "Letter To Coop Housing Society",
    label: "Letter To Coop Housing Society",
    fileName: "Letter_To_Coop_Housing_Society",
    templateAvailable: true,
  },
  {
    name: "Letter To Coop Registrar Housing Society",
    label: "Letter To Coop Registrar Housing Society",
    fileName: "Letter_To_Coop_Registrar_Housing_Society",
    templateAvailable: true,
  },
  {
    name: "Letter To Educational Institutions",
    label: "Letter To Educational Institutions",
    fileName: "Letter_To_Educational_Institutions",
    templateAvailable: true,
  },
  {
    name: "Letter To Employer On Genuineness Of Income Certificate And Particulars",
    label:
      "Letter To Employer On Genuineness Of Income Certificate And Particulars",
    fileName:
      "Letter_To_Employer_On_Genuiness_Of_Income_Certificate_And_Particulars",
    templateAvailable: true,
  },
  {
    name: "Letter To Financial Institution",
    label: "Letter To Financial Institution",
    fileName: "Letter_To_Financial_Institution",
    templateAvailable: true,
  },
  {
    name: "Letter To GHMC On Approved Plan",
    label: "Letter To GHMC On Approved Plan",
    fileName: "Letter_To_GHMC_On_Approved_Plan",
    templateAvailable: true,
  },
  {
    name: "Letter To GHMC On Date Of Birth Certificate",
    label: "Letter To GHMC On Date Of Birth Certificate",
    fileName: "Letter_To_GHMC_On_Date_Of_Birth_Certificate",
    templateAvailable: true,
  },
  {
    name: "Letter To GHMC On Tax Paid And House No",
    label: "Letter To GHMC On Tax Paid And House No",
    fileName: "Letter_To_GHMC_On_Tax_Paid_And_House_No",
    templateAvailable: true,
  },
  {
    name: "Letter To Income Tax Dept On It Returns",
    label: "Letter To Income Tax Dept On It Returns",
    fileName: "Letter_To_Income_Tax_Dept_On_It_Returns",
    templateAvailable: true,
  },
  {
    name: "Letter To Railway Recruitment Board",
    label: "Letter To Railway Recruitment Board",
    fileName: "Letter_To_Railway_Recruitment_Board",
    templateAvailable: true,
  },
  {
    name: "Letter To Regional Passport Officer",
    label: "Letter To Regional Passport Officer",
    fileName: "Letter_To_Regional_Passport_Officer",
    templateAvailable: true,
  },
  {
    name: "Letter To RTA On Driving Licence",
    label: "Letter To RTA On Driving Licence",
    fileName: "Letter_To_RTA_On_Driving_Licence",
    templateAvailable: true,
  },
  {
    name: "Letter To SC ST BC Welfare Corporation",
    label: "Letter To SC ST BC Welfare Corporation",
    fileName: "Letter_To_SC_ST_BC_Welfare_Corporation",
    templateAvailable: true,
  },
  {
    name: "Letter To SRO For Certified Copies",
    label: "Letter To SRO For Certified Copies",
    fileName: "Letter_To_SRO_For_Certified_Copies",
    templateAvailable: true,
  },
  {
    name: "Letter To Survey And Settlement",
    label: "Letter To Survey And Settlement",
    fileName: "Letter_To_Survey_And_Settlement",
    templateAvailable: true,
  },
  {
    name: "Letter To Tahsildar For Clarification Of Land",
    label: "Letter To Tahsildar For Clarification Of Land",
    fileName: "Letter_To_Tahsildar_For_Clarification_Of_Land",
    templateAvailable: true,
  },
  {
    name: "Letter To Tahsildar For Pahani Copies",
    label: "Letter To Tahsildar For Pahani Copies",
    fileName: "Letter_To_Tahsildar_For_Pahani_Copies",
    templateAvailable: true,
  },
  {
    name: "Letter To Tahsildar On Caste Certificate",
    label: "Letter To Tahsildar On Caste Certificate",
    fileName: "Letter_To_Tahsildar_On_Caste_Certificate",
    templateAvailable: true,
  },
  {
    name: "Letter To Unit Office Passport Section On Fake Verification",
    label: "Letter To Unit Office Passport Section On Fake Verification",
    fileName: "Letter_To_Unit_Office_Passport_Section_On_Fake_Verification",
    templateAvailable: true,
  },
  {
    name: "Letter To Village Secretary",
    label: "Letter To Village Secretary",
    fileName: "Letter_To_Village_Secretary",
    templateAvailable: true,
  },
];

export const scientificEvidenceMainPageTemplates = [
  {
    name: "Letter For PME Clarification",
    label: "Letter For PME Clarification",
    fileName: "Letter_For_PME_Clarification",
    templateAvailable: true,
  },
  {
    name: "Letter To Experts",
    label: "Letter To Experts",
    fileName: "Letter_To_Experts",
    templateAvailable: true,
  },
  {
    name: "Letter To Lady Medical Officer Final Opinion",
    label: "Letter To Lady Medical Officer Final Opinion",
    fileName: "Letter_To_Lady_Medical_Officer_Final_Opinion",
    templateAvailable: true,
  },
  {
    name: "Medico Legal Requisition",
    label: "Medico Legal Requisition",
    fileName: "Medico_Legal_Requisition",
    templateAvailable: true,
  },
];

export const scientificEvidenceThroughCourtsTemplates = [
  {
    name: "Court Letter For Return Of FSL",
    label: "Court Letter For Return Of FSL",
    fileName: "Court_Letter_For_Return_Of_FSL",
    templateAvailable: true,
  },
  {
    name: "Court Letter To FSL Sample Signature",
    label: "Court Letter To FSL Sample Signature",
    fileName: "Court_Letter_To_FSL_Sample_Signature",
    templateAvailable: true,
  },
  {
    name: "Court Letter To FSL Voice Recordings",
    label: "Court Letter To FSL Voice Recordings",
    fileName: "Court_Letter_To_FSL_Voice_Recordings",
    templateAvailable: true,
  },
  {
    name: "Letter By Court To FSL For DNA",
    label: "Letter By Court To FSL For DNA",
    fileName: "Letter_By_Court_To_FSL_For_DNA",
    templateAvailable: true,
  },
  {
    name: "Letter By Court To SRO",
    label: "Letter By Court To SRO",
    fileName: "Letter_By_Court_To_SRO",
    templateAvailable: true,
  },
  {
    name: "Letter To Court To Court",
    label: "Letter To Court To Court",
    fileName: "Letter_To_Court_To_Court",
    templateAvailable: true,
  },
  {
    name: "Reminder For FSL Report",
    label: "Reminder For FSL Report",
    fileName: "Reminder_For_FSL_Report",
    templateAvailable: true,
  },
  {
    name: "Letter For Collecting Voice",
    label: "Letter For Collecting Voice",
    fileName: "Letter_For_Collecting_Voice",
    templateAvailable: true,
  },
  {
    name: "Letter For Forwarding Phone Number",
    label: "Letter For Forwarding Phone Number",
    fileName: "Letter_For_Forwarding_Phone_Number",
    templateAvailable: true,
  },
  {
    name: "Letter Of Advice",
    label: "Letter Of Advice",
    fileName: "Letter_Of_Advice",
    templateAvailable: true,
  },
  {
    name: "Letter To Court For DNA Collec",
    label: "Letter To Court For DNA Collec",
    fileName: "Letter_To_Court_For_Dna_Collec",
    templateAvailable: true,
  },
  {
    name: "Letter To Court For Obtaining",
    label: "Letter To Court For Obtaining",
    fileName: "Letter_To_Court_For_Obtaining",
    templateAvailable: true,
  },
  {
    name: "Letter To Court For Registers",
    label: "Letter To Court For Registers",
    fileName: "Letter_To_Court_For_Registers",
    templateAvailable: true,
  },
  {
    name: "Letter To Court With Letter",
    label: "Letter To Court With Letter",
    fileName: "Letter_To_Court_With_Letter",
    templateAvailable: true,
  },
  {
    name: "Letter To Taking Sample Signatature",
    label: "Letter To Taking Sample Signatature",
    fileName: "Letter_To_Taking_Sample_Signature",
    templateAvailable: true,
  },
];

export const scientificEvidenceThroughACPTemplates = [
  {
    name: "DNA Accused Through ACP",
    label: "DNA Accused Through ACP",
    fileName: "Dna_Accused_Through_ACP",
    templateAvailable: true,
  },
  {
    name: "DNA Baby Through ACP",
    label: "DNA Baby Through ACP",
    fileName: "Dna_Baby_Through_ACP",
    templateAvailable: true,
  },
  {
    name: "DNA Victim Through ACP",
    label: "DNA Victim Through ACP",
    fileName: "Dna_Victim_Through_ACP",
    templateAvailable: true,
  },
  {
    name: "Letter Of Advice",
    label: "Letter Of Advice",
    fileName: "Letter_Of_advice",
    templateAvailable: true,
  },
  {
    name: "Generate Letter to ACP",
    label: "Generate Letter to ACP",
    fileName: "Generate_Letter_to_ACP",
    templateAvailable: true,
  },
  {
    name: "Generate Letter of Advice",
    label: "Generate Letter of Advice",
    fileName: "Generate_Letter_of_Advice",
    templateAvailable: true,
  },
];

export const CRPCSec164StatementAccusedTemplates = [
  {
    name: "164 CrPC Requisition for accused to court",
    label: "164 CrPC Requisition for accused to court",
    fileName: "164_crpc_statement_accused",
    templateAvailable: true,
  },
];

export const CRPCSec164StatementWitnessTemplates = [
  {
    name: "164 CrPC Requisition for witness to court",
    label: "164 CrPC Requisition for witness to court",
    fileName: "164_crpc_statement_witness",
    templateAvailable: true,
  },
];

export const scientificDropdownOptions = [
  {
    name: "expertType",
    label: "Expert Type",
    type: "dropdown",
    isRequired: true,
  },
  {
    name: "natureOfReport",
    label: "Nature Of Report",
    type: "dropdown",
  },
];

export const scientificNonFSLOptions = [
  {
    name: "dateOfRequisitionForReport",
    label: "Date Of Requisition",
    type: "date",
  },
  {
    name: "typeOfRequisition",
    label: "Type Of Requisition",
    type: "dropdown",
  },
  {
    name: "dateOfVisitInspection",
    label: "Date of Visit / Inspection / Examination",
    type: "date",
  },
  {
    name: "nameAndAddressOfExpert",
    label: "Name and Address of Expert",
    actionLink: "addProfessional",
    actionName: "Add Professional",
    type: "text",
  },
];

export const requisitionThroughCourt = [
  {
    name: "dateOfRequisitionToCourt",
    label: "Date Of Requisition to court",
    type: "date",
  },
  {
    name: "nameOfCourt",
    label: "Court Name",
    type: "dropdown",
  },
  {
    name: "dateAndTimeOfSendingToFSL",
    label: "Date And Time Of Sending To FSL",
    type: "date",
  },
];

export const requisitionThroughACP = [
  {
    name: "dateOfRequisitionToACP",
    label:
      "Date Of Requisition to ACP for addressing FSL for collection of DNA sample",
    type: "date",
    isRequired: true,
  },
  {
    name: "dnaSamplingOf",
    label: "DNA Sampling of",
    type: "dropdown",
    isRequired: true,
  },
  {
    name: "babyOfWitness",
    label: "Baby of Witness",
    type: "dropdown",
    actionLink: "addPerson",
    actionName: "Add Person",
  },
  {
    name: "dateOfDnaSampleCollected",
    label: "Date Of DNA sample collected by FSL",
    type: "date",
  },
  {
    name: "fslFileNumber",
    label: "FSL File No",
    type: "text",
  },
  {
    name: "dateAndTimeOfSendingToFSL",
    label: "Date And Time Of Sending To FSL",
    type: "date",
  },
];

export const uploadExpertReportOption = [
  {
    name: "dateOfReceiptOfReport",
    label: "Date of Receipt of Report",
    type: "date",
  },
  {
    name: "strengthOfEvidence",
    label: "Strength of Evidence",
    type: "dropdown",
  },
  {
    name: "expertName",
    label: "Expert Name",
    type: "dropdown",
    actionLink: "addProfessional",
    actionName: "Add Professional",
  },
  {
    name: "opinion",
    label: "Opinion",
    type: "text",
  },
  {
    name: "uploadReport",
    label: "",
    type: "button",
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "65B_Evidence_Act_Certificate":
      return (
        <Template65BEvidenceActCertificate fileName={filename} data={data} />
      );
    case "C_C_T_V_Footage":
      return <TemplateCCTVFootage fileName={filename} data={data} />;
    case "CDR_Request_DCP_To_Service_Provider":
      return (
        <TemplateCDRRequestDCPToServiceProvider
          fileName={filename}
          data={data}
        />
      );
    case "CDR_Request_IO_To_DCP":
      return <TemplateCDRRequestIOToDCP fileName={filename} data={data} />;
    case "CDR_Requisition_Format_To_DCP":
      return (
        <TemplateCDRRequisitionFormatToDCP fileName={filename} data={data} />
      );
    case "Letter_To_Companies":
      return <TemplateLetterToCompanies fileName={filename} data={data} />;
    case "Letter_To_Coop_Housing_Society":
      return (
        <TemplateLetterToCoopHousingSociety fileName={filename} data={data} />
      );
    case "Letter_To_Coop_Registrar_Housing_Society":
      return (
        <TemplateLetterToCoopRegistrarHousingSociety
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Educational_Institutions":
      return (
        <TemplateLetterToEducationalInstitutions
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Employer_On_Genuiness_Of_Income_Certificate_And_Particulars":
      return (
        <TemplateLetterToEmployerOnGenuinessOfIncomeCertificateAndParticulars
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Financial_Institution":
      return (
        <TemplateLetterToFinancialInstitution fileName={filename} data={data} />
      );
    case "Letter_To_GHMC_On_Approved_Plan":
      return (
        <TemplateLetterToGHMCOnApprovedPlan fileName={filename} data={data} />
      );
    case "Letter_To_GHMC_On_Date_Of_Birth_Certificate":
      return (
        <TemplateLetterToGHMCOnDateOfBirthCertificate
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_GHMC_On_Tax_Paid_And_House_No":
      return (
        <TemplateLetterToGHMCOnTaxPaidAndHouseNo
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Income_Tax_Dept_On_It_Returns":
      return (
        <TemplateLetterToIncomeTaxDeptOnItReturns
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Railway_Recruitment_Board":
      return (
        <TemplateLetterToRailwayRecruitmentBoard
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Regional_Passport_Officer":
      return (
        <TemplateLetterToRegionalPassportOfficer
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_RTA_On_Driving_Licence":
      return (
        <TemplateLetterToRtaOnDrivingLicence fileName={filename} data={data} />
      );
    case "Letter_To_SC_ST_BC_Welfare_Corporation":
      return (
        <TemplateLetterToSCSTBCWelfareCorporation
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_SRO_For_Certified_Copies":
      return (
        <TemplateLetterToSROForCertifiedCopies
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Survey_And_Settlement":
      return (
        <TemplateLetterToSurveyAndSettlement fileName={filename} data={data} />
      );
    case "Letter_To_Tahsildar_For_Clarification_Of_Land":
      return (
        <TemplateLetterToTahsildarForClarificationOfLand
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Tahsildar_For_Pahani_Copies":
      return (
        <TemplateLetterToTahsildarForPahaniCopies
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Tahsildar_On_Caste_Certificate":
      return (
        <TemplateLetterToTahsildarOnCasteCertificate
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Unit_Office_Passport_Section_On_Fake_Verification":
      return (
        <TemplateLetterToUnitOfficePassportSectionOnFakeVerification
          fileName={filename}
          data={data}
        />
      );
    case "Letter_To_Village_Secretary":
      return (
        <TemplateLetterToVillageSecretary fileName={filename} data={data} />
      );
    case "Court_Letter_For_Return_Of_FSL":
      return (
        <TemplateCourtLetterForReturnOfFS fileName={filename} data={data} />
      );
    case "Court_Letter_To_FSL_Sample_Signature":
      return (
        <TemplateCourtLetterToFSLSampleSignature
          fileName={filename}
          data={data}
        />
      );
    case "Court_Letter_To_FSL_Voice_Recordings":
      return (
        <TemplateCourtLetterToFSLVoiceRecordings
          fileName={filename}
          data={data}
        />
      );
    case "Letter_By_Court_To_FSL_For_DNA":
      return <TemplateLetterByCourtToFSLForD fileName={filename} data={data} />;
    case "Letter_By_Court_To_SRO":
      return <TemplateLetterByCourtToSRO fileName={filename} data={data} />;
    case "Letter_To_Court_To_Court":
      return (
        <TemplateLetterToCourtToCourtFor fileName={filename} data={data} />
      );
    case "Reminder_For_FSL_Report":
      return <TemplateReminderForFSLReport fileName={filename} data={data} />;
    case "Letter_For_Collecting_Voice":
      return (
        <TemplateLetterForCollectingVoice fileName={filename} data={data} />
      );
    case "Letter_For_Forwarding_Phone_Number":
      return (
        <TemplateLetterForForwardingPhoneAn fileName={filename} data={data} />
      );
    case "Letter_Of_Advice":
      return <TemplateLetterOfAdvice fileName={filename} data={data} />;
    case "Letter_To_Court_For_Dna_Collec":
      return (
        <TemplateLetterToCourtForDnaCollec fileName={filename} data={data} />
      );
    case "Letter_To_Court_For_Obtaining":
      return (
        <TemplateLetterToCourtForObtaining fileName={filename} data={data} />
      );
    case "Letter_To_Court_For_Registers":
      return (
        <TemplateLetterToCourtForRegisters fileName={filename} data={data} />
      );
    case "Letter_To_Court_With_Letter":
      return (
        <TemplateLetterToCourtWithLetterOf fileName={filename} data={data} />
      );
    case "Letter_To_Taking_Sample_Signature":
      return (
        <TemplateLetterToTakingSampleSignat fileName={filename} data={data} />
      );
    case "Letter_For_PME_Clarification":
      return (
        <TemplateLetterForPMEClarification fileName={filename} data={data} />
      );
    case "Letter_To_Experts":
      return <TemplateLetterToExperts fileName={filename} data={data} />;
    case "Letter_To_Lady_Medical_Officer_Final_Opinion":
      return (
        <TemplateLetterToLadyMedicalOfficerFinalOpinion
          fileName={filename}
          data={data}
        />
      );
    case "Medico_Legal_Requisition":
      return <TemplateMedicoLegalRequisition fileName={filename} data={data} />;
    case "Dna_Accused_Through_ACP":
      return <TemplateDnaAccusedThroughACP fileName={filename} data={data} />;
    case "Dna_Baby_Through_ACP":
      return <TemplateDnaBabyThroughACP fileName={filename} data={data} />;
    case "Dna_Victim_Through_ACP":
      return <TemplateDnaVictimThroughACP fileName={filename} data={data} />;
    case "Letter_Of_advice":
      return <TemplateLetterOfadvice fileName={filename} data={data} />;
    case "Generate_Letter_to_ACP":
      return <LetterToACP fileName={filename} data={data} />;
    case "Generate_Letter_of_Advice":
      return <GenerateLetterOfAdvice fileName={filename} data={data} />;

    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser,
  selectedWitnessAccused,
  savedFir
) => {
  const { firNum, district, psName, dateOfReport, briefFacts } = selectedFir;
  const selectedActsData = loadState("selectedActDetails");
  var section = selectedFir?.actsAndSections.map(function (i) {
    return i.section;
  });
  var merged = [].concat.apply([], section);
  var actsSections = merged?.toString();
  var secdata = !isEmpty(actsSections)
    ? getTemplatesSectionsData(selectedActsData?.uniqActs)
    : selectedFir?.section;

  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    IOName: getIONameAndRank(briefFacts),
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };

  let reportData = {};
  const complainantList = loadState("complainantList");

  let { complainantname, complainantaddress } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      complainantname =
        data?.person?.personalDetails?.name +
        " " +
        data?.person?.personalDetails?.surname;
      const { presentAddress } = !isNull(data?.person) && data?.person;
      complainantaddress = getPersonAddressTemplate(presentAddress);
    });

  switch (fileName) {
    case "65B_Evidence_Act_Certificate":
      let accusedAge =
        formData?.ownerOfCCTV?.personalDetails?.dateOfBirth &&
        moment().diff(
          formData?.ownerOfCCTV?.personalDetails?.dateOfBirth,
          "years"
        ) > 0
          ? moment().diff(
              formData?.ownerOfCCTV?.personalDetails?.dateOfBirth,
              "years"
            )
          : "";
      let phone = "";
      formData?.ownerOfCCTV?.contactDetails.map((p) => {
        phone = p.phoneNumber;
      });
      const resultcctv = {
        accusedName: `${formData?.ownerOfCCTV?.personalDetails?.name || ""} ${
          formData?.ownerOfCCTV?.personalDetails?.surname || ""
        }`,
        accusedAge: accusedAge,
        gender: formData?.ownerOfCCTV?.personalDetails?.gender || "",
        personAddress:
          getPersonAddressTemplate(formData?.ownerOfCCTV?.presentAddress) || "",
        accusedCaste: formData?.ownerOfCCTV?.personalDetails?.caste || "",
        accussedfather:
          formData?.ownerOfCCTV?.personalDetails?.fatherHusbandGuardianName ||
          "",
        occupation: formData?.ownerOfCCTV?.personalDetails?.occupation || "",
        phone: phone || "",
        currentDate: moment(formData?.dateOfCollection).format(DATE_FORMAT),
        selectPeriod: formData?.cctvFootageReqDates || [],
        placeofcctv: getPersonAddressTemplate(formData?.placeOfCCTV) || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...resultcctv };
      break;
    case "C_C_T_V_Footage":
      let accusedAge1 =
        formData?.ownerOfCCTV?.personalDetails?.dateOfBirth &&
        moment().diff(
          formData?.ownerOfCCTV?.personalDetails?.dateOfBirth,
          "years"
        ) > 0
          ? moment().diff(
              formData?.ownerOfCCTV?.personalDetails?.dateOfBirth,
              "years"
            )
          : "";
      let phone1 = "";
      formData?.ownerOfCCTV?.contactDetails.map((p) => {
        phone1 = p.phoneNumber;
      });
      const resultcctvf = {
        accusedName: `${formData?.ownerOfCCTV?.personalDetails?.name || ""} ${
          formData?.ownerOfCCTV?.personalDetails?.surname || ""
        }`,
        accusedAge: accusedAge1,
        gender: formData?.ownerOfCCTV?.personalDetails?.gender || "",
        personAddress:
          getPersonAddressTemplate(formData?.ownerOfCCTV?.presentAddress) || "",
        accusedCaste: formData?.ownerOfCCTV?.personalDetails?.caste || "",
        accussedfather:
          formData?.ownerOfCCTV?.personalDetails?.fatherHusbandGuardianName ||
          "",
        occupation: formData?.ownerOfCCTV?.personalDetails?.occupation || "",
        phone: phone1 || "",
        currentDate: moment(formData?.dateOfCollection).format(DATE_FORMAT),
        requestedPeriodfromdate:
          !isNull(formData?.cctvFootageReqDates) &&
          formData?.cctvFootageReqDates[0]
            ? moment(formData?.cctvFootageReqDates[0]).format(DATE_FORMAT)
            : "",
        requestedPeriodtodate:
          !isNull(formData?.cctvFootageReqDates) &&
          formData?.cctvFootageReqDates[1]
            ? moment(formData?.cctvFootageReqDates[1]).format(DATE_FORMAT)
            : "",
        requestedPeriodfromtime:
          !isNull(formData?.cctvFootageReqDates) &&
          formData?.cctvFootageReqDates[0]
            ? moment(formData?.cctvFootageReqDates[0]).format(TIME_FORMAT)
            : "",
        requestedPeriodtotime:
          !isNull(formData?.cctvFootageReqDates) &&
          formData?.cctvFootageReqDates[1]
            ? moment(formData?.cctvFootageReqDates[1]).format(TIME_FORMAT)
            : "",
        placeofcctv: getPersonAddressTemplate(formData?.placeOfCCTV) || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      console.log(resultcctvf);
      reportData = { ...commonReportData, ...resultcctvf };
      break;
    case "CDR_Request_DCP_To_Service_Provider":
      const cdr_service = {
        currentDate: moment().format(DATE_FORMAT),
        imeiNo: formData?.imeiNo || "",
        mobileNo: formData?.mobileNo || "",
        nickName: formData?.nickName || "",
        telecomServiceProvider: formData?.telecomServiceProvider || "",
        towerIdNo: formData?.towerIdNo || "",
        requestedPeriodfrom: formData?.requestCDRs?.requestedPeriod[0]
          ? moment(formData?.requestCDRs?.requestedPeriod[0]).format(
              DATE_TIME_FORMAT
            )
          : "",
        requestedPeriodto: formData?.requestCDRs?.requestedPeriod[1]
          ? moment(formData?.requestCDRs?.requestedPeriod[1]).format(
              DATE_TIME_FORMAT
            )
          : "",
        dateOfRequisition: formData?.requestCDRs?.dateOfRequisition
          ? moment(formData?.requestCDRs?.dateOfRequisition).format(DATE_FORMAT)
          : "",
      };

      reportData = { ...commonReportData, ...cdr_service };
      break;
    case "CDR_Request_IO_To_DCP":
      const cdr_serviceio = {
        currentDate: moment().format(DATE_FORMAT),
        imeiNo: formData?.imeiNo || "",
        mobileNo: formData?.mobileNo || "",
        nickName: formData?.nickName || "",
        telecomServiceProvider: formData?.telecomServiceProvider || "",
        towerIdNo: formData?.towerIdNo || "",
        requestedPeriodfrom: formData?.requestCDRs?.requestedPeriod[0]
          ? moment(formData?.requestCDRs?.requestedPeriod[0]).format(
              DATE_TIME_FORMAT
            )
          : "",
        requestedPeriodto: formData?.requestCDRs?.requestedPeriod[1]
          ? moment(formData?.requestCDRs?.requestedPeriod[1]).format(
              DATE_TIME_FORMAT
            )
          : "",
        dateOfRequisition: formData?.requestCDRs?.dateOfRequisition
          ? moment(formData?.requestCDRs?.dateOfRequisition).format(DATE_FORMAT)
          : "",
      };
      reportData = { ...commonReportData, ...cdr_serviceio };
      break;
    case "CDR_Requisition_Format_To_DCP":
      const cdr_servicedcp = {
        currentDate: moment().format(DATE_FORMAT),
        imeiNo: formData?.imeiNo || "",
        mobileNo: formData?.mobileNo || "",
        nickName: formData?.nickName || "",
        telecomServiceProvider: formData?.telecomServiceProvider || "",
        towerIdNo: formData?.towerIdNo || "",
        requesttype: formData?.requestCDRs?.requestType || [],
        requestedPeriodfrom: formData?.requestCDRs?.requestedPeriod[0]
          ? moment(formData?.requestCDRs?.requestedPeriod[0]).format(
              DATE_TIME_FORMAT
            )
          : moment().format(DATE_FORMAT),
        requestedPeriodto: formData?.requestCDRs?.requestedPeriod[1]
          ? moment(formData?.requestCDRs?.requestedPeriod[1]).format(
              DATE_TIME_FORMAT
            )
          : "Till Date",
        dateOfRequisition: formData?.requestCDRs?.dateOfRequisition
          ? moment(formData?.requestCDRs?.dateOfRequisition).format(DATE_FORMAT)
          : "",
      };
      reportData = { ...commonReportData, ...cdr_servicedcp };
      break;
    case "Letter_To_Companies":
      const lettertocom = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocom };
      break;
    case "Letter_To_Coop_Housing_Society":
      const lettertocoop = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocoop };
      break;
    case "Letter_To_Coop_Registrar_Housing_Society":
      const lettertocoopreg = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocoopreg };
      break;
    case "Letter_To_Educational_Institutions":
      const lettertoedu = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoedu };
      break;
    case "Letter_To_Employer_On_Genuiness_Of_Income_Certificate_And_Particulars":
      const lettertoEmployer = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoEmployer };
      break;
    case "Letter_To_Financial_Institution":
      const lettertoFinancial = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoFinancial };
      break;
    case "Letter_To_GHMC_On_Approved_Plan":
      const lettertoGHMC = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoGHMC };
      break;
    case "Letter_To_GHMC_On_Date_Of_Birth_Certificate":
      const lettertoGHMCdob = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoGHMCdob };
      break;
    case "Letter_To_GHMC_On_Tax_Paid_And_House_No":
      const lettertoGHMCtax = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoGHMCtax };
      break;
    case "Letter_To_Income_Tax_Dept_On_It_Returns":
      const lettertoIT = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoIT };
      break;
    case "Letter_To_Railway_Recruitment_Board":
      const lettertorail = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertorail };
      break;
    case "Letter_To_Regional_Passport_Officer":
      const lettertorpass = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertorpass };
      break;
    case "Letter_To_RTA_On_Driving_Licence":
      const lettertorta = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertorta };
      break;
    case "Letter_To_SC_ST_BC_Welfare_Corporation":
      const lettertoscst = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertoscst };
      break;
    case "Letter_To_SRO_For_Certified_Copies":
      const lettertosro = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertosro };
      break;
    case "Letter_To_Survey_And_Settlement":
      const lettertosurvey = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertosurvey };
      break;
    case "Letter_To_Tahsildar_For_Clarification_Of_Land":
      const lettertotahsclr = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertotahsclr };
      break;
    case "Letter_To_Tahsildar_For_Pahani_Copies":
      const lettertotahphani = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertotahphani };
      break;
    case "Letter_To_Tahsildar_On_Caste_Certificate":
      const lettertotahs = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertotahs };
      break;
    case "Letter_To_Unit_Office_Passport_Section_On_Fake_Verification":
      const lettertounit = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertounit };
      break;
    case "Letter_To_Village_Secretary":
      const lettertovillage = {
        currentDate: moment().format(DATE_FORMAT),
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertovillage };
      break;
    case "Court_Letter_For_Return_Of_FSL":
      const nameOfCourt = !isNull(formData) && formData?.nameOfCourt;
      const lettertocourtfsl = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: nameOfCourt || "",
        acknowledgementNo:
          !isNull(formData) &&
          !isNull(formData?.dnaSamplingFSL?.acknowledgementNo)
            ? formData?.dnaSamplingFSL?.acknowledgementNo
            : "",
        dateOfAcknowledgement:
          !isNull(formData) &&
          !isNull(formData?.dnaSamplingFSL?.dateOfAcknowledgement)
            ? moment(formData?.dnaSamplingFSL?.dateOfAcknowledgement).format(
                DATE_FORMAT
              )
            : "",
      };
      reportData = { ...commonReportData, ...lettertocourtfsl };
      break;
    case "Court_Letter_To_FSL_Sample_Signature":
      const lettertocourtfslsample = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtfslsample };
      break;
    case "Court_Letter_To_FSL_Voice_Recordings":
      const lettertocourtfslrec = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        accusedname:
          !isNull(formData) &&
          formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.name
            ? formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.name +
              " " +
              formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.surname
            : "",
      };
      reportData = { ...commonReportData, ...lettertocourtfslrec };
      break;
    case "Letter_By_Court_To_FSL_For_DNA":
      const lettertocourtfsldna = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        accusedname:
          !isNull(formData) &&
          formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.name
            ? formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.name +
              " " +
              formData?.dnaSamplingFSL?.accusedList[0]?.personalDetails?.surname
            : "",
        personAddress:
          !isNull(formData) &&
          formData?.dnaSamplingFSL?.accusedList[0]?.personAddress
            ? getPersonAddressTemplate(
                formData?.dnaSamplingFSL?.accusedList[0]?.personAddress
              )
            : "",
      };
      reportData = { ...commonReportData, ...lettertocourtfsldna };
      break;
    case "Letter_By_Court_To_SRO":
      const lettertocourtsro = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        acknowledgementNo:
          !isNull(formData) &&
          !isNull(formData?.dnaSamplingFSL?.acknowledgementNo)
            ? formData?.dnaSamplingFSL?.acknowledgementNo
            : "",
      };
      reportData = { ...commonReportData, ...lettertocourtsro };
      break;
    case "Letter_To_Court_To_Court":
      const lettertocourttoc = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourttoc };
      break;
    case "Reminder_For_FSL_Report":
      const lettertocourtfslrep = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        acknowledgementNo:
          !isNull(formData) &&
          !isNull(formData?.dnaSamplingFSL?.acknowledgementNo)
            ? formData?.dnaSamplingFSL?.acknowledgementNo
            : "",
        dateOfAcknowledgement:
          !isNull(formData) &&
          !isNull(formData?.dnaSamplingFSL?.dateOfAcknowledgement)
            ? moment(formData?.dnaSamplingFSL?.dateOfAcknowledgement).format(
                DATE_FORMAT
              )
            : "",
      };
      reportData = { ...commonReportData, ...lettertocourtfslrep };
      break;
    case "Letter_For_Collecting_Voice":
      const lettertocourtvoice = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtvoice };
      break;
    case "Letter_For_Forwarding_Phone_Number":
      const lettertocourtphone = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtphone };
      break;
    case "Letter_Of_Advice":
      const letterofadvice = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...letterofadvice };
      break;
    case "Letter_To_Court_For_Dna_Collec":
      let accusedList1 =
        (!isNull(formData) && formData?.dnaSamplingFSL?.accusedList) || [];

      const accusedarr1 = [];
      !isEmpty(accusedList1) &&
        accusedList1.map((s) => {
          const result = {
            accusedName: `${s.personalDetails.name} ${
              s.personalDetails.surname || ""
            }`,
            personAddress: !isNull(s.presentAddress)
              ? getPersonAddressTemplate(s.presentAddress)
              : "",
          };
          accusedarr1.push(result);
        });
      const lettertocourtdnacoll = {
        accusedList: accusedarr1 || [],
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtdnacoll };
      break;
    case "Letter_To_Court_For_Obtaining":
      const lettertocourtfsdd = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocourtfsdd };
      break;
    case "Letter_To_Court_For_Registers":
      const lettertocourtregistr = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocourtregistr };
      break;
    case "Letter_To_Taking_Sample_Signature":
      const lettertocourtsamplesign = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
      };
      reportData = { ...commonReportData, ...lettertocourtsamplesign };
      break;
    case "Letter_For_PME_Clarification":
      const lettertocourtpmec = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtpmec };
      break;
    case "Letter_To_Experts":
      const lettertocourtexpert = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtexpert };
      break;
    case "Letter_To_Lady_Medical_Officer_Final_Opinion":
      const lettertocourtfslreplady = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertocourtfslreplady };
      break;
    case "Medico_Legal_Requisition":
      const lettertoMedicoLegalRequisition = {
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfRequisitionToCourt)
            ? moment(formData?.dateOfRequisitionToCourt).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
        nameOfCourt: (!isNull(formData) && formData?.nameOfCourt) || "",
      };
      reportData = { ...commonReportData, ...lettertoMedicoLegalRequisition };
      break;
    case "Dna_Accused_Through_ACP":
      const { accusedList } =
        (!isNull(formData) && formData?.dnaSamplingFSL) || [];
      const accusedarr = [];
      !isEmpty(accusedList) &&
        accusedList.map((s) => {
          const result = {
            accusedName: `${s.personalDetails.name} ${
              s.personalDetails.surname || ""
            }`,
            personAddress: !isNull(s.presentAddress)
              ? getPersonAddressTemplate(s.presentAddress)
              : "",
          };
          accusedarr.push(result);
        });
      const acuused = {
        accusedList: accusedarr || [],
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfCollection)
            ? moment(formData?.dateOfCollection).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...acuused };
      break;
    case "Dna_Baby_Through_ACP":
      const { babyOfWitness } =
        (!isNull(formData) && formData?.dnaSamplingFSL) || [];
      const babydarr = [];
      !isEmpty(babyOfWitness) &&
        babyOfWitness.map((s) => {
          const result1 = {
            accusedName: `${s.personalDetails.name} ${
              s.personalDetails.surname || ""
            }`,
            personAddress: !isNull(s.presentAddress)
              ? getPersonAddressTemplate(s.presentAddress)
              : "",
          };
          babydarr.push(result1);
        });
      const acuusedbaby = {
        babydarrList: babydarr || [],
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfCollection)
            ? moment(formData?.dateOfCollection).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...acuusedbaby };
      break;
    case "Dna_Victim_Through_ACP":
      const { witnessList } =
        (!isNull(formData) && formData?.dnaSamplingFSL) || [];
      const victimarr = [];
      !isEmpty(witnessList) &&
        witnessList.map((s) => {
          const result2 = {
            accusedName: `${s.personalDetails.name} ${
              s.personalDetails.surname || ""
            }`,
            personAddress: !isNull(s.presentAddress)
              ? getPersonAddressTemplate(s.presentAddress)
              : "",
          };
          victimarr.push(result2);
        });
      const acuusedwitness = {
        victimarrList: victimarr || [],
        currentDate:
          !isNull(formData) && !isNull(formData?.dateOfCollection)
            ? moment(formData?.dateOfCollection).format(DATE_FORMAT)
            : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...acuusedwitness };
      break;
    case "Letter_Of_advice":
      reportData = commonReportData;
      break;
    case "Generate_Letter_to_ACP":
      reportData = { ...commonReportData, formData };
      break;
    case "Generate_Letter_of_Advice":
      reportData = {
        ...commonReportData,
        formData,
        // otherQuestion: !isEmpty(otherQuestion) && first(otherQuestion),
      };

    default:
  }
  return reportData;
};

export const expertTypeList = [
  { label: "Electrical Engineer" },
  { label: "FSL" },
];

export const requisitionForwardThroughList = [
  { label: "ACP" },
  { label: "Through Court" },
];

export const getEvidenceListData = (data) => {
  const arr = [];
  !isEmpty(data) &&
    data.map((s) => {
      const result = {
        label: s?.entity_value,
        _id: s?._id,
      };
      arr.push(result);
    });
  return arr;
};
