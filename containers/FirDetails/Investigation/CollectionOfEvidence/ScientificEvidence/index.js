import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Form,
  Card,
  Col,
  Input,
  Radio,
  DatePicker,
  Upload,
  Button,
  notification,
} from "antd";
import axios from "axios";
import { isEmpty, isArray, first, isUndefined, isString } from "lodash";
import moment from "moment";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import { disableFutureDates } from "@components/Common/helperMethods";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT_WITHOUT_SECONDS,
  renderFieldsWithDropDown,
  dummyRequest,
  getAccuseds,
  getWitnessDetails,
  getPersonDetails,
  shortAddress,
  onFileChange,
  folderName,
  getMediaPayload,
  getMediaUploadError,
} from "@containers/FirDetails/fir-util";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import AddProfessional from "@containers/FirDetails/Investigation/CommonForms/AddProfessional";
import scientificEvidenceActions from "@redux/investigations/collectionOfEvidence/scientificEvidence/actions";
import { CameraFilled } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import {
  scientificDropdownOptions,
  scientificNonFSLOptions,
  requisitionForwardThroughList,
  requisitionThroughCourt,
  requisitionThroughACP,
  uploadExpertReportOption,
} from "../const";
import ItemsToBeCollected from "./ItemsToBeCollected";
import SaveResetButton from "../SaveResetButton";
import { getEvidenceListData } from "../const";
import SavedRecordsNonFSL from "./SavedRecordsNonFSL";
import QuestionnairePopup from "./QuestionnairePopup";
import { getQuestionnairiePayload, initialQuestionnaireData } from "./const";

const { TextArea } = Input;

