/* eslint-disable array-callback-return */
import {
  isArray,
  isEmpty,
  isNull,
  isUndefined,
  uniqBy,
  upperCase,
  first,
  filter,
  includes,
} from "lodash";
import { Select } from "antd";
import moment from "moment";
import { CaretDownOutlined } from "@ant-design/icons";
import { arrestOption, arrestTypeOption } from "./Investigation/Arrest/utils";
import { loadState } from "@lib/helpers/localStorage";

const Option = Select.Option;

const getIdentityValues = (obj, key) => {
  return first(
    filter(obj, function (_v, k) {
      return includes(k, key);
    })
  );
};

const getIdentityDetails = (identity) => {
  const identityDetails =
    !isEmpty(identity) &&
    identity.map((s, i) => {
      return {
        type: isUndefined(s[`type_${i}`])
          ? getIdentityValues(s, "type")
          : s[`type_${i}`],
        number: isUndefined(s[`number_${i}`])
          ? getIdentityValues(s, "number")
          : s[`number_${i}`],
        name: isUndefined(s[`name_${i}`])
          ? getIdentityValues(s, "name")
          : s[`name_${i}`],
        url: isUndefined(s[`url_${i}`])
          ? getIdentityValues(s, "url")
          : s[`url_${i}`],
        fileId: isUndefined(s[`fileId_${i}`])
          ? getIdentityValues(s, "fileId")
          : s[`fileId_${i}`],
        issuedBy: "",
      };
    });
  return identityDetails;
};

// common Payload for Adding Person Details
export const getPersonDetails = (values, identity, media = []) => {
  const isSameAsPresent = !(
    isUndefined(values?.sameAsPresent) || values?.sameAsPresent === false
  );
  return {
    personalDetails: {
      name: values?.name,
      surname: values?.surname,
      designation: values?.designation,
      placeOfWork: values?.placeOfWork,
      alias: values?.aliasName,
      relationType: values?.relationType,
      fatherHusbandGuardianName: values?.fatherHusbandGuardianName,
      gender: values?.gender,
      isDied: values?.isDied,
      dateOfBirth: values?.dateOfBirth,
      age: values?.age,
      occupation: values?.occupation,
      educationQualification: values?.educationQualification,
      caste: values?.caste,
      subCaste: values?.subCaste,
      religion: values?.religion,
      nationality: values?.nationality,
      createdFrom: values?.createdFrom ? values?.createdFrom : "",
      createdFor: values?.createdFor ? values?.createdFor : "",
    },
    presentAddress: {
      houseNo: values?.houseNo,
      streetRoadNo: values?.streetRoadNo,
      wardColony: values?.wardColony,
      landmarkMilestone: values?.landmarkMilestone,
      localityVillage: values?.localityVillage,
      areaMandal: values?.areaMandal,
      district: values?.district,
      stateUt: values?.stateUt,
      residencyType: values?.residencyType,
      pinCode: values?.pinCode,
    },
    permanentAddress: {
      houseNo: isSameAsPresent ? values?.houseNo : values?.p_houseNo,
      streetRoadNo: isSameAsPresent
        ? values?.streetRoadNo
        : values?.p_streetRoadNo,
      wardColony: isSameAsPresent ? values?.wardColony : values?.p_wardColony,
      landmarkMilestone: isSameAsPresent
        ? values?.landmarkMilestone
        : values?.p_landmarkMilestone,
      localityVillage: isSameAsPresent
        ? values?.localityVillage
        : values?.p_localityVillage,
      areaMandal: isSameAsPresent ? values?.areaMandal : values?.p_areaMandal,
      district: isSameAsPresent ? values?.district : values?.p_district,
      stateUt: isSameAsPresent ? values?.stateUt : values?.p_stateUt,
      residencyType: isSameAsPresent
        ? values?.residencyType
        : values?.p_residencyType,
      pinCode: isSameAsPresent ? values?.pinCode : values?.p_pinCode,
    },
    sameAsPresent: isSameAsPresent,
    identityDetails: getIdentityDetails(identity) || [],
    media: media || [],
    contactDetails: [
      {
        phoneNumber: values?.phoneNumber,
        emailId: values?.emailId,
      },
    ],
  };
};

export const updatePersonDetails = (values, identity, media = [], personId) => {
  const isSameAsPresent = !(
    isUndefined(values?.sameAsPresent) || values?.sameAsPresent === false
  );
  return {
    _id: personId,
    personalDetails: {
      name: values?.name,
      surname: values?.surname,
      designation: values?.designation,
      placeOfWork: values?.placeOfWork,
      alias: values?.aliasName,
      relationType: values?.relationType,
      fatherHusbandGuardianName: values?.fatherHusbandGuardianName,
      gender: values?.gender,
      isDied: values?.isDied,
      dateOfBirth: values?.dateOfBirth,
      age: values?.age,
      occupation: values?.occupation,
      educationQualification: values?.educationQualification,
      caste: values?.caste,
      subCaste: values?.subCaste,
      religion: values?.religion,
      nationality: values?.nationality,
    },
    presentAddress: {
      houseNo: values?.houseNo,
      streetRoadNo: values?.streetRoadNo,
      wardColony: values?.wardColony,
      landmarkMilestone: values?.landmarkMilestone,
      localityVillage: values?.localityVillage,
      areaMandal: values?.areaMandal,
      district: values?.district,
      stateUt: values?.stateUt,
      residencyType: values?.residencyType,
      pinCode: values?.pinCode,
    },
    permanentAddress: {
      houseNo: isSameAsPresent ? values?.houseNo : values?.p_houseNo,
      streetRoadNo: isSameAsPresent
        ? values?.streetRoadNo
        : values?.p_streetRoadNo,
      wardColony: isSameAsPresent ? values?.wardColony : values?.p_wardColony,
      landmarkMilestone: isSameAsPresent
        ? values?.landmarkMilestone
        : values?.p_landmarkMilestone,
      localityVillage: isSameAsPresent
        ? values?.localityVillage
        : values?.p_localityVillage,
      areaMandal: isSameAsPresent ? values?.areaMandal : values?.p_areaMandal,
      district: isSameAsPresent ? values?.district : values?.p_district,
      stateUt: isSameAsPresent ? values?.stateUt : values?.p_stateUt,
      residencyType: isSameAsPresent
        ? values?.residencyType
        : values?.p_residencyType,
      pinCode: isSameAsPresent ? values?.pinCode : values?.p_pinCode,
    },
    sameAsPresent: isSameAsPresent,
    identityDetails: getIdentityDetails(identity) || [],
    media: media || [],
    contactDetails: [
      {
        phoneNumber: values?.phoneNumber,
        emailId: values?.emailId,
      },
    ],
  };
};

