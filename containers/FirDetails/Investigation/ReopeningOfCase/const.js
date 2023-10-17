import moment from "moment";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  TIME_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, isNull } from "lodash";
import {
  TemplateReopeningOfClosedCase,
  TemplateReopeningOfChargedCase,
} from "@containers/GenerateTemplates";

export const ReopeningOfCaseTemplates = [
  {
    name: "Letter to court for Reopening of closed case",
    label: "Letter to court for Reopening of closed case",
    fileName: "Letter_to_court_for_Reopening_of_closed_case",
    templateAvailable: true,
  },
  {
    name: "Letter to court for Reopening of charged case",
    label: "Letter to court for Reopening of charged case",
    fileName: "Letter_to_court_for_Reopening_of_charged_case",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Letter_to_court_for_Reopening_of_closed_case":
      return <TemplateReopeningOfClosedCase fileName={filename} data={data} />;
    case "Letter_to_court_for_Reopening_of_charged_case":
      return <TemplateReopeningOfChargedCase fileName={filename} data={data} />;
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
  };
  let reportData = {};
  const complainantList = loadState("complainantList");
  let { complainantname, complainantaddress } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      complainantname =
        !isNull(data?.person) &&
        data?.person?.personalDetails?.name +
          " " +
          data?.person?.personalDetails?.surname;
      const { presentAddress } = !isNull(data?.person) && data?.person;
      complainantaddress = getPersonAddressTemplate(presentAddress);
    });

  // eslint-disable-next-line default-case
  switch (fileName) {
    case "Letter_to_court_for_Reopening_of_closed_case":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
        dateofcomplaint: dateOfReport
          ? moment(dateOfReport).format(DATE_FORMAT)
          : "",
        timeofcomplaint: dateOfReport
          ? moment(dateOfReport).format(TIME_FORMAT)
          : "",
        courtOrderDate: formData?.courtOrderDate
          ? moment(formData?.courtOrderDate).format(DATE_FORMAT)
          : "",
        courtOrderNo: formData?.courtOrderNo ? formData?.courtOrderNo : "",
        dateOfFiling: formData?.dateOfFiling
          ? moment(formData?.dateOfFiling).format(DATE_FORMAT)
          : "",
        slNo: formData?.slNo ? formData?.slNo : "",
        date: formData?.date ? formData?.date : "",
      };
      reportData = { ...commonReportData, ...res };
      break;
    case "Letter_to_court_for_Reopening_of_charged_case":
      const result = {
        courtName: formData?.courtName ? formData?.courtName : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
        dateofcomplaint: dateOfReport
          ? moment(dateOfReport).format(DATE_FORMAT)
          : "",
        timeofcomplaint: dateOfReport
          ? moment(dateOfReport).format(TIME_FORMAT)
          : "",
        courtOrderDate: formData?.courtOrderDate
          ? moment(formData?.courtOrderDate).format(DATE_FORMAT)
          : "",
        courtOrderNo: formData?.courtOrderNo ? formData?.courtOrderNo : "",
        dateOfFiling: formData?.dateOfFiling
          ? moment(formData?.dateOfFiling).format(DATE_FORMAT)
          : "",
        slNo: formData?.slNo ? formData?.slNo : "",
        date: formData?.date ? moment(formData?.date).format(DATE_FORMAT) : "",
      };
      reportData = { ...commonReportData, ...result };
  }
  return reportData;
};

export const reasonList = [
  { label: "Detection of closed case" },
  { label: "Directions of Commissions" },
  { label: "Directions of courts" },
  { label: "Directions of Government" },
  { label: "Directions of superior officers" },
  { label: "Further Evidence" },
  { label: "Others" },
];

export const natureOfEvidence = [
  { label: "Digital evidence" },
  { label: "Documentary" },
  { label: "Oral" },
  { label: "Scientific" },
  { label: "Technical" },
];
