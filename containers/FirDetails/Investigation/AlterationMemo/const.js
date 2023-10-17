import moment from "moment";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  DATE_FORMAT,
  TIME_FORMAT,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import {
  TemplateSectionAlterMemo,
  TemplateTransferOfOriginalRecord,
} from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";

export const alterationMemoTemplates = [
  {
    name: "Section Alter Memo",
    label: "Section Alter Memo",
    fileName: "Section_alter_memo",
    templateAvailable: true,
  },
  {
    name: "Transfer Of Original Record",
    label: "Transfer Of Original Record",
    fileName: "Transfer_of_original_record",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Section_alter_memo":
      return <TemplateSectionAlterMemo fileName={filename} data={data} />;
    case "Transfer_of_original_record":
      return (
        <TemplateTransferOfOriginalRecord fileName={filename} data={data} />
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
  };
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
  // eslint-disable-next-line default-case
  switch (fileName) {
    case "Section_alter_memo":
      const res = {
        courtName: formData?.courtName ? formData?.courtName : "",
        alteredsections: formData?.approvalFromSrOfficer?.alteredActsAndSections
          ? formData?.approvalFromSrOfficer?.alteredActsAndSections
          : [],
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
        dateofcomplaint: dateOfReport
          ? moment(dateOfReport).format(DATE_FORMAT)
          : "",
        timeofcomplaint: dateOfReport
          ? moment(dateOfReport).format(TIME_FORMAT)
          : "",
      };

      reportData = { ...commonReportData, ...res };
      break;
    case "Transfer_of_original_record":
      const res1 = {
        courtName: formData?.courtName ? formData?.courtName : "",
        alteredsections: formData?.approvalFromSrOfficer?.alteredActsAndSections
          ? formData?.approvalFromSrOfficer?.alteredActsAndSections
          : [],
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
        dateofcomplaint: dateOfReport
          ? moment(dateOfReport).format(DATE_FORMAT)
          : "",
        timeofcomplaint: dateOfReport
          ? moment(dateOfReport).format(TIME_FORMAT)
          : "",
        tocourt: formData?.dispatchFromCourt?.toCourtName
          ? formData?.dispatchFromCourt?.toCourtName
          : "",
      };
      reportData = { ...commonReportData, ...res1 };
  }
  return reportData;
};

export const dispatchToCourt = [
  {
    name: "transferOriginalRecord",
    label: "Date of Request to Court for Transfer of Original Record",
    type: "date",
  },
  {
    name: "fromCourtName",
    label: "From Court Name",
    type: "dropdown",
  },
  {
    name: "transferredCourtName",
    label: "Transferred to Court Name",
    type: "dropdown",
  },
  {
    name: "dateOfTransfer",
    label: "Date of Transfer",
    type: "date",
  },
];

export const alterationReasons = [
  { label: "Change in the Nature Of Injury" },
  { label: "Death of Injured / victim" },
  { label: "Due to the findings of the PME Report" },
  { label: "Due to the Allegations of the Relatives" },
  { label: "New facts during investigation" },
  { label: "Sexual Assault on the Missing Girl/Woman" },
  { label: "Sexual Assault on kidnapped Girl/Woman" },
];

export const ActsAndSection = [
  {
    name: "Act",
    label: "Act",
    type: "dropdown",
  },
  {
    name: "Section",
    label: "Section",
    type: "dropdown",
  },
];

export const majorMinor = [
  {
    name: "Major",
    label: "Major",
    type: "dropdown",
  },
  {
    name: "Minor",
    label: "Minor",
    type: "dropdown",
  },
];
