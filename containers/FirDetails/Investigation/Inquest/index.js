import { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import masterDataActions from "@redux/masterData/actions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/utility/loader";
import { textFieldRules } from "@components/Common/formOptions";
import UploadForm from "@components/Common/uploadForm";
import firActions from "@redux/fir/actions";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  DatePicker,
  Upload,
  Button,
  Select,
  notification,
  Modal,
} from "antd";
import { CameraFilled, CaretDownOutlined } from "@ant-design/icons";
import {
  DATE_TIME_FORMAT,
  renderFieldsWithDropDown,
  renderFieldsWithMultipleDropDownPanchWitness,
  getAccusedsAll,
  masterDataType,
  getPersonDetails,
  getStaffsDetails,
  DATE_YY_MM_DD,
  onFileChange,
  folderName,
  getMediaPayload,
  getMediaUploadError,
  dummyRequest,
  getSavedDataResult,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import { config } from "@config/site.config";
import {
  inquestTemplates,
  inquestForm,
  inquestDeathDetailsFormTwo,
  placeOfInquestList,
  getDataForDocument,
  getHTMLFromTemplate,
} from "./const";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, isUndefined, first, isArray, isNull } from "lodash";
import inquestActions from "@redux/investigations/inquest/actions";
import commonActions from "@redux/investigations/commonRequest/actions";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import TemplatesModal from "@containers/FirDetails/Investigation/CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import * as inquestConst from "../../inquestConst";
import AccusedCard from "../CommonForms/AccusedCard";
import AddProfessional from "../CommonForms/AddProfessional";
import OtherLinks from "./OtherLinks";
import ContentHeader from "../../ContentHeader";
import { renderDecesedDropDown } from "../../Investigation/utils";
import SavedRecords from "./SavedRecords";
import { addInquestPayload, updateInquestPayload } from "./inquestPayloads";

const Option = Select.Option;

const optionType = {
  HOSPITALS: "HOSPITALS",
};