export const getAddPersonFormValues = (person) => {
  const {
    personalDetails,
    presentAddress,
    dateCreated,
    _id,
    contactDetails,
    sameAsPresent,
    permanentAddress,
  } = person;
  const {
    name,
    surname,
    alias,
    gender,
    dateOfBirth,
    age,
    occupation,
    educationQualification,
    caste,
    subCaste,
    religion,
    nationality,
    fatherHusbandGuardianName,
    relationType,
  } = !isUndefined(personalDetails) && personalDetails;
  const {
    houseNo,
    streetRoadNo,
    wardColony,
    landmarkMilestone,
    localityVillage,
    areaMandal,
    district,
    stateUt,
    residencyType,
    pinCode,
  } = !isUndefined(presentAddress) && presentAddress;
  return {
    lastupdateddatetime: moment(new Date(dateCreated)).isValid()
      ? moment(new Date(dateCreated))
      : "",
    id: _id,
    name: name,
    surname: surname,
    aliasName: alias,
    relationType: relationType,
    fatherHusbandGuardianName: fatherHusbandGuardianName,
    gender: gender,
    dateOfBirth: moment(new Date(dateOfBirth)).isValid()
      ? moment(new Date(dateOfBirth))
      : "",
    occupation: occupation,
    age: age,
    educationQualification: educationQualification,
    caste: caste,
    subCaste: subCaste,
    religion: religion,
    nationality: nationality,
    houseNo: houseNo,
    streetRoadNo: streetRoadNo,
    wardColony: wardColony,
    landmarkMilestone: landmarkMilestone,
    localityVillage: localityVillage,
    areaMandal: areaMandal,
    district: district,
    stateUt: stateUt,
    residencyType: residencyType,
    pinCode: pinCode,
    sameAsPresent: sameAsPresent,
    p_houseNo: permanentAddress?.houseNo,
    p_streetRoadNo: permanentAddress?.streetRoadNo,
    p_wardColony: permanentAddress?.wardColony,
    p_landmarkMilestone: permanentAddress?.landmarkMilestone,
    p_localityVillage: permanentAddress?.localityVillage,
    p_areaMandal: permanentAddress?.areaMandal,
    p_district: permanentAddress?.district,
    p_stateUt: permanentAddress?.stateUt,
    p_residencyType: permanentAddress?.residencyType,
    p_pinCode: permanentAddress?.pinCode,
    phoneNumber: contactDetails?.[0]?.phoneNumber,
    emailId: contactDetails?.[0]?.emailId,
  };
};

export const getWitnessStatementDetails = (
  values,
  professionalDetails,
  crimeId
) => {
  return {
    witnessCode: values.witnessCode,
    typeOfWitness: values.typeOfWitness,
    subTypeOfWitness: values.subTypeOfWitness,
    panchSubTypeOfWitness: values.panchSubTypeOfWitness,
    categoryOfWitness: values.categoryOfWitness,
    statementRecordedBy: values.statementRecordedBy,
    statementRecordedByOther: professionalDetails,
    placeOfRecordingStatement: values.recordedAtPlace,
    anyOtherPlace: values.anyOtherPlace,
    dateTimeofRecording: values.recordedOnDatetime,
    scribeIfPC: values.selectScribe,
    relationToVictim: values.relationToVictim,
    victim: values.selectVictim,
    strengthOfWitness: values.strengthOfWitness,
    uploadedStatement: "",
    crimeId: crimeId,
  };
};

