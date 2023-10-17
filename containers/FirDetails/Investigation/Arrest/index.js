import { useState, useEffect } from "react";
import { Card, Col, Form, Select, notification, Button, Modal } from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  isArray,
  first,
  isEmpty,
  isBoolean,
  isNull,
  isUndefined,
} from "lodash";
import moment from "moment";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { arrestForms } from "./const";
import ContentHeader from "../../ContentHeader";
import AccusedCard from "../CommonForms/AccusedCard";
import ArrestContainer from "./ArrestContainer";
import SurrenderInCourt from "../SurrenderInCourt";
import HighCourtDirections from "../HighCourtDirections";
import AccusedOutOfCountry from "../AccusedOutOfCountry";
import SurrenderBeforeCourt from "../SurrenderBeforeCourt";
import { ArrestWrapper } from "./styles";
import {
  isOptionTrue,
  getLabelName,
  getDataForDocument,
  editArrestDetails,
  arrestOption,
  arrestTypeOption,
  getHTMLFromTemplate,
} from "./utils";
import { loadState, loadStringState } from "@lib/helpers/localStorage";
import firActions from "@redux/fir/actions";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { config, API_ARREST_BASE_URL } from "@config/site.config";
import Loader from "@components/utility/loader";
import TemplatesModal from "../CommonForms/TemplatesModal";
import ArrestList from "./ArrestList";
import OtherLinks from "./OtherLinks";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import {
  getPersonDetails,
  masterDataType,
  getAccuseds,
  allAccusedLists,
  accusedListDropDown,
  folderName,
  getMediaUploadError,
  getSavedDataResult,
  IS_SHO,
  getFilePayload,
} from "@containers/FirDetails/fir-util";
import {
  addArrestbyPolicePayload,
  updateArrestbyPolicePayload,
} from "./arrestPayloads/arrestByPolicePayloads";
import {
  addArrestByOtherPolicePayload,
  updateArrestbyOtherPolicePayload,
} from "./arrestPayloads/arrestByOtherPolicePayloads";
import {
  addArrestOnAnticipatoryBailPayload,
  updateArrestOnAnticipatoryBailPayload,
} from "./arrestPayloads/arrestOnAnticipatoryBailPayloads";
import {
  addArrestOnSurrenderInPoliceStationPayload,
  updateArrestOnSurrenderInPoliceStationPayload,
} from "./arrestPayloads/arrestOnSurrenderInPoliceStationPayloads";
import {
  addSurrenderInCourtPayload,
  updateSurrenderInCourtPayload,
} from "./arrestPayloads/surrenderInCourt";
import {
  addHighCourtDirectionsPayload,
  updateHighCourtDirectionsPayload,
} from "./arrestPayloads/highCourtDirectionsPayloads";
import {
  updateSurrenderBeforeCourtPayload,
  addSurrenderBeforeCourtPayload,
} from "./arrestPayloads/surrenderBeforeCourtPayloads";
import {
  addAccusedOutOfCountryPayload,
  updateAccusedOutOfCountryPayload,
} from "./arrestPayloads/accusedOutOfCountryPayloads";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import DisplayArrestReportGenerations from "@containers/FirDetails/CommonSections/DisplayArrestReportGenerations";
import crpcNotice41AReportAction from "@redux/investigations/crpcNotice41A/actions";
import Saved41CrpcRecords from "./Saved41CrpcRecords";
import UploadForm from "@components/Common/arrestUploadForm";
import { getFileById } from "@containers/media-util";

const Option = Select.Option;