export default function ScientificEvidence({
  editScientificObj,
  setEditScientificObj,
  viewScientificDetails,
  setViewScientificDetails,
  selectedRequisitionForward,
  setSelectedRequisitionForward,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [nameAndAddressForm] = Form.useForm();
  const [babyForm] = Form.useForm();
  const [expertReportForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isExpertReportModalVisible, setIsExpertReportModalVisible] =
    useState(false);
  const [
    selectedExpertReportProfessional,
    setSelectedExpertReportProfessional,
  ] = useState({});
  const [isBabyModalVisible, setIsBabyModalVisible] = useState(false);
  const [isNameAndAddressModalVisible, setIsNameAndAddressModalVisible] =
    useState(false);
  const [
    selectedNameAndAddressOfProfessional,
    setSelectedNameAndAddressOfProfessional,
  ] = useState({});
  const [selectedProfessional, setSelectedProfressional] = useState({});
  const [selectedBabyProfessional, setSelectedBabyProfressional] = useState({});
  const [scientificEvidenceForm] = Form.useForm();
  const [selectedOptionType, setSelectedOptionType] = useState("Requisition");
  const [selectedExpertType, setSelectedExpertType] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [isDocuments, setIsDocuments] = useState(false);
  const [isSampleHandwritings, setIsSampleHandwritings] = useState(false);
  const [isSampleThumbImpressions, setIsSampleThumbImpressions] =
    useState(false);
  const [isSampleVoiceRecordings, setIsSampleVoiceRecordings] = useState(false);
  const [isOthersDetails, setIsOthersDetails] = useState(false);
  const [isDNASampling, setIsDNASampling] = useState(false);
  const [uploadReport, setUploadReport] = useState([]);
  const [selectedUploadReport, setSelectedUploadReport] = useState([]);
  const [uploadAcknowledgement, setUploadAcknowledgement] = useState([]);
  const [selectedUploadAcknowledgement, setSelectedUploadAcknowledgement] =
    useState([]);
  const [questionnaireData, setQuestionnaireData] = useState(
    initialQuestionnaireData
  );

  const { evidenceCollectionList, courtsFromPSList } = useSelector(
    (state) => state.MasterData
  );
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const { createAuditHistory } = auditHistoryActions;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { witnessStatementList } = useSelector((state) => state.FIR);
  const accusedList =
    !isEmpty(suspectAccusedList) && getAccuseds(suspectAccusedList);
  const witnessList =
    !isEmpty(witnessStatementList) && getWitnessDetails(witnessStatementList);

  const {
    addScientificEvidenceDetails,
    updateScientificEvidenceDetails,
    getScientificEvidenceList,
    resetActionType,
  } = scientificEvidenceActions;
  const {
    actionType,
    errorMessage,
    successMessage,
    scientificEvidenceList,
    isFetching,
  } = useSelector((state) => state.ScientificEvidence);
  const isSuccess =
    actionType === "ADD_SCIENTIFIC_EVIDENCE_SUCCESS" ||
    actionType === "UPDATE_SCIENTIFIC_EVIDENCE_SUCCESS";
  const isError =
    actionType === "ADD_SCIENTIFIC_EVIDENCE_ERROR" ||
    actionType === "UPDATE_SCIENTIFIC_EVIDENCE_ERROR";

  const checkFields = async () => {
    const values = await scientificEvidenceForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_SCIENTIFIC_EVIDENCE_SUCCESS"
        ? "Scientific Evidence Created"
        : "Scientific Evidence Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/scientificEvidence",
          auditType
        )
      )
    );
  };

  const fetchScientificList = () => {
    dispatch(
      getScientificEvidenceList(
        `${config.getEvidenceDetails}/SCIENTIFIC/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    fetchScientificList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Scientific evidence successfully added" ||
        successMessage === "Scientific evidence successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        scientificEvidenceForm.resetFields();
        setViewScientificDetails(false);
        setEditScientificObj(null);
        setIsDocuments(false);
        setIsSampleHandwritings(false);
        setIsSampleThumbImpressions(false);
        setIsSampleVoiceRecordings(false);
        setIsOthersDetails(false);
        setIsDNASampling(false);
        setSelectedProfressional([]);
        setSelectedNameAndAddressOfProfessional([]);
        setSelectedBabyProfressional([]);
        setSelectedExpertReportProfessional([]);
        setSelectedRequisitionForward("");
        setSelectedOptionType("Requisition");
        setUploadReport([]);
        setSelectedUploadReport([]);
        setUploadAcknowledgement([]);
        setSelectedUploadAcknowledgement([]);
        dispatch(resetActionType());
        fetchScientificList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onExpertTypeChange = (val) => {
    setSelectedExpertType(val);
  };

  const onRequisitionForwardChange = (val) => {
    setSelectedRequisitionForward(val);
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };
  const expertTypeList = getEvidenceListData(getDropdownValues("expertType"));

  const typeOfRequisition = getEvidenceListData(
    getDropdownValues("typeOfRequisition")
  );
  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const witnessAccusedList = accusedList &&
    witnessList && [...accusedList, ...witnessList];

  const displayFields = (name) => {
    switch (name) {
      case "expertType":
        return renderFieldsWithDropDown(
          expertTypeList,
          onExpertTypeChange,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "dateOfRequisitionForReport":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "typeOfRequisition":
        return renderFieldsWithDropDown(
          typeOfRequisition,
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "dateOfVisitInspection":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "nameAndAddressOfExpert":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "dateOfRequisitionToCourt":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "nameOfCourt":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "dateOfRequisitionToACP":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "dnaSamplingOf":
        return renderFieldsWithDropDown(
          witnessAccusedList,
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "babyOfWitness":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "dateOfDnaSampleCollected":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "dateOfReceiptOfReport":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_FORMAT}
            style={{ width: 230 }}
            onChange={checkFields}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "strengthOfEvidence":
        return renderFieldsWithDropDown(
          strengthOfEvidence,
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "expertName":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          230,
          viewScientificDetails || disableForm
        );
      case "uploadReport":
        return (
          <Upload
            fileList={
              editScientificObj?._id &&
              editScientificObj?.uploadExpertReport?.uploadReport &&
              editScientificObj?.uploadExpertReport?.uploadReport?.url !== ""
                ? selectedUploadReport
                : uploadReport
            }
            onPreview={handleDownload}
            customRequest={dummyRequest}
            onChange={(info) => onFileChange(info, setUploadReport)}
            multiple={false}
          >
            <Button
              className="saveButton"
              style={{ marginTop: 22, width: 180 }}
              icon={<CameraFilled style={{ float: "left" }} />}
              disabled={
                viewScientificDetails || !isEmpty(uploadReport) || disableForm
              }
            >
              Upload Report
            </Button>
          </Upload>
        );
      case "opinion":
        return (
          <TextArea
            rows={4}
            columns={3}
            style={{ width: 620 }}
            maxLength={textAreaRules.maxLength}
            disabled={viewScientificDetails || disableForm}
          />
        );
      case "dateAndTimeOfSendingToFSL":
        return (
          <DatePicker
            format={DATE_TIME_FORMAT_WITHOUT_SECONDS}
            style={{ width: 230 }}
            onChange={checkFields}
            showTime
            disabled={viewScientificDetails || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewScientificDetails || disableForm}
          />
        );
    }
  };

  const displayState = (data, actionName, modalActions) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          // add 'isRequired' key with value 'true' if the field is mandatory
          const rules = s?.isRequired ? [{ required: true }] : [];
          return (
            <Col span={8} key={i} style={{ marginBottom: 10, marginRight: 20 }}>
              <Form.Item name={s.name} label={s.label} rules={rules}>
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() =>
                    modalActions && modalActions(disableForm ? false : true)
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

  const checkSelectedOptionTypeValue = (e) => {
    setSelectedOptionType(e.target.value);
    checkFields();
  };

  const onReset = () => {
    scientificEvidenceForm.resetFields();
    setEditScientificObj(null);
    setViewScientificDetails(false);
    setIsDocuments(false);
    setIsSampleHandwritings(false);
    setIsSampleThumbImpressions(false);
    setIsSampleVoiceRecordings(false);
    setIsOthersDetails(false);
    setIsDNASampling(false);
    setSelectedProfressional([]);
    setSelectedNameAndAddressOfProfessional([]);
    setSelectedBabyProfressional([]);
    setSelectedExpertReportProfessional([]);
    setSelectedRequisitionForward("");
    setUploadReport([]);
    setSelectedUploadReport([]);
    setUploadAcknowledgement([]);
    setSelectedUploadAcknowledgement([]);
    checkFields();
  };

  const getPayloadData = (values, uploadReport, uploadAcknowledgement) => {
    const payload = {
      crimeId: crimeId,
      scientificEvidence: {
        expertType: values?.expertType,
        natureOfReport: values?.natureOfReport,
        requisition: {
          dateOfRequisitionForReport: values?.dateOfRequisitionForReport,
          typeOfRequisition: values?.typeOfRequisition,
          dateOfVisitInspection: values?.dateOfVisitInspection,
          nameAndAddressOfExpert: selectedNameAndAddressOfProfessional,
        },
        uploadExpertReport: {
          dateOfReceiptOfReport: values?.dateOfReceiptOfReport,
          strengthOfEvidence: values?.strengthOfEvidence,
          expertName: selectedExpertReportProfessional,
          opinion: values?.opinion,
          uploadReport: uploadReport,
        },
        requisitionForwardThrough: values?.requisitionForwardThrough,
        dateOfRequisitionToCourt: values?.dateOfRequisitionToCourt,
        nameOfCourt: values?.nameOfCourt,
        dateOfRequisitionToACP: values?.dateOfRequisitionToACP,
        documentNames: values.documentNames,
        dateOfReceiptOfDocuments: values?.dateOfReceiptOfDocuments,
        isDocuments: values?.isDocuments,
        isRequisition: selectedOptionType === "Requisition" ? true : false,
        isOthersDetails: values?.isOthersDetails,
        handWritings: {
          isSampleHandwritings: values?.isSampleHandwritings,
          witnessList: values?.sampleHandwritingWitnessList,
          accusedList: values?.sampleHandwritingAccusedList,
        },
        thumbImpressions: {
          isSampleThumbImpressions: values?.isSampleThumbImpressions,
          witnessList: values?.sampleHandwritingWitnessList,
          accusedList: values?.sampleHandwritingAccusedList,
        },
        voiceRecordings: {
          isSampleVoiceRecordings: values?.isSampleVoiceRecordings,
          witnessList: values?.sampleHandwritingWitnessList,
          accusedList: values?.sampleHandwritingAccusedList,
        },
        dateOfCollection: values.dateOfCollection,
        dnaSamplingFSL: {
          isDNASampling: values?.isDNASampling,
          witnessList: values?.fsldnaWitnessList,
          accusedList: values?.fsldnaAccusedList,
          babyOfWitness: !isEmpty(selectedProfessional)
            ? [getPersonDetails(selectedProfessional, inputList)]
            : editScientificObj?.dnaSamplingFSL?.babyOfWitness,
          dateOfAcknowledgement: values?.fsldateOfAcknowledgement,
          acknowledgementNo: values?.fslacknowledgementNo,
          dateOfDNACollection: values?.fsldateOfDNACollection,
          fslFileNo: values?.fslFileNofsl,
        },
        acpDnaSamplingFSL: {
          babyOfWitness: !isEmpty(selectedBabyProfessional)
            ? [getPersonDetails(selectedBabyProfessional, inputList)]
            : editScientificObj?.acpDnaSamplingFSL?.babyOfWitness,
          acknowledgementNo: values?.dnaSamplingOf,
          dateOfDNACollection: values?.dateOfDnaSampleCollected,
          fslFileNo: values?.fslFileNumber,
        },
        others: values?.others,
        uploadAcknowledgement: uploadAcknowledgement,
        templates: [
          {
            mimeType: "",
            name: "",
            url: "",
            fileId: "",
          },
        ],
        sendDate: values?.dateAndTimeOfSendingToFSL,
        propertyQuestions: values?.propertyQuestions || {},
      },
    };

    return payload;
  };

  const submit = async () => {
    let values = await scientificEvidenceForm.validateFields();
    if (
      !isEmpty(editScientificObj?._id) &&
      !isEmpty(editScientificObj?.propertyQuestions)
    ) {
      values = {
        ...values,
        propertyQuestions: editScientificObj?.propertyQuestions,
      };
    }
    const ackFormData = new FormData();
    uploadAcknowledgement.forEach((file) => {
      ackFormData.append("file", file.originFileObj);
    });
    ackFormData.append("prefixFolder", crimeId);
    ackFormData.append(
      "folderPath",
      `${crimeId}/${folderName.SCIENTIFIC_EVIDENCE}/file`
    );

    const reportFormData = new FormData();
    uploadReport.forEach((file) => {
      reportFormData.append("file", file.originFileObj);
    });
    reportFormData.append("prefixFolder", crimeId);
    reportFormData.append(
      "folderPath",
      `${crimeId}/${folderName.SCIENTIFIC_EVIDENCE}/file`
    );

    if (!isEmpty(uploadReport) && !isEmpty(uploadAcknowledgement)) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, reportFormData),
          axios.post(`${config.fileUpload}/upload`, ackFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              const reportDataResult = data1.data?.data;
              const ackDataResult = data2.data?.data;
              const uploadReport = first(
                getMediaPayload(
                  reportDataResult,
                  folderName.SCIENTIFIC_EVIDENCE
                )
              );
              const uploadAckResult = first(
                getMediaPayload(ackDataResult, folderName.SCIENTIFIC_EVIDENCE)
              );

              if (editScientificObj?._id) {
                const updatePayload = {
                  scientificEvidenceId: editScientificObj?._id,
                  ...getPayloadData(values, uploadReport, uploadAckResult),
                };
                dispatch(
                  updateScientificEvidenceDetails(
                    config.updateScientificEvidence,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addScientificEvidenceDetails(
                    config.addScientificEvidence,
                    getPayloadData(values, uploadReport, uploadAckResult)
                  )
                );
              }
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadReport) && !isEmpty(uploadAcknowledgement)) {
      axios
        .post(`${config.fileUpload}/upload`, ackFormData)
        .then((res) => {
          if (res.status === 200) {
            const uploadExpertReport = editScientificObj?.uploadExpertReport;
            const updateReportResult =
              uploadExpertReport && uploadExpertReport?.uploadReport
                ? uploadExpertReport?.uploadReport
                : {};
            const { data } = res.data;
            const uploadAckResult = first(
              getMediaPayload(data, folderName.SCIENTIFIC_EVIDENCE)
            );

            if (editScientificObj?._id) {
              const updatePayload = {
                scientificEvidenceId: editScientificObj?._id,
                ...getPayloadData(values, updateReportResult, uploadAckResult),
              };
              dispatch(
                updateScientificEvidenceDetails(
                  config.updateScientificEvidence,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addScientificEvidenceDetails(
                  config.addScientificEvidence,
                  getPayloadData(
                    values,
                    updateReportResult,
                    uploadAcknowledgement
                  )
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadAcknowledgement) && !isEmpty(uploadReport)) {
      axios
        .post(`${config.fileUpload}/upload`, reportFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const uploadAcknowledgement =
              editScientificObj?.uploadAcknowledgement;
            const updateAckResult = uploadAcknowledgement
              ? uploadAcknowledgement
              : {};
            const uploadReport = first(
              getMediaPayload(data, folderName.SCIENTIFIC_EVIDENCE)
            );

            if (editScientificObj?._id) {
              // const newValues = { ...values, editScientificObj };
              const updatePayload = {
                scientificEvidenceId: editScientificObj?._id,
                ...getPayloadData(values, uploadReport, updateAckResult),
              };
              dispatch(
                updateScientificEvidenceDetails(
                  config.updateScientificEvidence,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addScientificEvidenceDetails(
                  config.addScientificEvidence,
                  getPayloadData(values, uploadReport, updateAckResult)
                )
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadAcknowledgement) && isEmpty(uploadReport)) {
      if (editScientificObj?._id) {
        const uploadAcknowledgement = editScientificObj?.uploadAcknowledgement;
        const updateAckResult = uploadAcknowledgement
          ? uploadAcknowledgement
          : {};
        const uploadExpertReport = editScientificObj?.uploadExpertReport;
        const updateReportResult =
          uploadExpertReport && uploadExpertReport?.uploadReport
            ? uploadExpertReport?.uploadReport
            : {};
        const updatePayload = {
          scientificEvidenceId: editScientificObj?._id,
          ...getPayloadData(values, updateReportResult, updateAckResult),
        };
        dispatch(
          updateScientificEvidenceDetails(
            config.updateScientificEvidence,
            updatePayload
          )
        );
      } else {
        dispatch(
          addScientificEvidenceDetails(
            config.addScientificEvidence,
            getPayloadData(values, {}, {})
          )
        );
      }
    }
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedProfressional(values);
    scientificEvidenceForm.setFieldsValue({
      fslbabyOfWitness:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
    personForm.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    personForm.resetFields();
  };

  const handleNameAndAddressOk = async () => {
    const values = await nameAndAddressForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "Scientific Evidence";
    personalDetails.createdFor = "Proffessional";
    setSelectedNameAndAddressOfProfessional(professionalDetails);
    const address = shortAddress(values);
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    scientificEvidenceForm.setFieldsValue({
      nameAndAddressOfExpert: `${name} ${address}`,
    });
    setIsNameAndAddressModalVisible(false);
    nameAndAddressForm.resetFields();
  };

  const handleNameAndAddressCancel = () => {
    setIsNameAndAddressModalVisible(false);
    nameAndAddressForm.resetFields();
  };

  const handleBabyOk = async () => {
    const values = await babyForm.validateFields();
    setSelectedBabyProfressional(values);
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    scientificEvidenceForm.setFieldsValue({
      babyOfWitness: `${name}`,
    });
    setIsBabyModalVisible(false);
    babyForm.resetFields();
  };

  const handleBabyCancel = () => {
    setIsBabyModalVisible(false);
    babyForm.resetFields();
  };

  const handleExpertReportOk = async () => {
    const values = await expertReportForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "Scientific Evidence";
    personalDetails.createdFor = "Proffessional";
    setSelectedExpertReportProfessional(professionalDetails);
    const name =
      (values?.name ? values?.name : "") +
      " " +
      (values?.surname ? values?.surname : "");
    scientificEvidenceForm.setFieldsValue({
      expertName: `${name}`,
    });
    setIsExpertReportModalVisible(false);
    expertReportForm.resetFields();
  };

  const handleExpertReportCancel = () => {
    setIsExpertReportModalVisible(false);
    expertReportForm.resetFields();
  };

  const getListOfIds = (items) => {
    const arr = [];
    !isEmpty(items) &&
      // eslint-disable-next-line array-callback-return
      items.map((s) => {
        arr.push(s._id);
      });
    return arr;
  };

  const handleEditScientificEvidence = (values) => {
    if (values) {
      setEditScientificObj(values);
      setViewScientificDetails(false);
      const {
        acpDnaSamplingFSL,
        dnaSamplingFSL,
        handWritings,
        requisition,
        thumbImpressions,
        voiceRecordings,
        uploadExpertReport,
      } = values;
      if (
        values?.uploadAcknowledgement &&
        !isUndefined(values?.uploadAcknowledgement) &&
        !isArray(values?.uploadAcknowledgement) &&
        values?.uploadAcknowledgement?.url !== ""
      ) {
        setSelectedUploadAcknowledgement([values?.uploadAcknowledgement]);
      } else {
        setSelectedUploadAcknowledgement([]);
      }
      const uploadExpertReportData = values?.uploadExpertReport;
      if (
        uploadExpertReportData &&
        !isUndefined(uploadExpertReportData?.uploadReport?.url) &&
        !isArray(uploadExpertReportData?.uploadReport) &&
        uploadExpertReportData?.uploadReport?.url !== ""
      ) {
        !isUndefined(uploadExpertReportData?.uploadReport) &&
        !isArray(uploadExpertReportData?.uploadReport)
          ? setSelectedUploadReport([uploadExpertReportData?.uploadReport])
          : setSelectedUploadReport([]);
      } else {
        setSelectedUploadReport([]);
      }
      setSelectedExpertType(values?.expertType);
      setSelectedRequisitionForward(values?.requisitionForwardThrough);
      setIsDocuments(values?.isDocuments);
      setIsSampleHandwritings(handWritings?.isSampleHandwritings);
      setIsSampleThumbImpressions(thumbImpressions?.isSampleThumbImpressions);
      setIsSampleVoiceRecordings(voiceRecordings?.isSampleVoiceRecordings);
      setIsOthersDetails(values?.isOthersDetails);
      setIsDNASampling(dnaSamplingFSL?.isDNASampling);
      setSelectedProfressional([]);
      setSelectedBabyProfressional([]);
      const nameAndAddressOfExpert = requisition?.nameAndAddressOfExpert;
      setSelectedNameAndAddressOfProfessional(
        nameAndAddressOfExpert?._id ? nameAndAddressOfExpert : []
      );
      setSelectedExpertReportProfessional(
        uploadExpertReport?.expertName?._id
          ? uploadExpertReport?.expertName
          : []
      );
      const isRequisition =
        values?.isRequisition === true ? "Requisition" : "UploadExpertReport";
      setSelectedOptionType(isRequisition);
      const address =
        !isUndefined(nameAndAddressOfExpert?.presentAddress) &&
        nameAndAddressOfExpert?.presentAddress &&
        shortAddress(nameAndAddressOfExpert?.presentAddress);
      const expertpersonDetails =
        uploadExpertReport?.expertName?.personalDetails;
      const expertname =
        (expertpersonDetails?.name ? expertpersonDetails?.name : "") +
        " " +
        (expertpersonDetails?.surname ? expertpersonDetails?.surname : "");
      const personDetails =
        !isUndefined(nameAndAddressOfExpert?.personalDetails) &&
        nameAndAddressOfExpert?.personalDetails &&
        nameAndAddressOfExpert?.personalDetails;
      const name =
        (personDetails?.name && personDetails?.name
          ? personDetails?.name
          : "") +
        " " +
        (personDetails?.surname && personDetails?.surname
          ? personDetails?.surname
          : "");
      const fslBabyOfWitnessDetails =
        !isUndefined(dnaSamplingFSL?.babyOfWitness) &&
        dnaSamplingFSL?.babyOfWitness &&
        first(dnaSamplingFSL?.babyOfWitness)?.personalDetails;
      const fslname =
        (fslBabyOfWitnessDetails?.name && fslBabyOfWitnessDetails?.name
          ? fslBabyOfWitnessDetails?.name
          : "") +
        " " +
        (fslBabyOfWitnessDetails?.name && fslBabyOfWitnessDetails?.surname
          ? fslBabyOfWitnessDetails?.surname
          : "");

      const babyOfWitnessDetails =
        !isUndefined(acpDnaSamplingFSL?.babyOfWitness) &&
        acpDnaSamplingFSL?.babyOfWitness &&
        first(acpDnaSamplingFSL?.babyOfWitness)?.personalDetails;

      const babyOfWitnessName =
        (babyOfWitnessDetails?.name && babyOfWitnessDetails?.name
          ? babyOfWitnessDetails?.name
          : "") +
        " " +
        (babyOfWitnessDetails?.surname && babyOfWitnessDetails?.surname
          ? babyOfWitnessDetails?.surname
          : "");
      nameAndAddressForm.setFieldsValue({
        name: personDetails?.name,
        surname: personDetails?.surname,
        placeOfWork: personDetails?.placeOfWork,
        designation: personDetails?.designation,
      });
      scientificEvidenceForm.setFieldsValue({
        evidenceOption: isRequisition,
        expertType: values?.expertType,
        natureOfReport: values?.natureOfReport,
        dateOfRequisitionForReport: moment(
          new Date(requisition?.dateOfRequisitionForReport)
        ).isValid()
          ? moment(new Date(requisition?.dateOfRequisitionForReport))
          : "",
        typeOfRequisition: requisition?.typeOfRequisition,
        dateOfVisitInspection: moment(
          new Date(requisition?.dateOfVisitInspection)
        ).isValid()
          ? moment(new Date(requisition?.dateOfVisitInspection))
          : "",
        nameAndAddressOfExpert: `${name ? name : ""} ${address ? address : ""}`,
        isDocuments: values?.isDocuments,
        isSampleHandwritings: handWritings?.isSampleHandwritings,
        isSampleThumbImpressions: thumbImpressions?.isSampleThumbImpressions,
        isSampleVoiceRecordings: voiceRecordings?.isSampleVoiceRecordings,
        isDNASampling: dnaSamplingFSL?.isDNASampling,
        isOthersDetails: values?.isOthersDetails,
        documentNames: values?.documentNames,
        dateOfReceiptOfDocuments: moment(
          new Date(values?.dateOfReceiptOfDocuments)
        ).isValid()
          ? moment(new Date(values?.dateOfReceiptOfDocuments))
          : "",
        sampleHandwritingWitnessList: getListOfIds(handWritings?.witnessList),
        sampleHandwritingAccusedList: getListOfIds(handWritings?.accusedList),
        dateOfCollection: moment(new Date(values?.dateOfCollection)).isValid()
          ? moment(new Date(values?.dateOfCollection))
          : "",
        fsldnaWitnessList: getListOfIds(dnaSamplingFSL?.witnessList),
        fsldnaAccusedList: getListOfIds(dnaSamplingFSL?.accusedList),
        fslbabyOfWitness: fslname || "",
        fsldateOfAcknowledgement: moment(
          new Date(dnaSamplingFSL?.dateOfAcknowledgement)
        ).isValid()
          ? moment(new Date(dnaSamplingFSL?.dateOfAcknowledgement))
          : "",
        fslacknowledgementNo: dnaSamplingFSL?.acknowledgementNo,
        fsldateOfDNACollection: moment(
          new Date(dnaSamplingFSL?.dateOfDNACollection)
        ).isValid()
          ? moment(new Date(dnaSamplingFSL?.dateOfDNACollection))
          : "",
        fslFileNofsl: dnaSamplingFSL?.fslFileNo,
        others: values?.others,
        requisitionForwardThrough: values?.requisitionForwardThrough,
        dateOfRequisitionToCourt: moment(
          new Date(values?.dateOfRequisitionToCourt)
        ).isValid()
          ? moment(new Date(values?.dateOfRequisitionToCourt))
          : "",
        nameOfCourt: values?.nameOfCourt,
        dnaSamplingOf: acpDnaSamplingFSL?.acknowledgementNo,
        fslFileNumber: acpDnaSamplingFSL?.fslFileNo,
        babyOfWitness: babyOfWitnessName,
        dateOfDnaSampleCollected: moment(
          new Date(acpDnaSamplingFSL?.dateOfDNACollection)
        ).isValid()
          ? moment(new Date(acpDnaSamplingFSL?.dateOfDNACollection))
          : "",
        dateOfRequisitionToACP: moment(
          new Date(values?.dateOfRequisitionToACP)
        ).isValid()
          ? moment(new Date(values?.dateOfRequisitionToACP))
          : "",
        dateOfReceiptOfReport: moment(
          new Date(uploadExpertReport?.dateOfReceiptOfReport)
        ).isValid()
          ? moment(new Date(uploadExpertReport?.dateOfReceiptOfReport))
          : "",
        dateAndTimeOfSendingToFSL:
          isString(values?.sendDate) &&
          !isEmpty(values?.sendDate) &&
          moment(values?.sendDate).isValid()
            ? moment(values?.sendDate)
            : "",
        strengthOfEvidence: uploadExpertReport?.strengthOfEvidence,
        expertName: expertname,
        opinion: uploadExpertReport?.opinion,
      });
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const onQuestionnaireClick = useCallback((selectedRecord) => {
    setQuestionnaireData({ isOpen: true, selectedRecord });
  }, []);

  const onQuestionnaireOk = useCallback(
    (payload) => {
      const updatePayload = getQuestionnairiePayload(
        payload,
        questionnaireData?.selectedRecord,
        crimeId
      );
      dispatch(
        updateScientificEvidenceDetails(
          config.updateScientificEvidence,
          updatePayload
        )
      );
      setQuestionnaireData(initialQuestionnaireData);
    },
    [questionnaireData]
  );

  const onQuestionnaireCancel = useCallback(() => {
    setQuestionnaireData(initialQuestionnaireData);
  }, []);

  const disableUploadExpertReport =
    selectedExpertType === "FSL Expert" ||
    selectedExpertType === "Medical Officer"
      ? false
      : !editScientificObj?._id;

  return isFetching ? (
    <Loader />
  ) : (
    <>
      <Form form={scientificEvidenceForm} layout="vertical">
        <Card style={{ width: "100%" }}>
          {displayState(scientificDropdownOptions, displayFields, null)}
          <Row>
            <Col className="custody-col">
              <Form.Item name="evidenceOption">
                <Radio.Group
                  name="radiogroup"
                  onChange={checkSelectedOptionTypeValue}
                  defaultValue={selectedOptionType}
                  disabled={viewScientificDetails || disableForm}
                >
                  <Radio value="Requisition">Requisition</Radio>
                  <Radio
                    value="UploadExpertReport"
                    disabled={disableUploadExpertReport}
                  >
                    Upload Expert Report
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 10 }}>
            {selectedExpertType === "FSL Expert" &&
            selectedOptionType !== "UploadExpertReport" ? (
              <Col className="custody-col">
                <Form.Item
                  name="requisitionForwardThrough"
                  label="Requisitions Forwarded Through"
                  rules={[{ required: true }]}
                >
                  {renderFieldsWithDropDown(
                    requisitionForwardThroughList,
                    onRequisitionForwardChange,
                    handleSearch,
                    serchText,
                    230,
                    viewScientificDetails || disableForm
                  )}
                </Form.Item>
              </Col>
            ) : null}

            {selectedExpertType !== "FSL Expert" &&
            selectedOptionType === "Requisition" ? (
              <Col span={24}>
                {displayState(
                  scientificNonFSLOptions,
                  displayFields,
                  setIsNameAndAddressModalVisible
                )}
              </Col>
            ) : null}
          </Row>

          <Row style={{ marginTop: 10 }}>
            {selectedOptionType === "UploadExpertReport" ? (
              <Col span={24}>
                {displayState(
                  uploadExpertReportOption,
                  displayFields,
                  setIsExpertReportModalVisible
                )}
              </Col>
            ) : null}
          </Row>

          <Row style={{ marginTop: 10 }}>
            {selectedExpertType === "FSL Expert" &&
            selectedRequisitionForward === "ACP" &&
            selectedOptionType !== "UploadExpertReport" ? (
              <Col span={24}>
                {displayState(
                  requisitionThroughACP,
                  displayFields,
                  setIsBabyModalVisible
                )}
              </Col>
            ) : null}

            {selectedExpertType === "FSL Expert" &&
            selectedRequisitionForward === "Through Court" &&
            selectedOptionType !== "UploadExpertReport" ? (
              <Col span={24}>
                {displayState(requisitionThroughCourt, displayFields, null)}
              </Col>
            ) : null}
          </Row>
        </Card>
        {selectedExpertType === "FSL Expert" &&
        selectedRequisitionForward === "Through Court" ? (
          <ItemsToBeCollected
            disableForm={viewScientificDetails || disableForm}
            checkFields={checkFields}
            handleSearch={handleSearch}
            serchText={serchText}
            accusedList={accusedList}
            witnessList={witnessList}
            setIsModalVisible={setIsModalVisible}
            isDocuments={isDocuments}
            setIsDocuments={setIsDocuments}
            isSampleHandwritings={isSampleHandwritings}
            setIsSampleHandwritings={setIsSampleHandwritings}
            isSampleThumbImpressions={isSampleThumbImpressions}
            setIsSampleThumbImpressions={setIsSampleThumbImpressions}
            isSampleVoiceRecordings={isSampleVoiceRecordings}
            setIsSampleVoiceRecordings={setIsSampleVoiceRecordings}
            isOthersDetails={isOthersDetails}
            setIsOthersDetails={setIsOthersDetails}
            isDNASampling={isDNASampling}
            setIsDNASampling={setIsDNASampling}
            editScientificObj={editScientificObj}
            selectedUploadAcknowledgement={selectedUploadAcknowledgement}
            uploadAcknowledgement={uploadAcknowledgement}
            onFileChange={onFileChange}
            setUploadAcknowledgement={setUploadAcknowledgement}
          />
        ) : null}

        <SaveResetButton
          onSubmit={submit}
          disabled={viewScientificDetails || disableForm}
          onReset={onReset}
        />
        {isModalVisible ? (
          <AddPerson
            title="Add Baby Details"
            isModalVisible={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
            formName={personForm}
            checkFields={checkFields}
            disabled={viewScientificDetails || disableForm}
            setInputList={setInputList}
            editObj={editScientificObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
        {isNameAndAddressModalVisible ? (
          <AddProfessional
            title="Add Professional Details"
            isModalVisible={isNameAndAddressModalVisible}
            handleOk={handleNameAndAddressOk}
            handleCancel={handleNameAndAddressCancel}
            formName={nameAndAddressForm}
            checkFields={checkFields}
            disabled={viewScientificDetails || disableForm}
            setInputList={setInputList}
            editObj={editScientificObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
        {isBabyModalVisible ? (
          <AddPerson
            title="Add Baby Details"
            isModalVisible={isBabyModalVisible}
            handleOk={handleBabyOk}
            handleCancel={handleBabyCancel}
            formName={babyForm}
            checkFields={checkFields}
            disabled={viewScientificDetails || disableForm}
            setInputList={setInputList}
            editObj={editScientificObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
        {isExpertReportModalVisible ? (
          <AddProfessional
            title="Add Professional Details"
            isModalVisible={isExpertReportModalVisible}
            handleOk={handleExpertReportOk}
            handleCancel={handleExpertReportCancel}
            formName={expertReportForm}
            checkFields={checkFields}
            disabled={viewScientificDetails || disableForm}
            setInputList={setInputList}
            editObj={editScientificObj}
            age={age}
            setAge={setAge}
          />
        ) : null}
      </Form>

      {isArray(scientificEvidenceList) && !isEmpty(scientificEvidenceList) ? (
        <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 20 }}>
          <SavedRecordsNonFSL
            dataSource={scientificEvidenceList}
            editDetails={handleEditScientificEvidence}
            setViewDetails={setViewScientificDetails}
            selectedRecord={editScientificObj}
            disableForm={disableForm}
            onQuestionnaireClick={onQuestionnaireClick}
          />
        </div>
      ) : null}

      <QuestionnairePopup
        isQuestionnaireOpen={questionnaireData?.isOpen}
        onQuestionnaireOk={onQuestionnaireOk}
        onQuestionnaireCancel={onQuestionnaireCancel}
        selectedType="DNA"
        defaultValue={questionnaireData?.selectedRecord?.propertyQuestions}
      />
    </>
  );
}