export const dummyRequest = ({ _file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

export const masterDataType = {
  STATES: "STATES",
  JAILS: "JAILS",
  COURTS: "COURTS",
  RANK: "RANK",
  RELATION_TYPE: "RELATION_TYPE",
  MODE_OF_INTEMATION: "MODE_OF_INTEMATION",
  HIGH_COURT_DIRECTIONS: "HIGH_COURT_DIRECTIONS",
  STAFF: "STAFF",
  POLICE_CUSTODY_REASONS: "POLICE_CUSTODY_REASONS",
  PLACE_OF_RECORDINGS: "PLACE_OF_RECORDINGS",
  APPREHENSION: "APPREHENSION_TYPE",
  EFFORTS_TRACING: "EFFORTS_TRACING",
  UNITS: "UNITS",
  BODY_DISPOSAL: "BODY_DISPOSAL",
  EVIDENCE_COLLECTION: "EVIDENCE_COLLECTION",
  HOSPITALS: "HOSPITALS",
  VILLAGE: "VILLAGE",
  RESIDENCY_TYPE: "RESIDENCY_TYPE",
  DISTRICTS: "DISTRICTS",
  MANDAL: "MANDAL",
};

export const requestStatus = [{ label: "Issued" }, { label: "Rejected" }];

export const cricularRequestStatus = [
  { label: "Approved" },
  { label: "Rejected" },
];

export const courtOrders = [
  { label: "Remanded" },
  { label: "Released on Bail" },
];

export const natureOfDeath = [
  { label: "Accidental" },
  { label: "Culpable Homicide not amounting to murder" },
  { label: "Custodial Death" },
  { label: "Exchange of fire" },
  { label: "Homicidal" },
  { label: "Natural Death" },
  { label: "Suicidal" },
  { label: "Suspicious" },
];

export const DATE_FORMAT = "DD-MM-YYYY";
export const DATE_FORMAT_MM = "MM-DD-YYYY";
export const DATE_TIME_FORMAT = "DD-MM-YYYY HH:mm:ss";
export const DATE_TIME_FORMAT_WITHOUT_SECONDS = "DD-MM-YYYY HH:mm";
export const TIME_FORMAT = "HH:mm:ss";
export const DATE_YY_MM_DD = "YYYY-MM-DD";

export const renderFieldsWithDropDown = (
  menuOptions,
  selectAction,
  handleSearch,
  serchText,
  width = "",
  disabled = false,
  name,
  placeholder = "",
  onClear
) => {
  return (
    <Select
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      allowClear
      onSearch={handleSearch}
      filterOption={(input, option) =>
        serchText &&
        option.props.label
          .toString()
          .toLowerCase()
          .indexOf(input.toString().toLowerCase()) >= 0
      }
      style={{ width: width || 150 }}
      onSelect={(item) => {
        selectAction && selectAction(item);
      }}
      disabled={disabled}
      placeholder={placeholder}
      onClear={(item) => onClear && onClear(item)}
    >
      {isArray(menuOptions) && name === "district"
        ? menuOptions.map((item, index) => (
            <Option key={index} value={item} label={item}>
              {item}
            </Option>
          ))
        : isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
    </Select>
  );
};

export const renderFieldsWithMultipleDropDownPanchWitness = (
  menuOptions,
  selectAction,
  handleSearch,
  serchText,
  width = "",
  disabled = false
) => {
  return (
    <Select
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      allowClear
      mode="multiple"
      showArrow
      onSearch={handleSearch}
      onChange={(item) => {
        selectAction && selectAction(item);
      }}
      filterOption={(input, option) =>
        serchText &&
        option.props.label
          .toString()
          .toLowerCase()
          .indexOf(input.toString().toLowerCase()) >= 0
      }
      style={{ width: width || 150 }}
      disabled={disabled}
    >
      {isArray(menuOptions) &&
        menuOptions.map((item, index) => (
          <Option key={index} value={item._id} label={item.label}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
};

export const renderFieldsWithMultipleDropDown = (
  menuOptions,
  selectAction,
  handleSearch,
  serchText,
  width = "",
  disabled = false
) => {
  return (
    <Select
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      allowClear
      mode="multiple"
      showArrow
      onSearch={handleSearch}
      onChange={(item) => {
        selectAction && selectAction(item);
      }}
      filterOption={(input, option) =>
        serchText &&
        option.props.label
          .toString()
          .toLowerCase()
          .indexOf(input.toString().toLowerCase()) >= 0
      }
      style={{ width: width || 150 }}
      disabled={disabled}
    >
      {isArray(menuOptions) &&
        menuOptions.map((item, index) => (
          <Option key={index} value={item.label} label={item.label}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
};

export const getAccuseds = (accusedList) => {
  let list = [];
  accusedList &&
    accusedList.length > 0 &&
    accusedList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name || ""} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        shortAddress: shortAddress(person?.presentAddress),
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        stageOfCase: item?.stageOfCase,
        status: item?.status,
        userDate: item?.userDate,
        approvalFromSrOfficer: item?.approvalFromSrOfficer,
        accusedCode: item.accusedCode,
        mediaDetails: person?.media,
        isSuspectOrAccused: item?.isSuspectOrAccused,
        is41ACRPC: item?.is41ACRPC,
        isArrestByPolice: item?.isArrestByPolice,
        isArrestRelated: item?.isArrestRelated,
        dateOfIssue41CRPC: item?.dateOfIssue41CRPC,
      };
      if (item?.accusedCode && !item?.isAbsconding) {
        list.push(result);
      }
    });
  return list;
};

export const getAbscondingAccuseds = (accusedList) => {
  let list = [];
  accusedList &&
    accusedList.length > 0 &&
    accusedList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name || ""} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        shortAddress: shortAddress(person?.presentAddress),
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        stageOfCase: item?.stageOfCase,
        status: item?.status,
        userDate: item?.userDate,
        approvalFromSrOfficer: item?.approvalFromSrOfficer,
        accusedCode: item.accusedCode,
        mediaDetails: person?.media,
        isSuspectOrAccused: item?.isSuspectOrAccused,
        is41ACRPC: item?.is41ACRPC,
        isArrestByPolice: item?.isArrestByPolice,
        isArrestRelated: item?.isArrestRelated,
        dateOfIssue41CRPC: item?.dateOfIssue41CRPC,
      };
      if (item?.accusedCode) {
        list.push(result);
      }
    });
  return list;
};
export const getWitness = (witnessList) => {
  let list = [];
  witnessList &&
    witnessList.length > 0 &&
    witnessList.map((item) => {
      const { witnessId } = item;
      const result = {
        label: `${witnessId?.personalDetails?.name || ""} ${
          witnessId?.personalDetails?.surname || ""
        }`,
        _id: witnessId?._id,
        shortAddress: shortAddress(witnessId?.presentAddress),
        permanentAddress: witnessId?.permanentAddress,
        personalDetails: witnessId?.personalDetails,
        presentAddress: witnessId?.presentAddress,
        contactDetails: witnessId?.contactDetails,
        stageOfCase: item?.stageOfCase,
        status: item?.status,
        userDate: item?.userDate,
        approvalFromSrOfficer: item?.approvalFromSrOfficer,
        witnessCode: item?.statementDetails?.witnessCode,
      };
      list.push(result);
    });
  return list;
};

export const getDeceased = (deceasedList) => {
  let list = [];
  deceasedList &&
    deceasedList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name || ""} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        shortAddress: shortAddress(person?.presentAddress),
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        stageOfCase: item?.stageOfCase,
        status: item?.status,
        userDate: item?.userDate,
        approvalFromSrOfficer: item?.approvalFromSrOfficer,
        accusedCode: item.accusedCode,
      };
      if (!isNull(person)) {
        list.push(result);
      }
    });
  const filterData = list.filter((s) => s.label !== " ");
  return uniqBy(filterData, "label");
};

export const getAccusedsAll = (accusedList) => {
  let list = [];
  accusedList &&
    accusedList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name || ""} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        shortAddress: shortAddress(person?.presentAddress),
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        stageOfCase: item?.stageOfCase,
        status: item?.status,
        userDate: item?.userDate,
        approvalFromSrOfficer: item?.approvalFromSrOfficer,
        accusedCode: item.accusedCode,
      };
      if (!isNull(person)) {
        list.push(result);
      }
    });
  return list;
};

export const accusedLists = (accusedList) =>
  !isEmpty(accusedList) &&
  accusedList.filter(
    (item) => item.isSuspectOrAccused === "Accused" && !item?.isDied
  );

export const allAccusedCCLLists = (accusedList) =>
  !isEmpty(accusedList) &&
  accusedList.filter(
    (item) =>
      !item?.isDied &&
      (item.isSuspectOrAccused === "Accused" ||
        item.isSuspectOrAccused === "CCL")
  );

export const allAccusedLists = (accusedList) =>
  !isEmpty(accusedList) &&
  accusedList.filter(
    (item) =>
      item.isSuspectOrAccused === "Accused" ||
      item.isSuspectOrAccused === "Known"
  );

export const accusedListDropDown = (accusedList) =>
  !isEmpty(accusedList) &&
  accusedList.filter(
    (item) =>
      (item.isSuspectOrAccused === "Accused" ||
        item.isSuspectOrAccused === "Known") &&
      !item?.isDied
  );

export const cclListDropDown = (accusedList) =>
  !isEmpty(accusedList) &&
  accusedList.filter(
    (item) => item.isSuspectOrAccused === "CCL" && !item?.isDied
  );

export const getApprehensionMinorAccuseds = (accusedList) => {
  let list = [];
  accusedList &&
    !isEmpty(accusedList) &&
    accusedList.map((item) => {
      const { accusedId } = item;
      const result = {
        label: `${accusedId?.personalDetails?.name || ""} ${
          accusedId?.personalDetails?.surname || ""
        }`,
        _id: accusedId?._id,
        permanentAddress: accusedId?.permanentAddress,
        personalDetails: accusedId?.personalDetails,
        presentAddress: accusedId?.presentAddress,
        contactDetails: accusedId?.contactDetails,
        accusedCode: item?.cclCode,
      };
      list.push(result);
    });
  return list;
};

export const getDate = (date) => moment(date).format(DATE_FORMAT_MM);

export const getRemandedAccused = (remandReportList) => {
  let list = [];
  remandReportList &&
    remandReportList.map((item) => {
      const { accusedId } = item;
      const result = {
        label: `${accusedId?.personalDetails?.name || ""} ${
          accusedId?.personalDetails?.surname || ""
        }`,
        _id: accusedId?._id,
        remandID: item?.remandID || "",
        permanentAddress: accusedId?.permanentAddress,
        personalDetails: accusedId?.personalDetails,
        presentAddress: accusedId?.presentAddress,
        contactDetails: accusedId?.contactDetails,
        accusedCode: item?.accusedCode,
        remandedUTNumber: item?.remandedUTNumber || "",
      };
      list.push(result);
    });
  return list;
};

