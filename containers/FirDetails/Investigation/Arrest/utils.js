import moment from "moment";
import { isUndefined, isNull, isEmpty } from "lodash";
import {
  Template50ACrPCNotice,
  Template54CrPCNotice,
  Template50CrPCNotice,
  TemplateArrestPotencyTest,
  TemplateArrestMemo,
  TemplateArrestofAccusedIntimationtoLocalPolice,
  TemplatePTWarrant,
  TemplateRequestToUnitOfficerToGoOutOfState,
  TemplatePTWarrantRegularization,
  TemplateBailCancellationPetition,
  TemplateArrestOnDirectSurrenderInPS,
  TemplateHighCourtOrders,
  TemplateRequestForNBW,
  TemplateRequestForLOCToSP,
} from "@containers/GenerateTemplates";
import {
  DATE_FORMAT,
  TIME_FORMAT,
  getPersonAddressTemplate,
  DATE_TIME_FORMAT,
  DATE_YY_MM_DD,
  getTemplatesSectionsData,
  getIONameAndRank,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";

export const arrestOption = {
  ARREST: "Arrest",
  SURRENDER_IN_COURT: "Surrender in Court",
  SURRENDER_BEFORE_COURT: "Surrender on Anticipatory Bail in Court",
  HIGH_COURT_DIRECTIONS: "High Court Directions",
  ACCUSED_OUT_OF_COUNTRY: "Accused Out of Country",
};

export const arrestTypeOption = {
  ARREST_BY_POLICE: "Arrest By Police",
  ARREST_BY_OTHER_POLICE: "Arrest by other Police",
  ARREST_ON_ANTICIPATORY_BAIL: "Arrest on Anticipatory Bail",
  ARREST_ON_SURRENDER_IN_POLICE_STATION:
    "Arrest on Surrender in Police Station",
};

export const isOptionTrue = (value, options, index) => {
  return value === options[index].label;
};

export const getLabelName = (options, index) => {
  return options[index].label;
};

export const getHTMLFromTemplate = (filename, data) => {
  switch (filename) {
    case "50_Cr_P.C_Notice":
      return <Template50CrPCNotice fileName={filename} data={data} />;
    case "50A_Cr_P.C_Notice":
      return <Template50ACrPCNotice fileName={filename} data={data} />;
    case "54_Cr_P.C_Notice":
      return <Template54CrPCNotice fileName={filename} data={data} />;
    case "Potency_Test_Requisition":
      return <TemplateArrestPotencyTest fileName={filename} data={data} />;
    case "Potency_Test_Requisitions":
      return <TemplateArrestPotencyTest fileName={filename} data={data} />;
    case "Potency_Test_Requisition_On_Anticipatory_Bail":
      return <TemplateArrestPotencyTest fileName={filename} data={data} />;
    case "Arrest_memo":
      return <TemplateArrestMemo fileName={filename} data={data} />;
    case "Arrest_Of_Accused_Intimation_To_Local_Police_Officer":
      return (
        <TemplateArrestofAccusedIntimationtoLocalPolice
          fileName={filename}
          data={data}
        />
      );

    case "Request_for_PT_Warrant":
      return <TemplatePTWarrant fileName={filename} data={data} />;
    case "Request_to_unit_officer_to_go_out_of_state":
      return (
        <TemplateRequestToUnitOfficerToGoOutOfState
          fileName={filename}
          data={data}
        />
      );
    case "PT_Warrant_regularization":
      return (
        <TemplatePTWarrantRegularization fileName={filename} data={data} />
      );
    case "Bail_cancellation_petition":
      return (
        <TemplateBailCancellationPetition fileName={filename} data={data} />
      );
    case "Arrest_on_direct_surrender_in_PS":
      return (
        <TemplateArrestOnDirectSurrenderInPS fileName={filename} data={data} />
      );
    case "Bail_cancellation_requisition":
      return (
        <TemplateBailCancellationPetition fileName={filename} data={data} />
      );
    case "High_Court_Orders":
      return <TemplateHighCourtOrders fileName={filename} data={data} />;
    case "Request_for_NBW":
      return <TemplateRequestForNBW fileName={filename} data={data} />;
    case "LOC_form":
      return <TemplateRequestForLOCToSP fileName={filename} data={data} />;
    default:
      return "";
  }
};

//TO-DO Need to refactor this
export const getDataForDocument = (
  editArrestObj,
  fileName,
  selectedFir,
  currentUser,
  accusedPersonalDetails,
  savedFir
) => {
  const { firNum, district, psName, dateOfReport, briefFacts } = selectedFir;

  const {
    arrestByPolice,
    arrestType,
    action,
    arrestByOtherPolice,
    arrestOnAnticipatoryBail,
    surrenderBeforeCourt,
    highCourtDirections,
    surrenderInCourt,
  } = !isNull(editArrestObj) && editArrestObj;
  const {
    name,
    surname,
    dateOfBirth,
    caste,
    gender,
    fatherHusbandGuardianName,
    occupation,
  } = !isNull(editArrestObj) && editArrestObj?.accusedId?.personalDetails;
  const { presentAddress } = !isNull(editArrestObj) && editArrestObj?.accusedId;
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
    policeStation: psName,
    district: district,
    firNumber: firNum,
    sectionOfLaw: secdata,
    IOName: getIONameAndRank(briefFacts),
    dateOfFiling: dateOfReport ? moment(dateOfReport).format(DATE_FORMAT) : "",
  };

  const accusedAge =
    dateOfBirth && moment().diff(dateOfBirth, "years") > 0
      ? moment().diff(dateOfBirth, "years")
      : "";
  let phone = "";
  editArrestObj?.accusedId?.contactDetails.map((p) => {
    if (p.phoneNumber) phone = p.phoneNumber;
  });
  let reportData = {};
  const personAddress = getPersonAddressTemplate(presentAddress);
  if (action === arrestOption.ARREST) {
    if (arrestType === arrestTypeOption.ARREST_BY_POLICE) {
      const dateAndTimeOfArrest = arrestByPolice?.dateAndTimeOfArrest
        ? arrestByPolice?.dateAndTimeOfArrest
        : "";
      const arrestedDateTime = dateAndTimeOfArrest
        ? moment(dateAndTimeOfArrest)
        : "";
      const { accusedCode, medicalExamination, intimationOfArrest, rapeCase } =
        !isNull(arrestByPolice) && arrestByPolice;
      const personPersonalDetails =
        intimationOfArrest?.selectPerson?.personalDetails;
      const personName = `${personPersonalDetails?.name || ""} ${
        personPersonalDetails?.surname || ""
      }`;
      const intimatepersonAddress =
        getPersonAddressTemplate(
          intimationOfArrest?.selectPerson?.presentAddress
        ) || "";

      let initimatedob =
        intimationOfArrest?.selectPerson?.personalDetails?.dateOfBirth;
      const intimatepersonage =
        initimatedob && moment().diff(initimatedob, "years") > 0
          ? moment().diff(initimatedob, "years")
          : "";
      const intimatepersonoccu =
        intimationOfArrest?.selectPerson?.personalDetails?.occupation || "";
      const intimatepersongender =
        intimationOfArrest?.selectPerson?.personalDetails?.gender || "";
      const intimatepersonfather =
        intimationOfArrest?.selectPerson?.personalDetails
          ?.fatherHusbandGuardianName || "";
      let intimatepersonphone = "";
      intimationOfArrest?.selectPerson?.contactDetails.map((p) => {
        if (p.phoneNumber != undefined) intimatepersonphone = p.phoneNumber;
      });
      //concta intimate person details
      let completeintimateddetails = personName;
      if (intimatepersonfather) {
        if (intimatepersongender === "Female") {
          completeintimateddetails += "  D/o ";
          completeintimateddetails += intimatepersonfather
            ? intimatepersonfather
            : "";
        } else {
          completeintimateddetails += "  S/o ";
          completeintimateddetails += intimatepersonfather
            ? intimatepersonfather
            : "";
        }
      }

      if (intimatepersongender) {
        completeintimateddetails += " , ";
        completeintimateddetails += intimatepersongender
          ? intimatepersongender
          : "";
      }
      if (intimatepersonage) {
        completeintimateddetails += " , Age :";
        completeintimateddetails += intimatepersonage ? intimatepersonage : "";
      }
      if (intimatepersonoccu) {
        completeintimateddetails += " , Occ :";
        completeintimateddetails += intimatepersonoccu
          ? intimatepersonoccu
          : "";
      }

      if (intimatepersonAddress !== "  ") {
        completeintimateddetails += " , r/o : ";
        completeintimateddetails += intimatepersonAddress
          ? intimatepersonAddress
          : "";
      }

      if (intimatepersonphone) {
        completeintimateddetails += " , Contact Number : ";
        completeintimateddetails += intimatepersonphone
          ? intimatepersonphone
          : "";
      }
      const residenceName = `${
        accusedPersonalDetails?.presentAddress?.wardColony || ""
      } ${accusedPersonalDetails?.presentAddress?.district || ""}`;

      const { permanentAddress } =
        !isNull(editArrestObj) && editArrestObj?.accusedId;
      const personpermanentAddress = getPersonAddressTemplate(permanentAddress);
      let completeaccuseddetails = `${name} ${surname || ""}`;
      if (fatherHusbandGuardianName) {
        if (gender === "Female")
          completeaccuseddetails += " , d/o " + fatherHusbandGuardianName;
        else completeaccuseddetails += " , s/o " + fatherHusbandGuardianName;
      }
      if (gender) {
        completeaccuseddetails += " , " + gender;
      }
      if (accusedAge) {
        completeaccuseddetails += " , Age :" + accusedAge + "  years";
      }
      if (occupation) {
        completeaccuseddetails += " , Occ :" + occupation;
      }
      if (caste) {
        completeaccuseddetails += " , caste : " + caste;
      }
      if (personAddress !== "  ") {
        completeaccuseddetails += " , r/o : " + personAddress;
      }
      if (personpermanentAddress !== "  ") {
        completeaccuseddetails += " , N/o : " + personpermanentAddress;
      }

      if (!isNull(phone)) {
        completeaccuseddetails += " , Contact Number : " + phone;
      }
      switch (fileName) {
        case "50_Cr_P.C_Notice":
          const result50CrPc = {
            dateArrest: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : "",
            currentDate: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : "",
            timeOfArrest: arrestedDateTime
              ? arrestedDateTime.format(TIME_FORMAT)
              : "",
            courtName: arrestByPolice?.courtName,
            accusedDetails: [
              {
                accusedCode: accusedCode || "",
                accusedName: `${name} ${surname || ""}`,
                personAddress: personAddress || "",
                accusedAge: accusedAge || "",
                gender: gender || "",
                completeaccuseddetails: completeaccuseddetails || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...result50CrPc };
          break;
        case "50A_Cr_P.C_Notice":
          const age = moment(dateOfBirth).format(DATE_YY_MM_DD);
          const result50ACrPc = {
            accusedName: `${name || ""} ${surname || ""}`,
            accusedAge: moment().diff(age, "years"),
            accusedCaste: caste,
            accussedfather: fatherHusbandGuardianName,
            personName: personName ? personName : "__________",
            gender: gender || "",
            relationToAccused: intimationOfArrest?.relationToAccused
              ? "(" + intimationOfArrest?.relationToAccused + " of accused)"
              : "",
            residenceName: residenceName ? residenceName : "",
            completeintimateddetails: completeintimateddetails,
            currentDate: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            courtName: arrestByPolice?.courtName,
          };
          reportData = { ...commonReportData, ...result50ACrPc };
          break;
        case "54_Cr_P.C_Notice":
          const result = {
            currentDate: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            hospitalName: medicalExamination?.hospitalName,
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                completeaccuseddetails: completeaccuseddetails || "",
              },
            ],
            escortPC: rapeCase?.escortPC,
          };
          reportData = { ...commonReportData, ...result };
          break;
        case "Potency_Test_Requisition":
          const resultPotencyTest = {
            currentDate: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            hospitalName: medicalExamination?.hospitalName,
            courtName: arrestByPolice?.courtName,
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultPotencyTest };
          break;
        case "Arrest_memo":
          const policeRecords = arrestByPolice?.policeRecords;
          const resultArrestMemo = {
            currentDate: arrestedDateTime
              ? arrestedDateTime.format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            dateAndTimeOfArrest: arrestedDateTime
              ? arrestedDateTime.format(DATE_TIME_FORMAT)
              : "",
            placeOfTakenIntoCustody:
              arrestByPolice?.placeOfTakenIntoCustody || "",
            accusedCode: arrestByPolice.accusedCode || "",
            gender: gender || "",
            dateOfBirth: dateOfBirth || "",
            policeRecords: {
              isDangerous: policeRecords?.isDangerous ? "Yes" : "No",
              previouslyJumpedAnyBail: policeRecords?.previouslyJumpedAnyBail
                ? "Yes"
                : "No",
              isGenerallyArmed: policeRecords?.isGenerallyArmed ? "Yes" : "No",
              operatesWithAccomplices: policeRecords?.operatesWithAccomplices
                ? "Yes"
                : "No",
              isKnownCriminal: policeRecords?.isKnownCriminal ? "Yes" : "No",
              isRecidivist: policeRecords?.isRecidivist ? "Yes" : "No",
              isLikelyToJumpBail: policeRecords?.isLikelyToJumpBail
                ? "Yes"
                : "No",
              likelyToCommitCrime: policeRecords?.likelyToCommitCrime
                ? "Yes"
                : "No",
              isWantedInOtherCase: policeRecords?.isWantedInOtherCase
                ? "Yes"
                : "No",
            },
          };
          reportData = { ...commonReportData, ...resultArrestMemo };
          break;
        case "Arrest_Of_Accused_Intimation_To_Local_Police_Officer":
          const resultArrestToLocal = {
            currentDate: moment().format(DATE_FORMAT),
            courtName: arrestByPolice?.courtName,
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                completeaccuseddetails: completeaccuseddetails,
              },
            ],
            dateAndTimeOfArrest: arrestedDateTime
              ? arrestedDateTime.format(DATE_TIME_FORMAT)
              : "",
          };
          reportData = { ...commonReportData, ...resultArrestToLocal };
          break;
        default:
      }
    } else if (arrestType === arrestTypeOption.ARREST_BY_OTHER_POLICE) {
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

      const { accusedCode } =
        !isNull(arrestByOtherPolice) && arrestByOtherPolice;
      switch (fileName) {
        case "Request_for_PT_Warrant":
          const resultPtWarrant = {
            currentDate: arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
              ? moment(
                  arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                ).format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            dateOfPTWarrantRequisition:
              arrestByOtherPolice?.dateOfPTWarrantRequisition
                ? moment(
                    arrestByOtherPolice?.dateOfPTWarrantRequisition
                  ).format(DATE_FORMAT)
                : "",
            otherPsCrimeNumber: arrestByOtherPolice?.otherPsCrimeNumber
              ? arrestByOtherPolice?.otherPsCrimeNumber
              : "",
            osectionOfLaw: arrestByOtherPolice?.sectionOfLaw
              ? arrestByOtherPolice?.sectionOfLaw
              : "",
            otherPsName: arrestByOtherPolice?.otherPsName
              ? arrestByOtherPolice?.otherPsName
              : "",
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
            courtName: arrestByOtherPolice?.courtName || "",
            jailName: arrestByOtherPolice?.jailName || "",
            complainantname: complainantname || "",
            complainantaddress: complainantaddress ? complainantaddress : "",
            firDate: selectedFir?.firDate
              ? moment(selectedFir?.firDate).format(DATE_FORMAT)
              : "",
          };
          reportData = { ...commonReportData, ...resultPtWarrant };
          break;
        case "Request_to_unit_officer_to_go_out_of_state":
          const resultOutOfStation = {
            currentDate: arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
              ? moment(
                  arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                ).format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            dateOfPTWarrantRequisition:
              arrestByOtherPolice?.dateOfPTWarrantRequisition
                ? moment(
                    arrestByOtherPolice?.dateOfPTWarrantRequisition
                  ).format(DATE_FORMAT)
                : "",
            otherPsCrimeNumber: arrestByOtherPolice?.otherPsCrimeNumber
              ? arrestByOtherPolice?.otherPsCrimeNumber
              : "",
            osectionOfLaw: arrestByOtherPolice?.sectionOfLaw
              ? arrestByOtherPolice?.sectionOfLaw
              : "",
            otherPsName: arrestByOtherPolice?.otherPsName
              ? arrestByOtherPolice?.otherPsName
              : "",
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
            courtName: arrestByOtherPolice?.courtName || "",
            jailName: arrestByOtherPolice?.jailName || "",
            complainantname: complainantname || "",
            complainantaddress: complainantaddress ? complainantaddress : "",
            firDate: selectedFir?.firDate
              ? moment(selectedFir?.firDate).format(DATE_FORMAT)
              : "",
            selectTeamToGoOutOfState:
              arrestByOtherPolice?.selectTeamToGoOutOfState,
          };
          reportData = { ...commonReportData, ...resultOutOfStation };
          break;
        case "PT_Warrant_regularization":
          const resultRegularization = {
            currentDate: arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
              ? moment(
                  arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                ).format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            courtName: arrestByOtherPolice?.courtName || "",
            dateOfPTWarrantRequisition:
              arrestByOtherPolice?.dateOfPTWarrantRequisition
                ? moment(
                    arrestByOtherPolice?.dateOfPTWarrantRequisition
                  ).format(DATE_FORMAT)
                : "",
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultRegularization };
          break;
        case "Potency_Test_Requisitions":
          const resultPotencyTesst = {
            currentDate: arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
              ? moment(
                  arrestByOtherPolice?.dateTimeOfArrestByOtherPolice
                ).format(DATE_FORMAT)
              : moment().format(DATE_FORMAT),
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultPotencyTesst };
          break;
        default:
      }
    } else if (arrestType === arrestTypeOption.ARREST_ON_ANTICIPATORY_BAIL) {
      const { accusedCode } =
        !isNull(arrestOnAnticipatoryBail) && arrestOnAnticipatoryBail;
      switch (fileName) {
        case "Potency_Test_Requisition_On_Anticipatory_Bail":
          const resultPotencyTessantt = {
            currentDate: moment().format(DATE_FORMAT),
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultPotencyTessantt };
          break;
        case "Bail_cancellation_petition":
          const resultBailCancel = {
            currentDate: moment().format(DATE_FORMAT),
            accusedDetails: [
              {
                accusedCode: accusedCode,
                accusedName: `${name || ""} ${surname || ""}`,
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
            selectDaysOfWeek: arrestOnAnticipatoryBail?.selectDaysOfWeek || [],
            selectPeriod: arrestOnAnticipatoryBail?.selectPeriod || [],
            bailOrderNumber: arrestOnAnticipatoryBail?.bailOrderNumber || "",
            bailOrderDate: arrestOnAnticipatoryBail?.bailOrderDate || "",
            courtName: arrestOnAnticipatoryBail?.courtName || "",
          };
          reportData = { ...commonReportData, ...resultBailCancel };
          break;
        default:
      }
    } else if (
      arrestType === arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION
    ) {
      switch (fileName) {
        case "Arrest_on_direct_surrender_in_PS":
          reportData = { ...commonReportData };
          break;
        default:
      }
    }
  } else {
    if (action === arrestOption.SURRENDER_IN_COURT) {
      switch (fileName) {
        case "Bail_cancellation_requisition":
          const resultBailCancelRequisition = {
            currentDate: moment().format(DATE_FORMAT),
            selectDaysOfWeek: surrenderInCourt?.onBail?.selectDaysOfWeek || [],
            selectPeriod: surrenderInCourt?.onBail?.selectPeriod || [],
            courtName: surrenderInCourt?.courtName || "",
            bailOrderNumber: surrenderInCourt?.bailOrderNumber || "",
            bailOrderDate: surrenderInCourt?.bailOrderDate || "",
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress || "",
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultBailCancelRequisition };
          break;
        default:
      }
    } else if (action === arrestOption.HIGH_COURT_DIRECTIONS) {
      switch (fileName) {
        case "Bail_cancellation_requisition":
          const resultBailCancelReq = {
            currentDate: moment().format(DATE_FORMAT),
            selectDaysOfWeek: highCourtDirections?.selectDaysOfWeek || [],
            selectPeriod: highCourtDirections?.selectPeriod || [],
            bailOrderNumber: highCourtDirections?.bailOrderNumber || "",
            bailOrderDate: highCourtDirections?.bailOrderDate || "",
            courtName: highCourtDirections?.courtName || "",
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultBailCancelReq };
          break;
        default:
      }
    } else if (action === arrestOption.SURRENDER_BEFORE_COURT) {
      switch (fileName) {
        case "Potency_Test_Requisition":
          const resultPotencyTesstsur = {
            currentDate: moment().format(DATE_FORMAT),
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + " Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultPotencyTesstsur };
          break;
        case "Bail_cancellation_petition":
          const resultPetition = {
            selectDaysOfWeek: surrenderBeforeCourt?.selectDaysOfWeek || [],
            selectPeriod: surrenderBeforeCourt?.selectPeriod || [],
            highCourtCRLNo: surrenderBeforeCourt?.highCourtCRLNo || "",
            bailOrderNumber: surrenderBeforeCourt?.bailOrderNumber || "",
            bailOrderDate: surrenderBeforeCourt?.bailOrderDate || "",
            courtName: surrenderBeforeCourt?.courtName || "",
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress,
                gender: gender || "",
                occupation: occupation || "",
                fatherHusbandGuardianName: fatherHusbandGuardianName || "",
                accusedAge: accusedAge + "Years" || "",
                phone: phone || "",
                caste: caste || "",
              },
            ],
          };
          reportData = { ...commonReportData, ...resultPetition };
          break;
        default:
      }
    } else if (action === arrestOption.ACCUSED_OUT_OF_COUNTRY) {
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
        case "Request_for_NBW":
          const resultAccusedOut = {
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress,
              },
            ],
            complainantname: complainantname || "",
            complainantaddress: complainantaddress ? complainantaddress : "",
            complainantstatememt:
              selectedFir?.briefFacts?.factsOfComplainant || "",
          };
          reportData = { ...commonReportData, ...resultAccusedOut };

          break;
        case "LOC_form":
          const resultLoc = {
            accusedDetails: [
              {
                accusedName: `${name || ""} ${surname || ""}`,
                accusedCode: accusedPersonalDetails?.accusedCode
                  ? accusedPersonalDetails?.accusedCode
                  : "",
                personAddress: personAddress,
              },
            ],
            complainantname: complainantname || "",
            complainantaddress: complainantaddress ? complainantaddress : "",
            complainantstatememt:
              selectedFir?.briefFacts?.factsOfComplainant || "",
            selectTeamToGoOut: arrestByOtherPolice?.selectTeamToGoOutOfState,
          };
          reportData = { ...commonReportData, ...resultLoc };
          break;
        default:
      }
    }
  }
  return reportData;
};

