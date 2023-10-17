import { useState, useEffect } from "react";
import {
  disableFutureDates,
  disableFuturePastDates,
} from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Upload,
  Button,
  Input,
  Select,
  notification,
  Modal,
} from "antd";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import {
  dummyRequest,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  getMediaPayload,
  folderName,
  getMediaUploadError,
  onFileChange,
  getPersonDetails,
  getAccusedsAll,
  shortAddress,
} from "@containers/FirDetails/fir-util";
import axios from "axios";
import {
  NoticeToComplainantTemplates,
  NoticeToComplainantForm,
  purposeOfIssueList,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import { useDispatch, useSelector } from "react-redux";
import { ModuleWrapper } from "../CommonDetails/styles";
import noticeToComplainantActions from "@redux/investigations/noticeToComplainant/actions";
import complainantDetailsAction from "@redux/investigations/complainantDetails/actions";
import { loadState } from "@lib/helpers/localStorage";
import TemplatesModal from "@containers/FirDetails/Investigation/CommonForms/TemplatesModal";
import moment from "moment";
import { isEmpty, first, isArray } from "lodash";
import Loader from "@components/utility/loader";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "./SavedRecords";
import {
  addComplainantNoticePayload,
  updateComplainantNoticePayload,
} from "./NoticeToComplainantPayloads";
import AddPerson from "../CommonForms/AddPerson";
import ContentHeader from "../../ContentHeader";

const Option = Select.Option;

export default function NoticeToComplainant({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const dispatch = useDispatch();
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [uploadAck, setUploadAck] = useState([]);
  const [selectedComplainant, setSelectedComplainant] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUploadAck, setSelectedUploadAck] = useState([]);
  const [viewNoticeToComplainantDetails, setViewNoticeToComplainantDetails] =
    useState(false);
  const [editNoticeToComplainantObj, setEditNoticeToComplainantObj] =
    useState(null);
  const { createAuditHistory } = auditHistoryActions;
  const [serchText, setSerchText] = useState("");
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    noticeToComplainantList,
    successMessage,
  } = useSelector((state) => state.NoticeToComplainant);

  const {
    complainantDetailsList,
    complainantActionType,
    complainantSuccessMessage,
    complainantErrorMessage,
  } = useSelector((state) => state.ComplainantDetails);

  const {
    addComplainantDetailsDetails,
    resetComplainantActionType,
    getComplainantDetailsList,
  } = complainantDetailsAction;
  const complaintList =
    !isEmpty(complainantDetailsList) && getAccusedsAll(complainantDetailsList);

  const isComplainantSuccess =
    complainantActionType === "ADD_COMPLAINANT_DETAILS_SUCCESS";
  const isComplainantError =
    complainantActionType === "ADD_COMPLAINANT_DETAILS_ERROR";

  const isSuccess =
    actionType === "ADD_NOTICE_TO_COMPLAINANT_SUCCESS" ||
    actionType === "UPDATE_NOTICE_TO_COMPLAINANT_SUCCESS";
  const isError =
    actionType === "ADD_NOTICE_TO_COMPLAINANT_ERROR" ||
    actionType === "UPDATE_NOTICE_TO_COMPLAINANT_ERROR";

  const {
    addNoticeToComplainantDetails,
    updateNoticeToComplainantDetails,
    getNoticeToComplainantList,
    resetActionType,
  } = noticeToComplainantActions;

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_NOTICE_TO_COMPLAINANT_SUCCESS"
        ? "Notice To Complainant Created"
        : "Notice To Complainant Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/noticeToComplainant",
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

  const fetchComplainantDetails = () => {
    dispatch(
      getComplainantDetailsList(
        `${config.getPostCrimeSceneDetails}/COMPLAINANT/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isComplainantSuccess || isComplainantError) {
      if (
        complainantSuccessMessage === "Complainant Details Successfully Added"
      ) {
        openNotificationWithIcon("success", complainantSuccessMessage);
        dispatch(resetComplainantActionType());
        personForm.resetFields();
        fetchComplainantDetails();
      } else if (complainantErrorMessage) {
        openNotificationWithIcon("error", complainantErrorMessage);
        dispatch(resetComplainantActionType());
      }
    }
  }, [complainantActionType]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Notice To Complainant Successfully Added" ||
        successMessage === "Notice To Complainant Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setSelectedSiderMenu("investigation");
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchComplainantDetails();
    dispatch(
      getNoticeToComplainantList(
        `${config.getComplainantNotice}?crimeId=${crimeId}`
      )
    );
  }, []);

  const handleOk = async () => {
    const values = await personForm.validateFields();
    const payload = {
      crimeId: crimeId,
      complainantDetail: {
        person: getPersonDetails(values, inputList, []),
      },
    };
    dispatch(
      addComplainantDetailsDetails(config.addComplainantDetails, payload)
    );
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditNoticeToComplain = (value) => {
    if (value) {
      setEditNoticeToComplainantObj(value);
      if (
        value?.uploadAcknowledgedNotice &&
        value?.uploadAcknowledgedNotice?.url !== ""
      ) {
        setSelectedUploadAck([
          {
            url: value?.uploadAcknowledgedNotice?.url,
            name: value?.uploadAcknowledgedNotice?.name,
          },
        ]);
      } else {
        setSelectedUploadAck([]);
      }
      const personalDetails = value?.nameOfComplainant?.personalDetails;
      const firstName = personalDetails?.name ? personalDetails?.name : "";
      const lastName = personalDetails?.surname ? personalDetails?.surname : "";
      const address = shortAddress(value?.nameOfComplainant?.presentAddress);
      const personDetails =
        address !== "" && address !== "  "
          ? `${firstName} ${lastName}, ${address}`
          : `${firstName} ${lastName}`;
      form.setFieldsValue({
        nameOfComplainant: personDetails,
        purposeOfIssue: value.purposeOfIssue,
        dateOfNotice: moment(new Date(value?.dateOfNotice)).isValid()
          ? moment(new Date(value?.dateOfNotice))
          : "",
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    const uploadAckData = new FormData();
    uploadAck.forEach((file) => {
      uploadAckData.append("file", file.originFileObj);
    });
    uploadAckData.append("prefixFolder", crimeId);
    uploadAckData.append(
      "folderPath",
      `${crimeId}/${folderName.NOTICE_TO_COMPLAINANT}/file`
    );

    if (!isEmpty(uploadAck)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadAckData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const complainant =
              selectedComplainant !== ""
                ? selectedComplainant
                : editNoticeToComplainantObj?.nameOfComplainant?._id;
            const addPayload = addComplainantNoticePayload(
              values,
              crimeId,
              first(getMediaPayload(data, folderName.NOTICE_TO_COMPLAINANT)),
              complainant
            );
            const updatePayload = updateComplainantNoticePayload(
              values,
              crimeId,
              editNoticeToComplainantObj?._id,
              first(getMediaPayload(data, folderName.NOTICE_TO_COMPLAINANT)),
              complainant
            );

            if (editNoticeToComplainantObj?._id) {
              dispatch(
                updateNoticeToComplainantDetails(
                  config.updateComplainantNotice,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addNoticeToComplainantDetails(
                  config.addComplainantNotice,
                  addPayload
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadAck)) {
      const complainant =
        selectedComplainant !== ""
          ? selectedComplainant
          : editNoticeToComplainantObj?.nameOfComplainant?._id;
      const addPayload = addComplainantNoticePayload(
        values,
        crimeId,
        {},
        complainant
      );
      const updatePayload = updateComplainantNoticePayload(
        values,
        crimeId,
        editNoticeToComplainantObj?._id,
        first(
          getMediaPayload(
            [editNoticeToComplainantObj?.uploadAcknowledgedNotice],
            folderName.NOTICE_TO_COMPLAINANT
          )
        ),
        complainant
      );

      if (editNoticeToComplainantObj?._id) {
        dispatch(
          updateNoticeToComplainantDetails(
            config.updateComplainantNotice,
            updatePayload
          )
        );
      } else {
        dispatch(
          addNoticeToComplainantDetails(config.addComplainantNotice, addPayload)
        );
      }
    }
  };

  const onComplainantChange = (val) => {
    setSelectedComplainant(val);
    checkFields();
  };

  const renderComplainantDropDown = () => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: 250 }}
        disabled={viewNoticeToComplainantDetails || disableForm}
        onSelect={onComplainantChange}
      >
        {isArray(complaintList) &&
          complaintList.map((item, index) => {
            const personDetails =
              item?.shortAddress !== "" && item?.shortAddress !== "  "
                ? `${item.label}, ${item.shortAddress}`
                : item.label;
            return (
              <Option key={index} value={item._id} label={personDetails}>
                {personDetails}
              </Option>
            );
          })}
      </Select>
    );
  };

  const displayFields = (name) => {
    switch (name) {
      case "nameOfComplainant":
        return renderComplainantDropDown();
      case "purposeOfIssue":
        return renderFieldsWithDropDown(
          purposeOfIssueList,
          null,
          handleSearch,
          serchText,
          250,
          viewNoticeToComplainantDetails || disableForm
        );
      case "dateOfNotice":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewNoticeToComplainantDetails || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewNoticeToComplainantDetails || disableForm}
          />
        );
    }
  };

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() =>
                    disableForm
                      ? setIsModalVisible(false)
                      : setIsModalVisible(true)
                  }
                >
                  {s.actionName}
                </span>
              )}
            </Col>
          );
        })}
      </Row>
    );
  };

  const savedUploadDocURL = editNoticeToComplainantObj?.uploadAcknowledgedNotice
    ?.url
    ? editNoticeToComplainantObj?.uploadAcknowledgedNotice?.url
    : "";

  const displayUploadReports = (name, title) => {
    return (
      <Col className="file-upload" style={{ marginLeft: 0 }}>
        <Form.Item name={name}>
          <Upload
            fileList={
              editNoticeToComplainantObj?._id && savedUploadDocURL !== ""
                ? selectedUploadAck
                : uploadAck
            }
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, setUploadAck)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 400, marginTop: 10 }}
              icon={<CameraFilled style={{ marginRight: 340 }} />}
              disabled={
                viewNoticeToComplainantDetails ||
                !isEmpty(uploadAck) ||
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

  const reportData = getDataForDocument(
    editNoticeToComplainantObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const showModal = (templateName, fileName, templateAvailable = false) => {
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

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Notice To Complainant"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row style={{ minHeight: 550 }}>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                {displayState(NoticeToComplainantForm, displayFields)}
                {displayUploadReports(
                  "uploadAcknowledgedNotice",
                  "Upload Acknowledged Notice To Complainant"
                )}
              </Col>
              <div style={{ marginTop: 20 }}>
                <Form.Item
                  name="userDate"
                  label="Date & Time of Visit"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Date & Time of Visit",
                    },
                  ]}
                >
                  <DatePicker
                    disabledDate={disableFuturePastDates}
                    disabled={viewNoticeToComplainantDetails || disableForm}
                    showTime
                    format={DATE_TIME_FORMAT}
                    placeholder="Select Date & Time"
                    style={{ width: 250 }}
                    onChange={checkFields}
                  />
                </Form.Item>
              </div>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={NoticeToComplainantTemplates}
              showModal={showModal}
              disabled={
                viewNoticeToComplainantDetails ||
                !editNoticeToComplainantObj?._id ||
                disableForm
              }
              selectedRecord={editNoticeToComplainantObj}
              selectedModule="noticeToComplainant"
              accusedId={editNoticeToComplainantObj?.nameOfComplainant?._id}
            />
            {!isEmpty(noticeToComplainantList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setIsRecordsModalVisible(true)}
              >
                {noticeToComplainantList && noticeToComplainantList.length > 0
                  ? noticeToComplainantList.length
                  : 0}{" "}
                Notice To Complainant Records
              </Button>
            ) : null}
          </Card>
        </Row>
      )}
      <Modal
        title="Notice To Complainant Records"
        visible={isRecordsModalVisible}
        onOk={() => setIsRecordsModalVisible(false)}
        onCancel={() => setIsRecordsModalVisible(false)}
        style={{ minWidth: "95vw" }}
        footer={null}
      >
        <div style={{ maxHeight: 650, overflowY: "auto" }}>
          <SavedRecords
            dataSource={noticeToComplainantList}
            editDetails={handleEditNoticeToComplain}
            setViewDetails={setViewNoticeToComplainantDetails}
            selectedRecord={editNoticeToComplainantObj}
            visibleModel={setIsRecordsModalVisible}
          />
        </div>
      </Modal>
      {isModalVisible ? (
        <AddPerson
          title="Add Person Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={viewNoticeToComplainantDetails || disableForm}
          setInputList={setInputList}
          editObj={null}
          age={age}
          setAge={setAge}
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