export const getRemandedAccusedForExtensions = (remandReportList) => {
  let list = [];
  remandReportList &&
    remandReportList.map((item) => {
      const { accusedId } = item;
      accusedId &&
        !isEmpty(accusedId) &&
        !isUndefined(accusedId) &&
        accusedId.map((data) => {
          const result = {
            label: `${data?.personalDetails?.name || ""} ${
              data?.personalDetails?.surname || ""
            }`,
            _id: data?._id,
            remandID: item?.remandID || "",
            permanentAddress: data?.permanentAddress,
            personalDetails: data?.personalDetails,
            presentAddress: data?.presentAddress,
            contactDetails: data?.contactDetails,
            accusedCode: item?.accusedCode,
            remandedUTNumber: item?.remandedUTNumber || "",
          };
          list.push(result);
        });
    });
  return list;
};

export const getWitnessDetails = (witnessList) => {
  let list = [];
  witnessList &&
    witnessList.map((item) => {
      const { person } = item;
      const result = {
        label: `${person?.personalDetails?.name || ""} ${
          person?.personalDetails?.surname || ""
        }`,
        _id: person?._id,
        permanentAddress: person?.permanentAddress,
        personalDetails: person?.personalDetails,
        presentAddress: person?.presentAddress,
        contactDetails: person?.contactDetails,
        witnessCode: item.witnessCode,
      };
      list.push(result);
    });
  return list;
};

export const placeOfIncident = (items) => {
  let list = [];
  isArray(items) &&
    !isEmpty(items) &&
    items.map((s) => {
      const result = {
        label: s.Area,
        _id: s._id,
      };
      list.push(result);
    });
  return list;
};

export const getStaffsDetails = (staffList) => {
  let result = [];
  staffList.map((s) => {
    if (!result?.some((item) => item?.paoCode === s.paoCode)) {
      const data = {
        label: s.employeeName,
        mobileNo: s.mobileNo,
        paoCode: s.paoCode,
        rankName: s.rankName,
        unitName: s.unitName,
      };
      result.push(data);
    }
  });
  return result;
};

export const shortAddress = (address) => {
  let result = "";
  const houseNo = address?.houseNo ? address?.houseNo + "," : "";
  const street = address?.streetRoadNo ? address?.streetRoadNo + "," : "";
  const ward = address?.wardColony ? address?.wardColony : "";
  result = `${houseNo} ${street} ${ward}`;
  return result;
};

export const shortLocationAddress = (address) => {
  let result = "";
  const houseNo = address?.houseNo ? address?.houseNo + "," : "";
  const street = address?.street ? address?.street + "," : "";
  const ward = address?.ward ? address?.ward : "";
  result = `${houseNo} ${street} ${ward}`;
  return result;
};

export const categoryList = [];

export const folderName = {
  CRIME_SCENE_PHOTOGRAPH: "CrimeScenePhotographs",
  ROUGH_SKETCH: "RoughSketch",
  WITNESS_DETAILS: "WitnessDetails",
  EXPERT_TEAM_DETAILS: "ExpertTeamDetails",
  MATERIAL_OBJECTS: "MaterialObjects",
  INQUEST: "Inquest",
  DEFENSE_WITNESS_STATEMENT: "DefenseWitnessStatement",
  CONFESSIONAL_STATEMENTS: "ConfessionalStatements",
  POSTMORTEM_EXAMINATION: "PostmortemExamination",
  EXHUMATION: "Exhumation",
  CRPC_NOTICE41A: "CRPCNotice41A",
  PT_WARRANT: "PTWarrant",
  APPREHENSION_REPORT: "ApprehensionReport",
  JUVENILE_APPREHENSION: "JuvenileApprehension",
  BAIL_OPPOSITIONS: "BailOppositions",
  ARREST_BY_POLICE: "ArrestByPolice",
  POLICE_CUSTODY: "PoliceCustody",
  WITNESS_STATEMENT: "WitnessStatement",
  TIP_ACCUSED: "TipAccused",
  TIP_ARTICLES: "TipArticles",
  PP_OPINION: "PPOpinion",
  NOTICE_TO_COMPLAINANT: "NoticeToComplainant",
  LOOKOUT_NOTICE: "LookoutNotice",
  PRINT_MEDIA: "PrintAndElectronicMedia",
  FRIENDS_AND_RELATIVES: "FriendsAndRelatives",
  MO_CRIMINAL: "MOCriminal",
  TEAM_SENT_OUT: "TeamSentOutOfStation",
  HOT_SPOT_VERIFICATION: "VerificationOfHotspots",
  REWARDS_DECLARED: "RewardsDeclared",
  PROCECUTION_PERMISSION: "ProsecutionPermission",
  SCIENTIFIC_EVIDENCE: "ScientificEvidence",
  DIGITAL_EVIDENCE: "DigitalEvidence",
  REOPENING_OF_CASE: "ReopeningOfCase",
  FIR: "NewFir",
  CHARGESHEET: "Chargesheet",
  CRIMESCENE: "CrimeScene",
  STOLENPROPERTY: "StolenProperty",
  FINALREPORT: "FinalReport",
  CRPC_164: "CRPC_164",
  ACCUSED_DETAILS: "AccusedDetails",
};

export const camelizeText = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};

export const onFileChange = (info, setFileList) => {
  let fileList = [...info.fileList];

  fileList = fileList.map((file) => {
    if (file.response) {
      file.url = file.response.url;
    }
    return file;
  });
  setFileList(fileList);
};

export const getMediaPayload = (data, selectedCategory) => {
  let formMedia = [];
  data.map((s) => {
    const result = {
      category: selectedCategory,
      mimeType: s?.mimeType || "",
      name: s?.name || "",
      url: s?.url || "",
      fileId: s?.id || "",
    };
    formMedia.push(result);
  });
  return formMedia;
};

export const getMediaPayloadWithoutCategory = (data) => {
  let formMedia = [];
  data.map((s) => {
    const result = {
      mimeType: s?.mimeType || "",
      name: s?.name || "",
      url: s?.url || "",
      fileId: s?.id || "",
    };
    formMedia.push(result);
  });
  return formMedia;
};

export const getFilePayload = (data) => {
  return {
    mimeType: data?.mimeType || "",
    name: data?.name || "",
    url: data?.url || "",
    fileId: data?.id || "",
  };
};

export const getMediaUploadError = (err, openNotificationWithIcon) => {
  if (err && err?.response?.status === 400) {
    const errorDetails = JSON.parse(err.response?.data?.error.description);
    const errorKey = errorDetails?.error?.errorKey;
    openNotificationWithIcon("error", errorKey);
  }
};

