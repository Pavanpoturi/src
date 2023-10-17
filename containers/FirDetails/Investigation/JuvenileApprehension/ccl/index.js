import { useState, useEffect } from "react";
import moment from "moment";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  notification,
  Select,
  Divider,
  Modal,
  Checkbox,
  Button,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  masterDataType,
  cclListDropDown,
  getPersonDetails,
  getStaffsDetails,
  getSavedDataResult,
  folderName,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { isArray, first, isEmpty, isUndefined, isNull, size } from "lodash";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import Loader from "@components/utility/loader";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import {
  juvenileApprehensionTemplates,
  juvenileApprehensionForm,
  juvenileActionOptions,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import AddSuretyDetails from "../../CommonForms/AddSuretyDetails";
import ContentHeader from "../../../ContentHeader";
import RCHospitalDetailsForm from "../../Arrest/ArrestSubForms/RCHospitalDetailsForm";
import MedicalExamination from "../../CommonForms/MedicalExamination";
import AccusedCard from "../../CommonForms/AccusedCard";
import TemplatesModal from "../../CommonForms/TemplatesModal";
import { ModuleWrapper } from "../../CommonDetails/styles";
import {
  addJuvenileApprehensionPayload,
  updateJuvenileApprehensionPayload,
} from "./juvenileApprehensionPayloads";

const Option = Select.Option;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};

