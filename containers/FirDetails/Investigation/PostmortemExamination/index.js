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
  DatePicker,
  Upload,
  Button,
  notification,
  Modal,
} from "antd";
import { CameraFilled } from "@ant-design/icons";
import {
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  getDeceased,
  masterDataType,
  getStaffsDetails,
  getPersonDetails,
  onFileChange,
  dummyRequest,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  getSavedDataResult,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import UploadForm from "@components/Common/uploadForm";
import commonActions from "@redux/investigations/commonRequest/actions";
import postmortemExaminationActions from "@redux/investigations/postmortemExamination/actions";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty, first, isArray, isNull, isUndefined } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import { loadState } from "@lib/helpers/localStorage";
import SavedRecords from "./SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import inquestActions from "@redux/investigations/inquest/actions";
import { gravityList } from "@containers/const";
import { getFileById } from "@containers/media-util";
import {
  addPostmortemExaminationPayload,
  updatePostmortemExaminationPayload,
} from "./postmortemExaminationPayloads";
import { renderDecesedDropDown } from "../../Investigation/utils";
import AddPerson from "../CommonForms/AddPerson";
import { ModuleWrapper } from "../CommonDetails/styles";
import { postmortemExaminationForm, placeOfPME, displayOfBody } from "./const";
import AddProfessional from "../CommonForms/AddProfessional";
import ContentHeader from "../../ContentHeader";
import OtherLinks from "./OtherLinks";

