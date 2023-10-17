import {
  Row,
  Col,
  Form,
  Input,
  DatePicker,
  Radio,
  Card,
  notification,
  Select,
} from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { isEmpty, isArray } from "lodash";
import { textFieldRules, textAreaRules } from "@components/Common/formOptions";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  accusedLists,
  getWitnessDetails,
  shortAddress,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import documentryEvidenceActions from "@redux/investigations/collectionOfEvidence/documentryEvidence/actions";
import { loadState } from "@lib/helpers/localStorage";
import AddProfessional from "@containers/FirDetails/Investigation/CommonForms/AddProfessional";
import { documentryFormList } from "./const";
import SaveResetButton from "../SaveResetButton";
import { CaretDownOutlined } from "@ant-design/icons";
import SavedRecords from "./SavedRecords";
import { getEvidenceListData } from "../const";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { disableFutureDates } from "@components/Common/helperMethods";

const Option = Select.Option;
const { TextArea } = Input;

export default function DocumentryEvidence({
  editDocumentryObj,
  setEditDocumentryObj,
  viewDocumentryDetails,
  setViewDocumentryDetails,
}) {
  const dispatch = useDispatch();
  const [documentryForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const crimeId = loadState("selectedFirId");
  const [selectedProfessional, setSelectedProfressional] = useState({});
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNoticeRequired, setIsNoticeRequired] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const { createAuditHistory } = auditHistoryActions;
  const { evidenceCollectionList } = useSelector((state) => state.MasterData);
  const {
    updateDocumentryEvidenceDetails,
    addDocumentryEvidenceDetails,
    getDocumentryEvidenceList,
    resetActionType,
  } = documentryEvidenceActions;
  const {
    actionType,
    errorMessage,
    successMessage,
    documentryEvidenceList,
    isFetching,
  } = useSelector((state) => state.DocumentryEvidence);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { witnessStatementList } = useSelector((state) => state.FIR);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const accusedList =
    !isEmpty(suspectAccusedList) &&
    getAccuseds(accusedLists(suspectAccusedList));
  const witnessList =
    !isEmpty(witnessStatementList) && getWitnessDetails(witnessStatementList);

  const witnessAccusedList = accusedList &&
    witnessList && [...accusedList, ...witnessList];

  const isSuccess =
    actionType === "ADD_DOCUMENTRY_EVIDENCE_SUCCESS" ||
    actionType === "UPDATE_DOCUMENTRY_EVIDENCE_SUCCESS";
  const isError =
    actionType === "ADD_DOCUMENTRY_EVIDENCE_ERROR" ||
    actionType === "UPDATE_DOCUMENTRY_EVIDENCE_ERROR";

  const checkFields = async () => {
    const values = await documentryForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchDocumentryList = () => {
    dispatch(
      getDocumentryEvidenceList(
        `${config.getEvidenceDetails}/DOC/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    fetchDocumentryList();
  }, []);

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_DOCUMENTRY_EVIDENCE_SUCCESS"
        ? "Documentary Evidence Added"
        : "Documentary Evidence Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/documentaryEvidence",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Documentary evidence successfully added" ||
        successMessage === "Documentary evidence successfully updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        documentryForm.resetFields();
        setViewDocumentryDetails(false);
        setEditDocumentryObj(null);
        dispatch(resetActionType());
        fetchDocumentryList();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkIsNoticeRequired = (e) => {
    setIsNoticeRequired(e.target.value);
    checkFields();
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedProfressional(values);
    setSelectedAuthority("");
    documentryForm.setFieldsValue({
      authorityDetails:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10, padding: 0 }}>
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

  const getAuthorityDropdown = (
    menuOptions,
    selectAction,
    handleSearch,
    serchText,
    width = "",
    disabled = false
  ) => {
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
        style={{ width: width || 150 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => {
            const address =
              item?.presentAddress && shortAddress(item?.presentAddress);
            const personDetails =
              address !== "" && address !== undefined
                ? `${item.label}, ${address}`
                : `${item.label}`;
            return (
              <Option key={index} value={item._id} label={personDetails}>
                {personDetails}
              </Option>
            );
          })}
      </Select>
    );
  };

  const onAuthorityChange = (val) => {
    setSelectedAuthority(val);
    checkFields();
  };

  const getDropdownValues = (entity) => {
    return (
      !isEmpty(evidenceCollectionList) &&
      evidenceCollectionList.filter((s) => s.entity === entity)
    );
  };
  const purposeList = getEvidenceListData(getDropdownValues("purpose"));
  const strengthOfEvidence = getEvidenceListData(
    getDropdownValues("strengthOfEvidence")
  );

  const displayFields = (name) => {
    switch (name) {
      case "purpose":
        return renderFieldsWithDropDown(
          purposeList,
          null,
          handleSearch,
          serchText,
          230,
          viewDocumentryDetails || disableForm
        );
      case "authorityDetails":
        return getAuthorityDropdown(
          witnessAccusedList,
          onAuthorityChange,
          handleSearch,
          serchText,
          230,
          viewDocumentryDetails || disableForm
        );
      case "crpc91Required":
        return (
          <Radio.Group
            name="radiogroup"
            onChange={checkIsNoticeRequired}
            defaultValue={isNoticeRequired}
            disabled={viewDocumentryDetails || disableForm}
          >
            <Radio value="Yes">Yes</Radio>
            <Radio value="No">No</Radio>
          </Radio.Group>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 230 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewDocumentryDetails || disableForm}
          />
        );
    }
  };

  const handleEditDocumentryEvidence = (value) => {
    if (value) {
      setEditDocumentryObj(value);
      setViewDocumentryDetails(false);
      setSelectedAuthority(value?.authorityDetails?._id);
      const crpc91Required = value?.crpc91Required ? "Yes" : "No";
      setIsNoticeRequired(crpc91Required);
      const personalDetails = value?.authorityDetails?.personalDetails;
      const person = `${personalDetails?.name || ""} ${
        personalDetails?.surname || ""
      }`;

      documentryForm.setFieldsValue({
        authorityDetails: person,
        crpc91Required: crpc91Required,
        dateOfNotice: moment(new Date(value?.dateOfNotice)).isValid()
          ? moment(new Date(value?.dateOfNotice))
          : "",
        dateOfReceipt: moment(new Date(value?.dateOfReceipt)).isValid()
          ? moment(new Date(value?.dateOfReceipt))
          : "",

        dateOfRequisition: moment(new Date(value?.dateOfRequisition)).isValid()
          ? moment(new Date(value?.dateOfRequisition))
          : "",
        nameOfDocument: value?.nameOfDocument,
        strengthOfEvidence: value?.strengthOfEvidence,
        purpose: value?.purpose,
        opinion: value?.opinion,
      });
    }
  };

  const submit = async () => {
    const values = await documentryForm.validateFields();
    let n1 = getPersonDetails(selectedProfessional, inputList, []);
    let { personalDetails } = n1;
    personalDetails.createdFrom = "Documentry Evidence";
    personalDetails.createdFor = "Proffessional";
    const payload = {
      crimeId: crimeId,
      data: {
        nameOfDocument: values.nameOfDocument,
        purpose: values.purpose,
        authorityDetails: selectedAuthority === "" ? n1 : selectedAuthority,
        crpc91Required: values.crpc91Required === "Yes" ? true : false,
        dateOfNotice: values.dateOfNotice,
        dateOfReceipt: values.dateOfReceipt,
        strengthOfEvidence: values.strengthOfEvidence,
        dateOfRequisition: values.dateOfRequisition,
        opinion: values.opinion,
      },
    };

    const updatePayload = {
      docId: editDocumentryObj?._id,
      ...payload,
    };
    if (editDocumentryObj?._id) {
      dispatch(
        updateDocumentryEvidenceDetails(config.updateDOC, updatePayload)
      );
    } else {
      dispatch(addDocumentryEvidenceDetails(config.addDOC, payload));
    }
  };

  const onReset = () => {
    documentryForm.resetFields();
    checkFields();
    setEditDocumentryObj(null);
    setIsNoticeRequired("");
    setViewDocumentryDetails(false);
  };

  return isFetching ? (
    <Loader />
  ) : (
    <Card style={{ width: "100%" }}>
      <div style={{ padding: 20 }}>
        <Form form={documentryForm} layout="vertical">
          {displayState(documentryFormList, displayFields)}
          <Row gutter={24}>
            {isNoticeRequired === "Yes" ? (
              <Col span={8} style={{ marginBottom: 10, padding: 0 }}>
                <Form.Item name="dateOfNotice" label="Date of Notice">
                  <DatePicker
                    format={DATE_FORMAT}
                    style={{ width: 230 }}
                    onChange={checkFields}
                    disabled={viewDocumentryDetails || disableForm}
                  />
                </Form.Item>
              </Col>
            ) : null}
            {isNoticeRequired === "No" ? (
              <Col span={8} style={{ marginBottom: 10, padding: 0 }}>
                <Form.Item name="dateOfRequisition" label="Date of Requisition">
                  <DatePicker
                    disabledDate={disableFutureDates}
                    format={DATE_FORMAT}
                    style={{ width: 230 }}
                    onChange={checkFields}
                    disabled={viewDocumentryDetails || disableForm}
                  />
                </Form.Item>
              </Col>
            ) : null}
            <Col span={8} style={{ marginBottom: 10, padding: 0 }}>
              <Form.Item name="dateOfReceipt" label="Date of Receipt">
                <DatePicker
                  disabledDate={disableFutureDates}
                  format={DATE_FORMAT}
                  style={{ width: 230 }}
                  onChange={checkFields}
                  disabled={viewDocumentryDetails || disableForm}
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginBottom: 10, padding: 0 }}>
              <Form.Item name="strengthOfEvidence" label="Strength Of Evidence">
                {renderFieldsWithDropDown(
                  strengthOfEvidence,
                  null,
                  handleSearch,
                  serchText,
                  230,
                  viewDocumentryDetails || disableForm
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} style={{ marginBottom: 10, paddingLeft: 0 }}>
              <Form.Item
                name="opinion"
                label="Opinion"
                rules={[textAreaRules.textAreaMaxLength]}
              >
                <TextArea
                  rows={4}
                  columns={3}
                  maxLength={textAreaRules.maxLength}
                  disabled={viewDocumentryDetails || disableForm}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <SaveResetButton
          onSubmit={submit}
          disabled={viewDocumentryDetails || disableForm}
          onReset={onReset}
        />
      </div>
      {isModalVisible ? (
        <AddProfessional
          title="Add Professional Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={viewDocumentryDetails || disableForm}
          setInputList={setInputList}
          editObj={editDocumentryObj}
          age={age}
          setAge={setAge}
        />
      ) : null}
      {isArray(documentryEvidenceList) && !isEmpty(documentryEvidenceList) ? (
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          <SavedRecords
            dataSource={documentryEvidenceList}
            editDetails={handleEditDocumentryEvidence}
            setViewDetails={setViewDocumentryDetails}
            selectedRecord={editDocumentryObj}
            disableForm={disableForm}
          />
        </div>
      ) : null}
    </Card>
  );
}
