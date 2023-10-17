import { loadState } from "@lib/helpers/localStorage";
import { isNull, isEmpty } from "lodash";
import {
  shortAddress,
  getTemplatesSectionsData,
  DATE_FORMAT,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import {
  TemplateIntimationToCourtTransferOfCaseFile,
  TemplateLetterToUnitOfficerForTransferOfCaseFile,
  TemplateReassignmentOfCase,
} from "@containers/GenerateTemplates";

export const reassignmentOfCaseTemplates = [
  {
    name: "Re-assignment of case file",
    label: "Re-assignment of case file",
    fileName: "Reassignment_of_case_file",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Letter_to_Unit_officer_for_Transfer_of_case_file":
      return (
        <TemplateLetterToUnitOfficerForTransferOfCaseFile
          fileName={filename}
          data={data}
        />
      );
    case "Intimation_to_court_Transfer_of_case_file":
      return (
        <TemplateIntimationToCourtTransferOfCaseFile
          fileName={filename}
          data={data}
        />
      );
    case "Reassignment_of_case_file":
      return <TemplateReassignmentOfCase fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  currentUser,
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
  const complainantList = savedFir?.complainantDetails;
  let reportData = {};
  let { complainantname, complainantaddress } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      complainantname =
        data?.person?.personalDetails?.name +
        " " +
        data?.person?.personalDetails?.surname;
      const { presentAddress } = !isNull(data?.person) && data?.person;
      complainantaddress = shortAddress(presentAddress);
    });
  // eslint-disable-next-line default-case
  switch (fileName) {
    case "Letter_to_Unit_officer_for_Transfer_of_case_file":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        dateTime: formData?.userDate ? formData?.userDate : "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...res };
      break;
    case "Intimation_to_court_Transfer_of_case_file":
      const result = {
        courtName: formData?.courtName ? formData?.courtName : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        dateTime: formData?.userDate ? formData?.userDate : "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...result };
      break;

    case "Reassignment_of_case_file":
      const resul1t = {
        dateOfReAssignment: formData?.dateOfReAssignment
          ? moment(formData?.dateOfReAssignment).format(DATE_FORMAT)
          : "",
        presentIONameAndRank: formData?.presentIONameAndRank
          ? formData?.presentIONameAndRank
          : "",
        newIONameAndRank: formData?.newIOName
          ? `${formData?.newIOName} ${
              formData?.newIORank ? `(${formData.newIORank})` : ""
            }`
          : "",
        courtOrderDate: formData?.courtOrderDate
          ? moment(formData?.courtOrderDate).format(DATE_FORMAT)
          : "",
        reasonForReAssigning: formData?.reasonForReAssigning
          ? formData?.reasonForReAssigning
          : "",
        orderNo: formData?.orderNo ? formData?.orderNo : "",
      };
      reportData = { ...commonReportData, ...resul1t };
      break;
  }
  return reportData;
};

export const reassignmentOfCaseForm = [
  {
    name: "presentIONameAndRank",
    label: "Present IO Name and Rank",
    type: "dropdown",
  },
  {
    name: "dateOfReAssignment",
    label: "Date of Re-assignment",
    type: "date",
  },
  {
    name: "newIORank",
    label: "Rank of New IO",
    type: "dropdown",
  },
  {
    name: "newIONameAndRank",
    label: "Name & Rank of New IO",
    type: "dropdown",
  },
  {
    name: "reasonForReAssigning",
    label: "Reason for Re-assigning",
    type: "dropdown",
  },
  {
    name: "orderNo",
    label: "In case of court and  senior officer instructions Order No.",
    type: "text",
  },
  {
    name: "courtOrderDate",
    label: "Date",
    type: "date",
  },
];

export const reasonForReAssigningList = [
  { label: "Court order" },
  { label: "IO died" },
  { label: "IO retired" },
  { label: "IO transferred" },
  { label: "Senior officer instructions" },
  { label: "Any other" },
];