export default function JuvenileApprehension({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const selectedFir = loadState("selectedFir");
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [form] = Form.useForm();
  const [suretyDetailsForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const currentUser = loadState("currentUser");
  const crimeId = loadState("selectedFirId");
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [isInjured, setIsInjured] = useState(true);
  const [inputList, setInputList] = useState([]);
  const [resetFiles, setResetFiles] = useState(false);
  const [uploadMedicalCertificateUrl, setUploadMedicalCertificateUrl] =
    useState([]);
  const [
    selectedUploadMedicalCertificateUrl,
    setSelectedUploadMedicalCertificateUrl,
  ] = useState([]);
  const { staffList, rankList } = useSelector((state) => state.MasterData);
  const { actionType, errorMessage, juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const { getStaffList, getRanks, getApprehensionTypes } = masterDataActions;
  const [serchText, setSerchText] = useState("");
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [viewJuvenileDetails, setViewJuvenileDetails] = useState(false);
  const [editJuvenileObj, setEditJuvenileObj] = useState(null);
  const [personDetails, setPersonDetails] = useState("");
  const [age, setAge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [selectedSuretyDetails, setSelectedSuretyDetails] = useState([]);
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewEditObj, setviewEditObj] = useState("");
  const [viewEditObjIndex, setviewEditObjIndex] = useState(""); //for sureity details
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);
  const [isSuretyDetailsModalVisible, setIsSuretyDetailsModalVisible] =
    useState(false);

  const { getAccusedList } = suspectAccusedAction;
  const staffMembersList = staffList && getStaffsDetails(staffList);
  const { suspectAccusedList, isFetching } = useSelector(
    (state) => state.SuspectAccused
  );
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const {
    addJuvenileApprehensionDetails,
    updateJuvenileApprehensionDetails,
    getJuvenileApprehensionList,
    resetActionType,
  } = juvenileApprehensionActions;

  const isSuccess =
    actionType === "ADD_JUVENILE_APPREHENSION_SUCCESS" ||
    actionType === "UPDATE_JUVENILE_APPREHENSION_SUCCESS";

  const isError =
    actionType === "ADD_JUVENILE_APPREHENSION_ERROR" ||
    actionType === "UPDATE_JUVENILE_APPREHENSION_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_JUVENILE_APPREHENSION_SUCCESS"
        ? "Juvenile Apprehension Created"
        : "Juvenile Apprehension Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/juvenileApprehension",
          auditType
        )
      )
    );
  };

  const getCclApprehension = () => {
    dispatch(
      getJuvenileApprehensionList(
        `${config.cclApprehension}?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        openNotificationWithIcon("success", "Success");
        auditHistoryEntry();
        form.resetFields();
        setUploadMedicalCertificateUrl([]);
        setSelectedAccusedValue("");
        setResetFiles(true);
        setViewJuvenileDetails(false);
        setEditJuvenileObj(null);
        setAge("");
        getCclApprehension();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getRanks(`${url}/${masterDataType.RANK}`));
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getApprehensionTypes(
        `${config.getMasterData}/${masterDataType.APPREHENSION}`
      )
    );
    getCclApprehension();
    fetchAccusedList();
    form.setFieldsValue({
      action: juvenileActionOptions[0]?.label,
      typeOfApprehension: "Apprehension by police",
    });
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onChangeDate = (date, _dateString) => {
    checkFields();
  };

  const savedMedicalCertificateURL = editJuvenileObj?.medicalExamination
    ?.uploadMedicalCertificate
    ? editJuvenileObj?.medicalExamination?.uploadMedicalCertificate
    : "";

  const handleEditJuvenile = (value) => {
    if (value) {
      setSelectedAccusedValue(
        `${value.accusedId?.personalDetails?.name} ${
          value.accusedId?.personalDetails?.surname || ""
        }`
      );
      setSelectedSuretyDetails(value?.suretyDetails);
      setEditJuvenileObj(value);
      const { intimationGivenTo, medicalExamination, rapeCase, femaleArrest } =
        value;
      if (
        medicalExamination?.uploadMedicalCertificate &&
        medicalExamination?.uploadMedicalCertificate?.url !== ""
      ) {
        setSelectedUploadMedicalCertificateUrl([
          {
            url: medicalExamination?.uploadMedicalCertificate?.url,
            name: medicalExamination?.uploadMedicalCertificate?.name,
            fileId: medicalExamination?.uploadMedicalCertificate?.fileId,
          },
        ]);
      } else {
        setSelectedUploadMedicalCertificateUrl([]);
      }

      form.setFieldsValue({
        accusedId: value?.accusedId._id,
        action: value?.action,
        typeOfApprehension: value?.typeOfApprehension,
        placeOfApprehension: value?.placeOfApprehension,
        bringingDate: moment(new Date(value?.bringingDate)).isValid()
          ? moment(new Date(value?.bringingDate))
          : "",
        cclCode: value?.cclCode,
        apprehensionDate: moment(new Date(value?.apprehensionDate)).isValid()
          ? moment(new Date(value?.apprehensionDate))
          : "",
        relationToCCL: intimationGivenTo?.relationToCCL,
        intimatedDate: moment(
          new Date(intimationGivenTo?.intimatedDate)
        ).isValid()
          ? moment(new Date(intimationGivenTo?.intimatedDate))
          : "",
        hospitalName: medicalExamination?.hospitalName,
        hospitalLocation: medicalExamination?.hospitalLocation,
        isInjured: medicalExamination?.isInjured,
        descriptionOfInjuries: medicalExamination?.descriptionOfInjuries,
        escortPC: rapeCase?.escortPC,
        RChospitalName: rapeCase?.hospitalName,
        RChospitalLocation: rapeCase?.hospitalLocation,
        officerName: femaleArrest?.officerName,
        rank: femaleArrest?.rank,
      });

      if (intimationGivenTo?.person) {
        const {
          personalDetails,
          presentAddress,
          dateCreated,
          _id,
          contactDetails,
          sameAsPresent,
          permanentAddress,
        } = intimationGivenTo?.person;
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
        setSelectedState(stateUt);
        setSelectedPermanentState(permanentAddress?.stateUt);
        setPermanentAddress(sameAsPresent);
        form.setFieldsValue({
          parentGuardian: `${name || ""} ${surname || ""}`,
        });
        setPersonDetails(intimationGivenTo?.person);
        personForm.setFieldsValue({
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
        });
      }
    }
  };

  const filterList =
    !isEmpty(suspectAccusedList) &&
    suspectAccusedList.filter((s) => !s.is41ACRPC);
  const getAccusedData = () => getAccuseds(cclListDropDown(filterList));

  const getAccusedDropdownData = () => getAccuseds(cclListDropDown(filterList));

  const accusedPersonalDetails = first(
    getAccusedData().filter((s) => s.label === selectedAccusedValue)
  );

  const selectAccused = (val) => {
    setSelectedAccusedValue(val);
  };

  useEffect(() => {
    form.setFieldsValue({
      cclCode: accusedPersonalDetails?.accusedCode,
    });
  }, [accusedPersonalDetails, form]);

  useEffect(() => {
    if (viewEditObj) {
      const {
        personalDetails,
        presentAddress,
        permanentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
      } = viewEditObj.person;
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
        createdFrom,
        createdFor,
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
      suretyDetailsForm.setFieldsValue({
        lastupdateddatetime: moment(new Date(dateCreated)).isValid()
          ? moment(new Date(dateCreated))
          : "",
        id: _id,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        createdFrom: createdFrom,
        createdFor: createdFor,
        gender: gender,
        dateOfBirth: moment(new Date(dateOfBirth)).isValid()
          ? moment(new Date(dateOfBirth))
          : "",
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
        phoneNumber: contactDetails?.[0]?.phoneNumber,
        emailId: contactDetails?.[0]?.emailId,
        userDate: moment(new Date(viewEditObj.userDate)).isValid()
          ? moment(new Date(viewEditObj.userDate))
          : "",
      });
    }
  }, [viewEditObj]);

  const handleOkSurety = async () => {
    const values = await suretyDetailsForm.validateFields();
    if (values?.name || values?.surname) {
      const payload = [
        {
          person: getPersonDetails(values, inputList, []),
          suretyDocURL: {
            url: "",
            category: "",
            team: "",
            mimeType: "",
            fileId: "",
          },
        },
      ];
      let updatedResult = [];
      if (viewEditObjIndex) {
        let n1 = [...selectedSuretyDetails];
        let n2 = [...selectedSuretyDetails];
        const payloadData = first(payload);
        n2[viewEditObjIndex - 1] = payloadData;
        updatedResult = [...n2];
      } else {
        updatedResult = [...selectedSuretyDetails, ...payload];
      }
      if (isAddAnotherSuretyDetails) {
        suretyDetailsForm.resetFields();
        setSelectedSuretyDetails(updatedResult);
      } else {
        if (isEmpty(selectedSuretyDetails)) {
          setSelectedSuretyDetails(payload);
          setIsSuretyDetailsModalVisible(false);
        } else {
          setSelectedSuretyDetails(updatedResult);
          setIsSuretyDetailsModalVisible(false);
        }
      }
    }
    suretyDetailsForm.resetFields();
    setviewEditObj("");
    setviewEditObjIndex("");
  };

  const handleCancelSurety = () => {
    setIsSuretyDetailsModalVisible(false);
    setIsAddAnotherSuretyDetails(false);
    suretyDetailsForm.resetFields();
  };
  const suretyDetailsCount = selectedSuretyDetails;
  const handleAddedSuretyDetails = (suretyList) => {
    setIsSuretyDetailsModalVisible(true);
  };

  const displayJuvenileApprehensionFields = (name) => {
    switch (name) {
      case "typeOfApprehension":
        return renderFieldsWithDropDown(
          [{ label: "Apprehension by police" }],
          null,
          handleSearch,
          serchText,
          220,
          viewJuvenileDetails || disableForm
        );
      case "bringingDate":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={onChangeDate}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewJuvenileDetails || disableForm}
          />
        );
      case "apprehensionDate":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date and Time"
            onChange={onChangeDate}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewJuvenileDetails || disableForm}
          />
        );
      case "cclCode":
        return (
          <Input
            maxLength={textFieldRules.maxLength}
            disabled={true}
            style={{ width: 220 }}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewJuvenileDetails || disableForm}
          />
        );
    }
  };

  const showTemplateModal = (
    templateName,
    fileName,
    templateAvailable = false
  ) => {
    if (templateAvailable) {
      setTemplateIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setTemplateIsModalVisible(false);
    }
  };

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editJuvenileObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const renderAccusedFieldsWithDropDown = (
    menuOptions,
    selectAction,
    width,
    id,
    disabled = false,
    multiple = null
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        mode={multiple}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 220 }}
        onSelect={(item, option) => {
          selectAction && selectAction(option.label);
          checkFields();
        }}
        disabled={viewJuvenileDetails || disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option
              key={index}
              value={id ? item._id : item.label}
              label={item.label}
              arrestprocess={item.arrestProcess}
            >
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayJuvenileApprehensionForm = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col key={i} span={8} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const showModal = () => {
    setIsModalVisible(disableForm ? false : true);
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    const person = getPersonDetails(values, inputList);
    setPersonDetails(person);
    form.setFieldsValue({
      parentGuardian: `${values?.name || ""} ${values?.surname || ""}`,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(juvenileApprehensionList) &&
      !isEmpty(juvenileApprehensionList) &&
      // eslint-disable-next-line array-callback-return
      juvenileApprehensionList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.accusedId) &&
          !isNull(data?.accusedId) &&
          data?.accusedId;

        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, [])
        );
      });
    return savedData;
  };

  const submit = async () => {
    const values = await form.validateFields();
    const uploadMedicalCertificateData = new FormData();
    uploadMedicalCertificateUrl.forEach((file) => {
      uploadMedicalCertificateData.append("file", file.originFileObj);
    });
    uploadMedicalCertificateData.append("prefixFolder", crimeId);
    uploadMedicalCertificateData.append(
      "folderPath",
      `${crimeId}/${folderName.JUVENILE_APPREHENSION}/file`
    );

    if (!isEmpty(uploadMedicalCertificateUrl)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadMedicalCertificateData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addJuvenileApprehensionPayload(
              values,
              crimeId,
              personDetails,
              payloadData,
              selectedSuretyDetails
            );
            const updatePayload = updateJuvenileApprehensionPayload(
              values,
              crimeId,
              personDetails,
              editJuvenileObj?._id ? editJuvenileObj?._id : null,
              payloadData,
              selectedSuretyDetails
            );

            if (editJuvenileObj?._id) {
              dispatch(
                updateJuvenileApprehensionDetails(
                  config.cclApprehension,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addJuvenileApprehensionDetails(
                  config.cclApprehension,
                  addPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadMedicalCertificateUrl)) {
      const addPayload = addJuvenileApprehensionPayload(
        values,
        crimeId,
        personDetails,
        savedMedicalCertificateURL,
        selectedSuretyDetails
      );
      const updatePayload = updateJuvenileApprehensionPayload(
        values,
        crimeId,
        personDetails,
        editJuvenileObj?._id ? editJuvenileObj?._id : null,
        savedMedicalCertificateURL,
        selectedSuretyDetails
      );

      if (editJuvenileObj?._id) {
        dispatch(
          updateJuvenileApprehensionDetails(
            config.cclApprehension,
            updatePayload
          )
        );
      } else {
        dispatch(
          addJuvenileApprehensionDetails(config.cclApprehension, addPayload)
        );
      }
    }
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="CCL Apprehension"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        setAddAnother={setAddAnother}
        disableButton={viewJuvenileDetails || disableForm}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row>
                  <Col span={7}>
                    <Form.Item
                      name="accusedId"
                      label="Select CCL (Child in Conflict with Law)"
                      rules={[
                        { required: true, message: "Please Select Accused!" },
                      ]}
                    >
                      {renderAccusedFieldsWithDropDown(
                        editJuvenileObj?._id
                          ? getAccusedData()
                          : getAccusedDropdownData(),
                        selectAccused,
                        220,
                        true,
                        editJuvenileObj?._id ||
                          isEmpty(getAccusedData()) ||
                          disableForm
                      )}
                    </Form.Item>
                    {selectedAccusedValue !== "" && (
                      <AccusedCard
                        accusedPersonalDetails={accusedPersonalDetails}
                        title="Accused Details"
                      />
                    )}
                  </Col>
                  <Col span={4}>
                    <div
                      className="link"
                      style={{ marginTop: 25, cursor: "pointer" }}
                      onClick={() =>
                        !disableForm && setSelectedSiderMenu("suspectAccused")
                      }
                    >
                      Create New
                    </div>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="action" label="Select Action">
                      {renderFieldsWithDropDown(
                        juvenileActionOptions,
                        checkFields,
                        handleSearch,
                        serchText,
                        220,
                        viewJuvenileDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Card className="card-style">
                  {displayJuvenileApprehensionForm(
                    juvenileApprehensionForm,
                    displayJuvenileApprehensionFields
                  )}
                </Card>
                <Card className="card-style" style={{ marginTop: 20 }}>
                  <h3>
                    <b>Intimation Given to</b>
                  </h3>{" "}
                  <br />
                  <Row glutter={24}>
                    <Col span={8} className="sectionsDetails">
                      <Form.Item
                        name="parentGuardian"
                        label="Parent/Guardian"
                        rules={[textFieldRules.textFieldMaxLength]}
                      >
                        <Input
                          onChange={checkFields}
                          style={{ width: 220 }}
                          maxLength={textFieldRules.maxLength}
                          disabled={viewJuvenileDetails || disableForm}
                        />
                      </Form.Item>
                      <div className="link" onClick={showModal}>
                        Enter Person Details
                      </div>
                    </Col>
                    <Col span={8} className="sectionsDetails">
                      <Form.Item
                        name="parent"
                        label="Parent/Guardian"
                        // rules={[textFieldRules.textFieldMaxLength]}
                      >
                        <Input
                          onChange={checkFields}
                          style={{ width: 220 }}
                          maxLength={textFieldRules.maxLength}
                          disabled={viewJuvenileDetails || disableForm}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={8} className="sectionsDetails">
                      <Form.Item
                        name="relationToCCL"
                        label="Relation to CCL"
                        rules={[textFieldRules.textFieldMaxLength]}
                      >
                        {renderFieldsWithDropDown(
                          [{ label: "Father" }, { label: "Guardian" }],
                          checkFields,
                          handleSearch,
                          serchText,
                          220,
                          viewJuvenileDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8} className="sectionsDetails">
                      <Form.Item name="intimatedDate" label="Date">
                        <DatePicker
                          format={DATE_FORMAT}
                          placeholder="Select Date"
                          onChange={onChangeDate}
                          style={{ width: 220 }}
                          disabledDate={disableFutureDates}
                          disabled={viewJuvenileDetails || disableForm}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                <Card className="card-style">
                  <MedicalExamination
                    checkFields={checkFields}
                    setIsInjured={setIsInjured}
                    isInjured={isInjured}
                    form={form}
                    selectedRecord={editJuvenileObj}
                    disabled={viewJuvenileDetails || disableForm}
                    fileList={
                      editJuvenileObj?._id &&
                      savedMedicalCertificateURL &&
                      savedMedicalCertificateURL?.url !== ""
                        ? selectedUploadMedicalCertificateUrl
                        : uploadMedicalCertificateUrl
                    }
                    actionName={setUploadMedicalCertificateUrl}
                    disableUpload={
                      viewJuvenileDetails ||
                      !isEmpty(uploadMedicalCertificateUrl) ||
                      disableForm
                    }
                  />
                </Card>
                <Row style={{ marginTop: 50 }}>
                  <div
                    className="popupLink"
                    onClick={() => handleAddedSuretyDetails(suretyDetailsCount)}
                  >
                    Add Sureties Details
                  </div>
                </Row>
                {!isEmpty(suretyDetailsCount) ? (
                  <Row style={{ marginTop: 10 }}>
                    <div
                      className="popupLink"
                      onClick={() =>
                        handleAddedSuretyDetails(suretyDetailsCount)
                      }
                    >
                      {`${size(suretyDetailsCount)} Sureties Added`}
                    </div>
                  </Row>
                ) : null}

                {selectedFir && selectedFir?.minorHead === "Rape" && (
                  <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
                    <h6>
                      <b>Rape Case</b>
                    </h6>{" "}
                    <br />
                    <Row glutter={24}>
                      <Col span={6} className="sectionsDetails">
                        <Form.Item
                          name="escortPC"
                          label="Escort PC"
                          style={{ width: 220 }}
                        >
                          {renderFieldsWithDropDown(
                            staffMembersList,
                            checkFields,
                            null,
                            null,
                            220,
                            viewJuvenileDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row glutter={24}>
                      <RCHospitalDetailsForm
                        checkFields={checkFields}
                        form={form}
                        selectedRecord={editJuvenileObj}
                        disabled={viewJuvenileDetails || disableForm}
                      />
                    </Row>
                  </Card>
                )}
                {accusedPersonalDetails &&
                  accusedPersonalDetails?.personalDetails?.gender ===
                    "Female" && (
                    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
                      <br />
                      <Row glutter={24}>
                        <Col span={6} style={{ paddingRight: 30 }}>
                          <h6>
                            <b>Female Arrest?</b>
                          </h6>{" "}
                        </Col>
                        <Col
                          span={12}
                          style={{ marginBottom: 10, paddingRight: 130 }}
                        >
                          <Form.Item
                            name="officerName"
                            label="Female Police Officier Name assisted in arrest"
                          >
                            {renderFieldsWithDropDown(
                              staffMembersList,
                              checkFields,
                              handleSearch,
                              serchText,
                              220,
                              viewJuvenileDetails || disableForm
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={6} style={{ marginBottom: 10 }}>
                          <Form.Item name="rank" label="Rank">
                            {renderFieldsWithDropDown(
                              rankList,
                              checkFields,
                              handleSearch,
                              serchText,
                              220,
                              viewJuvenileDetails || disableForm
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  )}
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={juvenileApprehensionTemplates}
              showModal={showTemplateModal}
              disabled={
                viewJuvenileDetails || !editJuvenileObj?._id || disableForm
              }
              selectedRecord={editJuvenileObj}
              selectedModule="juvenileApprehension"
              accusedId={editJuvenileObj?.accusedId?._id}
            />
            {!isEmpty(juvenileApprehensionList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => {
                  setrecordsIsModalVisible(true);
                  setviewEditObj("");
                }}
              >
                {juvenileApprehensionList && juvenileApprehensionList.length > 0
                  ? juvenileApprehensionList.length
                  : 0}{" "}
                CCL Apprehension Records
              </Button>
            ) : null}
            <Modal
              title="CCL Apprehension Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditJuvenile}
                  setViewDetails={setViewJuvenileDetails}
                  selectedRecord={editJuvenileObj}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
          <Modal
            title="Add Person"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            okText="Add"
          >
            <Form form={personForm} layout="vertical">
              <div>
                <Col span={24}>
                  <StandardPersonalForm
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={viewJuvenileDetails || disableForm}
                    age={age}
                    setAge={setAge}
                    formName={personForm}
                  />
                  <Divider />
                  <div className="heading">Present Address</div>
                  <StandardAddressForm
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={viewJuvenileDetails || disableForm}
                    selectedState={selectedState}
                    setSelectedState={setSelectedState}
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
                          disabled={viewJuvenileDetails || disableForm}
                          onChange={(e) =>
                            setPermanentAddress(e.target.checked)
                          }
                        />
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
                      disabled={viewJuvenileDetails || disableForm}
                      selectedPermanentState={selectedPermanentState}
                      setSelectedPermanentState={setSelectedPermanentState}
                    />
                  )}
                  <Divider />
                  <StandardContactForm
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={viewJuvenileDetails || disableForm}
                  />
                  <Divider />
                  <StandardIdentityForm
                    colWidth={8}
                    changeValue={checkFields}
                    setidentityList={setInputList}
                    form={personForm}
                    currentData={
                      editJuvenileObj?._id && editJuvenileObj?.intimationGivenTo
                    }
                    disabled={viewJuvenileDetails || disableForm}
                    resetFiles={resetFiles}
                    setResetFiles={setResetFiles}
                  />
                </Col>
              </div>
            </Form>
          </Modal>
        </Row>
      )}
      {isSuretyDetailsModalVisible ? (
        <AddSuretyDetails
          title="Surety Details"
          isModalVisible={isSuretyDetailsModalVisible}
          handleOk={handleOkSurety}
          handleCancel={handleCancelSurety}
          formName={suretyDetailsForm}
          checkFields={checkFields}
          disabled={viewSuretyClicked || viewJuvenileDetails}
          setInputList={setInputList}
          suretyList={selectedSuretyDetails}
          viewSuretyClicked={viewSuretyClicked}
          editSuretyClicked={editSuretyClicked}
          setviewEditObj={setviewEditObj}
          setviewEditObjIndex={setviewEditObjIndex}
          setviewSuretyClicked={setviewSuretyClicked}
          seteditSuretyClicked={seteditSuretyClicked}
          editObj={null}
          age={age}
          setAge={setAge}
          setIsAddAnotherSuretyDetails={setIsAddAnotherSuretyDetails}
        />
      ) : null}
      {isTemplateModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleTemplateCancel}
          isModalVisible={isTemplateModalVisible}
        />
      )}
    </ModuleWrapper>
  );
}
