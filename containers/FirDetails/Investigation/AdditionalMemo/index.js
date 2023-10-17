/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { textFieldRules } from "@components/Common/formOptions";
import {
  disableFutureDates,
  disableFuturePastDates,
} from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  notification,
  Modal,
  Button,
} from "antd";
import masterDataActions from "@redux/masterData/actions";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import additionalMemoActions from "@redux/investigations/additionalMemo/actions";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, isArray } from "lodash";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { gravityList } from "@containers/const";
import {
  addAdditionalMemoPayload,
  updateAdditionalMemoPayload,
} from "./additionalMemoPayloads";
import {
  additionalMemoTemplates,
  additionalMemoForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import ContentHeader from "../../ContentHeader";
import TemplatesModal from "../CommonForms/TemplatesModal";
import SavedRecords from "./SavedRecords";

export default function AdditionalMemo({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const selectedFir = loadState("selectedFir");
  const [editAdditionalMemoObj, setEditAdditionalMemoObj] = useState(null);
  const { getCourtsBasedonPsCode } = masterDataActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const [serchText, setSerchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [viewAdditionalMemoDetails, setViewAdditionalMemoDetails] =
    useState(false);

  const {
    addAdditionalMemoDetails,
    updateAdditionalMemoDetails,
    getAdditionalMemoList,
    resetActionType,
  } = additionalMemoActions;
  const { createAuditHistory } = auditHistoryActions;
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
    additionalMemoList,
    successMessage,
  } = useSelector((state) => state.AdditionalMemo);

  const isSuccess =
    actionType === "ADD_ADDITIONAL_MEMO_SUCCESS" ||
    "UPDATE_ADDITIONAL_MEMO_SUCCESS";
  const isError =
    actionType === "ADD_ADDITIONAL_MEMO_ERROR" ||
    "UPDATE_ADDITIONAL_MEMO_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_ADDITIONAL_MEMO_SUCCESS"
        ? "Additional Memo Created"
        : "Additional Memo Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/additionalMemo",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Additional Memo Successfully Added" ||
        successMessage === "Additional Memo Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        setSelectedSiderMenu("investigation");
        dispatch(resetActionType());
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
    dispatch(
      getAdditionalMemoList(`${config.additionalMemo}?crimeId=${crimeId}`)
    );
  }, []);

  const handleEditAlterationMemoDetails = (value) => {
    if (value) {
      setEditAdditionalMemoObj(value);
      form.setFieldsValue({
        informationReceivedDate: moment(
          new Date(value?.informationReceivedDate)
        ).isValid()
          ? moment(new Date(value?.informationReceivedDate))
          : "",
        additionalMemoDate: moment(
          new Date(value?.additionalMemoDate)
        ).isValid()
          ? moment(new Date(value?.additionalMemoDate))
          : "",
        courtName: value.courtName,
        graveParticulars: value.graveParticulars,
        totalPropertyValue: value.totalPropertyValue,
        dateOfDispatchToCourt: moment(
          new Date(value?.dateOfDispatchToCourt)
        ).isValid()
          ? moment(new Date(value?.dateOfDispatchToCourt))
          : "",
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const getSavedData = () => {
    let savedData = [];
    !isEmpty(additionalMemoList) &&
      additionalMemoList.map((data) => {
        const result = {
          informationReceivedDate: data?.informationReceivedDate,
          additionalMemoDate: data?.additionalMemoDate,
          dateOfDispatchToCourt: data?.dateOfDispatchToCourt,
          courtName: data?.courtName,
          graveParticulars: data?.graveParticulars || "",
          totalPropertyValue: data?.totalPropertyValue || "",
          userDate: data?.userDate || "",
          _id: data?._id,
        };
        savedData.push(result);
      });
    return savedData;
  };

  const displayBailOppositionsFields = (name) => {
    switch (name) {
      case "informationReceivedDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={disableForm || viewAdditionalMemoDetails}
          />
        );
      case "additionalMemoDate":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={disableForm || viewAdditionalMemoDetails}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          220,
          disableForm || viewAdditionalMemoDetails
        );
      case "graveParticulars":
        return renderFieldsWithDropDown(
          gravityList,
          null,
          handleSearch,
          serchText,
          220,
          disableForm || viewAdditionalMemoDetails
        );
      case "dateOfDispatchToCourt":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={disableForm || viewAdditionalMemoDetails}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm || viewAdditionalMemoDetails}
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
    editAdditionalMemoObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const displayBailOppositionsState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = addAdditionalMemoPayload(values, crimeId);
    const updatePayload = updateAdditionalMemoPayload(
      values,
      crimeId,
      editAdditionalMemoObj?._id
    );

    if (editAdditionalMemoObj?._id) {
      dispatch(
        updateAdditionalMemoDetails(config.additionalMemo, updatePayload)
      );
    } else {
      dispatch(addAdditionalMemoDetails(config.additionalMemo, addPayload));
    }
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Additional Memo"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card
            style={{ width: "70%", height: 390, minHeight: 390 }}
            className="cardLeftStyle"
          >
            <Form form={form} layout="vertical">
              <Col>
                {displayBailOppositionsState(
                  additionalMemoForm,
                  displayBailOppositionsFields
                )}
                <Form.Item
                  name="userDate"
                  label="Date & Time of Visit"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Date & Time of Visit!",
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    format={DATE_TIME_FORMAT}
                    disabledDate={disableFuturePastDates}
                    placeholder="Select Date & Time"
                    style={{ width: 220 }}
                    onChange={checkFields}
                    disabled={disableForm || viewAdditionalMemoDetails}
                  />
                </Form.Item>
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%", height: 390, minHeight: 390 }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={additionalMemoTemplates}
              showModal={showModal}
              disabled={
                !editAdditionalMemoObj?._id ||
                disableForm ||
                viewAdditionalMemoDetails
              }
              selectedRecord={{ ...editAdditionalMemoObj, crimeId }}
              selectedModule="additionalMemo"
              accusedId={editAdditionalMemoObj?._id}
            />

            {!isEmpty(additionalMemoList) ? (
              <Button
                style={{ marginTop: "40px", width: "90%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {additionalMemoList && additionalMemoList.length > 0
                  ? additionalMemoList.length
                  : 0}{" "}
                Additional Memo Records
              </Button>
            ) : null}
            <Modal
              title="Additional Memo Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditAlterationMemoDetails}
                  setViewDetails={setViewAdditionalMemoDetails}
                  selectedRecord={editAdditionalMemoObj}
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
