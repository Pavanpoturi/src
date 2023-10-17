/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import ContentHeader from "../../ContentHeader";
import moment from "moment";
import AddPerson from "../CommonForms/AddPerson";
import AddAddress from "../CommonForms/AddAddress";
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
  DatePicker,
  notification,
  Button,
  Modal,
} from "antd";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getPersonDetails,
  getAccusedsAll,
  getSavedDataResult,
} from "@containers/FirDetails/fir-util";
import { renderDecesedDropDown } from "../../Investigation/utils";
import commonActions from "@redux/investigations/commonRequest/actions";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  CRPC160Templates,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import crpcNotice160Actions from "@redux/investigations/crpcNotice160/actions";
import { add160CrpcPayload, update160CrpcPayload } from "./CRPC160Payloads";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, isArray, isNull, isUndefined } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import TemplatesModal from "../CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";

export default function CRPCNotice160({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [formValid, setFormValid] = useState(false);
  const {
    notice160List,
    isLoading,
    actionName,
    commonSuccessMessage,
    commonErrorMessage,
  } = useSelector((state) => state.CommonRequest);
  const { actionType, errorMessage, isFetching, crpc160List, successMessage } =
    useSelector((state) => state.CRPCNotice160);
  const { getNotice160List, addNotice160Details, resetNotice160ActionType } =
    commonActions;
  const [view160CrpcDetails, setView160CrpcDetails] = useState(false);
  const [selectedPersonValue, setSelectedPersonValue] = useState("");
  const [placeOfCompliance, setPlaceOfCompliance] = useState("");
  const [age, setAge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [inputList, setInputList] = useState([]);
  const [addressDetails, setAddressDetails] = useState([]);
  const [edit160CrpcObj, setEdit160CrpcObj] = useState(null);
  const [serchText, setSerchText] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [addAnother, setAddAnother] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [get160ListState, setget160ListState] = useState([]);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true;
  const { createAuditHistory } = auditHistoryActions;

  const placeForComplianceList = [
    { label: selectedFir?.psName },
    { label: "Others" },
  ];

  const notice160ListDetails = notice160List && getAccusedsAll(notice160List);

  const isNotice160Success = actionName === "ADD_NOTICE_160_SUCCESS";
  const isNotice160Error = actionName === "ADD_NOTICE_160_ERROR";

  const isSuccess =
    actionType === "ADD_160_CRPC_SUCCESS" ||
    actionType === "UPDATE_160_CRPC_SUCCESS";

  const isError =
    actionType === "ADD_160_CRPC_ERROR" ||
    actionType === "UPDATE_160_CRPC_ERROR";

  const {
    add160CrpcDetails,
    update160CrpcDetails,
    get160CrpcList,
    resetActionType,
  } = crpcNotice160Actions;

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_160_CRPC_SUCCESS"
        ? "160 Cr.P.C Notice Created"
        : "160 Cr.P.C Notice Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/160CrPcNotice",
          auditType
        )
      )
    );
  };

  const fetchNotice160List = () => {
    dispatch(
      getNotice160List(
        `${config.getPostCrimeSceneDetails}/NOTICE160/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isNotice160Success || isNotice160Error) {
      if (commonSuccessMessage === "Person Details Successfully Added") {
        openNotificationWithIcon("success", commonSuccessMessage);
        personForm.resetFields();
        fetchNotice160List();
        dispatch(resetNotice160ActionType());
        setIsModalVisible(false);
      } else if (commonErrorMessage) {
        openNotificationWithIcon("error", commonErrorMessage);
        dispatch(resetNotice160ActionType());
        setIsModalVisible(false);
      }
    }
  }, [actionName]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "160 Cr.P.C Notice Successfully Added" ||
        successMessage === "160 Cr.P.C Notice Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        fetchNotice160List();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setView160CrpcDetails(false);
          setEdit160CrpcObj(null);
          dispatch(
            get160CrpcList(`${config.crpcNotice160}?crimeId=${crimeId}`)
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
    dispatch(get160CrpcList(`${config.crpcNotice160}?crimeId=${crimeId}`));
    fetchNotice160List();
  }, []);

  const submit = async () => {
    const values = await form.validateFields();
    const addPayload = add160CrpcPayload(
      values,
      crimeId,
      addressDetails,
      placeOfCompliance
    );
    const updatePayload = update160CrpcPayload(
      values,
      crimeId,
      edit160CrpcObj?._id,
      addressDetails,
      placeOfCompliance
    );

    if (edit160CrpcObj?._id) {
      dispatch(update160CrpcDetails(config.crpcNotice160, updatePayload));
    } else {
      dispatch(add160CrpcDetails(config.crpcNotice160, addPayload));
    }
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEdit160Crpc = (value) => {
    if (value) {
      setEdit160CrpcObj(value);
      setPlaceOfCompliance(value.placeForCompliance);
      form.setFieldsValue({
        personId: value.personId?._id,
        dateOfIssue: moment(new Date(value?.dateOfIssue)).isValid()
          ? moment(new Date(value?.dateOfIssue))
          : "",
        dateOfCompliance: moment(new Date(value?.dateOfCompliance)).isValid()
          ? moment(new Date(value?.dateOfCompliance))
          : "",
        placeForCompliance: value.placeForCompliance || placeOfCompliance,
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
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

  const reportData = getDataForDocument(
    edit160CrpcObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const handleOk = async () => {
    const values = await personForm.validateFields();
    const payload = {
      crimeId: crimeId,
      notice160Detail: {
        lastupdateddatetime: Date.now(),
        person: getPersonDetails(values, inputList),
        userDate: values.userDate,
      },
    };
    dispatch(addNotice160Details(config.addNotice160Details, payload));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    setAddressDetails(values);
    setIsAddressModalVisible(false);
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
  };

  useEffect(() => {
    let savedData = [];
    isArray(crpc160List) &&
      !isEmpty(crpc160List) &&
      // eslint-disable-next-line array-callback-return
      crpc160List.forEach((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.personId) &&
          !isNull(data?.personId) &&
          data?.personId;
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, [])
        );
      });
    setget160ListState(savedData);
  }, [crpc160List]);

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="160 Cr.P.C Notice"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        // disableButton={!formValid || disableForm}
        disableButton={disableForm}
      />
      {isFetching || isLoading ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      name="personId"
                      label="Name and Address of Person to Issue Notice"
                      rules={[
                        {
                          required: true,
                          message:
                            "Name and Address of Person to Issue Notice!",
                        },
                      ]}
                    >
                      {renderDecesedDropDown(
                        notice160ListDetails,
                        setSelectedPersonValue,
                        250,
                        true,
                        edit160CrpcObj?._id ||
                          isEmpty(notice160ListDetails) ||
                          disableForm,
                        null,
                        handleSearch,
                        serchText
                      )}
                    </Form.Item>
                  </Col>
                  <Col
                    className="link"
                    style={{ marginTop: 50, cursor: "pointer" }}
                    onClick={() =>
                      setIsModalVisible(disableForm ? false : true)
                    }
                  >
                    Add Person
                  </Col>
                </Row>
                <Card className="card-style">
                  <Row>
                    <Col span={7}>
                      <Form.Item name="dateOfIssue" label="Date of Issue">
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          disabledDate={disableFutureDates}
                          disabled={view160CrpcDetails || disableForm}
                          placeholder="Select Date & Time"
                          style={{ width: 200 }}
                          onChange={checkFields}
                        />
                      </Form.Item>
                      <div
                        className="link"
                        style={{ marginTop: 25, cursor: "pointer" }}
                        onClick={() => setSelectedSiderMenu("witnessStatement")}
                      >
                        Witness Examination
                      </div>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="dateOfCompliance"
                        label="Date of Compliance"
                      >
                        <DatePicker
                          showTime
                          format={DATE_FORMAT}
                          disabledDate={disableFutureDates}
                          disabled={view160CrpcDetails || disableForm}
                          placeholder="Select Date"
                          style={{ width: 200 }}
                          onChange={checkFields}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7}>
                      <Form.Item
                        name="placeForCompliance"
                        label="Place for Compliance"
                      >
                        {renderFieldsWithDropDown(
                          placeForComplianceList,
                          setPlaceOfCompliance,
                          handleSearch,
                          serchText,
                          200,
                          view160CrpcDetails || disableForm
                        )}
                      </Form.Item>
                      {placeOfCompliance === "Others" ? (
                        <div
                          className="link"
                          style={{ marginTop: 5, cursor: "pointer" }}
                          onClick={() =>
                            setIsAddressModalVisible(disableForm ? false : true)
                          }
                        >
                          Add Address
                        </div>
                      ) : null}
                      <div
                        style={{
                          marginTop: 5,
                          width: 300,
                          color: "#888888",
                          fontSize: 13,
                          letterSpacing: 0.3,
                        }}
                      >
                        Note: Less than 15 years, more than 65 years and woman,
                        mentally and physically challenged witnesses, the venue
                        should be at the place of their residence.
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
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
                          disabled={view160CrpcDetails || disableForm}
                          placeholder="Select Date & Time"
                          style={{ width: 200 }}
                          onChange={checkFields}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={CRPC160Templates}
              showModal={showModal}
              disabled={view160CrpcDetails || !edit160CrpcObj?._id}
              selectedRecord={edit160CrpcObj}
              selectedModule="crPcNotice160"
              accusedId={edit160CrpcObj?.personId?._id}
            />
            {crpc160List && !isEmpty(crpc160List) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {crpc160List && crpc160List.length > 0 ? crpc160List.length : 0}{" "}
                160 Cr.P.C Notice Records
              </Button>
            ) : null}
            <Modal
              title="160 Cr.P.C Notice Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={get160ListState}
                  editDetails={handleEdit160Crpc}
                  setViewDetails={setView160CrpcDetails}
                  selectedRecord={edit160CrpcObj}
                  isMedia={false}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
          {isModalVisible ? (
            <AddPerson
              title="Add Person Details"
              isModalVisible={isModalVisible}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              checkFields={checkFields}
              disabled={view160CrpcDetails || disableForm}
              setInputList={setInputList}
              editObj={edit160CrpcObj}
              age={age}
              setAge={setAge}
            />
          ) : null}
          {isAddressModalVisible ? (
            <AddAddress
              title="Add Address"
              isModalVisible={isAddressModalVisible}
              handleOk={handleAddressOk}
              handleCancel={handleAddressCancel}
              formName={addressForm}
              checkFields={checkFields}
              disabled={view160CrpcDetails || disableForm}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedPermanentState={selectedPermanentState}
              setSelectedPermanentState={setSelectedPermanentState}
            />
          ) : null}
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
    </ModuleWrapper>
  );
}