export default function Inquest({ setSelectedSiderMenu }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const [professionalForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [addAnother, setAddAnother] = useState(false);
  const [recordsIsModalVisible, setrecordsIsModalVisible] = useState(false);
  const [knownUnkownState, setknownUnkownState] = useState("");
  const [inputList, setInputList] = useState([]);
  const { staffList, hospitalsList } = useSelector((state) => state.MasterData);
  const { actionType, errorMessage, successMessage, inquestList, isFetching } =
    useSelector((state) => state.Inquest);
  const staffMembersList = staffList && getStaffsDetails(staffList);
  const {
    deceasedList,
    isLoading,
    actionName,
    commonSuccessMessage,
    commonErrorMessage,
  } = useSelector((state) => state.CommonRequest);
  const { getStaffList, getRanks, getApprehensionTypes, getHospitalsList } =
    masterDataActions;
  const [serchText, setSerchText] = useState("");
  const [selectedDeceasedValue, setSelectedDeceasedValue] = useState("");
  const [viewInquestDetails, setViewInquestDetails] = useState(false);
  const [selectedPlaceOfInquest, setSelectedPlaceOfInquest] = useState("");
  const [editInquestObj, setEditInquestObj] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inquestCommencedDate, setInquestCommencedDate] = useState("");
  const [inquestConcludedDate, setinquestConcluded] = useState("");
  const selectedFir = loadState("selectedFir");
  const { savedFir } = useSelector((state) => state.createFIR);
  const deceasedvictimList = savedFir && savedFir.victimDetails;
  const currentUser = loadState("currentUser");
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("inquest");
  const [inquestFormURL, setInquestFormURL] = useState([]);
  const [selectedInquestFormURL, setSelectedInquestFormURL] = useState([]);
  const [inquestConductedByLocation, setInquestConductedByLocation] = useState(
    {}
  );
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true;
  const { createAuditHistory } = auditHistoryActions;
  const [pwList, setPwList] = useState([]);
  const [selectedNatureDeath, setSelectedNatureDeath] = useState("");
  const [selectedApparentDeath, setSelectedApparentDeath] = useState("");
  const [selectedResonDeath, setSelectedResonDeath] = useState("");
  const [apparentDeathList, setApparentDeathList] = useState([]);
  const [apparentReasonList, setReasonDeathList] = useState([]);
  const [methodList, setMethodList] = useState([]);
  const [subApparentList, setSubApparentList] = useState([]);

  var mergeList =
    ((deceasedList && isArray(deceasedList) && deceasedList.length > 0) ||
      (deceasedvictimList &&
        isArray(deceasedvictimList) &&
        deceasedvictimList.length > 0)) &&
    [].concat.apply(deceasedvictimList, deceasedList);
  if (isArray(mergeList)) {
    var mergeListDetails = mergeList?.filter(
      (data) => data?.victimType !== "Unknown Dead Body"
    );
  } else {
    mergeListDetails = [];
  }
  const deceasedListDetails =
    mergeListDetails && getAccusedsAll(mergeListDetails);
  const selectedDeceasedDetails =
    deceasedListDetails &&
    isArray(deceasedListDetails) &&
    deceasedListDetails.length > 0 &&
    first(deceasedListDetails.filter((s) => s._id === selectedDeceasedValue));
  const crimeId = loadState("selectedFirId");
  const { getDeceasedList, addDeceasedDetails, resetDeceasedActionType } =
    commonActions;
  const {
    addInquestDetails,
    updateInquestDetails,
    getInquestList,
    resetActionType,
  } = inquestActions;
  const { panchWitnessList } = useSelector((state) => state.FIR);
  const { fetchPanchWitnessList } = firActions;
  const { witnessStatementList } = useSelector((state) => state.FIR);
  const { fetchWitnessDetailsList } = firActions;

  const [isProfessionalModalVisible, setIsProfessionalModalVisible] =
    useState(false);

  const isDeceasedSuccess = actionName === "ADD_DECEASED_SUCCESS";
  const isDeceasedError = actionName === "ADD_DECEASED_ERROR";

  const isSuccess =
    actionType === "ADD_INQUEST_SUCCESS" ||
    actionType === "UPDATE_INQUEST_SUCCESS";

  const isError =
    actionType === "ADD_INQUEST_ERROR" || actionType === "UPDATE_INQUEST_ERROR";

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } =
          !isUndefined(pw?.person) && !isNull(pw?.person) && pw?.person;
        const label =
          personalDetails &&
          `${personalDetails?.name} ${personalDetails?.surname || ""}`;
        const createdFrom = personalDetails?.createdFrom
          ? `(${personalDetails?.createdFrom})`
          : "";
        panchList.push({
          _id: pw.person?._id,
          label: label + createdFrom,
        });
      });
    witnessStatementList &&
      witnessStatementList.length &&
      witnessStatementList.forEach((pw) => {
        const { personalDetails } =
          !isUndefined(pw?.person) && !isNull(pw?.person) && pw?.person;
        const label =
          personalDetails &&
          `${personalDetails?.name} ${personalDetails?.surname || ""}`;
        const createdFrom = personalDetails?.createdFrom
          ? `(${personalDetails?.createdFrom})`
          : "";
        panchList.push({
          _id: pw.person?._id,
          label: label + createdFrom,
        });
      });
    setPwList(panchList);
  }, [panchWitnessList, witnessStatementList]);

  const getSelectedValue = (item) => {
    setSelectedPlaceOfInquest(item);
    checkFields();
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const onDeceasedChange = (val) => {
    setknownUnkownState(val);
    setSelectedDeceasedValue("");
    form.setFieldsValue({
      victimId: "",
    });
  };

  const fetchDeceasedList = () => {
    dispatch(
      getDeceasedList(
        `${config.getPostCrimeSceneDetails}/DECEASED/?crimeId=${crimeId}`
      )
    );
  };

  const handleProfessionalOk = async () => {
    const values = await professionalForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "Inquest";
    personalDetails.createdFor = "Proffessional";
    setInquestConductedByLocation(professionalDetails);
    form.setFieldsValue({
      inquestHeldBy:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsProfessionalModalVisible(false);
  };

  const handleProfessionalCancel = () => {
    setIsProfessionalModalVisible(false);
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "UPDATE_INQUEST_SUCCESS"
        ? "Inquest Updated"
        : "Inquest Created";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/Inquest", auditType)
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
        successMessage === "Inquest Successfully Added" ||
        successMessage === "Inquest Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        } else {
          form.resetFields();
          setViewInquestDetails(false);
          setEditInquestObj(null);
          dispatch(getInquestList(`${config.inquest}?crimeId=${crimeId}`));
        }
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  const getAddPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return addInquestPayload(
      values,
      crimeId,
      inquestConductedByLocation,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory)
    );
  };

  const getEditPayload = (data1, data2, values) => {
    const mediaFormDataResult = data1.data?.data;
    const urlFormDataResult = first(data2.data?.data);
    return updateInquestPayload(
      values,
      crimeId,
      inquestConductedByLocation,
      editInquestObj?._id,
      getFilePayload(urlFormDataResult),
      getMediaPayload(mediaFormDataResult, selectedCategory),
      editInquestObj?.victimId?._id
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
      `${crimeId}/${folderName.INQUEST}/media`
    );

    const urlFormData = new FormData();
    inquestFormURL.forEach((file) => {
      urlFormData.append("file", file.originFileObj);
    });
    urlFormData.append("prefixFolder", crimeId);
    urlFormData.append("folderPath", `${crimeId}/${folderName.INQUEST}/file`);

    if (!isEmpty(inputFileList) && !isEmpty(inquestFormURL)) {
      axios
        .all([
          axios.post(`${config.fileUpload}/upload`, mediaFormData),
          axios.post(`${config.fileUpload}/upload`, urlFormData),
        ])
        .then(
          axios.spread((data1, data2) => {
            if (data1.status === 200 && data2.status === 200) {
              if (editInquestObj?._id) {
                dispatch(
                  updateInquestDetails(
                    config.inquest,
                    getEditPayload(data1, data2, values)
                  )
                );
                setInquestFormURL([]);
                setSelectedInquestFormURL([]);
                setInputFileList([]);
              } else {
                dispatch(
                  addInquestDetails(
                    config.inquest,
                    getAddPayload(data1, data2, values)
                  )
                );
                setInquestFormURL([]);
                setSelectedInquestFormURL([]);
                setInputFileList([]);
              }
            }
          })
        )
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inputFileList) && !isEmpty(inquestFormURL)) {
      axios
        .post(`${config.fileUpload}/upload`, urlFormData)
        .then((res) => {
          if (res.status === 200) {
            const updateMediaResult =
              !isNull(editInquestObj) &&
              isEmpty(editInquestObj?.inquestFormMedia)
                ? []
                : editInquestObj?.inquestFormMedia;
            const { data } = res.data;
            const payloadData = first(data);
            const addPayload = addInquestPayload(
              values,
              crimeId,
              inquestConductedByLocation,
              getFilePayload(payloadData),
              []
            );
            const updatePayload = updateInquestPayload(
              values,
              crimeId,
              inquestConductedByLocation,
              editInquestObj?._id,
              getFilePayload(payloadData),
              updateMediaResult,
              editInquestObj?.victimId?._id
            );

            if (editInquestObj?._id) {
              dispatch(updateInquestDetails(config.inquest, updatePayload));
              setInquestFormURL([]);
              setSelectedInquestFormURL([]);
              setInputFileList([]);
            } else {
              dispatch(addInquestDetails(config.inquest, addPayload));
              setInquestFormURL([]);
              setSelectedInquestFormURL([]);
              setInputFileList([]);
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inquestFormURL) && !isEmpty(inputFileList)) {
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const mediaResult = !isNull(editInquestObj) && [
              ...editInquestObj?.inquestFormMedia,
              ...getMediaPayload(data, selectedCategory),
            ];
            const updateMediaResult =
              !isNull(editInquestObj) &&
              isEmpty(editInquestObj?.inquestFormMedia)
                ? getMediaPayload(data, selectedCategory)
                : mediaResult;
            const addPayload = addInquestPayload(
              values,
              crimeId,
              inquestConductedByLocation,
              {},
              getMediaPayload(data, selectedCategory)
            );
            const updatePayload = updateInquestPayload(
              values,
              crimeId,
              inquestConductedByLocation,
              editInquestObj?._id,
              editInquestObj?.inquestFormURL
                ? editInquestObj?.inquestFormURL
                : "",
              updateMediaResult,
              editInquestObj?.victimId?._id
            );

            if (editInquestObj?._id) {
              dispatch(updateInquestDetails(config.inquest, updatePayload));
              setInquestFormURL([]);
              setSelectedInquestFormURL([]);
              setInputFileList([]);
            } else {
              dispatch(addInquestDetails(config.inquest, addPayload));
              setInquestFormURL([]);
              setSelectedInquestFormURL([]);
              setInputFileList([]);
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inquestFormURL) && isEmpty(inputFileList)) {
      const updateMediaResult =
        !isNull(editInquestObj) && isEmpty(editInquestObj?.inquestFormMedia)
          ? []
          : editInquestObj?.inquestFormMedia;
      const addPayload = addInquestPayload(
        values,
        crimeId,
        inquestConductedByLocation,
        {},
        []
      );
      const updatePayload = updateInquestPayload(
        values,
        crimeId,
        inquestConductedByLocation,
        editInquestObj?._id,
        editInquestObj?.inquestFormURL ? editInquestObj?.inquestFormURL : {},
        updateMediaResult,
        editInquestObj?.victimId?._id
      );
      if (editInquestObj?._id) {
        dispatch(updateInquestDetails(config.inquest, updatePayload));
        setInquestFormURL([]);
        setSelectedInquestFormURL([]);
        setInputFileList([]);
      } else {
        dispatch(addInquestDetails(config.inquest, addPayload));
        setInquestFormURL([]);
        setSelectedInquestFormURL([]);
        setInputFileList([]);
      }
    }
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getRanks(`${url}/${masterDataType.RANK}`));
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
    dispatch(
      getApprehensionTypes(
        `${config.getMasterData}/${masterDataType.APPREHENSION}`
      )
    );
    fetchDeceasedList();
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}`
      )
    );
    dispatch(getInquestList(`${config.inquest}?crimeId=${crimeId}`));
    dispatch(getHospitalsList(`${url}/${optionType.HOSPITALS}`));
    setInquestFormURL([]);
    setSelectedInquestFormURL([]);
    setInputFileList([]);
    setEditInquestObj(null);
  }, []);

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleEditInquest = (value) => {
    if (value) {
      setEditInquestObj(value);
      setSelectedDeceasedValue(value.victimId?._id);
      setInquestFormURL([]);
      setInputFileList([]);
      const inquestFormURL = value?.inquestFormURL;
      if (inquestFormURL && inquestFormURL?.name !== "") {
        setSelectedInquestFormURL([
          {
            url: inquestFormURL?.url,
            name: inquestFormURL?.name,
            fileId: inquestFormURL?.fileId,
          },
        ]);
      } else {
        setSelectedInquestFormURL([]);
      }
      setknownUnkownState(value.deceasedType);
      const victimDetails = value?.victimId;
      const personalDetails =
        !isUndefined(victimDetails) && victimDetails?.personalDetails;
      const victimPerson =
        (personalDetails?.name ? personalDetails?.name : "") +
        " " +
        (personalDetails?.surname ? personalDetails?.surname : "");
      setSelectedPlaceOfInquest(value.placeOfInquest);
      form.setFieldsValue({
        deceasedType: value.deceasedType,
        victimId: victimPerson,
        placeOfInquest: value.placeOfInquest,
        inquestHeldBy: value.inquestHeldBy,
        witnessOrRelatives: value.witnessOrRelatives,
        hospitalName: value.hospitalName,
        hospitalLocation: value.hospitalLocation,
        doctorName: value.doctorName,
        natureOfDeath: value.natureOfDeath,
        methodOfDeath: value.methodOfDeath,
        apparentCauseOfDeath: value.apparentCauseOfDeath,
        reasonSubType: value.reasonSubType,
        apprentSubType: value.apprentSubType,
        custodialApparent: value.custodialApparent
          ? value.custodialApparent
          : null,
        custodialReason: value.custodialReason ? value.custodialReason : null,
        inquestCommenced: moment(new Date(value?.inquestCommenced)).isValid()
          ? moment(new Date(value?.inquestCommenced))
          : "",
        inquestConcluded: moment(new Date(value?.inquestConcluded)).isValid()
          ? moment(new Date(value?.inquestConcluded))
          : "",
        escortPC: value.escortPC,
      });
      setSelectedNatureDeath(value.natureOfDeath);
      setInquestConductedByLocation(value?.inquestHeldByOthers);
      professionalForm.setFieldsValue(value?.inquestHeldByOthers);
    }
  };

  const inquestCommencedChange = (date, _dateString) => {
    setInquestCommencedDate(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const dateAndTimeOfinquestConcludedChange = (date, _dateString) => {
    setinquestConcluded(moment(date).format(DATE_YY_MM_DD));
    checkFields();
  };

  const onChangeNatureDeath = (val) => {
    form.setFieldsValue({
      methodOfDeath: "",
      apparentCauseOfDeath: "",
      reasonSubType: "",
    });
    setSelectedNatureDeath(val);
    setApparentDeathList([]);
    setReasonDeathList([]);
    setMethodList([]);
    setSubApparentList([]);
    setSelectedResonDeath("");
    if (val === "Natural Death") {
      setApparentDeathList(inquestConst.naturalDeathApparent);
    } else if (val === "Suicidal Death") {
      setApparentDeathList(inquestConst.suicidalDeathApparent);
    } else if (val === "Accidental") {
      setApparentDeathList(inquestConst.accidentalApparent);
    } else if (val === "Homicidal") {
      setApparentDeathList(inquestConst.homicidalApparent);
    } else if (val === "Culpable Homicide not amounting to murder") {
      setApparentDeathList(inquestConst.culpableApparent);
    } else if (val === "Suspicious") {
      setApparentDeathList(inquestConst.suspiciousApparent);
    } else if (val === "Exchange of fire") {
      setApparentDeathList(inquestConst.exchangeFireApparent);
    } else if (val === "Farmer's Suicide") {
      setApparentDeathList(inquestConst.resonforSuicideDroppedTypes);
    }
    checkFields();
  };

  const onchangeApparentDeath = (val) => {
    form.setFieldsValue({
      methodOfDeath: "",
      reasonSubType: "",
      apprentSubType: "",
    });
    setSelectedResonDeath("");
    setMethodList([]);
    setSubApparentList([]);
    setSelectedApparentDeath(val);
    if (val === "Heart attack") {
      setReasonDeathList(inquestConst.heartAttackReason);
    } else if (val === "Tuberculosis") {
      setReasonDeathList(inquestConst.tuberculosisReason);
    } else if (val === "Snake Bite") {
      setReasonDeathList(inquestConst.snakeBiteReason);
    } else if (val === "Excessive alcohol") {
      setReasonDeathList(inquestConst.eAlcoholReason);
    } else if (val === "Death due to other diseases") {
      setReasonDeathList(inquestConst.otherDiseasesReason);
    } else if (val === "Other natural causes") {
      setReasonDeathList(inquestConst.naturalCausesReason);
    } else if (selectedNatureDeath === "Suicidal Death" && val === "Drowning") {
      setSubApparentList(inquestConst.drowning);
      setReasonDeathList(inquestConst.suicidalDeathReason);
    } else if (selectedNatureDeath === "Suicidal Death" && val === "Jumping") {
      setSubApparentList(inquestConst.Jumping);
      setReasonDeathList(inquestConst.suicidalDeathReason);
    } else if (selectedNatureDeath === "Suicidal Death") {
      setReasonDeathList(inquestConst.suicidalDeathReason);
    } else if (val === "Road Accident") {
      setReasonDeathList(inquestConst.roadAccidentReason);
    } else if (selectedNatureDeath === "Homicidal" && val === "Pushing") {
      setSubApparentList(inquestConst.Jumping);
      setReasonDeathList(inquestConst.homicidalReason);
    } else if (selectedNatureDeath === "Homicidal") {
      setReasonDeathList(inquestConst.homicidalReason);
    } else if (
      selectedNatureDeath === "Culpable Homicide not amounting to murder"
    ) {
      setReasonDeathList(inquestConst.culpableReason);
    } else if (val === "suspicious") {
      setReasonDeathList(inquestConst.suspiciousReason);
    } else if (val === "Bullet injury") {
      setReasonDeathList(inquestConst.exchangeFireReason);
    } else if (val === "Fall From Height") {
      setSubApparentList(inquestConst.fallFromHeight);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (val === "Collapses") {
      setSubApparentList(inquestConst.collapses);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (val === "Burns") {
      setSubApparentList(inquestConst.burns);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (val === "Electrocution") {
      setSubApparentList(inquestConst.electrocution);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (val === "Drowning") {
      setSubApparentList(inquestConst.accidentalDrowning);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (val === "Animal Attack") {
      setSubApparentList(inquestConst.animalAttack);
      setReasonDeathList(inquestConst.accidentalReason);
    } else if (
      val === "Medical treatment Negligent act of doctor in treatment"
    ) {
      setReasonDeathList(inquestConst.accidentMedicalReason);
      setSubApparentList([]);
    }
    checkFields();
  };

  const onChangeMethodDeath = (val) => {
    form.setFieldsValue({
      reasonSubType: "",
    });
    setMethodList([]);
    setSelectedResonDeath(val);
    if (val === "Marital Issues") {
      setMethodList(inquestConst.maritalIssues);
    } else if (val === "Financial Issues") {
      setMethodList(inquestConst.financialIssues);
    } else if (val === "Mental Depression/Frustration in Life") {
      setMethodList(inquestConst.mentalDepression);
    } else if (val === "Farmer's suicides") {
      setMethodList(inquestConst.farmerSuicide);
    } else if (val === "Starvation deaths") {
      setMethodList(inquestConst.starvationReason);
    } else if (val === "Sudden provocation on trival issues") {
      setMethodList(inquestConst.provocationReason);
    } else if (val === "Previous Enmity") {
      setMethodList(inquestConst.previousEnmity);
    } else if (val === "Murder for gain") {
      setMethodList(inquestConst.murderForGain);
    } else if (val === "Crime against woman") {
      setMethodList(inquestConst.crimeAgainstWomen);
    } else if (val === "Family issues") {
      setMethodList(inquestConst.familyIssues);
    } else if (val === "Social evils") {
      setMethodList(inquestConst.socialEvils);
    } else if (val === "Civil Disptues") {
      setMethodList(inquestConst.civilDisputes);
    } else if (val === "Financial Related") {
      setMethodList(inquestConst.financialRelated);
    } else if (val === "Terrorism") {
      setMethodList(inquestConst.terrorism);
    }
    checkFields();
  };

  const displayInquestFields = (name) => {
    switch (name) {
      case "placeOfInquest":
        return renderFieldsWithDropDown(
          placeOfInquestList,
          getSelectedValue,
          handleSearch,
          serchText,
          200,
          viewInquestDetails || disableForm
        );
      case "inquestHeldBy":
        return renderFieldsWithDropDown(
          [{ label: "Investigating officer" }, { label: "Tahsildar" }],
          null,
          handleSearch,
          serchText,
          200,
          viewInquestDetails || disableForm
        );
      case "witnessOrRelatives":
        return renderFieldsWithMultipleDropDownPanchWitness(
          pwList,
          null,
          handleSearch,
          serchText,
          200,
          viewInquestDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewInquestDetails || disableForm}
          />
        );
    }
  };

  const displayInquestFieldsTwo = (name) => {
    switch (name) {
      case "inquestCommenced":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={inquestCommencedChange}
            style={{ width: 200 }}
            disabled={viewInquestDetails || disableForm}
          />
        );
      case "inquestConcluded":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={dateAndTimeOfinquestConcludedChange}
            style={{ width: 200 }}
            disabled={viewInquestDetails || disableForm}
          />
        );
      case "escortPC":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          handleSearch,
          serchText,
          200,
          viewInquestDetails || disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewInquestDetails || disableForm}
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
    editInquestObj,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir
  );

  const displayInquestForm = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          const isLabel =
            s.label === "Inquest Concluded" ||
            s.label === "Inquest Commenced" ||
            s.label === "Inquest Held By" ||
            s.label ===
              "Name and Address of Relatives / Witnesses / Panch Witness";
          return (
            <Col
              key={i}
              span={i === 2 ? 10 : 6}
              style={{ marginBottom: 20, marginRight: 8 }}
            >
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
      },
    };
    dispatch(addDeceasedDetails(config.addDeceasedDetails, payload));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(inquestList) &&
      !isEmpty(inquestList) &&
      // eslint-disable-next-line array-callback-return
      inquestList.map((data) => {
        const { personalDetails, presentAddress } =
          !isUndefined(data?.victimId) &&
          !isNull(data?.victimId) &&
          data?.victimId;
        const inquestFormMedia =
          data.inquestFormMedia && !isEmpty(data.inquestFormMedia)
            ? data.inquestFormMedia
            : [];
        savedData.push(
          getSavedDataResult(
            data,
            personalDetails,
            presentAddress,
            inquestFormMedia
          )
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

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };
  console.log(
    "addAnother",
    addAnother,
    inquestFormURL,
    selectedInquestFormURL,
    inputFileList
  );
  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Inquest"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        setAddAnother={setAddAnother}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewInquestDetails || disableForm}
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
                          viewInquestDetails ||
                          editInquestObj?._id ||
                          disableForm
                        }
                        onChange={(e) => {
                          onDeceasedChange(e);
                        }}
                      >
                        <Option key="1" value="Animal" label="Animal">
                          Animal
                        </Option>
                        <Option key="2" value="Known" label="Known">
                          Known
                        </Option>
                        <Option key="3" value="UnKnown" label="UnKnown">
                          UnKnown
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    {knownUnkownState === "Known" && (
                      <Form.Item
                        name="victimId"
                        label="Name of the Deceased"
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
                                ? deceasedListDetails
                                : [{ label: "Unknown Dead Body" }],
                              setSelectedDeceasedValue,
                              200,
                              true,
                              editInquestObj?._id ||
                                isEmpty(deceasedListDetails) ||
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
                              editInquestObj?._id ||
                                isEmpty(deceasedListDetails) ||
                                disableForm,
                              null,
                              handleSearch,
                              serchText
                            )}
                      </Form.Item>
                    )}
                    {knownUnkownState === "Known" && !editInquestObj?._id ? (
                      <div
                        className="link"
                        style={{
                          marginTop: 8,
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          setIsModalVisible(disableForm ? false : true)
                        }
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
                          onChange={checkFields}
                          defaultValue="Unknown Dead Body"
                          style={{ width: 200 }}
                          maxLength={textFieldRules.maxLength}
                          disabled={true}
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                {selectedDeceasedValue !== "" &&
                  knownUnkownState === "Known" && (
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
                  {displayInquestForm(inquestForm, displayInquestFields)}
                  {selectedPlaceOfInquest === "Hospital" ? (
                    <Row gutter={24} style={{ marginBottom: 15 }}>
                      <Col span={6}>
                        <Form.Item name="hospitalName" label="Hospital Name">
                          {renderFieldsWithDropDown(
                            hospitalsList,
                            onHospitalChange,
                            handleSearch,
                            serchText,
                            200,
                            viewInquestDetails || disableForm
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
                            style={{ width: 200 }}
                            maxLength={textFieldRules.maxLength}
                            disabled={viewInquestDetails || disableForm}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : null}
                  <Row gutter={24} style={{ marginBottom: 15 }}>
                    <Col span={6}>
                      <Form.Item name="natureOfDeath" label="Nature of Death">
                        {renderFieldsWithDropDown(
                          inquestConst.natureOfDeath,
                          onChangeNatureDeath,
                          handleSearch,
                          serchText,
                          200,
                          viewInquestDetails || disableForm
                        )}
                      </Form.Item>
                    </Col>
                    {selectedNatureDeath === "Farmer's Suicide" ? (
                      <Col span={6}>
                        <Form.Item
                          name="apparentCauseOfDeath"
                          label="Reasons for Suicide"
                        >
                          {renderFieldsWithDropDown(
                            apparentDeathList,
                            onchangeApparentDeath,
                            handleSearch,
                            serchText,
                            200,
                            viewInquestDetails || disableForm
                          )}
                        </Form.Item>
                      </Col>
                    ) : (
                      <>
                        {selectedNatureDeath !== "Custodial Death" ? (
                          <>
                            <Col span={6}>
                              <Form.Item
                                name="apparentCauseOfDeath"
                                label="Apparent Cause of Death"
                              >
                                {renderFieldsWithDropDown(
                                  apparentDeathList,
                                  onchangeApparentDeath,
                                  handleSearch,
                                  serchText,
                                  200,
                                  viewInquestDetails || disableForm
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                name="methodOfDeath"
                                label="Reason For Death"
                              >
                                {renderFieldsWithDropDown(
                                  apparentReasonList,
                                  onChangeMethodDeath,
                                  handleSearch,
                                  serchText,
                                  200,
                                  viewInquestDetails || disableForm
                                )}
                              </Form.Item>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col span={6}>
                              <Form.Item
                                name="custodialApparent"
                                label="Apparent Cause of Death"
                              >
                                <Input
                                  onChange={checkFields}
                                  style={{ width: 200 }}
                                  maxLength={textFieldRules.maxLength}
                                  disabled={viewInquestDetails || disableForm}
                                />
                              </Form.Item>
                            </Col>
                            <Col span={6}>
                              <Form.Item
                                name="custodialReason"
                                label="Reason for Death"
                              >
                                <Input
                                  onChange={checkFields}
                                  style={{ width: 200 }}
                                  maxLength={textFieldRules.maxLength}
                                  disabled={viewInquestDetails || disableForm}
                                />
                              </Form.Item>
                            </Col>
                          </>
                        )}
                      </>
                    )}
                  </Row>
                  {!isEmpty(methodList) || !isEmpty(subApparentList) ? (
                    <Row gutter={24} style={{ marginBottom: 15 }}>
                      <Col span={6}></Col>
                      <Col span={6}>
                        {!isEmpty(subApparentList) && (
                          <Form.Item
                            name="apprentSubType"
                            label="Apparent Sub Type"
                          >
                            {renderFieldsWithDropDown(
                              subApparentList,
                              null,
                              handleSearch,
                              serchText,
                              200,
                              viewInquestDetails || disableForm
                            )}
                          </Form.Item>
                        )}
                      </Col>
                      <Col span={6}>
                        {!isEmpty(methodList) && (
                          <Form.Item
                            name="reasonSubType"
                            label="Reason Sub Type"
                          >
                            {renderFieldsWithDropDown(
                              methodList,
                              null,
                              handleSearch,
                              serchText,
                              200,
                              viewInquestDetails || disableForm
                            )}
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                  ) : null}
                  {displayInquestForm(
                    inquestDeathDetailsFormTwo,
                    displayInquestFieldsTwo
                  )}
                  <Row>
                    <Col
                      className="custody-col file-upload"
                      style={{ marginLeft: 0, marginTop: 20 }}
                    >
                      <Form.Item name="inquestFormURL">
                        <Upload
                          fileList={
                            editInquestObj?._id &&
                            editInquestObj?.inquestFormURL?.url &&
                            editInquestObj?.inquestFormURL?.url !== ""
                              ? selectedInquestFormURL
                              : inquestFormURL
                          }
                          customRequest={dummyRequest}
                          onPreview={handleDownload}
                          onChange={(info) =>
                            onFileChange(info, setInquestFormURL)
                          }
                          multiple={false}
                        >
                          <Button
                            className="saveButton"
                            style={{ marginTop: 0, width: 200 }}
                            icon={<CameraFilled />}
                            disabled={
                              viewInquestDetails ||
                              !isEmpty(inquestFormURL) ||
                              disableForm
                            }
                          >
                            Upload Inquest Form
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
              templateLists={inquestTemplates}
              showModal={showModal}
              disabled={
                viewInquestDetails || !editInquestObj?._id || disableForm
              }
              selectedRecord={editInquestObj}
              selectedModule="inquest"
              accusedId={editInquestObj?.victimId?._id}
            />
            <div style={{ padding: 10 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewInquestDetails || disableForm}
              />
            </div>
            <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
            {!isEmpty(inquestList) ? (
              <Button
                style={{ marginTop: "15px", width: "100%" }}
                onClick={() => setrecordsIsModalVisible(true)}
              >
                {inquestList && inquestList.length > 0 ? inquestList.length : 0}{" "}
                Inquest Records
              </Button>
            ) : null}
            <Modal
              title="Inquest Records"
              visible={recordsIsModalVisible}
              onOk={() => setrecordsIsModalVisible(false)}
              onCancel={() => setrecordsIsModalVisible(false)}
              style={{ minWidth: "95vw" }}
              footer={null}
            >
              <div style={{ maxHeight: 650, overflowY: "auto" }}>
                <SavedRecords
                  dataSource={getSavedData()}
                  editDetails={handleEditInquest}
                  setViewDetails={setViewInquestDetails}
                  selectedRecord={editInquestObj}
                  isMedia={true}
                  recordVisible={setrecordsIsModalVisible}
                />
              </div>
            </Modal>
          </Card>
          <AddPerson
            title="Add Deceased Details"
            isModalVisible={isModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
            formName={personForm}
            checkFields={checkFields}
            disabled={viewInquestDetails || disableForm}
            setInputList={setInputList}
            editObj={editInquestObj}
            age={age}
            setAge={setAge}
          />
          {isProfessionalModalVisible ? (
            <AddProfessional
              title="Add Professional Details"
              isModalVisible={isProfessionalModalVisible}
              handleOk={handleProfessionalOk}
              handleCancel={handleProfessionalCancel}
              formName={professionalForm}
              checkFields={checkFields}
              disabled={viewInquestDetails || disableForm}
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