export default function PostmortemExamination({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [professionalForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [selectedPME, setSelectedPME] = useState("");
  const [isProfessionalModalVisible, setIsProfessionalModalVisible] =
    useState(false);
  const [pmeConductedDetails, setPmeConductedDetails] = useState({});
  const [
    viewPostmortemExaminationDetails,
    setViewPostmortemExaminationDetails,
  ] = useState(false);
  const [editPostmortemExaminationObj, setEditPostmortemExaminationObj] =
    useState(null);
  const [serchText, setSerchText] = useState("");
  const [inputList, setInputList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDeceasedValue, setSelectedDeceasedValue] = useState("");
  const [knownUnkownState, setknownUnkownState] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    "postmortemExamination"
  );
  const [pmeReportURL, setPmeReportURL] = useState([]);
  const [selectedPmeReportURL, setSelectedPmeReportURL] = useState([]);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const crimeId = loadState("selectedFirId");
  const {
    deceasedList,
    isLoading,
    actionName,
    commonSuccessMessage,
    commonErrorMessage,
  } = useSelector((state) => state.CommonRequest);
  const { getDeceasedList, addDeceasedDetails, resetDeceasedActionType } =
    commonActions;
  const { getInquestList } = inquestActions;
  const { inquestList } = useSelector((state) => state.Inquest);
  const dispatch = useDispatch();
  const [inquestFormedList, seIinquestFormedList] = useState([]);
  var mergeList =
    (deceasedList || inquestFormedList) &&
    [].concat.apply(inquestFormedList, deceasedList);
  const deceasedListDetails = !isEmpty(mergeList) && getDeceased(mergeList);
  const [addAnother, setAddAnother] = useState(false);
  const { staffList, hospitalsList } = useSelector((state) => state.MasterData);
  const { getStaffList, getHospitalsList } = masterDataActions;
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const staffMembersList = staffList && getStaffsDetails(staffList);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const {
    actionType,
    errorMessage,
    isFetching,
    postmortemExaminationList,
    successMessage,
  } = useSelector((state) => state.PostmortemExamination);

  const isDeceasedSuccess = actionName === "ADD_DECEASED_SUCCESS";
  const isDeceasedError = actionName === "ADD_DECEASED_ERROR";

  const isSuccess =
    actionType === "ADD_POSTMORTEM_EXAMINATION_SUCCESS" ||
    actionType === "UPDATE_POSTMORTEM_EXAMINATION_SUCCESS";

  const isError =
    actionType === "ADD_POSTMORTEM_EXAMINATION_ERROR" ||
    actionType === "UPDATE_POSTMORTEM_EXAMINATION_ERROR";

  const {
    addPostmortemExaminationDetails,
    updatePostmortemExaminationDetails,
    getPostmortemExaminationList,
    resetActionType,
  } = postmortemExaminationActions;

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_POSTMORTEM_EXAMINATION_SUCCESS"
        ? "Post-mortem Examination Created"
        : "Post-mortem Examination Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/postMortemExamination",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    const renameKeyInquestList = inquestList.map(
      ({ victimId: person, ...rest }) => ({
        person,
        ...rest,
      })
    );
    seIinquestFormedList(renameKeyInquestList);
  }, [inquestList]);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const fetchDeceasedList = () => {
    dispatch(
      getDeceasedList(
        `${config.getPostCrimeSceneDetails}/DECEASED/?crimeId=${crimeId}`
      )
    );
  };

  useEffect(() => {
    if (isDeceasedSuccess || isDeceasedError) {
      if (commonSuccessMessage === "Deceased Successfully Added") {
        openNotificationWithIcon("success", commonSuccessMessage);
        personForm.resetFields();
        fetchDeceasedList();
        dispatch(resetDeceasedActionType());
        setIsModalVisible(false);
      } else if (commonErrorMessage) {
        openNotificationWithIcon("error", commonErrorMessage);
        dispatch(resetDeceasedActionType());
        setIsModalVisible(false);
      }
    }
  }, [actionName]);

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Post-mortem Examination Successfully Added" ||
        successMessage === "Post-mortem Examination Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewPostmortemExaminationDetails(false);
          setEditPostmortemExaminationObj(null);
          dispatch(
            getPostmortemExaminationList(
              `${config.postmortem}?crimeId=${crimeId}`
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
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getHospitalsList(`${config.getMasterData}/${masterDataType.HOSPITALS}`)
    );
    dispatch(
      getPostmortemExaminationList(`${config.postmortem}?crimeId=${crimeId}`)
    );
    dispatch(getInquestList(`${config.inquest}?crimeId=${crimeId}`));
  }, []);

  useEffect(() => {
    fetchDeceasedList();
  }, []);

  const getAddPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return addPostmortemExaminationPayload(
      values,
      crimeId,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory),
      pmeConductedDetails,
      selectedDeceasedValue
    );
  };

  const getEditPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return updatePostmortemExaminationPayload(
      values,
      crimeId,
      editPostmortemExaminationObj?._id,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory),
      pmeConductedDetails,
      selectedDeceasedValue
    );
  };

  const submit = async () => {
    const values = await form.validateFields();
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append(
      "folderPath",
      `${crimeId}/${folderName.POSTMORTEM_EXAMINATION}/media`
    );

    const urlFormData = new FormData();
    pmeReportURL.forEach((file) => {
      urlFormData.append("file", file.originFileObj);
    });
    urlFormData.append("prefixFolder", crimeId);
    urlFormData.append(
      "folderPath",
      `${crimeId}/${folderName.POSTMORTEM_EXAMINATION}/file`
    );

    if (!isEmpty(inputFileList) && !isEmpty(pmeReportURL)) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, mediaFormData),
          axios.post(`${config.fileUpload}/upload`, urlFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              if (editPostmortemExaminationObj?._id) {
                dispatch(
                  updatePostmortemExaminationDetails(
                    config.postmortem,
                    getEditPayload(data1, data2, values)
                  )
                );
              } else {
                dispatch(
                  addPostmortemExaminationDetails(
                    config.postmortem,
                    getAddPayload(data1, data2, values)
                  )
                );
              }
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inputFileList) && !isEmpty(pmeReportURL)) {
      axios
        .post(`${config.fileUpload}/upload`, urlFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const updateMediaResult =
              !isNull(editPostmortemExaminationObj) &&
              isEmpty(editPostmortemExaminationObj?.pmeMedia)
                ? []
                : editPostmortemExaminationObj?.pmeMedia;
            const addPayload = addPostmortemExaminationPayload(
              values,
              crimeId,
              getFilePayload(payloadData),
              [],
              pmeConductedDetails,
              selectedDeceasedValue
            );
            const updatePayload = updatePostmortemExaminationPayload(
              values,
              crimeId,
              editPostmortemExaminationObj?._id,
              getFilePayload(payloadData),
              updateMediaResult,
              pmeConductedDetails,
              selectedDeceasedValue
            );

            if (editPostmortemExaminationObj?._id) {
              dispatch(
                updatePostmortemExaminationDetails(
                  config.postmortem,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addPostmortemExaminationDetails(config.postmortem, addPayload)
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(pmeReportURL) && !isEmpty(inputFileList)) {
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const mediaResult = !isNull(editPostmortemExaminationObj) && [
              ...editPostmortemExaminationObj?.pmeMedia,
              ...getMediaPayload(data, selectedCategory),
            ];
            const updateMediaResult =
              !isNull(editPostmortemExaminationObj) &&
              isEmpty(editPostmortemExaminationObj?.pmeMedia)
                ? getMediaPayload(data, selectedCategory)
                : mediaResult;
            const addPayload = addPostmortemExaminationPayload(
              values,
              crimeId,
              {},
              getMediaPayload(data, selectedCategory),
              pmeConductedDetails,
              selectedDeceasedValue
            );
            const updatePayload = updatePostmortemExaminationPayload(
              values,
              crimeId,
              editPostmortemExaminationObj?._id,
              editPostmortemExaminationObj?.pmeReportURL
                ? editPostmortemExaminationObj?.pmeReportURL
                : {},
              updateMediaResult,
              pmeConductedDetails,
              selectedDeceasedValue
            );

            if (editPostmortemExaminationObj?._id) {
              dispatch(
                updatePostmortemExaminationDetails(
                  config.postmortem,
                  updatePayload
                )
              );
            } else {
              dispatch(
                addPostmortemExaminationDetails(config.postmortem, addPayload)
              );
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(pmeReportURL) && isEmpty(inputFileList)) {
      const updateMediaResult =
        !isNull(editPostmortemExaminationObj) &&
        isEmpty(editPostmortemExaminationObj?.pmeMedia)
          ? []
          : editPostmortemExaminationObj?.pmeMedia;
      const addPayload = addPostmortemExaminationPayload(
        values,
        crimeId,
        {},
        [],
        pmeConductedDetails,
        selectedDeceasedValue
      );
      const updatePayload = updatePostmortemExaminationPayload(
        values,
        crimeId,
        editPostmortemExaminationObj?._id,
        editPostmortemExaminationObj?.pmeReportURL
          ? editPostmortemExaminationObj?.pmeReportURL
          : {},
        updateMediaResult,
        pmeConductedDetails,
        selectedDeceasedValue
      );
      if (editPostmortemExaminationObj?._id) {
        dispatch(
          updatePostmortemExaminationDetails(config.postmortem, updatePayload)
        );
      } else {
        dispatch(
          addPostmortemExaminationDetails(config.postmortem, addPayload)
        );
      }
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditPostmortemExamination = (value) => {
    if (value) {
      setEditPostmortemExaminationObj(value);
      setSelectedDeceasedValue(value.deceasedPersonId?._id);
      setSelectedPME(value.placeOfPME);
      const pmeReportURL = value?.pmeReportURL;
      if (pmeReportURL && pmeReportURL?.name !== "") {
        setSelectedPmeReportURL([
          {
            url: pmeReportURL?.url,
            name: pmeReportURL?.name,
            fileId: pmeReportURL?.fileId,
          },
        ]);
      } else {
        setSelectedPmeReportURL([]);
      }
      setknownUnkownState(value.deceasedType);
      const pmeConductedBy = value?.pmeConductedBy;
      const personalDetails = pmeConductedBy?.personalDetails;
      form.setFieldsValue({
        deceasedType: value.deceasedType,
        deceasedPersonId:
          value.deceasedType === "Known"
            ? value.deceasedPersonId?._id
            : "Unknown Dead Body",
        graveParticulars: value.graveParticulars,
        timeOfPME: moment(new Date(value?.timeOfPME)).isValid()
          ? moment(new Date(value?.timeOfPME))
          : "",
        placeOfPME: value.placeOfPME,
        disposalOfBody: value.disposalOfBody,
        escortPC: value.escortPC,
        pmeConductedBy:
          (personalDetails?.name ? personalDetails?.name : "") +
          " " +
          (personalDetails?.surname ? personalDetails?.surname : ""),
        pmeNumber: value.pmeNumber,
        hospitalName: value.hospitalName,
        hospitalLocation: value?.hospitalLocation,
        finalOpinion: value.finalOpinion,
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
      });
      setPmeConductedDetails(value?.pmeConductedBy);
      professionalForm.setFieldsValue(value?.pmeConductedBy);
    }
  };

  const getSelectedValue = (item) => {
    setSelectedPME(item);
    checkFields();
  };

  const displayPostmortemExaminationFields = (name) => {
    switch (name) {
      case "timeOfPME":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewPostmortemExaminationDetails || disableForm}
          />
        );
      case "placeOfPME":
        return renderFieldsWithDropDown(
          placeOfPME,
          getSelectedValue,
          handleSearch,
          serchText,
          220,
          viewPostmortemExaminationDetails || disableForm
        );
      case "disposalOfBody":
        return renderFieldsWithDropDown(
          displayOfBody,
          null,
          handleSearch,
          serchText,
          220,
          viewPostmortemExaminationDetails || disableForm
        );
      case "escortPC":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          handleSearch,
          serchText,
          220,
          viewPostmortemExaminationDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewPostmortemExaminationDetails || disableForm}
          />
        );
    }
  };

  const displayPostmortemState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          const isLabel =
            s.label === "Date & Time of PME" ||
            s.label === "Place of PME" ||
            s.label === "PME Conducted By";
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[
                  {
                    required: isLabel,
                  },
                ]}
              >
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() =>
                    setIsProfessionalModalVisible(disableForm ? false : true)
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

  const handleOk = async () => {
    const values = await personForm.validateFields();
    const payload = {
      crimeId: crimeId,
      deceasedDetail: {
        lastupdateddatetime: Date.now(),
        person: getPersonDetails(values, inputList),
        userDate: values.userDate,
      },
    };
    dispatch(addDeceasedDetails(config.addDeceasedDetails, payload));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(postmortemExaminationList) &&
      !isEmpty(postmortemExaminationList) &&
      // eslint-disable-next-line array-callback-return
      postmortemExaminationList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.deceasedPersonId) &&
          !isNull(data?.deceasedPersonId) &&
          data?.deceasedPersonId;
        const pmeMedia =
          data.pmeMedia && !isEmpty(data.pmeMedia) ? data.pmeMedia : [];
        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, pmeMedia)
        );
      });
    return savedData;
  };

  const onHospitalChange = (val) => {
    const result =
      !isEmpty(hospitalsList) &&
      first(hospitalsList.filter((s) => s.label === val));
    form.setFieldsValue({
      hospitalLocation: result?.hospitalAddress || "",
    });
  };

  const handleProfessionalOk = async () => {
    const values = await professionalForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "PostMortem";
    personalDetails.createdFor = "Proffessional";
    setPmeConductedDetails(professionalDetails);
    form.setFieldsValue({
      pmeConductedBy:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsProfessionalModalVisible(false);
  };

  const handleProfessionalCancel = () => {
    setIsProfessionalModalVisible(false);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Post-mortem Examination"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewPostmortemExaminationDetails || disableForm}
      />
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      name="deceasedType"
                      label="Deceased Known/Unknown"
                    >
                      {renderFieldsWithDropDown(
                        [{ label: "Known" }, { label: "UnKnown" }],
                        setknownUnkownState,
                        handleSearch,
                        serchText,
                        220,
                        viewPostmortemExaminationDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="deceasedPersonId"
                      label="Name Of the Deceased"
                      rules={[
                        {
                          required: true,
                          message: "Please Select Name of the Deceased!",
                        },
                      ]}
                    >
                      {renderDecesedDropDown(
                        knownUnkownState === "Known"
                          ? deceasedListDetails
                          : [{ label: "Unknown Dead Body" }],
                        setSelectedDeceasedValue,
                        220,
                        true,
                        editPostmortemExaminationObj?._id || disableForm,
                        null,
                        handleSearch,
                        serchText
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="graveParticulars"
                      label="Grave Particulars"
                    >
                      {renderFieldsWithDropDown(
                        gravityList,
                        setknownUnkownState,
                        handleSearch,
                        serchText,
                        220,
                        viewPostmortemExaminationDetails || disableForm
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Card className="card-style">
                  {displayPostmortemState(
                    postmortemExaminationForm,
                    displayPostmortemExaminationFields
                  )}
                </Card>
                {selectedPME === "Hospital" ? (
                  <Card className="card-style">
                    <Row gutter={24}>
                      <Col span={6}>
                        <Form.Item name="hospitalName" label="Hospital Name">
                          {renderFieldsWithDropDown(
                            hospitalsList,
                            onHospitalChange,
                            handleSearch,
                            serchText,
                            200,
                            viewPostmortemExaminationDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          name="hospitalLocation"
                          label="Hospital Location"
                        >
                          <Input
                            onChange={checkFields}
                            maxLength={150}
                            disabled={
                              viewPostmortemExaminationDetails || disableForm
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ) : null}
                <Card className="card-style">
                  <Row className="text-area-row" style={{ marginTop: 10 }}>
                    <Col className="custody-col text-area">
                      <Form.Item name="finalOpinion" label="Final Opinion">
                        <Input.TextArea
                          onChange={checkFields}
                          style={{ width: 600 }}
                          rows={5}
                          disabled={
                            viewPostmortemExaminationDetails || disableForm
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col className="custody-col file-upload">
                      <Form.Item name="pmeReportURL">
                        <Upload
                          fileList={
                            editPostmortemExaminationObj?._id &&
                            editPostmortemExaminationObj?.pmeReportURL?.url !==
                              ""
                              ? selectedPmeReportURL
                              : pmeReportURL
                          }
                          customRequest={dummyRequest}
                          onPreview={handleDownload}
                          onChange={(info) =>
                            onFileChange(info, setPmeReportURL)
                          }
                          multiple={false}
                        >
                          <Button
                            className="saveButton"
                            style={{ marginTop: 25, width: 200 }}
                            icon={<CameraFilled />}
                            disabled={
                              viewPostmortemExaminationDetails ||
                              disableForm ||
                              !isEmpty(pmeReportURL)
                            }
                          >
                            Upload PME Report
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
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
                          disabled={
                            viewPostmortemExaminationDetails || disableForm
                          }
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
            <div style={{ padding: 10 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewPostmortemExaminationDetails || disableForm}
              />
            </div>
            <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
            {!isEmpty(postmortemExaminationList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {postmortemExaminationList &&
                postmortemExaminationList.length > 0
                  ? postmortemExaminationList.length
                  : 0}{" "}
                Post-mortem Examination Records
              </Button>
            ) : null}
            <Modal
              title="Post-mortem Examination Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditPostmortemExamination}
                  setViewDetails={setViewPostmortemExaminationDetails}
                  selectedRecord={editPostmortemExaminationObj}
                  isMedia={true}
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
          disabled={viewPostmortemExaminationDetails || disableForm}
        />
      ) : null}
      {isModalVisible ? (
        <AddPerson
          title="Add Deceased Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={viewPostmortemExaminationDetails || disableForm}
          setInputList={setInputList}
          editObj={editPostmortemExaminationObj}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </ModuleWrapper>
  );
}
