import {
  TemplateExhumationAtTheInstanceOfAccused,
  TemplateExhumationOnCourtOrders,
  TemplateExhumationOfUnknownBody,
  TemplateExhumationOnComplaintOfRelativesOrLocals,
} from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";
import moment from "moment";
import {
  getPersonAddressTemplate,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

export const exhumationTemplates = [
  {
    name: "Requisition for Exhumation on court Orders",
    label: "Requisition for Exhumation on court Orders",
    fileName: "Requisition_for_Exhumation_on_court_Orders",
    templateAvailable: true,
  },
  {
    name: "Requisition for Exhumation at the instance of accused",
    label: "Requisition for Exhumation at the instance of accused",
    fileName: "Requisition_for_Exhumation_at_the_instance_of_accused",
    templateAvailable: true,
  },
  {
    name: "Requisition for Exhumation on complaint of relatives or locals",
    label: "Requisition for Exhumation on complaint of relatives or locals",
    fileName: "Requisition_for_Exhumation_on_complaint_of_relatives_or_locals",
    templateAvailable: true,
  },
  {
    name: "Requisition for Exhumation of unknown body",
    label: "Requisition for Exhumation of unknown body",
    fileName: "Requisition_for_Exhumation_of_unknown_body",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Requisition_for_Exhumation_on_court_Orders":
      return (
        <TemplateExhumationOnCourtOrders fileName={filename} data={data} />
      );
    case "Requisition_for_Exhumation_at_the_instance_of_accused":
      return (
        <TemplateExhumationAtTheInstanceOfAccused
          fileName={filename}
          data={data}
        />
      );
    case "Requisition_for_Exhumation_on_complaint_of_relatives_or_locals":
      return (
        <TemplateExhumationOnComplaintOfRelativesOrLocals
          fileName={filename}
          data={data}
        />
      );
    case "Requisition_for_Exhumation_of_unknown_body":
      return (
        <TemplateExhumationOfUnknownBody fileName={filename} data={data} />
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
  const complainantList = savedFir?.complainantDetails;
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
    dateofFiling: dateOfReport,
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

  const personalDetails =
    !isNull(formData) && formData?.deceasedPersonId?.personalDetails;
  const { name, surname, dateOfBirth } =
    !isEmpty(personalDetails) && personalDetails;
  const { presentAddress } =
    !isNull(formData) &&
    !isEmpty(formData?.deceasedPersonId) &&
    formData?.deceasedPersonId;

  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
  const accusedAge =
    dateOfBirth && moment().diff(dateOfBirth, "years") > 0
      ? moment().diff(dateOfBirth, "years")
      : "";

  switch (fileName) {
    case "Requisition_for_Exhumation_on_court_Orders":
      const resCourt = {
        placeOfExhumation: formData?.placeOfExhumation || "",
        dateOfExhumation: formData?.dateOfExhumation
          ? formData?.dateOfExhumation
          : "",
      };
      reportData = { ...commonReportData, ...resCourt };
      break;
    case "Requisition_for_Exhumation_at_the_instance_of_accused":
      const resAccused = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        accusedAge: accusedAge || "",
        placeOfExhumation: formData?.placeOfExhumation || "",
        dateOfExhumation: formData?.dateOfExhumation
          ? formData?.dateOfExhumation
          : "",
      };
      reportData = { ...commonReportData, ...resAccused };
      break;
    case "Requisition_for_Exhumation_on_complaint_of_relatives_or_locals":
      const resRelative = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        placeOfExhumation: formData?.placeOfExhumation || "",
        dateOfExhumation: formData?.dateOfExhumation
          ? formData?.dateOfExhumation
          : "",
      };
      reportData = { ...commonReportData, ...resRelative };
      break;
    case "Requisition_for_Exhumation_of_unknown_body":
      const resUnknown = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        placeOfExhumation: formData?.placeOfExhumation || "",
        dateOfExhumation: formData?.dateOfExhumation
          ? formData?.dateOfExhumation
          : "",
      };
      reportData = { ...commonReportData, ...resUnknown };
      break;
    default:
  }
  return reportData;
};

export const orderByForm = [
  {
    name: "orderNumber",
    label: "Order Number",
    type: "text",
  },
  {
    name: "OrderDate",
    label: "Order Date",
    type: "date",
  },
];

export const exhumationForm = [
  {
    name: "exhumationConductedBy",
    label: "Exhumation Conducted by",
    type: "dropdown",
    actionLink: "addProfessional",
    actionName: "Add Professional",
  },
  {
    name: "exhumationPanchWitness",
    label: "Details Of Panch Witnesses",
    type: "dropdown",
  },
  {
    name: "personAssistedInDiggingGrave",
    label: "Details Of Persons Assisted in Digging Grave",
    type: "dropdown",
    actionLink: "addWitness",
    actionName: "Add Witness",
  },
];

export const placeOfExhumation = [
  { label: "Crime Scene" },
  { label: "Exhumation spot" },
];

export const reasonForExhumation = [
  { label: "Accused confessed burial", key: "" },
  { label: "Anonymous Complaint", key: "" },
  { label: "Complaint of Family Members", key: "" },
  { label: "Complaint of Villagers", key: "" },
  { label: "Orders of High Court", key: "ordersBy" },
  { label: "Orders of NHRC", key: "ordersBy" },
  { label: "Orders of Other Court", key: "ordersBy" },
  { label: "Orders of Other Commissioner", key: "ordersBy" },
  { label: "Orders of SHRC", key: "ordersBy" },
  { label: "Orders of Supreme Court", key: "ordersBy" },
  { label: "Orders of Superior Officers", key: "ordersBy" },
  { label: "Own body found buried", key: "" },
];
