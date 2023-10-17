import { useState, useEffect } from "react";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import axios from "axios";
import { textFieldRules } from "@components/Common/formOptions";
import Loader from "@components/utility/loader";
import {
  disableFutureDates,
  disableFuturePastDates,
} from "@components/Common/helperMethods";
import firActions from "@redux/fir/actions";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Radio,
  Button,
  notification,
  Select,
  Modal,
} from "antd";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDownPanchWitness,
  masterDataType,
  getAccusedsAll,
  getPersonDetails,
  natureOfDeath,
  onFileChange,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  dummyRequest,
  getSavedDataResult,
  shortAddress,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import UploadForm from "@components/Common/uploadForm";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { isUndefined, isEmpty, first, isArray, isNull } from "lodash";
import commonActions from "@redux/investigations/commonRequest/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "./SavedRecords";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import exhumationActions from "@redux/investigations/exhumation/actions";
import {
  exhumationTemplates,
  reasonForExhumation,
  placeOfExhumation,
  orderByForm,
  exhumationForm,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import OtherLinks from "./OtherLinks";
import AddAddress from "../CommonForms/AddAddress";
import ContentHeader from "../../ContentHeader";
import AddPerson from "../CommonForms/AddPerson";
import AddProfessional from "../CommonForms/AddProfessional";
import { renderDecesedDropDown } from "../../Investigation/utils";
import {
  addExhumationPayload,
  updateExhumationPayload,
} from "./exhumationPayloads";
import { ModuleWrapper } from "../CommonDetails/styles";
import TemplatesModal from "../CommonForms/TemplatesModal";
import AccusedCard from "../CommonForms/AccusedCard";

const Option = Select.Option;

export default function Exhumation({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const [professionalForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [age, setAge] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [knownUnkownState, setknownUnkownState] = useState("");
  const [exhumationConductedByLocation, setExhumationConductedByLocation] =
    useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isProfessionalModalVisible, setIsProfessionalModalVisible] =
    useState(false);
  const [pwList, setPwList] = useState([]);
  const [witnessList, setwinessList] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [pmeConducted, setPmeConducted] = useState("Yes");
  const {
    actionType,
    errorMessage,
    successMessage,
    exhumationList,
    isFetching,
  } = useSelector((state) => state.Exhumation);
  const {
    deceasedList,
    isLoading,
    actionName,
    commonSuccessMessage,
    commonErrorMessage,
  } = useSelector((state) => state.CommonRequest);
  const { getStaffList, getRanks, getApprehensionTypes } = masterDataActions;
  const [serchText, setSerchText] = useState("");
  const { createAuditHistory } = auditHistoryActions;
  const [selectedDeceasedValue, setSelectedDeceasedValue] = useState("");
  const [inputList, setInputList] = useState([]);
  const [exhumationInputConductedList, setExhumationInputConductedList] =
    useState([]);
  const [viewExhumationDetails, setViewExhumationDetails] = useState(false);
  const [editExhumationObj, setEditExhumationObj] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [addressDetails, setAddressDetails] = useState([]);
  const [selectedOrderBy, setSelectedOrderBy] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("exhumation");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [exhumationPanchnamaURL, setExhumationPanchnamaURL] = useState([]);
  const [selectedExhumationPanchnamaURL, setSelectedExhumationPanchnamaURL] =
    useState([]);
  const { savedFir } = useSelector((state) => state.createFIR);
  const deceasedvictimList = savedFir && savedFir.victimDetails;
  var mergeList =
    ((deceasedList && isArray(deceasedList) && deceasedList.length > 0) ||
      (deceasedvictimList &&
        isArray(deceasedvictimList) &&
        deceasedvictimList.length > 0)) &&
    [].concat.apply(deceasedvictimList, deceasedList);
  const deceasedListDetails = mergeList && getAccusedsAll(mergeList);
  const filteredDeceasedList =
    !isEmpty(deceasedListDetails) &&
    deceasedListDetails.filter((s) => s.label !== " ");
  const selectedDeceasedDetails =
    filteredDeceasedList &&
    isArray(filteredDeceasedList) &&
    filteredDeceasedList.length > 0 &&
    first(filteredDeceasedList.filter((s) => s._id === selectedDeceasedValue));
  const [selectedPlaceOfExhumation, setSelectedPlaceOfExhumation] =
    useState("");
  const isOrderBy =
    !isUndefined(selectedOrderBy) && selectedOrderBy.includes("Orders of");
  const { getDeceasedList, addDeceasedDetails, resetDeceasedActionType } =
    commonActions;
  const {
    addExhumationDetails,
    updateExhumationDetails,
    getExhumationList,
    resetActionType,
  } = exhumationActions;
  const { panchWitnessList, witnessStatementList } = useSelector(
    (state) => state.FIR
  );
  const { fetchPanchWitnessList, fetchWitnessDetailsList } = firActions;
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true;

  const isDeceasedSuccess = actionName === "ADD_DECEASED_SUCCESS";
  const isDeceasedError = actionName === "ADD_DECEASED_ERROR";

  const isSuccess =
    actionType === "ADD_EXHUMATION_SUCCESS" ||
    actionType === "UPDATE_EXHUMATION_SUCCESS";

  const isError =
    actionType === "ADD_EXHUMATION_ERROR" ||
    actionType === "UPDATE_EXHUMATION_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_EXHUMATION_SUCCESS"
        ? "Exhumation Created"
        : "Exhumation Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/Exhumation", auditType)
      )
    );
  };

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } = !isUndefined(pw.person) && pw.person;
        const label = `${personalDetails?.name} ${
          personalDetails?.surname || ""
        }`;
        const createdFrom = personalDetails?.createdFrom
          ? `(${personalDetails?.createdFrom})`
          : "";
        panchList.push({
          _id: pw.person?._id,
          label: label + createdFrom,
        });
      });
    setPwList(panchList);
  }, [panchWitnessList]);

  useEffect(() => {
    let wtLsit = [];
    witnessStatementList &&
      witnessStatementList.length &&
      witnessStatementList.forEach((pw) => {
        const { personalDetails } = pw.person;
        const label = `${personalDetails.name} ${
          personalDetails.surname || ""
        }`;
        wtLsit.push({
          _id: pw.person?._id,
          label: label,
        });
      });
    setwinessList(wtLsit);
  }, [witnessStatementList]);

  const getSelectedOrderBy = (item) => {
    setSelectedOrderBy(item);
  };

  const getSelectedPlaceOfExhumation = (item) => {
    setSelectedPlaceOfExhumation(item);
  };

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
        successMessage === "Exhumation Successfully Added" ||
        successMessage === "Exhumation Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewExhumationDetails(false);
          setEditExhumationObj(null);
          dispatch(
            getExhumationList(`${config.exhumation}?crimeId=${crimeId}`)
          );
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const checkPmeConducted = (e) => {
    setPmeConducted(e.target.value);
    checkFields();
  };

  const getAddPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return addExhumationPayload(
      values,
      crimeId,
      exhumationConductedByLocation,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory),
      addressDetails
    );
  };

  const getEditPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return updateExhumationPayload(
      values,
      crimeId,
      editExhumationObj?._id,
      exhumationConductedByLocation,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory),
      addressDetails,
      editExhumationObj?.deceasedPersonId?._id
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
      `${crimeId}/${folderName.EXHUMATION}/media`
    );

    const urlFormData = new FormData();
    exhumationPanchnamaURL.forEach((file) => {
      urlFormData.append("file", file.originFileObj);
    });
    urlFormData.append("prefixFolder", crimeId);
    urlFormData.append(
      "folderPath",
      `${crimeId}/${folderName.EXHUMATION}/file`
    );

    if (!isEmpty(inputFileList) && !isEmpty(exhumationPanchnamaURL)) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, mediaFormData),
          axios.post(`${config.fileUpload}/upload`, urlFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              if (editExhumationObj?._id) {
                dispatch(
                  updateExhumationDetails(
                    config.exhumation,
                    getEditPayload(data1, data2, values)
                  )
                );
              } else {
                dispatch(
                  addExhumationDetails(
                    config.exhumation,
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
    } else if (isEmpty(inputFileList) && !isEmpty(exhumationPanchnamaURL)) {
      axios
        .post(`${config.fileUpload}/upload`, urlFormData)
        .then((res) => {
          if (res.status === 200) {
            const updateMediaResult = isEmpty(
              editExhumationObj?.exhumationMedia
            )
              ? []
              : editExhumationObj?.exhumationMedia;
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addExhumationPayload(
              values,
              crimeId,
              exhumationConductedByLocation,
              getFilePayload(payloadData),
              [],
              addressDetails
            );
            const updatePayload = updateExhumationPayload(
              values,
              crimeId,
              editExhumationObj?._id,
              exhumationConductedByLocation,
              getFilePayload(payloadData),
              updateMediaResult,
              addressDetails,
              editExhumationObj?.deceasedPersonId?._id
            );

            if (editExhumationObj?._id) {
              dispatch(
                updateExhumationDetails(config.exhumation, updatePayload)
              );
            } else {
              dispatch(addExhumationDetails(config.exhumation, addPayload));
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(exhumationPanchnamaURL) && !isEmpty(inputFileList)) {
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const mediaResult = [
              ...editExhumationObj?.exhumationMedia,
              ...getMediaPayload(data, selectedCategory),
            ];
            const updateMediaResult = isEmpty(
              editExhumationObj?.exhumationMedia
            )
              ? getMediaPayload(data, selectedCategory)
              : mediaResult;
            const addPayload = addExhumationPayload(
              values,
              crimeId,
              exhumationConductedByLocation,
              {},
              getMediaPayload(data, selectedCategory),
              addressDetails
            );
            const updatePayload = updateExhumationPayload(
              values,
              crimeId,
              editExhumationObj?._id,
              exhumationConductedByLocation,
              editExhumationObj?.exhumationPanchnamaURL
                ? editExhumationObj?.exhumationPanchnamaURL
                : "",
              updateMediaResult,
              addressDetails,
              editExhumationObj?.deceasedPersonId?._id
            );

            if (editExhumationObj?._id) {
              dispatch(
                updateExhumationDetails(config.exhumation, updatePayload)
              );
            } else {
              dispatch(addExhumationDetails(config.exhumation, addPayload));
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(exhumationPanchnamaURL) && isEmpty(inputFileList)) {
      const updateMediaResult = isEmpty(editExhumationObj?.exhumationMedia)
        ? []
        : editExhumationObj?.exhumationMedia;
      const addPayload = addExhumationPayload(
        values,
        crimeId,
        exhumationConductedByLocation,
        {},
        [],
        addressDetails
      );
      const updatePayload = updateExhumationPayload(
        values,
        crimeId,
        editExhumationObj?._id,
        exhumationConductedByLocation,
        editExhumationObj?.exhumationPanchnamaURL
          ? editExhumationObj?.exhumationPanchnamaURL
          : "",
        updateMediaResult,
        addressDetails,
        editExhumationObj?.deceasedPersonId?._id
      );
      if (editExhumationObj?._id) {
        dispatch(updateExhumationDetails(config.exhumation, updatePayload));
      } else {
        dispatch(addExhumationDetails(config.exhumation, addPayload));
      }
    }
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getRanks(`${url}/${masterDataType.RANK}`));
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      getApprehensionTypes(
        `${config.getMasterData}/${masterDataType.APPREHENSION}`
      )
    );
    fetchDeceasedList();
    dispatch(getExhumationList(`${config.exhumation}?crimeId=${crimeId}`));
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditExhumation = (value) => {
    if (value) {
      setEditExhumationObj(value);
      setSelectedDeceasedValue(value.deceasedPersonId?._id);
      setSelectedOrderBy(value.byOrdersOf);
      setPmeConducted(value.previousPMEConducted ? "Yes" : "No");
      setSelectedPlaceOfExhumation(value.placeOfExhumation);
      const exhumationPanchnamaURL = value?.exhumationPanchnamaURL;
      if (exhumationPanchnamaURL && exhumationPanchnamaURL?.name !== "") {
        setSelectedExhumationPanchnamaURL([
          {
            url: exhumationPanchnamaURL?.url,
            name: exhumationPanchnamaURL?.name,
            fileId: exhumationPanchnamaURL?.fileId,
          },
        ]);
      } else {
        setSelectedExhumationPanchnamaURL([]);
      }
      setknownUnkownState(value.deceasedType);
      const deceasedDetails = value?.deceasedPersonId;
      const personalDetails =
        !isUndefined(deceasedDetails) && deceasedDetails?.personalDetails;
      const deceasedPerson =
        (personalDetails?.name ? personalDetails?.name : "") +
        " " +
        (personalDetails?.surname ? personalDetails?.surname : "");
      const exhumationConductedBy = value?.exhumationConductedBy;
      form.setFieldsValue({
        deceasedType: value?.deceasedType,
        deceasedPersonId: deceasedPerson,
        byOrdersOf: value?.byOrdersOf,
        orderNumber: value?.orderNumber,
        OrderDate: moment(new Date(value?.OrderDate)).isValid()
          ? moment(new Date(value?.OrderDate))
          : "",
        dateOfRequisitionForExhumationToTahsildar: moment(
          new Date(value?.dateOfRequisitionForExhumationToTahsildar)
        ).isValid()
          ? moment(new Date(value?.dateOfRequisitionForExhumationToTahsildar))
          : "",
        previousPMEConducted: value?.previousPMEConducted ? "Yes" : "No",
        natureOfDeath: value?.natureOfDeath,
        dateOfExhumation: moment(new Date(value?.dateOfExhumation)).isValid()
          ? moment(new Date(value?.dateOfExhumation))
          : "",
        placeOfExhumation: value?.placeOfExhumation,
        exhumationPanchWitness: value?.exhumationPanchWitness,
        personAssistedInDiggingGrave: value?.personAssistedInDiggingGrave,
        exhumationAddress:
          shortAddress(value?.exhumationAddress?.presentAddress) || "",
        userDate: moment(new Date(value?.userDate)).isValid()
          ? moment(new Date(value?.userDate))
          : "",
        exhumationConductedBy:
          (exhumationConductedBy?.personalDetails?.name
            ? exhumationConductedBy?.personalDetails?.name
            : "") +
          " " +
          (exhumationConductedBy?.personalDetails?.surname
            ? exhumationConductedBy?.personalDetails.surname
            : ""),
      });
      setExhumationConductedByLocation(exhumationConductedBy);
      professionalForm.setFieldsValue(exhumationConductedBy);
    }
  };

  const displayExhumationFields = (name) => {
    switch (name) {
      case "dateOfRequisitionForExhumationToTahsildar":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewExhumationDetails || disableForm}
          />
        );
      case "OrderDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            placeholder="Select Date"
            onChange={checkFields}
            style={{ width: 200 }}
            disabledDate={disableFutureDates}
            disabled={viewExhumationDetails || disableForm}
          />
        );
      case "tahsildar":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewExhumationDetails || disableForm
        );
      case "exhumationConductedBy":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          200,
          viewExhumationDetails || disableForm
        );
      case "exhumationPanchWitness":
        return renderFieldsWithMultipleDropDownPanchWitness(
          pwList,
          null,
          handleSearch,
          serchText,
          200,
          viewExhumationDetails || disableForm
        );
      case "personAssistedInDiggingGrave":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            allowClear
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
            style={{ width: 200 }}
            disabled={viewExhumationDetails}
          >
            {isArray(witnessList) &&
              witnessList.map((item, index) => (
                <Option key={index} value={item._id} label={item.label}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewExhumationDetails || disableForm}
          />
        );
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
    editExhumationObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

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

  const handleProfessionalOk = async () => {
    const values = await professionalForm.validateFields();
    const professionalDetails = getPersonDetails(
      values,
      exhumationInputConductedList
    );
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "Exhumation";
    personalDetails.createdFor = "Proffessional";
    setExhumationConductedByLocation(professionalDetails);
    form.setFieldsValue({
      exhumationConductedBy:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsProfessionalModalVisible(false);
  };

  const handleProfessionalCancel = () => {
    setIsProfessionalModalVisible(false);
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    setAddressDetails(values);
    form.setFieldsValue({
      exhumationAddress: shortAddress(values),
    });
    setIsAddressModalVisible(false);
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(exhumationList) &&
      !isEmpty(exhumationList) &&
      // eslint-disable-next-line array-callback-return
      exhumationList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.deceasedPersonId) &&
          !isNull(data?.deceasedPersonId) &&
          data?.deceasedPersonId;
        const exhumationMedia =
          data.exhumationMedia && !isEmpty(data.exhumationMedia)
            ? data.exhumationMedia
            : [];
        savedData.push(
          getSavedDataResult(
            data,
            personalDetails,
            presentAddress,
            exhumationMedia
          )
        );
      });
    return savedData;
  };

  const onDeceasedChange = (val) => {
    setknownUnkownState(val);
    setSelectedDeceasedValue("");
    form.setFieldsValue({
      deceasedPersonId: "",
    });
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Exhumation"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewExhumationDetails || disableForm}
      />
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Row>
          <Card style={{ width: "70%" }} className="cardLeftStyle">
            <Form form={form} layout="vertical">
              <Col>
                <Row>
                  <Col span={6}>
                    <Form.Item name="deceasedType" label="Identity Of Deceased">
                      <Select
                        allowClear
                        placeholder="Select"
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        style={{ width: 200 }}
                        filterOption={(input, option) =>
                          serchText &&
                          option.props.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={
                          viewExhumationDetails ||
                          editExhumationObj?._id ||
                          disableForm
                        }
                        onChange={(e) => {
                          onDeceasedChange(e);
                        }}
                      >
                        <Option key="1" value="Known" label="Known">
                          Known
                        </Option>
                        <Option key="2" value="UnKnown" label="UnKnown">
                          UnKnown
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    {knownUnkownState === "Known" && (
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
                        {knownUnkownState !== ""
                          ? renderDecesedDropDown(
                              knownUnkownState === "Known"
                                ? filteredDeceasedList
                                : [{ label: "Unknown Dead Body" }],
                              setSelectedDeceasedValue,
                              200,
                              true,
                              editExhumationObj?._id ||
                                isEmpty(filteredDeceasedList) ||
                                disableForm,
                              null,
                              handleSearch,
                              serchText
                            )
                          : renderDecesedDropDown(
                              [],
                              null,
                              200,
                              true,
                              editExhumationObj?._id ||
                                isEmpty(filteredDeceasedList) ||
                                disableForm,
                              null,
                              handleSearch,
                              serchText
                            )}
                      </Form.Item>
                    )}
                    {knownUnkownState === "Known" && !editExhumationObj?._id ? (
                      <div
                        className="link"
                        style={{
                          marginTop: 8,
                          cursor: "pointer",
                        }}
                        onClick={() => setIsModalVisible(true)}
                      >
                        Add Deceased
                      </div>
                    ) : null}
                    {knownUnkownState === "UnKnown" && (
                      <Form.Item
                        name="unknownDeceased"
                        label="Unknown Deceased"
                      >
                        <Input
                          defaultValue="Unknown Dead Body"
                          onChange={checkFields}
                          style={{ width: 200 }}
                          maxLength={textFieldRules.maxLength}
                          disabled={true}
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                {selectedDeceasedValue !== "" && knownUnkownState === "Known" && (
                  <Row>
                    <Col span={6} />
                    <Col span={6}>
                      <AccusedCard
                        accusedPersonalDetails={selectedDeceasedDetails}
                        title="Deceased Details"
                      />
                    </Col>
                  </Row>
                )}
                <Card className="card-style">
                  <div>Reason for Exhumation</div>
                  <Row className="custody-reasons-row">
                    <Col span={7} style={{ marginBottom: 20 }}>
                      <Form.Item
                        name="byOrdersOf"
                        label="By Orders of"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        {renderFieldsWithDropDown(
                          reasonForExhumation,
                          getSelectedOrderBy,
                          handleSearch,
                          serchText,
                          200,
                          viewExhumationDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    {isOrderBy
                      ? orderByForm.map((s, i) => {
                          return (
                            <Col
                              key={i}
                              span={7}
                              style={{ marginBottom: 20, marginRight: 8 }}
                            >
                              <Form.Item name={s.name} label={s.label}>
                                {displayExhumationFields(s.name)}
                              </Form.Item>
                            </Col>
                          );
                        })
                      : null}
                  </Row>
                  <Row
                    className="custody-reasons-row"
                    style={{ marginBottom: 10 }}
                  >
                    <Col span={7}>
                      <Form.Item
                        name="dateOfRequisitionForExhumationToTahsildar"
                        label="Date of Requisition to Executive Magistrate"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        {displayExhumationFields(
                          "dateOfRequisitionForExhumationToTahsildar"
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="custody-reasons-row">
                    <Col span={7}>
                      <Form.Item
                        name="previousPMEConducted"
                        label="Whether PME conducted previously"
                      >
                        <Radio.Group
                          name="radiogroup"
                          onChange={checkPmeConducted}
                          defaultValue={pmeConducted}
                          disabled={viewExhumationDetails || disableForm}
                        >
                          <Radio value="Yes">Yes</Radio>
                          <Radio value="No">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    {pmeConducted && pmeConducted === "Yes" ? (
                      <Col
                        span={7}
                        style={{ marginBottom: 20, marginRight: 8 }}
                      >
                        <Form.Item
                          name="natureOfDeath"
                          label="Nature Of Death, if any"
                        >
                          {renderFieldsWithDropDown(
                            natureOfDeath,
                            null,
                            handleSearch,
                            serchText,
                            200,
                            viewExhumationDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                    ) : null}
                  </Row>
                  <Row className="custody-reasons-row">
                    <Col span={7}>
                      <Form.Item
                        name="dateOfExhumation"
                        label="Exhumation On"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          placeholder="Select Date & Time"
                          onChange={checkFields}
                          style={{ width: 200 }}
                          disabledDate={disableFutureDates}
                          disabled={viewExhumationDetails || disableForm}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7} style={{ marginBottom: 20, marginRight: 8 }}>
                      <Form.Item
                        name="placeOfExhumation"
                        label="Place of Exhumation"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        {renderFieldsWithDropDown(
                          placeOfExhumation,
                          getSelectedPlaceOfExhumation,
                          handleSearch,
                          serchText,
                          200,
                          viewExhumationDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    {selectedPlaceOfExhumation === "Exhumation spot" ? (
                      <Col
                        span={7}
                        style={{ marginBottom: 20, marginRight: 8 }}
                      >
                        <Form.Item
                          name="exhumationAddress"
                          label="Exhumation Address"
                        >
                          {renderFieldsWithDropDown(
                            [],
                            null,
                            handleSearch,
                            serchText,
                            200,
                            viewExhumationDetails || disableForm
                          )}
                        </Form.Item>
                        <div
                          className="link"
                          style={{
                            marginTop: 5,
                            marginLeft: 5,
                            cursor: "pointer",
                          }}
                          onClick={() => setIsAddressModalVisible(true)}
                        >
                          Add Address
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                  <Row className="custody-reasons-row">
                    {exhumationForm.map((s, i) => {
                      return (
                        <Col key={i} span={7}>
                          <Form.Item name={s.name} label={s.label}>
                            {displayExhumationFields(s.name)}
                          </Form.Item>
                          {s.actionLink && (
                            <span
                              className="linkStyle"
                              onClick={() => {
                                if (s.actionLink === "addProfessional") {
                                  setIsProfessionalModalVisible(true);
                                } else {
                                  setSelectedSiderMenu("witnessDetails");
                                }
                              }}
                            >
                              {s.actionName}
                            </span>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                  <Row className="custody-reasons-row">
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
                        disabled={viewExhumationDetails || disableForm}
                        placeholder="Select Date & Time"
                        style={{ width: 200 }}
                        onChange={checkFields}
                      />
                    </Form.Item>
                  </Row>
                  <Row className="custody-reasons-row">
                    <Col
                      className="custody-col file-upload"
                      style={{ marginLeft: 0, marginTop: 20 }}
                    >
                      <Form.Item name="exhumationPanchnamaURL">
                        <Upload
                          fileList={
                            editExhumationObj?._id &&
                            editExhumationObj?.exhumationPanchnamaURL?.url !==
                              ""
                              ? selectedExhumationPanchnamaURL
                              : exhumationPanchnamaURL
                          }
                          customRequest={dummyRequest}
                          onPreview={handleDownload}
                          onChange={(info) =>
                            onFileChange(info, setExhumationPanchnamaURL)
                          }
                          multiple={false}
                        >
                          <Button
                            className="saveButton"
                            style={{ marginTop: 0, width: 240 }}
                            icon={<CameraFilled />}
                            disabled={
                              viewExhumationDetails ||
                              !isEmpty(exhumationPanchnamaURL) ||
                              disableForm
                            }
                          >
                            Upload Exhumation Form
                          </Button>
                        </Upload>
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
              templateLists={exhumationTemplates}
              showModal={showModal}
              disabled={viewExhumationDetails || !editExhumationObj?._id}
              selectedRecord={editExhumationObj}
              selectedModule="exhumation"
              accusedId={editExhumationObj?.deceasedPersonId?._id}
            />
            <div style={{ padding: 10 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewExhumationDetails || disableForm}
              />
            </div>
            <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
            {!isEmpty(exhumationList) ? (
              <Button
                style={{ marginTop: "40px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {exhumationList && exhumationList.length > 0
                  ? exhumationList.length
                  : 0}{" "}
                Exhumation Records
              </Button>
            ) : null}

            <Modal
              title="Exhumation Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditExhumation}
                  setViewDetails={setViewExhumationDetails}
                  selectedRecord={editExhumationObj}
                  isMedia={true}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
          {isModalVisible ? (
            <AddPerson
              title="Add Deceased Details"
              isModalVisible={isModalVisible}
              handleOk={handleOk}
              handleCancel={handleCancel}
              formName={personForm}
              checkFields={checkFields}
              disabled={viewExhumationDetails || disableForm}
              setInputList={setInputList}
              editObj={editExhumationObj}
              age={age}
              setAge={setAge}
            />
          ) : null}

          {isProfessionalModalVisible ? (
            <AddProfessional
              title="Add Professional Details"
              isModalVisible={isProfessionalModalVisible}
              handleOk={handleProfessionalOk}
              handleCancel={handleProfessionalCancel}
              formName={professionalForm}
              checkFields={checkFields}
              disabled={viewExhumationDetails || disableForm}
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
              disabled={viewExhumationDetails || disableForm}
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
