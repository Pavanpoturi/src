import {
  TemplateDisposalOfUnknownDeadBodies,
  TemplateForwardingOfFPS,
  TemplateNotice175CrPCForPanchWitnesses,
  TemplateRequisitionForCollectionOfFingerPrints,
  TemplateRequisitionForCollectionOfSkeletonBones,
  TemplateRequisitionForInquest,
  TemplateRequisitionForSpotPME,
  TemplateRequisitionToProidePanchWitnesses,
  TemplateSubmissionOfInquestToCourt,
} from "@containers/GenerateTemplates";
import { isNull, isEmpty } from "lodash";
import {
  getPersonAddressTemplate,
  DATE_FORMAT,
  getTemplatesSectionsData,
  showPSName,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import moment from "moment";

export const inquestTemplates = [
  {
    name: "Requisition for Inquest by Tahsildar",
    label: "Requisition for Inquest by Tahsildar",
    fileName: "Requisition_for_Inquest_by_Tahsildar",
    templateAvailable: true,
  },
  {
    name: "Requisition for submission of Inquest to court",
    label: "Requisition for submission of Inquest to court",
    fileName: "Requisition_for_submission_of_inquest_to_court",
    templateAvailable: true,
  },
  {
    name: "Requisition for collection of finger prints (in case of unknown dead body)",
    label:
      "Requisition for collection of finger prints (in case of unknown dead body)",
    fileName: "Requisition_for_collection_of_finger_prints",
    templateAvailable: true,
  },
  {
    name: "Requisition for collection of Skeleton Bones",
    label: "Requisition for collection of Skeleton Bones",
    fileName: "Requisition_for_collection_of_Skeleton_Bones",
    templateAvailable: true,
  },
  {
    name: "Requisition for Disposal of unknown dead bodies",
    label: "Requisition for Disposal of unknown dead bodies",
    fileName: "Requisition_for_disposal_of_unknown_dead_bodies",
    templateAvailable: true,
  },
  {
    name: "Requisition for forwarding of Finger Prints of unknown dead body",
    label: "Requisition for forwarding of Finger Prints of unknown dead body",
    fileName:
      "Requisition_for_forwarding_of_finger_prints_of_unknown_dead_bodies",
    templateAvailable: true,
  },
  {
    name: "Generate 175 Cr.P.C for Panch Witness (If Panch selected)",
    label: "Generate 175 Cr.P.C for Panch Witness (If Panch selected)",
    fileName: "Generate_175_Cr.P.C_for_Panch_Witness",
    templateAvailable: true,
  },
  {
    name: "Requisition to provide Govt. Panch Witness",
    label: "Requisition to provide Govt. Panch Witness",
    fileName: "Requisition_to_provide_Govt_Panch_Witness",
    templateAvailable: true,
  },
];

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "Requisition_for_Inquest_by_Tahsildar":
      return <TemplateRequisitionForInquest fileName={filename} data={data} />;
    case "Requisition_for_submission_of_inquest_to_court":
      return (
        <TemplateSubmissionOfInquestToCourt fileName={filename} data={data} />
      );
    case "Requisition_for_collection_of_finger_prints":
      return (
        <TemplateRequisitionForCollectionOfFingerPrints
          fileName={filename}
          data={data}
        />
      );
    case "Requisition_for_collection_of_Skeleton_Bones":
      return (
        <TemplateRequisitionForCollectionOfSkeletonBones
          fileName={filename}
          data={data}
        />
      );
    case "Requisition_for_disposal_of_unknown_dead_bodies":
      return (
        <TemplateDisposalOfUnknownDeadBodies fileName={filename} data={data} />
      );

    case "Requisition_for_forwarding_of_finger_prints_of_unknown_dead_bodies":
      return <TemplateForwardingOfFPS fileName={filename} data={data} />;

    case "Requisition_for_conducting_PME_at_Spot":
      return <TemplateRequisitionForSpotPME fileName={filename} data={data} />;

    case "Generate_175_Cr.P.C_for_Panch_Witness":
      return (
        <TemplateNotice175CrPCForPanchWitnesses
          fileName={filename}
          data={data}
        />
      );

    case "Requisition_to_provide_Govt_Panch_Witness":
      return (
        <TemplateRequisitionToProidePanchWitnesses
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
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };

  const { name, surname } =
    !isNull(formData) && formData?.victimId && formData?.victimId?.personalDetails || {};
  const { presentAddress } = !isNull(formData) && formData?.victimId || {};
  const personAddress = getPersonAddressTemplate(presentAddress);
  const accusedName =
    formData && `${name ? name : ""} ${surname ? surname : ""}`;
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

  switch (fileName) {
    case "Requisition_for_Inquest_by_Tahsildar":
      const resTahsildar = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resTahsildar };
      break;
    case "Requisition_for_submission_of_inquest_to_court":
      const resToCourt = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resToCourt };
      break;
    case "Requisition_for_collection_of_finger_prints":
      const resFingerPrint = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        escortPC: formData?.escortPC ? formData?.escortPC : [],
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resFingerPrint };
      break;
    case "Requisition_for_collection_of_Skeleton_Bones":
      const resSkelton = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resSkelton };
      break;
    case "Requisition_for_disposal_of_unknown_dead_bodies":
      const resDeadBodies = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      console.log(resDeadBodies);
      reportData = { ...commonReportData, ...resDeadBodies };

      break;
    case "Requisition_for_forwarding_of_finger_prints_of_unknown_dead_bodies":
      const resUnknownDeadBodies = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resUnknownDeadBodies };
      break;
    case "Requisition_for_conducting_PME_at_Spot":
      const resPMESpot = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resPMESpot };
      break;
    case "Generate_175_Cr.P.C_for_Panch_Witness":
      const resPanchWitness = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resPanchWitness };
      break;
    case "Requisition_to_provide_Govt_Panch_Witness":
      const resGovPanchWitness = {
        complainantname: complainantname || "",
        complainantaddress: complainantaddress ? complainantaddress : "",
        dateTime: formData?.userDate ? formData?.userDate : moment(),
        accusedName: accusedName || "",
        personAddress: personAddress || "",
        complainantstatememt: selectedFir?.briefFacts?.factsOfComplainant || "",
      };
      reportData = { ...commonReportData, ...resGovPanchWitness };
      break;
    default:
  }
  return reportData;
};

