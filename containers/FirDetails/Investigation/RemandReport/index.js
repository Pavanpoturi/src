import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isEmpty,
  isArray,
  isUndefined,
  isNull,
  remove,
  first,
  size,
} from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import moment from "moment";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  Row,
  Card,
  Col,
  Select,
  Form,
  Input,
  DatePicker,
  Checkbox,
  notification,
  Button,
  Modal,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
  getRemandedAccused,
  masterDataType,
  courtOrders,
  getSavedDataResult,
  getDaysOfWeeks,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import firActions from "@redux/fir/actions";
import masterDataActions from "@redux/masterData/actions";
import Loader from "@components/utility/loader";
import remandReportActions from "@redux/investigations/remandReport/actions";
import TextArea from "antd/lib/input/TextArea";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import ContentHeader from "../../ContentHeader";
import SavedRecords from "./SavedRecords";
import TemplatesModal from "../CommonForms/TemplatesModal";
import { ModuleWrapper } from "../CommonDetails/styles";
import AddSuretyDetails from "../CommonForms/AddSuretyDetails";
import {
  addRemandReportPayload,
  updateRemandReportPayload,
} from "./remandReportPayload";
import {
  remandReportTemplates,
  remandReportForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";

const Option = Select.Option;
const { RangePicker } = DatePicker;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function RemandReport({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [suretyDetailsForm] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [selectedCourtOrder, setSelectedCourtOrder] = useState("");
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [viewRemandReportDetails, setViewRemandReportDetails] = useState(false);
  const [editRemandReportObj, setEditRemandReportObj] = useState(null);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { fetchArrest } = firActions;
  const { createAuditHistory } = auditHistoryActions;
  const { arrestList } = useSelector((state) => state.FIR);
  const { courtsFromPSList, jailsNameList } = useSelector(
    (state) => state.MasterData
  );
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const {
    addRemandReportDetails,
    updateRemandReportDetails,
    getRemandReportList,
    resetActionType,
  } = remandReportActions;
  const { getCourtsBasedonPsCode, getJailsName } = masterDataActions;

  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };
  const {
    actionType,
    errorMessage,
    isFetching,
    successMessage,
    remandReportList,
  } = useSelector((state) => state.RemandReport);
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
  const isSuccess =
    actionType === "ADD_REMAND_REPORT_SUCCESS" ||
    actionType === "UPDATE_REMAND_REPORT_SUCCESS";

  const isError =
    actionType === "ADD_REMAND_REPORT_ERROR" ||
    actionType === "UPDATE_REMAND_REPORT_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_REMAND_REPORT_SUCCESS"
        ? "Remand Report Created"
        : "Remand Report Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/remandReport", auditType)
      )
    );
  };

  const fetchAccusedList = () => {
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
  };

  const fetchRemandReport = () => {
    dispatch(getRemandReportList(`${config.remandReport}?crimeId=${crimeId}`));
  };

  const getMasterDataList = () => {
    const url = config.getMasterData;
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getJailsName(`${url}/${masterDataType.JAILS}`));
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Remand Report Successfully Added" ||
        successMessage === "Remand Report Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewRemandReportDetails(false);
          setEditRemandReportObj(null);
          fetchRemandReport();
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
    getMasterDataList();
    fetchRemandReport();
  }, []);

  const arrestedList =
    arrestList &&
    !isEmpty(arrestList) &&
    arrestList.filter(
      (s) =>
        s.arrestType === "Arrest By Police" ||
        s.arrestType === "Arrest on Surrender in Police Station"
    );

  const getAccusedDropdownData = () => getRemandedAccused(arrestedList);

  const submit = async () => {
    const values = await form.validateFields();
    if (
      selectedSuretyDetails.length === 0 &&
      values.courtOrders === "Released on Bail"
    ) {
      openNotificationWithIcon("error", "Please Add Surety Details");
    } else {
      createRemandReportPayload(values);
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const createRemandReportPayload = (values) => {
    const addPayload = addRemandReportPayload(
      values,
      crimeId,
      selectedSuretyDetails
    );
    const updatePayload = updateRemandReportPayload(
      values,
      crimeId,
      editRemandReportObj?._id ? editRemandReportObj?._id : null,
      selectedSuretyDetails
    );

    if (editRemandReportObj?._id) {
      dispatch(updateRemandReportDetails(config.remandReport, updatePayload));
    } else {
      dispatch(addRemandReportDetails(config.remandReport, addPayload));
    }
  };

  const handleEditRemandReport = (value) => {
    if (value) {
      setEditRemandReportObj(value);
      setSelectedCourtOrder(value?.courtOrders);
      setSelectedSuretyDetails(
        !!value?.suretyDetails ? value?.suretyDetails : []
      );
      let accusedIdsArray = [];
      if (
        value?.accusedId &&
        isArray(value?.accusedId) &&
        value?.accusedId.length > 0
      ) {
        value?.accusedId.forEach((ele) => accusedIdsArray.push(ele?._id));
      }
      const selectPeriodArr = [];
      const selectPeriod = value?.selectPeriod;
      if (selectPeriod?.length > 0) {
        selectPeriodArr.push(
          moment(new Date(selectPeriod[0])).isValid()
            ? moment(new Date(selectPeriod[0]))
            : ""
        );
        selectPeriodArr.push(
          moment(new Date(selectPeriod[1])).isValid()
            ? moment(new Date(selectPeriod[1]))
            : ""
        );
      }
      const fromToDatesArr = [];
      if (value?.fromToDates?.length > 0) {
        fromToDatesArr.push(
          moment(new Date(value.fromToDates[0])).isValid()
            ? moment(new Date(value.fromToDates[0]))
            : ""
        );
        fromToDatesArr.push(
          moment(new Date(value.fromToDates[1])).isValid()
            ? moment(new Date(value.fromToDates[1]))
            : ""
        );
      }
      form.setFieldsValue({
        accusedId: accusedIdsArray,
        producedDateTime:
          value?.producedDateTime &&
          moment(new Date(value?.producedDateTime)).isValid()
            ? moment(new Date(value?.producedDateTime))
            : "",
        courtName: value?.courtName,
        courtOrders: value?.courtOrders,
        remandedUTNumber: value?.remandedUTNumber,
        nameOfJail: value?.nameOfJail,
        releasedOn:
          value?.releasedOn && moment(new Date(value?.releasedOn)).isValid()
            ? moment(new Date(value?.releasedOn))
            : "",
        conditionsImposed: value?.conditionsImposed,
        toAppearBeforeIo: value?.toAppearBeforeIo,
        cooperateWithIo: value?.cooperateWithIo,
        remandID: value?.remandID,
        selectDaysOfWeek: value?.selectDaysOfWeek,
        selectPeriod: selectPeriodArr,
        fromToDates: fromToDatesArr,
      });
    }
  };

  const disabledDate = (current) => {
    if (current.valueOf() <= form.getFieldValue()?.producedDateTime) {
      return true;
    }
  };

  const onCourtOrderChange = (val) => {
    setSelectedCourtOrder(val);
    checkFields();
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayRemandReportFields = (name) => {
    switch (name) {
      case "producedDateTime":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            style={{ width: 230 }}
            disabledDate={disableFutureDates}
            disabled={viewRemandReportDetails || disableForm}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          checkFields,
          handleSearch,
          serchText,
          230,
          viewRemandReportDetails || disableForm
        );
      case "courtOrders":
        return renderFieldsWithDropDown(
          courtOrders,
          onCourtOrderChange,
          handleSearch,
          serchText,
          230,
          viewRemandReportDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewRemandReportDetails || disableForm}
          />
        );
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
    editRemandReportObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const displayRemandReportForm = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          const isLabel = s.label === "Produced On";
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[
                  {
                    required: isLabel,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  function appearBeforeChange(e) {
    setToAppearBeforeIo(e.target.checked);
    checkFields();
  }

  const getSavedData = () => {
    let savedData = [];
    isArray(remandReportList) &&
      !isEmpty(remandReportList) &&
      // eslint-disable-next-line array-callback-return
      remandReportList.map((data) => {
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

  const getNonsavedAccused = () => {
    let result = getAccusedDropdownData();
    getSavedData() &&
      isArray(getSavedData()) &&
      getSavedData().length > 0 &&
      getSavedData().forEach((crele) => {
        crele?.selectedRecord?.accusedId?.length > 0 &&
          crele?.selectedRecord?.accusedId.forEach((wit) => {
            remove(result, { _id: wit._id });
          });
      });
    return result;
  };
  const handleAddedSuretyDetails = () => {
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
        headerTitle="Remand Report"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        disableButton={!formValid || disableForm}
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
                      label="Select Accused"
                      rules={[
                        { required: true, message: "Please Select Accused!" },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        mode="multiple"
                        onSearch={handleSearch}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        onSelect={checkFields}
                        disabled={
                          viewRemandReportDetails ||
                          editRemandReportObj?._id ||
                          disableForm
                        }
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          (editRemandReportObj
                            ? getAccusedDropdownData()
                            : getNonsavedAccused()
                          ).map((item, index) => (
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
                  </Col>
                </Row>
                <Card className="card-style">
                  {displayRemandReportForm(
                    remandReportForm,
                    displayRemandReportFields
                  )}
                </Card>
                {selectedCourtOrder === "Remanded" ? (
                  <Card className="card-style">
                    <Row glutter={24}>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="remandedUTNumber"
                          label="Remanded UT number"
                        >
                          <Input
                            onChange={checkFields}
                            style={{ width: 230 }}
                            maxLength={textFieldRules.maxLength}
                            disabled={viewRemandReportDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="fromToDates"
                          label="From Date & To Date"
                        >
                          <RangePicker
                            format={DATE_FORMAT}
                            onChange={checkFields}
                            style={{ width: 230 }}
                            disabled={viewRemandReportDetails || disableForm}
                            disabledDate={disabledDate}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item name="nameOfJail" label="Name of the Jail">
                          {renderFieldsWithDropDown(
                            jailsNameList,
                            checkFields,
                            handleSearch,
                            serchText,
                            200,
                            viewRemandReportDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6} style={{ marginBottom: 10 }}>
                        <Form.Item name="releasedOn" label="Released On">
                          <DatePicker
                            format={DATE_FORMAT}
                            style={{ width: 200 }}
                            disabled={viewRemandReportDetails || disableForm}
                            onChange={checkFields}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ) : null}
                {selectedCourtOrder === "Released on Bail" ? (
                  <Card className="card-style">
                    <Row glutter={24}>
                      <Col span={12}>
                        <Form.Item
                          name="conditionsImposed"
                          label="Conditions Imposed"
                          rules={[textAreaRules.textAreaMaxLength]}
                        >
                          <TextArea
                            rows={7}
                            maxLength={textAreaRules.maxLength}
                            placeholder="Enter Conditions Imposed"
                            disabled={viewRemandReportDetails || disableForm}
                            onChange={checkFields}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6} style={{ marginLeft: 25, marginTop: 20 }}>
                        <div style={styles.widgetPageStyle}>
                          <Form.Item
                            name="toAppearBeforeIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              onChange={(e) => appearBeforeChange(e)}
                              disabled={viewRemandReportDetails || disableForm}
                            />
                          </Form.Item>
                          <div style={{ paddingTop: 5 }}>
                            <span
                              style={{
                                paddingLeft: 5,
                                verticalAlign: "text-bottom",
                              }}
                            >
                              To appear before IO?
                            </span>
                          </div>
                        </div>
                        {toAppearBeforeIo ||
                        form.getFieldValue()?.toAppearBeforeIo ? (
                          <>
                            <Form.Item
                              name="selectDaysOfWeek"
                              label="Select Days Of Week"
                            >
                              {renderFieldsWithMultipleDropDown(
                                getDaysOfWeeks,
                                checkFields,
                                handleSearch,
                                serchText,
                                200,
                                viewRemandReportDetails || disableForm
                              )}
                            </Form.Item>
                            <Form.Item
                              name="selectPeriod"
                              label="Select Period"
                            >
                              <RangePicker
                                format={DATE_FORMAT}
                                style={{ width: 200 }}
                                disabled={
                                  viewRemandReportDetails || disableForm
                                }
                                onChange={checkFields}
                              />
                            </Form.Item>
                          </>
                        ) : null}
                      </Col>
                      <Col span={4} style={{ marginLeft: 25, marginTop: 20 }}>
                        <div style={styles.widgetPageStyle}>
                          <Form.Item
                            name="cooperateWithIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              onChange={checkFields}
                              disabled={viewRemandReportDetails || disableForm}
                            />
                          </Form.Item>
                          <div style={{ paddingTop: 5 }}>
                            <span
                              style={{
                                paddingLeft: 5,
                                verticalAlign: "text-bottom",
                              }}
                            >
                              Co-operate with IO
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row style={{ marginTop: 50 }}>
                      <div
                        className="popupLink"
                        onClick={() => handleAddedSuretyDetails()}
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
              templateLists={remandReportTemplates}
              showModal={showModal}
              disabled={
                viewRemandReportDetails ||
                !editRemandReportObj?._id ||
                disableForm
              }
              selectedRecord={editRemandReportObj}
              selectedModule="remandReport"
              accusedId={editRemandReportObj?.accusedId?._id}
            />
            {!isEmpty(remandReportList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {remandReportList && remandReportList.length > 0
                  ? remandReportList.length
                  : 0}{" "}
                Remand Report Records
              </Button>
            ) : null}
            <Modal
              title="Remand Report Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditRemandReport}
                  setViewDetails={setViewRemandReportDetails}
                  selectedRecord={editRemandReportObj}
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
