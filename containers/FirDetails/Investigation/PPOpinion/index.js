import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { isEmpty, first, isArray } from "lodash";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
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
  notification,
  Modal,
} from "antd";
import {
  dummyRequest,
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  folderName,
  onFileChange,
  getMediaUploadError,
  getMediaPayload,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import { CameraFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import ppOpinionActions from "@redux/investigations/ppopinion/actions";
import { loadState } from "@lib/helpers/localStorage";
import Loader from "@components/utility/loader";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import SavedRecords from "./SavedRecords";
import TemplatesModal from "../CommonForms/TemplatesModal";
import AddPerson from "../CommonForms/AddPerson";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  RequisitionToPPTemplates,
  PPOpinionForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import {
  addPPOninionPayload,
  updatePPOninionPayload,
} from "./ppOpinionPayloads";

const { TextArea } = Input;

export default function ReassignmentOfCase({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [uploadOpinion, setUploadOpinion] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUploadOpinion, setSelectedUploadOpinion] = useState([]);
  const [viewPPOpnionOfCaseDetails, setViewPPOpnionOfCaseDetails] =
    useState(false);
  const [editPPOpinionOfCaseObj, setEditPPOpinionOfCaseObj] = useState(null);
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const { createAuditHistory } = auditHistoryActions;
  const [isSavedRecordsModalVisible, setIsSavedRecordsModalVisible] =
    useState(false);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    ppopinionList,
    successMessage,
  } = useSelector((state) => state.PPOpinion);

  const isSuccess =
    actionType === "ADD_PPOPINION_SUCCESS" ||
    actionType === "UPDATE_PPOPINION_SUCCESS";
  const isError =
    actionType === "ADD_PPOPINION_ERROR" ||
    actionType === "UPDATE_PPOPINION_ERROR";

  const {
    addPPOpinionDetails,
    updatePPOpinionDetails,
    getPPOpinionList,
    resetActionType,
  } = ppOpinionActions;

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_PPOPINION_SUCCESS"
        ? "PP Opinion Created"
        : "PP Opinion Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/PPOpinion", auditType)
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "PP Opinion Successfully Added" ||
        successMessage === "PP Opinion Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        dispatch(resetActionType());
        form.resetFields();
        setSelectedSiderMenu("investigation");
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getPPOpinionList(`${config.getPPOpinion}?crimeId=${crimeId}`));
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "PPOpinion";
    personalDetails.createdFor = "Proffessional";
    setSelectedPerson(professionalDetails);

    form.setFieldsValue({
      ppName:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const submit = async () => {
    const values = await form.validateFields();
    const uploadOpinionData = new FormData();
    uploadOpinion.forEach((file) => {
      uploadOpinionData.append("file", file.originFileObj);
    });
    uploadOpinionData.append("prefixFolder", crimeId);
    uploadOpinionData.append(
      "folderPath",
      `${crimeId}/${folderName.PP_OPINION}/file`
    );

    if (!isEmpty(uploadOpinion)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadOpinionData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const addPayload = addPPOninionPayload(
              values,
              crimeId,
              selectedPerson,
              first(getMediaPayload(data, folderName.PP_OPINION))
            );
            const updatePayload = updatePPOninionPayload(
              values,
              crimeId,
              selectedPerson,
              editPPOpinionOfCaseObj?._id,
              first(getMediaPayload(data, folderName.PP_OPINION))
            );

            if (editPPOpinionOfCaseObj?._id) {
              dispatch(
                updatePPOpinionDetails(config.updatePPOpinion, updatePayload)
              );
            } else {
              dispatch(addPPOpinionDetails(config.addPPOpinion, addPayload));
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadOpinion)) {
      const existingUploadOpinion = editPPOpinionOfCaseObj?.uploadOpinion?.url
        ? editPPOpinionOfCaseObj?.uploadOpinion
        : {};
      const addPayload = addPPOninionPayload(
        values,
        crimeId,
        selectedPerson,
        {}
      );
      const updatePayload = updatePPOninionPayload(
        values,
        crimeId,
        selectedPerson,
        editPPOpinionOfCaseObj?._id,
        existingUploadOpinion
      );

      if (editPPOpinionOfCaseObj?._id) {
        dispatch(updatePPOpinionDetails(config.updatePPOpinion, updatePayload));
      } else {
        dispatch(addPPOpinionDetails(config.addPPOpinion, addPayload));
      }
    }
  };

  const handleEditPPOpinion = (value) => {
    if (value) {
      setEditPPOpinionOfCaseObj(value);
      const uploadOpinion = value?.uploadOpinion;
      if (uploadOpinion && uploadOpinion?.name !== "") {
        setSelectedUploadOpinion([
          {
            url: uploadOpinion?.url,
            name: uploadOpinion?.name,
            fileId: uploadOpinion?.fileId,
          },
        ]);
      } else {
        setSelectedUploadOpinion([]);
      }
      form.setFieldsValue({
        ppName: value?.ppName,
        courtName: value?.courtName,
        opinionOfPP: value?.opinionOfPP,
        dateOfSendingCD: moment(new Date(value?.dateOfSendingCD)).isValid()
          ? moment(new Date(value?.dateOfSendingCD))
          : "",
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
    }
  };

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const showModal = (templateName, fileName, templateAvailable = false) => {
    if (templateAvailable) {
      setTemplateIsModalVisible(true);
      setSelectedTemplateName(`${templateName} - Preview`);
      setSelectedFileName(fileName);
    } else {
      setTemplateIsModalVisible(false);
    }
  };
  const reportData = getDataForDocument(
    editPPOpinionOfCaseObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayFields = (name) => {
    switch (name) {
      case "ppName":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          250,
          viewPPOpnionOfCaseDetails || disableForm
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          250,
          viewPPOpnionOfCaseDetails || disableForm
        );
      case "dateOfSendingCD":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 250 }}
            disabledDate={disableFutureDates}
            disabled={viewPPOpnionOfCaseDetails || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPPOpnionOfCaseDetails || disableForm}
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
                  onClick={() => setIsModalVisible(disableForm ? false : true)}
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const savedUploadDocURL = editPPOpinionOfCaseObj?.uploadOpinion?.url
    ? editPPOpinionOfCaseObj?.uploadOpinion?.url
    : "";

  const displayUploadReports = (name, title) => {
    return (
      <Col className="file-upload" style={{ marginLeft: 0 }}>
        <Form.Item name={name}>
          <Upload
            fileList={
              editPPOpinionOfCaseObj?._id && savedUploadDocURL !== ""
                ? selectedUploadOpinion
                : uploadOpinion
            }
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, setUploadOpinion)}
            onPreview={handleDownload}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ width: 300, marginTop: 10 }}
              icon={<CameraFilled style={{ marginRight: 230 }} />}
              disabled={
                viewPPOpnionOfCaseDetails ||
                disableForm ||
                !isEmpty(uploadOpinion)
              }
            >
              {title}
            </Button>
          </Upload>
        </Form.Item>
      </Col>
    );
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="PP Opinion"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row style={{ minHeight: 550 }}>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                {displayState(PPOpinionForm, displayFields)}
                <div style={{ marginTop: 20 }}>
                  <Form.Item
                    name="userDate"
                    label="Date Of Receiving PP Opinion"
                  >
                    <DatePicker
                      disabledDate={disableFutureDates}
                      disabled={viewPPOpnionOfCaseDetails || disableForm}
                      showTime
                      format={DATE_TIME_FORMAT}
                      placeholder="Select Date & Time"
                      style={{ width: 250 }}
                      onChange={checkFields}
                    />
                  </Form.Item>
                </div>
                {displayUploadReports(
                  "uploadOpinion",
                  "Upload the opinion (Form 68)"
                )}
              </Col>
              <div style={{ margin: "24px 0" }} />
              <Form.Item
                name="opinionOfPP"
                label="Opinion of the PP"
                rules={[textAreaRules.textAreaMaxLength]}
              >
                <TextArea
                  rows={4}
                  columns={3}
                  maxLength={textAreaRules.maxLength}
                  disabled={viewPPOpnionOfCaseDetails || disableForm}
                />
              </Form.Item>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={RequisitionToPPTemplates}
              showModal={showModal}
              disabled={viewPPOpnionOfCaseDetails || disableForm}
              selectedRecord={editPPOpinionOfCaseObj}
              selectedModule="ppOpinion"
              accusedId={editPPOpinionOfCaseObj?.victimId?._id}
            />
            {!isEmpty(ppopinionList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setIsSavedRecordsModalVisible(true)}
              >
                {ppopinionList && ppopinionList.length > 0
                  ? ppopinionList.length
                  : 0}{" "}
                PP Opinion Records
              </Button>
            ) : null}
            <Modal
              title="PP Opinion Records"
              visible={isSavedRecordsModalVisible}
              onOk={() => setIsSavedRecordsModalVisible(false)}
              onCancel={() => setIsSavedRecordsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={ppopinionList}
                  editDetails={handleEditPPOpinion}
                  setViewDetails={setViewPPOpnionOfCaseDetails}
                  selectedRecord={editPPOpinionOfCaseObj}
                  isModalVisible={setIsSavedRecordsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
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

      {isModalVisible ? (
        <AddPerson
          title="Add Public Prosecutor Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={viewPPOpnionOfCaseDetails}
          setInputList={setInputList}
          editObj={null}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </ModuleWrapper>
  );
}
