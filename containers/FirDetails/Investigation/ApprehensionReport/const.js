import { isNull, isEmpty } from "lodash";
import moment from "moment";
import {
  TemplateXVIInformationToDistrictProbationary,
  TemplateLetterToDistrictProbationaryOfficerToProduceCCL,
} from "@containers/GenerateTemplates";
import { loadState } from "@lib/helpers/localStorage";
import {
  DATE_FORMAT,
  getTemplatesSectionsData,
  getPersonAddressTemplate,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";

export const apprehensionReportTemplates = [
  {
    name: "Generate XVI Information to District Probationary",
    label: "Generate XVI Information to District Probationary",
    fileName: "XVI_Information_to_District_Probationary",
    templateAvailable: true,
  },
  {
    name: "Letter to District Probationary Officer to Produce CCL",
    label: "Letter to District Probationary Officer to Produce CCL",
    fileName: "Letter_to_District_Probationary_Officer_to_Produce_CCL",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "XVI_Information_to_District_Probationary":
      return (
        <TemplateXVIInformationToDistrictProbationary
          fileName={filename}
          data={data}
        />
      );
    case "Letter_to_District_Probationary_Officer_to_Produce_CCL":
      return (
        <TemplateLetterToDistrictProbationaryOfficerToProduceCCL
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
  const {
    name,
    surname,
    dateOfBirth,
    caste,
    gender,
    religion,
    fatherHusbandGuardianName,
  } = !isNull(formData) && formData?.accusedId?.personalDetails;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
  const accusedAge =
    dateOfBirth && moment().diff(dateOfBirth, "years") > 0
      ? moment().diff(dateOfBirth, "years")
      : "";
  let reportData = {};
  switch (fileName) {
    case "XVI_Information_to_District_Probationary":
      const resXiv = {
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        accusedAge: accusedAge || "",
        gender: gender || "",
        caste: caste || "",
        religion: religion || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        firbrief: selectedFir?.briefFacts?.factsOfComplainant || "",
        producedDateBeforeDPO: formData?.producedDateBeforeDPO
          ? formData?.producedDateBeforeDPO
          : "",
      };
      reportData = { ...commonReportData, ...resXiv };
      break;
    case "Letter_to_District_Probationary_Officer_to_Produce_CCL":
      const resLetter = {
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        accusedAge: accusedAge || "",
        gender: gender || "",
        caste: caste || "",
        religion: religion || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        producedDateBeforeDPO: formData?.producedDateBeforeDPO
          ? formData?.producedDateBeforeDPO
          : "",
        complainantname: complainantname || "",
        complainantaddress:
          complainantaddress !== "  " ? complainantaddress : "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resLetter };
      break;
    default:
  }
  return reportData;
};

export const apprehensionReportForm = [
  {
    name: "producedDateBeforeDPO",
    label: "Date Of producing CCL before DPO",
    placeholder: "Select Date",
    type: "date",
  },
  {
    name: "producedDateBeforeJJBoard",
    label: "Date Of producing CCL before JJB",
    placeholder: "Select Date",
    type: "date",
  },
  {
    name: "jjbOrderURL",
    label: "Order Of JJB Chairman(Form XIV)",
    type: "fileUpload",
  },
  { name: "jjbOrders", label: "JJB Orders", type: "dropdown" },
];

export const admissionToObservationHomeForm = [
  {
    name: "admissionDate",
    label: "Admission Of CCL in Observation Home",
    placeholder: "Select Date",
    type: "date",
  },
  {
    name: "observationFromAndToDates",
    label: "Observation From Date & To Date",
    placeholder: "Select Date",
    type: "date",
  },
  {
    name: "observationDays",
    label: "Days Of Apprehending",
    type: "text",
  },
];

export const jjbOrderList = [
  { label: "Admission to Observation Home" },
  { label: "Released on Bail" },
];
