import { getPersonPersonalAddress } from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import { isNull, isEmpty } from "lodash";
import {
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import {
  TemplateSec41ACrPCNotice,
  TemplateSec41ACrPCNoticeTelugu,
  TemplateAckByIoOnCompliance,
  TemplateLetterToCourtForArrest,
} from "@containers/GenerateTemplates";

export const CRPC41ATemplates = [
  {
    name: "Sec.41A Cr.P.C.Notice",
    label: "Sec.41A Cr.P.C.Notice",
    fileName: "Sec.41A_Cr.P.C.Notice",
    templateAvailable: true,
  },
  {
    name: "Sec.41A Cr.P.C.Notice in Telugu",
    label: "Sec.41A Cr.P.C.Notice in Telugu",
    fileName: "Sec.41A_Cr.P.C.Notice_Telugu",
    templateAvailable: true,
  },
  {
    name: "Ack by IO on Compliance of Sec.41A Cr.P.C.",
    label: "Ack by IO on Compliance of Sec.41A Cr.P.C.",
    fileName: "Ack_by_IO_on_Compliance_of_Sec.41A_Cr.P.C.",
    templateAvailable: true,
  },
];

export const CRPC41ATemplatesNo = [
  {
    name: "Sec.41A Cr.P.C.Notice",
    label: "Sec.41A Cr.P.C.Notice",
    fileName: "Sec.41A_Cr.P.C.Notice",
    templateAvailable: true,
  },
  {
    name: "Sec.41A Cr.P.C.Notice in Telugu",
    label: "Sec.41A Cr.P.C.Notice in Telugu",
    fileName: "Sec.41A_Cr.P.C.Notice_Telugu",
    templateAvailable: true,
  },
  {
    name: "Ack by IO on Compliance of Sec.41A Cr.P.C.",
    label: "Ack by IO on Compliance of Sec.41A Cr.P.C.",
    fileName: "Ack_by_IO_on_Compliance_of_Sec.41A_Cr.P.C.",
    templateAvailable: true,
  },
  {
    name: "Letter to court for arrest",
    label: "Requisition to court for arrest",
    fileName: "Letter_to_court_for_arrest",
    templateAvailable: true,
  },
];

export const condisonImposedList = [
  "You will not commit any offence in future",
  "You will not tamper with the evidence in the case in any manner whatsoever",
  "You will not make any threat, inducement, or promise to any person acquainted with the facts of the case as to dissuade him from disclosing, such facts to the court or to the police officer.",
  "You will appear before the Court as and when required / directed",
  "You will join the investigation of the case as and when required and will cooperate in the investigation",
  "You will disclose all the facts truthfully without concealing any part relevant for the purpose of investigation to reach to the right conclusion of the case per law.",
  "You will produce all relevant documents / material required for the purpose of investigation per law",
  "You will not allow in any manner destruction of any evidence relevant for the purpose of investigation / trial of the case.",
  "You will inform whenever you change your address and phone number",
  "You shall not leave the country without permission of the IO / court",
  "You shall not leave headquarters without the intimation and permission of the IO",
  "Any other conditions documents, which may be imposed by Investigating officer / SHO as per the facts of the case.",
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Sec.41A_Cr.P.C.Notice":
      return <TemplateSec41ACrPCNotice fileName={filename} data={data} />;
    case "Sec.41A_Cr.P.C.Notice_Telugu":
      return <TemplateSec41ACrPCNoticeTelugu fileName={filename} data={data} />;
    case "Ack_by_IO_on_Compliance_of_Sec.41A_Cr.P.C.":
      return <TemplateAckByIoOnCompliance fileName={filename} data={data} />;
    case "Letter_to_court_for_arrest":
      return <TemplateLetterToCourtForArrest fileName={filename} data={data} />;
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

  let reportData = {};
  const complainantList = savedFir?.complainantDetails;

  let {
    complainantname,
    complainantaddress,
    complainantage,
    complainantguardian,
    complainantgender,
  } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      const personalDetails = data?.person?.personalDetails;
      complainantname = personalDetails?.name + " " + personalDetails?.surname;
      const { presentAddress } = !isNull(data?.person) && data?.person;
      complainantaddress = getPersonPersonalAddress(presentAddress);
      complainantage =
        personalDetails?.dateOfBirth &&
        moment().diff(personalDetails?.dateOfBirth, "years") > 0
          ? moment().diff(personalDetails?.dateOfBirth, "years")
          : "";
      complainantgender = personalDetails?.gender;
      complainantguardian = personalDetails?.fatherHusbandGuardianName;
    });
  const personalDetails = formData && formData?.accusedId?.personalDetails;
  const accusedName =
    formData &&
    `${personalDetails.name ? personalDetails.name : ""} ${
      personalDetails.surname ? personalDetails.surname : ""
    }`;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonPersonalAddress(presentAddress);
  switch (fileName) {
    case "Sec.41A_Cr.P.C.Notice":
      const data = {
        dateOfIssue: formData?.dateOfIssue ? formData?.dateOfIssue : "",
        noOfDaysGivenForExplanation: formData?.noOfDaysGivenForExplanation
          ? formData?.noOfDaysGivenForExplanation
          : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
      };
      reportData = { ...commonReportData, ...data };
      break;
    case "Sec.41A_Cr.P.C.Notice_Telugu":
      const dataTelugu = {
        dateOfIssue: formData?.dateOfIssue ? formData?.dateOfIssue : "",
        noOfDaysGivenForExplanation: formData?.noOfDaysGivenForExplanation
          ? formData?.noOfDaysGivenForExplanation
          : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
      };
      reportData = { ...commonReportData, ...dataTelugu };
      break;
    case "Ack_by_IO_on_Compliance_of_Sec.41A_Cr.P.C.":
      const dataAck = {
        currentDate: formData?.dateOfIssue ? formData?.dateOfIssue : "",
        personAddress: personAddress || "",
      };
      reportData = { ...commonReportData, ...dataAck };
      break;
    case "Letter_to_court_for_arrest":
      const dataLtr = {
        currentDate: formData?.dateOfIssue ? formData?.dateOfIssue : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
        complainantage: complainantage || "",
        complainantgender: complainantgender || "",
        complainantguardian: complainantguardian || "",
      };
      reportData = { ...commonReportData, ...dataLtr };
      break;
    default:
  }
  return reportData;
};