// Generate and download templates based on dynamic data
export const exportGeneratedReportToDoc = (fileName = "") => {
  if (!window.Blob) {
    alert("Your legacy browser does not support this action.");
    return;
  }
  const crimeId = loadState("selectedFir");
  const firNum = crimeId?.firNum;
  const preHtml =
    "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
  const postHtml = "</body></html>";
  const html = preHtml + document.getElementById(fileName).innerHTML + postHtml;
  if (!isEmpty(html)) {
    const footer = "</body></html>";
    const htmlContent = html + footer;
    const url =
      "data:application/vnd.ms-word;charset=utf-8," +
      encodeURIComponent(htmlContent);
    fileName = fileName
      ? `${firNum.replace("/", "-")}-${fileName}.doc`
      : "document.doc";
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } else {
    console.log("Templates are not available");
  }
};

export const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

export const getPersonPersonalDetails = (data) => {
  let result = "";
  const name = data?.name ? data?.name : "";
  const surname = data?.surname ? data?.surname + "," : "";
  const occupation = data?.occupation ? data?.occupation + "," : "";
  const gender = data?.gender ? data?.gender + "," : "";
  const dateOfBirth = data?.dateOfBirth
    ? `${moment().diff(data?.dateOfBirth, "years")} Years, `
    : "";
  const ageDetails = data?.age ? `${data?.age} Years,` : dateOfBirth;
  result = `${name} ${surname} ${occupation} ${gender} ${ageDetails}`;
  return result;
};

export const getPersonPersonalAddress = (data) => {
  let result = "";
  const houseNo = data?.houseNo ? data?.houseNo + "," : "";
  const street = data?.streetRoadNo ? data?.streetRoadNo + "," : "";
  const ward = data?.wardColony ? data?.wardColony + "," : "";
  const stateUt = data?.stateUt ? data?.stateUt + "," : "";
  const pinCode = data?.pinCode ? data?.pinCode : "";
  const areaMandal = data?.areaMandal ? data?.areaMandal + "," : "";
  const localityVillage = data?.localityVillage
    ? data?.localityVillage + ","
    : "";
  const district = data?.district ? data?.district + "," : "";
  const landmarkMilestone = data?.landmarkMilestone
    ? data?.landmarkMilestone + ","
    : "";
  result = `${houseNo} ${street} ${landmarkMilestone} ${ward} ${localityVillage} ${areaMandal} ${district} ${stateUt} ${pinCode}`;
  return result;
};

export const getPersonShortAddress = (data) => {
  let result = "";
  const address1 = data?.address1 ? data?.address1 + "," : "";
  const address2 = data?.address2 ? data?.address2 + "," : "";
  const city = data?.city ? data?.city + "," : "";
  const pincode = data?.pincode ? data?.pincode : "";
  const landmark = data?.landmark ? data?.landmark + "," : "";
  result = `${address1} ${address2} ${city} ${landmark} ${pincode}`;
  return result;
};

export const getPersonAddressTemplate = (data) => {
  let result = "";
  const houseNo = data?.houseNo ? data?.houseNo + "," : "";
  const street = data?.streetRoadNo ? data?.streetRoadNo + "," : "";
  const ward = data?.wardColony ? data?.wardColony : "";
  const stateUt = data?.stateUt ? data?.stateUt : "";
  const pinCode = data?.pinCode ? data?.pinCode : "";
  const areaMandal = data?.areaMandal ? data?.areaMandal : "";
  const localityVillage = data?.localityVillage ? data?.localityVillage : "";
  const district = data?.district ? data?.district : "";
  const landmarkMilestone = data?.landmarkMilestone
    ? data?.landmarkMilestone
    : "";
  result = `${houseNo} ${street} ${landmarkMilestone} ${ward} ${localityVillage} ${areaMandal} ${district} ${stateUt} ${pinCode}`;
  return result;
};

export const getPlaceOfOccurrence = (data, date) => {
  let result = "";
  const dateResult = date ? moment(date).format(DATE_TIME_FORMAT) + "," : "";
  const houseNo = data?.houseNo ? data?.houseNo + "," : "";
  const landmarkMilestone = data?.landmarkMilestone
    ? data?.landmarkMilestone + ","
    : "";
  const ward = data?.wardColony ? data?.wardColony + "," : "";
  const street = data?.streetRoadNo ? data?.streetRoadNo + "," : "";
  const areaMandal = data?.areaMandal ? data?.areaMandal : "";
  result = `${dateResult} ${houseNo} ${landmarkMilestone} ${ward} ${street} ${areaMandal}`;
  return result;
};

export const getSavedDataResult = (
  data,
  personalDetails,
  presentAddress,
  formMedia
) => {
  const personalData = !isUndefined(personalDetails) && personalDetails;
  const personalAddress = !isUndefined(presentAddress) && presentAddress;
  const fatherName =
    personalData?.relationType &&
    (personalData?.relationType === "Father" ||
      personalData?.relationType === "Mother")
      ? personalData?.fatherHusbandGuardianName
      : "";
  const codeName = data?.isSuspectOrAccused === "CCL" ? "CCL" : "A";
  return {
    selectedRecord: data,
    accusedCodeNumber:
      data?.accusedCode && parseInt(data?.accusedCode?.replace(codeName, "")),
    mediaDetails: formMedia,
    personalDetails: getPersonPersonalDetails(personalData),
    fatherName: fatherName || "",
    personAddress: getPersonPersonalAddress(personalAddress),
    dateOfArrest: "",
    actions: "",
  };
};

export const tattosMarkList = [
  { label: "ABDOMEN" },
  { label: "ANCKLE" },
  { label: "ARM" },
  { label: "BACK" },
  { label: "BACK LEFT SIDE" },
  { label: "BACK RIGHT SIDE" },
  { label: "BUTTOCKS" },
  { label: "CHEEK LEFT" },
  { label: "CHEEK RIGHT" },
  { label: "CHEEKS" },
  { label: "CHEST" },
  { label: "CHEST LEFT SIDE" },
  { label: "CHEST MIDDLE" },
  { label: "CHEST RIGHT SIDE" },
  { label: "CHIN" },
  { label: "EAR" },
  { label: "EAR LEFT" },
  { label: "EAT RIGHT" },
  { label: "ELBOW" },
  { label: "EYE" },
  { label: "EYEBROW LEFT" },
  { label: "EYEBROW RIGHT" },
  { label: "EYEBROWS" },
  { label: "FACE" },
  { label: "FINGERS LEFT FOOT" },
  { label: "FINGERS RIGHT FOOT" },
  { label: "FINGERS LEFT HAND" },
  { label: "FINGERS RIGHT HAND" },
  { label: "FOOT" },
  { label: "FOOT LEFT" },
  { label: "FOOT RIGHT" },
  { label: "FOREARM RIGHT-FIGURE" },
  { label: "FOREARM RIGHT-LETTER" },
  { label: "FOREHEAD" },
  { label: "HANDFINGER" },
  { label: "HAND LEFT" },
  { label: "HAND LEFT-FIGURE" },
  { label: "HAND LEFT-LETTER" },
  { label: "HAND RIGHT" },
  { label: "HEAD" },
  { label: "LEFT HAND" },
  { label: "LEFT LEG" },
  { label: "LEG FINGERS" },
  { label: "LEG LEFT" },
  { label: "LEG RIGHT" },
  { label: "LIP LOWER" },
  { label: "LIP UPPER" },
  { label: "LIPS" },
  { label: "NECK" },
  { label: "NIPPLE" },
  { label: "NOSE" },
  { label: "PALM" },
  { label: "PALM LEFT" },
  { label: "PALM RIGHT" },
  { label: "RIBS" },
  { label: "RIGHT HAND" },
  { label: "RIGHT LEG" },
  { label: "SHOULDER" },
  { label: "SHOULDER LEFT" },
  { label: "SHOULDER RIGHT" },
  { label: "SKULL" },
  { label: "STOMACH" },
  { label: "THIGH LEFT" },
  { label: "THIGH RIGHT" },
  { label: "THIGHS" },
  { label: "THROAT" },
  { label: "THUMB" },
  { label: "WAIST" },
  { label: "WRIST" },
  { label: "KNEES" },
  { label: "OTHERS" },
];

