import {
  TemplateRemandReport,
  TemplateRemandApplication,
} from "@containers/GenerateTemplates";
import moment from "moment";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  TIME_FORMAT,
  getTemplatesSectionsData,
  getPersonAddressTemplate,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { isNull, isEmpty, isUndefined, isArray } from "lodash";
import { loadState } from "@lib/helpers/localStorage";

export const remandReportTemplates = [
  {
    name: "Generate Remand Report",
    label: "Generate Remand Report",
    fileName: "Remand_report",
    templateAvailable: true,
  },
  {
    name: "Generate Remand Application",
    label: "Generate Remand Application",
    fileName: "Remand_application",
    templateAvailable: true,
  },
];

export const remandReportForm = [
  {
    name: "producedDateTime",
    label: "Produced On",
    placeholder: "Select Date & Time",
    type: "date",
  },
  { name: "courtName", label: "Court Name", type: "dropdown" },
  { name: "courtOrders", label: "Court Order", type: "dropdown" },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Remand_report":
      return <TemplateRemandReport fileName={filename} data={data} />;
    case "Remand_application":
      return <TemplateRemandApplication fileName={filename} data={data} />;
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
    dateOfReport: moment(dateOfReport).format(DATE_FORMAT),
    timeofreport: moment(dateOfReport).format(TIME_FORMAT),
  };
  let reportData = {};

  const complainantList = savedFir?.complainantDetails;
  const accusedList = formData?.accusedId;
  const personalDetails = "";
  const accusedName =
    formData &&
    `${personalDetails.name ? personalDetails.name : ""} ${
      personalDetails.surname ? personalDetails.surname : ""
    }`;
  const { presentAddress } = !isNull(formData) && formData?.accusedId;
  const personAddress = getPersonAddressTemplate(presentAddress);
  const dateOfBirth = formData?.accusedId?.personalDetails?.dateOfBirth;
  const aoccupation =
    formData?.accusedId?.personalDetails?.fatherHusbandGuardianName;
  const afatherHusbandGuardianName =
    formData?.accusedId?.personalDetails?.fatherHusbandGuardianName;
  const accusedAge =
    dateOfBirth && moment().diff(dateOfBirth, "years") > 0
      ? moment().diff(dateOfBirth, "years")
      : "";
  let fromToDates =
    !isNull(formData) && formData?.fromToDates && formData?.fromToDates;
  const startDate =
    isArray(fromToDates) && !!fromToDates[0] ? moment(fromToDates[0]) : "";
  const endDate =
    isArray(fromToDates) && !!fromToDates[1] ? moment(fromToDates[1]) : "";
  const days = !!endDate ? endDate.diff(startDate, "days") : "";
  let { complainantname, complainantaddress, phone } = "";
  !isEmpty(complainantList) &&
    complainantList.map((data) => {
      const {
        fatherHusbandGuardianName,
        dateOfBirth,
        occupation,
        caste,
        gender,
        name,
        alias,
        surname,
      } = !isNull(data?.person) && data?.person?.personalDetails;
      const accusedAge =
        dateOfBirth && moment().diff(dateOfBirth, "years") > 0
          ? moment().diff(dateOfBirth, "years")
          : "";
      let complainantName = "";
      if (!isUndefined(alias) && isUndefined(name) && isUndefined(surname)) {
        complainantName = `${alias}`;
      } else if (
        isUndefined(alias) &&
        !isUndefined(name) &&
        isUndefined(surname)
      ) {
        complainantName = `${name}`;
      } else if (
        isUndefined(alias) &&
        isUndefined(name) &&
        !isUndefined(surname)
      ) {
        complainantName = `${surname}`;
      } else if (
        !isUndefined(alias) &&
        !isUndefined(name) &&
        isUndefined(surname)
      ) {
        complainantName = `${alias} ${name}`;
      } else if (
        !isUndefined(alias) &&
        !isUndefined(name) &&
        !isUndefined(surname)
      ) {
        complainantName = `${alias} ${name} ${surname}`;
      } else if (
        isUndefined(alias) &&
        !isUndefined(name) &&
        !isUndefined(surname)
      ) {
        complainantName = `${name} ${surname}`;
      } else if (
        !isUndefined(alias) &&
        isUndefined(name) &&
        !isUndefined(surname)
      ) {
        complainantName = `${alias} ${surname}`;
      }

      if (gender === "Female") {
        if (isUndefined(fatherHusbandGuardianName) && isEmpty(accusedAge)) {
          complainantname = `${complainantName}`;
        } else if (
          !isUndefined(fatherHusbandGuardianName) &&
          isEmpty(accusedAge)
        ) {
          complainantname = `${complainantName} D/O ${fatherHusbandGuardianName}`;
        } else if (
          !isUndefined(fatherHusbandGuardianName) &&
          !isEmpty(accusedAge)
        ) {
          complainantname = `${complainantName} D/O ${fatherHusbandGuardianName} Age: ${accusedAge}`;
        }
      } else {
        if (isUndefined(fatherHusbandGuardianName) && isEmpty(accusedAge)) {
          complainantname = `${complainantName}`;
        } else if (
          !isUndefined(fatherHusbandGuardianName) &&
          isEmpty(accusedAge)
        ) {
          complainantname = `${complainantName} S/O ${fatherHusbandGuardianName}`;
        } else if (
          !isUndefined(fatherHusbandGuardianName) &&
          !isEmpty(accusedAge)
        ) {
          complainantname = `${complainantName} S/O ${fatherHusbandGuardianName} Age: ${accusedAge}`;
        }
      }
      if (occupation !== undefined) complainantname += ", Occ : " + occupation;
      if (caste !== undefined) complainantname += " ,Caste : " + caste + " , ";
      const presentAddress =
        !isNull(data?.person) &&
        !isUndefined(data?.person) &&
        data?.person?.presentAddress;
      complainantaddress = getPersonAddressTemplate(presentAddress);
      !isUndefined(data?.person) &&
        !isUndefined(data?.person?.contactDetails) &&
        data?.person?.contactDetails.map((p) => {
          phone = p.phoneNumber;
        });
    });
  const stolenProperties = savedFir?.stolenProperties;

  switch (fileName) {
    case "Remand_report":
      const remanddata = {
        accusedList: accusedList,
        datetimeofcoourance: savedFir?.firDetail?.occurenceOfOffence
          ?.informationReceivedAtPS
          ? moment(
              savedFir?.firDetail?.occurenceOfOffence?.informationReceivedAtPS
            ).format(DATE_TIME_FORMAT)
          : "",
        placeofoccurance: savedFir?.firDetail?.psName || "",
        datetimeofFIR: savedFir?.firDetail?.occurenceOfOffence?.firDate
          ? moment(savedFir?.firDetail?.occurenceOfOffence?.firDate).format(
              DATE_TIME_FORMAT
            )
          : "",
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        producedDateTime: formData?.producedDateTime
          ? moment(formData?.producedDateTime).format(DATE_FORMAT)
          : "",
        victimDetails: savedFir?.victimDetails,
        courtName: formData?.courtName,
        propertystolen:
          !isEmpty(stolenProperties) && stolenProperties[0]?.estimateValue,
        propertyrecovred:
          !isEmpty(stolenProperties) && stolenProperties[0]?.recoveredValue,
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        accusedAge: accusedAge || "",
        afatherHusbandGuardianName: afatherHusbandGuardianName || "",
        aoccupation: aoccupation || "",
      };
      reportData = { ...commonReportData, ...remanddata };
      break;
    case "Remand_application":
      const data = {
        accusedList: accusedList,
        userDate: moment(formData?.userDate).format(DATE_FORMAT),
        producedDateTime: formData?.producedDateTime
          ? moment(formData?.producedDateTime).format(DATE_FORMAT)
          : "",
        courtName: formData?.courtName,
        complainantname: complainantname || "",
        complainantaddress: complainantaddress || "",
        phone: phone || "",
        days: days || "",
        arrestedDate: savedFir?.accusedDetails[0]?.arrestedDate
          ? moment(savedFir?.accusedDetails[0]?.arrestedDate).format(
              DATE_TIME_FORMAT
            )
          : "",
      };
      reportData = { ...commonReportData, ...data };
      break;
    default:
  }
  return reportData;
};
