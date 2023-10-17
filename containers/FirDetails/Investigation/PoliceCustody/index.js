import { useState, useEffect } from "react";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import Loader from "@components/utility/loader";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  notification,
  Button,
  Modal,
} from "antd";
import axios from "axios";
import { CaretDownOutlined } from "@ant-design/icons";
import { disableFutureDates } from "@components/Common/helperMethods";
import {
  DATE_FORMAT,
  renderFieldsWithMultipleDropDown,
  getStaffsDetails,
  getSavedDataResult,
  masterDataType,
  folderName,
  getMediaUploadError,
  getPersonAddressTemplate,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, first, isArray, isUndefined, isNull, remove } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import masterDataActions from "@redux/masterData/actions";
import policeCustodyActions from "@redux/investigations/policeCustody/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import {
  addPoliceCustodyPayload,
  updatePoliceCustodyPayload,
} from "./policeCustodyPayloads";
import { ModuleWrapper } from "../CommonDetails/styles";
import TemplatesModal from "../CommonForms/TemplatesModal";
import SavedRecords from "./SavedRecords";
import ContentHeader from "../../ContentHeader";
import {
  policeCustodyArrestProces,
  policeCustodyForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import MedicalExamination from "../CommonForms/MedicalExamination";

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function PoliceCustody({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [formValid, setFormValid] = useState(false);
  const [isInjured, setIsInjured] = useState(true);
  const [serchText, setSerchText] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [addAnother, setAddAnother] = useState(false);
  const [selectedAccused, setSelectedAccused] = useState("");
  const { getPoliceCustodyReasons, getStaffList } = masterDataActions;
  const { requisitionProcess, requisitionGrantProcess } = policeCustodyForm;
  const { getAccusedList } = suspectAccusedAction;
  const { createAuditHistory } = auditHistoryActions;
  const [viewPoliceCustodyDetails, setViewPoliceCustodyDetails] =
    useState(false);
  const [editPoliceCustodyObj, setEditPoliceCustodyObj] = useState(null);
  const [InvalidGrantDays, setInvalidGrantDays] = useState(false);
  const [dates, setDates] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [uploadMedicalCertificateUrl, setUploadMedicalCertificateUrl] =
    useState([]);
  const [
    selectedUploadMedicalCertificateUrl,
    setSelectedUploadMedicalCertificateUrl,
  ] = useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const {
    actionType,
    errorMessage,
    isFetching,
    policeCustodyList,
    successMessage,
  } = useSelector((state) => state.PoliceCustody);

  const {
    addPoliceCustodyDetails,
    updatePoliceCustodyDetails,
    getPoliceCustodyList,
    resetActionType,
  } = policeCustodyActions;

  const { policeCustodyReasonsList, staffList } = useSelector(
    (state) => state.MasterData
  );
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);

  const isSuccess =
    actionType === "ADD_POLICE_CUSTODY_SUCCESS" ||
    actionType === "UPDATE_POLICE_CUSTODY_SUCCESS";

  const isError =
    actionType === "ADD_POLICE_CUSTODY_ERROR" ||
    actionType === "UPDATE_POLICE_CUSTODY_ERROR";

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_POLICE_CUSTODY_SUCCESS"
        ? "Police Custody Created"
        : "Police Custody Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/policeCustody",
          auditType
        )
      )
    );
  };

  const handleSearch = (text) => {
    setSerchText(text);
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

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Police Custody Successfully Added" ||
        successMessage === "Police Custody Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewPoliceCustodyDetails(false);
          setEditPoliceCustodyObj(null);
          setUploadMedicalCertificateUrl([]);
          dispatch(
            getPoliceCustodyList(`${config.policeCustody}?crimeId=${crimeId}`)
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
      getPoliceCustodyList(`${config.policeCustody}?crimeId=${crimeId}`)
    );
  }, []);

  const getMasterDataList = () => {
    const url = config.getMasterData;
    dispatch(
      getPoliceCustodyReasons(`${url}/${masterDataType.POLICE_CUSTODY_REASONS}`)
    );
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  };

  useEffect(() => {
    fetchAccusedList();
    getMasterDataList();
  }, []);

  useEffect(() => {
    if (viewPoliceCustodyDetails) {
      dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    }
  }, []);

  const getAccuseds = () => {
    let list = [];
    !isEmpty(suspectAccusedList) &&
      suspectAccusedList &&
      // eslint-disable-next-line array-callback-return
      suspectAccusedList.map((item) => {
        const { person } = item;
        const result = {
          label: `${person?.personalDetails?.name || ""} ${
            person?.personalDetails?.surname || ""
          }`,
          _id: person._id,
          permanentAddress: person?.permanentAddress,
          personalDetails: person?.personalDetails,
          presentAddress: person?.presentAddress,
          contactDetails: person?.contactDetails,
          accusedCode: item.accusedCode,
        };
        if (item?.accusedCode && !item?.isAbsconding) {
          list.push(result);
        }
      });
    return list;
  };

  const getAccusedData = () => getAccuseds();
  let accusedCompleteDetails = [];
  !isEmpty(selectedAccused) &&
    selectedAccused.map((s) => {
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
        getAccusedData() &&
        !isEmpty(getAccusedData()) &&
        getAccusedData().filter((item) => item._id === s._id);
      const result = {
        accusedName: accusedName,
        accusedCode:
          !isEmpty(selectedWitnessAccused) &&
          first(selectedWitnessAccused)?.accusedCode,
        accusedAddress: personAddress,
      };
      accusedCompleteDetails.push(result);
    });

  const staffMembersList = staffList && getStaffsDetails(staffList);
  const savedMedicalCertificateURL = editPoliceCustodyObj?.medicalExamination
    ?.uploadMedicalCertificate
    ? editPoliceCustodyObj?.medicalExamination?.uploadMedicalCertificate
    : "";

  const submit = async () => {
    const values = await form.validateFields();
    const uploadMedicalCertificateData = new FormData();
    uploadMedicalCertificateUrl.forEach((file) => {
      uploadMedicalCertificateData.append("file", file.originFileObj);
    });
    uploadMedicalCertificateData.append("prefixFolder", crimeId);
    uploadMedicalCertificateData.append(
      "folderPath",
      `${crimeId}/${folderName.POLICE_CUSTODY}/file`
    );

    if (!isEmpty(uploadMedicalCertificateUrl)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadMedicalCertificateData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addPoliceCustodyPayload(
              values,
              crimeId,
              getFilePayload(payloadData)
            );
            const updatePayload = updatePoliceCustodyPayload(
              values,
              crimeId,
              editPoliceCustodyObj?._id ? editPoliceCustodyObj?._id : null,
              getFilePayload(payloadData)
            );

            if (editPoliceCustodyObj?._id) {
              dispatch(
                updatePoliceCustodyDetails(config.policeCustody, updatePayload)
              );
            } else {
              dispatch(
                addPoliceCustodyDetails(config.policeCustody, addPayload)
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadMedicalCertificateUrl)) {
      const addPayload = addPoliceCustodyPayload(
        values,
        crimeId,
        savedMedicalCertificateURL
      );
      const updatePayload = updatePoliceCustodyPayload(
        values,
        crimeId,
        editPoliceCustodyObj?._id ? editPoliceCustodyObj?._id : null,
        savedMedicalCertificateURL
      );

      if (editPoliceCustodyObj?._id) {
        dispatch(
          updatePoliceCustodyDetails(config.policeCustody, updatePayload)
        );
      } else {
        dispatch(addPoliceCustodyDetails(config.policeCustody, addPayload));
      }
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onChangeDate = (date, _dateString) => {
    checkFields();
  };

  const onChangeFromtoDate = (current) => {
    checkFields();
    setDates(current);
  };

  const handleEditPoliceCustody = (value) => {
    if (value) {
      setEditPoliceCustodyObj(value);
      let accusedIdsArray = [];
      if (
        value?.accusedId &&
        isArray(value?.accusedId) &&
        value?.accusedId.length > 0
      ) {
        value?.accusedId.forEach((ele) => accusedIdsArray.push(ele?._id));
      }
      setSelectedAccused(value?.accusedId);
      const { medicalExamination } = value;
      const dateList = [];
      if (value?.fromDateToDate?.length > 0) {
        dateList.push(
          moment(new Date(value.fromDateToDate[0])).isValid()
            ? moment(new Date(value.fromDateToDate[0]))
            : ""
        );
        dateList.push(
          moment(new Date(value.fromDateToDate[1])).isValid()
            ? moment(new Date(value.fromDateToDate[1]))
            : ""
        );
      }
      setIsInjured(medicalExamination?.isInjured);

      const uploadMedicalCertificate =
        medicalExamination?.uploadMedicalCertificate;

      if (uploadMedicalCertificate && uploadMedicalCertificate?.name !== "") {
        setSelectedUploadMedicalCertificateUrl([
          {
            url: uploadMedicalCertificate?.url,
            name: uploadMedicalCertificate?.name,
            fileId: uploadMedicalCertificate?.fileId,
          },
        ]);
      } else {
        setSelectedUploadMedicalCertificateUrl([]);
      }
      form.setFieldsValue({
        accusedId: accusedIdsArray,
        reasonForCustody: value.reasonForCustody,
        requistionDate: moment(new Date(value?.requistionDate)).isValid()
          ? moment(new Date(value?.requistionDate))
          : "",
        numberOfDays: value?.numberOfDays,
        numberOfDaysPoliceCustodyGranted:
          value?.numberOfDaysPoliceCustodyGranted,
        orderNumber: value?.orderNumber,
        fromDateToDate: dateList,
        escortTeamWhileBringing: value?.escortTeamWhileBringing,
        escortTeamWhileSending: value?.escortTeamWhileSending,
        hospitalName: medicalExamination?.hospitalName,
        otherHospitalName: medicalExamination?.otherHospitalName,
        hospitalLocation: medicalExamination?.hospitalLocation,
        isInjured: medicalExamination?.isInjured,
        descriptionOfInjuries: medicalExamination?.descriptionOfInjuries,
        dateOfReproduction:
          value?.dateOfReproduction &&
          moment(new Date(value?.dateOfReproduction)).isValid()
            ? moment(new Date(value?.dateOfReproduction))
            : "",
      });
    }
  };

  const displayRequisitionProcess = (name) => {
    switch (name) {
      case "reasonForCustody":
        return renderFieldsWithMultipleDropDown(
          policeCustodyReasonsList,
          null,
          handleSearch,
          serchText,
          250,
          viewPoliceCustodyDetails || disableForm
        );
      case "requistionDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={onChangeDate}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewPoliceCustodyDetails || disableForm}
          />
        );
      case "numberOfDays":
        return (
          <Input
            onChange={(e) => numberOfDaysGrantedValidation(e.target.value)}
            type="number"
            maxLength={10}
            style={{ width: 120 }}
            disabled={viewPoliceCustodyDetails || disableForm}
          />
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPoliceCustodyDetails || disableForm}
          />
        );
    }
  };

  function numberOfDaysGrantedValidation() {
    if (editPoliceCustodyObj?._id) {
      if (
        form.getFieldValue()?.numberOfDaysPoliceCustodyGranted >
        parseInt(form.getFieldValue()?.numberOfDays)
      ) {
        setInvalidGrantDays(true);
        setFormValid(false);
      } else {
        setInvalidGrantDays(false);
        setFormValid(true);
      }
    }
  }

  const disabledDate = (current) => {
    if (current.valueOf() <= form.getFieldValue()?.requistionDate) {
      return true;
    }

    if (!dates || dates.length === 0) {
      return false;
    }
    if (form.getFieldValue()?.numberOfDaysPoliceCustodyGranted) {
      const tooLate =
        dates[0] &&
        current.diff(dates[0], "days") >=
          form.getFieldValue()?.numberOfDaysPoliceCustodyGranted;
      const tooEarly =
        dates[1] &&
        dates[1].diff(current, "days") >=
          form.getFieldValue()?.numberOfDaysPoliceCustodyGranted;
      return tooEarly || tooLate;
    }
  };

  const displayRequisitionGrantProcess = (name) => {
    switch (name) {
      case "numberOfDaysPoliceCustodyGranted":
        return (
          <Input
            onChange={(e) => numberOfDaysGrantedValidation(e.target.value)}
            type="number"
            maxLength={10}
            style={{ width: 120 }}
            disabled={viewPoliceCustodyDetails || disableForm}
          />
        );
      case "orderNumber":
        return (
          <Input
            onChange={checkFields}
            type="number"
            maxLength={10}
            style={{ width: 120 }}
            disabled={viewPoliceCustodyDetails || disableForm}
          />
        );
      case "fromDateToDate":
        return (
          <RangePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            disabled={viewPoliceCustodyDetails || disableForm}
            disabledDate={disabledDate}
            onCalendarChange={onChangeFromtoDate}
          />
        );
      case "escortTeamWhileBringing":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          checkFields,
          handleSearch,
          serchText,
          200,
          viewPoliceCustodyDetails || disableForm
        );
      case "escortTeamWhileSending":
        return renderFieldsWithMultipleDropDown(
          staffMembersList,
          checkFields,
          handleSearch,
          serchText,
          200,
          viewPoliceCustodyDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPoliceCustodyDetails || disableForm}
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
    editPoliceCustodyObj,
    selectedFileName,
    selectedFir,
    currentUser,
    accusedCompleteDetails,
    savedFir
  );

  const getSavedData = () => {
    let savedData = [];
    isArray(policeCustodyList) &&
      !isEmpty(policeCustodyList) &&
      // eslint-disable-next-line array-callback-return
      policeCustodyList.map((data) => {
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

  const getNonsavedAccused = () => {
    let result = getAccusedData();
    getSavedData() &&
      isArray(getSavedData()) &&
      getSavedData().length > 0 &&
      getSavedData().forEach((crele) => {
        crele?.selectedRecord?.accusedId?.length > 0 &&
          crele?.selectedRecord?.accusedId.forEach((wit) => {
            remove(result, { _id: wit._id });
          });
      });
    return result;
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Police Custody"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewPoliceCustodyDetails || disableForm}
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
                      label="Select Accused (Multiple)"
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
                          viewPoliceCustodyDetails ||
                          editPoliceCustodyObj?._id ||
                          disableForm
                        }
                      >
                        {(editPoliceCustodyObj
                          ? getAccusedData()
                          : getNonsavedAccused()
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
                  <Row className="custody-reasons-row">
                    {requisitionProcess.map((s, i) => {
                      return (
                        <Col className="custody-col" key={i}>
                          <Form.Item name={s.name} label={s.label}>
                            {displayRequisitionProcess(s.name)}
                          </Form.Item>
                        </Col>
                      );
                    })}
                    {InvalidGrantDays && (
                      <label
                        style={{
                          color: "red",
                          paddingLeft: 30,
                          paddingTop: 20,
                        }}
                      >
                        must be higher than the no. of custody granted
                      </label>
                    )}
                  </Row>
                </Card>
                {editPoliceCustodyObj?._id &&
                  (editPoliceCustodyObj?.reasonForCustody ||
                    editPoliceCustodyObj?.requistionDate ||
                    editPoliceCustodyObj?.numberOfDays) && (
                    <Card className="card-style">
                      <Row className="custody-reasons-row">
                        {requisitionGrantProcess.map((s, i) => {
                          return (
                            <Col className="custody-col" key={i}>
                              <Form.Item name={s.name} label={s.label}>
                                {displayRequisitionGrantProcess(s.name)}
                              </Form.Item>
                            </Col>
                          );
                        })}
                      </Row>
                    </Card>
                  )}
                {editPoliceCustodyObj?._id &&
                  (editPoliceCustodyObj?.numberOfDaysPoliceCustodyGranted ||
                    editPoliceCustodyObj?.orderNumber ||
                    editPoliceCustodyObj?.fromDateToDate?.length > 0 ||
                    editPoliceCustodyObj?.escortTeamWhileBringing?.length > 0 ||
                    editPoliceCustodyObj?.escortTeamWhileSending?.length >
                      0) && (
                    <>
                      <Card className="card-style">
                        <MedicalExamination
                          checkFields={checkFields}
                          disabled={viewPoliceCustodyDetails || disableForm}
                          setIsInjured={setIsInjured}
                          isInjured={isInjured}
                          form={form}
                          selectedRecord={editPoliceCustodyObj}
                          fileList={
                            editPoliceCustodyObj?._id &&
                            savedMedicalCertificateURL &&
                            savedMedicalCertificateURL?.url !== ""
                              ? selectedUploadMedicalCertificateUrl
                              : uploadMedicalCertificateUrl
                          }
                          actionName={setUploadMedicalCertificateUrl}
                          disableUpload={
                            viewPoliceCustodyDetails ||
                            !isEmpty(uploadMedicalCertificateUrl) ||
                            disableForm
                          }
                        />
                      </Card>
                      <Card className="card-style">
                        <Row className="custody-reasons-row">
                          <Col className="custody-col">
                            <Form.Item
                              name="dateOfReproduction"
                              label="Date of Reproduction"
                            >
                              <DatePicker
                                onChange={checkFields}
                                placeholder="Select Date"
                                style={{ width: 250 }}
                                disabled={
                                  viewPoliceCustodyDetails || disableForm
                                }
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    </>
                  )}
              </Col>
            </Form>
          </Card>
          <Card
            style={{ width: "30%" }}
            className="right-section cardRightStyle"
          >
            <DisplayReportGenerations
              templateLists={policeCustodyArrestProces}
              showModal={showModal}
              disabled={
                viewPoliceCustodyDetails ||
                !editPoliceCustodyObj?._id ||
                disableForm
              }
              selectedRecord={editPoliceCustodyObj}
              selectedModule="policeCustody"
              accusedId={editPoliceCustodyObj?.accusedId?._id}
            />
            {!isEmpty(policeCustodyList) ? (
              <Button
                style={{ marginTop: "40px", width: "90%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {policeCustodyList && policeCustodyList.length > 0
                  ? policeCustodyList.length
                  : 0}{" "}
                Police Custody Records
              </Button>
            ) : null}

            <Modal
              title="Police Custody Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditPoliceCustody}
                  setViewDetails={setViewPoliceCustodyDetails}
                  selectedRecord={editPoliceCustodyObj}
                  isMedia={false}
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
