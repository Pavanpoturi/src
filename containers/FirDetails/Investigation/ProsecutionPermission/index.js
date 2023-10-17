/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import axios from "axios";
import {
  first,
  isBoolean,
  isEmpty,
  isUndefined,
  isArray,
  isNull,
} from "lodash";
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
  Checkbox,
} from "antd";
import moment from "moment";
import {
  dummyRequest,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDown,
  DATE_FORMAT,
  getAccuseds,
  DATE_YY_MM_DD,
  getSavedDataResult,
  onFileChange,
  folderName,
  getFilePayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import { getFileById } from "@containers/media-util";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import prosecutionPermissionAction from "@redux/investigations/prosecutionPermission/actions";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import {
  prosecutionofAccusedForm,
  prosecutionofAccusedFormNon,
  closureOfCaseForm,
  deletionOfAccusedForm,
  natureOfPermission,
  OffenceList,
  prosecutionofAccusedCompetentAuthority,
  competentAuthorityList,
  natureOfClosure,
  reasonForDeletion,
} from "./const";
import {
  prosecutionofAccusedPayload,
  closureOfCasePayload,
  deletionOfAccusedPayload,
} from "./ProsecutionPermissionPayloads";
import { ModuleWrapper } from "../CommonDetails/styles";
import OtherLinks from "./OtherLinks";
import SavedRecords from "./SavedRecords";
import AccusedCard from "../CommonForms/AccusedCard";
import ContentHeader from "../../ContentHeader";

const Option = Select.Option;

export default function ProsecutionPermission({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [addAnother, setAddAnother] = useState(false);
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [uploadReport, setUploadReport] = useState([]);
  const [selectedUploadReport, setSelectedUploadReport] = useState([]);
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    addProsecutionPermissionDetails,
    updateProsecutionPermissionDetails,
    getProsecutionPermissionList,
    resetActionType,
  } = prosecutionPermissionAction;
  const { getAccusedList } = suspectAccusedAction;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const {
    actionType,
    errorMessage,
    isFetching,
    prosecutionPermissionList,
    successMessage,
  } = useSelector((state) => state.ProsecutionPermission);
  const { createAuditHistory } = auditHistoryActions;
  const [editProsecutionPermissionObj, setEditProsecutionPermissionObj] =
    useState(null);
  const [selectedNatureOfPermission, setSelectedNatureOfPermission] =
    useState("");
  const [formValid, setFormValid] = useState(false);
  const [
    viewProsecutionPermissionDetails,
    setViewProsecutionPermissionDetails,
  ] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [selecteddDateOfRequisition, setSelecteddDateOfRequisition] =
    useState("");
  const [selecteddDateOfReceipt, setSelecteddDateOfReceipt] = useState("");
  const [selectedOffenceForPermission, setSelectedOffenceForPermission] =
    useState([]);

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const isIndianArmsAct =
    selectedOffenceForPermission.includes("Indian Arms Act");
  const isExplosives = selectedOffenceForPermission.includes(
    "Explosives Substance Act"
  );

  const isSuccess =
    actionType === "ADD_PROSECUTION_PERMISSION_SUCCESS" ||
    actionType === "UPDATE_PROSECUTION_PERMISSION_SUCCESS";

  const isError =
    actionType === "ADD_PROSECUTION_PERMISSION_ERROR" ||
    actionType === "UPDATE_PROSECUTION_PERMISSION_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_PROSECUTION_PERMISSION_SUCCESS"
        ? "Prosecution Permission Created"
        : "Prosecution Permission Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/prosecutionPermission",
          auditType
        )
      )
    );
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetchProsecutionPermission = () => {
    dispatch(
      getProsecutionPermissionList(
        `${config.prosecutionPermission}?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Superior Officers Permission Successfully Added" ||
        successMessage === "Superior Officers Permission Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setUploadReport([]);
        setSelectedUploadReport([]);
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewProsecutionPermissionDetails(false);
          setEditProsecutionPermissionObj(null);
          fetchProsecutionPermission();
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
    fetchProsecutionPermission();
  }, []);

  const dispatchProsecutionPermission = (id, payload) => {
    if (id) {
      dispatch(
        updateProsecutionPermissionDetails(
          config.prosecutionPermission,
          payload
        )
      );
    } else {
      dispatch(
        addProsecutionPermissionDetails(config.prosecutionPermission, payload)
      );
    }
  };

  const getPayloadResultByNatureOfPermission = (values, uploadedData) => {
    let payloadResult = {};
    if (selectedNatureOfPermission === "Prosecution of Accused") {
      payloadResult = prosecutionofAccusedPayload(values);
    } else if (selectedNatureOfPermission === "Closure of Case") {
      payloadResult = closureOfCasePayload(values, uploadedData);
    } else {
      payloadResult = deletionOfAccusedPayload(values, uploadedData);
    }
    return payloadResult;
  };

  const closerOfCaseOrderUrl =
    editProsecutionPermissionObj?.forClosureOfCase?.orderUrl?.url;
  const deletionOfAccusedOrderUrl =
    editProsecutionPermissionObj?.deletionOfAccused?.orderUrl?.url;

  const closerOfCaseFileList =
    editProsecutionPermissionObj?._id && closerOfCaseOrderUrl !== ""
      ? selectedUploadReport
      : uploadReport;

  const deletionOfAccusedFileList =
    editProsecutionPermissionObj?._id && deletionOfAccusedOrderUrl !== ""
      ? selectedUploadReport
      : uploadReport;

  const submit = async () => {
    const values = await form.validateFields();
    const orderUrlData = new FormData();
    uploadReport.forEach((file) => {
      orderUrlData.append("file", file.originFileObj);
    });
    orderUrlData.append("prefixFolder", crimeId);
    orderUrlData.append(
      "folderPath",
      `${crimeId}/${folderName.PROCECUTION_PERMISSION}/media`
    );

    const prosecutionPermissionId = editProsecutionPermissionObj?._id;
    const isClosureOfCase =
      editProsecutionPermissionObj?.natureOfPermissionRequired ===
      "Closure of Case";
    const isDeletionOfAccused =
      editProsecutionPermissionObj?.natureOfPermissionRequired ===
      "Deletion of Accused";

    if (!isEmpty(uploadReport)) {
      axios
        .post(`${config.fileUpload}/upload`, orderUrlData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const resportData = first(data);
            const payloadResult = getPayloadResultByNatureOfPermission(
              values,
              getFilePayload(resportData)
            );
            const addPayload = {
              crimeId: crimeId,
              accusedId: values.accusedId,
              natureOfPermissionRequired: values.natureOfPermissionRequired,
              ...payloadResult,
            };
            const updatePayload = {
              _id: prosecutionPermissionId ? prosecutionPermissionId : null,
              crimeId: crimeId,
              accusedId: values.accusedId,
              natureOfPermissionRequired: values.natureOfPermissionRequired,
              ...payloadResult,
            };
            const payloadData = prosecutionPermissionId
              ? updatePayload
              : addPayload;
            dispatchProsecutionPermission(prosecutionPermissionId, payloadData);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else {
      let savedOrderDetails = {};
      if (isClosureOfCase) {
        savedOrderDetails =
          editProsecutionPermissionObj?.forClosureOfCase?.orderUrl;
      } else if (isDeletionOfAccused) {
        savedOrderDetails =
          editProsecutionPermissionObj?.deletionOfAccused?.orderUrl;
      } else {
        savedOrderDetails = {};
      }
      const payloadResult = getPayloadResultByNatureOfPermission(
        values,
        savedOrderDetails
      );
      const addPayload = {
        crimeId: crimeId,
        accusedId: values.accusedId,
        natureOfPermissionRequired: values.natureOfPermissionRequired,
        ...payloadResult,
      };
      const updatePayload = {
        _id: prosecutionPermissionId ? prosecutionPermissionId : null,
        crimeId: crimeId,
        accusedId: values.accusedId,
        natureOfPermissionRequired: values.natureOfPermissionRequired,
        ...payloadResult,
      };
      const payloadData = prosecutionPermissionId ? updatePayload : addPayload;
      dispatchProsecutionPermission(prosecutionPermissionId, payloadData);
    }
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onNatureOfPermissionChange = (val) => {
    setSelectedNatureOfPermission(val);
    setUploadReport([]);
    setSelectedUploadReport([]);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onOffenceForPermissionChange = (val) => {
    setSelectedOffenceForPermission(val);
    checkFields();
  };

  const dateOfRequisitionChange = (date, _dateString) => {
    setSelecteddDateOfRequisition(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const dateOfReceiptChange = (date, _dateString) => {
    setSelecteddDateOfReceipt(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const isValidDateOfReceipt =
    selecteddDateOfRequisition &&
    selecteddDateOfReceipt &&
    moment(selecteddDateOfReceipt).isAfter(selecteddDateOfRequisition);

  const displayFields = (name) => {
    switch (name) {
      case "competentAuthorityClosure":
        return renderFieldsWithDropDown(
          competentAuthorityList,
          null,
          handleSearch,
          serchText,
          200,
          viewProsecutionPermissionDetails || disableForm
        );
      case "competentAuthorityDeletion":
        return renderFieldsWithDropDown(
          competentAuthorityList,
          null,
          handleSearch,
          serchText,
          200,
          viewProsecutionPermissionDetails || disableForm
        );
      case "dateOfSubmissionToUnitOfficer":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
      case "reportForwardDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
      case "govSanctionDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
      case "natureOfClosure":
        return renderFieldsWithDropDown(
          natureOfClosure,
          null,
          handleSearch,
          serchText,
          200,
          viewProsecutionPermissionDetails || disableForm
        );
      case "dateOfRequisitionToSuperiorOfficer":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={dateOfRequisitionChange}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
      case "dateOfReceiptOfPermission":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={dateOfReceiptChange}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
      case "reasonForDeletion":
        return renderFieldsWithDropDown(
          reasonForDeletion,
          null,
          handleSearch,
          serchText,
          200,
          viewProsecutionPermissionDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewProsecutionPermissionDetails || disableForm}
          />
        );
    }
  };

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col span={8} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const getAccusedDropdownData = () => getAccuseds(suspectAccusedList);
  const accusedPersonalDetails = first(
    getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
  );

  const handleEditProsecutionPermission = (value) => {
    if (value) {
      setEditProsecutionPermissionObj(value);
      setSelectedAccusedValue(value.accusedId?._id);
      setSelectedNatureOfPermission(value.natureOfPermissionRequired);
      const isClosureOfCase =
        value?.natureOfPermissionRequired === "Closure of Case";
      const isDeletionOfAccused =
        value?.natureOfPermissionRequired === "Deletion of Accused";
      if (isClosureOfCase && value?.forClosureOfCase?.orderUrl?.url !== "") {
        setSelectedUploadReport([value?.forClosureOfCase?.orderUrl]);
      } else if (
        isDeletionOfAccused &&
        value?.deletionOfAccused?.orderUrl?.url !== ""
      ) {
        setSelectedUploadReport([value?.deletionOfAccused?.orderUrl]);
      } else {
        setSelectedUploadReport([]);
      }
      setSelectedOffenceForPermission(
        value?.forProsecutionOfAccused?.offenceForPermission
      );
      const dateOfRequisitionToSuperiorOfficer = isClosureOfCase
        ? value.forClosureOfCase?.dateOfRequisitionToSuperiorOfficer
        : value.deletionOfAccused?.dateOfRequisitionToSuperiorOfficer;
      const dateOfReceiptOfPermission = isClosureOfCase
        ? value.forClosureOfCase?.dateOfReceiptOfPermission
        : value.deletionOfAccused?.dateOfReceiptOfPermission;
      form.setFieldsValue({
        accusedId: isClosureOfCase ? "" : value.accusedId?._id,
        natureOfPermissionRequired: value.natureOfPermissionRequired,
        offenceForPermission:
          value.forProsecutionOfAccused?.offenceForPermission,
        competentAuthority: value.forProsecutionOfAccused?.competentAuthority,
        dateOfSubmissionToUnitOfficer: moment(
          new Date(value.forProsecutionOfAccused?.dateOfSubmissionToUnitOfficer)
        ).isValid()
          ? moment(
              new Date(
                value.forProsecutionOfAccused?.dateOfSubmissionToUnitOfficer
              )
            )
          : "",
        superiorOfficerPermissionAccused:
          value.forProsecutionOfAccused?.superiorOfficerPermission,
        reportForwardDate: moment(
          new Date(value.forProsecutionOfAccused?.reportForwardDate)
        ).isValid()
          ? moment(new Date(value.forProsecutionOfAccused?.reportForwardDate))
          : "",
        govSanctionNum: value.forProsecutionOfAccused?.govSanctionNum,
        govSanctionDate: moment(
          new Date(value.forProsecutionOfAccused?.govSanctionDate)
        ).isValid()
          ? moment(new Date(value.forProsecutionOfAccused?.govSanctionDate))
          : "",
        natureOfClosure: value.forClosureOfCase?.natureOfClosure,
        competentAuthorityClosure: value.forClosureOfCase?.competentAuthority,
        superiorOfficerPermissionCloser:
          value.forClosureOfCase?.superiorOfficerPermission,
        dateOfRequisitionToSuperiorOfficer: moment(
          new Date(dateOfRequisitionToSuperiorOfficer)
        ).isValid()
          ? moment(new Date(dateOfRequisitionToSuperiorOfficer))
          : "",
        superiorOfficerPermissionDeletion:
          value.deletionOfAccused?.superiorOfficerPermission,
        orderNumber: isClosureOfCase
          ? value.forClosureOfCase?.orderNumber
          : value.deletionOfAccused?.orderNumber,
        dateOfReceiptOfPermission: moment(
          new Date(dateOfReceiptOfPermission)
        ).isValid()
          ? moment(new Date(dateOfReceiptOfPermission))
          : "",
        reasonForDeletion: value.deletionOfAccused?.reasonForDeletion,
        competentAuthorityDeletion: value.deletionOfAccused?.competentAuthority,
      });
    }
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(prosecutionPermissionList) &&
      !isEmpty(prosecutionPermissionList) &&
      // eslint-disable-next-line array-callback-return
      prosecutionPermissionList.map((data) => {
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

  const prosecutionOfAccusedFormList =
    isIndianArmsAct || isExplosives
      ? prosecutionofAccusedFormNon
      : prosecutionofAccusedForm;

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const displayUploadReports = (
    fileList,
    title,
    name,
    setAction,
    action,
    width = ""
  ) => {
    return (
      <Col className="file-upload" span={8} style={{ marginBottom: 10 }}>
        <Form.Item name={name}>
          <Upload
            fileList={fileList}
            customRequest={dummyRequest}
            onPreview={handleDownload}
            onChange={(info) => onFileChange(info, setAction)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: width || 215, marginTop: 10 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={
                viewProsecutionPermissionDetails ||
                !isEmpty(action) ||
                disableForm
              }
            >
              {title}
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    );
  };

  const displayCommonFields = (fieldName) => {
    return (
      <>
        <Col span={8}>
          <Form.Item name={fieldName} valuePropName="checked">
            <Checkbox
              onChange={checkFields}
              disabled={viewProsecutionPermissionDetails || disableForm}
            >
              Send to superior officer for permission
            </Checkbox>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="orderNumber" label="Order Number">
            <Input
              onChange={checkFields}
              style={{ width: 200 }}
              maxLength={textFieldRules.maxLength}
              disabled={viewProsecutionPermissionDetails || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="dateOfReceiptOfPermission"
            label="Date of Permission"
          >
            <DatePicker
              format={DATE_FORMAT}
              placeholder="Select Date"
              onChange={dateOfReceiptChange}
              style={{ width: 200 }}
              disabledDate={disableFutureDates}
              disabled={viewProsecutionPermissionDetails || disableForm}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Superior Officers Permission"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={
          viewProsecutionPermissionDetails ||
          (isBoolean(isValidDateOfReceipt) && !isValidDateOfReceipt) ||
          disableForm
        }
      />

      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Row glutter={24} style={{ marginBottom: 20 }}>
                <Col span={8}>
                  <Form.Item
                    name="natureOfPermissionRequired"
                    label="Nature of Permission Required For"
                    rules={[
                      {
                        required: true,
                        message: "Nature of Permission Required For!",
                      },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      natureOfPermission,
                      onNatureOfPermissionChange,
                      handleSearch,
                      serchText,
                      250,
                      viewProsecutionPermissionDetails ||
                        editProsecutionPermissionObj?._id ||
                        disableForm
                    )}
                  </Form.Item>
                </Col>
                {selectedNatureOfPermission !== "Closure of Case" ? (
                  <Col span={8}>
                    <Form.Item
                      name="accusedId"
                      label="Select Accused"
                      rules={[
                        {
                          required: true,
                          message: "Please select Accused!",
                        },
                      ]}
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        style={{ width: 250 }}
                        allowClear
                        mode="multiple"
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
                          viewProsecutionPermissionDetails ||
                          editProsecutionPermissionObj?._id ||
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
                    {selectedAccusedValue !== "" &&
                      editProsecutionPermissionObj?._id && (
                        <AccusedCard
                          accusedPersonalDetails={accusedPersonalDetails}
                          title="Accused Details"
                        />
                      )}
                  </Col>
                ) : null}
              </Row>
              {isBoolean(isValidDateOfReceipt) && !isValidDateOfReceipt ? (
                <div className="ant-form-item-explain-error">
                  Date of receipt of Permission should be later than Date of
                  requisition to superior officer
                </div>
              ) : null}
              {selectedNatureOfPermission === "Prosecution of Accused" ? (
                <Card style={{ marginBottom: 120 }}>
                  <Row glutter={24}>
                    <Col span={8}>
                      <Form.Item
                        name="offenceForPermission"
                        label="Offence for which permission is required"
                      >
                        {renderFieldsWithMultipleDropDown(
                          OffenceList,
                          onOffenceForPermissionChange,
                          handleSearch,
                          serchText,
                          250,
                          viewProsecutionPermissionDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        name="competentAuthority"
                        label="Competent Authority"
                      >
                        {renderFieldsWithDropDown(
                          prosecutionofAccusedCompetentAuthority,
                          null,
                          handleSearch,
                          serchText,
                          200,
                          viewProsecutionPermissionDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={8} style={{ marginTop: 15 }}>
                      <Form.Item
                        name="superiorOfficerPermissionAccused"
                        valuePropName="checked"
                      >
                        <Checkbox
                          onChange={checkFields}
                          disabled={
                            viewProsecutionPermissionDetails || disableForm
                          }
                        >
                          Send to superior officer for permission
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row glutter={24} style={{ marginTop: 10 }}>
                    {displayState(prosecutionOfAccusedFormList, displayFields)}
                  </Row>
                </Card>
              ) : null}

              {selectedNatureOfPermission === "Closure of Case" ? (
                <Card>
                  <Row glutter={24}>
                    {displayState(closureOfCaseForm, displayFields)}
                    {displayCommonFields("superiorOfficerPermissionCloser")}
                    {displayUploadReports(
                      closerOfCaseFileList,
                      "Upload Permission",
                      "uploadReport",
                      setUploadReport,
                      uploadReport
                    )}
                  </Row>
                </Card>
              ) : null}

              {selectedNatureOfPermission === "Deletion of Accused" ? (
                <Card style={{ marginBottom: 120 }}>
                  <Row glutter={24} style={{ marginTop: 10 }}>
                    {displayState(deletionOfAccusedForm, displayFields)}
                    {displayCommonFields("superiorOfficerPermissionDeletion")}
                    {displayUploadReports(
                      deletionOfAccusedFileList,
                      "Upload Report",
                      "uploadReport",
                      setUploadReport,
                      uploadReport
                    )}
                  </Row>
                </Card>
              ) : null}
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
            {!isEmpty(prosecutionPermissionList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setIsModalVisible(true)}
              >
                {prosecutionPermissionList &&
                prosecutionPermissionList.length > 0
                  ? prosecutionPermissionList.length
                  : 0}{" "}
                Superior Officers Permission Records
              </Button>
            ) : null}
            <Modal
              title="Superior Officers Permission Records"
              visible={isModalVisible}
              onOk={() => setIsModalVisible(false)}
              onCancel={() => setIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditProsecutionPermission}
                  setViewDetails={setViewProsecutionPermissionDetails}
                  selectedRecord={editProsecutionPermissionObj}
                  isMedia={false}
                  setIsModalVisible={setIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
    </ModuleWrapper>
  );
}
