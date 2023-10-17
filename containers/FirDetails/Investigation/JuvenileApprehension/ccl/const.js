import { isNull, isUndefined, isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  TIME_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import {
  TemplateAgeDeterminationRequisition,
  TemplateNightCustodyRequisitionToObservationHome,
  TemplateXVOrderOfJJBChairman,
  TemplatePotencyTest,
  TemplateApprehensionMemo,
} from "@containers/GenerateTemplates";

export const juvenileApprehensionTemplates = [
  {
    name: "Apprehension Memo",
    label: "Apprehension Memo",
    fileName: "Apprehension_Memo",
    templateAvailable: true,
  },
  {
    name: "Generate XV Juvenile Justice Act 2000 Notice",
    label: "Generate XV Juvenile Justice Act 2000 Notice",
    fileName: "XV_Juvenile_Justice_Act_2000_Notice",
    templateAvailable: true,
  },
  {
    name: "Generate Potency Test Requisition",
    label: "Generate Potency Test Requisition",
    fileName: "Potency_Test_Requisition",
    templateAvailable: true,
  },
  {
    name: "Generate Age Determination Requisition",
    label: "Generate Age Determination Requisition",
    fileName: "Age_Determination_Requisition",
    templateAvailable: true,
  },
  {
    name: "Night Custody Requisition to Observation Home",
    label: "Night Custody Requisition to Observation Home",
    fileName: "Night_Custody_Requisition_to_Observation_Home",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "XV_Juvenile_Justice_Act_2000_Notice":
      return <TemplateXVOrderOfJJBChairman fileName={filename} data={data} />;
    case "Potency_Test_Requisition":
      return <TemplatePotencyTest fileName={filename} data={data} />;
    case "Age_Determination_Requisition":
      return (
        <TemplateAgeDeterminationRequisition fileName={filename} data={data} />
      );
    case "Night_Custody_Requisition_to_Observation_Home":
      return (
        <TemplateNightCustodyRequisitionToObservationHome
          fileName={filename}
          data={data}
        />
      );
    case "Apprehension_Memo":
      return <TemplateApprehensionMemo fileName={filename} data={data} />;
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
  const { firNum, district, psName, briefFacts } = selectedFir;
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

  const {
    name,
    surname,
    dateOfBirth,
    caste,
    gender,
    fatherHusbandGuardianName,
    occupation,
  } = !isNull(formData) && formData?.accusedId?.personalDetails;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const { permanentAddress } = !isNull(formData) && formData?.accusedId;
  const permanentpersonAddress = getPersonAddressTemplate(permanentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
  const accusedAge =
    dateOfBirth && moment().diff(dateOfBirth, "years") > 0
      ? moment().diff(dateOfBirth, "years")
      : "";
  let reportData = {};
  let phone = "";
  formData?.accusedId?.contactDetails.map((p) => {
    phone = p.phoneNumber;
  });
  const intimationGivenTo =
    !isUndefined(formData?.intimationGivenTo) && formData?.intimationGivenTo;
  const personalDetails =
    !isUndefined(intimationGivenTo?.person?.personalDetails) &&
    intimationGivenTo?.person?.personalDetails;

  switch (fileName) {
    case "XV_Juvenile_Justice_Act_2000_Notice":
      const resXv = {
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        gender: gender || "",
        occupation: occupation || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        accusedAge: accusedAge + " Years" || "",
        phone: phone || "",
        caste: caste || "",
        rank_name: currentUser?.rank_name || "",
        cclCode: formData?.cclCode,
        intimationgivento: {
          name: `${personalDetails?.name ? personalDetails?.name : ""} ${
            personalDetails?.surname ? personalDetails?.surname : ""
          }`,
          accusedAge:
            intimationGivenTo &&
            personalDetails?.dateOfBirth &&
            moment().diff(personalDetails?.dateOfBirth, "years") > 0
              ? moment().diff(personalDetails?.dateOfBirth, "years") + " Years"
              : "",
          gender: intimationGivenTo ? personalDetails?.gender : "",
          occupation: intimationGivenTo ? personalDetails?.occupation : "",
          fatherHusbandGuardianName: intimationGivenTo
            ? personalDetails?.fatherHusbandGuardianName
            : "",
          personAddress: intimationGivenTo
            ? getPersonAddressTemplate(intimationGivenTo?.person?.presentAddres)
            : "",
          phone: intimationGivenTo
            ? intimationGivenTo?.person?.contactDetails[0]?.phoneNumber
            : "",
          caste: intimationGivenTo ? personalDetails?.caste : "",
        },
        relationToCCL: intimationGivenTo?.relationToCCL,
        producedDateBeforeJJBoard: formData?.apprehensionDate
          ? formData?.apprehensionDate
          : "",
      };
      reportData = { ...commonReportData, ...resXv };
      break;
    case "Potency_Test_Requisition":
      const resPotency = {
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        agender: gender || "",
        occupation: occupation || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        accusedAge: accusedAge + " Years" || "",
        phone: phone || "",
        caste: caste || "",
        cclCode: formData?.cclCode,
        rank_name: currentUser?.rank_name
          ? "( " + currentUser?.rank_name + " )"
          : "",
        hospitalName: formData?.medicalExamination?.hospitalName || "",
        currentDate: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...resPotency };
      break;
    case "Age_Determination_Requisition":
      const resAge = {
        cclCode: formData?.cclCode,
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        rank_name: currentUser?.rank_name || "",
        hospitalName: formData?.medicalExamination?.hospitalName || "",
        currentDate: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
        agender: gender || "",
        occupation: occupation || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        accusedAge: accusedAge + " Years" || "",
        phone: phone || "",
        caste: caste || "",
      };
      reportData = { ...commonReportData, ...resAge };
      break;
    case "Night_Custody_Requisition_to_Observation_Home":
      const resNight = {
        cclCode: formData?.cclCode,
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        agender: gender || "",
        occupation: occupation || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        accusedAge: accusedAge + " Years" || "",
        phone: phone || "",
        caste: caste || "",
        rank_name: currentUser?.rank_name || "",
        currentDate: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
      };
      reportData = { ...commonReportData, ...resNight };
      break;
    case "Apprehension_Memo":
      const resappr = {
        cclCode: formData?.cclCode,
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        permanentpersonAddress: permanentpersonAddress || "",
        agender: gender || "",
        occupation: occupation || "",
        fatherHusbandGuardianName: fatherHusbandGuardianName || "",
        accusedAge: accusedAge + " Years" || "",
        phone: phone || "",
        caste: caste || "",
        religion: formData?.religion || "",
        rank_name: currentUser?.rank_name || "",
        currentDate: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(DATE_FORMAT)
          : moment().format(DATE_FORMAT),
        apprDate: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(DATE_FORMAT)
          : "",
        apprtime: formData?.apprehensionDate
          ? moment(formData?.apprehensionDate).format(TIME_FORMAT)
          : "",
        dateOfBirth: dateOfBirth ? moment(dateOfBirth).format(DATE_FORMAT) : "",
        bringingDate: formData?.bringingDate
          ? moment(formData?.bringingDate).format(DATE_FORMAT)
          : "",
        bringingDatetime: formData?.bringingDate
          ? moment(formData?.bringingDate).format(TIME_FORMAT)
          : "",
      };
      reportData = { ...commonReportData, ...resappr };
      break;
    default:
  }
  return reportData;
};

export const juvenileApprehensionForm = [
  {
    name: "typeOfApprehension",
    label: "Type of Apprehension",
    type: "dropdown",
  },
  { name: "placeOfApprehension", label: "Place of Apprehension", type: "text" },
  {
    name: "bringingDate",
    label: "Date & Time of Bringing to PS",
    placeholder: "Select Date",
    type: "date",
  },
  { name: "cclCode", label: "CCL Code", type: "text" },
  {
    name: "apprehensionDate",
    label: "Date & Time of Apprehension",
    placeholder: "Select Date",
    type: "date",
  },
];

export const juvenileActionOptions = [
  { label: "Apprehension", arrestProcess: [] },
];
