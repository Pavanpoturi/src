import { useState, useEffect } from "react";
import ContentHeader from "../../ContentHeader";
import moment from "moment";
import axios from "axios";
import { first, isUndefined, isEmpty, isArray, isNull, size } from "lodash";
import AccusedCard from "../CommonForms/AccusedCard";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import apprehensionReportAction from "@redux/investigations/apprehensionReport/actions";
import juvenileApprehensionActions from "@redux/investigations/juvenileApprehension/actions";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  notification,
  Modal,
} from "antd";
import { CaretDownOutlined, CameraOutlined } from "@ant-design/icons";
import {
  dummyRequest,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getApprehensionMinorAccuseds,
  getDate,
  DATE_YY_MM_DD,
  getSavedDataResult,
  onFileChange,
  folderName,
  getMediaUploadError,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import {
  apprehensionReportTemplates,
  apprehensionReportForm,
  admissionToObservationHomeForm,
  jjbOrderList,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import TemplatesModal from "../CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import AddSuretyDetails from "../CommonForms/AddSuretyDetails";

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function ApprehensionReport({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [suretyDetailsForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [editApprehensionReportObj, setEditApprehensionReportObj] =
    useState(null);
  const [viewApprehensionReportDetails, setViewApprehensionReportDetails] =
    useState(false);
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [jjbOrderURL, setJjbOrderURL] = useState([]);
  const [selectedJjbOrderURL, setSelectedJjbOrderURL] = useState([]);
  const [jjbOrders, setJjbOrders] = useState("");
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const {
    addApprehensionReportDetails,
    updateApprehensionReportDetails,
    getApprehensionReportList,
    resetActionType,
  } = apprehensionReportAction;
  const {
    apprehensionReportList,
    isFetching,
    actionType,
    successMessage,
    errorMessage,
  } = useSelector((state) => state.ApprehensionReport);
  const { createAuditHistory } = auditHistoryActions;
  const { getJuvenileApprehensionList } = juvenileApprehensionActions;
  const { juvenileApprehensionList } = useSelector(
    (state) => state.JuvenileApprehension
  );
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const [isSuretyDetailsModalVisible, setIsSuretyDetailsModalVisible] =
    useState(false);
  const [selectedSuretyDetails, setSelectedSuretyDetails] = useState([]);
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewEditObj, setviewEditObj] = useState("");
  const [viewEditObjIndex, setviewEditObjIndex] = useState(""); //for sureity details
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);

  const isSuccess =
    actionType === "ADD_APPREHENSION_REPORT_SUCCESS" ||
    actionType === "UPDATE_APPREHENSION_REPORT_SUCCESS";

  const isError =
    actionType === "ADD_APPREHENSION_REPORT_ERROR" ||
    actionType === "UPDATE_APPREHENSION_REPORT_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_APPREHENSION_REPORT_SUCCESS"
        ? "Apprehension Report Created"
        : "Apprehension Report Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/apprehensionReport",
          auditType
        )
      )
    );
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchAccusedList = () => {
    dispatch(
      getJuvenileApprehensionList(
        `${config.cclApprehension}?crimeId=${crimeId}`
      )
    );
  };

  const fetchApprehensionReportList = () => {
    dispatch(
      getApprehensionReportList(
        `${config.apprehensionReport}?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Apprehension Report Successfully Generated" ||
        successMessage === "Apprehension Report Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setSelectedAccusedValue("");
          setJjbOrderURL([]);
          setViewApprehensionReportDetails(false);
          setEditApprehensionReportObj(null);
          fetchApprehensionReportList();
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchAccusedList();
    fetchApprehensionReportList();
  }, []);

  const getAccusedDropdownData = () =>
    !isEmpty(juvenileApprehensionList) &&
    getApprehensionMinorAccuseds(juvenileApprehensionList);
  const accusedPersonalDetails =
    !isEmpty(juvenileApprehensionList) &&
    first(
      getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
    );

  const savedApprehensionReportURL = editApprehensionReportObj?.jjbOrderURL
    ? editApprehensionReportObj?.jjbOrderURL
    : "";

  const getCommonPayload = (values, jjbOrderURL, selectedSuretyDetails) => {
    const observationFromAndToDates = values?.observationFromAndToDates;
    const commonPayload = {
      crimeId: crimeId,
      producedDateBeforeDPO: values?.producedDateBeforeDPO
        ? getDate(values.producedDateBeforeDPO)
        : "",
      producedDateBeforeJJBoard:
        values?.producedDateBeforeJJBoard &&
        getDate(values.producedDateBeforeJJBoard),
      jjbOrders: values?.jjbOrders,
      jjbOrderURL: {
        mimeType: jjbOrderURL?.mimeType,
        name: jjbOrderURL?.name,
        url: jjbOrderURL?.url,
        fileId: jjbOrderURL?.id,
      },
      admissionDate: values?.admissionDate ? getDate(values.admissionDate) : "",
      observationFromAndToDates:
        observationFromAndToDates && !isUndefined(observationFromAndToDates)
          ? [
              getDate(observationFromAndToDates[0]),
              getDate(observationFromAndToDates[1]),
            ]
          : "",
      observationDays: values?.observationDays,
      releasedOn: values?.releasedOn ? getDate(values.releasedOn) : "",
      suretyDetails: selectedSuretyDetails,
    };

    return commonPayload;
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (
      selectedSuretyDetails.length === 0 &&
      values.jjbOrders === "Released on Bail"
    ) {
      openNotificationWithIcon("error", "Please Add Surety Details");
    } else {
      const jjbOrderURLData = new FormData();
      jjbOrderURL.forEach((file) => {
        jjbOrderURLData.append("file", file.originFileObj);
      });
      jjbOrderURLData.append("prefixFolder", crimeId);
      jjbOrderURLData.append(
        "folderPath",
        `${crimeId}/${folderName.APPREHENSION_REPORT}/file`
      );
      const addApprehension = {
        accusedId: accusedPersonalDetails?._id,
      };
      const updateApprehension = {
        accusedId: editApprehensionReportObj?.accusedId,
        _id: editApprehensionReportObj?._id,
      };
      if (!isEmpty(jjbOrderURL)) {
        axios
          .post(`${config.fileUpload}/upload`, jjbOrderURLData)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              const payloadData = first(data);
              const addApprehensionReportPayload = {
                ...addApprehension,
                ...getCommonPayload(values, payloadData, selectedSuretyDetails),
              };

              const updateApprehensionReportPayload = {
                ...updateApprehension,
                ...getCommonPayload(values, payloadData, selectedSuretyDetails),
              };

              if (editApprehensionReportObj?._id) {
                dispatch(
                  updateApprehensionReportDetails(
                    config.apprehensionReport,
                    updateApprehensionReportPayload
                  )
                );
              } else {
                dispatch(
                  addApprehensionReportDetails(
                    config.apprehensionReport,
                    addApprehensionReportPayload
                  )
                );
              }
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
          });
      } else if (isEmpty(jjbOrderURL)) {
        const addApprehensionReportPayload = {
          ...addApprehension,
          ...getCommonPayload(
            values,
            savedApprehensionReportURL,
            selectedSuretyDetails
          ),
        };

        const updateApprehensionReportPayload = {
          ...updateApprehension,
          ...getCommonPayload(
            values,
            savedApprehensionReportURL,
            selectedSuretyDetails
          ),
        };

        if (editApprehensionReportObj?._id) {
          dispatch(
            updateApprehensionReportDetails(
              config.apprehensionReport,
              updateApprehensionReportPayload
            )
          );
        } else {
          dispatch(
            addApprehensionReportDetails(
              config.apprehensionReport,
              addApprehensionReportPayload
            )
          );
        }
      }
    }
  };

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

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onChangeDate = (date, _dateString) => {
    console.log(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const displayApprehensionReportFields = (name) => {
    switch (name) {
      case "producedDateBeforeDPO":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={onChangeDate}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewApprehensionReportDetails || disableForm}
          />
        );
      case "producedDateBeforeJJBoard":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={onChangeDate}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewApprehensionReportDetails || disableForm}
          />
        );
      case "admissionDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={onChangeDate}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewApprehensionReportDetails || disableForm}
          />
        );
      case "observationFromAndToDates":
        return (
          <RangePicker
            format={DATE_FORMAT}
            onChange={onChangeDate}
            style={{ width: 250 }}
            disabled={viewApprehensionReportDetails || disableForm}
          />
        );
      case "jjbOrderURL":
        return (
          <Upload
            fileList={
              editApprehensionReportObj?._id &&
              savedApprehensionReportURL !== ""
                ? selectedJjbOrderURL
                : jjbOrderURL
            }
            onPreview={handleDownload}
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, setJjbOrderURL)}
            multiple={false}
          >
            <Button
              className="saveButton"
              size="large"
              style={{ marginTop: 5 }}
              icon={<CameraOutlined className="saveButtonIcon" />}
              disabled={
                viewApprehensionReportDetails ||
                !isEmpty(jjbOrderURL) ||
                disableForm
              }
            >
              Upload
            </Button>
          </Upload>
        );
      case "jjbOrders":
        return renderFieldsWithDropDown(
          jjbOrderList,
          setJjbOrders,
          handleSearch,
          serchText,
          250,
          viewApprehensionReportDetails ||
            editApprehensionReportObj?.jjbOrders ||
            disableForm,
          null
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 150 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewApprehensionReportDetails || disableForm}
          />
        );
    }
  };

  const handleEditApprehensionReport = (value) => {
    if (value) {
      setEditApprehensionReportObj(value);
      setSelectedAccusedValue(value.accusedId?._id);
      setSelectedSuretyDetails(
        !!value?.suretyDetails ? value?.suretyDetails : []
      );
      const dateList = [];
      if (
        value?.observationFromAndToDates?.length > 0 &&
        value?.observationFromAndToDates[0] &&
        value?.observationFromAndToDates[1]
      ) {
        dateList.push(
          moment(new Date(value.observationFromAndToDates[0])).isValid()
            ? moment(new Date(value.observationFromAndToDates[0]))
            : ""
        );
        dateList.push(
          moment(new Date(value.observationFromAndToDates[1])).isValid()
            ? moment(new Date(value.observationFromAndToDates[1]))
            : ""
        );
      }
      if (value.jjbOrderURL && value.jjbOrderURL.url !== "") {
        setSelectedJjbOrderURL([
          {
            url: value?.jjbOrderURL?.url,
            name: value.jjbOrderURL?.name,
            fileId: value?.jjbOrderURL?.fileId,
          },
        ]);
      } else {
        setSelectedJjbOrderURL([]);
      }

      form.setFieldsValue({
        accusedId: value.accusedId?._id,
        producedDateBeforeDPO:
          value?.producedDateBeforeDPO &&
          moment(new Date(value?.producedDateBeforeDPO)).isValid()
            ? moment(new Date(value?.producedDateBeforeDPO))
            : "",
        producedDateBeforeJJBoard: moment(
          new Date(value?.producedDateBeforeJJBoard)
        ).isValid()
          ? moment(new Date(value?.producedDateBeforeJJBoard))
          : "",
        jjbOrders: value?.jjbOrders,
        admissionDate:
          value?.admissionDate &&
          moment(new Date(value?.admissionDate)).isValid()
            ? moment(new Date(value?.admissionDate))
            : "",
        observationFromAndToDates: dateList,
        observationDays: value?.observationDays,
        releasedOn: moment(new Date(value?.releasedOn)).isValid()
          ? moment(new Date(value?.releasedOn))
          : "",
      });
    }
  };

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const reportData = getDataForDocument(
    editApprehensionReportObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const displayApprehensionReportForm = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={12} key={i} style={{ marginBottom: 15 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(apprehensionReportList) &&
      !isEmpty(apprehensionReportList) &&
      // eslint-disable-next-line array-callback-return
      apprehensionReportList.map((data) => {
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

  const suretyDetailsCount = selectedSuretyDetails;
  const handleAddedSuretyDetails = (suretyList) => {
    setIsSuretyDetailsModalVisible(true);
  };

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

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Apprehension Report"
        addAnother
        addAnotherText="Add Another"
        disableButton={disableForm}
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
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
                  <Col span={6}>
                    <Form.Item
                      name="accusedId"
                      label="Select CCL"
                      rules={[
                        { required: true, message: "Please Select CCL!" },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={(item) => {
                          setSelectedAccusedValue(item);
                          checkFields();
                        }}
                        disabled={
                          viewApprehensionReportDetails ||
                          editApprehensionReportObj?._id ||
                          disableForm
                        }
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          getAccusedDropdownData().map((item, index) => (
                            <Option
                              key={index}
                              value={item._id}
                              label={item.label}
                            >
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    {selectedAccusedValue !== "" && (
                      <AccusedCard
                        accusedPersonalDetails={accusedPersonalDetails}
                        title="CCL Details"
                      />
                    )}
                  </Col>
                </Row>
                <Card className="card-style">
                  {displayApprehensionReportForm(
                    apprehensionReportForm,
                    displayApprehensionReportFields
                  )}
                </Card>
                {jjbOrders || editApprehensionReportObj?.jjbOrders ? (
                  <Card className="card-style">
                    {jjbOrders === "Released on Bail" ||
                    editApprehensionReportObj?.jjbOrders ===
                      "Released on Bail" ? (
                      <>
                        <Col
                          span={6}
                          style={{ marginBottom: 10, paddingRight: 10 }}
                        >
                          <Form.Item name="releasedOn" label="Released On">
                            <DatePicker
                              format={DATE_FORMAT}
                              style={{ width: 200 }}
                              disabled={
                                viewApprehensionReportDetails || disableForm
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Row style={{ marginTop: 50 }}>
                          <div
                            className="popupLink"
                            onClick={() =>
                              handleAddedSuretyDetails(suretyDetailsCount)
                            }
                          >
                            Add Sureties Details
                          </div>
                        </Row>
                        {!isEmpty(selectedSuretyDetails) ? (
                          <Row style={{ marginTop: 10 }}>
                            <div
                              className="popupLink"
                              onClick={() => handleAddedSuretyDetails()}
                            >
                              {`${size(selectedSuretyDetails)} Sureties Added`}
                            </div>
                          </Row>
                        ) : null}
                      </>
                    ) : (
                      displayApprehensionReportForm(
                        admissionToObservationHomeForm,
                        displayApprehensionReportFields
                      )
                    )}
                  </Card>
                ) : null}
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={apprehensionReportTemplates}
              showModal={showModal}
              disabled={
                viewApprehensionReportDetails ||
                !editApprehensionReportObj?._id ||
                disableForm
              }
              selectedRecord={editApprehensionReportObj}
              selectedModule="apprehensionReport"
              accusedId={editApprehensionReportObj?.accusedId?._id}
            />
            {!isEmpty(apprehensionReportList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {apprehensionReportList && apprehensionReportList.length > 0
                  ? apprehensionReportList.length
                  : 0}{" "}
                Apprehension Report Records
              </Button>
            ) : null}
            <Modal
              title="Apprehension Report Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditApprehensionReport}
                  setViewDetails={setViewApprehensionReportDetails}
                  selectedRecord={editApprehensionReportObj}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
      {isModalVisible && (
        <TemplatesModal
          reportData={reportData}
          selectedTemplateName={selectedTemplateName}
          selectedFileName={selectedFileName}
          getHTMLFromTemplate={getHTMLFromTemplate}
          handleCancel={handleCancel}
          isModalVisible={isModalVisible}
        />
      )}

      {isSuretyDetailsModalVisible ? (
        <AddSuretyDetails
          title="Surety Details"
          isModalVisible={isSuretyDetailsModalVisible}
          handleOk={handleOkSurety}
          handleCancel={handleCancelSurety}
          formName={suretyDetailsForm}
          checkFields={checkFields}
          disabled={viewSuretyClicked}
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
    </ModuleWrapper>
  );
}
