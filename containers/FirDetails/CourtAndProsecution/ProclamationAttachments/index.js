/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import {
  Row,
  Card,
  Col,
  Form,
  DatePicker,
  Select,
  Button,
  Upload,
  notification,
  Modal,
} from "antd";
import {
  IS_SHO,
  IS_IO,
  DATE_FORMAT,
  getAccuseds,
  dummyRequest,
  onFileChange,
  getMediaPayloadWithoutCategory,
  getMediaUploadError,
  renderFieldsWithDropDown,
  getPersonDetails,
  IS_INVESTIGATION_OFFICER
} from "@containers/FirDetails/fir-util";
import moment from "moment";
import axios from "axios";
import { isEmpty, first, isArray } from "lodash";
import Loader from "@components/utility/loader";
import { getFileById } from "@containers/media-util";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { useDispatch, useSelector } from "react-redux";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import ContentHeader from "@containers/FirDetails/ContentHeader";
import { CaretDownOutlined, CameraFilled } from "@ant-design/icons";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import ProclamationAndPropertyAttachmentsAction from "@redux/CourtAndProsecution/ProclamationAndPropertyAttachments/actions.js";
import {
  addProclamationAttachmentsPayload,
  updateProclamationAttachmentsPayload,
} from "./payload";
import SavedRecords from "./SavedRecords";
import { typeOfProperty } from "../const";
import PropertyAttachments from "../PropertyAttachments";
import PublishingProclamation from "../PublishingProclamation";
import { CourtAndProsecutionWrapper } from "../styles";
import { disposalForm } from "../../../../components/Common/formOptions";

const Option = Select.Option;

