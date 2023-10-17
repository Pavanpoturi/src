/* eslint-disable array-callback-return */
import { isEmpty, forEach, isUndefined, isArray, isNull, first } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";
import {
  getSectionsData,
  actsSectionResult,
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  showPSName,
  getIONameAndRank,
  getTemplatesSectionsData,
  getPersonAddressTemplate,
} from "@containers/FirDetails/fir-util";
import { TemplateSeizureReport } from "@containers/GenerateTemplates";

export const SeizureReportTemplates = [
  {
    name: "Seizure Report",
    label: "Seizure Report",
    fileName: "Seizure_Report",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Seizure_Report":
      return <TemplateSeizureReport fileName={filename} data={data} />;
    default:
      return "";
  }
};

export const getDataForDocument = (
  formData,
  fileName,
  selectedFir,
  firDetails,
  savedFir,
  editClicked,
  addressDetails,
  selectedStolenProperty
) => {
  console.log("const-formData ", formData);

  const { firNum, district, psName, briefFacts } = selectedFir;
  const selectedActsData = loadState("selectedActDetails");
  var section =
    selectedFir?.actsAndSections &&
    selectedFir?.actsAndSections.map(function (i) {
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
  switch (fileName) {
    case "Seizure_Report":
      const res = {
        dateOfSeizure: formData?.dateOfSeizure ? formData?.dateOfSeizure : "",
        firDate: selectedFir?.occurenceOfOffence?.firDate,
        firDetails: firDetails,
        savedFir: savedFir,
        editClicked: editClicked,
        addressDetails: addressDetails,
        selectedStolenProperty: selectedStolenProperty,
        formData: formData,
      };
      reportData = { ...commonReportData, ...res };
      break;
    default:
  }
  return reportData;
};

const currentUser = loadState("currentUser");

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const witnessTypeOptions = [
  { label: "Circumstantial witness" },
  { label: "Complainant" },
  { label: "Complainant cum injured" },
  { label: "Complainant cum victim" },
  { label: "Eye witness" },
  { label: "Independent eye witness" },
  { label: "Injured" },
  { label: "Official witnesses / Experts" },
  { label: "Panch witness" },
  { label: "Photographer" },
  { label: "Relative" },
  { label: "Scribe to complaint" },
  { label: "Victim" },
  { label: "Videographer" },
  { label: "Witness to extra juduicial confession" },
  { label: "Witness shifted injured/victim to hospital" },
];

export const panchWitnessSubtype = [
  { label: "To collection of MOs" },
  { label: "To confession cum seizure" },
  { label: "To confession" },
  { label: "To exhumation" },
  { label: "To inquest" },
  { label: "To Recovery" },
  { label: "To Reconstruction" },
  { label: "To Scene of Offence" },
  { label: "To seizure" },
];

export const officialWitnessSubType = [
  { label: "Age determination doctor" },
  { label: "Birth Certificate Issued officer" },
  { label: "Assistant IO" },
  { label: "Clues Team" },
  { label: "Dog Squad" },
  { label: "Doctor recording statement" },
  { label: "Drugs Control Expert" },
  { label: "Electricity Department" },
  { label: "Fire Department" },
  { label: "FIR issued SHO" },
  { label: "FPB Expert" },
  { label: "FSL expert" },
  { label: "Head Master" },
  { label: "Inspector of Boilers" },
  { label: "Inspector of Factories" },
  { label: "Investigating Officer" },
  { label: "Lady Medical officer" },
  { label: "Magistrate of 164 Cr.P.C." },
  { label: "Magistrate for TIP" },
  { label: "Medical Certificate doctor" },
  { label: "Motor vehicle Inspector" },
  { label: "M R O / Tahsildar" },
  { label: "Potency doctor" },
  { label: "PME doctor" },
  { label: "Pollution control expert" },
  { label: "Sub Registrar" },
  { label: "Service Providers for CDR/CAF" },
];

export const relationNameList = [
  { label: "Brother" },
  { label: "Brother in law" },
  { label: "Children" },
  { label: "Daughter" },
  { label: "Daughter in law" },
  { label: "Distance relative" },
  { label: "Father" },
  { label: "Father's brother" },
  { label: "Father's sister" },
  { label: "Father in law" },
  { label: "Friend" },
  { label: "Grand father" },
  { label: "Grand mother" },
  { label: "Guardian" },
  { label: "Husband" },
  { label: "Husband's brother" },
  { label: "Husband's sister" },
  { label: "Landlord" },
  { label: "Mother" },
  { label: "Mother's brother" },
  { label: "Mother's sister" },
  { label: "Mother in law" },
  { label: "Neighbourer" },
  { label: "Self" },
  { label: "Son" },
  { label: "Sister" },
  { label: "Sister in law" },
  { label: "Step father" },
  { label: "Step mother" },
  { label: "Wife" },
  { label: "Wife's brother" },
  { label: "Wife's sister" },
  { label: "Any other" },
];

export const recordedAtPlace = [
  { label: "Crime Scene" },
  { label: "Police Station" },
  { label: "Residential Place" },
  { label: "Others" },
];

export const seizedFromList = [
  { label: "At the instance of Accused" },
  { label: "From Financiers" },
  { label: "From Receiver" },
  { label: "From the body of Deceased" },
  { label: "From the possession of Accused" },
  { label: "Scene of Offence" },
  { label: "When produced by Complainant" },
  { label: "When produced by Medical officer at Hospital" },
  { label: "When produced by Victim" },
  { label: "Any Other" },
];

export const designationList = [
  { label: "Associate Professor" },
  { label: "Asst Director, TSFSL" },
  { label: "Asst Professor" },
  { label: "Asst / Motor Vehicle Inspector" },
  { label: "Casuality Medical Officer" },
  { label: "Civil Asst Surgeon" },
  { label: "Clues Team" },
  { label: "Commissioner, GHMC" },
  { label: "Director of Explosives" },
  { label: "Director, Medical and Health Dept" },
  { label: "District Collector and Magistrate" },
  { label: "Dist Educational Officer" },
  { label: "Duty Medical Officer" },
  { label: "Dy Commissioner GHMC Zone" },
  { label: "Fire Officer" },
  { label: "Government Chief Examiner" },
  { label: "Income Tax Officer" },
  { label: "Inspector of Boilers" },
  { label: "Inspector, Drugs Department" },
  { label: "Inspector of Factories" },
  { label: "Inspector, Pollution Control Board" },
  { label: "Immigration officer" },
  { label: "Joint Collector" },
  { label: "Magistrate" },
  { label: "Mandal Educational officer" },
  { label: "Nodal Officer - Service Providers" },
  { label: "Police Officer" },
  { label: "President, Indian Medical Association" },
  { label: "Professor" },
  { label: "Registrar of Companies" },
  { label: "Revenue Divisional Officer" },
  { label: "Regional Passport Officer" },
  { label: "Special Officer & Competent Authority Urban Land Ceiling" },
  { label: "Sub Registrar" },
  { label: "Tahsildar" },
  { label: "Town Planning Officer" },
  { label: "Village Secretary" },
  { label: "V R O" },
  { label: "Woman Police officer" },
  { label: "Any other (specify)" },
];

export const getAuditHistoryPayload = (crimeId, moduleName, auditType) => {
  const payload = {
    entries: [
      {
        crimeId: crimeId,
        psCode: currentUser?.cctns_unit_id,
        psName: currentUser?.unit_name,
        paoCode: currentUser?.pao_code,
        paoName: currentUser?.employee_name,
        module: moduleName,
        auditType: auditType,
      },
    ],
  };
  return payload;
};

export const reasonsForUI = [
  { label: "Arrest of accused", subReason: [] },
  { label: "41 A Cr.P.C.", subReason: [] },
  { label: "Collection of documentary evidence", subReason: [] },
  { label: "Death certificate of accused", subReason: [] },
  { label: "Establish Identity of deceased", subReason: [] },
  { label: "Establish identity of crime vehicle", subReason: [] },
  { label: "For issue of LOC", subReason: [] },
  { label: "For Prosecution permission", subReason: [] },
  { label: "For want of clues", subReason: [] },
  { label: "High Court Stay", subReason: [] },
  { label: "Police custody of accused", subReason: [] },
  { label: "PT warrant regularization", subReason: [] },
  { label: "Test Identification Parade", subReason: [] },
  { label: "To conduct age determination of accused", subReason: [] },
  { label: "To conduct age determination of victim", subReason: [] },
  { label: "To Conduct potency of accused", subReason: [] },
  { label: "To collect sample writings etc/FPs in open court", subReason: [] },
  { label: "To forward MOs to FSL", subReason: [] },
  { label: "To forward Finger Prints to FPB", subReason: [] },
  { label: "To get 164 Cr.P.C. statement  recorded", subReason: [] },
  { label: "Tracing the accused", subReason: [] },
  { label: "Tracing missing person", subReason: [] },
  { label: "Witness Examination", subReason: [] },
  {
    label: "For Collection of Experts Reports",
    subReason: [
      { label: "Age determination report" },
      { label: "Bonafide certificate" },
      { label: "Caste certificate of victim" },
      { label: "Caste certificate of accused" },
      { label: "DNA report" },
      { label: "FPB report" },
      { label: "FSL report" },
      { label: "Gov. Mint (For coins) report" },
      { label: "LMO final opinion" },
      { label: "MVI report" },
      { label: "Norco analysis report" },
      { label: "Post mortem report" },
      { label: "Potency test report" },
      { label: "Super imposition report" },
      { label: "Wound certificate" },
    ],
  },
  {
    label: "Digital Evidence",
    subReason: [
      { label: "For CDR analysis" },
      { label: "For IMEI and tower location details" },
      { label: "For IP log details" },
      { label: "For KYC details" },
      { label: "For MAC ID details" },
    ],
  },
  { label: "Legal opinion", subReason: [] },
  { label: "Permission for closure", subReason: [] },
  { label: "CC / PRC / STTC No awaited", subReason: [] },
  { label: "Others", subReason: [] },
];

export const residencyType = [{ label: "Own" }, { label: "Rented" }];

export const gravityList = [
  { label: "Grave", name: "Grave" },
  { label: "Non Grave", name: "NonGrave" },
  { label: "Special Grave", name: "SpecialGrave" },
];

export const getDateOfOccurence = (firDetail) => {
  const fromDate = firDetail?.occurenceOfOffence?.fromDate;
  const toDate = firDetail?.occurenceOfOffence?.toDate;
  const priorToDate = firDetail?.occurenceOfOffence?.priorToDate;
  let dateOfOccurrence = "";
  if (
    !isUndefined(fromDate) &&
    !isNull(fromDate) &&
    !isUndefined(toDate) &&
    !isNull(toDate)
  ) {
    dateOfOccurrence = moment(toDate).format(DATE_TIME_FORMAT);
  } else if (!isUndefined(fromDate) && !isNull(fromDate)) {
    dateOfOccurrence = moment(fromDate).format(DATE_TIME_FORMAT);
  } else if (!isUndefined(toDate) && !isNull(toDate)) {
    dateOfOccurrence = moment(toDate).format(DATE_TIME_FORMAT);
  } else if (!isUndefined(priorToDate) && !isNull(priorToDate)) {
    dateOfOccurrence = moment(priorToDate).format(DATE_TIME_FORMAT);
  } else {
    dateOfOccurrence = "";
  }
  return dateOfOccurrence;
};

export const getActsAndSectionsDetails = (actsAndSections, actList) => {
  let uniqActs = [];
  let diffActs = [];
  let uniqActName = [];
  !isEmpty(actsAndSections) &&
    actsAndSections.map((actSection, _index) => {
      const filteredList = filteredDataList(
        actsAndSections,
        actSection?.actDescription
      );
      getDataForActs(
        filteredList,
        actSection?.actDescription,
        getActName,
        uniqActName,
        uniqActs,
        diffActs,
        actList
      );
    });
  let RWRequired = "";
  const resultTemp = actsSectionResult(actsAndSections, RWRequired, actList);
  let resp1 = Object.values(resultTemp);
  return getSectionsData(resp1);
};

export const filteredDataList = (list, descriptions) =>
  !isEmpty(list) && list.filter((s) => s.actDescription === descriptions);

export const getActName = (actDescription, actList) =>
  !isEmpty(actList) &&
  first(actList.filter((s) => s.ACT_LONG === actDescription))?.ACT_SHORT;

export const getDataForActs = (
  filteredList,
  actDescription,
  getActName,
  uniqActName,
  uniqActs,
  diffActs,
  actList
) =>
  !isEmpty(filteredList) &&
  filteredList.map((list) => {
    if (list.actDescription === actDescription) {
      !isUndefined(list?.section) &&
        isArray(list?.section) &&
        list.section.map((sectionData) => {
          const data = list?.rwRequired ? `r/w ${sectionData}` : sectionData;
          if (filteredList.length > 1) {
            uniqActName.push(getActName(list?.actDescription, actList));
            uniqActs.push(data);
          } else {
            forEach(filteredList, function (value) {
              const result = {
                sections: value.section,
                actName: getActName(list?.actDescription),
                rwRequired: value?.rwRequired ? "r/w" : "",
              };
              diffActs.push(result);
            });
          }
        });
    }
  });

export const displayActsDetails = (actList, actName, rwRequired = "") => (
  <div key={actName}>
    {!isUndefined(actList) &&
      isArray(actList) &&
      actList.map((dataItem, index) => {
        return (
          <span className="tableRowText wordWrap" key={index}>
            {`${rwRequired !== "" ? rwRequired : ""} ${dataItem}${
              index !== actList.length - 1 ? ", " : " "
            }`}
          </span>
        );
      })}
    <span style={{ color: "#A8A8A8" }}>{actName !== "" ? actName : ""}</span>
  </div>
);
