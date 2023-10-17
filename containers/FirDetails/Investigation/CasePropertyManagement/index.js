/* eslint-disable array-callback-return */
import { useEffect, useState } from "react";
import { isEmpty, isArray, isNull, isUndefined, last } from "lodash";
import axios from "axios";
import { config } from "@config/site.config";
import { disableFutureDates } from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import moment from "moment";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import stolenPropertyActions from "@redux/investigations/stolenProperty/actions";
import {
  Form,
  Table,
  Radio,
  Modal,
  Select,
  Upload,
  Button,
  DatePicker,
  Card,
  notification,
  Input,
  Row,
  Col,
  Checkbox,
} from "antd";
import masterDataActions from "@redux/masterData/actions";
import {
  CaretDownOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import TableWrapper from "@containers/Tables/AntTables/AntTables.styles";
import { useDispatch, useSelector } from "react-redux";
import firActions from "@redux/fir/actions";
import casePropertyManagementActions from "@redux/investigations/casePropertyManagement/actions";
import { loadState } from "@lib/helpers/localStorage";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import TemplatesModal from "../CommonForms/TemplatesModal";
import ContentHeader from "../../ContentHeader";
import { CasePropertyManagementContainer } from "./styles";
import {
  CasePropertyTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
  sendToCourtDrop,
  LetterToExpertTemplate,
  forwardingThroughACPList,
  forwardingThroughCourtList,
  forwardingThroughList,
  dataType,
} from "./const";
import UploadLetters from "./uploadLetters";

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const columnsHistory = [
  {
    title: "Send To",
    dataIndex: "sendTo",
    key: "sendTo",
  },
  {
    title: "Date",
    dataIndex: "date",
    render: (_name, item) => {
      return !!item.date === true
        ? moment(item.date).format("DD-MM-YYYY hh:mm:ss")
        : "";
    },
  },
];

export default function CasePropertyManagement({ setSelectedSiderMenu }) {
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [serchText, setSerchText] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [directionByCourt, setDirectionByCourt] = useState("");
  const [selectedMOList, setSelectedMOList] = useState([]);
  const [selectedMOForQuestions, setSelectedMOForQuestions] = useState(null);
  const [errorInSelection, setErrorInSelection] = useState(false);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [materialObjectApi, setMaterilaObjectApi] = useState([]);
  const [stolenPropertyApiList, setStolenPropertyApiList] = useState([]);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [forwardingThrough, setForwardingThrough] = useState("");
  const [showSendToCourt, setShowSendToCourt] = useState(false);
  const [showSendToFSL, setShowSendToFSL] = useState(false);
  const [showSendToOtherExperts, setShowSendToOtherExperts] = useState(false);
  const [showSendToCourtDirections, setShowSendToCourtDirections] =
    useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [casePropertyFileList, setcasePropertyFileList] = useState([]);
  const [casePropertyUploadFileList, setcasePropertyUploadFileList] = useState(
    []
  );
  const [uploadedCasePropertyAckFileList, setUploadedCasePropertyAckFileList] =
    useState([]);

  const [viewHistoryItem, setviewHistoryItem] = useState({});
  const [viewHistoryDataSource, setViewHistoryDataSource] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [FSLExpertType, setFSLExpertType] = useState("");
  const [showError, setShowError] = useState(false);
  const [selectedLetterOfAdvice, setSelectedLetterOfAdvice] = useState([]);
  const [selectedRequisitionLetter, setSelectedrRequisitionLetter] = useState(
    []
  );
  const [selectedLetterOfExpert, setSelectedLetterOfExpert] = useState([]);
  const [uploadedCasePropertyFileList, setUploadedCasePropertyFileList] =
    useState([]);
  const [otherQuestion, setOtherQuestion] = useState([]);

  const { getCourtsBasedonPsCode, getFSLExpertTypeList, getFSLQuestionnairie } =
    masterDataActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const { courtsFromPSList, FSLExpertList, FSLQuestionnairie } = useSelector(
    (state) => state.MasterData
  );

  const filteredFSLQuestionnairie =
    isArray(FSLQuestionnairie) &&
    !isEmpty(FSLQuestionnairie) &&
    !isNull(selectedMOForQuestions)
      ? FSLQuestionnairie.filter((question) =>
          question.type.some(
            (ele) =>
              ele.toLowerCase() === selectedMOForQuestions.loaType.toLowerCase()
          )
        ).map((question) => question.question)
      : [];

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const isSendToFSL = sendTo === "Send To FSL";
  const isSendToCourt = sendTo === "Send To Court";
  const { fetchMaterialObjectList } = firActions;
  const { createAuditHistory } = auditHistoryActions;
  const { materialObjectList } = useSelector((state) => state.FIR);

  const {
    actionType,
    errorMessage,
    isFetching,
    casePropertyHistoryList,
    addAckPayload,
    successMessage,
  } = useSelector((state) => state.casePropertyManagement);

  const { stolenPropertyList, isLoading } = useSelector(
    (state) => state.stolenProperty
  );
  const { getStolenPropertyList } = stolenPropertyActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true;

  const {
    addCasePropertyManagementDetails,
    updateCasePropertyManagementDetails,
    getCasePropertyHistoryList,
    addAckFSL,
    resetActionType,
  } = casePropertyManagementActions;

  const isSuccess =
    actionType === "ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS" ||
    actionType === "UPDATE_CASE_PROPERTY_MANAGEMENT_SUCCESS";

  const isError =
    actionType === "ADD_CASE_PROPERTY_MANAGEMENT_ERROR" ||
    actionType === "UPDATE_CASE_PROPERTY_MANAGEMENT_ERROR";

  const reportData = getDataForDocument(
    selectedMOList,
    selectedFileName,
    selectedFir,
    savedFir,
    otherQuestion
  );

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS"
        ? "Case Property Management Created"
        : "Case Property Management Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/casePropertyManagement",
          auditType
        )
      )
    );
  };

  const getMaterialObjectsList = () => {
    dispatch(
      getStolenPropertyList(`${config.stolenProperty}/?crimeId=${crimeId}`)
    );
    dispatch(
      fetchMaterialObjectList(
        `${config.getPostCrimeSceneDetails}/MATERIALOBJECTS/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getFSLExpertTypeList(`${config.getMasterData}/FSL_EXPERT_TYPE`));
    getMaterialObjectsList();
    dispatch(getFSLQuestionnairie(config.getQuestionnairie));
  }, []);

  const addPropertyAck = () => {
    if (!isNull(addAckPayload)) {
      console.log("Calling Dispatch for addAckFSL ...", addAckPayload);
      dispatch(addAckFSL(config.addAckFSL, addAckPayload));
      console.log("Called  Dispatch for addAckFSL ...", addAckPayload);
      //Stop GAP arrangement to refresh the screen after addAckFSL API  call.
      setTimeout(() => {
        getMaterialObjectsList();
      }, 3000);
    }
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage !== "") {
        if (
          !showSendToFSL &&
          !showSendToCourt &&
          !showSendToOtherExperts &&
          actionType === "ADD_CASE_PROPERTY_MANAGEMENT_SUCCESS"
        ) {
          addPropertyAck();
        }
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        setSelectedLetterOfAdvice([]);
        setSelectedrRequisitionLetter([]);
        setOtherQuestion([]);
        setSelectedMOList([]);
        form.resetFields();
        setSendTo("");
        getMaterialObjectsList();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const submit = async () => {
    const values = await form.validateFields();
    selectedMOList.forEach((ele) => {
      const payLoad = {
        caseType: ele.type,
        crimeId: crimeId,
        moID: ele.id,
        status: sendTo,
        sendDate: values.datetimeofsendingtoCourt,
        forwardingThrough: values.forwardingThrough,
        fsl_courtName: values.fsl_courtName,
        courtName: values.courtName,
      };
      if (
        !showSendToFSL &&
        !showSendToCourt &&
        !showSendToOtherExperts &&
        !showSendToCourtDirections
      ) {
        let payloadData = {};
        if (isSendToFSL) {
          payloadData = {
            sendToFSL: {
              propertyQuestions: {
                selectedQuestions: ele?.selectedQuestions,
                otherQuestions: ele?.otherQuestions,
              },
              letterOfAdvice: ele?.letterOfAdvice,
              requisitionLetter: ele?.requisitionLetter,
              requestedBy: currentUser?.pao_code,
              requestedByName: currentUser?.employee_name,
              requestedByRole: currentUser?.emp_role_name,
              requestedByRank: currentUser?.rank_name,
              requestedByPhone: currentUser?.mobile_no,
              requestedByEmail: "",
            },
          };
        } else if (sendTo === "Send To Other Experts") {
          payloadData = {
            sendToOtherExperts: {
              expertType: values?.expertType,
              otherExpertType: values?.otherExpertType,
              dateSentToExpert: values?.dateSentToExpert,
              letterOfExpert: ele?.letterOfExpert,
            },
          };
        } else if (sendTo === "Handover to the owner on court directions") {
          payloadData = {
            sendToHandoverToOwner: {
              cpr_courtName: values?.cpr_courtName,
              date_custody: values?.date_custody,
              court_order_number: values?.court_order_number,
              court_order_date: values?.court_order_date,
              uploadAck: values?.uploadAck,
            },
          };
        } else {
          payloadData = payLoad;
        }
        const finalPayload = { ...payLoad, ...payloadData };
        dispatch(
          addCasePropertyManagementDetails(config.caseProperty, finalPayload)
        );
      } else {
        let n1 = {
          casePropertyID: ele.casePropertyId._id,
          sendToCourt: {
            cprNo: values.cprNumber_court,
            cpr_courtName: values.cpr_courtName,
            directionByCourt: values.directionByCourt,
            detials_disposal: values.detailsOfDisposeOfProperty,
            place_disposal: values.placeOfDisposal,
            date_disposal: values.dateDisposal,
            release_orderN0: values.releaseOrderNo,
            release_date: values.releaseOrderDate,
            return_date: values.dateTimeOfReturn,
            place_custody: values.placeOfCustody,
            assign_custody: values.assignToCustodian,
            date_custody: values.dateofSelfCustody,
          },
          sendToFSL: {
            cprNo: values.FSLcprNumber,
            fslNo: values.FSLackNO,
            fslDate: values.fslAckDate,
            report_received: values.reportReceived,
            opinion: values.opinion,
            opinion_furnished: values.opinionFurnished,
            strength_of_evidence: values.strengthOfEvidence,
            propert_received_back: values.propertyReceived,
          },
          sendToOtherExperts: {
            expertType: values?.expertType,
            otherExpertType: values?.otherExpertType,
            dateSentToExpert: values?.dateSentToExpert,
            letterOfExpert: !isNull(ele?.letterOfExpert)
              ? ele?.letterOfExpert
              : ele?.casePropertyId?.sendToOtherExperts?.letterOfExpert,
          },
          sendToHandoverToOwner: {
            cprNo: values.cprNo,
            cpr_courtName: values.cpr_courtName,
            directionByCourt: values.directionByCourt,
            place_custody: values.place_custody,
            assign_custody: values.assign_custody,
            date_custody: values.date_custody,
            court_order_number: values.court_order_number,
            court_order_date: values.court_order_date,
            uploadAck: {
              mimeType: uploadedCasePropertyAckFileList
                ? uploadedCasePropertyAckFileList.mimeType
                : "",
              name: uploadedCasePropertyAckFileList
                ? uploadedCasePropertyAckFileList.name
                : "",
              url: uploadedCasePropertyAckFileList
                ? uploadedCasePropertyAckFileList.url
                : "",
              fileId: uploadedCasePropertyAckFileList
                ? uploadedCasePropertyAckFileList.id
                : "",
            },
          },
          media: {
            mimeType: uploadedCasePropertyFileList
              ? uploadedCasePropertyFileList.mimeType
              : "",
            name: uploadedCasePropertyFileList
              ? uploadedCasePropertyFileList.name
              : "",
            url: uploadedCasePropertyFileList
              ? uploadedCasePropertyFileList.url
              : "",
            fileId: uploadedCasePropertyFileList
              ? uploadedCasePropertyFileList.id
              : "",
          },
        };
        dispatch(
          updateCasePropertyManagementDetails(config.caseProperty, {
            ...n1,
            ...payLoad,
          })
        );
      }
    });
  };

  useEffect(() => {
    let savedData = [];
    isArray(materialObjectList) &&
      !isEmpty(materialObjectList) &&
      materialObjectList.map((element, _index) => {
        const casePropertyId = element?.casePropertyId;
        const result = {
          id: element._id,
          crime_id: crimeId,
          key: element._id,
          name: element.type,
          sub_name: element.name,
          type: "Material Objects",
          moid: element.moId ? element.moId : "",
          subType: element.subType ? element.subType : "",
          url: element.materialObjectMedia[0]
            ? element.materialObjectMedia[0].url
            : "",
          date: casePropertyId ? casePropertyId.sendDate : element.dateCreated,
          sendTo: casePropertyId ? casePropertyId.status : "With IO",
          sendToCourt: casePropertyId ? casePropertyId.sendToCourt : "",
          sendToFSL: casePropertyId ? casePropertyId.sendToFSL : "",
          casePropertyId: casePropertyId ? casePropertyId : "",
          dateCreated: element.dateCreated,
          forwardingThrough: casePropertyId?.forwardingThrough
            ? casePropertyId.forwardingThrough
            : "",
          fsl_courtName: casePropertyId?.fsl_courtName
            ? casePropertyId.fsl_courtName
            : "",
          courtName: casePropertyId?.courtName ? casePropertyId.courtName : "",
          selectedQuestions: [],
          otherQuestions: [],
          letterOfAdvice: null,
          requisitionLetter: null,
          letterOfExpert: null,
          showQuestionnaire: false,
          loaType: element.type ? element.type : "",
          loaSubType: element.subType ? element.subType : "",
        };
        savedData.push(result);
      });
    setMaterilaObjectApi(savedData);
  }, [materialObjectList]);

  useEffect(() => {
    let savedData = [];
    isArray(stolenPropertyList) &&
      !isEmpty(stolenPropertyList) &&
      stolenPropertyList.map((element, _index) => {
        const casePropertyId = element?.casePropertyId;
        const result = {
          id: element._id,
          crime_id: crimeId,
          key: element._id,
          name: element.propertytCategory,
          sub_name: element.propertyStatus,
          type: "Stolen Property",
          moid: element.spId ? element.spId : "",
          subType: element.propertyStatus ? element.propertyStatus : "",
          date: casePropertyId ? casePropertyId.sendDate : element.dateCreated,
          sendTo: casePropertyId ? casePropertyId.status : "With IO",
          sendToCourt: casePropertyId ? casePropertyId.sendToCourt : "",
          sendToFSL: casePropertyId ? casePropertyId.sendToFSL : "",
          casePropertyId: casePropertyId ? casePropertyId : "",
          dateCreated: element.dateCreated,
          forwardingThrough: element.forwardingThrough,
          fsl_courtName: casePropertyId?.fsl_courtName
            ? casePropertyId.fsl_courtName
            : "",
          courtName: casePropertyId?.courtName ? casePropertyId.courtName : "",
          selectedQuestions: [],
          otherQuestions: [],
          showQuestionnaire: false,
          letterOfAdvice: null,
          letterOfExpert: null,
          requisitionLetter: null,
          loaType: element.propertytCategoryName
            ? element.propertytCategoryName
            : "",
          loaSubType: element.natureofStolen ? element.natureofStolen : "",
        };
        savedData.push(result);
      });
    setStolenPropertyApiList(savedData);
  }, [stolenPropertyList]);

  useEffect(() => {
    if (selectedMOList.length > 0) {
      selectedMOList.forEach((ele) => {
        setSendTo(ele.sendTo);
        setShowEdit(true);
        if (ele.sendTo === "Send To Court") {
          setShowSendToCourt(true);
          setShowSendToFSL(false);
          setShowSendToOtherExperts(false);
          setShowSendToCourtDirections(false);
          const sendToCourt = ele.casePropertyId.sendToCourt;
          form.setFieldsValue({
            cprNumber_court: sendToCourt ? sendToCourt.cprNo : "",
            cpr_courtName: sendToCourt ? sendToCourt.cpr_courtName : "",
            directionByCourt: sendToCourt ? sendToCourt.directionByCourt : "",
            detailsOfDisposeOfProperty: sendToCourt
              ? sendToCourt.detials_disposal
              : "",
            placeOfDisposal: sendToCourt ? sendToCourt.place_disposal : "",
            dateDisposal: sendToCourt
              ? moment(new Date(sendToCourt.date_disposal)).isValid()
                ? moment(new Date(sendToCourt.date_disposal))
                : ""
              : "",
            releaseOrderNo: sendToCourt ? sendToCourt.release_orderN0 : "",
            releaseOrderDate: sendToCourt
              ? moment(new Date(sendToCourt.release_date)).isValid()
                ? moment(new Date(sendToCourt.release_date))
                : ""
              : "",
            dateTimeOfReturn: sendToCourt
              ? moment(new Date(sendToCourt.return_date)).isValid()
                ? moment(new Date(sendToCourt.return_date))
                : ""
              : "",
            placeOfCustody: sendToCourt ? sendToCourt.place_custody : "",
            assignToCustodian: sendToCourt ? sendToCourt.assign_custody : "",
            dateofSelfCustody: sendToCourt
              ? moment(new Date(sendToCourt.date_custody)).isValid()
                ? moment(new Date(sendToCourt.date_custody))
                : ""
              : "",
          });
        } else if (ele.sendTo === "Send To FSL") {
          setShowSendToCourt(false);
          setShowSendToFSL(true);
          setShowSendToOtherExperts(false);
          setShowSendToCourtDirections(false);
          const propertyQuestions = ele?.sendToFSL?.propertyQuestions;
          setOtherQuestion(propertyQuestions?.otherQuestions);
          ele.showQuestionnaire = true;
          ele.selectedQuestions = propertyQuestions?.selectedQuestions;
          ele.otherQuestions = propertyQuestions?.otherQuestions;
          const sendToFSL = ele.casePropertyId.sendToFSL;
          form.setFieldsValue({
            FSLcprNumber: sendToFSL ? sendToFSL.cprNo : "",
            FSLackNO: sendToFSL ? sendToFSL.fslNo : "",
            fslAckDate: sendToFSL
              ? moment(new Date(sendToFSL.fslDate)).isValid()
                ? moment(new Date(sendToFSL.fslDate))
                : ""
              : "",
            reportReceived: sendToFSL ? sendToFSL.report_received : "",
            opinion: sendToFSL ? sendToFSL.opinion : "",
            opinionFurnished: sendToFSL ? sendToFSL.opinion_furnished : "",
            strengthOfEvidence: sendToFSL ? sendToFSL.strength_of_evidence : "",
            propertyReceived: sendToFSL ? sendToFSL.propert_received_back : "",
          });
        } else if (ele.sendTo === "Send To Other Experts") {
          setShowSendToCourt(false);
          setShowSendToFSL(false);
          setShowSendToCourtDirections(false);
          setShowSendToOtherExperts(true);
          const sendToOtherExperts = ele?.casePropertyId?.sendToOtherExperts;
          const dateSentToExpert = sendToOtherExperts?.dateSentToExpert;
          form.setFieldsValue({
            expertType: sendToOtherExperts?.expertType,
            dateSentToExpert: dateSentToExpert
              ? moment(new Date(dateSentToExpert)).isValid()
                ? moment(new Date(dateSentToExpert))
                : ""
              : "",
          });
        } else if (ele.sendTo === "Handover to the owner on court directions") {
          setShowSendToCourt(false);
          setShowSendToFSL(false);
          setShowSendToOtherExperts(false);
          setShowSendToCourtDirections(true);
          const sendToHandoverToOwner = !isEmpty(
            ele?.casePropertyId?.sendToHandoverToOwner
          )
            ? ele?.casePropertyId?.sendToHandoverToOwner
            : {};
          const date_custody = sendToHandoverToOwner?.date_custody;
          const court_order_date = sendToHandoverToOwner?.court_order_date;
          form.setFieldsValue({
            cpr_courtName: sendToHandoverToOwner.cpr_courtName,
            court_order_number: sendToHandoverToOwner.court_order_number,
            court_order_date: court_order_date
              ? moment(new Date(court_order_date)).isValid()
                ? moment(new Date(court_order_date))
                : ""
              : "",
            date_custody: date_custody
              ? moment(new Date(date_custody)).isValid()
                ? moment(new Date(date_custody))
                : ""
              : "",
          });
        } else {
          setShowSendToCourt(false);
          setShowSendToFSL(false);
          setSendTo("");
        }
      });
    } else {
      setShowSendToCourt(false);
      setShowSendToFSL(false);
      setSendTo("");
      setShowEdit(false);
    }
  }, [selectedMOList]);

  const handleUpload = (options) => {
    if (casePropertyFileList.length > 0) {
      const mediaFormData = new FormData();
      casePropertyFileList.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/TipAccused/media`);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setcasePropertyFileList([]);
          if (response.data.success) {
            setUploadedCasePropertyFileList(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          setcasePropertyFileList([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
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

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  useEffect(() => {
    if (casePropertyHistoryList) {
      let n1 = [];
      casePropertyHistoryList.forEach((ele, i) => {
        let finalDate = "";
        if (ele?.status === "Send To Other Experts") {
          finalDate = ele?.sendToOtherExperts?.dateSentToExpert;
        } else if (
          ele?.status === "Handover to the owner on court directions"
        ) {
          finalDate = ele?.sendToHandoverToOwner?.date_custody;
        } else {
          finalDate = ele?.sendDate;
        }
        let n2 = {},
          n3 = "";
        n3 =
          ele.status === "Send To Court"
            ? ele.sendToCourt && ele.sendToCourt.directionByCourt
              ? ele.sendToCourt.directionByCourt
              : ""
            : ele.forwardingThrough;
        n2.key = i + 3;
        if (!!n3) {
          n2.sendTo = `${ele.status}/${n3}`;
        } else {
          n2.sendTo = `${ele.status}`;
        }
        n2.date = finalDate ? finalDate : "";
        n1.push(n2);
      });
      let totalDatesArray = [...viewHistoryDataSource, ...n1];
      totalDatesArray.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      totalDatesArray = totalDatesArray.map((ele) => ({
        ...ele,
        date: ele.date,
      }));
      totalDatesArray.reverse();
      setViewHistoryDataSource(totalDatesArray);
    }
  }, [casePropertyHistoryList]);

  const columns = [
    {
      title: "Property",
      dataIndex: "name",
      key: "name",
      render: (name, item) => (
        <>
          <p>{name}</p>
          <small>{item.subType}</small>
        </>
      ),
    },
    {
      title: "",
      dataIndex: "moid",
      key: "moid",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Send to Whom & On Date",
      key: "sendTo&Date",
      render: (_i, item) => {
        const sendToFSL = item?.sendToFSL;
        const approvalAck = sendToFSL?.approvalAck;
        const status = sendToFSL?.approvalAckStatus || item.sendTo;
        const filterdResult =
          !isUndefined(approvalAck) &&
          last(approvalAck.filter((s) => s.action !== "In Progress"));
        const dateToBeShown = filterdResult
          ? filterdResult?.dateApproved
          : item.date;

        let color = "#373737";
        if (status === dataType.FORWARDED_TO_FSL) {
          color = "green";
        } else if (status === dataType.PENDING_WITH_CI) {
          color = "orange";
        } else if (status === dataType.PENDING_WITH_SI) {
          color = "#FE8C8C";
        } else if (status === dataType.PENDING_WITH_ACP) {
          color = "#FF080B";
        }
        return (
          <span>
            <p style={{ color: color, fontWeight: "bold" }}>{status}</p>
            <p>{moment(dateToBeShown).format(DATE_TIME_FORMAT)}</p>
          </span>
        );
      },
    },
    {
      title: "History",
      render: (_i, item) => (
        <div
          className="linkStyle"
          onClick={() => {
            setviewHistoryItem(item);
            dispatch(
              getCasePropertyHistoryList(
                `${config.caseProperty}/history/${item.casePropertyId._id}`
              )
            );
            setIsModalVisible(true);
            let n3 =
              item.sendTo === "Send To Court"
                ? item.sendToCourt && item.sendToCourt.directionByCourt
                  ? item.sendToCourt.directionByCourt
                  : ""
                : item.forwardingThrough
                ? item.forwardingThrough
                : "";

            let finalDate = "";
            if (item?.sendTo === "Send To Other Experts") {
              finalDate = item?.casePropertyId?.sendToOtherExperts
                ? item?.casePropertyId?.sendToOtherExperts?.dateSentToExpert
                : item?.casePropertyId?.sendDate;
            } else if (
              item?.sendTo === "Handover to the owner on court directions"
            ) {
              finalDate = item?.casePropertyId?.sendToHandoverToOwner
                ? item?.casePropertyId?.sendToHandoverToOwner?.date_custody
                : "";
            } else {
              finalDate = item?.sendDate;
            }

            const status = item.casePropertyId
              ? item.casePropertyId.status
              : "";
            const sentToResult =
              status !== "" && !!n3 === true ? `${status} / ${n3}` : status;

            setViewHistoryDataSource([
              {
                key: "1",
                sendTo: "With IO",
                date: item.dateCreated ? item.dateCreated : "",
              },
              {
                key: "2",
                sendTo: sentToResult,
                date: finalDate ? finalDate : "",
              },
            ]);
          }}
        >
          View History
        </div>
      ),
    },
    {
      title: !isEmpty(selectedMOList) && isSendToFSL ? "Questionnaire" : "",
      render: (i, item) => {
        const questionsAdded = isSendToFSL && !isEmpty(item.selectedQuestions);
        return (
          <div
            key={i}
            className="linkStyle"
            style={{
              color: questionsAdded ? "green" : "blue",
              width: questionsAdded ? 125 : "unset",
            }}
            onClick={() => {
              setIsQuestionnaireOpen(true);
              setSelectedMOForQuestions(item);
              if (!isEmpty(item?.selectedQuestions)) {
                setCheckedList([...item?.selectedQuestions]);
              }
            }}
          >
            {questionsAdded ? (
              <Row>
                {item?.showQuestionnaire ? (
                  <Col style={{ marginTop: 2 }}>
                    <CheckCircleOutlined />
                  </Col>
                ) : null}
                <Col style={{ marginLeft: 6 }}>
                  {item?.showQuestionnaire ? "Questionnaire" : ""}
                </Col>
              </Row>
            ) : (
              <span>{item?.showQuestionnaire ? "Questionnaire" : ""}</span>
            )}
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onSelect: async function (record, selected, selectedRows) {
      if (selectedRows.length > 1) {
        if (
          selected &&
          selectedMOList.filter((x) => x.sendTo === record.sendTo).length > 0
        ) {
          selected && (record.sendTo === "Send To FSL" || isSendToFSL)
            ? (record.showQuestionnaire = true)
            : (record.showQuestionnaire = false);
          setSelectedMOList(selectedRows);
          setShowEdit(true);
          setErrorInSelection(false);
        } else {
          setErrorInSelection(true);
          openNotificationWithIcon(
            "error",
            "Error in selection. Please select similar SEND TO rows."
          );
          setShowEdit(false);
        }
      } else {
        selected && (record.sendTo === "Send To FSL" || isSendToFSL)
          ? (record.showQuestionnaire = true)
          : (record.showQuestionnaire = false);
        setSelectedMOList(selectedRows);
        setErrorInSelection(false);
        setShowEdit(true);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const uploadFunction = () => {
    return (
      <Form.Item>
        <Upload
          onChange={async (info) => {
            await setcasePropertyFileList(info.fileList);
          }}
          customRequest={(options) => handleUpload(options)}
          multiple={false}
          maxCount={1}
        >
          <Button
            className="saveButton"
            style={{ width: 210 }}
            disabled={
              casePropertyFileList.length === 1 ? true : false || disableForm
            }
          >
            Upload Acknowledgment
          </Button>
        </Upload>
      </Form.Item>
    );
  };

  const handleAckUpload = (options) => {
    if (casePropertyUploadFileList.length > 0) {
      const mediaFormData = new FormData();
      casePropertyUploadFileList.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/TipAccused/media`);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setcasePropertyUploadFileList([]);
          if (response.data.success) {
            setUploadedCasePropertyAckFileList(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          setcasePropertyUploadFileList([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const uploadAckFunction = () => {
    return (
      <Form.Item>
        <Upload
          onChange={async (info) => {
            await setcasePropertyUploadFileList(info.fileList);
          }}
          customRequest={handleAckUpload}
          multiple={false}
          maxCount={1}
        >
          <Button
            className="saveButton"
            style={{ width: 210 }}
            disabled={
              casePropertyUploadFileList.length === 1
                ? true
                : false || disableForm
            }
          >
            Upload Acknowledgment
          </Button>
        </Upload>
      </Form.Item>
    );
  };

  const onChangeCheckbox = (list) => {
    const filterList =
      !isEmpty(selectedMOList) &&
      selectedMOList.filter((s) => s.id === selectedMOForQuestions?.id);
    filterList.map((item) => {
      item.selectedQuestions = list;
    });
    setCheckedList(list);
  };

  const onChangeOtherQuestion = (otherQuestion) => {
    const filterList =
      !isEmpty(selectedMOList) &&
      selectedMOList.filter((s) => s.id === selectedMOForQuestions?.id);
    filterList.map((item) => {
      item.otherQuestions = [otherQuestion];
    });
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const stolenData = materialObjectApi.concat(stolenPropertyApiList);
  const filteredData =
    !isEmpty(stolenData) &&
    stolenData.filter((s) => s.sub_name !== "Lost" && s.sub_name !== "Stolen");

  const getValidationError = (message) => {
    return (
      <Row gutter={24}>
        <Col span={2} style={{ fontSize: 20 }}>
          <ExclamationCircleOutlined style={{ color: "red" }} />
        </Col>
        <Col span={20} style={{ fontSize: 16, marginTop: 2, padding: 0 }}>
          {message}
        </Col>
      </Row>
    );
  };

  const checkIfQuestionsAdded = () => {
    let isQuestionesSelected = false;
    !isEmpty(selectedMOList) &&
      selectedMOList.forEach((item) => {
        if (!isEmpty(item.selectedQuestions)) {
          isQuestionesSelected = true;
        } else {
          isQuestionesSelected = false;
        }
      });
    return isQuestionesSelected;
  };

  const getErrorDetails = () => {
    return (
      <div>
        {!checkIfQuestionsAdded() &&
          getValidationError("Please add Questionnaire for selected property")}
        {forwardingThrough === "ACP" &&
          isEmpty(selectedRequisitionLetter) &&
          getValidationError("Please Upload Letter to ACP")}
        {forwardingThrough === "ACP" &&
          isEmpty(selectedLetterOfAdvice) &&
          getValidationError("Please Upload Letter of Advice")}
      </div>
    );
  };

  const disableSubmitButton = () => {
    let isDisabled = false;
    if (isEmpty(selectedMOList)) {
      isDisabled = true;
    } else if (!isEmpty(selectedMOList) && sendTo === "") {
      isDisabled = true;
    }
    return isDisabled;
  };

  const checkValidationBeforeSubmit = () => {
    const isLettersNotUploaded =
      forwardingThrough === "ACP" &&
      (isEmpty(selectedLetterOfAdvice) || isEmpty(selectedRequisitionLetter));
    if (isSendToFSL && (!checkIfQuestionsAdded() || isLettersNotUploaded)) {
      setShowError(true);
    } else {
      setShowError(false);
      submit();
    }
  };

  return (
    <CasePropertyManagementContainer>
      <ContentHeader
        headerTitle="Case Property Management"
        disableButton={errorInSelection || disableForm || disableSubmitButton()}
        onSubmitClick={checkValidationBeforeSubmit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
      />
      {isFetching || isLoading ? (
        <Loader />
      ) : (
        <Row gutter={24}>
          <Col
            span={isEmpty(selectedMOList) || errorInSelection ? 24 : 16}
            style={{ paddingRight: 5, marginTop: 1 }}
          >
            <TableWrapper
              rowSelection={{
                type: "checkbox",
                ...rowSelection,
              }}
              columns={columns}
              dataSource={filteredData}
              size="small"
            />
          </Col>
          {!isEmpty(selectedMOList) && !errorInSelection ? (
            <Col span={8} style={{ paddingLeft: 5 }}>
              <Card
                style={{ minHeight: 700, padding: 0, margin: 0 }}
                className="cardRightStyle"
              >
                <p
                  style={{
                    background: "#02599C",
                    padding: "17.5px",
                    color: "white",
                  }}
                >
                  {selectedMOList.length > 1
                    ? `${selectedMOList.length} Record(s) Selected`
                    : `${selectedMOList.length} Record Selected`}
                </p>

                {showEdit ? (
                  <div style={{ padding: 24 }}>
                    {selectedMOList.length > 0 && (
                      <div style={{ marginBottom: 20 }}>
                        <Radio.Group
                          value={sendTo}
                          disabled={disableForm || isEmpty(selectedMOList)}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSendTo(value);
                            if (value === "Send To FSL") {
                              !isEmpty(selectedMOList) &&
                                selectedMOList.map((x) => {
                                  x.showQuestionnaire = true;
                                });
                            } else {
                              !isEmpty(selectedMOList) &&
                                selectedMOList.map((x) => {
                                  x.showQuestionnaire = false;
                                });
                            }
                          }}
                        >
                          <Radio value="Send To Court">Send To Court</Radio>
                          <Radio value="Send To FSL">Send To FSL</Radio>
                          <Radio value="Send To Other Experts">
                            Send To Other Experts
                          </Radio>
                          <Radio value="Handover to the owner on court directions">
                            Property Released by Court
                          </Radio>
                        </Radio.Group>
                      </div>
                    )}
                    <Form form={form} layout="vertical">
                      {isSendToFSL && (
                        <div>
                          {!showSendToFSL ? (
                            <>
                              <Form.Item
                                name="datetimeofsendingtoCourt"
                                label="Date & Time of sending to FSL"
                                style={{ marginTop: 10, marginBottom: 15 }}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please Select Date & Time of sending to FSL!",
                                  },
                                ]}
                              >
                                <DatePicker
                                  format={DATE_TIME_FORMAT}
                                  showTime={true}
                                  placeholder="Select Date & Time"
                                  style={{ width: 250 }}
                                  disabledDate={disableFutureDates}
                                  disabled={disableForm}
                                />
                              </Form.Item>
                              <Form.Item
                                name="forwardingThrough"
                                label="Forwarding Through"
                                style={{ marginBottom: 15 }}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please Select Forwarding Through!",
                                  },
                                ]}
                              >
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  onSearch={handleSearch}
                                  disabled={disableForm}
                                  style={{ width: 250 }}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  onChange={(e) => {
                                    if (e) {
                                      setForwardingThrough(e);
                                    } else {
                                      setForwardingThrough("");
                                    }
                                  }}
                                >
                                  {forwardingThroughList.map((item, index) => (
                                    <Option
                                      key={index}
                                      value={item}
                                      label={item}
                                    >
                                      {item}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              {forwardingThrough === "Court" ? (
                                <Form.Item
                                  name="fsl_courtName"
                                  label="Court Name"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please Select Court Name!",
                                    },
                                  ]}
                                >
                                  {renderFieldsWithDropDown(
                                    courtNames,
                                    null,
                                    handleSearch,
                                    serchText,
                                    250,
                                    disableForm,
                                    ""
                                  )}
                                </Form.Item>
                              ) : null}
                              {forwardingThrough === "ACP" ? (
                                <div style={{ paddingTop: 30 }}>
                                  <UploadLetters
                                    templateLists={forwardingThroughACPList}
                                    showModal={showModal}
                                    disabled={disableForm}
                                    selectedRecord={{ crimeId: crimeId }}
                                    selectedModule="casePropertyManagement"
                                    forwardingThrough={forwardingThrough}
                                    selectedMOList={selectedMOList}
                                    setSelectedLetterOfAdvice={
                                      setSelectedLetterOfAdvice
                                    }
                                    setSelectedrRequisitionLetter={
                                      setSelectedrRequisitionLetter
                                    }
                                  />
                                </div>
                              ) : null}
                              {forwardingThrough === "Court" ? (
                                <div style={{ paddingTop: 30 }}>
                                  <DisplayReportGenerations
                                    templateLists={forwardingThroughCourtList}
                                    showModal={showModal}
                                    disabled={disableForm}
                                    selectedRecord={{ crimeId: crimeId }}
                                    selectedModule="casePropertyManagement"
                                  />
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <div>
                              <Form.Item
                                name="FSLackNO"
                                label="FSL Acknowledgement Number"
                                style={{ marginBottom: 20 }}
                              >
                                <Input
                                  placeholder="Enter here"
                                  disabled={disableForm}
                                />
                              </Form.Item>
                              <Form.Item
                                name="fslAckDate"
                                label="FSL Acknowledgement Date"
                                style={{ marginBottom: 20 }}
                              >
                                <DatePicker
                                  format={DATE_FORMAT}
                                  placeholder="Select Date"
                                  style={{ width: 150 }}
                                  disabledDate={disableFutureDates}
                                  disabled={disableForm}
                                />
                              </Form.Item>
                              <Form.Item
                                name="propertyReceived"
                                label="Property Received Back?"
                                style={{ marginBottom: 20 }}
                              >
                                <Radio.Group defaultValue={false}>
                                  <Radio value={true} disabled={disableForm}>
                                    Yes
                                  </Radio>
                                  <Radio value={false} disabled={disableForm}>
                                    No
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                            </div>
                          )}
                        </div>
                      )}
                      {isSendToCourt && (
                        <div>
                          {!showSendToCourt ? (
                            <>
                              <Form.Item
                                name="courtName"
                                label="Court Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please Select Court Name!",
                                  },
                                ]}
                              >
                                {renderFieldsWithDropDown(
                                  courtNames,
                                  null,
                                  handleSearch,
                                  serchText,
                                  250,
                                  disableForm,
                                  ""
                                )}
                              </Form.Item>
                              <Form.Item
                                name="datetimeofsendingtoCourt"
                                label="Date & Time of sending to Court"
                                style={{ marginTop: 20 }}
                                rules={[
                                  {
                                    required: true,
                                    message:
                                      "Please Select Date & Time of sending to Court!",
                                  },
                                ]}
                              >
                                <DatePicker
                                  format={DATE_TIME_FORMAT}
                                  showTime={true}
                                  placeholder="Select Date & Time"
                                  style={{ width: 250 }}
                                  disabledDate={disableFutureDates}
                                  disabled={disableForm}
                                />
                              </Form.Item>
                              <div
                                style={{
                                  paddingTop: 30,
                                  color: "blue",
                                  cursor: "pointer",
                                }}
                              >
                                <DisplayReportGenerations
                                  templateLists={CasePropertyTemplates}
                                  showModal={showModal}
                                  disabled={disableForm}
                                  selectedRecord={{ crimeId: crimeId }}
                                  selectedModule="casePropertyManagement"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <Form.Item
                                name="cprNumber_court"
                                label="CPR Number (entered by other role)"
                                style={{ marginBottom: 20 }}
                              >
                                <Input
                                  placeholder="Enter here"
                                  style={{ width: 250 }}
                                  disabled={disableForm}
                                />
                              </Form.Item>
                              <Form.Item
                                name="cpr_courtName"
                                label="Court Name"
                                style={{ marginBottom: 20 }}
                              >
                                {renderFieldsWithDropDown(
                                  courtNames,
                                  null,
                                  handleSearch,
                                  serchText,
                                  250,
                                  disableForm,
                                  ""
                                )}
                              </Form.Item>
                              <Form.Item
                                name="directionByCourt"
                                label="Direction By Court"
                                style={{ marginBottom: 20 }}
                              >
                                <Select
                                  allowClear
                                  placeholder="Select"
                                  suffixIcon={
                                    <CaretDownOutlined className="dropDownIcon" />
                                  }
                                  showSearch
                                  onSearch={handleSearch}
                                  style={{ width: 250 }}
                                  disabled={disableForm}
                                  filterOption={(input, option) =>
                                    serchText &&
                                    option.props.label
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                  onChange={(e) => {
                                    if (e) {
                                      setDirectionByCourt(e);
                                      setcasePropertyFileList([]);
                                      setUploadedCasePropertyFileList([]);
                                    } else {
                                      setDirectionByCourt("");
                                      setcasePropertyFileList([]);
                                      setUploadedCasePropertyFileList([]);
                                    }
                                  }}
                                >
                                  {sendToCourtDrop.map((item, index) => (
                                    <Select.Option
                                      key={index}
                                      value={item}
                                      label={item}
                                    >
                                      {item}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>

                              {directionByCourt === "Diffused/Destruction" ? (
                                <>
                                  <Form.Item
                                    name="detailsOfDisposeOfProperty"
                                    label="Details Of Dispose Of Property"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      placeholder="Enter here"
                                      style={{ width: 250 }}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="dateDisposal"
                                    label="Date & Time of Disposal"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <DatePicker
                                      format={DATE_TIME_FORMAT}
                                      showTime={true}
                                      placeholder="Select Date & Time"
                                      style={{ width: 250 }}
                                      disabledDate={disableFutureDates}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="placeOfDisposal"
                                    label="Place Of Disposal"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      placeholder="Enter here"
                                      style={{ width: 250 }}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  {uploadFunction()}
                                </>
                              ) : null}

                              {directionByCourt ===
                              "Release To Victim/Accused" ? (
                                <>
                                  <Form.Item
                                    name="releaseOrderNo"
                                    label="Release Order No.(Dis No.)"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      placeholder="Enter here"
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="releaseOrderDate"
                                    label="Release Order Date"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <DatePicker
                                      format={DATE_TIME_FORMAT}
                                      showTime={true}
                                      placeholder="Select Date & Time"
                                      style={{ width: 250 }}
                                      disabledDate={disableFutureDates}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="dateTimeOfReturn"
                                    label="Date & Time of Return"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <DatePicker
                                      format={DATE_TIME_FORMAT}
                                      showTime={true}
                                      placeholder="Select Date & Time"
                                      style={{ width: 250 }}
                                      disabledDate={disableFutureDates}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  {uploadFunction()}
                                </>
                              ) : null}

                              {directionByCourt === "Safe Custody To Police" ? (
                                <>
                                  <Form.Item
                                    name="placeOfCustody"
                                    label="Place Of Custody"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      placeholder="Enter here"
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="assignToCustodian"
                                    label="Assign To Custodian"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <Input
                                      placeholder="Enter here"
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <Form.Item
                                    name="dateofSelfCustody"
                                    label="Date & Time"
                                    style={{ marginBottom: 20 }}
                                  >
                                    <DatePicker
                                      format={DATE_TIME_FORMAT}
                                      showTime={true}
                                      placeholder="Select Date & Time"
                                      style={{ width: 250 }}
                                      disabledDate={disableFutureDates}
                                      disabled={disableForm}
                                    />
                                  </Form.Item>
                                  <div
                                    style={{ paddingTop: 30, color: "blue" }}
                                  />
                                </>
                              ) : null}
                            </>
                          )}
                        </div>
                      )}
                      {sendTo === "Send To Other Experts" ? (
                        <div>
                          <Form.Item
                            name="expertType"
                            label="Expert Type"
                            style={{ marginBottom: 20 }}
                            rules={[
                              {
                                required: true,
                                message: "Please Select Expert Type!",
                              },
                            ]}
                          >
                            {renderFieldsWithDropDown(
                              FSLExpertList,
                              setFSLExpertType,
                              handleSearch,
                              serchText,
                              250,
                              disableForm,
                              ""
                            )}
                          </Form.Item>
                          {FSLExpertType === "Others" ? (
                            <Form.Item
                              name="otherExpertType"
                              label="Other Expert Type"
                              style={{ marginBottom: 20, width: 250 }}
                            >
                              <Input
                                placeholder="Enter here"
                                disabled={disableForm}
                              />
                            </Form.Item>
                          ) : null}
                          <Form.Item
                            name="dateSentToExpert"
                            label="
                              Date & Time of sending to Expert                              "
                            style={{ marginTop: 20 }}
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please Select Date & Time of sending to Expert!",
                              },
                            ]}
                          >
                            <DatePicker
                              format={DATE_TIME_FORMAT}
                              showTime={true}
                              placeholder="Select Date"
                              style={{ width: 250 }}
                              disabledDate={disableFutureDates}
                              disabled={disableForm}
                            />
                          </Form.Item>
                          <div style={{ paddingTop: 30 }}>
                            <UploadLetters
                              templateLists={LetterToExpertTemplate}
                              showModal={showModal}
                              disabled={disableForm}
                              selectedRecord={{ crimeId: crimeId }}
                              selectedModule="casePropertyManagement"
                              forwardingThrough={forwardingThrough}
                              selectedMOList={selectedMOList}
                              setSelectedLetterOfAdvice={
                                setSelectedLetterOfAdvice
                              }
                              setSelectedrRequisitionLetter={
                                setSelectedrRequisitionLetter
                              }
                              setSelectedLetterOfExpert={
                                setSelectedLetterOfExpert
                              }
                            />
                          </div>
                        </div>
                      ) : null}

                      {sendTo ===
                      "Handover to the owner on court directions" ? (
                        <>
                          <Form.Item
                            name="cpr_courtName"
                            label="Court Name"
                            rules={[
                              {
                                required: true,
                                message: "Please Select Court Name!",
                              },
                            ]}
                          >
                            {renderFieldsWithDropDown(
                              courtNames,
                              null,
                              handleSearch,
                              serchText,
                              250,
                              disableForm,
                              ""
                            )}
                          </Form.Item>
                          <Form.Item
                            name="court_order_number"
                            label="Court Order Number "
                            style={{ marginBottom: 20 }}
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Court Order Number!",
                              },
                            ]}
                          >
                            <Input
                              placeholder="Enter here"
                              style={{ width: 250 }}
                              disabled={disableForm}
                            />
                          </Form.Item>
                          <Form.Item
                            name="court_order_date"
                            label="Order Date"
                            style={{ marginTop: 20 }}
                            rules={[
                              {
                                required: true,
                                message: "Please Select Order Date!",
                              },
                            ]}
                          >
                            <DatePicker
                              format={DATE_TIME_FORMAT}
                              showTime={true}
                              placeholder="Select Date & Time"
                              style={{ width: 250 }}
                              disabledDate={disableFutureDates}
                              disabled={disableForm}
                            />
                          </Form.Item>
                          <Form.Item
                            name="date_custody"
                            label="Date & Time of Handover to Owner on Court Directions"
                            style={{ marginTop: 20 }}
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please Select Date & Time of Handover to Owner on Court Directions!",
                              },
                            ]}
                          >
                            <DatePicker
                              format={DATE_TIME_FORMAT}
                              showTime={true}
                              placeholder="Select Date & Time"
                              style={{ width: 250 }}
                              disabledDate={disableFutureDates}
                              disabled={disableForm}
                            />
                          </Form.Item>
                          {uploadAckFunction()}
                        </>
                      ) : null}
                    </Form>
                  </div>
                ) : null}
              </Card>
            </Col>
          ) : null}
        </Row>
      )}
      <Modal
        title={viewHistoryItem.name}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Table dataSource={viewHistoryDataSource} columns={columnsHistory} />
      </Modal>

      {isQuestionnaireOpen ? (
        <Modal
          title={
            <Row gutter={24}>
              <Col span={6}>Questionnaire of FSL</Col>
              {checkedList.length > 0 ? (
                <Col
                  span={8}
                  style={{ color: "#02599C", fontSize: 14 }}
                >{`Questions selected (${checkedList.length})`}</Col>
              ) : null}
            </Row>
          }
          visible={isQuestionnaireOpen}
          onOk={() => {
            setIsQuestionnaireOpen(false);
          }}
          onCancel={() => {
            if (!showSendToFSL) {
              onChangeCheckbox([]);
            }
            setIsQuestionnaireOpen(false);
          }}
          width={800}
        >
          <Row gutter={24} className="checkboxGroup">
            <Col span={24}>
              <CheckboxGroup
                options={filteredFSLQuestionnairie}
                value={checkedList}
                onChange={onChangeCheckbox}
                disabled={showSendToFSL}
              />
            </Col>
          </Row>
          {!isEmpty(selectedMOForQuestions?.selectedQuestions) &&
          !isUndefined(selectedMOForQuestions?.selectedQuestions) &&
          selectedMOForQuestions?.selectedQuestions.includes("Others") ? (
            <Row gutter={24}>
              <Col span={24}>
                <Input
                  placeholder="Enter other question"
                  disabled={disableForm || showSendToFSL}
                  value={selectedMOForQuestions?.otherQuestions}
                  onChange={(e) => {
                    setOtherQuestion([e.target.value]);
                    onChangeOtherQuestion(e.target.value);
                  }}
                />
              </Col>
            </Row>
          ) : null}
        </Modal>
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
      {showError ? (
        <Modal
          header={null}
          visible={showError}
          onOk={() => setShowError(false)}
          onCancel={() => setShowError(false)}
          footer={null}
        >
          {getErrorDetails()}
        </Modal>
      ) : null}
    </CasePropertyManagementContainer>
  );
}