export default function ProclamationAttachments({
  setSelectedSiderMenu,
  formData,
  onCancel,
  isCourtCaseDiary = false,
  formDisable,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const selectedCourtAndProsecution = loadState("selectedCourtAndProsecution");
  const { savedFir } = useSelector((state) => state.createFIR);
  const [serchText, setSerchText] = useState("");
  const [uploadProclamation, setUploadProclamation] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [viewClicked, setViewClicked] = useState(false);
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [editProclamationAttachments, setEditProclamationAttachments] =
    useState({});
  const [selectedPerson, setSelectedPerson] = useState({});
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const { getAccusedList } = suspectAccusedAction;
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const filterAccusedList = suspectAccusedList?.filter(
    (item) => !item?.isDied && !item?.isArrestByPolice && item?.isNoticeToSurety
  );
  const currentUser = loadState("currentUser");
  const userRole = [IS_SHO, IS_IO, IS_INVESTIGATION_OFFICER];
  const IS_HIGHER_SHO_USER = !userRole?.includes(currentUser?.ecopsv2_role)

  const disableForm =
    (IS_HIGHER_SHO_USER &&
      currentUser?.isPersnolized === false &&
      currentUser?.isIo === false) ||
    savedFir?.caseStatus === "Disposal" ||
    formDisable || selectedCourtAndProsecution.isCourtDisposal;
  const filterChargeSheetAccusedData = [];
  filterAccusedList.forEach((item) => {
    if (
      selectedCourtAndProsecution?.data?.accusedParticulars.some(
        (data) =>
          data?.accusedPersonId?._id === item?.person?._id &&
          data?.chargeStatus === "Charged"
      ) === true
    ) {
      filterChargeSheetAccusedData.push(item);
    }
  });

  const getAccusedDropdownData = () =>
    getAccuseds(filterChargeSheetAccusedData);
  const accusedPersonalDetails = first(
    getAccusedDropdownData().filter((s) => s._id === selectedAccusedValue)
  );

  const {
    addProclamationAndPropertyAttachments,
    updateProclamationAndPropertyAttachments,
    getProclamationAndPropertyAttachmentsList,
    resetActionType,
  } = ProclamationAndPropertyAttachmentsAction;

  const {
    actionType,
    errorMessage,
    successMessage,
    proclamationAndPropertyAttachmentsList,
    isFetching,
  } = useSelector((state) => state.ProclamationAndPropertyAttachments);

  const isSuccess =
    actionType === "ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS" ||
    actionType === "UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_SUCCESS";

  const isError =
    actionType === "ADD_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR" ||
    actionType === "UPDATE_PROCLAMATION_AND_PROPERTY_ATTACHMENTS_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    dispatch(
      getProclamationAndPropertyAttachmentsList(
        `${config.getProclamation}?crimeId=${crimeId}&updateChargesheetId=${selectedCourtAndProsecution?.updateChargesheetId}`
      )
    );
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage) {
        openNotificationWithIcon("success", successMessage);
        form.resetFields();
        isCourtCaseDiary
          ? onCancel()
          : setSelectedSiderMenu("courtandprosecution");
        dispatch(
          getAccusedList(
            `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
          )
        );
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (!!formData === true && Object.keys(formData)?.length !== 0) {
      const values = proclamationAndPropertyAttachmentsList?.find(
        (item) => item?.accusedId?._id === formData?.person
      );
      if (!!values) {
        if (values?.proclamation?.uploadProclamation?.length !== 0) {
          setUploadProclamation(values?.proclamation?.uploadProclamation);
        } else {
          setUploadProclamation([]);
        }
        setEditProclamationAttachments(values);
        form.setFieldsValue({
          accusedId: values?.accusedId?._id,
          dateOfIssueOf82CRPCProceedings: !!values?.proclamation
            ?.dateOfIssueOf82CRPCProceedings
            ? moment(
              new Date(values?.proclamation?.dateOfIssueOf82CRPCProceedings)
            )
            : "",
          typesOfPropertyToAttached:
            values?.proclamation?.typesOfPropertyToAttached,
          uploadProclamation: values?.proclamation?.uploadProclamation,
        });
      } else {
        form.setFieldsValue({
          accusedId: formData?.person,
        });
      }
    }
  }, [formData, proclamationAndPropertyAttachmentsList]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const submit = async () => {
    const values = await form.validateFields();
    const proclamationFileList = values?.uploadProclamation?.fileList;
    const reportFileList = values?.reportOfAttachement?.fileList;
    const uploadProclamationData =
      editProclamationAttachments?.proclamation?.uploadProclamation;
    const propertyMediaReport =
      editProclamationAttachments?.propertyAttachment?.mediaReport;
    const reportOfAttachement = isArray(reportFileList) ? reportFileList : [];
    const uploadProclamation = isArray(proclamationFileList)
      ? proclamationFileList
      : [];
    const uploadreportOfAttachement = new FormData();
    reportOfAttachement.forEach((file) => {
      uploadreportOfAttachement.append("file", file.originFileObj);
    });
    uploadreportOfAttachement.append("prefixFolder", crimeId);
    uploadreportOfAttachement.append(
      "folderPath",
      `${crimeId}/${"courtCommittal"}/file`
    );
    const urlFormData = new FormData();
    uploadProclamation.forEach((file) => {
      urlFormData.append("file", file.originFileObj);
    });
    urlFormData.append("prefixFolder", crimeId);
    urlFormData.append("folderPath", `${crimeId}/${"courtCommittal"}/file`);
    if (
      !!proclamationFileList &&
      !isEmpty(!!proclamationFileList ? proclamationFileList : []) &&
      !!reportFileList &&
      !isEmpty(!!reportFileList ? reportFileList : [])
    ) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, uploadreportOfAttachement),
          axios.post(`${config.fileUpload}/upload`, urlFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              const payloadData = data1.data?.data;
              const payloadData1 = data2.data?.data;
              const addPayload = addProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                getMediaPayloadWithoutCategory(payloadData1),
                checkedList,
                getMediaPayloadWithoutCategory(payloadData),
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              const updatePayload = updateProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                getMediaPayloadWithoutCategory(payloadData1),
                checkedList,
                getMediaPayloadWithoutCategory(payloadData),
                editProclamationAttachments?._id,
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              if (editProclamationAttachments?._id) {
                dispatch(
                  updateProclamationAndPropertyAttachments(
                    `${config.updateProclamation}?crimeId=${crimeId}`,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addProclamationAndPropertyAttachments(
                    `${config.createProclamation}?crimeId=${crimeId}`,
                    addPayload
                  )
                );
              }
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (
      isEmpty(!!proclamationFileList ? proclamationFileList : []) ||
      isEmpty(!!reportFileList ? reportFileList : [])
    ) {
      if (
        isEmpty(!!proclamationFileList ? proclamationFileList : []) &&
        !isEmpty(!!reportFileList ? reportFileList : [])
      ) {
        axios
          .post(`${config.fileUpload}/upload`, uploadreportOfAttachement)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              const payloadData1 = data;
              const addPayload = addProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                getMediaPayloadWithoutCategory(payloadData1),

                checkedList,
                !!uploadProclamationData && uploadProclamationData?.length !== 0
                  ? uploadProclamationData
                  : [],
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              const updatePayload = updateProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                getMediaPayloadWithoutCategory(payloadData1),

                checkedList,
                !!uploadProclamationData && uploadProclamationData?.length !== 0
                  ? uploadProclamationData
                  : [],
                editProclamationAttachments?._id,
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              if (editProclamationAttachments?._id) {
                dispatch(
                  updateProclamationAndPropertyAttachments(
                    `${config.updateProclamation}?crimeId=${crimeId}`,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addProclamationAndPropertyAttachments(
                    `${config.createProclamation}?crimeId=${crimeId}`,
                    addPayload
                  )
                );
              }
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
          });
      } else if (
        !isEmpty(!!proclamationFileList ? proclamationFileList : []) &&
        isEmpty(!!reportFileList ? reportFileList : [])
      ) {
        axios
          .post(`${config.fileUpload}/upload`, urlFormData)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              const payloadData = data;
              const addPayload = addProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                !!propertyMediaReport && propertyMediaReport?.length !== 0
                  ? propertyMediaReport
                  : [],
                checkedList,
                getMediaPayloadWithoutCategory(payloadData),
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              const updatePayload = updateProclamationAttachmentsPayload(
                values,
                crimeId,
                selectedCourtAndProsecution?.updateChargesheetId,
                selectedCourtAndProsecution?._id,
                !!propertyMediaReport && propertyMediaReport?.length !== 0
                  ? propertyMediaReport
                  : [],
                checkedList,
                getMediaPayloadWithoutCategory(payloadData),
                editProclamationAttachments?._id,
                Object.keys(selectedPerson)?.length !== 0
                  ? getPersonDetails(selectedPerson, inputList)
                  : {}
              );
              if (editProclamationAttachments?._id) {
                dispatch(
                  updateProclamationAndPropertyAttachments(
                    `${config.updateProclamation}?crimeId=${crimeId}`,
                    updatePayload
                  )
                );
              } else {
                dispatch(
                  addProclamationAndPropertyAttachments(
                    `${config.createProclamation}?crimeId=${crimeId}`,
                    addPayload
                  )
                );
              }
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
          });
      } else {
        const addPayload = addProclamationAttachmentsPayload(
          values,
          crimeId,
          selectedCourtAndProsecution?.updateChargesheetId,
          selectedCourtAndProsecution?._id,
          !!propertyMediaReport && propertyMediaReport?.length !== 0
            ? propertyMediaReport
            : [],
          checkedList,
          !!uploadProclamationData && uploadProclamationData?.length !== 0
            ? uploadProclamationData
            : [],
          Object.keys(selectedPerson)?.length !== 0
            ? getPersonDetails(selectedPerson, inputList)
            : {}
        );
        const updatePayload = updateProclamationAttachmentsPayload(
          values,
          crimeId,
          selectedCourtAndProsecution?.updateChargesheetId,
          selectedCourtAndProsecution?._id,
          !!propertyMediaReport && propertyMediaReport?.length !== 0
            ? propertyMediaReport
            : [],
          checkedList,
          !!uploadProclamationData && uploadProclamationData?.length !== 0
            ? uploadProclamationData
            : [],
          editProclamationAttachments?._id,
          Object.keys(selectedPerson)?.length !== 0
            ? getPersonDetails(selectedPerson, inputList)
            : {}
        );
        if (editProclamationAttachments?._id) {
          dispatch(
            updateProclamationAndPropertyAttachments(
              `${config.updateProclamation}`,
              updatePayload
            )
          );
        } else {
          dispatch(
            addProclamationAndPropertyAttachments(
              `${config.createProclamation}`,
              addPayload
            )
          );
        }
      }
    }
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const handleSelect = (values) => {
    if (values.includes("all")) {
      if (values.length === getAccusedDropdownData().length + 1) {
        setSelectedAccusedValue([]);
        form.setFieldsValue({ person: [] });
      } else {
        let accusedValue = [];
        getAccusedDropdownData().map((item) => {
          return accusedValue?.push(!!item._id ? item._id : item?.paoCode);
        });
        setSelectedAccusedValue(accusedValue);
        form.setFieldsValue({ accusedId: accusedValue });
      }
    } else {
      setSelectedAccusedValue(values);
      form.setFieldsValue({ accusedId: values });
    }
    checkFields();
  };

  const setSelectedData = (values) => {
    if (values?.proclamation?.uploadProclamation?.length !== 0) {
      setUploadProclamation(values?.proclamation?.uploadProclamation);
    } else {
      setUploadProclamation([]);
    }
    setEditProclamationAttachments(values);
    form.setFieldsValue({
      accusedId: values?.accusedId?._id,
      dateOfIssueOf82CRPCProceedings: !!values?.proclamation
        ?.dateOfIssueOf82CRPCProceedings
        ? moment(new Date(values?.proclamation?.dateOfIssueOf82CRPCProceedings))
        : "",
      typesOfPropertyToAttached:
        values?.proclamation?.typesOfPropertyToAttached,
      uploadProclamation: values?.proclamation?.uploadProclamation,
    });
  };
  return (
    <ModuleWrapper>
      <CourtAndProsecutionWrapper>
        <ContentHeader
          headerTitle="Proclamation And Property Attachments"
          onSubmitClick={submit}
          isInvestigation={true}
          onCancel={() =>
            isCourtCaseDiary
              ? onCancel()
              : setSelectedSiderMenu("courtandprosecution")
          }
          disableButton={viewClicked || disableForm}
        />
        {isFetching ? (
          <Loader />
        ) : (
          <Row>
            <Card
              style={{
                width: `${!!formData === false &&
                  Object.keys(!!formData ? formData : {})?.length === 0
                  ? "75%"
                  : "100%"
                  }`,
                padding: 10,
              }}
              className="cardLeftStyle"
            >
              <Form form={form} colon={false} layout="vertical">
                <Row gutter={24}>
                  <Col span={6}>
                    <Form.Item
                      name="accusedId"
                      label="Accused Name"
                      rules={[
                        {
                          required: true,
                          message: "Accused Name is required!",
                        },
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
                        onChange={handleSelect}
                        disabled={
                          disableForm ||
                          editProclamationAttachments?._id ||
                          Object.keys(!!formData ? formData : {}).length !== 0
                        }
                        style={{ width: 190 }}
                        mode="multiple"
                      >
                        {getAccusedDropdownData()?.length > 1 ? (
                          <Option key="all" value="all" label="Select All">
                            Select All
                          </Option>
                        ) : null}
                        {getAccusedDropdownData().map((item, index) => (
                          <Option
                            key={index}
                            value={!!item._id ? item._id : item?.paoCode}
                            label={item.label}
                          >
                            {item.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={9}>
                    <Form.Item
                      name="dateOfIssueOf82CRPCProceedings"
                      label="Date of issue of 82 Cr.P.C proceedings"
                    >
                      <DatePicker
                        format={DATE_FORMAT}
                        disabled={disableForm || viewClicked}
                        placeholder="Date"
                        style={{ width: 190 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="typesOfPropertyToAttached"
                      label="Type of Property to attached"
                    >
                      {renderFieldsWithDropDown(
                        typeOfProperty,
                        null,
                        handleSearch,
                        serchText,
                        190,
                        disableForm || viewClicked,
                        "",
                        "Money/Property"
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name="uploadProclamation" label=" ">
                      <Upload
                        fileList={uploadProclamation}
                        customRequest={dummyRequest}
                        onChange={(info) =>
                          onFileChange(info, setUploadProclamation)
                        }
                        multiple={false}
                        onPreview={handleDownload}
                      >
                        <Button
                          className="saveButton"
                          style={{ width: 200, marginTop: 5 }}
                          icon={<CameraFilled style={{ float: "left" }} />}
                          disabled={disableForm || viewClicked}
                        >
                          Upload Proclamation
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                {!!editProclamationAttachments?._id &&
                  !!editProclamationAttachments?.isPublishing ? (
                  <Card
                    className="widgetPageStyle"
                    style={{ marginTop: 20, paddingLeft: 15 }}
                  >
                    <h3>Publishing Proclamation</h3>
                    <PublishingProclamation
                      form={form}
                      checkedList={checkedList}
                      setCheckedList={setCheckedList}
                      editProclamationAttachments={editProclamationAttachments}
                      viewClicked={viewClicked || disableForm}
                    />
                  </Card>
                ) : null}
                {!!editProclamationAttachments?._id &&
                  !!editProclamationAttachments?.isPropertyAttachment ? (
                  <Card
                    className="widgetPageStyle"
                    style={{ marginTop: 20, paddingLeft: 15 }}
                  >
                    <h3>Property Attachments</h3>
                    <PropertyAttachments
                      form={form}
                      editProclamationAttachments={editProclamationAttachments}
                      setSelectedPerson={setSelectedPerson}
                      setInputList={setInputList}
                      age={age}
                      viewClicked={disableForm || viewClicked}
                      setAge={setAge}
                    />
                  </Card>
                ) : null}
              </Form>
            </Card>
            {!!formData === false &&
              Object.keys(!!formData ? formData : {})?.length === 0 ? (
              <Card
                style={{ width: "25%" }}
                className="right-section cardRightStyle"
              >
                {proclamationAndPropertyAttachmentsList?.length > 0 ? (
                  <Button
                    style={{ marginTop: 40, width: "100%" }}
                    onClick={() => setIsRecordModalVisible(true)}
                  >
                    {`${proclamationAndPropertyAttachmentsList?.length} Proclamation Records`}
                  </Button>
                ) : null}
                <Modal
                  title="Proclamation & Property Attachments Records"
                  visible={isRecordsModalVisible}
                  onOk={() => setIsRecordModalVisible(false)}
                  onCancel={() => setIsRecordModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={proclamationAndPropertyAttachmentsList}
                      setSelectedData={setSelectedData}
                      setViewClicked={setViewClicked}
                      setFormValid={setFormValid}
                      setIsRecordModalVisible={setIsRecordModalVisible}
                      viewClicked={disableForm || viewClicked}
                    />
                  </div>
                </Modal>
              </Card>
            ) : null}
          </Row>
        )}
      </CourtAndProsecutionWrapper>
    </ModuleWrapper>
  );
}