export const supportedAudioVideoList = [
  "video/mp4",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/avi",
  "video/mpeg",
  "audio/mpeg",
  "audio/vnd.dlna.adts",
  "audio/wav",
];

export const supportedVideoList = [
  "video/mp4",
  "video/quicktime",
  "video/x-ms-wmv",
  "video/avi",
  "video/mpeg",
];

export const getDaysOfWeeks = [
  { label: "Monday" },
  { label: "Tuesday" },
  { label: "Wednesday" },
  { label: "Thursday" },
  { label: "Friday" },
  { label: "Saturday" },
  { label: "Sunday" },
];

const getRelationType = (relationType, gender) => {
  if (relationType === "Father" && gender === "Male") {
    return "s/o";
  } else if (relationType === "Father" && gender === "Female") {
    return "d/o";
  } else if (relationType === "Guardian" && gender !== "") {
    return "c/o";
  } else if (relationType === "Husband" && gender !== "") {
    return "w/o";
  } else {
    return relationType;
  }
};

export const getPersonPersonalDetailsPrint = (data) => {
  let result = "";
  const alias = data?.alias ? ` ${data?.alias}.` : "";
  const name = data?.name ? data?.name : "";
  const surname = data?.surname ? data?.surname + "," : "";
  const relationType = data?.relationType
    ? getRelationType(data?.relationType, data?.gender)
    : "";
  const fatherHusbandGuardianName = data?.fatherHusbandGuardianName
    ? data?.fatherHusbandGuardianName + ","
    : "";
  const occupation = data?.occupation ? `occ: ${data?.occupation},` : "";
  const gender = data?.gender ? data?.gender + "," : "";
  const caste = data?.caste ? `caste: ${data?.caste},` : "";
  const dateOfBirth = data?.dateOfBirth
    ? `aged ${moment().diff(data?.dateOfBirth, "years")} Years, `
    : "";
  const ageDetails = data?.age ? `aged ${data?.age} Years,` : dateOfBirth;
  result = `${name} ${surname} ${alias} ${relationType} ${fatherHusbandGuardianName} ${gender} ${ageDetails} ${occupation} ${caste}`;
  return result;
};

export const getPersonNamesPrint = (data) => {
  let result = "";
  const alias = data?.alias ? ` ${data?.alias}.` : "";
  const name = data?.name ? data?.name : "";
  const surname = data?.surname ? data?.surname + "," : "";
  result = `${name} ${surname} ${alias}`;
  return result;
};

export const getPersonPersonalAddressPrint = (data) => {
  let result = "";
  const houseNo = data?.houseNo ? `H.No: ${data?.houseNo},` : "";
  const street = data?.streetRoadNo ? data?.streetRoadNo + "," : "";
  const landmarkMilestone = data?.landmarkMilestone
    ? data?.landmarkMilestone + ","
    : "";
  const ward = data?.wardColony ? data?.wardColony + "," : "";
  const localityVillage = data?.localityVillage
    ? data?.localityVillage + ","
    : "";
  const areaMandal = data?.areaMandal ? data?.areaMandal + "," : "";
  const district = data?.district ? data?.district + "," : "";
  const stateUt = data?.stateUt ? data?.stateUt + "," : "";
  const pinCode = data?.pinCode ? `${data?.pinCode}.` : "";
  result = data
    ? ` R/O ${houseNo} ${street} ${landmarkMilestone}  ${ward} ${localityVillage} ${areaMandal} ${district} ${stateUt} ${pinCode}`
    : "";
  return result;
};

export const getPersonPermanentAddressPrint = (data) => {
  let result = "";
  const houseNo = data?.houseNo ? `H.No: ${data?.houseNo},` : "";
  const street = data?.streetRoadNo ? data?.streetRoadNo + "," : "";
  const landmarkMilestone = data?.landmarkMilestone
    ? data?.landmarkMilestone + ","
    : "";
  const ward = data?.wardColony ? data?.wardColony + "," : "";
  const localityVillage = data?.localityVillage
    ? data?.localityVillage + ","
    : "";
  const areaMandal = data?.areaMandal ? data?.areaMandal + "," : "";
  const district = data?.district ? data?.district + "," : "";
  const stateUt = data?.stateUt ? data?.stateUt + "," : "";
  const pinCode = data?.pinCode ? `${data?.pinCode}.` : "";
  result = data
    ? `, N/O ${houseNo} ${street} ${landmarkMilestone} ${ward} ${localityVillage} ${areaMandal} ${district} ${stateUt} ${pinCode}`
    : "";
  return result;
};

export const getStateNames = (statesNameList) => {
  let result = [];
  !isUndefined(statesNameList) &&
    !isEmpty(statesNameList) &&
    statesNameList.map((x) => {
      const data = {
        label: x.STATE && upperCase(x.STATE),
        stateCode: x.STATE_CD,
        _id: x._id,
      };
      result.push(data);
    });
  return uniqBy(result, "label");
};

export const getDistrictsNames = (stateDistrictList) => {
  let result = [];
  stateDistrictList &&
    isArray(stateDistrictList) &&
    !isUndefined(stateDistrictList) &&
    !isEmpty(stateDistrictList) &&
    stateDistrictList.map((x) => {
      const data = {
        label: x,
      };
      result.push(data);
    });
  return uniqBy(result, "label");
};

export const getDistrictsWithStatesNames = (stateDistrictList) => {
  let result = [];
  !isUndefined(stateDistrictList) &&
    !isEmpty(stateDistrictList) &&
    stateDistrictList.map((x) => {
      const data = {
        label: x.DISTRICT,
        districtCode: x.DISTRICT_CD,
        stateCode: x.STATE_CD,
        _id: x._id,
      };
      result.push(data);
    });
  return result;
};

