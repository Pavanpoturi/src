/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import ContentHeader from "../../ContentHeader";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import axios from "axios";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
  Checkbox,
  notification,
  Modal,
} from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
  getAccuseds,
  accusedLists,
  allAccusedCCLLists,
  masterDataType,
  getStaffsDetails,
  getSavedDataResult,
  onFileChange,
  dummyRequest,
  folderName,
  getDistrictsNames,
  getMediaUploadError,
  getDaysOfWeeks,
  getStateNames,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  PTWarrantTemplates,
  ptWarrantForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import ptWarrantActions from "@redux/investigations/ptWarrant/actions";
import {
  addPTWarrantPayload,
  updatePTWarrantPayload,
} from "./ptWarrantPayloads";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isUndefined, first, isArray, isNull } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import TemplatesModal from "../CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function PTWarrant({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [selectedState, setSelectedState] = useState("Within State");
  const [grantedState, setGrantedState] = useState("Bail Granted");
  const { warrantWithinState, warrantOutOfState } = ptWarrantForm;
  const [viewPTWarrantDetails, setViewPTWarrantDetails] = useState(false);
  const [editPTWarrantObj, setEditPTWarrantObj] = useState(null);
  const [serchText, setSerchText] = useState("");
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const { getAccusedList } = suspectAccusedAction;
  const { createAuditHistory } = auditHistoryActions;
  const [addAnother, setAddAnother] = useState(false);
  const [ptWarrantURL, setPtWarrantURL] = useState([]);
  const [otherSelectedState, setOtherSelectedState] = useState("");
  const [selectedPtWarrantURL, setSelectedPtWarrantURL] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { savedFir } = useSelector((state) => state.createFIR);

  const {
    actionType,
    errorMessage,
    isFetching,
    ptWarrantList,
    successMessage,
  } = useSelector((state) => state.PTWarrant);

  const {
    addPTWarrantDetails,
    updatePTWarrantDetails,
    getPTWarrantList,
    resetActionType,
  } = ptWarrantActions;

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const { staffList, statesNameList, stateDistrictList, courtsFromPSList } =
    useSelector((state) => state.MasterData);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const {
    getStaffList,
    getStateDistrictList,
    getStatesName,
    getCourtsBasedonPsCode,
  } = masterDataActions;

  const isSuccess =
    actionType === "ADD_PT_WARRANT_SUCCESS" ||
    actionType === "UPDATE_PT_WARRANT_SUCCESS";

  const isError =
    actionType === "ADD_PT_WARRANT_ERROR" ||
    actionType === "UPDATE_PT_WARRANT_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_PT_WARRANT_SUCCESS"
        ? "Transit Warrant Created"
        : "Transit Warrant Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/transitWarrant",
          auditType
        )
      )
    );
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    dispatch(getPTWarrantList(`${config.ptWarrant}?crimeId=${crimeId}`));
    dispatch(getStatesName(`${config.getMasterData}/${masterDataType.STATES}`));

    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=TELANGANA`
      )
    );
  }, []);
  const stateNames = () => getStateNames(statesNameList);

  useEffect(() => {
    if (selectedState === "Within State") {
      dispatch(
        getStateDistrictList(
          `${config.masterData}/getStateDistrict?state=TELANGANA`
        )
      );
    }
  }, [selectedState]);

  const districtsNames = () =>
    !isEmpty(stateDistrictList) && getDistrictsNames(stateDistrictList);

  useEffect(() => {
    fetchAccusedList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Transit Warrant Successfully Added" ||
        successMessage === "Transit Warrant Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewPTWarrantDetails(false);
          setEditPTWarrantObj(null);
          dispatch(getPTWarrantList(`${config.ptWarrant}?crimeId=${crimeId}`));
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getAccusedData = () =>
    getAccuseds(allAccusedCCLLists(suspectAccusedList));

  const staffMembersList = staffList && getStaffsDetails(staffList);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditPTWarrant = (value) => {
    if (value) {
      setEditPTWarrantObj(value);
      const { ptWarrant } = value;
      const { courtOrders } = ptWarrant;
      const selectPeriodArr = [];
      if (courtOrders?.selectPeriod?.length > 0) {
        selectPeriodArr.push(
          moment(new Date(courtOrders.selectPeriod[0])).isValid()
            ? moment(new Date(courtOrders.selectPeriod[0]))
            : ""
        );
        selectPeriodArr.push(
          moment(new Date(courtOrders.selectPeriod[1])).isValid()
            ? moment(new Date(courtOrders.selectPeriod[1]))
            : ""
        );
      }
      setSelectedState(ptWarrant?.warrentType);
      setGrantedState(courtOrders?.grantType);

      if (courtOrders.ptWarrantURL && courtOrders.ptWarrantURL?.url !== "") {
        setSelectedPtWarrantURL([
          {
            url: courtOrders?.ptWarrantURL?.url,
            name: courtOrders?.ptWarrantURL?.name,
            fileId: courtOrders?.ptWarrantURL?.fileId,
          },
        ]);
      } else {
        setSelectedPtWarrantURL([]);
      }
      setOtherSelectedState(ptWarrant?.otherState);
      form.setFieldsValue({
        accusedId: [value?.accusedId._id],
        warrentType: ptWarrant?.warrentType,
        dateTimeOfArrest: moment(
          new Date(ptWarrant?.dateTimeOfArrest)
        ).isValid()
          ? moment(new Date(ptWarrant?.dateTimeOfArrest))
          : "",
        placeOfArrest: ptWarrant?.placeOfArrest,
        district: ptWarrant?.district,
        otherState: ptWarrant?.otherState,
        dateOfPTWarrantRequistion: moment(
          new Date(ptWarrant?.dateOfPTWarrantRequistion)
        ).isValid()
          ? moment(new Date(ptWarrant?.dateOfPTWarrantRequistion))
          : "",
        courtName: ptWarrant?.courtName,
        selectTeamToGoOut: ptWarrant?.selectTeamToGoOut,
        dateOfRequestForUnitOfficer: moment(
          new Date(ptWarrant?.dateOfRequestForUnitOfficer)
        ).isValid()
          ? moment(new Date(ptWarrant?.dateOfRequestForUnitOfficer))
          : "",
        dateOfTravelToOtherState: moment(
          new Date(ptWarrant?.dateOfTravelToOtherState)
        ).isValid()
          ? moment(new Date(ptWarrant?.dateOfTravelToOtherState))
          : "",
        grantType: courtOrders?.grantType,
        toAppearBeforeIo: courtOrders?.toAppearBeforeIo,
        cooperateWithIo: courtOrders?.cooperateWithIo,
        conditionsImposed: courtOrders?.conditionsImposed,
        selectDaysOfWeek: courtOrders?.selectDaysOfWeek,
        selectPeriod: selectPeriodArr,
        dateTimeOfArrivalToPS: moment(
          new Date(courtOrders?.dateTimeOfArrivalToPS)
        ).isValid()
          ? moment(new Date(courtOrders?.dateTimeOfArrivalToPS))
          : "",
      });
    }
  };

  const savedPTWarrantURL = editPTWarrantObj?.ptWarrant.courtOrders
    ?.ptWarrantURL
    ? editPTWarrantObj?.ptWarrant.courtOrders?.ptWarrantURL
    : "";

  const submit = async () => {
    const values = await form.validateFields();
    const ptWarrantURLData = new FormData();
    ptWarrantURL.forEach((file) => {
      ptWarrantURLData.append("file", file.originFileObj);
    });
    ptWarrantURLData.append("prefixFolder", crimeId);
    ptWarrantURLData.append(
      "folderPath",
      `${crimeId}/${folderName.PT_WARRANT}/file`
    );

    if (!isEmpty(ptWarrantURL)) {
      axios
        .post(`${config.fileUpload}/upload`, ptWarrantURLData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addPTWarrantPayload(
              values,
              crimeId,
              selectedState,
              grantedState,
              getFilePayload(payloadData)
            );
            const updatePayload = updatePTWarrantPayload(
              values,
              crimeId,
              editPTWarrantObj?._id ? editPTWarrantObj?._id : null,
              selectedState,
              grantedState,
              getFilePayload(payloadData)
            );

            if (editPTWarrantObj?._id) {
              dispatch(updatePTWarrantDetails(config.ptWarrant, updatePayload));
            } else {
              dispatch(addPTWarrantDetails(config.ptWarrant, addPayload));
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(ptWarrantURL)) {
      const addPayload = addPTWarrantPayload(
        values,
        crimeId,
        selectedState,
        grantedState,
        savedPTWarrantURL
      );
      const updatePayload = updatePTWarrantPayload(
        values,
        crimeId,
        editPTWarrantObj?._id ? editPTWarrantObj?._id : null,
        selectedState,
        grantedState,
        savedPTWarrantURL
      );

      if (editPTWarrantObj?._id) {
        dispatch(updatePTWarrantDetails(config.ptWarrant, updatePayload));
      } else {
        dispatch(addPTWarrantDetails(config.ptWarrant, addPayload));
      }
    }
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayWarrantWithinStateFields = (name) => {
    switch (name) {
      case "dateTimeOfArrest":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewPTWarrantDetails || disableForm}
          />
        );
      case "district":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            disabled={viewPTWarrantDetails || disableForm}
            onSearch={handleSearch}
            filterOption={(input, option) =>
              serchText &&
              option.props.label
                .toString()
                .toLowerCase()
                .indexOf(input.toString().toLowerCase()) >= 0
            }
          >
            {isArray(districtsNames()) &&
              districtsNames().map((item, index) => (
                <Option key={index} value={item.label} label={item.label}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      case "dateOfPTWarrantRequistion":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewPTWarrantDetails || disableForm}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          200,
          viewPTWarrantDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPTWarrantDetails || disableForm}
          />
        );
    }
  };

  const onOtherStateSelect = (state) => {
    dispatch(
      getStateDistrictList(
        `${config.masterData}/getStateDistrict?state=${state}`
      )
    );
  };

  const displayWarrantOutOfStateFields = (name) => {
    switch (name) {
      case "dateTimeOfArrest":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewPTWarrantDetails || disableForm}
          />
        );
      case "otherState":
        return renderFieldsWithDropDown(
          stateNames(),
          onOtherStateSelect,
          handleSearch,
          serchText,
          200,
          viewPTWarrantDetails || disableForm
        );
      case "district":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            disabled={viewPTWarrantDetails || disableForm}
            onSearch={handleSearch}
            filterOption={(input, option) =>
              serchText &&
              option.props.label
                .toString()
                .toLowerCase()
                .indexOf(input.toString().toLowerCase()) >= 0
            }
          >
            {isArray(districtsNames()) &&
              districtsNames().map((item, index) => (
                <Option key={index} value={item.label} label={item.label}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      case "dateOfPTWarrantRequistion":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewPTWarrantDetails || disableForm}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtsFromPSList &&
            courtsFromPSList &&
            isArray(courtsFromPSList) &&
            isArray(courtsFromPSList) &&
            courtsFromPSList.map(({ court }) => ({ label: court })),
          null,
          handleSearch,
          serchText,
          200,
          viewPTWarrantDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPTWarrantDetails || disableForm}
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
    editPTWarrantObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  function onChange(e) {
    checkFields();
    setToAppearBeforeIo(e.target.checked);
  }

  const checkStateValue = (e) => {
    setSelectedState(e.target.value);
    form.setFieldsValue({
      otherStateSelect: "",
      district: "",
    });
    checkFields();
  };

  const checkGrantedValue = (e) => {
    setGrantedState(e.target.value);
    checkFields();
  };

  const displayWarrantState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayRequestStatus = (title, value) => {
    return (
      <Row gutter={24}>
        <Col span={10} style={{ color: "#707070" }}>
          {title}
        </Col>
        <Col
          span={4}
          style={{
            marginLeft: "15%",
            color: value === "Rejected" ? "red" : "#258C0B",
          }}
        >
          {value}
        </Col>
      </Row>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(ptWarrantList) &&
      !isEmpty(ptWarrantList) &&
      // eslint-disable-next-line array-callback-return
      ptWarrantList.map((data) => {
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Transit Warrant"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewPTWarrantDetails || disableForm}
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
                      label="Select Accused (Multiple)"
                    >
                      <Select
                        mode="multiple"
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
                        onSelect={checkFields}
                        disabled={
                          viewPTWarrantDetails ||
                          editPTWarrantObj?._id ||
                          disableForm
                        }
                      >
                        {getAccusedData().map((item, index) => (
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
                  <Col className="custody-col">
                    <Form.Item name="warrentType">
                      <Radio.Group
                        name="radiogroup"
                        onChange={checkStateValue}
                        defaultValue={selectedState}
                        disabled={viewPTWarrantDetails || disableForm}
                      >
                        <Radio value="Within State">Within State</Radio>
                        <Radio value="Out of State">Out of State</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  {selectedState === "Within State"
                    ? displayWarrantState(
                        warrantWithinState,
                        displayWarrantWithinStateFields
                      )
                    : null}
                  {selectedState === "Out of State" ? (
                    <Row>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="selectTeamToGoOut"
                          label="Select Team to go out of state"
                        >
                          {renderFieldsWithMultipleDropDown(
                            staffMembersList,
                            checkFields,
                            handleSearch,
                            serchText,
                            200,
                            viewPTWarrantDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                      {editPTWarrantObj?._id ? (
                        <Col span={8} style={{ marginBottom: 10 }}>
                          {displayRequestStatus("Requested On", "")}
                          {displayRequestStatus("Requested Status", "")}
                          {displayRequestStatus("Received On", "")}
                        </Col>
                      ) : null}
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="dateOfRequestForUnitOfficer"
                          label="Date of Request for Unit Officer"
                        >
                          <DatePicker
                            format={DATE_FORMAT}
                            placeholder="Select Date"
                            onChange={checkFields}
                            style={{ width: 200 }}
                            disabledDate={disableFutureDates}
                            disabled={viewPTWarrantDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="dateOfTravelToOtherState"
                          label="Date of Travel to other State"
                        >
                          <DatePicker
                            format={DATE_FORMAT}
                            placeholder="Select Date"
                            onChange={checkFields}
                            style={{ width: 200 }}
                            disabledDate={disableFutureDates}
                            disabled={viewPTWarrantDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      {displayWarrantState(
                        warrantOutOfState,
                        displayWarrantOutOfStateFields
                      )}
                    </Row>
                  ) : null}
                </Card>
                <Card className="card-style">
                  <Row>
                    <div className="courtOrders">
                      <h6 style={{ marginBottom: 10 }}>
                        <b>Court Orders</b>
                      </h6>{" "}
                      <Form.Item name="grantType">
                        <Radio.Group
                          name="radiogroup"
                          onChange={checkGrantedValue}
                          defaultValue={grantedState}
                          disabled={viewPTWarrantDetails || disableForm}
                        >
                          <Radio value="Bail Granted">Bail Granted</Radio>
                          <Radio value="Transit Warrant Granted">
                            Transit Warrant Granted
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>

                    <Col className="custody-col file-upload">
                      <Form.Item name="ptWarrantURL">
                        <Upload
                          fileList={
                            editPTWarrantObj?._id && savedPTWarrantURL !== ""
                              ? selectedPtWarrantURL
                              : ptWarrantURL
                          }
                          onPreview={handleDownload}
                          customRequest={dummyRequest}
                          onChange={(info) =>
                            onFileChange(info, setPtWarrantURL)
                          }
                          multiple={false}
                        >
                          <Button
                            className="saveButton"
                            style={{ width: 215 }}
                            icon={<CameraFilled />}
                            disabled={
                              viewPTWarrantDetails ||
                              !isEmpty(ptWarrantURL) ||
                              disableForm
                            }
                          >
                            {grantedState === "Transit Warrant Granted"
                              ? "Upload Transit Warrant"
                              : "Upload Court  Orders"}
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row className="text-area-row" style={{ marginTop: 10 }}>
                    {grantedState === "Bail Granted" ? (
                      <>
                        <Col className="custody-col text-area">
                          <Form.Item
                            name="conditionsImposed"
                            label="Conditions Imposed"
                          >
                            <Input.TextArea
                              onChange={checkFields}
                              style={{ width: 700 }}
                              autoSize={{ minRows: 4, maxRows: 5 }}
                              rows={5}
                              disabled={viewPTWarrantDetails || disableForm}
                            />
                          </Form.Item>
                        </Col>
                        <Col className="custody-col">
                          <div className="checkboxcontent">
                            <Form.Item
                              name="toAppearBeforeIo"
                              valuePropName="checked"
                            >
                              <Checkbox
                                onChange={onChange}
                                disabled={viewPTWarrantDetails || disableForm}
                              >
                                To appear before IO
                              </Checkbox>
                            </Form.Item>
                            <Form.Item
                              name="cooperateWithIo"
                              valuePropName="checked"
                              onChange={checkFields}
                            >
                              <Checkbox
                                disabled={viewPTWarrantDetails || disableForm}
                              >
                                Co-operate with IO
                              </Checkbox>
                            </Form.Item>
                          </div>
                          {toAppearBeforeIo ||
                          form.getFieldValue()?.toAppearBeforeIo ? (
                            <>
                              <Form.Item
                                name="selectDaysOfWeek"
                                label="Select Days Of Week"
                                style={{ paddingLeft: 20, paddingTop: 20 }}
                              >
                                {renderFieldsWithMultipleDropDown(
                                  getDaysOfWeeks,
                                  checkFields,
                                  handleSearch,
                                  serchText,
                                  200,
                                  viewPTWarrantDetails || disableForm
                                )}
                              </Form.Item>
                              <Form.Item
                                name="selectPeriod"
                                label="Select Period"
                                style={{ paddingLeft: 20 }}
                              >
                                <RangePicker
                                  format={DATE_FORMAT}
                                  style={{ width: 200 }}
                                  disabled={viewPTWarrantDetails || disableForm}
                                  onChange={checkFields}
                                />
                              </Form.Item>
                            </>
                          ) : null}
                        </Col>
                      </>
                    ) : (
                      <Col className="custody-col">
                        <Form.Item
                          name="dateTimeOfArrivalToPS"
                          label="Date & Time of Arrival to PS"
                        >
                          <DatePicker
                            placeholder="Select Date & Time"
                            onChange={checkFields}
                            style={{ width: 222 }}
                            showTime
                            disabled={viewPTWarrantDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                </Card>
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={PTWarrantTemplates}
              showModal={showModal}
              disabled={
                viewPTWarrantDetails || !editPTWarrantObj?._id || disableForm
              }
              selectedRecord={editPTWarrantObj}
              selectedModule="PTWarrant"
              accusedId={editPTWarrantObj?.accusedId?._id}
            />
            {!isEmpty(ptWarrantList) ? (
              <Button
                style={{ marginTop: "40px", width: "90%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {ptWarrantList && ptWarrantList.length > 0
                  ? ptWarrantList.length
                  : 0}{" "}
                Transit Warrant Records
              </Button>
            ) : null}
            <Modal
              title="Transit Warrant Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditPTWarrant}
                  setViewDetails={setViewPTWarrantDetails}
                  selectedRecord={editPTWarrantObj}
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
    </ModuleWrapper>
  );
}
