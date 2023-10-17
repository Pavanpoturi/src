import { loadState } from "@lib/helpers/localStorage";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import {
  TemplateIntimationToCourtTransferOfCaseFile,
  TemplateLetterToUnitOfficerForTransferOfCaseFile,
} from "@containers/GenerateTemplates";

export const transferOfCaseTemplates = [
  {
    name: " Letter to Unit Officer for Transfer of case file",
    label: " Letter to Unit Officer for Transfer of case file",
    fileName: "Letter_to_Unit_Officer_for_Transfer_of_case_file",
    templateAvailable: true,
  },
  {
    name: "Intimation to Court Transfer of case file",
    label: "Intimation to Court Transfer of case file",
    fileName: "Intimation_to_Court_Transfer_of_case_file",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  console.log("filename, data", filename, data);
  switch (filename) {
    case "Letter_to_Unit_Officer_for_Transfer_of_case_file":
      return (
        <TemplateLetterToUnitOfficerForTransferOfCaseFile
          fileName={filename}
          data={data}
        />
      );
    case "Intimation_to_Court_Transfer_of_case_file":
      return (
        <TemplateIntimationToCourtTransferOfCaseFile
          fileName={filename}
          data={data}
        />
      );
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser
) => {
  if (!!selectedFir?.firDetail) {
    const { firNum, district, psName, dateOfReport, briefFacts } =
      selectedFir?.firDetail;
    const selectedActsData = loadState("selectedActDetails");
    const actsAndSections = !!selectedFir?.firDetail?.actsAndSections
      ? selectedFir?.firDetail?.actsAndSections
      : [];
    var section = actsAndSections.map(function (i) {
      return i.section;
    });
    var merged = [].concat.apply([], section);
    var actsSections = merged?.toString();
    var secdata = !isEmpty(actsSections)
      ? getTemplatesSectionsData(selectedActsData?.uniqActs)
      : selectedFir?.firDetail?.section;
    const commonReportData = {
      policeStation: showPSName(psName),
      district: district,
      firNumber: firNum,
      sectionOfLaw: secdata,
      IOName: getIONameAndRank(briefFacts),
      dateOfFiling: dateOfReport
        ? moment(dateOfReport).format(DATE_FORMAT)
        : "",
    };
    const complainantList = loadState("complainantList");
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

    // eslint-disable-next-line default-case
    switch (fileName) {
      case "Letter_to_Unit_Officer_for_Transfer_of_case_file":
        const res = {
          courtName: formData?.courtName ? formData?.courtName : "",
          complainantname: complainantname || "",
          complainantaddress: complainantaddress || "",
          dateTime: formData?.userDate ? formData?.userDate : "",
          complainantstatememt:
            selectedFir?.firDetail?.briefFacts?.factsOfComplainant || "",
        };
        reportData = { ...commonReportData, ...res };
        break;
      case "Intimation_to_Court_Transfer_of_case_file":
        const result = {
          courtName: formData?.courtName ? formData?.courtName : "",
          complainantname: complainantname || "",
          complainantaddress: complainantaddress || "",
          dateTime: formData?.userDate ? formData?.userDate : "",
          complainantstatememt:
            selectedFir?.firDetail?.briefFacts?.factsOfComplainant || "",
        };
        reportData = { ...commonReportData, ...result };
    }
    return reportData;
  }
};

export const transferOfCaseTemplatesForm = [
  {
    name: "reason",
    label: "Reason For Transfer of Case",
    type: "dropdown",
  },
  { name: "transferOption", label: "Transfer to", type: "dropdown" },
  { name: "transferToDistrict", label: "Select District", type: "dropdown" },
  { name: "transferToName", label: "Select PS Name", type: "dropdown" },
  {
    name: "reportDatedToUnitOfficerForTransfer",
    label: "Report Dated to Unit Officer for Transfer",
    type: "date",
  },
  {
    name: "competentAuthorityDate",
    label: "Orders of Competent Authority and Date",
    type: "date",
  },
  {
    name: "crimeNumOfTransferredPoliceStation",
    label: "Crime Number of Transferred Police Station",
    type: "text",
  },
  {
    name: "reRegistrationDate",
    label: "Date of Re-registration",
    type: "date",
  },
  { name: "statusofCase", label: "Status of Case" },
  {
    name: "dateOfintimationToCourt",
    label: "Date of Intimation to Court on Transfer of CD file",
    type: "date",
  },
];

export const reasonForTransfer = [
  { label: "Court Orders" },
  { label: "On the point of Jurisdiction" },
  { label: "Superior officers Direction" },
];

export const transferTo = [
  { label: "CBI" },
  { label: "CCS" },
  { label: "CID" },
  { label: "NIA" },
  { label: "Other Police Station" },
];