export default function Arrest({
  setSelectedSiderMenu,
  selectedInvestigationFormObj,
  isArrestRelated,
}) {
  const [form] = Form.useForm();
  const [suretyDetailsForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const IS_SHO_USER = currentUser.emp_role_name === IS_SHO;
  const selectedCaseStatus = loadStringState("selectedCaseStatus");
  const displayArrestList = selectedInvestigationFormObj?.displayArrestList;
  const dispatch = useDispatch();
  const { get41ACrpcList } = crpcNotice41AReportAction;
  const { crpc41AList } = useSelector((state) => state.CRPCNotice41A);
  const [addAnother, setAddAnother] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [arrestpoliceMedia, setarrestpoliceMedia] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const { createArrest, updateArrest, fetchArrest, fetchFIRList } = firActions;
  const {
    getCourtsBasedonPsCode,
    getJailsName,
    getStatesName,
    getHighCourtDirections,
  } = masterDataActions;
  const { getAccusedList } = suspectAccusedAction;
  const { actionType, errorMessage, arrestList, isFetching } = useSelector(
    (state) => state.FIR
  );
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const { uploadTemplates } = mediaManagerActions;
  const { createAuditHistory } = auditHistoryActions;
  const [isSuretyDetailsModalVisible, setIsSuretyDetailsModalVisible] =
    useState(false);
  const [selectedSuretyDetails, setSelectedSuretyDetails] = useState([]);
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [formValid, SetFormValid] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isRecordsModalVisible, setIsRecordModalVisible] = useState(false);
  const [selectedAccusedValue, setSelectedAccusedValue] = useState("");
  const [selectedActionValue, setSelectedActionValue] = useState("");
  const [selectednbwStatus, setselectednbwStatus] = useState("");
  const [selectedcircularStatus, setSelectedcircularStatus] = useState("");
  const [selectedArrestValue, setSelectedArrestValue] = useState("");
  const [arrestTypeData, setArrestTypeData] = useState([]);
  const [showMedicalExamination, setShowMedicalExamination] = useState(false);
  const [arrestProcess, setArrestProcesses] = useState([]);
  const [viewArrestDetails, setViewArrestDetails] = useState(false);
  const [editArrestObj, setEditArrestObj] = useState(null);
  const [dateTimeOfCustody, setDateTimeOfCustody] = useState("");
  const [dateAndTimeOfArrest, setDateAndTimeOfArrest] = useState("");
  const [otherStateSelected, setOtherStateSelected] = useState("");
  const [isInjured, setIsInjured] = useState(true);
  const [personDetails, setPersonDetails] = useState("");
  const [viewEditObj, setviewEditObj] = useState(""); //for sureity details
  const [viewEditObjIndex, setviewEditObjIndex] = useState(""); //for sureity details
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAccusedIndex, setSelectedAccusedIndex] = useState("");
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [uploadMedicalCertificateUrl, setUploadMedicalCertificateUrl] =
    useState([]);
  const [
    selectedUploadMedicalCertificateUrl,
    setSelectedUploadMedicalCertificateUrl,
  ] = useState([]);
  const [uploadCourtConditionsUrl, setUploadCourtConditionsUrl] = useState([]);
  const [
    selectedUploadCourtConditionsUrl,
    setSelectedUploadCourtConditionsUrl,
  ] = useState([]);

  const [courtOrderDocumentURL, setCourtOrderDocumentURL] = useState([]);
  const [selectedCourtOrderDocumentURL, setSelectedCourtOrderDocumentURL] =
    useState([]);

  const [nbwURL, setNbwURL] = useState([]);
  const [selectedNbwURL, setSelectedNbwURL] = useState([]);

  const dateAndTimeOfArrestIsValid =
    dateTimeOfCustody &&
    dateAndTimeOfArrest &&
    moment(dateAndTimeOfArrest).isAfter(dateTimeOfCustody);

  const actionOptions = arrestForms.actionOptions;
  const arrestOptions = arrestForms.arrestOptions;
  const isArrest = isOptionTrue(selectedActionValue, actionOptions, 0);
  const isSurrenderInCourt = isOptionTrue(
    selectedActionValue,
    actionOptions,
    1
  );
  const isHighCourtDirections = isOptionTrue(
    selectedActionValue,
    actionOptions,
    2
  );
  const isAccusedOutOfCountry = isOptionTrue(
    selectedActionValue,
    actionOptions,
    3
  );
  const isSurrenderBeforeCourt = isOptionTrue(
    selectedActionValue,
    actionOptions,
    4
  );

  const getMasterDataList = () => {
    const url = config.getMasterData;
    dispatch(
      getCourtsBasedonPsCode(
        `${config.masterData}/getCourtsBasedonPsCode?psCode=${currentUser?.cctns_unit_id}`
      )
    );
    dispatch(getJailsName(`${url}/${masterDataType.JAILS}`));
    dispatch(getStatesName(`${url}/${masterDataType.STATES}`));
    dispatch(
      getHighCourtDirections(`${url}/${masterDataType.HIGH_COURT_DIRECTIONS}`)
    );
  };

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const fetch41ACrpcDetailsList = () => {
    dispatch(
      get41ACrpcList(`${API_ARREST_BASE_URL}/api/41ACRPC?crimeId=${crimeId}`)
    );
  };

  const fetchRecentFirDetails = () => {
    const psCode = currentUser?.cctns_unit_id;
    if (IS_SHO_USER) {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${psCode}&caseStatus=${selectedCaseStatus}`
        )
      );
    } else {
      dispatch(
        fetchFIRList(
          `${config.getRecentFirList}/?psCode=${psCode}&userName=${currentUser?.pao_code}&caseStatus=${selectedCaseStatus}`
        )
      );
    }
  };

  useEffect(() => {
    fetchRecentFirDetails();
  }, []);

  const filterList =
    !isEmpty(suspectAccusedList) &&
    suspectAccusedList.filter((s) => !s.is41ACRPCExplainationSubmitted);
  const filterListArrest =
    !isEmpty(filterList) && filterList.filter((s) => !s.isArrestRelated);
  const getAccusedData = () => getAccuseds(allAccusedLists(filterList));
  const getAccusedDropdownData = () =>
    getAccuseds(accusedListDropDown(filterListArrest));
  const accusedPersonalDetails = first(
    getAccusedData().filter((s) => s.label === selectedAccusedValue)
  );

  const isSuccess =
    actionType === "ARREST_UPDATE_SUCCESS" ||
    actionType === "ARREST_CREATE_SUCCESS";

  const isError =
    actionType === "ARREST_UPDATE_ERROR" ||
    actionType === "ARREST_CREATE_ERROR";

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ARREST_CREATE_SUCCESS"
        ? "Arrest Created"
        : "Arrest Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "investigation/arrest", auditType)
      )
    );
  };

  useEffect(() => {
    fetchAccusedList();
    getMasterDataList();
    fetch41ACrpcDetailsList();
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess) {
        openNotificationWithIcon("success", "success");
        auditHistoryEntry();
        form.resetFields();
        fetchAccusedList();
        setEditArrestObj(null);
        setViewArrestDetails(false);
        setSelectedSuretyDetails([]);
        setSelectedAccusedValue("");
        setUploadMedicalCertificateUrl([]);
        setUploadCourtConditionsUrl([]);
        setarrestpoliceMedia([]);
        setInputFileList([]);
        setCourtOrderDocumentURL([]);
        setNbwURL([]);
        form.setFieldsValue({
          accusedCode: "",
        });
        if (!addAnother) {
          setSelectedSiderMenu("investigation");
        }
        if (!isArrestRelated) {
          const { selectedActionFormData, selectedArrestFormData } =
            selectedInvestigationFormObj;
          form.setFieldsValue({
            action: selectedActionFormData,
            arrestType: selectedArrestFormData,
          });
        }
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
      if (
        actionType === "ARREST_UPDATE_SUCCESS" ||
        actionType === "ARREST_CREATE_SUCCESS"
      ) {
        dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
      }
    }
  }, [actionType]);

  const getArrestProcessResult = (label) => {
    const arrestProcessData = isArrest ? arrestOptions : actionOptions;
    const arrestProcessResult = first(
      arrestProcessData.filter((s) => s.label === label)
    )?.arrestProcess;
    return arrestProcessResult;
  };

  useEffect(() => {
    if (!isArrestRelated) {
      const { selectedActionFormData, selectedArrestFormData } =
        selectedInvestigationFormObj;
      setSelectedActionValue(selectedActionFormData);
      setSelectedArrestValue(selectedArrestFormData);
      setSelectedArrestType(selectedArrestFormData);
      form.setFieldsValue({
        action: selectedActionFormData,
        arrestType: selectedArrestFormData,
      });
    }
  }, [isArrestRelated, selectedInvestigationFormObj]);

  useEffect(() => {
    if (selectedActionValue) {
      if (!isArrest) {
        setArrestProcesses(getArrestProcessResult(selectedActionValue));
        setSelectedArrestType("");
      } else if (!isArrest && editArrestObj?._id) {
        setArrestProcesses(getArrestProcessResult(editArrestObj?.action));
        setSelectedArrestType("");
      } else if (isArrest && editArrestObj?._id) {
        setArrestProcesses(getArrestProcessResult(editArrestObj?.arrestType));
      } else {
        setArrestProcesses(
          getArrestProcessResult(selectedInvestigationFormObj?.label)
        );
      }
    }
  }, [selectedActionValue, selectedInvestigationFormObj]);

  useEffect(() => {
    dispatch(fetchArrest(`${config.arrest}?crimeId=${crimeId}`));
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      accusedCode: accusedPersonalDetails?.accusedCode,
    });
  }, [accusedPersonalDetails, form]);

  const goToArrest = () => {
    setSelectedActionValue(arrestOption.ARREST);
    setSelectedArrestType(arrestTypeOption.ARREST_BY_POLICE);
    setSelectedArrestValue(arrestTypeOption.ARREST_BY_POLICE);
    setArrestProcesses(
      getArrestProcessResult(arrestTypeOption.ARREST_BY_POLICE)
    );
    form.setFieldsValue({
      action: arrestOption.ARREST,
      arrestType: arrestTypeOption.ARREST_BY_POLICE,
    });
  };

  const savedMedicalCertificateURL = editArrestObj?.arrestByPolice
    ?.medicalExamination?.uploadMedicalCertificate
    ? editArrestObj?.arrestByPolice?.medicalExamination
        ?.uploadMedicalCertificate
    : {};

  const savedCourtConditionsURL = editArrestObj?.arrestOnAnticipatoryBail
    ?.uploadCourtConditions
    ? editArrestObj?.arrestOnAnticipatoryBail?.uploadCourtConditions
    : {};

  const savedCourtOrderDocumentURL = editArrestObj?.highCourtDirections
    ?.courtOrderDocumentURL
    ? editArrestObj?.highCourtDirections?.courtOrderDocumentURL
    : {};

  const savedNbwURL = editArrestObj?.accusedOutOfCountry?.requestCourtNBW
    ?.nbwURL
    ? editArrestObj?.accusedOutOfCountry?.requestCourtNBW?.nbwURL
    : {};

  const handleEditArrestDetails = (value) => {
    setarrestpoliceMedia(value?.arrestByPolice?.media);
    setSelectedCategory(value?.arrestByPolice?.media[0]?.category);
    editArrestDetails(
      value,
      setEditArrestObj,
      setSelectedActionValue,
      setSelectedArrestValue,
      setSelectedArrestType,
      setArrestProcesses,
      getArrestProcessResult,
      setIsInjured,
      setSelectedAccusedValue,
      setSelectedcircularStatus,
      setselectednbwStatus,
      form,
      setSelectedUploadMedicalCertificateUrl,
      setSelectedSuretyDetails,
      setSelectedUploadCourtConditionsUrl,
      setSelectedCourtOrderDocumentURL,
      setSelectedNbwURL
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const setSelectedArrestType = (val) => {
    setSelectedArrestValue(val);
    form.setFieldsValue({
      accusedCode: accusedPersonalDetails?.accusedCode,
    });
    switch (val) {
      case getLabelName(arrestOptions, 0):
        setArrestTypeData(arrestForms.arrestByPolice);
        setShowMedicalExamination(true);
        break;
      case getLabelName(arrestOptions, 1):
        setArrestTypeData(arrestForms.arrestByOtherPolice);
        setShowMedicalExamination(false);
        break;
      case getLabelName(arrestOptions, 2):
        setArrestTypeData(arrestForms.arrestOnBail);
        setShowMedicalExamination(false);
        break;
      case getLabelName(arrestOptions, 3):
        setArrestTypeData([]);
        setShowMedicalExamination(false);
        break;
      default:
        break;
    }
  };

  const selectAction = (val) => {
    setSelectedActionValue(val);
  };

  const selectAccused = (val) => {
    setSelectedAccusedValue(val);
  };

  const renderFieldsWithDropDown = (
    menuOptions,
    selectAction,
    width,
    id,
    disabled = false,
    multiple = null
  ) => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        mode={multiple}
        filterOption={(input, option) =>
          searchText &&
          option.props.label
            .toString()
            .toLowerCase()
            .indexOf(input.toString().toLowerCase()) >= 0
        }
        style={{ width: width || 250 }}
        onSelect={(item, option) => {
          option.props?.arrestprocess &&
            setArrestProcesses(option.props?.arrestprocess || []);
          selectAction && selectAction(option.label);
          checkFields();
        }}
        disabled={viewArrestDetails || disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option
              key={index}
              value={id ? item._id : item.label}
              label={item.label}
              arrestprocess={item.arrestProcess}
            >
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };
  const checkFields = async () => {
    const values = await form.validateFields();
    SetFormValid(
      !Object.values(values).every(
        (v) => v == null || (typeof v === "string" && v.trim() === "")
      )
    );
  };

  const createSurrenderBeforeCourtPayload = (values) => {
    const addArrestPayload = addSurrenderBeforeCourtPayload(
      values,
      crimeId,
      selectedSuretyDetails
    );
    const updateArrestPayload = updateSurrenderBeforeCourtPayload(
      values,
      crimeId,
      editArrestObj?._id ? editArrestObj?._id : null,
      selectedSuretyDetails
    );

    if (editArrestObj?._id) {
      dispatch(updateArrest(config.arrest, updateArrestPayload));
      form.resetFields();
    } else {
      dispatch(createArrest(config.arrest, addArrestPayload));
      form.resetFields();
    }
  };

  const createAccusedOutOfCountryPayload = (values) => {
    const nbwData = new FormData();
    nbwURL.forEach((file) => {
      nbwData.append("file", file.originFileObj);
    });
    nbwData.append("prefixFolder", crimeId);
    nbwData.append("folderPath", `${crimeId}/AccusedOutOfCountry/file`);

    if (!isEmpty(nbwURL)) {
      axios
        .post(`${config.fileUpload}/upload`, nbwData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addArrestPayload = addAccusedOutOfCountryPayload(
              values,
              crimeId,
              getFilePayload(payloadData)
            );
            const updateArrestPayload = updateAccusedOutOfCountryPayload(
              values,
              crimeId,
              editArrestObj?._id ? editArrestObj?._id : null,
              getFilePayload(payloadData)
            );

            if (editArrestObj?._id) {
              dispatch(updateArrest(config.arrest, updateArrestPayload));
              form.resetFields();
            } else {
              dispatch(createArrest(config.arrest, addArrestPayload));
              form.resetFields();
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(nbwURL)) {
      const addArrestPayload = addAccusedOutOfCountryPayload(
        values,
        crimeId,
        savedNbwURL
      );
      const updateArrestPayload = updateAccusedOutOfCountryPayload(
        values,
        crimeId,
        editArrestObj?._id ? editArrestObj?._id : null,
        savedNbwURL
      );

      if (editArrestObj?._id) {
        dispatch(updateArrest(config.arrest, updateArrestPayload));
        form.resetFields();
      } else {
        dispatch(createArrest(config.arrest, addArrestPayload));
        form.resetFields();
      }
    }
  };

  const createSurrenderInCourtPayload = (values) => {
    const addArrestPayload = addSurrenderInCourtPayload(
      values,
      crimeId,
      selectedSuretyDetails
    );
    const updateArrestPayload = updateSurrenderInCourtPayload(
      values,
      crimeId,
      editArrestObj?._id ? editArrestObj?._id : null,
      selectedSuretyDetails
    );

    if (editArrestObj?._id) {
      dispatch(updateArrest(config.arrest, updateArrestPayload));
      form.resetFields();
    } else {
      dispatch(createArrest(config.arrest, addArrestPayload));
      form.resetFields();
    }
  };

  const createHighCourtDirectionsPayload = (values) => {
    const courtOrderDocumentData = new FormData();
    courtOrderDocumentURL.forEach((file) => {
      courtOrderDocumentData.append("file", file.originFileObj);
    });
    courtOrderDocumentData.append("prefixFolder", crimeId);
    courtOrderDocumentData.append(
      "folderPath",
      `${crimeId}/HighCourtDirections/file`
    );

    if (!isEmpty(courtOrderDocumentURL)) {
      axios
        .post(`${config.fileUpload}/upload`, courtOrderDocumentData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addArrestPayload = addHighCourtDirectionsPayload(
              values,
              crimeId,
              getFilePayload(payloadData)
            );
            const updateArrestPayload = updateHighCourtDirectionsPayload(
              values,
              crimeId,
              editArrestObj?._id ? editArrestObj?._id : null,
              getFilePayload(payloadData)
            );

            if (editArrestObj?._id) {
              dispatch(updateArrest(config.arrest, updateArrestPayload));
              form.resetFields();
            } else {
              dispatch(createArrest(config.arrest, addArrestPayload));
              form.resetFields();
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(courtOrderDocumentURL)) {
      const addArrestPayload = addHighCourtDirectionsPayload(
        values,
        crimeId,
        savedCourtOrderDocumentURL
      );
      const updateArrestPayload = updateHighCourtDirectionsPayload(
        values,
        crimeId,
        editArrestObj?._id ? editArrestObj?._id : null,
        savedCourtOrderDocumentURL
      );

      if (editArrestObj?._id) {
        dispatch(updateArrest(config.arrest, updateArrestPayload));
        form.resetFields();
      } else {
        dispatch(createArrest(config.arrest, addArrestPayload));
        form.resetFields();
      }
    }
  };

  const createArrestOnSurrenderInPoliceStationPayload = (values) => {
    const addArrestPayload = addArrestOnSurrenderInPoliceStationPayload(
      values,
      crimeId,
      selectedSuretyDetails
    );
    const updateArrestPayload = updateArrestOnSurrenderInPoliceStationPayload(
      values,
      crimeId,
      editArrestObj?._id ? editArrestObj?._id : null,
      selectedSuretyDetails
    );

    if (editArrestObj?._id) {
      dispatch(updateArrest(config.arrest, updateArrestPayload));
      form.resetFields();
    } else {
      dispatch(createArrest(config.arrest, addArrestPayload));
      form.resetFields();
    }
  };

  const createArrestOnAnticipatoryBailPayload = (values) => {
    const uploadCourtConditionData = new FormData();
    uploadCourtConditionsUrl.forEach((file) => {
      uploadCourtConditionData.append("file", file.originFileObj);
    });
    uploadCourtConditionData.append("prefixFolder", crimeId);
    uploadCourtConditionData.append(
      "folderPath",
      `${crimeId}/ArrestOnAnticipatoryBail/file`
    );

    if (!isEmpty(uploadCourtConditionsUrl)) {
      axios
        .post(`${config.fileUpload}/upload`, uploadCourtConditionData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;
            const payloadData = first(data);
            const addArrestPayload = addArrestOnAnticipatoryBailPayload(
              values,
              crimeId,
              selectedSuretyDetails,
              getFilePayload(payloadData)
            );
            const updateArrestPayload = updateArrestOnAnticipatoryBailPayload(
              values,
              crimeId,
              editArrestObj?._id ? editArrestObj?._id : null,
              selectedSuretyDetails,
              getFilePayload(payloadData)
            );
            if (editArrestObj?._id) {
              dispatch(updateArrest(config.arrest, updateArrestPayload));
              form.resetFields();
            } else {
              dispatch(createArrest(config.arrest, addArrestPayload));
              form.resetFields();
            }
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(uploadMedicalCertificateUrl)) {
      const addArrestPayload = addArrestOnAnticipatoryBailPayload(
        values,
        crimeId,
        selectedSuretyDetails,
        savedCourtConditionsURL
      );
      const updateArrestPayload = updateArrestOnAnticipatoryBailPayload(
        values,
        crimeId,
        editArrestObj?._id ? editArrestObj?._id : null,
        selectedSuretyDetails,
        savedCourtConditionsURL
      );
      if (editArrestObj?._id) {
        dispatch(updateArrest(config.arrest, updateArrestPayload));
        form.resetFields();
      } else {
        dispatch(createArrest(config.arrest, addArrestPayload));
        form.resetFields();
      }
    }
  };

  const createArrestbyOtherPolicePayload = (values) => {
    const addArrestPayload = addArrestByOtherPolicePayload(values, crimeId);
    const updateArrestPayload = updateArrestbyOtherPolicePayload(
      values,
      crimeId,
      editArrestObj?._id ? editArrestObj?._id : null
    );
    if (editArrestObj?._id) {
      dispatch(updateArrest(config.arrest, updateArrestPayload));
      form.resetFields();
    } else {
      dispatch(createArrest(config.arrest, addArrestPayload));
      form.resetFields();
    }
  };

  const createArrestbyPolicePayload = (values) => {
    if (inputFileList.length === 0 || arrestpoliceMedia.length === 0) {
      openNotificationWithIcon("error", "Please Upload Image(s)");
    } else {
      var fileData = [];
      var fileSeavedData = [];
      const uploadMedicalCertificateData = new FormData();
      inputFileList.forEach((file) => {
        if (!file._id === false && !file.id === false) {
          uploadMedicalCertificateData.append("file", file.originFileObj);
          fileSeavedData.push(file);
        } else {
          fileData.push(file);
        }
      });
      uploadMedicalCertificateData.append("prefixFolder", crimeId);
      uploadMedicalCertificateData.append(
        "folderPath",
        `${crimeId}/${folderName.ARREST_BY_POLICE}/file`
      );
      const urlFormData = new FormData();
      const uploadMedicalCertificateUrlData =
        uploadMedicalCertificateUrl?.filter((data) => !!data?.name === true);
      uploadMedicalCertificateUrlData.forEach((file) => {
        urlFormData.append("file", file.originFileObj);
      });
      urlFormData.append("prefixFolder", crimeId);
      urlFormData.append(
        "folderPath",
        `${crimeId}/${folderName.ARREST_BY_POLICE}/file`
      );
      var person = getPersonDetails(personDetails, []);

      if (!isEmpty(fileSeavedData) && !isEmpty(uploadMedicalCertificateUrl)) {
        axios
          .all([
            axios.post(
              `${config.fileUpload}/upload`,
              uploadMedicalCertificateData
            ),
            axios.post(`${config.fileUpload}/upload`, urlFormData),
          ])
          .then(
            axios.spread((data1, data2) => {
              if (data1.status === 200 && data2.status === 200) {
                const payloadData = [...fileData, ...data1.data?.data];
                const payloadDataList = [];
                for (let i = 0; i < payloadData?.length; i++) {
                  for (let j = 0; j < inputFileList?.length; j++) {
                    if (payloadData[i]?.name === inputFileList[j]?.name) {
                      payloadDataList.push({
                        ...payloadData[i],
                        category: inputFileList[j]?.category,
                      });
                    }
                  }
                }
                const payloadData1 = data2.data?.data;
                const addArrestPayload = addArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  payloadDataList,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                const updateArrestPayload = updateArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  editArrestObj?._id ? editArrestObj?._id : null,
                  payloadDataList,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                if (editArrestObj?._id) {
                  dispatch(updateArrest(config.arrest, updateArrestPayload));
                  form.resetFields();
                } else {
                  dispatch(createArrest(config.arrest, addArrestPayload));
                  form.resetFields();
                }
              }
            })
          )
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
          });
      } else if (
        isEmpty(fileSeavedData) ||
        isEmpty(uploadMedicalCertificateUrl)
      ) {
        if (isEmpty(fileSeavedData) && !isEmpty(uploadMedicalCertificateUrl)) {
          axios
            .post(`${config.fileUpload}/upload`, urlFormData)
            .then((res) => {
              if (res.status === 200) {
                const { data } = res.data;
                const payloadData = arrestpoliceMedia;
                const payloadData1 = data;
                var addArrestPayload = addArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  payloadData,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                var updateArrestPayload = updateArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  editArrestObj?._id ? editArrestObj?._id : null,
                  payloadData,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                if (editArrestObj?._id) {
                  dispatch(updateArrest(config.arrest, updateArrestPayload));
                  form.resetFields();
                } else {
                  dispatch(createArrest(config.arrest, addArrestPayload));
                  form.resetFields();
                }
              }
            })
            .catch((err) => {
              getMediaUploadError(err, openNotificationWithIcon);
            });
        } else if (
          !isEmpty(fileSeavedData) &&
          isEmpty(uploadMedicalCertificateUrl)
        ) {
          axios
            .post(`${config.fileUpload}/upload`, uploadMedicalCertificateData)
            .then((res) => {
              if (res.status === 200) {
                const { data } = res.data;
                const payloadData1 = savedMedicalCertificateURL;
                const payloadData = [...fileData, ...data];
                const payloadDataList = [];
                for (let i = 0; i < payloadData?.length; i++) {
                  for (let j = 0; j < inputFileList?.length; j++) {
                    if (payloadData[i]?.name === inputFileList[j]?.name) {
                      payloadDataList.push({
                        ...payloadData[i],
                        category: inputFileList[j]?.category,
                      });
                    }
                  }
                }
                const addArrestPayload = addArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  payloadDataList,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                const updateArrestPayload = updateArrestbyPolicePayload(
                  values,
                  person,
                  crimeId,
                  editArrestObj?._id ? editArrestObj?._id : null,
                  payloadDataList,
                  payloadData1,
                  selectedSuretyDetails,
                  selectedCategory
                );
                if (editArrestObj?._id) {
                  dispatch(updateArrest(config.arrest, updateArrestPayload));
                  form.resetFields();
                } else {
                  dispatch(createArrest(config.arrest, addArrestPayload));
                  form.resetFields();
                }
              }
            })
            .catch((err) => {
              getMediaUploadError(err, openNotificationWithIcon);
            });
        } else {
          const addArrestPayload = addArrestbyPolicePayload(
            values,
            person,
            crimeId,
            arrestpoliceMedia,
            savedMedicalCertificateURL,
            selectedSuretyDetails,
            selectedCategory
          );
          const updateArrestPayload = updateArrestbyPolicePayload(
            values,
            person,
            crimeId,
            editArrestObj?._id ? editArrestObj?._id : null,
            arrestpoliceMedia,
            savedMedicalCertificateURL,
            selectedSuretyDetails,
            selectedCategory
          );

          if (editArrestObj?._id) {
            dispatch(updateArrest(config.arrest, updateArrestPayload));
            form.resetFields();
          } else {
            dispatch(createArrest(config.arrest, addArrestPayload));
            form.resetFields();
          }
        }
      }
    }
  };

  const submit = async () => {
    const values = await form.validateFields();
    if (values.action === arrestOption.SURRENDER_BEFORE_COURT) {
      createSurrenderBeforeCourtPayload(values);
    } else if (values.action === arrestOption.ACCUSED_OUT_OF_COUNTRY) {
      createAccusedOutOfCountryPayload(values);
    } else if (values.action === arrestOption.SURRENDER_IN_COURT) {
      createSurrenderInCourtPayload(values);
    } else if (values.action === arrestOption.HIGH_COURT_DIRECTIONS) {
      createHighCourtDirectionsPayload(values);
    } else if (values.arrestType === arrestTypeOption.ARREST_BY_POLICE) {
      createArrestbyPolicePayload(values);
    } else if (values.arrestType === arrestTypeOption.ARREST_BY_OTHER_POLICE) {
      createArrestbyOtherPolicePayload(values);
    } else if (
      values.arrestType === arrestTypeOption.ARREST_ON_ANTICIPATORY_BAIL
    ) {
      createArrestOnAnticipatoryBailPayload(values);
    } else if (
      values.arrestType ===
      arrestTypeOption.ARREST_ON_SURRENDER_IN_POLICE_STATION
    ) {
      createArrestOnSurrenderInPoliceStationPayload(values);
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
    editArrestObj,
    selectedFileName,
    selectedFir,
    currentUser,
    accusedPersonalDetails,
    savedFir
  );

  const disableFormData =
    (isEmpty(getAccusedData()) || isEmpty(getAccusedDropdownData())) &&
    !displayArrestList;

  console.log("Accusedcrpc41AList", crpc41AList);

  const getSavedDataFor41Crpc = () => {
    let savedData = [];
    isArray(crpc41AList) &&
      !isEmpty(crpc41AList) &&
      // eslint-disable-next-line array-callback-return
      crpc41AList.map((data) => {
        if (data?.accusedId?.personalDetails?.age >= 18) {
          const { personalDetails, presentAddress } =
            !isUndefined(data?.accusedId) &&
            !isNull(data?.accusedId) &&
            data?.accusedId;
          savedData.push(
            getSavedDataResult(data, personalDetails, presentAddress, [])
          );
        }
      });
    return savedData;
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  return (
    <ArrestWrapper>
      <ContentHeader
        headerTitle={
          displayArrestList
            ? "Arrest Related"
            : selectedInvestigationFormObj?.label
        }
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={
          selectedAccusedValue === "" ||
          (isBoolean(dateAndTimeOfArrestIsValid) &&
            !dateAndTimeOfArrestIsValid) ||
          disableForm
        }
        setAddAnother={setAddAnother}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Form form={form} layout="vertical">
            <div className="widgetPageStyle">
              <Col span={17}>
                <Card className="cardLeftStyle">
                  <div className="widgetPageStyle">
                    <Col span={8}>
                      <Form.Item
                        name="accusedId"
                        label="Select Accused"
                        rules={[
                          { required: true, message: "Please Select Accused!" },
                        ]}
                      >
                        {renderFieldsWithDropDown(
                          editArrestObj?._id
                            ? getAccusedData()
                            : getAccusedDropdownData(),
                          selectAccused,
                          null,
                          true,
                          editArrestObj?._id ||
                            isEmpty(getAccusedData()) ||
                            isEmpty(getAccusedDropdownData())
                        )}
                      </Form.Item>
                      {selectedAccusedValue !== "" && (
                        <AccusedCard
                          accusedPersonalDetails={accusedPersonalDetails}
                          title="Accused Details"
                        />
                      )}
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="action"
                        label="Select Action"
                        rules={[
                          { required: true, message: "Please Select Action!" },
                        ]}
                      >
                        {renderFieldsWithDropDown(
                          actionOptions,
                          selectAction,
                          null,
                          false,
                          editArrestObj?._id ||
                            isEmpty(getAccusedDropdownData())
                        )}
                      </Form.Item>
                    </Col>
                  </div>
                  {isArrest ? (
                    <ArrestContainer
                      arrestOptions={arrestForms.arrestOptions}
                      accusedPersonalDetails={accusedPersonalDetails}
                      selectedArrestValue={selectedArrestValue}
                      setSelectedArrestType={setSelectedArrestType}
                      renderFieldsWithDropDown={renderFieldsWithDropDown}
                      arrestTypeData={arrestTypeData}
                      showMedicalExamination={showMedicalExamination}
                      checkFields={checkFields}
                      viewArrestDetails={
                        viewArrestDetails || disableFormData || disableForm
                      }
                      setViewArrestDetails={setViewArrestDetails}
                      selectedRecord={editArrestObj}
                      goToArrest={goToArrest}
                      isRapeCase={
                        selectedFir && selectedFir?.minorHead === "Rape"
                      }
                      form={form}
                      setDateTimeOfCustody={setDateTimeOfCustody}
                      setDateAndTimeOfArrest={setDateAndTimeOfArrest}
                      dateAndTimeOfArrestIsValid={dateAndTimeOfArrestIsValid}
                      setOtherStateSelected={setOtherStateSelected}
                      otherStateSelected={otherStateSelected}
                      isInjured={isInjured}
                      setIsInjured={setIsInjured}
                      setSelectedSiderMenu={setSelectedSiderMenu}
                      setPerson={setPersonDetails}
                      disableTypeOption={!displayArrestList}
                      fileList={
                        editArrestObj?._id &&
                        savedMedicalCertificateURL &&
                        savedMedicalCertificateURL?.url !== ""
                          ? selectedUploadMedicalCertificateUrl
                          : uploadMedicalCertificateUrl
                      }
                      actionName={setUploadMedicalCertificateUrl}
                      disableUpload={
                        viewArrestDetails ||
                        !isEmpty(uploadMedicalCertificateUrl)
                      }
                      suretyDetailsForm={suretyDetailsForm}
                      selectedSuretyDetails={selectedSuretyDetails}
                      setSelectedSuretyDetails={setSelectedSuretyDetails}
                      isSuretyDetailsModalVisible={isSuretyDetailsModalVisible}
                      viewEditObj={viewEditObj}
                      setviewEditObj={setviewEditObj}
                      viewEditObjIndex={viewEditObjIndex}
                      setviewEditObjIndex={setviewEditObjIndex}
                      setIsSuretyDetailsModalVisible={
                        setIsSuretyDetailsModalVisible
                      }
                      submit={submit}
                      age={age}
                      setAge={setAge}
                      inputList={inputList}
                      setInputList={setInputList}
                      setUploadCourtConditionsUrl={setUploadCourtConditionsUrl}
                      bailOrderFileList={
                        editArrestObj?._id &&
                        savedCourtConditionsURL?.url !== ""
                          ? selectedUploadCourtConditionsUrl
                          : uploadCourtConditionsUrl
                      }
                    />
                  ) : null}

                  {isSurrenderInCourt && (
                    <SurrenderInCourt
                      renderFieldsWithDropDown={renderFieldsWithDropDown}
                      checkFields={checkFields}
                      selectedRecord={editArrestObj}
                      disabled={
                        viewArrestDetails || disableFormData || disableForm
                      }
                      form={form}
                      suretyDetailsForm={suretyDetailsForm}
                      selectedSuretyDetails={selectedSuretyDetails}
                      setSelectedSuretyDetails={setSelectedSuretyDetails}
                      isSuretyDetailsModalVisible={isSuretyDetailsModalVisible}
                      setIsSuretyDetailsModalVisible={
                        setIsSuretyDetailsModalVisible
                      }
                      viewEditObj={viewEditObj}
                      setviewEditObj={setviewEditObj}
                      viewEditObjIndex={viewEditObjIndex}
                      setviewEditObjIndex={setviewEditObjIndex}
                      age={age}
                      setAge={setAge}
                      inputList={inputList}
                      setInputList={setInputList}
                    />
                  )}

                  {isHighCourtDirections && (
                    <HighCourtDirections
                      renderFieldsWithDropDown={renderFieldsWithDropDown}
                      checkFields={checkFields}
                      selectedRecord={editArrestObj?.highCourtDirections}
                      disabled={
                        viewArrestDetails || disableFormData || disableForm
                      }
                      form={form}
                      setCourtOrderDocumentURL={setCourtOrderDocumentURL}
                      fileList={
                        editArrestObj?._id &&
                        savedCourtOrderDocumentURL?.url !== ""
                          ? selectedCourtOrderDocumentURL
                          : courtOrderDocumentURL
                      }
                    />
                  )}

                  {isAccusedOutOfCountry && (
                    <AccusedOutOfCountry
                      renderFieldsWithDropDown={renderFieldsWithDropDown}
                      checkFields={checkFields}
                      selectedRecord={editArrestObj?.accusedOutOfCountry}
                      disabled={
                        viewArrestDetails || disableFormData || disableForm
                      }
                      selectednbwStatus={selectednbwStatus}
                      selectedcircularStatus={selectedcircularStatus}
                      setselectednbwStatus={setselectednbwStatus}
                      setSelectedcircularStatus={setSelectedcircularStatus}
                      form={form}
                      setNbwURL={setNbwURL}
                      fileList={
                        editArrestObj?._id && savedNbwURL?.url !== ""
                          ? selectedNbwURL
                          : nbwURL
                      }
                    />
                  )}

                  {isSurrenderBeforeCourt && (
                    <SurrenderBeforeCourt
                      renderFieldsWithDropDown={renderFieldsWithDropDown}
                      checkFields={checkFields}
                      selectedRecord={editArrestObj?.surrenderBeforeCourt}
                      disabled={
                        viewArrestDetails || disableFormData || disableForm
                      }
                      form={form}
                      selectedSuretyDetails={selectedSuretyDetails}
                      setSelectedSuretyDetails={setSelectedSuretyDetails}
                      isSuretyDetailsModalVisible={isSuretyDetailsModalVisible}
                      setIsSuretyDetailsModalVisible={
                        setIsSuretyDetailsModalVisible
                      }
                      suretyDetailsForm={suretyDetailsForm}
                      inputList={inputList}
                      setInputList={setInputList}
                      viewEditObj={viewEditObj}
                      setviewEditObj={setviewEditObj}
                      viewEditObjIndex={viewEditObjIndex}
                      setviewEditObjIndex={setviewEditObjIndex}
                      age={age}
                      setAge={setAge}
                    />
                  )}
                </Card>
              </Col>
              <Col span={7}>
                <Card className="right-section cardRightStyle">
                  {!isEmpty(arrestProcess) && (
                    <DisplayArrestReportGenerations
                      templateLists={arrestProcess}
                      showModal={showModal}
                      crimeId={editArrestObj?.crimeId}
                      selectedModule={selectedActionValue}
                      selectedSubModule={selectedArrestValue}
                      selectedRecord={editArrestObj}
                      category="Templates"
                      actionName={uploadTemplates}
                      actionUrl={config.templatesUpload}
                    />
                  )}
                  {selectedArrestValue === arrestTypeOption.ARREST_BY_POLICE ? (
                    <div
                      style={{
                        marginLeft: 10,
                        marginTop: 30,
                        marginBottom: 20,
                      }}
                    >
                      <UploadForm
                        colWidth={22}
                        enableMediaManager={true}
                        setInputFileList={setInputFileList}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={(item) =>
                          setSelectedCategory(item)
                        }
                        disabled={
                          viewArrestDetails || disableFormData || disableForm
                        }
                        inputFileList={arrestpoliceMedia}
                        categoryListData={[
                          { label: "Full image" },
                          { label: "Passport size image" },
                          { label: "Left side image" },
                          { label: "Right side image" },
                        ]}
                        categoryListDisplay={
                          !!selectedCategory === true ? true : false
                        }
                        setarrestpoliceMedia={setarrestpoliceMedia}
                        validationField={true}
                      />
                    </div>
                  ) : null}
                  <OtherLinks setSelectedSiderMenu={setSelectedSiderMenu} />
                  {displayArrestList && !isEmpty(crpc41AList) ? (
                    <>
                      <Button
                        style={{ marginTop: "40px", width: "100%" }}
                        onClick={() => setIsRecordModalVisible(true)}
                      >
                        41A Cr.P.C Issued List
                      </Button>
                      <Modal
                        title="41A Cr.P.C Records"
                        visible={isRecordsModalVisible}
                        onOk={() => setIsRecordModalVisible(false)}
                        onCancel={() => setIsRecordModalVisible(false)}
                        style={{ minWidth: "95vw" }}
                        footer={null}
                      >
                        <div style={{ maxHeight: 650, overflowY: "auto" }}>
                          <Saved41CrpcRecords
                            dataSource={getSavedDataFor41Crpc()}
                          />
                        </div>
                      </Modal>
                    </>
                  ) : null}
                  {displayArrestList && !isEmpty(arrestList) ? (
                    <ArrestList
                      isDisplayed={false}
                      minHeight="650"
                      showRecords={true}
                      setviewEditObj={setviewEditObj}
                      setviewEditObjIndex={setviewEditObjIndex}
                      records={arrestList}
                      editArrestDetails={handleEditArrestDetails}
                      selectedRecord={editArrestObj}
                      setViewArrestDetails={setViewArrestDetails}
                    />
                  ) : null}
                </Card>
              </Col>
            </div>
          </Form>
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
        </>
      )}
    </ArrestWrapper>
  );
}
