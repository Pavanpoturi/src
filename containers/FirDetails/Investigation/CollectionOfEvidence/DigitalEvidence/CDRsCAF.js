/* eslint-disable array-callback-return */
import {
  Row,
  Col,
  Form,
  Input,
  notification,
  Card,
  DatePicker,
  Divider,
  Button,
  Upload,
  Spin,
  Alert,
} from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { isEmpty, isArray, isNull, first } from "lodash";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { loadState } from "@lib/helpers/localStorage";
import { SaveOutlined, CameraFilled } from "@ant-design/icons";
import cdrEvidenceActions from "@redux/investigations/collectionOfEvidence/digitalEvidence/cdrEvidence/actions";
import { textFieldRules, textAreaRules } from "@components/Common/formOptions";
import {
  renderFieldsWithDropDown,
  DATE_FORMAT,
  renderFieldsWithMultipleDropDown,
  dummyRequest,
  onFileChange,
  folderName,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import { cdrForm } from "./const";
import SaveResetButton from "../SaveResetButton";
import { getEvidenceListData } from "../const";
import SavedCDRRecords from "./SavedCDRRecords";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function CDRsCAF({
  editCDRObj,
  setEditCDRObj,
  viewCDRDetails,
  setViewCDRDetails,
  selectedTab,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [cdrForms] = Form.useForm();
  const [requestCDRForms] = Form.useForm();
  const [sendCDRForms] = Form.useForm();
  const [uploadCDRReportForms] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedRecordForUpload, setSelectedRecordForUpload] = useState({});
  const [uploadCDRResult, setUploadCDRResult] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const { evidenceCollectionList } = useSelector((state) => state.MasterData);
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const {
    addCDRDetails,
    updateCDRDetails,
    getCDRList,
    resetActionType,
    requestCDRDetails,
    resetRequestCDRActionType,
    uploadCDRRequestDetails,
    resetCDRRequestActionType,
  } = cdrEvidenceActions;

  const {
    actionType,
    errorMessage,
    successMessage,
    cdrList,
    isFetching,
    requestCDRErrorMessage,
    requestCDRSuccessMessage,
    requestCDRActionType,
    uploadCDRReportErrorMessage,
    uploadCDRReportSuccessMessage,
    uploadCDRReportActionType,
  } = useSelector((state) => state.CDREvidence);

  const isSuccess =
    actionType === "ADD_CDR_SUCCESS" || actionType === "UPDATE_CDR_SUCCESS";
  const isError =
    actionType === "ADD_CDR_ERROR" || actionType === "UPDATE_CDR_ERROR";

  const isRequestCDRSuccess = requestCDRActionType === "REQUEST_CDR_SUCCESS";
  const isRequestCDRError = requestCDRActionType === "REQUEST_CDR_ERROR";

  const isCDRReportSuccess =
    uploadCDRReportActionType === "UPLOAD_CDR_RESULT_SUCCESS";
  const isCDRReportError =
    uploadCDRReportActionType === "UPLOAD_CDR_RESULT_ERROR";

  const checkFields = async () => {
    const values = await cdrForms.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CDR_SUCCESS" ? "CDRs/CAF Added" : "CDRs/CAF Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/digitalEvidence/CDRsCAF",
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

  const fetchCDRList = () => {
    dispatch(
      getCDRList(`${config.getEvidenceDetails}/CDR/?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    fetchCDRList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "CDRs/CAF successfully added" ||
        successMessage === "CDRs/CAF successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        cdrForms.resetFields();
        setViewCDRDetails(false);
        setEditCDRObj(null);
        dispatch(resetActionType());
        fetchCDRList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (isRequestCDRSuccess || isRequestCDRError) {
      if (requestCDRSuccessMessage === "CDRs Request successfully sent") {
        openNotificationWithIcon("success", requestCDRSuccessMessage);
        sendCDRForms.resetFields();
        setSelectedItems([]);
        dispatch(resetRequestCDRActionType());
        fetchCDRList();
      } else if (requestCDRErrorMessage) {
        openNotificationWithIcon("error", requestCDRErrorMessage);
        dispatch(resetRequestCDRActionType());
      }
    }
  }, [requestCDRActionType]);

  useEffect(() => {
    if (isCDRReportSuccess || isCDRReportError) {
      if (
        uploadCDRReportSuccessMessage === "CDRs Report successfully uploaded"
      ) {
        openNotificationWithIcon("success", uploadCDRReportSuccessMessage);
        uploadCDRReportForms.resetFields();
        setSelectedRecordForUpload([]);
        setUploadCDRResult([]);
        dispatch(resetCDRRequestActionType());
        fetchCDRList();
      } else if (uploadCDRReportErrorMessage) {
        openNotificationWithIcon("error", uploadCDRReportErrorMessage);
        dispatch(resetCDRRequestActionType());
      }
    }
  }, [uploadCDRReportActionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const telecomProviderList = getEvidenceListData(
    getDropdownValues("telecomProvider")
  );

  const requestTypeList = getEvidenceListData(getDropdownValues("requestType"));
  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );
  const nickNameList = getEvidenceListData(getDropdownValues("nickName"));

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10, padding: 0 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayFields = (name) => {
    switch (name) {
      case "telecomServiceProvider":
        return renderFieldsWithDropDown(
          telecomProviderList,
          null,
          handleSearch,
          serchText,
          230,
          viewCDRDetails || disableForm
        );
      case "nickName":
        return renderFieldsWithDropDown(
          nickNameList,
          null,
          handleSearch,
          serchText,
          230,
          viewCDRDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewCDRDetails || disableForm}
          />
        );
    }
  };

  const handleEditCDR = (values) => {
    if (values) {
      setEditCDRObj(values);
      setViewCDRDetails(false);
      cdrForms.setFieldsValue({
        mobileNo: values?.mobileNo,
        imeiNo: values?.imeiNo,
        towerIdNo: values?.towerIdNo,
        telecomServiceProvider: values?.telecomServiceProvider,
        nickName: values?.nickName,
      });
    }
  };

  const submit = async () => {
    const values = await cdrForms.validateFields();
    const payload = {
      crimeId: crimeId,
      data: {
        mobileNo: values?.mobileNo,
        imeiNo: values?.imeiNo,
        towerIdNo: values?.towerIdNo,
        telecomServiceProvider: values?.telecomServiceProvider,
        nickName: values?.nickName,
        cdrRequested: false,
      },
    };

    if (editCDRObj?._id) {
      const updatePayload = {
        cdrId: editCDRObj?._id,
        ...payload,
      };
      dispatch(updateCDRDetails(config.updateCDR, updatePayload));
    } else {
      dispatch(addCDRDetails(config.addCDR, payload));
    }
  };

  const onReset = () => {
    cdrForms.resetFields();
    sendCDRForms.resetFields();
    uploadCDRReportForms.resetFields();
    setSelectedItems([]);
    setSelectedRecordForUpload({});
    setViewCDRDetails(false);
    setEditCDRObj(null);
    dispatch(resetActionType());
    dispatch(resetRequestCDRActionType());
    checkFields();
  };

  useEffect(() => {
    onReset();
  }, [selectedTab]);

  const onRecordSelect = (value, item) => {
    if (value) {
      !isEmpty(selectedItems)
        ? setSelectedItems([item])
        : setSelectedItems([...selectedItems, item]);
    } else {
      const result =
        !isEmpty(selectedItems) &&
        selectedItems.filter((s) => s._id !== item?._id);
      setSelectedItems(result);
    }
    setSelectedRecordForUpload({});
  };

  const onUploadResultSelect = (item) => {
    setSelectedRecordForUpload(item);
    requestCDRForms.resetFields();
    setSelectedItems([]);
  };

  const uploadResultOfCDR = async () => {
    const formValue = await uploadCDRReportForms.validateFields();
    const uploadCDRReportFormData = new FormData();
    uploadCDRResult.forEach((file) => {
      uploadCDRReportFormData.append("file", file.originFileObj);
    });
    uploadCDRReportFormData.append("prefixFolder", crimeId);
    uploadCDRReportFormData.append(
      "folderPath",
      `${crimeId}/${folderName.DIGITAL_EVIDENCE}/uploadCDRs`
    );

    if (!isEmpty(uploadCDRResult)) {
      setIsUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, uploadCDRReportFormData)
        .then((res) => {
          if (res.status === 200) {
            setIsUploading(false);
            const { data } = res.data;
            const uploadCDRReportResult = first(
              getMediaPayload(data, folderName.DIGITAL_EVIDENCE)
            );
            const values = selectedRecordForUpload;

            const payload = {
              crimeId: crimeId,
              cdrId: values?._id,
              data: {
                mobileNo: values?.mobileNo,
                imeiNo: values?.imeiNo,
                towerIdNo: values?.towerIdNo,
                telecomServiceProvider: values?.telecomServiceProvider,
                nickName: values?.nickName,
                cdrRequested: values?.cdrRequested,
                requestCDRs: {
                  requestType: values?.requestCDRs?.requestType,
                  requestedPeriod: values?.requestCDRs?.requestedPeriod,
                  tspCircle: values?.requestCDRs?.tspCircle,
                  dateOfRequisition: values?.requestCDRs?.dateOfRequisition,
                  dateOfRequisitionToServiceProvider:
                    values?.requestCDRs?.dateOfRequisitionToServiceProvider,
                },
                dateOfReceiptOfCDR: formValue?.dateOfReceiptOfCDR,
                uploadResultCDR: uploadCDRReportResult,
                strengthOfEvidence: formValue?.strengthOfEvidence,
                remarksOfIO: formValue?.remarksOfIO,
              },
            };
            dispatch(uploadCDRRequestDetails(config.updateCDR, payload));
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    }
  };

  const sendCDRRequest = async () => {
    const formValue = await sendCDRForms.validateFields();
    !isEmpty(selectedItems) &&
      selectedItems.map((values) => {
        const payload = {
          crimeId: crimeId,
          cdrId: values?._id,
          data: {
            mobileNo: values?.mobileNo,
            imeiNo: values?.imeiNo,
            towerIdNo: values?.towerIdNo,
            telecomServiceProvider: values?.telecomServiceProvider,
            nickName: values?.nickName,
            cdrRequested: true,
            requestCDRs: {
              requestType: formValue?.requestType,
              requestedPeriod: formValue?.requestedPeriod,
              tspCircle: formValue?.tspCircle,
              dateOfRequisition: formValue?.dateOfRequisition,
              dateOfRequisitionToServiceProvider:
                formValue?.dateOfRequisitionToServiceProvider,
            },
          },
        };
        dispatch(requestCDRDetails(config.updateCDR, payload));
      });
  };

  const renderRequestToCDRForm = () => (
    <Card>
      <Form form={sendCDRForms} layout="vertical">
        <Row>
          <div style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18 }}>
            Request CDRs
          </div>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="requestType" label="Request Type">
              {renderFieldsWithMultipleDropDown(
                requestTypeList,
                null,
                handleSearch,
                serchText,
                230,
                viewCDRDetails || disableForm
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="requestedPeriod" label="Request Period">
              <RangePicker
                format={DATE_FORMAT}
                style={{ width: 230 }}
                onChange={checkFields}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tspCircle" label="Tsp Circle Ex.Ap">
              <Input
                onChange={checkFields}
                style={{ width: 230 }}
                maxLength={textFieldRules.maxLength}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 10 }}>
          <Col span={8}>
            <Form.Item name="dateOfRequisition" label="Date of Requisition">
              <DatePicker
                format={DATE_FORMAT}
                style={{ width: 230 }}
                onChange={checkFields}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="dateOfRequisitionToServiceProvider"
              label="Date of Requisition to Service Provider"
            >
              <DatePicker
                format={DATE_FORMAT}
                style={{ width: 230 }}
                onChange={checkFields}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={sendCDRRequest}
            disabled={false}
          >
            SAVE
          </Button>
          <span className="linkStyle resetLink" onClick={onReset}>
            Close
          </span>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderResultOfCDRForm = () => (
    <Card style={{ padding: 10 }}>
      <Form form={uploadCDRReportForms} layout="vertical">
        <Row>
          <div style={{ marginBottom: 10, fontWeight: "bold", fontSize: 18 }}>
            Upload Result of CDR
          </div>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="dateOfReceiptOfCDR"
              label="Date of Receipt of CDRs/CAF"
            >
              <DatePicker
                format={DATE_FORMAT}
                style={{ width: 230 }}
                onChange={checkFields}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="uploadResultCDR" label="">
              <Upload
                fileList={uploadCDRResult}
                customRequest={dummyRequest}
                onChange={(info) => onFileChange(info, setUploadCDRResult)}
                multiple={false}
                onPreview={handleDownload}
              >
                <Button
                  className="saveButton"
                  style={{ marginTop: 22, width: 230, marginBottom: 10 }}
                  icon={<CameraFilled style={{ float: "left" }} />}
                  disabled={
                    viewCDRDetails || !isEmpty(uploadCDRResult) || disableForm
                  }
                >
                  Upload Result of CDRs
                </Button>
              </Upload>
            </Form.Item>
            {isUploading ? (
              <Spin tip="Uploading...">
                <Alert
                  message="Upload Result of CDRs is in progress. Please wait!!"
                  type="info"
                />
              </Spin>
            ) : null}
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="strengthOfEvidence" label="Strength Of Evidence">
              {renderFieldsWithDropDown(
                strengthOfEvidence,
                null,
                handleSearch,
                serchText,
                230,
                viewCDRDetails || disableForm
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 10 }}>
          <Col span={12}>
            <Form.Item
              name="remarksOfIO"
              label="Remarks of IO"
              rules={[textAreaRules.textAreaMaxLength]}
            >
              <TextArea
                rows={4}
                columns={3}
                style={{ height: 150 }}
                maxLength={textAreaRules.maxLength}
                disabled={viewCDRDetails || disableForm}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={uploadResultOfCDR}
            disabled={viewCDRDetails || isEmpty(uploadCDRResult) || disableForm}
          >
            SAVE
          </Button>
          <span className="linkStyle resetLink" onClick={onReset}>
            Close
          </span>
        </Form.Item>
      </Form>
    </Card>
  );

  return isFetching ? (
    <Loader />
  ) : (
    <div style={{ padding: 20 }}>
      <Form form={cdrForms} layout="vertical">
        {displayState(cdrForm, displayFields)}
      </Form>
      <SaveResetButton
        onSubmit={submit}
        disabled={viewCDRDetails || disableForm}
        onReset={onReset}
      />
      {isArray(cdrList) && !isEmpty(cdrList) ? (
        <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 20 }}>
          <Form form={requestCDRForms} layout="vertical">
            <SavedCDRRecords
              dataSource={cdrList}
              onRecordSelect={onRecordSelect}
              editDetails={handleEditCDR}
              setViewDetails={setViewCDRDetails}
              selectedRecord={
                isNull(editCDRObj) ? selectedRecordForUpload : editCDRObj
              }
              checkFields={checkFields}
              onUploadResultSelect={onUploadResultSelect}
              disableForm={disableForm}
            />
          </Form>
        </div>
      ) : null}
      {!isEmpty(selectedItems) ? (
        <div style={{ marginTop: 20 }}>{renderRequestToCDRForm()}</div>
      ) : null}
      {isEmpty(selectedItems) && !isEmpty(selectedRecordForUpload) ? (
        <div style={{ marginTop: 20 }}>{renderResultOfCDRForm()}</div>
      ) : null}
    </div>
  );
}