export const getMandalNames = (dataList) => {
  let result = [];
  !isUndefined(dataList) &&
    !isEmpty(dataList) &&
    dataList.map((x) => {
      const data = {
        label: x.revenueMandal === null ? "" : x.revenueMandal,
        revenueMandal: x.revenueMandal,
        village: x.village,
        pincode: x.pincode,
        _id: x._id,
      };
      result.push(data);
    });
  return uniqBy(result, "label");
};

export const getPincodeList = (dataList) => {
  let result = [];
  !isUndefined(dataList) &&
    !isEmpty(dataList) &&
    dataList.map((x) => {
      const data = {
        label: x.PINCODE,
        state: x.STATE,
        _id: x._id,
      };
      result.push(data);
    });
  return uniqBy(result, "label");
};

export const getVillageList = (dataList) => {
  let result = [];
  !isUndefined(dataList) &&
    !isEmpty(dataList) &&
    dataList.map((x) => {
      const data = {
        label: x.VILLAGE,
        state: x.STATE,
        _id: x._id,
      };
      result.push(data);
    });
  return uniqBy(result, "label");
};
export const IS_SHO = "STATION HOUSE OFFICER (SHO)";
export const IS_DSP = "SDPO/ACP";
export const IS_CI = "CIRCLE INSPECTOR";
export const IS_SP = "SP (UNIT OFFICER)";
export const IS_IO = "RECEPTION";
export const IS_INVESTIGATION_OFFICER = "INVESTIGATION OFFICER";
export const IS_DGP = "DGP";

