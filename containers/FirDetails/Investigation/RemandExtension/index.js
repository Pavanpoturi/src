import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { first, isEmpty, isArray, isUndefined, isNull } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { config } from "@config/site.config";
import { textFieldRules } from "@components/Common/formOptions";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  notification,
  Select,
  Button,
  Modal,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  DATE_FORMAT,
  getDate,
  getRemandedAccusedForExtensions,
  DATE_YY_MM_DD,
  getSavedDataResult,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import Loader from "@components/utility/loader";
import masterDataActions from "@redux/masterData/actions";
import remandReportActions from "@redux/investigations/remandReport/actions";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import remandExtensionActions from "@redux/investigations/remandExtension/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import ContentHeader from "../../ContentHeader";
import { ModuleWrapper } from "../CommonDetails/styles";
import {
  extensionReportTemplates,
  extensionReportForm,
  getDataForDocument,
  getHTMLFromTemplate,
  remandList,
} from "./const";
import TemplatesModal from "../CommonForms/TemplatesModal";
import AccusedCard from "../CommonForms/AccusedCard";

const Option = Select.Option;

export default function RemandExtension({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [viewRemandExtension, setViewRemandExtension] = useState(false);
  const [editRemandExtensionObj, setRemandExtensionObj] = useState(null);
  const { getAccusedList } = suspectAccusedAction;
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [status, setStatus] = useState("");
  const [extensionDaysGranted, setExtensionDaysGranted] = useState("");
  const [ppOrAPPName, setppOrAPPName] = useState("");
  const [ioName, setIoName] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [courtName, setCourtName] = useState("");
  const [defenseCounsel, setSefenseCounsel] = useState("");
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { getRemandReportList } = remandReportActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const { getCourtsBasedonPsCode } = masterDataActions;
  const {
    addRemandExtensionDetails,
    updateRemandExtensionDetails,
    getRemandExtensionList,
    resetActionType,
  } = remandExtensionActions;
  const {
    actionType,
    errorMessage,
    isFetching,
    successMessage,
    remandExtensionList,
  } = useSelector((state) => state.RemandExtension);
  const { remandReportList } = useSelector((state) => state.RemandReport);
  const { createAuditHistory } = auditHistoryActions;

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const [serchText, setSerchText] = useState("");

  const isSuccess =
    actionType === "ADD_REMAND_EXTENSION_SUCCESS" ||
    actionType === "UPDATE_REMAND_EXTENSION_SUCCESS";

  const isError =
    actionType === "ADD_REMAND_EXTENSION_ERROR" ||
    actionType === "UPDATE_REMAND_EXTENSION_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_REMAND_EXTENSION_SUCCESS"
        ? "Remand Extension Created"
        : "Remand Extension Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/remandExtension",
          auditType
        )
      )
    );
  };

  const getMasterDataList = () => {
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetchRemandReport = () => {
    dispatch(getRemandReportList(`${config.remandReport}?crimeId=${crimeId}`));
  };

  const fetchRemandExtension = () => {
    dispatch(
      getRemandExtensionList(`${config.remandExtension}?crimeId=${crimeId}`)
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Remand Extension Successfully Added" ||
        successMessage === "Remand Extension Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        setppOrAPPName("");
        setIoName("");
        setCourtName("");
        setJudgeName("");
        setSefenseCounsel("");
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          setSelectedAccusedValue("");
          setViewRemandExtension(false);
          setRemandExtensionObj(null);
          fetchRemandExtension();
          fetchRemandReport();
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    fetchAccusedList();
    fetchRemandReport();
    fetchRemandExtension();
    getMasterDataList();
  }, []);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const submit = async () => {
    const values = await form.validateFields();
    const commonPayload = {
      crimeId: crimeId,
      selectedRemand: values.selectedRemand,
      requestForExtensionDate: values?.requestForExtensionDate
        ? getDate(values?.requestForExtensionDate)
        : "",
      courtName: values?.courtName,
      remandExtensionDays: values.remandExtensionDays,
    };

    const addRemandExtension = {
      accusedId: accusedPersonalDetails?._id,
    };
    const addRemandExtensionPayload = {
      ...addRemandExtension,
      ...commonPayload,
    };

    const updateRemandExtension = {
      accusedId: editRemandExtensionObj?.accusedId,
      _id: editRemandExtensionObj?._id,
    };

    const updateRemandExtensionPayload = {
      ...updateRemandExtension,
      ...commonPayload,
    };

    if (editRemandExtensionObj?._id) {
      dispatch(
        updateRemandExtensionDetails(
          config.remandExtension,
          updateRemandExtensionPayload
        )
      );
    } else {
      dispatch(
        addRemandExtensionDetails(
          config.remandExtension,
          addRemandExtensionPayload
        )
      );
    }
  };

  const handleEditRemandExtension = (value) => {
    if (value) {
      setRemandExtensionObj(value);
      setSelectedAccusedValue(value.accusedId?._id);
      setStatus(value?.status);
      setExtensionDaysGranted(value?.remandExtensionDays);
      setppOrAPPName(value.ppOrAPPName);
      setIoName(value.ioName);
      setJudgeName(value.judgeName);
      setCourtName(value.remandReport?.courtName);
      setSefenseCounsel(value.defenseCounsel);
      form.setFieldsValue({
        accusedId: value.accusedId?._id,
        requestForExtensionDate: moment(
          new Date(value?.requestForExtensionDate)
        ).isValid()
          ? moment(new Date(value?.requestForExtensionDate))
          : "",
        courtName: value?.courtName,
        selectedRemand: value?.selectedRemand,
        remandExtensionDays: value?.remandExtensionDays,
      });
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onChangeDate = (date, _dateString) => {
    console.log(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const remandedAccused = getRemandedAccusedForExtensions(remandReportList);
  const accusedPersonalDetails = first(
    remandedAccused.filter((s) => s._id === selectedAccusedValue)
  );

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayConfessionalStatementsFields = (name) => {
    switch (name) {
      case "requestForExtensionDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={onChangeDate}
            style={{ width: 200 }}
            disabled={viewRemandExtension || disableForm}
            disabledDate={disableFutureDates}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          checkFields,
          handleSearch,
          serchText,
          230,
          viewRemandExtension || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            disabled={viewRemandExtension || disableForm}
            maxLength={textFieldRules.maxLength}
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
    editRemandExtensionObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  const displayFieldsDetails = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col span={8} key={i}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const getDropDownOptions = (
    dataList,
    setAction,
    isRemand = false,
    disabled
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onSelect={(item, option) => {
          setAction(item);
          checkFields();
        }}
        disabled={
          viewRemandExtension || editRemandExtensionObj?._id || disabled
        }
      >
        {!isEmpty(dataList) &&
          dataList.map((item, index) => (
            <Option
              key={index}
              value={item._id}
              label={item.label}
              remandedutnumber={item.remandedUTNumber}
            >
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(remandExtensionList) &&
      !isEmpty(remandExtensionList) &&
      // eslint-disable-next-line array-callback-return
      remandExtensionList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.accusedId) &&
          !isNull(data?.accusedId) &&
          data?.accusedId;

        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, [])
        );
      });
    return savedData;
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Remand Extension"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row>
                  <Col span={6}>
                    <Form.Item
                      name="accusedId"
                      label="Select Accused"
                      rules={[
                        { required: true, message: "Please Select Accused!" },
                      ]}
                    >
                      {getDropDownOptions(
                        remandedAccused,
                        setSelectedAccusedValue,
                        false,
                        false,
                        disableForm
                      )}
                    </Form.Item>
                    {selectedAccusedValue !== "" && (
                      <AccusedCard
                        accusedPersonalDetails={accusedPersonalDetails}
                        title="Accused Details"
                      />
                    )}
                  </Col>
                  <Col span={6} style={{ marginLeft: 50 }}>
                    <Form.Item
                      name="selectedRemand"
                      label="Select Remand"
                      rules={[
                        { required: true, message: "Please Select Remand!" },
                      ]}
                    >
                      {renderFieldsWithDropDown(
                        remandList,
                        checkFields,
                        handleSearch,
                        serchText,
                        230,
                        viewRemandExtension ||
                          editRemandExtensionObj?._id ||
                          disableForm
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Card className="card-style">
                  <Row className="custody-reasons-row">
                    {displayFieldsDetails(
                      extensionReportForm,
                      displayConfessionalStatementsFields
                    )}
                    {editRemandExtensionObj?.requestForExtensionDate &&
                      editRemandExtensionObj?.remandExtensionDays && (
                        <>
                          <Col span={3}>
                            <div>Status</div>
                            <div className="staticContent">{status}</div>
                          </Col>
                          <Col span={4}>
                            <div>Extension Days Granted</div>
                            <div className="staticContent">
                              {extensionDaysGranted}
                            </div>
                          </Col>
                        </>
                      )}
                  </Row>
                  {editRemandExtensionObj?._id && (
                    <Row className="custody-reasons-row">
                      <Col span={8} style={{ marginTop: 20 }}>
                        <div>PP/APP Personally Appeared?</div>
                        <div className="staticContent">{ppOrAPPName}</div>
                      </Col>
                      <Col span={8} style={{ marginTop: 20 }}>
                        <div>IO Personally Appeared?</div>
                        <div className="staticContent">{ioName}</div>
                      </Col>
                      <Col span={4} style={{ marginTop: 20 }}>
                        <div>Court Name</div>
                        <div className="staticContent">{courtName}</div>
                      </Col>
                      <Col span={4} style={{ marginTop: 20 }}>
                        <div>Judge Name</div>
                        <div className="staticContent">{judgeName}</div>
                      </Col>
                      <Col span={4} style={{ marginTop: 20 }}>
                        <div>Defense Counsel</div>
                        <div className="staticContent">{defenseCounsel}</div>
                      </Col>
                    </Row>
                  )}
                </Card>
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={extensionReportTemplates}
              showModal={showModal}
              disabled={
                viewRemandExtension ||
                !editRemandExtensionObj?._id ||
                disableForm
              }
              selectedRecord={editRemandExtensionObj}
              selectedModule="remandExtension"
              accusedId={editRemandExtensionObj?.accusedId?._id}
            />
            {!isEmpty(remandExtensionList) ? (
              <Button
                style={{ marginTop: "40px", width: "90%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {remandExtensionList && remandExtensionList.length > 0
                  ? remandExtensionList.length
                  : 0}{" "}
                Remand Extension Records
              </Button>
            ) : null}
            <Modal
              title="Remand Extension Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <SavedRecords
                dataSource={getSavedData()}
                editDetails={handleEditRemandExtension}
                setViewDetails={setViewRemandExtension}
                selectedRecord={editRemandExtensionObj}
                isMedia={false}
                recordVisible={setrecordsIsModalVisible}
              />
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
