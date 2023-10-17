import { useState, useEffect } from "react";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import {
  disableFutureDates,
  disableFuturePastDates,
} from "@components/Common/helperMethods";
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
  notification,
  Modal,
} from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  getWitness,
  DATE_TIME_FORMAT,
  DATE_YY_MM_DD,
  getSavedDataResult,
  getPersonDetails,
  onFileChange,
  getMediaUploadError,
  dummyRequest,
  folderName,
  getFilePayload,
  getPersonAddressTemplate,
} from "@containers/FirDetails/fir-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import firActions from "@redux/fir/actions";
import crpcSec164StatementActions from "@redux/investigations/crpcSec164Statement/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  isBoolean,
  isEmpty,
  isArray,
  isUndefined,
  isNull,
  first,
  remove,
} from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import { ModuleWrapper } from "../CommonDetails/styles";
import AddProfessional from "../CommonForms/AddProfessional";
import { addCRPC164Payload, updateCRPC164Payload } from "./crpcSec164Payloads";
import TemplatesModal from "../CommonForms/TemplatesModal";
import SavedRecords from "./SavedRecords";
import {
  CRPCSec164StatementAccusedTemplates,
  CRPCSec164StatementWitnessTemplates,
  crpcSec164StatementForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import ContentHeader from "../../ContentHeader";

const Option = Select.Option;

export default function CRPCSec164Statement({
  setSelectedSiderMenu,
  selectedInvestigationFormObj,
}) {
  const [form] = Form.useForm();
  const [professionalForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [isProfessionalModalVisible, setIsProfessionalModalVisible] =
    useState(false);
  const [magistrateNameDetails, setMagistrateNameDetails] = useState({});
  const [selecteddDateOfRequisition, setSelecteddDateOfRequisition] =
    useState("");
  const [selecteddDateFixed, setSelecteddDateFixed] = useState("");
  const [selectedWitnessOrAccused, setSelectedWitnessOrAccused] = useState("");
  const [dateRecorded, setDateRecorded] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [checkSummonState, setCheckSummonState] = useState("Yes");
  const { getCourtsBasedonPsCode } = masterDataActions;
  const [supportingProsecutionState, setSupportingProsecutionState] =
    useState("Yes");
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { requisitiontoCourt, crpc164recorded } = crpcSec164StatementForm;
  const [viewCRPCSec164Details, setViewCRPCSec164Details] = useState(false);
  const [editCRPCSec164Obj, setEditCRPCSec164Obj] = useState(null);
  const [serchText, setSerchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const { getAccusedList } = suspectAccusedAction;
  const { fetchWitnessDetailsList } = firActions;
  const { witnessStatementList, witnessStatementListNew } = useSelector(
    (state) => state.FIR
  );
  const [addAnother, setAddAnother] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { createAuditHistory } = auditHistoryActions;
  const [upload164FormURL, setUpload164FormURL] = useState([]);
  const [selectedupload164FormURLFormURL, setSelectedupload164FormURLFormURL] =
    useState([]);

  useState([]);
  const {
    actionType,
    errorMessage,
    isFetching,
    crpc164StatementList,
    successMessage,
  } = useSelector((state) => state.CRPCSec164Statement);

  const isSuccess =
    actionType === "ADD_CRPC_164STATEMENT_SUCCESS" ||
    actionType === "UPDATE_CRPC_164STATEMENT_SUCCESS";

  const isError =
    actionType === "ADD_CRPC_164STATEMENT_ERROR" ||
    actionType === "UPDATE_CRPC_164STATEMENT_ERROR";

  const {
    addCRPC164StatementDetails,
    updateCRPC164StatementDetails,
    getCRPC164StatementList,
    resetActionType,
  } = crpcSec164StatementActions;

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_CRPC_164STATEMENT_SUCCESS"
        ? "Sec.164 CrPC Statement Created"
        : "Sec.164 CrPC Statement Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/Sec.164CrPCStatement",
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

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetchWitnessDetails = () => {
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Sec.164 CrPC Statement Successfully Added" ||
        successMessage === "Sec.164 CrPC Statement Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewCRPCSec164Details(false);
          setEditCRPCSec164Obj(null);
          dispatch(
            getCRPC164StatementList(`${config.sec164CrPc}?crimeId=${crimeId}`)
          );
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    dispatch(
      getCRPC164StatementList(`${config.sec164CrPc}?crimeId=${crimeId}`)
    );
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  }, []);

  useEffect(() => {
    setSelectedState(selectedInvestigationFormObj.formType);
    fetchAccusedList();
    fetchWitnessDetails();
  }, []);

  const getAccusedData = () => getAccuseds(suspectAccusedList);
  const witnessList =
    witnessStatementList &&
    !isEmpty(witnessStatementList) &&
    getWitness(witnessStatementListNew);
  const getDropdownData =
    selectedState !== "" && selectedState === "Accused"
      ? getAccusedData()
      : witnessList;
  let accusedCompleteDetails = [];
  !isEmpty(selectedWitnessOrAccused) &&
    selectedWitnessOrAccused.map((s) => {
      const accusedName = `${
        s.personalDetails.name ? s.personalDetails.name : ""
      } ${s.personalDetails.surname ? s.personalDetails.surname : ""}`;
      let personAddress = "";
      if (isUndefined(s?.presentAddress) && !isUndefined(s?.permanentAddress)) {
        personAddress = getPersonAddressTemplate(s?.permanentAddress);
      } else if (
        !isUndefined(s?.presentAddress) &&
        isUndefined(s?.permanentAddress)
      ) {
        personAddress = getPersonAddressTemplate(s?.presentAddress);
      } else if (
        !isUndefined(s?.presentAddress) &&
        !isUndefined(s?.permanentAddress)
      ) {
        personAddress = getPersonAddressTemplate(s?.presentAddress);
      } else if (
        isUndefined(s?.presentAddress) &&
        isUndefined(s?.permanentAddress)
      ) {
        personAddress = "";
      }
      const selectedWitnessAccused =
        getDropdownData &&
        !isEmpty(getDropdownData) &&
        getDropdownData.filter((item) => item._id === s._id);
      const witnessListData =
        !isEmpty(witnessStatementList) &&
        witnessStatementList.filter((item) => item?.person?._id === s._id);
      const result = {
        accusedName: accusedName,
        accusedCode:
          !isEmpty(selectedWitnessAccused) &&
          first(selectedWitnessAccused)?.accusedCode,
        accusedAddress: personAddress,
        witnessCode:
          !isEmpty(witnessListData) && first(witnessListData)?.witnessCode,
      };
      accusedCompleteDetails.push(result);
    });

  const savedWitnessList =
    crpc164StatementList &&
    !isEmpty(crpc164StatementList) &&
    crpc164StatementList.filter((s) => s.personType === "Witness");
  const savedAccusedList =
    crpc164StatementList &&
    !isEmpty(crpc164StatementList) &&
    crpc164StatementList.filter((s) => s.personType === "Accused");
  const getSavedRecordList =
    selectedState !== "" && selectedState === "Accused"
      ? savedAccusedList
      : savedWitnessList;

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const urlFormData = new FormData();
    upload164FormURL.forEach((file) => {
      urlFormData.append("file", file.originFileObj);
    });
    urlFormData.append("prefixFolder", crimeId);
    urlFormData.append("folderPath", `${crimeId}/${folderName.CRPC_164}/file`);

    if (!isEmpty(upload164FormURL)) {
      axios
        .post(`${config.fileUpload}/upload`, urlFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addCRPC164Payload(
              values,
              crimeId,
              selectedState,
              checkSummonState,
              supportingProsecutionState,
              magistrateNameDetails,
              getFilePayload(payloadData)
            );

            const updatePayload = updateCRPC164Payload(
              values,
              crimeId,
              editCRPCSec164Obj?._id ? editCRPCSec164Obj?._id : null,
              selectedState,
              checkSummonState,
              supportingProsecutionState,
              magistrateNameDetails,
              getFilePayload(payloadData)
            );

            if (editCRPCSec164Obj?._id) {
              dispatch(
                updateCRPC164StatementDetails(config.sec164CrPc, updatePayload)
              );
            } else {
              dispatch(
                addCRPC164StatementDetails(config.sec164CrPc, addPayload)
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(upload164FormURL)) {
      const crpcURL =
        !isNull(editCRPCSec164Obj) && editCRPCSec164Obj?.crpcURL?.url === ""
          ? {}
          : editCRPCSec164Obj?.crpcURL;
      const addPayload = addCRPC164Payload(
        values,
        crimeId,
        selectedState,
        checkSummonState,
        supportingProsecutionState,
        magistrateNameDetails,
        {}
      );
      const updatePayload = updateCRPC164Payload(
        values,
        crimeId,
        editCRPCSec164Obj?._id ? editCRPCSec164Obj?._id : null,
        selectedState,
        checkSummonState,
        supportingProsecutionState,
        magistrateNameDetails,
        crpcURL
      );

      if (editCRPCSec164Obj?._id) {
        dispatch(
          updateCRPC164StatementDetails(config.sec164CrPc, updatePayload)
        );
      } else {
        dispatch(addCRPC164StatementDetails(config.sec164CrPc, addPayload));
      }
    }
  };

  const handleEditSEC164 = (value) => {
    if (value) {
      setEditCRPCSec164Obj(value);
      setCheckSummonState(value?.summonServed ? "Yes" : "No");
      setSupportingProsecutionState(
        value?.statementIsSupportingProsecution ? "Yes" : "No"
      );
      const crpcURL = value?.crpcURL;
      if (crpcURL && crpcURL?.name !== "") {
        setSelectedupload164FormURLFormURL([
          {
            url: crpcURL?.url,
            name: crpcURL?.name,
            fileId: crpcURL?.fileId,
          },
        ]);
      } else {
        setSelectedupload164FormURLFormURL([]);
      }
      setSelectedState(value?.personType);
      let witnessOrAccusedIdsArray = [];
      const witnessOrAccusedId = value?.witnessOrAccusedId;
      if (
        witnessOrAccusedId &&
        isArray(witnessOrAccusedId) &&
        witnessOrAccusedId.length > 0
      ) {
        witnessOrAccusedId.forEach((ele) =>
          witnessOrAccusedIdsArray.push(ele?._id)
        );
      }
      setSelectedWitnessOrAccused(witnessOrAccusedId);
      const magistrateName = value?.magistrateName;
      const personalDetails = magistrateName?.personalDetails;
      let mName1 =
        (personalDetails?.name ? personalDetails?.name : "") +
        " " +
        (personalDetails?.surname ? personalDetails?.surname : "");

      form.setFieldsValue({
        witnessOrAccusedId: witnessOrAccusedIdsArray,
        personType: value?.personType,
        dateOfRequisitionToCourt: moment(
          new Date(value?.dateOfRequisitionToCourt)
        ).isValid()
          ? moment(new Date(value?.dateOfRequisitionToCourt))
          : "",
        courtName: value?.courtName,
        dateFixed: moment(new Date(value?.dateFixed)).isValid()
          ? moment(new Date(value?.dateFixed))
          : "",
        dateRecorded: moment(new Date(value?.dateRecorded)).isValid()
          ? moment(new Date(value?.dateRecorded))
          : "",
        magistrateName: mName1,
        summonServed: value?.summonServed ? "Yes" : "No",
        statementIsSupportingProsecution:
          value?.statementIsSupportingProsecution ? "Yes" : "No",
        nameOfCourtRecorded: value?.nameOfCourtRecorded,
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
      setMagistrateNameDetails(mName1);
    }
  };

  const isValidDateOfFixed =
    selecteddDateOfRequisition &&
    selecteddDateFixed &&
    moment(selecteddDateFixed).isAfter(selecteddDateOfRequisition);

  const isValidDateRecorded =
    selecteddDateOfRequisition &&
    dateRecorded &&
    moment(dateRecorded).isAfter(selecteddDateOfRequisition);

  const dateOfRequisitionToCourtChange = (date, _dateString) => {
    setSelecteddDateOfRequisition(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const dateFixedChange = (date, _dateString) => {
    setSelecteddDateFixed(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const dateRecordedChange = (date, _dateString) => {
    setDateRecorded(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayFields = (name) => {
    switch (name) {
      case "dateOfRequisitionToCourt":
        return (
          <DatePicker
            showTime
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={dateOfRequisitionToCourtChange}
            style={{ width: 180 }}
            disabledDate={disableFutureDates}
            disabled={viewCRPCSec164Details || disableForm}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          200,
          viewCRPCSec164Details || disableForm
        );
      case "dateFixed":
        return (
          <DatePicker
            showTime
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={dateFixedChange}
            style={{ width: 180 }}
            disabledDate={disableFutureDates}
            disabled={viewCRPCSec164Details || disableForm}
          />
        );
      case "dateRecorded":
        return (
          <DatePicker
            showTime
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={dateRecordedChange}
            style={{ width: 180 }}
            disabledDate={disableFutureDates}
            disabled={viewCRPCSec164Details || disableForm}
          />
        );
      case "magistrateName":
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewCRPCSec164Details || disableForm}
          />
        );
      case "nameOfCourtRecorded":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          200,
          viewCRPCSec164Details || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewCRPCSec164Details || disableForm}
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
    editCRPCSec164Obj,
    selectedFileName,
    selectedFir,
    currentUser,
    accusedCompleteDetails,
    savedFir
  );

  const templateList =
    selectedState === "Accused"
      ? CRPCSec164StatementAccusedTemplates
      : CRPCSec164StatementWitnessTemplates;

  const checkStateValue = (e) => {
    setSelectedState(e.target.value);
    checkFields();
  };

  const checkSummonValue = (e) => {
    setCheckSummonState(e.target.value);
    checkFields();
  };

  const supportingProsecutionValue = (e) => {
    setSupportingProsecutionState(e.target.value);
    checkFields();
  };

  const displayFormItems = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          return (
            <Col className="custody-col" key={i}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() => setIsProfessionalModalVisible(true)}
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

  const getSavedData = () => {
    let savedData = [];
    isArray(getSavedRecordList) &&
      !isEmpty(getSavedRecordList) &&
      // eslint-disable-next-line array-callback-return
      getSavedRecordList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.witnessOrAccusedId) &&
          !isNull(data?.witnessOrAccusedId) &&
          data?.witnessOrAccusedId;
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, [])
        );
      });
    return savedData;
  };

  const handleProfessionalOk = async () => {
    const values = await professionalForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "CRPCSec164";
    personalDetails.createdFor = "Proffessional";
    setMagistrateNameDetails(professionalDetails);
    form.setFieldsValue({
      magistrateName:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsProfessionalModalVisible(false);
  };

  const handleProfessionalCancel = () => {
    setIsProfessionalModalVisible(false);
  };

  const getNonsavedAccusedWit = () => {
    crpc164StatementList &&
      isArray(crpc164StatementList) &&
      crpc164StatementList.length > 0 &&
      crpc164StatementList.forEach((crele) => {
        crele?.witnessOrAccusedId.forEach((wit) => {
          remove(getDropdownData, { _id: wit._id });
        });
      });
    return getDropdownData;
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Sec.164 CrPC Statement"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={
          viewCRPCSec164Details ||
          (isBoolean(isValidDateOfFixed) && !isValidDateOfFixed) ||
          (isBoolean(isValidDateRecorded) && !isValidDateRecorded) ||
          disableForm
        }
      />

      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col className="custody-col">
                <Form.Item name="personType">
                  <Radio.Group
                    name="radiogroup"
                    onChange={checkStateValue}
                    defaultValue={selectedState}
                    disabled={
                      viewCRPCSec164Details ||
                      editCRPCSec164Obj?._id ||
                      disableForm
                    }
                  >
                    <Radio value="Accused">Accused</Radio>
                    <Radio value="Witness">Witness</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Row glutter={24}>
                <Col span={6}>
                  <Form.Item
                    name="witnessOrAccusedId"
                    label={`Select ${
                      selectedState === "Accused" ? "Accused" : "Witness"
                    } (Multiple)`}
                    rules={[
                      {
                        required: true,
                        message: `Please Select ${
                          selectedState === "Accused" ? "Accused" : "Witness"
                        }!`,
                      },
                    ]}
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
                        viewCRPCSec164Details ||
                        editCRPCSec164Obj?._id ||
                        disableForm
                      }
                    >
                      {selectedState !== "" &&
                        getDropdownData &&
                        !isEmpty(getDropdownData) &&
                        (editCRPCSec164Obj
                          ? getDropdownData
                          : getNonsavedAccusedWit()
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
                <Row glutter={24}>
                  <Col>
                    {displayFormItems(requisitiontoCourt, displayFields)}
                  </Col>
                </Row>
                {isBoolean(isValidDateOfFixed) && !isValidDateOfFixed ? (
                  <div className="ant-form-item-explain-error">
                    Date Fixed should be later than Date of Requisition to Court
                  </div>
                ) : null}
              </Card>
              <Card className="card-style">
                <Row>
                  <div className="courtOrders">
                    <h6 style={{ marginBottom: 10 }}>
                      <b>{`${
                        selectedState === "Accused"
                          ? "Summon to Accused"
                          : "Summon to the Witness"
                      } Served?`}</b>
                    </h6>{" "}
                    <Form.Item name="summonServed">
                      <Radio.Group
                        name="radiogroup"
                        onChange={checkSummonValue}
                        defaultValue={checkSummonState}
                        disabled={viewCRPCSec164Details || disableForm}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </Row>
              </Card>
              <Card className="card-style">
                <Row glutter={24}>
                  <Col style={{ marginBottom: 10 }}>
                    {displayFormItems(crpc164recorded, displayFields)}
                  </Col>
                </Row>
                {isBoolean(isValidDateRecorded) && !isValidDateRecorded ? (
                  <div className="ant-form-item-explain-error">
                    Date on which 164 Cr.P.C recorded should be later than Date
                    of Requisition to Court
                  </div>
                ) : null}
              </Card>
              <Card className="card-style">
                <Row>
                  <div className="courtOrders">
                    <h6 style={{ marginBottom: 10 }}>
                      <b>Statement is Supporting the Prosecution?</b>
                    </h6>{" "}
                    <Form.Item name="statementIsSupportingProsecution">
                      <Radio.Group
                        name="radiogroup"
                        onChange={supportingProsecutionValue}
                        defaultValue={supportingProsecutionState}
                        disabled={viewCRPCSec164Details || disableForm}
                      >
                        <Radio value="Yes">Yes</Radio>
                        <Radio value="No">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <Col className="custody-col file-upload">
                    <Form.Item name="upload164FormURL">
                      <Upload
                        fileList={
                          editCRPCSec164Obj?._id &&
                          editCRPCSec164Obj?.upload164FormURL?.url !== ""
                            ? selectedupload164FormURLFormURL
                            : upload164FormURL
                        }
                        customRequest={dummyRequest}
                        onChange={(info) =>
                          onFileChange(info, setUpload164FormURL)
                        }
                        onPreview={handleDownload}
                        multiple={false}
                      >
                        <Button
                          className="saveButton"
                          style={{ width: 260 }}
                          icon={<CameraFilled />}
                          disabled={
                            viewCRPCSec164Details ||
                            !isEmpty(upload164FormURL) ||
                            disableForm
                          }
                        >
                          Upload 164 Cr.P.C Statement
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="custody-reasons-row" style={{ marginTop: 20 }}>
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
                      disabled={viewCRPCSec164Details || disableForm}
                      placeholder="Select Date & Time"
                      style={{ width: 250 }}
                      onChange={checkFields}
                    />
                  </Form.Item>
                </Row>
              </Card>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={templateList}
              showModal={showModal}
              disabled={
                viewCRPCSec164Details || !editCRPCSec164Obj?._id || disableForm
              }
              selectedRecord={editCRPCSec164Obj}
              selectedModule="crPcNotice164"
              accusedId={editCRPCSec164Obj?.witnessOrAccusedId?._id}
            />
            {!isEmpty(getSavedData()) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
                disabled={disableForm}
              >
                {getSavedData() && getSavedData().length > 0
                  ? getSavedData().length
                  : 0}{" "}
                Sec.164 CrPC Statement Records
              </Button>
            ) : null}
            <Modal
              title="Sec.164 CrPC Statement Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditSEC164}
                  setViewDetails={setViewCRPCSec164Details}
                  selectedRecord={editCRPCSec164Obj}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
        </Row>
      )}
      {isProfessionalModalVisible ? (
        <AddProfessional
          title="Add Professional Details"
          isModalVisible={isProfessionalModalVisible}
          handleOk={handleProfessionalOk}
          handleCancel={handleProfessionalCancel}
          formName={professionalForm}
          checkFields={checkFields}
          disabled={viewCRPCSec164Details || disableForm}
        />
      ) : null}
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
