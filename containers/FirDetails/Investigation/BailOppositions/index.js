/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
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
  Select,
  DatePicker,
  Radio,
  Upload,
  Button,
  Checkbox,
  notification,
  Modal,
} from "antd";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import { getFileById } from "@containers/media-util";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getAccuseds,
  getSavedDataResult,
  onFileChange,
  folderName,
  getMediaUploadError,
  dummyRequest,
  getDaysOfWeeks,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import bailOppositionsActions from "@redux/investigations/bailOppositions/actions";
import {
  addBailOppositionsPayload,
  updateBailOppositionsPayload,
} from "./bailOppositionsPayloads";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import { isArray, first, isEmpty, isUndefined, isNull } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "@containers/FirDetails/Investigation/CommonDetails/SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import TemplatesModal from "../CommonForms/TemplatesModal";
import { ModuleWrapper } from "../CommonDetails/styles";
import AccusedCard from "../CommonForms/AccusedCard";
import {
  bailOppositionsTemplates,
  bailOppositionsForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import ContentHeader from "../../ContentHeader";

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default function BailOppositions({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const currentUser = loadState("currentUser");
  const selectedFir = loadState("selectedFir");
  const crimeId = loadState("selectedFirId");
  const [formValid, setFormValid] = useState(false);
  const [grantedState, setGrantedState] = useState("Bail Granted");
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [viewBailOppositionsDetails, setViewBailOppositionsDetails] =
    useState(false);
  const [editBailOppositionsObj, setEditBailOppositionsObj] = useState(null);
  const [serchText, setSerchText] = useState("");
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [isArgumentsFiled, setIsArgumentsFiled] = useState(false);
  const { getAccusedList } = suspectAccusedAction;
  const [addAnother, setAddAnother] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadDocURL, setUploadDocURL] = useState([]);
  const [selectedUploadDocURL, setSelectedUploadDocURL] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const { createAuditHistory } = auditHistoryActions;
  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const { getCourtsBasedonPsCode } = masterDataActions;

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    bailOppositionsList,
    successMessage,
  } = useSelector((state) => state.BailOppositions);

  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);

  const isSuccess =
    actionType === "ADD_BAIL_OPPOSITIONS_SUCCESS" ||
    actionType === "UPDATE_BAIL_OPPOSITIONS_SUCCESS";

  const isError =
    actionType === "ADD_BAIL_OPPOSITIONS_ERROR" ||
    actionType === "UPDATE_BAIL_OPPOSITIONS_ERROR";

  const {
    addBailOppositionsDetails,
    updateBailOppositionsDetails,
    getBailOppositionsList,
    resetActionType,
  } = bailOppositionsActions;

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_BAIL_OPPOSITIONS_SUCCESS"
        ? "Bail Oppositions Created"
        : "Bail Oppositions Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/bailOppositions",
          auditType
        )
      )
    );
  };

  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

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
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Bail Oppositions Successfully Added" ||
        successMessage === "Bail Oppositions Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewBailOppositionsDetails(false);
          setEditBailOppositionsObj(null);
          dispatch(
            getBailOppositionsList(
              `${config.bailOppositions}?crimeId=${crimeId}`
            )
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
      getBailOppositionsList(`${config.bailOppositions}?crimeId=${crimeId}`)
    );
  }, []);

  useEffect(() => {
    fetchAccusedList();
  }, []);

  const getAccusedDropdownData = () => getAccuseds(suspectAccusedList);
  const accusedPersonalDetails = first(
    getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
  );

  const savedUploadDocURL = editBailOppositionsObj?.uploadDocURL
    ? editBailOppositionsObj?.uploadDocURL
    : "";

  const submit = async () => {
    const values = await form.validateFields();
    const uploadDocURLData = new FormData();
    uploadDocURL.forEach((file) => {
      uploadDocURLData.append("file", file.originFileObj);
    });
    uploadDocURLData.append("prefixFolder", crimeId);
    uploadDocURLData.append(
      "folderPath",
      `${crimeId}/${folderName.BAIL_OPPOSITIONS}/file`
    );
    if (!isEmpty(uploadDocURL)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadDocURLData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addBailOppositionsPayload(
              values,
              crimeId,
              grantedState,
              getFilePayload(payloadData)
            );
            const updatePayload = updateBailOppositionsPayload(
              values,
              crimeId,
              editBailOppositionsObj?._id ? editBailOppositionsObj?._id : null,
              grantedState,
              getFilePayload(payloadData)
            );
            if (editBailOppositionsObj?._id) {
              dispatch(
                updateBailOppositionsDetails(
                  config.bailOppositions,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addBailOppositionsDetails(config.bailOppositions, addPayload)
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadDocURL)) {
      const addPayload = addBailOppositionsPayload(
        values,
        crimeId,
        grantedState,
        savedUploadDocURL
      );
      const updatePayload = updateBailOppositionsPayload(
        values,
        crimeId,
        editBailOppositionsObj?._id ? editBailOppositionsObj?._id : null,
        grantedState,
        savedUploadDocURL
      );

      if (editBailOppositionsObj?._id) {
        dispatch(
          updateBailOppositionsDetails(config.bailOppositions, updatePayload)
        );
      } else {
        dispatch(addBailOppositionsDetails(config.bailOppositions, addPayload));
      }
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const renderFieldsWithMultipleDropDown = (
    menuOptions,
    handleSearch,
    serchText,
    width = "",
    disabled = false
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        mode="multiple"
        showArrow
        onSearch={handleSearch}
        filterOption={(input, option) =>
          serchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 150 }}
        disabled={disabled || disableForm}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const handleEditBailOppositions = (value) => {
    if (value) {
      setEditBailOppositionsObj(value);
      setSelectedAccusedValue(value?.accusedId._id);
      setGrantedState(
        value.bailGranted ? "Bail Granted" : "Bail Plea Dismissed"
      );
      setToAppearBeforeIo(value.toAppearBeforeIo);
      setIsArgumentsFiled(value.writtenArgumentsFiled);
      const selectPeriodArray = [];
      if (value?.selectPeriod?.length > 0) {
        selectPeriodArray.push(
          moment(new Date(value.selectPeriod[0])).isValid()
            ? moment(new Date(value.selectPeriod[0]))
            : ""
        );
        selectPeriodArray.push(
          moment(new Date(value.selectPeriod[1])).isValid()
            ? moment(new Date(value.selectPeriod[1]))
            : ""
        );
      }
      const uploadDocURL = value?.uploadDocURL;
      if (uploadDocURL && uploadDocURL?.name !== "") {
        setSelectedUploadDocURL([
          {
            url: uploadDocURL?.url,
            name: uploadDocURL?.name,
            fileId: uploadDocURL?.fileId,
          },
        ]);
      } else {
        setSelectedUploadDocURL([]);
      }

      form.setFieldsValue({
        accusedId: value.accusedId?._id,
        dateOfFiling: moment(new Date(value?.dateOfFiling)).isValid()
          ? moment(new Date(value?.dateOfFiling))
          : "",
        courtName: value.courtName,
        dateOfOpposed: moment(new Date(value?.dateOfOpposed)).isValid()
          ? moment(new Date(value?.dateOfOpposed))
          : "",
        argumentsHeldBy: value.argumentsHeldBy,
        writtenArgumentsFiled: value.writtenArgumentsFiled,
        bailGranted: value.bailGranted ? "Bail Granted" : "Bail Plea Dismissed",
        conditionsImposed: value.conditionsImposed,
        toAppearBeforeIo: value.toAppearBeforeIo,
        selectDaysOfWeek: value.selectDaysOfWeek,
        selectPeriod: selectPeriodArray,
        cooperateWithIo: value.cooperateWithIo,
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
    }
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayBailOppositionsFields = (name) => {
    switch (name) {
      case "dateOfFiling":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 180 }}
            disabledDate={disableFutureDates}
            disabled={viewBailOppositionsDetails || disableForm}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          handleSearch,
          serchText,
          200,
          viewBailOppositionsDetails || disableForm
        );
      case "dateOfOpposed":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewBailOppositionsDetails || disableForm}
          />
        );
      case "argumentsHeldBy":
        return renderFieldsWithDropDown(
          [{ label: "APP" }, { label: "PP" }],
          null,
          handleSearch,
          serchText,
          200,
          viewBailOppositionsDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewBailOppositionsDetails || disableForm}
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
    editBailOppositionsObj,
    selectedFileName,
    selectedFir,
    currentUser
  );

  function onChange(e) {
    checkFields();
    setToAppearBeforeIo(e.target.checked);
  }

  const onArgumentsFiled = (e) => {
    checkFields();
    setIsArgumentsFiled(e.target.checked);
  };

  const checkGrantedValue = (e) => {
    setGrantedState(e.target.value);
    checkFields();
  };

  const displayBailOppositionsState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col key={i} span={8} style={{ marginBottom: 5 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(bailOppositionsList) &&
      !isEmpty(bailOppositionsList) &&
      // eslint-disable-next-line array-callback-return
      bailOppositionsList.map((data) => {
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Bail Oppositions"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewBailOppositionsDetails || disableForm}
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
                      <Select
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
                        onSelect={(item) => {
                          setSelectedAccusedValue(item);
                          checkFields();
                        }}
                        disabled={
                          viewBailOppositionsDetails ||
                          editBailOppositionsObj?._id ||
                          disableForm
                        }
                      >
                        {!isEmpty(getAccusedDropdownData()) &&
                          getAccusedDropdownData().map((item, index) => (
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
                    {selectedAccusedValue !== "" && (
                      <AccusedCard
                        accusedPersonalDetails={accusedPersonalDetails}
                        title="Accused Details"
                      />
                    )}
                  </Col>
                </Row>
                <Card className="card-style">
                  {displayBailOppositionsState(
                    bailOppositionsForm,
                    displayBailOppositionsFields
                  )}
                </Card>
                <Card className="card-style">
                  <Row>
                    <Col className="custody-col">
                      <Form.Item
                        name="writtenArgumentsFiled"
                        valuePropName="checked"
                      >
                        <Checkbox
                          disabled={viewBailOppositionsDetails || disableForm}
                          onChange={onArgumentsFiled}
                        >
                          Whether written arguments Filed?
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    {isArgumentsFiled ? (
                      <Col className="custody-col file-upload">
                        <Form.Item name="uploadDocURL">
                          <Upload
                            fileList={
                              editBailOppositionsObj?._id &&
                              savedUploadDocURL?.name !== ""
                                ? selectedUploadDocURL
                                : uploadDocURL
                            }
                            onPreview={handleDownload}
                            customRequest={dummyRequest}
                            onChange={(info) =>
                              onFileChange(info, setUploadDocURL)
                            }
                            multiple={false}
                          >
                            <Button
                              className="saveButton"
                              style={{ marginTop: 0, width: 115 }}
                              icon={<CameraFilled />}
                              disabled={
                                viewBailOppositionsDetails ||
                                !isEmpty(uploadDocURL) ||
                                disableForm
                              }
                            >
                              Upload
                            </Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    ) : null}
                  </Row>
                  <Row>
                    <Col>
                      <div>Court Orders</div>
                      <Form.Item name="bailGranted">
                        <Radio.Group
                          name="radiogroup"
                          onChange={checkGrantedValue}
                          defaultValue={grantedState}
                          disabled={viewBailOppositionsDetails || disableForm}
                        >
                          <Radio value="Bail Granted">Bail Granted</Radio>
                          <Radio value="Bail Plea Dismissed">
                            Bail Plea Dismissed
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  {grantedState === "Bail Granted" ? (
                    <Row className="text-area-row" style={{ marginTop: 10 }}>
                      <Col className="custody-col text-area">
                        <Form.Item
                          name="conditionsImposed"
                          label="Conditions Imposed"
                        >
                          <Input.TextArea
                            onChange={checkFields}
                            style={{ width: 700 }}
                            autoSize={{ minRows: 4, maxRows: 5 }}
                            rows={5}
                            disabled={viewBailOppositionsDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                      <Col className="custody-col">
                        <div className="checkboxcontent">
                          <Form.Item
                            name="toAppearBeforeIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              onChange={onChange}
                              disabled={
                                viewBailOppositionsDetails || disableForm
                              }
                            >
                              To appear before IO
                            </Checkbox>
                          </Form.Item>
                          <Form.Item
                            name="cooperateWithIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={
                                viewBailOppositionsDetails || disableForm
                              }
                            >
                              Co-operate with IO
                            </Checkbox>
                          </Form.Item>
                        </div>
                        {toAppearBeforeIo ||
                        form.getFieldValue()?.toAppearBeforeIo ? (
                          <>
                            <Form.Item
                              name="selectDaysOfWeek"
                              label="Select Days Of Week"
                              style={{ paddingLeft: 20, paddingTop: 20 }}
                            >
                              {renderFieldsWithMultipleDropDown(
                                getDaysOfWeeks,
                                handleSearch,
                                serchText,
                                200,
                                viewBailOppositionsDetails || disableForm
                              )}
                            </Form.Item>
                            <Form.Item
                              name="selectPeriod"
                              label="Select Period"
                              style={{ paddingLeft: 20 }}
                            >
                              <RangePicker
                                format={DATE_FORMAT}
                                style={{ width: 220 }}
                                disabled={
                                  viewBailOppositionsDetails || disableForm
                                }
                              />
                            </Form.Item>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  ) : null}
                  <Row style={{ marginTop: 20 }}>
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
                          disabled={viewBailOppositionsDetails || disableForm}
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
              templateLists={bailOppositionsTemplates}
              showModal={showModal}
              disabled={
                viewBailOppositionsDetails ||
                !editBailOppositionsObj?._id ||
                disableForm
              }
              selectedRecord={editBailOppositionsObj}
              selectedModule="bailOppositions"
              accusedId={editBailOppositionsObj?.accusedId?._id}
            />
            {!isEmpty(bailOppositionsList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {bailOppositionsList && bailOppositionsList.length > 0
                  ? bailOppositionsList.length
                  : 0}{" "}
                Bail Oppositions Records
              </Button>
            ) : null}
            <Modal
              title="Bail Oppositions Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditBailOppositions}
                  setViewDetails={setViewBailOppositionsDetails}
                  selectedRecord={editBailOppositionsObj}
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
