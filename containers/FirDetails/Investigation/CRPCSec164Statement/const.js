import { isEmpty, isNull } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import {
  getPersonAddressTemplate,
  showPSName,
  getIONameAndRank,
  DATE_FORMAT,
  getTemplatesSectionsData,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import {
  Template164CrPcAccused,
  Template164CrPcWitness,
} from "@containers/GenerateTemplates";

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

export const crpcSec164StatementForm = {
  requisitiontoCourt: [
    {
      name: "dateOfRequisitionToCourt",
      label: "Date of Requisition to Court",
      placeholder: "Select Date",
      type: "date",
    },
    { name: "courtName", label: "Court Name", type: "dropdown" },
    {
      name: "dateFixed",
      label: "Date Fixed",
      placeholder: "Select Date",
      type: "date",
    },
  ],
  crpc164recorded: [
    {
      name: "dateRecorded",
      label: "Date on which 164 Cr.P.C recorded",
      placeholder: "Select Date",
      type: "date",
    },
    {
      name: "magistrateName",
      label: "Name of the Magistrate recorded",
      actionLink: "addProfessional",
      actionName: "Add Professional",
      type: "text",
    },
    {
      name: "nameOfCourtRecorded",
      label: "Name of the Court recorded",
      type: "dropdown",
    },
  ],
};

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "164_crpc_statement_accused":
      return <Template164CrPcAccused fileName={filename} data={data} />;
    case "164_crpc_statement_witness":
      return <Template164CrPcWitness fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser,
  accusedCompleteDetails,
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
  const complainantList = savedFir?.complainantDetails;
  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    IOName: getIONameAndRank(briefFacts),
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };
  let reportData = {};
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
    case "164_crpc_statement_accused":
      const data = {
        accusedDetails: accusedCompleteDetails,
        nameOfCourtRecorded: formData?.courtName,
        magistrateName: formData?.magistrateName,
        userDate:
          formData && formData?.dateOfRequisitionToCourt
            ? formData?.dateOfRequisitionToCourt
            : "",
        currentDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...data };
      break;
    case "164_crpc_statement_witness":
      const dataWitness = {
        accusedDetails: accusedCompleteDetails,
        nameOfCourtRecorded: formData?.courtName,
        magistrateName: formData?.magistrateName,
        userDate:
          formData && formData?.dateOfRequisitionToCourt
            ? formData?.dateOfRequisitionToCourt
            : "",
        currentDate:
          formData && formData?.dateCreated ? formData?.dateCreated : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...dataWitness };
      break;
    default:
  }
  return reportData;
};
