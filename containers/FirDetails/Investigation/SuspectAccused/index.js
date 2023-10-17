import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Divider,
  Form,
  Checkbox,
  DatePicker,
  notification,
  Button,
  Modal,
  Radio,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { disableFutureDates } from "@components/Common/helperMethods";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, isUndefined, isArray, isNull, first, orderBy } from "lodash";
import chargesheetActions from "@redux/investigations/chargesheet/actions";
import { config } from "@config/site.config";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import firActions from "@redux/fir/actions";
import StandardAccusedApprovalForm from "@components/Common/standardAccusedApprovalForm";
import Loader from "@components/utility/loader";
import {
  getPersonDetails,
  DATE_TIME_FORMAT,
  getSavedDataResult,
  renderFieldsWithDropDown,
  folderName,
  getMediaUploadError,
  getMediaPayload,
} from "@containers/FirDetails/fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import UploadForm from "@components/Common/uploadForm";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";
import { accusedCodes } from "./const";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import { SuspectAccusedWrapper } from "./styles";

const { confirm } = Modal;

const styles = {
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    marginTop: 20,
  },
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function SuspectAccused({
  setSelectedSiderMenu,
  hideRecords,
  viewRecord,
}) {
  const [suspectAccusedForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [addAnother, setAddAnother] = useState(false);
  const [formValid, SetFormValid] = useState(false);
  const [inputList, setInputList] = useState([]);
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [editSuspectAccusedObj, setEditSuspectAccused] = useState(null);
  const [viewSuspectAccused, setViewSuspectAccused] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [age, setAge] = useState("");
  const [isDied, setIsDied] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [resetFiles, setResetFiles] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("AccusedDetails");
  const [absconding, setAbsconding] = useState(false);
  const [uploadDeathCertificateUrl, setUploadDeathCertificateUrl] = useState(
    []
  );
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const { arrestList } = useSelector((state) => state.FIR);
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const { chargesheetList } = useSelector((state) => state.Chargesheet);
  const { getChargesheetList } = chargesheetActions;

  const [
    selectedUploadDeathCertificateUrl,
    setSelectedUploadDeathCertificateUrl,
  ] = useState([]);
  const isCCL = age && age < 18;
  const {
    actionType,
    successMessage,
    errorMessage,
    isFetching,
    suspectAccusedList,
  } = useSelector((state) => state.SuspectAccused);
  const {
    addAccusedDetails,
    updateAccusedDetails,
    getAccusedList,
    resetActionType,
  } = suspectAccusedAction;
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const { fetchArrest } = firActions;
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const isSuccess =
    actionType === "ADD_SUSPECT_ACCUSED_SUCCESS" ||
    actionType === "UPDATE_SUSPECT_ACCUSED_SUCCESS";

  const isError =
    actionType === "ADD_SUSPECT_ACCUSED_ERROR" ||
    actionType === "UPDATE_SUSPECT_ACCUSED_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(
      getJuvenileApprehensionList(
        `${config.cclApprehension}?crimeId=${crimeId}`
      )
    );
  }, [dispatch]);

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_SUSPECT_ACCUSED_SUCCESS"
        ? "Accused Created"
        : "Accused Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/accusedDetails",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Accused Details successfully updated" ||
        successMessage === "Accused Details successfully added"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        suspectAccusedForm.resetFields();
        setIsDied(false);
        setAge("");
        setInputFileList([]);
        setResetFiles(true);
        setEditSuspectAccused(null);
        fetchAccusedList();
        dispatch(resetActionType());
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchAccusedList();
    suspectAccusedForm.setFieldsValue({ isAbsconding: false });
    setAbsconding(false);
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  // Check whether accused is charged or not
  const chargedAccusedList =
    !isEmpty(chargesheetList) &&
    !isUndefined(chargesheetList) &&
    chargesheetList.filter((s) => s.isDraft === false);
  let chargedAccusedStatus = [];
  !isEmpty(chargedAccusedList) &&
    chargedAccusedList.map((s) => {
      const accusedParticulars =
        !isUndefined(s?.accusedParticulars) &&
        !isEmpty(s?.accusedParticulars) &&
        s?.accusedParticulars;
      const filteredChargedList =
        !isEmpty(accusedParticulars) &&
        accusedParticulars.filter(
          (accused) =>
            accused?.accusedPersonId?._id === editSuspectAccusedObj?.person?._id
        );
      if (!isEmpty(filteredChargedList) && !isNull(editSuspectAccusedObj)) {
        const result = {
          chargeStatus: first(filteredChargedList)?.chargeStatus,
          accusedPersonId: first(filteredChargedList)?.accusedPersonId?._id,
        };
        chargedAccusedStatus.push(result);
      }
    });

  const isAccusedCharged =
    !isEmpty(chargedAccusedStatus) &&
    !isNull(editSuspectAccusedObj) &&
    first(chargedAccusedStatus)?.accusedPersonId ===
      editSuspectAccusedObj?.person?._id;

  const handleEditSuspectAccused = (value) => {
    if (value) {
      dispatch(
        getChargesheetList(`${config.getChargeSheet}?crimeId=${crimeId}`)
      );
      setEditSuspectAccused(value);
      setAbsconding(value?.isAbsconding);
      const {
        person,
        isDied,
        stageOfCase,
        approvalFromSrOfficer,
        accusedCode,
        isSuspectOrAccused,
        userDate,
      } = value;
      const {
        personalDetails,
        presentAddress,
        _id,
        contactDetails,
        permanentAddress,
        sameAsPresent,
      } = !isUndefined(person) && person;

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
        relationType,
        fatherHusbandGuardianName,
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
      setSelectedState(stateUt);
      setIsDied(isDied);
      setSelectedPermanentState(permanentAddress?.stateUt);
      setPermanentAddress(sameAsPresent);
      const dob = moment(new Date(dateOfBirth)).isValid()
        ? moment(new Date(dateOfBirth))
        : "";
      if (dob !== "") {
        setAge(moment().diff(moment(dob, "DD/MM/YYYY"), "years"));
      } else {
        setAge(age);
      }
      if (value?.deathCertificate && value?.deathCertificate?.url !== "") {
        setSelectedUploadDeathCertificateUrl([
          {
            url: value?.deathCertificate?.url,
            name: value?.deathCertificate?.name,
            fileId: value?.deathCertificate?.fileId,
          },
        ]);
      } else {
        setSelectedUploadDeathCertificateUrl([]);
      }
      suspectAccusedForm.setFieldsValue({
        uploadDeathCertificate: value?.deathCertificate?.url,
        isSuspectOrAccused: isSuspectOrAccused,
        isAbsconding: value?.isAbsconding,
        id: _id,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        gender: gender,
        dateOfBirth: dob,
        age: age,
        occupation: occupation,
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
        phoneNumber: contactDetails[0]?.phoneNumber,
        emailId: contactDetails[0]?.emailId,
        userDate: moment(new Date(userDate)).isValid()
          ? moment(new Date(userDate))
          : "",
        isDied: isDied,
        stageOfCase: stageOfCase,
        approvalFromSrOfficer: approvalFromSrOfficer,
        accusedCode:
          accusedCode !== "" &&
          !isUndefined(accusedCode) &&
          !isNull(accusedCode)
            ? accusedCode.match(/\d+/)[0]
            : "",
      });
    }
  };

  useEffect(() => {
    if (viewRecord) {
      handleEditSuspectAccused(viewRecord);
      setViewSuspectAccused(true);
    }
  }, [viewRecord]);

  const checkFields = async () => {
    const values = await suspectAccusedForm.validateFields();
    SetFormValid(
      !Object.values(values).every(
        (v) => v == null || (typeof v === "string" && v.trim() === "")
      )
    );
  };

  const filterAccusedDetails =
    !isEmpty(suspectAccusedList) &&
    isArray(suspectAccusedList) &&
    suspectAccusedList.filter((s) => s.isSuspectOrAccused !== "No Accused");

  const getSavedData = () => {
    let savedData = [];
    Array.isArray(filterAccusedDetails) &&
      !isEmpty(filterAccusedDetails) &&
      filterAccusedDetails.map((data) => {
        const { personalDetails, presentAddress, media } =
          !isUndefined(data?.person) && !isNull(data?.person) && data?.person;

        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, media)
        );
      });
    const result =
      !isEmpty(savedData) && orderBy(savedData, ["accusedCodeNumber"]);
    return result;
  };

  const getAccusedCode = (val) => {
    let result = "";
    if (!isUndefined(val.accusedCode) && !isEmpty(val.accusedCode)) {
      result = isCCL ? `CCL${val.accusedCode}` : `A${val.accusedCode}`;
    } else {
      result = "";
    }
    return result;
  };

  const getAccusedDetails = (values, deathCertificate, mediaUpload) => {
    const accusedDetails = {
      lastupdateddatetime: Date.now(),
      isSuspectOrAccused: isCCL ? "CCL" : "Accused",
      isDied: values.isDied,
      isAbsconding: values.isAbsconding,
      stageOfCase: values.stageOfCase,
      approvalFromSrOfficer: values.approvalFromSrOfficer,
      deathCertificate: {
        url: deathCertificate?.url,
        name: deathCertificate?.name,
        type: deathCertificate?.mimeType,
        fileId: deathCertificate?.id,
      },
      accusedCode: getAccusedCode(values),
      status: editSuspectAccusedObj && editSuspectAccusedObj?.status,
      userDate: values.userDate,
      internalFlag: false,
      person: getPersonDetails(values, inputList, mediaUpload),
      dateOfIssue41CRPC: editSuspectAccusedObj?.dateOfIssue41CRPC
        ? editSuspectAccusedObj?.dateOfIssue41CRPC
        : "",
      is41ACRPC: editSuspectAccusedObj?.is41ACRPC
        ? editSuspectAccusedObj?.is41ACRPC
        : false,
      is41ACRPCExplainationSubmitted:
        editSuspectAccusedObj?.is41ACRPCExplainationSubmitted
          ? editSuspectAccusedObj?.is41ACRPCExplainationSubmitted
          : false,
      isApprehensionReport: editSuspectAccusedObj?.isApprehensionReport
        ? editSuspectAccusedObj?.isApprehensionReport
        : false,
      isCCL: editSuspectAccusedObj?.isCCL
        ? editSuspectAccusedObj?.isCCL
        : false,
    };

    return accusedDetails;
  };

  const dispatchAccusedDetails = (accusedId, payload) => {
    if (accusedId) {
      dispatch(updateAccusedDetails(config.updateAccusedDetails, payload));
    } else {
      dispatch(addAccusedDetails(config.addAccusedDetails, payload));
    }
  };

  const showConfirm = () => {
    confirm({
      title:
        "Age or Date of Birth field is mandatory for knowing whether he is Accused or CCL",
      icon: <ExclamationCircleOutlined />,
      width: 400,
    });
  };

  const submitAccusedDetails = async () => {
    const values = await suspectAccusedForm.validateFields();
    const isAccusedCode =
      !isUndefined(values?.accusedCode) && !isEmpty(values?.accusedCode);
    const isNotAge = isUndefined(values?.age) && isEmpty(values?.age);
    const isNotDateOfBirth =
      isUndefined(values?.dateOfBirth) && isEmpty(values?.dateOfBirth);
    if (isAccusedCode && (isNotAge || isNotDateOfBirth)) {
      showConfirm();
    } else {
      submit(values);
    }
  };

  const submit = (values) => {
    const uploadDeathCertificateData = new FormData();
    uploadDeathCertificateUrl.forEach((file) => {
      uploadDeathCertificateData.append("file", file.originFileObj);
    });
    uploadDeathCertificateData.append("prefixFolder", crimeId);
    uploadDeathCertificateData.append(
      "folderPath",
      `${crimeId}/${folderName.ACCUSED_DETAILS}/file`
    );
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append("folderPath", `${crimeId}/accusedDetails/media`);
    const existingMedia =
      !isUndefined(editSuspectAccusedObj?.person) &&
      !isEmpty(editSuspectAccusedObj?.person?.media)
        ? editSuspectAccusedObj?.person?.media
        : [];
    const savedDeathCertificateURL = editSuspectAccusedObj?.deathCertificate
      ? editSuspectAccusedObj?.deathCertificate
      : {};
    const accusedId = editSuspectAccusedObj?._id;
    if (!isEmpty(inputFileList) && !isEmpty(uploadDeathCertificateUrl)) {
      setIsFormUploading(true);
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, uploadDeathCertificateData),
          axios.post(`${config.fileUpload}/upload`, mediaFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              const { data } = data1.data;
              const mediaFormDataResult = data2.data?.data;
              const deathCertificate = first(data);
              const addAccusedDetailsPayload = {
                crimeId: crimeId,
                accusedDetails: getAccusedDetails(
                  values,
                  deathCertificate,
                  getMediaPayload(mediaFormDataResult, selectedCategory)
                ),
              };
              const updateAccusedDetailsPayload = {
                crimeId: crimeId,
                accusedId:
                  editSuspectAccusedObj && editSuspectAccusedObj?.person?._id,
                accusedDetails: getAccusedDetails(
                  values,
                  deathCertificate,
                  getMediaPayload(mediaFormDataResult, selectedCategory)
                ),
              };
              const payloadData = accusedId
                ? updateAccusedDetailsPayload
                : addAccusedDetailsPayload;
              dispatchAccusedDetails(accusedId, payloadData);
            }
            setIsFormUploading(false);
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (!isEmpty(uploadDeathCertificateUrl) && isEmpty(inputFileList)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, uploadDeathCertificateData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const deathCertificate = first(data);
            const addAccusedDetailsPayload = {
              crimeId: crimeId,
              accusedDetails: getAccusedDetails(
                values,
                deathCertificate,
                existingMedia
              ),
            };
            const updateAccusedDetailsPayload = {
              crimeId: crimeId,
              accusedId:
                editSuspectAccusedObj && editSuspectAccusedObj?.person?._id,
              accusedDetails: getAccusedDetails(
                values,
                deathCertificate,
                existingMedia
              ),
            };
            const payloadData = accusedId
              ? updateAccusedDetailsPayload
              : addAccusedDetailsPayload;
            dispatchAccusedDetails(accusedId, payloadData);
          }
          setIsFormUploading(false);
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadDeathCertificateUrl) && !isEmpty(inputFileList)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const mediaFormDataResult = res?.data?.data;
            const existingMediaResult = !isEmpty(existingMedia)
              ? [
                  ...existingMedia,
                  ...getMediaPayload(mediaFormDataResult, selectedCategory),
                ]
              : getMediaPayload(mediaFormDataResult, selectedCategory);
            const addAccusedDetailsPayload = {
              crimeId: crimeId,
              accusedDetails: getAccusedDetails(
                values,
                savedDeathCertificateURL,
                getMediaPayload(mediaFormDataResult, selectedCategory)
              ),
            };
            const updateAccusedDetailsPayload = {
              crimeId: crimeId,
              accusedId:
                editSuspectAccusedObj && editSuspectAccusedObj?.person?._id,
              accusedDetails: getAccusedDetails(
                values,
                savedDeathCertificateURL,
                existingMediaResult
              ),
            };
            const payloadData = accusedId
              ? updateAccusedDetailsPayload
              : addAccusedDetailsPayload;
            dispatchAccusedDetails(accusedId, payloadData);
          }
          setIsFormUploading(false);
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadDeathCertificateUrl) && isEmpty(inputFileList)) {
      setIsFormUploading(false);
      const addAccusedDetailsPayload = {
        crimeId: crimeId,
        accusedDetails: getAccusedDetails(
          values,
          savedDeathCertificateURL,
          existingMedia
        ),
      };
      const updateAccusedDetailsPayload = {
        crimeId: crimeId,
        accusedId: editSuspectAccusedObj && editSuspectAccusedObj?.person?._id,
        accusedDetails: getAccusedDetails(
          values,
          savedDeathCertificateURL,
          existingMedia
        ),
      };
      const payloadData = accusedId
        ? updateAccusedDetailsPayload
        : addAccusedDetailsPayload;
      dispatchAccusedDetails(accusedId, payloadData);
    }
  };

  const validationFields = {
    personalValidationFields: absconding
      ? ["Name", "Gender", "Age", "Nationality"]
      : [
          "Name",
          "Surname",
          "Caste",
          "Educational Qualification",
          "Gender",
          "Age",
          "Father/Spouse/Guardian/Mother Name",
          "Occupation",
        ],
    addressValidationFields: absconding
      ? ["State/UT", "District"]
      : [
          "House No",
          "Ward/Colony",
          "State/UT",
          "Area/Mandal",
          "Locality/Village",
          "Landmark/Milestone",
          "District",
        ],
    contactValidationFields: absconding ? [] : ["Phone Number"],
  };

  const displayAccusedSuspectOptions = () => (
    <Col>
      <div style={styles.widgetPageStyle}>
        <div style={{ paddingTop: 30, paddingRight: 10 }}>
          <label>
            <b>{isCCL ? "CCL" : "A"}</b>
          </label>
        </div>
        <div>
          <Form.Item
            name="accusedCode"
            label={isCCL ? "CCL Code" : "Accused Code"}
          >
            {renderFieldsWithDropDown(
              accusedCodes,
              null,
              handleSearch,
              serchText,
              100,
              viewSuspectAccused || disableForm || isAccusedCharged,
              ""
            )}
          </Form.Item>
        </div>
      </div>
    </Col>
  );

  return (
    <SuspectAccusedWrapper>
      {!hideRecords && (
        <ContentHeader
          headerTitle="Accused Details"
          addAnother
          addAnotherText="Add Another"
          onSubmitClick={submitAccusedDetails}
          setAddAnother={setAddAnother}
          disableButton={disableForm || viewSuspectAccused}
          isInvestigation={true}
          onCancel={() => setSelectedSiderMenu("investigation")}
        />
      )}
      {isFetching ? (
        <Loader />
      ) : (
        <div className="widgetPageStyle">
          {isFormUploading && (
            <div className="customPageLoader">
              <Loader />
            </div>
          )}
          <Col span={hideRecords ? 24 : 18}>
            <Card style={{ minHeight: 1200 }}>
              <Form form={suspectAccusedForm} layout="vertical">
                <Row>
                  {displayAccusedSuspectOptions()}
                  <Col span={6} style={{ marginLeft: 35 }}>
                    <Form.Item
                      name="userDate"
                      label="Created Date & Time"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Created Date!",
                        },
                      ]}
                    >
                      <DatePicker
                        showTime
                        format={DATE_TIME_FORMAT}
                        disabledDate={disableFutureDates}
                        disabled={viewSuspectAccused || disableForm}
                        placeholder="Select Date & Time"
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    span={6}
                    style={{
                      marginLeft: 35,
                      backgroundColor: "#ffe3bb",
                      fontWeight: "bold",
                    }}
                  >
                    <Form.Item
                      name="isAbsconding"
                      label="Absconding"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Radio.Group
                        onChange={(e) => setAbsconding(e.target.value)}
                        style={{ marginLeft: 15 }}
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <StandardPersonalForm
                  colWidth={8}
                  showMoreOption={true}
                  changeValue={checkFields}
                  disabled={viewSuspectAccused || disableForm}
                  age={age}
                  setAge={setAge}
                  formName={suspectAccusedForm}
                  validationFields={validationFields?.personalValidationFields}
                />
                <Divider />
                <div className="heading">Present Address</div>
                <StandardAddressForm
                  showMoreOption={true}
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewSuspectAccused || disableForm}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  validationFields={validationFields?.addressValidationFields}
                />
                <Divider />
                <div style={styles.widgetPageStyle}>
                  <div>
                    <span className="heading" style={{ marginRight: 20 }}>
                      Permanent Address
                    </span>
                  </div>
                  <div style={{ marginRight: 10 }}>
                    <Form.Item
                      name="sameAsPresent"
                      valuePropName="checked"
                      onChange={checkFields}
                    >
                      <Checkbox
                        style={{ color: "#949494", fontWeight: 300 }}
                        disabled={viewSuspectAccused || disableForm}
                        onChange={(e) => setPermanentAddress(e.target.checked)}
                      ></Checkbox>
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <label className="heading">Use same as Present</label>
                  </div>
                </div>
                {!permanentAddress && (
                  <StandardPermanentAddressForm
                    showMoreOption={true}
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={viewSuspectAccused || disableForm}
                    selectedPermanentState={selectedPermanentState}
                    setSelectedPermanentState={setSelectedPermanentState}
                    validationFields={validationFields?.addressValidationFields}
                  />
                )}
                <Divider />
                <StandardContactForm
                  colWidth={7}
                  changeValue={checkFields}
                  disabled={viewSuspectAccused || disableForm}
                  validationFields={validationFields?.contactValidationFields}
                />
                <Divider />
                <StandardIdentityForm
                  colWidth={7}
                  changeValue={checkFields}
                  setidentityList={setInputList}
                  disabled={viewSuspectAccused || disableForm}
                  currentData={editSuspectAccusedObj}
                  form={suspectAccusedForm}
                  resetFiles={resetFiles}
                  setResetFiles={setResetFiles}
                />
                <Divider />
                <StandardAccusedApprovalForm
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewSuspectAccused || disableForm}
                  fileList={
                    editSuspectAccusedObj?._id &&
                    !isUndefined(editSuspectAccusedObj?.deathCertificate?.url)
                      ? selectedUploadDeathCertificateUrl
                      : uploadDeathCertificateUrl
                  }
                  actionName={setUploadDeathCertificateUrl}
                  disableUpload={
                    viewSuspectAccused ||
                    !isEmpty(uploadDeathCertificateUrl) ||
                    disableForm
                  }
                  isDied={isDied}
                  disableDied={editSuspectAccusedObj?.isDied ? true : false}
                  setIsDied={setIsDied}
                />
              </Form>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="right-section cardRightStyle"
              style={{ minHeight: 1200 }}
            >
              <div style={{ marginLeft: 10, marginBottom: 20 }}>
                <UploadForm
                  colWidth={22}
                  enableMediaManager={true}
                  setInputFileList={setInputFileList}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  disabled={viewSuspectAccused || disableForm}
                />
              </div>
              {!isEmpty(filterAccusedDetails) ? (
                <Button
                  style={{ marginTop: "40px", width: "100%" }}
                  onClick={() => setrecordsIsModalVisible(true)}
                >
                  {filterAccusedDetails && filterAccusedDetails.length > 0
                    ? filterAccusedDetails.length
                    : 0}{" "}
                  Accused Details Records
                </Button>
              ) : null}
            </Card>
          </Col>
          <Modal
            title="Accused Details Records"
            visible={recordsIsModalVisible}
            onOk={() => setrecordsIsModalVisible(false)}
            onCancel={() => setrecordsIsModalVisible(false)}
            width={1500}
            footer={null}
          >
            <div style={{ maxHeight: 650, overflowY: "auto" }}>
              <SavedRecords
                dataSource={getSavedData()}
                editSuspectAccusedDetails={handleEditSuspectAccused}
                setViewSuspectAccused={setViewSuspectAccused}
                selectedRecord={editSuspectAccusedObj}
                isMedia={false}
                recordVisible={setrecordsIsModalVisible}
                arrestList={arrestList}
                juvenileApprehensionList={juvenileApprehensionList}
                disableForm={disableForm}
              />
            </div>
          </Modal>
        </div>
      )}
    </SuspectAccusedWrapper>
  );
}
