import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import {
  TemplatePoliceCustodyRequisition,
  Template54CrPCHospitalRequisition,
  TemplateReproductionRequisition,
} from "@containers/GenerateTemplates";
import moment from "moment";

export const policeCustodyArrestProces = [
  {
    name: "Generate Police Custody Requisition",
    label: "Generate Police Custody Requisition",
    fileName: "Police_Custody_Requisition",
    templateAvailable: true,
  },
  {
    name: "Reproduction Requisition",
    label: "Reproduction Requisition",
    fileName: "Reproduction_Requisition",
    templateAvailable: true,
  },
];

export const policeCustodyForm = {
  requisitionProcess: [
    {
      name: "reasonForCustody",
      label: "Reasons for Custody",
      type: "dropdown",
    },
    {
      name: "requistionDate",
      label: "Requisition Date",
      placeholder: "Select Date",
      type: "date",
    },
    { name: "numberOfDays", label: "Number of Days", type: "number" },
  ],
  requisitionGrantProcess: [
    {
      name: "numberOfDaysPoliceCustodyGranted",
      label: "Number of Days Police Custody Granted",
      type: "number",
    },
    {
      name: "orderNumber",
      label: "Order Number",
      type: "number",
    },
    {
      name: "fromDateToDate",
      label: "From Date Time & To Date Time",
      placeholder: "Select Date",
      type: "datetime",
    },
    {
      name: "escortTeamWhileBringing",
      label: "Escort Team while Bringing",
      type: "dropdown",
    },
    {
      name: "escortTeamWhileSending",
      label: "Escort Team while Sending",
      type: "dropdown",
    },
  ],
};

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Police_Custody_Requisition":
      return (
        <TemplatePoliceCustodyRequisition fileName={filename} data={data} />
      );
    case "54Cr.P.C_Hospital_Requisition":
      return (
        <Template54CrPCHospitalRequisition fileName={filename} data={data} />
      );
    case "Reproduction_Requisition":
      return (
        <TemplateReproductionRequisition fileName={filename} data={data} />
      );
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

  const commonReportData = {
    policeStation: showPSName(psName),
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    IOName: getIONameAndRank(briefFacts),
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };

  const complainantList = savedFir?.complainantDetails;
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
  let reportData = {};
  switch (fileName) {
    case "Police_Custody_Requisition":
      const custodyReq = {
        accusedDetails: accusedCompleteDetails,
        userDate:
          formData && formData?.requistionDate ? formData?.requistionDate : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...custodyReq };
      break;
    case "54Cr.P.C_Hospital_Requisition":
      reportData = { ...commonReportData };
      break;
    case "Reproduction_Requisition":
      const custodyRepro = {
        accusedDetails: accusedCompleteDetails,
        userDate:
          formData && formData?.dateOfReproduction
            ? formData?.dateOfReproduction
            : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...custodyRepro };
      break;
    default:
  }
  return reportData;
};
