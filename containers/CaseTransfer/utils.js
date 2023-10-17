import { loadState } from "@lib/helpers/localStorage";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import {
  TemplateCPLetterSendingCDPolice,
  TemplateCPLetterSendingCDFileToOthers,
} from "@containers/GenerateTemplates";

export const transferOfCaseTemplates = [
  {
    name: "Requisition one when Transfer is within Unit",
    label: "Requisition one when Transfer is within Unit",
    fileName: "Letter_to_Cp_Police_Unit",
    templateAvailable: true,
  },
  {
    name: "Requisition when transfer is to another Unit",
    label: "Requisition when transfer is to another Unit",
    fileName: "Letter_to_Cp_Police_Another_Unit",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate1 = (filename, data) => {
  console.log("filename, data", filename, data);
  switch (filename) {
    case "Letter_to_Cp_Police_Unit":
      return (
        <TemplateCPLetterSendingCDPolice fileName={filename} data={data} />
      );
    case "Letter_to_Cp_Police_Another_Unit":
      return (
        <TemplateCPLetterSendingCDFileToOthers
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
  currentUser
) => {
  var reportData = {};
  if (!!selectedFir?.firDetail) {
    const { firNum, district, psName, dateOfReport, briefFacts } =
      selectedFir?.firDetail;
    const selectedActsData = loadState("selectedActDetails");
    const actsAndSections = selectedFir?.firDetail?.actsAndSections;
    reportData = {
      policeStation: showPSName(psName),
      district: district,
      firNumber: firNum,
      sectionOfLaw: actsAndSections,
      IOName: getIONameAndRank(briefFacts),
      dateOfFiling: dateOfReport
        ? moment(dateOfReport).format(DATE_FORMAT)
        : "",
    };
    const complainantList = loadState("complainantList");

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
  } else {
    reportData = {};
  }
  // eslint-disable-next-line default-case

  return reportData;
};