export const getAccusedStatus = (item) => {
  let status = "";
  let dateOfIssue41CRPC = "";
  //for multiple dates of 41acrps
  if (item?.datesOf41aprcIssue && item?.datesOf41aprcIssue.length > 0) {
    item?.datesOf41aprcIssue.forEach((ele) => {
      if (ele && moment(ele)) {
        dateOfIssue41CRPC += moment(ele).format("DD/MM/YYYY") + " , ";
      }
    });
    dateOfIssue41CRPC = dateOfIssue41CRPC.slice(0, -3);
  } else {
    dateOfIssue41CRPC = item?.dateOfIssue41CRPC
      ? moment(item?.dateOfIssue41CRPC).format("DD/MM/YYYY")
      : "";
  }
  if (
    item?.arrestType === arrestTypeOption.ARREST_BY_POLICE &&
    item?.isRemanded &&
    item?.isReleasedOnBail
  ) {
    status = "Arrest By Police and Remanded and released on bail";
  } else if (
    item?.arrestType === arrestTypeOption.ARREST_BY_POLICE &&
    item?.isRemanded
  ) {
    status = "Arrest By Police and Remanded";
  } else if (
    item?.arrestType === arrestTypeOption.ARREST_BY_POLICE &&
    ((!isUndefined(item?.arrestByPolice?.suretyDetails) &&
      item?.arrestByPolice?.suretyDetails.length > 0) ||
      item?.isReleasedOnBail)
  ) {
    status = "Arrest By Police and released on bail";
  } else if (
    item?.arrestType ===
      arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION &&
    item?.isRemanded
  ) {
    status = "Arrest on surrender in PS and Remanded";
  } else if (
    item?.arrestType ===
      arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION &&
    ((!isUndefined(item?.arrestOnSurrenderInPoliceStation?.suretyDetails) &&
      item?.arrestOnSurrenderInPoliceStation?.suretyDetails.length > 0) ||
      item.isReleasedOnBail)
  ) {
    status = "Arrest on surrender In PS and released on bail";
  } else if (
    item?.arrestType === arrestTypeOption.ARREST_BY_OTHER_POLICE &&
    item?.arrestByOtherPolice?.ptWarrantRegularized
  ) {
    status = "Arrest By other Police PT warrant regularized";
  } else if (
    item?.action === arrestOption.SURRENDER_IN_COURT &&
    item?.surrenderInCourt?.sendToJudicialCustody
  ) {
    status = "Surrendered in court and Remanded";
  } else if (
    item?.action === arrestOption.SURRENDER_IN_COURT &&
    item?.surrenderInCourt?.releasedOnBail
  ) {
    status = "Surrendered in court and released on bail";
  } else if (item?.action === arrestOption.SURRENDER_BEFORE_COURT) {
    status = "Surrendered in court on anticipatory and released on bail";
  } else if (
    item?.action === arrestOption.HIGH_COURT_DIRECTIONS &&
    item?.highCourtDirections?.highCourtDirection ===
      "Not To Arrest – Investigation May Go On"
  ) {
    status = item?.is41ACRPC
      ? `High court directions - ${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "High court directions - Not to arrest";
  } else if (
    item?.action === arrestOption.HIGH_COURT_DIRECTIONS &&
    item?.highCourtDirections?.highCourtDirection === "Quash Proceedings"
  ) {
    status = item?.is41ACRPC
      ? `High court directions - ${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "High court directions - Quash Proceedings";
  } else if (
    item?.action === arrestOption.HIGH_COURT_DIRECTIONS &&
    item?.highCourtDirections?.highCourtDirection ===
      "Not To Take Coercive Steps (Follow 41A Cr.P.C.)"
  ) {
    status = item?.is41ACRPC
      ? `High court directions - ${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "High court directions - Not To Take Coercive Steps";
  } else if (
    item?.action === arrestOption.HIGH_COURT_DIRECTIONS &&
    item?.highCourtDirections?.highCourtDirection ===
      "Stay All Further Proceedings"
  ) {
    status = item?.is41ACRPC
      ? `High court directions - ${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "High court directions - Stay";
  } else if (
    item?.action === arrestOption.HIGH_COURT_DIRECTIONS &&
    item?.highCourtDirections?.highCourtDirection ===
      "Follow 41A Cr.P.C. Procedure"
  ) {
    status = item?.is41ACRPC
      ? `High court directions - ${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "High court directions - Follow 41A Cr.P.C. Procedure";
  } else if (item?.is41ACRPC) {
    status = item?.is41ACRPC
      ? `${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "";
  } else if (item?.arrestType === arrestTypeOption.ARREST_BY_POLICE) {
    status = "Arrest By Police";
  } else if (item?.arrestType) {
    status = item?.arrestType || item?.action;
  } else if (item?.isAbsconding) {
    status = "Absconding";
  } else if (!item?.isAbsconding) {
    status = "Arrest Related/41A CrPC Pending";
  }
  return status;
};

export const getCCLStatus = (item) => {
  let status = "";
  let dateOfIssue41CRPC = "";
  if (item?.datesOf41aprcIssue && item?.datesOf41aprcIssue.length > 0) {
    item?.datesOf41aprcIssue.forEach((ele) => {
      if (ele && moment(ele)) {
        dateOfIssue41CRPC += moment(ele).format("DD/MM/YYYY") + " , ";
      }
    });
    dateOfIssue41CRPC = dateOfIssue41CRPC.slice(0, -3);
  } else {
    dateOfIssue41CRPC = item?.dateOfIssue41CRPC
      ? moment(item?.dateOfIssue41CRPC).format("DD/MM/YYYY")
      : "";
  }
  if (item?.is41ACRPC) {
    status = item?.is41ACRPC
      ? `${
          dateOfIssue41CRPC
            ? `41A Cr.P.C issued on ${dateOfIssue41CRPC}`
            : `41A Cr.P.C issued`
        }`
      : "";
  } else if (item?.isCCL && item?.isApprehensionReport) {
    status = "Apprehended and produced before JJB";
  } else if (item?.isCCL && item?.isCCLApprehensionAndSureties) {
    status = "Apprehended and relesed on bail";
  } else if (!!item?.typeOfApprehension || !!item?.arrestType) {
    if (item?.typeOfApprehension && item?.isAdmission) {
      status = "Apprehension By Police and Admission to Observation Home";
    } else if (
      item?.typeOfApprehension &&
      (item?.suretyDetails.length > 0 || item.isReleasedOnBail)
    ) {
      // status = item?.typeOfApprehension;
      status = "Apprehension By Police and released on Bail";
    } else if (item?.typeOfApprehension) {
      status = item?.typeOfApprehension;
    } else {
      if (!!item?.surrenderInCourt?.releasedOnBail) {
        status = "Surrendered in court and released on bail";
      } else if (
        item?.arrestType === "Surrender on Anticipatory Bail in Court"
      ) {
        status = "Surrendered in court on anticipatory and released on bail";
      } else {
        status = item?.arrestType;
      }
    }
  } else if (item?.isAbsconding) {
    status = "Absconding";
  } else if (!item?.isAbsconding) {
    status = "CCL Related/41A CrPC Pending";
  } else {
    status = item?.arrestType ? item?.arrestType : item?.action;
  }
  return status;
};

export const displayStatusDetails = (dispayStatus, isDied = false) => {
  let status = "";
  if (isUndefined(dispayStatus) && isDied) {
    status = (
      <span className="tableRowText wordWrap" style={{ fontWeight: "bold" }}>
        Died
      </span>
    );
  } else if (!isUndefined(dispayStatus) && isDied) {
    status = (
      <span className="tableRowText wordWrap">
        {dispayStatus} - <span style={{ fontWeight: "bold" }}>Died</span>
      </span>
    );
  } else {
    status = <span className="tableRowText wordWrap">{dispayStatus}</span>;
  }
  return status;
};

export const displayStatusDetailsAccused = (
  dispayStatus,
  isDied = false,
  accusedCode
) => {
  let status = "";
  if (isUndefined(dispayStatus) && isDied) {
    status = (
      <span className="tableRowText wordWrap" style={{ fontWeight: "bold" }}>
        Died
      </span>
    );
  } else if (!isUndefined(dispayStatus) && isDied) {
    status = (
      <span className="tableRowText wordWrap">
        {dispayStatus} - <span style={{ fontWeight: "bold" }}>Died</span>
      </span>
    );
  }
  // else if (!!dispayStatus === false) {
  //   status = <span className="tableRowText wordWrap">{"Absconding"}</span>;
  // }
  else if (dispayStatus) {
    status = <span className="tableRowText wordWrap">{dispayStatus}</span>;
  }
  return status;
};

export const getSectionsData = (data) => {
  return (
    !isEmpty(data) &&
    data.map((t, index) => {
      const res = t?.section.toString() + " " + t?.accShortName;
      return <div key={index}>{res.toString().replace(" undefined", "")}</div>;
    })
  );
};

export const getTemplatesSectionsData = (data) => {
  return (
    !isEmpty(data) &&
    data.map((t, index) => {
      const res = t?.section.toString() + " " + t?.accShortName;
      return (
        <>
          <span key={index}>{res.toString().replace(" undefined", "")}</span>
          {index !== data.length - 1 ? <span>{". "}</span> : " "}
        </>
      );
    })
  );
};

export const actDatalocal = (arg, actList) => {
  let RWRequired = "";
  const result = arg?.actsAndSections.reduce(
    (acc, { actDescription, section, rwRequired, accShortName }) => {
      if (rwRequired) {
        RWRequired = "r/w ";
      } else {
        RWRequired = "";
      }
      const namesWithGreeting = (arr) => {
        return arr.map((name) => RWRequired + name);
      };
      const actShortName = (arr) => {
        return arr.filter((item, _index) => item.ACT_LONG === actDescription);
      };
      accShortName = actShortName(actList);
      section = namesWithGreeting(section);
      acc[actDescription] = {
        actDescription: actDescription,
        accShortName: isUndefined(accShortName[0]?.ACT_SHORT)
          ? actDescription
          : accShortName[0]?.ACT_SHORT,
        section:
          typeof acc[actDescription] !== "undefined"
            ? acc[actDescription].section.concat(section)
            : section,
      };
      acc[actDescription].section = acc[actDescription].section.filter(
        (item, index) => acc[actDescription].section.indexOf(item) === index
      );
      return acc;
    },
    {}
  );
  let resp = Object.values(result);
  return {
    uniqActs: resp,
  };
};

const actShortName = (arr, actDescription) => {
  return arr.filter((item, _index) => item.ACT_LONG === actDescription);
};

export const actsSectionResult = (data, RWRequired, actListData) => {
  return (
    !isNull(data) &&
    !isUndefined(data) &&
    data.reduce(
      (acc, { actDescription, section, rwRequired, accShortName }) => {
        if (rwRequired) {
          RWRequired = "r/w ";
        } else {
          RWRequired = "";
        }
        const namesWithGreeting = (arr) => {
          return !isUndefined(arr) && arr.map((name) => RWRequired + name);
        };
        accShortName = actShortName(actListData, actDescription);
        section = namesWithGreeting(section);
        acc[actDescription] = {
          actDescription: actDescription,
          accShortName: isUndefined(accShortName[0]?.ACT_SHORT)
            ? actDescription
            : accShortName[0]?.ACT_SHORT,
          section:
            typeof acc[actDescription] !== "undefined"
              ? acc[actDescription]?.section &&
                acc[actDescription]?.section?.concat(section)
              : section,
        };
        acc[actDescription].section =
          acc[actDescription]?.section &&
          acc[actDescription]?.section.filter(
            (item, index) => acc[actDescription].section.indexOf(item) === index
          );
        return acc;
      },
      {}
    )
  );
};

export const showPSName = (psName) => {
  if (psName !== "" && !isUndefined(psName)) {
    return psName.split(" PS(")[0];
  }
};

export const getIONameAndRank = (briefFacts) => {
  return briefFacts?.ioAssignedRank
    ? `${briefFacts?.ioAssignedName}(${briefFacts?.ioAssignedRank})`
    : briefFacts?.ioAssignedName;
};

export const sortByNumber = (firNum1, firNum2) => {
  return parseInt(firNum1.split("/")[0]) - parseInt(firNum2.split("/")[0]);
};
