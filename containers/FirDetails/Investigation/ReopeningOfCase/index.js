import { useState, useEffect } from "react";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textFieldRules } from "@components/Common/formOptions";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import { Row, Col, Form, DatePicker, Input, notification, Divider } from "antd";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import reopeningOfCaseActions from "@redux/investigations/reopeningOfCase/actions";
import {
  addReopeningOfCasePayload,
  updateReopeningOfCasePayload,
} from "./reopeningOfCasePayloads";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, first } from "lodash";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import TemplatesModal from "../CommonForms/TemplatesModal";
import { ModuleWrapper } from "../CommonDetails/styles";
import ContentHeader from "../../ContentHeader";
import {
  ReopeningOfCaseTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
  natureOfEvidence,
  reasonList,
} from "./const";

export default function ReopeningOfCase({
  onCancel,
  loadData,
  reason,
  setReason,
  editReopeningOfCaseObj,
  setEditReopeningOfCaseObj,
  setIsFormSubmitted,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const currentUser = loadState("currentUser");
  const selectedFir = loadState("selectedFir");
  const [formValid, setFormValid] = useState(false);
  const { createAuditHistory } = auditHistoryActions;
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [serchText, setSerchText] = useState("");

  const {
    addReopeningOfCaseDetails,
    updateReopeningOfCaseDetails,
    getReopeningOfCaseList,
    resetActionType,
  } = reopeningOfCaseActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    reopeningOfCaseList,
    successMessage,
  } = useSelector((state) => state.ReopeningOfCase);

  const isSuccess =
    actionType === "ADD_REOPENING_OF_CASE_SUCCESS" ||
    actionType === "UPDATE_REOPENING_OF_CASE_SUCCESS";
  const isError =
    actionType === "ADD_REOPENING_OF_CASE_ERROR" ||
    actionType === "UPDATE_REOPENING_OF_CASE_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_REOPENING_OF_CASE_SUCCESS"
        ? "Re-Opening Of Case Successfully Initiated"
        : "Case Re-opened Successfully";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/reopeningOfCase",
          auditType
        )
      )
    );
  };

  const fetchReopeningOfCase = () => {
    dispatch(
      getReopeningOfCaseList(`${config.reOpeningOfCase}?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setEditReopeningOfCaseObj(null);
        dispatch(resetActionType());
        fetchReopeningOfCase();
        setIsFormSubmitted(true);
        form.setFieldsValue({
          reason: "",
        });
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (loadData) {
      fetchReopeningOfCase();
    }
  }, [loadData]);

  useEffect(() => {
    if (!isEmpty(reopeningOfCaseList)) {
      const value = first(
        reopeningOfCaseList.filter((s) => s.crimeId === crimeId)
      );
      if (value?.crimeId === crimeId) {
        setEditReopeningOfCaseObj(value);
        setReason(value.reason);
        form.setFieldsValue({
          reason: value.reason,
          natureOfEvidence: value.natureOfEvidence,
          slNo: value.slNo,
          date: moment(new Date(value?.date)).isValid()
            ? moment(new Date(value?.date))
            : "",
          dateOfFiling: moment(new Date(value?.dateOfFiling)).isValid()
            ? moment(new Date(value?.dateOfFiling))
            : "",
          courtOrderNo: value.courtOrderNo,
          courtOrderDate: moment(new Date(value?.courtOrderDate)).isValid()
            ? moment(new Date(value?.courtOrderDate))
            : "",
        });
      } else {
        form.resetFields();
        setReason("");
      }
    } else {
      form.resetFields();
    }
  }, [reopeningOfCaseList]);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = addReopeningOfCasePayload(values, crimeId);
    const updatePayload = updateReopeningOfCasePayload(
      values,
      crimeId,
      editReopeningOfCaseObj?._id
    );

    if (editReopeningOfCaseObj?._id) {
      dispatch(
        updateReopeningOfCaseDetails(config.reOpeningOfCase, updatePayload)
      );
    } else {
      dispatch(addReopeningOfCaseDetails(config.reOpeningOfCase, addPayload));
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
    editReopeningOfCaseObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Re-Opening Of Case"
        addAnother={false}
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={onCancel}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <div style={{ width: "65%", padding: 10 }}>
            <Form form={form} layout="vertical">
              <Row gutter={24}>
                <Col span={9}>
                  <Form.Item
                    name="reason"
                    label="Reason for Reopening of Case"
                    rules={[
                      { required: true, message: "Please Select Reason!" },
                    ]}
                  >
                    {renderFieldsWithDropDown(
                      reasonList,
                      setReason,
                      handleSearch,
                      serchText,
                      222,
                      false
                    )}
                  </Form.Item>
                </Col>
                <>
                  {reason === "Further Evidence" ? (
                    <Col span={8} style={{ marginBottom: 10 }}>
                      <Form.Item
                        name="natureOfEvidence"
                        label="Nature of Evidence"
                      >
                        {renderFieldsWithDropDown(
                          natureOfEvidence,
                          null,
                          handleSearch,
                          serchText,
                          222,
                          false
                        )}
                      </Form.Item>
                    </Col>
                  ) : null}
                  {reason === "Detection of closed case" ? (
                    <Col span={15} style={{ marginBottom: 10 }}>
                      <Form.Item
                        name="dateOfFiling"
                        label="Date of Filing Report to Court for Permission for Reopening"
                      >
                        <DatePicker
                          format={DATE_FORMAT}
                          placeholder="Select Date"
                          onChange={checkFields}
                          style={{ width: 222 }}
                          disabledDate={disableFutureDates}
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  {reason !== "" &&
                  reason !== "Further Evidence" &&
                  reason !== "Detection of closed case" ? (
                    <>
                      <Col span={10} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="slNo"
                          label="Order No. Of the court/Superior Offiers"
                        >
                          <Input
                            onChange={checkFields}
                            style={{ width: 222 }}
                            maxLength={textFieldRules.maxLength}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={9} style={{ marginBottom: 10 }}>
                        <Form.Item name="date" label="Date">
                          <DatePicker
                            format={DATE_FORMAT}
                            placeholder="Select Date"
                            onChange={checkFields}
                            style={{ width: 222 }}
                            disabledDate={disableFutureDates}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={15} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name="dateOfFiling"
                          label="Date of Filing Report to Court for Permission for Reopening"
                        >
                          <DatePicker
                            format={DATE_FORMAT}
                            placeholder="Select Date"
                            onChange={checkFields}
                            style={{ width: 222 }}
                            disabledDate={disableFutureDates}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                </>
              </Row>
              {editReopeningOfCaseObj?._id ? (
                <>
                  <Divider />
                  <Row>
                    <Col span={9} style={{ marginBottom: 10 }}>
                      <Form.Item
                        name="courtOrderNo"
                        label="Order No. of Court Re-opening"
                        rules={[
                          {
                            required: true,
                            message: "Court Order No. is required!",
                          },
                        ]}
                      >
                        <Input
                          onChange={checkFields}
                          style={{ width: 222 }}
                          maxLength={textFieldRules.maxLength}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10} style={{ marginBottom: 10 }}>
                      <Form.Item
                        name="courtOrderDate"
                        label="Order Date"
                        rules={[
                          {
                            required: true,
                            message: "Court Order Date is required!",
                          },
                        ]}
                      >
                        <DatePicker
                          format={DATE_FORMAT}
                          placeholder="Select Date"
                          onChange={checkFields}
                          style={{ width: 222 }}
                          disabledDate={disableFutureDates}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : null}
            </Form>
          </div>
          <div style={{ width: "35%" }} className="right-section">
            <DisplayReportGenerations
              templateLists={ReopeningOfCaseTemplates}
              showModal={showModal}
              disabled={!editReopeningOfCaseObj?._id}
              selectedRecord={editReopeningOfCaseObj}
              selectedModule="reopeningOfCase"
              accusedId={editReopeningOfCaseObj?._id}
            />
          </div>
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
