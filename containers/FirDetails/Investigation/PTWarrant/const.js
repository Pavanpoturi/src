import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import {
  TemplateIntimationToLocalPoliceOfficer,
  TemplateOutOfStatePermission,
  TemplateRequestForTransitWarrant,
} from "@containers/GenerateTemplates";

export const PTWarrantTemplates = [
  {
    name: "Generate Request for Unit officer to go out of state",
    label: "Generate Request for unit officer to go out of state",
    fileName: "Unit_officer_to_go_out_of_state",
    templateAvailable: true,
  },
  {
    name: "Generate Request for PT Warrant",
    label: "Generate Request for PT Warrant",
    fileName: "Transit_warrant",
    templateAvailable: true,
  },
  {
    name: "Generate Intimation to Local Police Officer",
    label: "Generate Intimation to Local Police Officer",
    fileName: "Intimation_to_Local_Police_Officer",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Unit_officer_to_go_out_of_state":
      return <TemplateOutOfStatePermission fileName={filename} data={data} />;
    case "Transit_warrant":
      return (
        <TemplateRequestForTransitWarrant fileName={filename} data={data} />
      );
    case "Intimation_to_Local_Police_Officer":
      return (
        <TemplateIntimationToLocalPoliceOfficer
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
    dateOfFiling: dateOfReport,
  };

  const personalDetails = formData && formData?.accusedId?.personalDetails;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData &&
    `${personalDetails.name ? personalDetails.name : ""} ${
      personalDetails.surname ? personalDetails.surname : ""
    }`;
  let reportData = {};
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
  switch (fileName) {
    case "Unit_officer_to_go_out_of_state":
      const resOut = {
        accusedName: accusedName || "",
        accusedCode: "",
        personAddress: personAddress || "",
        courtName: formData?.ptWarrant.courtName || "",
        dateTimeOfArrest: formData?.ptWarrant.dateTimeOfArrest || "",
        selectTeamToGoOut: formData?.ptWarrant.selectTeamToGoOut || [],
        complainantname: complainantname || "",
      };
      reportData = { ...commonReportData, ...resOut };
      break;
    case "Transit_warrant":
      const resTransit = {
        accusedName: accusedName || "",
        accusedCode: "",
        personAddress: personAddress || "",
        courtName: formData?.ptWarrant.courtName || "",
        dateTimeOfArrest: formData?.ptWarrant.dateTimeOfArrest || "",
        complainantname: complainantname || "",
        complainantaddress:
          complainantaddress !== "  " ? complainantaddress : "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resTransit };
      break;
    case "Intimation_to_Local_Police_Officer":
      const resLocal = {
        accusedName: accusedName || "",
        accusedCode: "",
        courtName: formData?.ptWarrant.courtName || "",
        personAddress: personAddress || "",
        dateOfPTWarrantRequistion:
          formData?.ptWarrant.dateOfPTWarrantRequistion || "",
      };
      reportData = { ...commonReportData, ...resLocal };
      break;
    default:
  }
  return reportData;
};

export const ptWarrantForm = {
  warrantWithinState: [
    {
      name: "dateTimeOfArrest",
      label: "Arrested On",
      placeholder: "Select Date & Time",
      type: "date",
    },
    { name: "placeOfArrest", label: "Place of Arrest", type: "dropdown" },
    { name: "district", label: "District", type: "dropdown" },
    {
      name: "dateOfPTWarrantRequistion",
      label: "Date of PT Warrant Requisition",
      placeholder: "Select Date",
      type: "date",
    },
    { name: "courtName", label: "Court Name", type: "dropdown" },
  ],
  warrantOutOfState: [
    {
      name: "dateTimeOfArrest",
      label: "Arrested On",
      placeholder: "Select Date & Time",
      type: "date",
    },
    { name: "placeOfArrest", label: "Place of Arrest", type: "dropdown" },
    {
      name: "otherState",
      label: "Select State",
      type: "dropdown",
    },
    { name: "district", label: "District", type: "dropdown" },
    {
      name: "dateOfPTWarrantRequistion",
      label: "Date of PT Warrant Requisition",
      placeholder: "Select Date",
      type: "date",
    },
    { name: "courtName", label: "Name of  Court", type: "dropdown" },
  ],
};