export const inquestForm = [
  {
    name: "placeOfInquest",
    label: "Place of Inquest",
    type: "dropdown",
  },
  {
    name: "inquestHeldBy",
    label: "Inquest Held By",
    type: "dropdown",
    actionLink: "addProfessional",
    actionName: "Add Professional",
  },
  {
    name: "witnessOrRelatives",
    label: "Name and Address of Relatives / Witnesses / Panch Witness",
    type: "dropdown",
  },
];

export const inquestDeathDetailsForm = [
  {
    name: "natureOfDeath",
    label: "Nature of Death",
    type: "dropdown",
  },
  {
    name: "apparentCauseOfDeath",
    label: "Apparent Cause of Death",
    type: "dropdown",
  },
  {
    name: "methodOfDeath",
    label: "Reason For Death",
    type: "dropdown",
  },
];

export const inquestDeathDetailsFormTwo = [
  {
    name: "inquestCommenced",
    label: "Inquest Commenced",
    type: "date",
  },
  {
    name: "inquestConcluded",
    label: "Inquest Concluded",
    type: "date",
  },
  {
    name: "escortPC",
    label: "Escort PC",
    type: "dropdown",
  },
];

export const placeOfInquestList = [
  {
    label: "At Spot",
  },
  {
    label: "At the place of Exhumation",
  },
  {
    label: "Hospital",
  },
];