// Common Edit method for handling Arrest updation
export const editArrestDetails = (
  value,
  setEditArrestObj,
  setSelectedActionValue,
  setSelectedArrestValue,
  setSelectedArrestType,
  setArrestProcesses,
  getArrestProcessResult,
  setIsInjured,
  setSelectedAccusedValue,
  setSelectedcircularStatus,
  setselectednbwStatus,
  form,
  setSelectedUploadMedicalCertificateUrl,
  setSelectedSuretyDetails,
  setSelectedUploadCourtConditionsUrl,
  setSelectedCourtOrderDocumentURL,
  setSelectedNbwURL
) => {
  setEditArrestObj(value);
  if (value) {
    setSelectedActionValue(value.action);
    setSelectedArrestValue(value.arrestType);
    setSelectedArrestType(value.arrestType);
    setArrestProcesses(getArrestProcessResult(value.arrestType));
    const personalDetails = value.accusedId?.personalDetails;
    setSelectedAccusedValue(
      `${personalDetails?.name} ${personalDetails?.surname || ""}`
    );
    form.setFieldsValue({
      action: value.action,
      arrestType: value.arrestType,
    });
    const {
      arrestByPolice,
      arrestByOtherPolice,
      arrestOnAnticipatoryBail,
      arrestOnSurrenderInPoliceStation,
      surrenderInCourt,
      highCourtDirections,
      surrenderBeforeCourt,
      accusedOutOfCountry,
    } = value;
    const { requestCourtNBW, requestToCircular } =
      !isUndefined(accusedOutOfCountry) && accusedOutOfCountry;
    const { judicialCustody, onBail } =
      !isUndefined(surrenderInCourt) && surrenderInCourt;
    const {
      medicalExamination,
      policeRecords,
      rapeCase,
      intimationOfArrest,
      femaleArrest,
    } = !isUndefined(arrestByPolice) && arrestByPolice;
    if (value.arrestType === arrestTypeOption.ARREST_BY_POLICE) {
      const uploadMedicalCertificate =
        medicalExamination?.uploadMedicalCertificate;
      if (
        !isUndefined(uploadMedicalCertificate) &&
        uploadMedicalCertificate?.name !== ""
      ) {
        const result = {
          url: uploadMedicalCertificate?.url,
          name: uploadMedicalCertificate?.name,
          fileId: uploadMedicalCertificate?.fileId,
        };
        setSelectedUploadMedicalCertificateUrl([result]);
      } else {
        setSelectedUploadMedicalCertificateUrl([]);
      }
      setIsInjured(medicalExamination?.isInjured);
      setSelectedSuretyDetails(arrestByPolice?.suretyDetails);
      form.setFieldsValue({
        accusedId: value?.accusedId?._id,
        action: value?.action,
        arrestType: value?.arrestType,
        placeOfTakenIntoCustody: arrestByPolice?.placeOfTakenIntoCustody,
        dateTimeOfCustody:
          arrestByPolice?.dateTimeOfCustody &&
          moment(new Date(arrestByPolice?.dateTimeOfCustody)).isValid()
            ? moment(new Date(arrestByPolice?.dateTimeOfCustody))
            : "",
        apprehendedBy: arrestByPolice?.apprehendedBy,
        iOAssistedBy: arrestByPolice?.iOAssistedBy,
        accusedCode: arrestByPolice?.accusedCode,
        placeOfArrest: arrestByPolice?.placeOfArrest,
        courtName: arrestByPolice?.courtName,
        dateAndTimeOfArrest:
          arrestByPolice?.dateAndTimeOfArrest &&
          moment(new Date(arrestByPolice?.dateAndTimeOfArrest)).isValid()
            ? moment(new Date(arrestByPolice?.dateAndTimeOfArrest))
            : "",
        relationToAccused: intimationOfArrest?.relationToAccused,
        selectPerson: intimationOfArrest?.selectPerson?._id,
        modeOfIntimation: intimationOfArrest?.modeOfIntimation,
        intimatedDate:
          intimationOfArrest?.intimatedDate &&
          moment(new Date(intimationOfArrest?.intimatedDate)).isValid()
            ? moment(new Date(intimationOfArrest?.intimatedDate))
            : "",
        hospitalName: medicalExamination?.hospitalName,
        otherHospitalName: medicalExamination?.otherHospitalName,
        hospitalLocation: medicalExamination?.hospitalLocation,
        isInjured: medicalExamination?.isInjured,
        descriptionOfInjuries: medicalExamination?.descriptionOfInjuries,
        escortPC: rapeCase?.escortPC,
        RChospitalName: rapeCase?.hospitalName,
        RChospitalLocation: rapeCase?.hospitalLocation,
        officerName: femaleArrest?.officerName,
        rank: femaleArrest?.rank,
        isDangerous: policeRecords?.isDangerous,
        isDangerousDetails: policeRecords?.isDangerousDetails,
        previouslyJumpedAnyBail: policeRecords?.previouslyJumpedAnyBail,
        previouslyJumpedAnyBailDetails:
          policeRecords?.previouslyJumpedAnyBailDetails,
        isGenerallyArmed: policeRecords?.isGenerallyArmed,
        isGenerallyArmedDetails: policeRecords?.isGenerallyArmedDetails,
        operatesWithAccomplices: policeRecords?.operatesWithAccomplices,
        operatesWithAccomplicesDetails:
          policeRecords?.operatesWithAccomplicesDetails,
        isKnownCriminal: policeRecords?.isKnownCriminal,
        isKnownCriminalDetails: policeRecords?.isKnownCriminalDetails,
        isRecidivist: policeRecords?.isRecidivist,
        isRecidivistDetails: policeRecords?.isRecidivistDetails,
        isLikelyToJumpBail: policeRecords?.isLikelyToJumpBail,
        isLikelyToJumpBailDetails: policeRecords?.isLikelyToJumpBailDetails,
        likelyToCommitCrime: policeRecords?.likelyToCommitCrime,
        likelyToCommitCrimeDetails: policeRecords?.likelyToCommitCrimeDetails,
        isWantedInOtherCase: policeRecords?.isWantedInOtherCase,
        isWantedInOtherCaseDetails: policeRecords?.isWantedInOtherCaseDetails,
      });
    }
    if (value.arrestType === arrestTypeOption.ARREST_BY_OTHER_POLICE) {
      setIsInjured(arrestByOtherPolice?.isInjured);
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        accusedCode: arrestByOtherPolice.accusedCode,
        dateTimeOfArrestByOtherPolice:
          arrestByOtherPolice?.dateTimeOfArrestByOtherPolice &&
          moment(
            new Date(arrestByOtherPolice.dateTimeOfArrestByOtherPolice)
          ).isValid()
            ? moment(
                new Date(arrestByOtherPolice.dateTimeOfArrestByOtherPolice)
              )
            : "",
        durationOfJudicialCustody:
          arrestByOtherPolice.durationOfJudicialCustody,
        isInjured: arrestByOtherPolice.isInjured,
        descriptionOfInjuries: arrestByOtherPolice.descriptionOfInjuries,
        psCrimeConfessed: arrestByOtherPolice.psCrimeConfessed,
        otherPsCrimeNumber: arrestByOtherPolice.otherPsCrimeNumber,
        intimationReceivedDate:
          arrestByOtherPolice?.intimationReceivedDate &&
          moment(new Date(arrestByOtherPolice.intimationReceivedDate)).isValid()
            ? moment(new Date(arrestByOtherPolice.intimationReceivedDate))
            : "",
        courtName: arrestByOtherPolice.courtName,
        sectionOfLaw: arrestByOtherPolice.sectionOfLaw,
        jailName: arrestByOtherPolice.jailName,
        underTrialNo: arrestByOtherPolice.underTrialNo,
        dateOfPTWarrantRequisition:
          arrestByOtherPolice?.dateOfPTWarrantRequisition &&
          moment(
            new Date(arrestByOtherPolice.dateOfPTWarrantRequisition)
          ).isValid()
            ? moment(new Date(arrestByOtherPolice.dateOfPTWarrantRequisition))
            : "",
        arrestedByOtherPsIoName: arrestByOtherPolice.arrestedByOtherPsIoName,
        otherPsName: arrestByOtherPolice.otherPsName,
        unitOrDistrict: arrestByOtherPolice.unitOrDistrict,
        otherStateSelect: arrestByOtherPolice.otherStateSelect,
        selectTeamToGoOutOfState: arrestByOtherPolice.selectTeamToGoOutOfState,
        requestedOn: arrestByOtherPolice.requestedOn,
        requestStatus: arrestByOtherPolice.requestStatus,
        receivedOn: arrestByOtherPolice.receivedOn,
        dateOfTravelToOtherState:
          arrestByOtherPolice?.dateOfTravelToOtherState &&
          moment(
            new Date(arrestByOtherPolice.dateOfTravelToOtherState)
          ).isValid()
            ? moment(new Date(arrestByOtherPolice.dateOfTravelToOtherState))
            : "",
        ptWarrantIssued: arrestByOtherPolice.ptWarrantIssued,
        warrantIssuedDate:
          arrestByOtherPolice?.warrantIssuedDate &&
          moment(new Date(arrestByOtherPolice.warrantIssuedDate)).isValid()
            ? moment(new Date(arrestByOtherPolice.warrantIssuedDate))
            : "",
        warrantorderNumber: arrestByOtherPolice.warrantorderNumber,
        ptWarrantRegularized: arrestByOtherPolice.ptWarrantRegularized,
        warrantRegularizedDate:
          arrestByOtherPolice?.warrantRegularizedDate &&
          moment(new Date(arrestByOtherPolice.warrantRegularizedDate)).isValid()
            ? moment(new Date(arrestByOtherPolice.warrantRegularizedDate))
            : "",
        isPoliceCustodyRequired: arrestByOtherPolice.isPoliceCustodyRequired,
      });
    }
    if (value.arrestType === arrestTypeOption.ARREST_ON_ANTICIPATORY_BAIL) {
      const selectPeriodArray = [];
      if (arrestOnAnticipatoryBail?.selectPeriod?.length > 0) {
        selectPeriodArray.push(
          moment(new Date(arrestOnAnticipatoryBail.selectPeriod[0])).isValid()
            ? moment(new Date(arrestOnAnticipatoryBail.selectPeriod[0]))
            : ""
        );
        selectPeriodArray.push(
          moment(new Date(arrestOnAnticipatoryBail.selectPeriod[1])).isValid()
            ? moment(new Date(arrestOnAnticipatoryBail.selectPeriod[1]))
            : ""
        );
      }
      setIsInjured(arrestOnAnticipatoryBail?.isInjured);
      setSelectedSuretyDetails(arrestOnAnticipatoryBail?.suretyDetails);
      const uploadCourtConditions =
        arrestOnAnticipatoryBail?.uploadCourtConditions;
      if (
        !isUndefined(uploadCourtConditions) &&
        uploadCourtConditions?.name !== ""
      ) {
        setSelectedUploadCourtConditionsUrl([
          arrestOnAnticipatoryBail?.uploadCourtConditions,
        ]);
      } else {
        setSelectedUploadCourtConditionsUrl([]);
      }
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        accusedCode: arrestOnAnticipatoryBail.accusedCode,
        dateAndTimeOfSurrender:
          arrestOnAnticipatoryBail?.dateAndTimeOfSurrender &&
          moment(
            new Date(arrestOnAnticipatoryBail.dateAndTimeOfSurrender)
          ).isValid()
            ? moment(new Date(arrestOnAnticipatoryBail.dateAndTimeOfSurrender))
            : "",
        isInjured: arrestOnAnticipatoryBail.isInjured,
        descriptionOfInjuries: arrestOnAnticipatoryBail.descriptionOfInjuries,
        bailOrderNumber: arrestOnAnticipatoryBail.bailOrderNumber,
        bailOrderDate:
          arrestOnAnticipatoryBail?.bailOrderDate &&
          moment(new Date(arrestOnAnticipatoryBail.bailOrderDate)).isValid()
            ? moment(new Date(arrestOnAnticipatoryBail.bailOrderDate))
            : "",
        courtName: arrestOnAnticipatoryBail.courtName,
        uploadCourtConditions: arrestOnAnticipatoryBail.uploadCourtConditions,
        conditionsImposed: arrestOnAnticipatoryBail.conditionsImposed,
        toAppearBeforeIo: arrestOnAnticipatoryBail.toAppearBeforeIo,
        selectDaysOfWeek: arrestOnAnticipatoryBail.selectDaysOfWeek,
        selectPeriod: selectPeriodArray,
        cooperateWithIo: arrestOnAnticipatoryBail.cooperateWithIo,
      });
    }
    if (
      value.arrestType ===
      arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION
    ) {
      let surrenderType = "";
      if (arrestOnSurrenderInPoliceStation.arrest) {
        surrenderType = arrestOption.ARREST;
      }
      if (arrestOnSurrenderInPoliceStation.releasedOnStationBail) {
        surrenderType = "Released On Station Bail";
      }
      if (arrestOnSurrenderInPoliceStation.issue41ANotice) {
        surrenderType = "Issue 41A Cr.P.C Notice";
      }
      setSelectedSuretyDetails(arrestOnSurrenderInPoliceStation?.suretyDetails);
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        arrest: arrestOnSurrenderInPoliceStation.arrest,
        releasedOnStationBail:
          arrestOnSurrenderInPoliceStation.releasedOnStationBail,
        intimationToSeniorOfficer:
          arrestOnSurrenderInPoliceStation.intimationToSeniorOfficer,
        stationBailDate:
          arrestOnSurrenderInPoliceStation?.stationBailDate &&
          moment(
            new Date(arrestOnSurrenderInPoliceStation.stationBailDate)
          ).isValid()
            ? moment(new Date(arrestOnSurrenderInPoliceStation.stationBailDate))
            : "",
        dateOfSurrender:
          arrestOnSurrenderInPoliceStation?.dateOfSurrender &&
          moment(
            new Date(arrestOnSurrenderInPoliceStation.dateOfSurrender)
          ).isValid()
            ? moment(new Date(arrestOnSurrenderInPoliceStation.dateOfSurrender))
            : "",
        issue41ANotice: arrestOnSurrenderInPoliceStation.issue41ANotice,
        arrestSurrenderType: surrenderType,
      });
    }
    if (value.action === arrestOption.SURRENDER_IN_COURT) {
      let surrenderInCourtType = "";
      let DateTime = null;
      if (surrenderInCourt?.sendToJudicialCustody) {
        surrenderInCourtType = "judicialcustody";
        DateTime = moment(new Date(judicialCustody?.dateTime)).isValid()
          ? moment(new Date(judicialCustody?.dateTime))
          : "";
      }
      if (surrenderInCourt?.releasedOnBail) {
        surrenderInCourtType = "releasedonbail";
        DateTime = moment(new Date(onBail?.dateTime)).isValid()
          ? moment(new Date(onBail?.dateTime))
          : "";
      }
      const selectPeriodArr = [];
      if (onBail?.selectPeriod?.length > 0) {
        selectPeriodArr.push(
          moment(new Date(onBail.selectPeriod[0])).isValid()
            ? moment(new Date(onBail.selectPeriod[0]))
            : ""
        );
        selectPeriodArr.push(
          moment(new Date(onBail.selectPeriod[1])).isValid()
            ? moment(new Date(onBail.selectPeriod[1]))
            : ""
        );
      }
      setSelectedSuretyDetails(surrenderInCourt?.suretyDetails);
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        courtName: surrenderInCourt?.courtName,
        dateTime:
          surrenderInCourt?.dateTime &&
          moment(new Date(surrenderInCourt?.dateTime)).isValid()
            ? moment(new Date(surrenderInCourt?.dateTime))
            : "",
        dateTimeReleaseonBail: moment(new Date(onBail?.dateTime)).isValid()
          ? moment(new Date(onBail?.dateTime))
          : "",
        numberOfDays: judicialCustody?.numberOfDays,
        underTrialNo: judicialCustody?.underTrialNo,
        JailName: judicialCustody?.JailName,
        conditionsImposed: onBail?.conditionsImposed,
        disNumberOfCourt: onBail?.disNumberOfCourt,
        dateTimeJudicialcustody:
          judicialCustody?.dateTime &&
          moment(new Date(judicialCustody?.dateTime)).isValid()
            ? moment(new Date(judicialCustody?.dateTime))
            : "",
        toAppearBeforeIo: onBail?.toAppearBeforeIo,
        cooperateWithIo: onBail?.cooperateWithIo,
        selectDaysOfWeek: onBail?.selectDaysOfWeek,
        selectPeriod: selectPeriodArr,
        surrenderInCourtType: surrenderInCourtType,
      });
    }
    if (value.action === arrestOption.HIGH_COURT_DIRECTIONS) {
      const highCourtSelectedPeriod = [];
      if (highCourtDirections?.selectPeriod?.length > 0) {
        highCourtSelectedPeriod.push(
          moment(new Date(highCourtDirections.selectPeriod[0])).isValid()
            ? moment(new Date(highCourtDirections.selectPeriod[0]))
            : ""
        );
        highCourtSelectedPeriod.push(
          moment(new Date(highCourtDirections.selectPeriod[1])).isValid()
            ? moment(new Date(highCourtDirections.selectPeriod[1]))
            : ""
        );
      }
      const courtOrderDocumentURL = highCourtDirections?.courtOrderDocumentURL;
      if (
        !isUndefined(
          courtOrderDocumentURL && courtOrderDocumentURL?.name !== ""
        )
      ) {
        setSelectedCourtOrderDocumentURL([
          highCourtDirections?.courtOrderDocumentURL,
        ]);
      } else {
        setSelectedCourtOrderDocumentURL([]);
      }
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        icjsDetails: highCourtDirections?.icjsDetails,
        highCourtDirection: highCourtDirections?.highCourtDirection,
        conditionsImposed: highCourtDirections?.conditionsImposed,
        dateTime:
          highCourtDirections?.dateTime &&
          moment(new Date(highCourtDirections?.dateTime)).isValid()
            ? moment(new Date(highCourtDirections?.dateTime))
            : "",
        receivedDateTime: moment(
          new Date(highCourtDirections?.receivedDateTime)
        ).isValid()
          ? moment(new Date(highCourtDirections?.receivedDateTime))
          : "",
        toAppearBeforeIo: highCourtDirections?.toAppearBeforeIo,
        cooperateWithIo: highCourtDirections?.cooperateWithIo,
        selectDaysOfWeek: highCourtDirections?.selectDaysOfWeek,
        selectPeriod: highCourtSelectedPeriod,
        courtOrderDocumentURL: highCourtDirections?.courtOrderDocumentURL,
      });
    }
    if (value.action === arrestOption.SURRENDER_BEFORE_COURT) {
      const selectPeriods = [];
      if (surrenderBeforeCourt?.selectPeriod?.length > 0) {
        selectPeriods.push(
          moment(new Date(surrenderBeforeCourt.selectPeriod[0])).isValid()
            ? moment(new Date(surrenderBeforeCourt.selectPeriod[0]))
            : ""
        );
        selectPeriods.push(
          moment(new Date(surrenderBeforeCourt.selectPeriod[1])).isValid()
            ? moment(new Date(surrenderBeforeCourt.selectPeriod[1]))
            : ""
        );
      }
      setSelectedSuretyDetails(surrenderBeforeCourt?.suretyDetails);
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        bailName: surrenderBeforeCourt?.bailName,
        highCourtCRLNo: surrenderBeforeCourt?.highCourtCRLNo,
        dateTime:
          surrenderBeforeCourt?.dateTime &&
          moment(new Date(surrenderBeforeCourt?.dateTime)).isValid()
            ? moment(new Date(surrenderBeforeCourt?.dateTime))
            : "",
        surrenderDateInLowerCourt: moment(
          new Date(surrenderBeforeCourt?.surrenderDateInLowerCourt)
        ).isValid()
          ? moment(new Date(surrenderBeforeCourt?.surrenderDateInLowerCourt))
          : "",
        lowerCourtName: surrenderBeforeCourt?.lowerCourtName,
        courtDISNo: surrenderBeforeCourt?.courtDISNo,
        disDate:
          surrenderBeforeCourt?.disDate &&
          moment(new Date(surrenderBeforeCourt?.disDate)).isValid()
            ? moment(new Date(surrenderBeforeCourt?.disDate))
            : "",
        bailConditionsImposed: surrenderBeforeCourt?.bailConditionsImposed,
        toAppearBeforeIo: surrenderBeforeCourt?.toAppearBeforeIo,
        selectDaysOfWeek: surrenderBeforeCourt?.selectDaysOfWeek,
        selectPeriod: selectPeriods,
        cooperateWithIo: surrenderBeforeCourt?.cooperateWithIo,
      });
    }
    if (value.action === arrestOption.ACCUSED_OUT_OF_COUNTRY) {
      setselectednbwStatus(requestCourtNBW?.nbwStatus);
      setSelectedcircularStatus(requestToCircular?.circularStatus);
      const nbwURL = requestCourtNBW?.nbwURL;
      if (!isUndefined(nbwURL) && nbwURL?.name !== "") {
        setSelectedNbwURL([requestCourtNBW?.nbwURL]);
      } else {
        setSelectedNbwURL([]);
      }
      form.setFieldsValue({
        accusedId: value.accusedId._id,
        action: value.action,
        arrestType: value.arrestType,
        dateTime:
          accusedOutOfCountry?.dateTime &&
          moment(new Date(accusedOutOfCountry?.dateTime)).isValid()
            ? moment(new Date(accusedOutOfCountry?.dateTime))
            : "",
        requestForNBW: requestCourtNBW?.requestForNBW,
        nbwStatus: requestCourtNBW?.nbwStatus,
        nbwURL: requestCourtNBW?.nbwURL,
        nbwRequestedDate:
          requestCourtNBW?.requestedOn &&
          moment(new Date(requestCourtNBW?.requestedOn)).isValid()
            ? moment(new Date(requestCourtNBW?.requestedOn))
            : "",
        nbwReceivedDateTime:
          requestCourtNBW?.nbwReceivedDateTime &&
          moment(new Date(requestCourtNBW?.nbwReceivedDateTime)).isValid()
            ? moment(new Date(requestCourtNBW?.nbwReceivedDateTime))
            : "",
        requestForCircular: requestToCircular?.requestForCircular,
        circularStatus: requestToCircular?.circularStatus,
        circularRequestedDate:
          requestToCircular?.requestedOn &&
          moment(new Date(requestToCircular?.requestedOn)).isValid()
            ? moment(new Date(requestToCircular?.requestedOn))
            : null,
        circularApprovedDate:
          requestToCircular?.circularApprovedDate &&
          moment(new Date(requestToCircular?.circularApprovedDate)).isValid()
            ? moment(new Date(requestToCircular?.circularApprovedDate))
            : null,
      });
    }
  }
};

export const getAccuseds = (accusedList) => {
  let list = [];
  accusedList &&
    // eslint-disable-next-line array-callback-return
    accusedList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        accusedCode: item?.accusedCode,
      };
      list.push(result);
    });
  return list;
};
