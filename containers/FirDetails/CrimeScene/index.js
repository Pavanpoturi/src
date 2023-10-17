import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Form,
  Modal,
  notification,
  Select,
  Row,
  Upload,
} from "antd";
import UploadForm from "@components/Common/uploadForm";
import { DATE_TIME_FORMAT_WITHOUT_SECONDS } from "@containers/FirDetails/fir-util";
import { first, isArray, isEmpty, isNull, isUndefined } from "lodash";
import {
  CaretDownOutlined,
  DoubleRightOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import firActions from "@redux/fir/actions";
import { config } from "@config/site.config";
import { loadState } from "@lib/helpers/localStorage";
import { disableFutureDates } from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import mediaManagerActions from "@redux/fir/mediaManager/actions";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import moment from "moment";
import RoughSketchUpload from "./RoughSketchUpload";
import CrimeLocation from "../CommonSections/SceneofOffense";
import PanchWitness from "../CommonSections/PanchWitness";
import PanchWitnessList from "../CommonSections/PanchWitness/PanchWitnessList";
import WitnessDetails from "../CommonSections/WitnessDetails";
import SavedWitnessDetailsRecords from "../CommonSections/WitnessDetails/SavedRecords";
import SceneofOffenseList from "../CommonSections/SceneofOffense/SceneofOffenseList";
import ExpertTeamDetails from "./ExpertTeamDetails";
import ExpertTeamSavedRecords from "./ExpertTeamDetails/ExpertTeamSavedRecords";
import CrimeClassification from "./CrimeClassification";
import MaterialObjects from "../CommonSections/MaterialObjects";
import CrimeScenePhotographs from "./CrimeScenePhotographs";
import RoughSketch from "./RoughSketch";
import SavedRecords from "../CommonSections/MaterialObjects/SavedRecords";
import {
  crimeClassificationSubmit,
  expertTeamSubmit,
  getPanelTitle,
  getSavedExpertTeamData,
  getSavedMaterialObjectData,
  getSavedWitnessDetailsData,
  handleSubmitRequest,
  isError,
  isSuccess,
  materialObjectSubmit,
  panchWitnessSubmit,
  submitRoughSketchUpload,
  witnessDetailsSubmit,
} from "./crimeSceneHelper";
import PrintCrimeModal from "./PrintCrimeModal";
import axios from "axios";
import { folderName } from "@containers/FirDetails/fir-util";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";
import VehicaleDetalsPopUp from "./VehicaleDetalsPopUp";

const { Panel } = Collapse;
const { confirm } = Modal;

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
    marginLeft: 20,
  },
};
const Option = Select.Option;

export default function CrimeScene(props) {
  const [header] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const { createAuditHistory } = auditHistoryActions;
  const { savedFir } = useSelector((state) => state.createFIR);
  const dispatch = useDispatch();
  const {
    updateCrimeLocation,
    createCrimeLocation,
    updatePunchWitness,
    updateWitnessStatement,
    addExpertTeam,
    updateExpertTeam,
    updateRoughSketch,
    createMaterialObject,
    addUpdateCrimeClassification,
    fetchExpertTeamList,
    fetchCrimeLocation,
    fetchMaterialObjectList,
    fetchWitnessDetailsList,
    fetchPanchWitnessList,
    fetchCrimeClassification,
    getCrimeClassification,
    fetchRoughSketchList,
    editPunchWitness,
    editWitnessStatement,
    editMaterialObject,
    fetchCrimeScenePhotographsList,
    updateCrimeScenePhotographsList,
    updateSelectedCrimeSceneDate,
    resetCrimeClassification,
  } = firActions;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { resetTemplatesActionType, uploadTemplates } = mediaManagerActions;
  const [selectedWitnessButton, setSelectedWitnessButton] =
    useState("Panch Witness");
  const [editExpertTeamObj, setEditExpertTeamObj] = useState(null);
  const [viewExpertTeamDetails, setViewExpertTeamDetails] = useState(false);
  const [editPanchWitnessObj, seteditPanchWitnessObj] = useState(null);
  const [editWitnessDetailsObj, setEditWitnessDetailsObj] = useState(null);
  const [editMaterialObjectObj, seteditMaterialObjectObj] = useState(null);
  const [editSceneofOffenseObj, setEditSceneofOffenseObj] = useState(null);
  const [viewWitnessDetails, setViewWitnessDetails] = useState(false);
  const [viewPanchWitness, setViewPanchWitness] = useState(false);
  const [viewSceneofOffense, setViewSceneofOffense] = useState(false);
  const [viewMaterialObjectDetails, setViewMaterialObjectDetails] =
    useState(false);
  const [addAddress, setAddAddress] = useState(null);
  const [sceneofoffenseForm] = Form.useForm();
  const [panchWitnessForm] = Form.useForm();
  const [materialObjectForm] = Form.useForm();
  const [witnessDetailsForm] = Form.useForm();
  const [expertTeamForm] = Form.useForm();
  const [roughSketchFiles, setRoughSketchFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [punchwitnessinputList, setPunchwitnessInputList] = useState([]);
  const [witnessDetailsInputList, setWitnessDetailsInputList] = useState([]);
  const [crimeSceneDate, setCrimeSceneDate] = useState(null);
  const [roughSketchPhotos, setRoughSketchPhotos] = useState({
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: [],
  });
  const [isWitnessDetailsModalVisible, setIsWitnessDetailsModalVisible] =
    useState(false);
  const [isMaterialObjectModalVisible, setIsMaterialObjectModalVisible] =
    useState(false);
  const [inputFileList, setInputFileList] = useState([]);
  const [seizureReport, setSeizureReport] = useState([]);
  const [panchWitnessFileList, setPanchWitnessFileList] = useState([]);
  const [selectedSeizureReport, setSelectedSeizureReport] = useState([]);
  const [selectedMaterialCategory, setSelectedMaterialCategory] =
    useState("materialObjects");
  const [selectedExpertTeamCategory, setSelectedExpertTeamCategory] =
    useState("expertTeam");
  const [selectedWitnessDetailsCategory, setSelectedWitnessDetailsCategory] =
    useState("witnessDetails");
  const [serchText, setSerchText] = useState("");
  const [crimeDates, setCrimeDates] = useState([]);
  const [newSceneOfOffence, setNewSceneOfOffence] = useState(false);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [cdfUploadFileListState, setCdfUploadFileListState] = useState([]);
  const [imageUpload, setImageUpload] = useState([]);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [vehiclesDetails, setVehiclesDetails] = useState([]);
  const [vehiclePopupDetails, setVehiclePopupDetails] = useState([]);

  const {
    actionType,
    auditType,
    successMessage,
    errorMessage,
    expertTeamList,
    crimeLocation,
    panchWitnessList,
    witnessStatementList,
    materialObjectList,
    roughSketchList,
    crimeclassification_,
    isFetching,
    crimeScenePhotographsList,
  } = useSelector((state) => state.FIR);

  const { uploadSuccessMessage, uploadActionType, uploadErrorMessage } =
    useSelector((state) => state.MediaManager);

  const isSuccessUpload = uploadActionType === "UPLOAD_MEDIA_SUCCESS";
  const isErrorUpload = uploadActionType === "UPLOAD_MEDIA_ERROR";

  const { uploadCDFSheet } = crimeSceneActions;
  const { vehicleDetails } = useSelector((state) => state.CrimeScene);

  const auditHistoryEntry = () => {
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(crimeId, "firDetails/crimeScene", auditType)
      )
    );
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  useEffect(() => {
    if (!isUndefined(vehicleDetails) && !isEmpty(vehicleDetails)) {
      if (showVehicleDetails === "fetch") {
        setVehiclePopupDetails([vehicleDetails]);
      }
    }
  }, [vehicleDetails]);

  useEffect(() => {
    dispatch(resetCrimeClassification());
  }, []);

  useEffect(() => {
    if (showVehicleDetails) {
      if (showVehicleDetails === "view") {
        setVehiclePopupDetails(vehiclesDetails);
      } else if (showVehicleDetails === "fetch") {
        setVehiclePopupDetails([{}]);
      }
    }
  }, [showVehicleDetails]);

  useEffect(() => {
    setRoughSketchPhotos({
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      fileList: roughSketchList,
    });
  }, [roughSketchList]);

  useEffect(() => {
    if (isSuccessUpload || isErrorUpload) {
      if (
        uploadSuccessMessage === "File Uploaded Successfully" &&
        uploadActionType === "UPLOAD_MEDIA_SUCCESS"
      ) {
        openNotificationWithIcon("success", uploadSuccessMessage);
        dispatch(resetTemplatesActionType());
        setInputFileList([]);
      } else if (
        uploadErrorMessage &&
        uploadActionType === "UPLOAD_MEDIA_ERROR"
      ) {
        openNotificationWithIcon("error", uploadErrorMessage);
        dispatch(resetTemplatesActionType());
      }
    }
  }, [uploadActionType]);

  const getCrimeLocation = () => {
    dispatch(
      fetchCrimeLocation(
        `${config.getPostCrimeSceneDetails}/CRIMELOCATION/?crimeId=${crimeId}`
      )
    );
  };

  const handleVehicleDetailsAdd = () => {
    if (
      !vehiclesDetails.some(
        (item) => item.chassisNo === vehicleDetails.chassisNo
      )
    ) {
      setVehiclesDetails([...vehiclesDetails, vehicleDetails]);
    }
    setShowVehicleDetails(false);
  };

  const getPanchWitnessList = () => {
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  const getWitnessDetailsList = () => {
    dispatch(
      fetchWitnessDetailsList(
        `${config.getPostCrimeSceneDetails}/WITNESSDETAILS/?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  const getMaterialObjectList = () => {
    dispatch(
      fetchMaterialObjectList(
        `${config.getPostCrimeSceneDetails}/MATERIALOBJECTS/?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  const selectedAddressID = useMemo(() => {
    if (isArray(crimeLocation) && !isEmpty(crimeSceneDate)) {
      const selectedSceneOfOffence = crimeLocation.find(
        (l) => l.userDate === crimeSceneDate
      );
      return selectedSceneOfOffence?.address?._id;
    }
    return "";
  }, [crimeLocation, crimeSceneDate]);

  const getCrimeClassificationList = () => {
    if (!isEmpty(selectedAddressID)) {
      const url = `${config.getPostCrimeSceneDetails}/CLASSIFICATION?crimeId=${crimeId}&address=${selectedAddressID}`;
      dispatch(getCrimeClassification(url));
    }
  };

  const getCrimeClassificationData = () => {
    const crimeUrl = `${config.getPostCrimeSceneDetails}/CLASSIFICATION?crimeId=${crimeId}`;
    dispatch(fetchCrimeClassification(crimeUrl));
  };

  const getExpertTeamList = () => {
    dispatch(
      fetchExpertTeamList(
        `${config.getPostCrimeSceneDetails}/EXPERTTEAM/?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  const getRoughSketchList = () => {
    dispatch(
      fetchRoughSketchList(
        `${config.getPostCrimeSceneDetails}/ROUGHSKETCH?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  const getCrimeScenePhotographs = () => {
    dispatch(
      fetchCrimeScenePhotographsList(
        `${config.getCrimeScenePhotos}?crimeId=${crimeId}&date=${crimeSceneDate}`
      )
    );
  };

  //TO-DO: Need to clean this
  useEffect(() => {
    if (isSuccess(actionType) || isError(actionType)) {
      if (
        successMessage === "successfully updated" ||
        successMessage === "successfully created" ||
        successMessage === "successfully added" ||
        successMessage === "successfully added/updated" ||
        successMessage === "Rought Sketch added." ||
        successMessage === "Crime Scene Photographs Added" ||
        successMessage === "Scene Of Offence Created Successfully."
      ) {
        openNotificationWithIcon("success", successMessage);
        if (successMessage === "Scene Of Offence Created Successfully.") {
          setCrimeSceneDate(null);
        }
        auditHistoryEntry();
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
      }
      if (
        actionType === "CRIMELOCATION_UPDATE_SUCCESS" ||
        actionType === "CRIMELOCATION_CREATE_SUCCESS" ||
        actionType === "MATERIALOBJECT_UPDATE_SUCCESS" ||
        actionType === "MATERIALOBJECT_EDIT_SUCCESS"
      ) {
        getCrimeLocation();
      }
      if (
        actionType === "PANCHWITNESS_UPDATE_SUCCESS" ||
        actionType === "PANCHWITNESS_EDIT_SUCCESS"
      ) {
        getPanchWitnessList();
      }
      if (
        actionType === "WITNESS_UPDATE_SUCCESS" ||
        actionType === "WITNESS_EDIT_SUCCESS"
      ) {
        getWitnessDetailsList();
      }
      if (
        actionType === "MATERIALOBJECT_UPDATE_SUCCESS" ||
        actionType === "MATERIALOBJECT_EDIT_SUCCESS"
      ) {
        getMaterialObjectList();
      }
      if (
        actionType === "EXPERTTEAM_UPDATE_SUCCESS" ||
        actionType === "EXPERTTEAM_ADD_SUCCESS"
      ) {
        getExpertTeamList();
      }
      if (actionType === "CRIMECLASSIFICATION_UPDATE_SUCCESS") {
        getCrimeClassificationList();
        getCrimeClassificationData();
      }
      if (actionType === "ROUGHSKETCH_UPDATE_SUCCESS") {
        getRoughSketchList();
      }
      if (actionType === "UPDATE_CRIME_SCENE_PHOTOGRAPHS_SUCCESS") {
        getCrimeScenePhotographs();
      }
      setInputFileList([]);
    }
  }, [actionType]);

  useEffect(() => {
    if (!isEmpty(crimeSceneDate)) {
      getExpertTeamList();
      getCrimeLocation();
      getMaterialObjectList();
      getWitnessDetailsList();
      getPanchWitnessList();
      getRoughSketchList();
      getCrimeScenePhotographs();
      getCrimeClassificationList();
    }
  }, [crimeSceneDate]);

  useEffect(() => {
    getCrimeLocation();
    // getCrimeClassificationList();
  }, []);

  useEffect(() => {
    const currentData =
      crimeLocation && crimeLocation.length > 0
        ? crimeLocation?.filter((x) => !x.sceneRecreated)
        : [];
    if (!isEmpty(currentData) && currentData.length > 0) {
      let list = [];
      currentData.map((item, index) => {
        list.push({
          label: `Scene of Offence ${index + 1}`,
          id: item.userDate,
        });
      });
      setCrimeDates(list);
      let data =
        crimeLocation && crimeLocation.length > 0
          ? crimeLocation?.filter((x) => x.userDate === crimeSceneDate)
          : [];
      if (!isEmpty(data)) {
        setEditSceneofOffenseObj(first(data));
        setViewSceneofOffense(true);
      }
    }
  }, [crimeLocation]);

  const handleCrimeLocationSubmit = (values) => {
    handleSubmitRequest(
      crimeId,
      values,
      crimeSceneDate,
      editSceneofOffenseObj,
      dispatch,
      updateCrimeLocation,
      createCrimeLocation,
      getSelectedCrimeLocation,
      setNewSceneOfOffence
    );
  };

  const handlePanchWitnessSubmit = (values) => {
    panchWitnessSubmit(
      values,
      crimeId,
      punchwitnessinputList,
      crimeSceneDate,
      editPanchWitnessObj,
      dispatch,
      editPunchWitness,
      updatePunchWitness
    );
  };

  const handleWitnessSubmit = (values) => {
    witnessDetailsSubmit(
      values,
      crimeId,
      inputFileList,
      editWitnessDetailsObj,
      selectedCategory,
      witnessDetailsInputList,
      crimeSceneDate,
      dispatch,
      editWitnessStatement,
      updateWitnessStatement,
      openNotificationWithIcon
    );
  };

  const handleRoughSketchUpload = () =>
    submitRoughSketchUpload(
      roughSketchFiles,
      crimeId,
      selectedCategory,
      dispatch,
      updateRoughSketch,
      openNotificationWithIcon,
      crimeSceneDate,
      setRoughSketchFiles
    );

  const handlePhotographsSubmit = (addPayload) => {
    dispatch(
      updateCrimeScenePhotographsList(config.updateCrimeScenePhotos, addPayload)
    );
  };

  const editPanchWitness = (value) => {
    seteditPanchWitnessObj(value);
  };

  const handleEditWitnessDetails = (value) => {
    setEditWitnessDetailsObj(value);
  };

  const handleEditMaterialObject = (value) => {
    seteditMaterialObjectObj(value);
    if (
      !isUndefined(value.seizureReport?.url) &&
      value.seizureReport?.url !== ""
    ) {
      setSelectedSeizureReport([
        {
          url: value?.seizureReport?.url,
          name: value?.seizureReport?.name,
          fileId: value?.seizureReport?.fileId,
        },
      ]);
    } else {
      setSelectedSeizureReport([]);
    }
  };

  const handleEditSceneOfOffense = (value) => {
    setCrimeSceneDate(value.userDate);
    setEditSceneofOffenseObj(value);
  };

  const handleExpertTeamSubmit = (values) => {
    expertTeamSubmit(
      values,
      crimeId,
      inputFileList,
      crimeSceneDate,
      selectedCategory,
      editExpertTeamObj,
      dispatch,
      updateExpertTeam,
      addExpertTeam,
      openNotificationWithIcon
    );
  };

  const savedSeizureReportURL = editMaterialObjectObj?.seizureReport?.url
    ? editMaterialObjectObj?.seizureReport.name
    : "";

  const handleMaterialObjectSubmit = (values) => {
    materialObjectSubmit(
      values,
      crimeId,
      crimeSceneDate,
      inputFileList,
      seizureReport,
      editMaterialObjectObj,
      selectedCategory,
      addAddress,
      dispatch,
      editMaterialObject,
      createMaterialObject,
      setSeizureReport,
      openNotificationWithIcon
    );
  };

  const handleCrimeClassificationSubmit = (
    values,
    classificationType,
    photographsTaken,
    selectedPerson
  ) => {
    crimeClassificationSubmit(
      values,
      classificationType,
      photographsTaken,
      selectedPerson,
      crimeId,
      dispatch,
      addUpdateCrimeClassification,
      selectedAddressID
    );
  };

  const handlePanchWitnessUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setPanchWitnessFileList(fileList);
  };

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  const handleEditExpertTeam = (value) => {
    if (value) {
      setEditExpertTeamObj(value);
      expertTeamForm.setFieldsValue({
        name: value?.name,
        role: value?.role,
        initialObservation: value?.observation,
        files: value?.files,
      });
    }
  };

  const getSelectedCrimeLocation = () => {
    return crimeLocation && crimeLocation.length > 0
      ? crimeLocation?.filter((x) => x.userDate === crimeSceneDate)
      : [];
  };

  const createScene = () => {
    sceneofoffenseForm.resetFields();
    setEditSceneofOffenseObj(null);
    setCrimeSceneDate(null);
    setNewSceneOfOffence(true);
    setViewSceneofOffense(false);
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const showUploadDialog = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const renderFieldsWithDropDown = (
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
        style={{ width: 220 }}
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
      >
        {isArray(menuOptions) &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.id} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  useEffect(() => {
    sceneofoffenseForm.resetFields();
    panchWitnessForm.resetFields();
    materialObjectForm.resetFields();
    witnessDetailsForm.resetFields();
    expertTeamForm.resetFields();

    seteditPanchWitnessObj(null);
    setEditExpertTeamObj(null);
    setEditWitnessDetailsObj(null);
    setEditSceneofOffenseObj(null);
    seteditMaterialObjectObj(null);

    setViewExpertTeamDetails(false);
    setViewMaterialObjectDetails(false);
    setViewPanchWitness(false);
    setViewWitnessDetails(false);
    setViewSceneofOffense(false);
  }, [crimeSceneDate]);

  useEffect(() => {
    const tempAddress = getSelectedCrimeLocation()[0]?.uploadAddress;
    const fileData =
      !isUndefined(tempAddress) && !isUndefined(tempAddress.name)
        ? [{ name: tempAddress?.name, url: tempAddress?.url }]
        : [];
    setImageUpload(fileData);
  }, [crimeSceneDate]);

  const onChangeSetCrimeDate = (date) => {
    setCrimeSceneDate(date);
    dispatch(updateSelectedCrimeSceneDate(date));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const selectedCrimeLocation =
    isArray(crimeLocation) &&
    !isEmpty(crimeLocation) &&
    first(crimeLocation?.filter((x) => x.userDate === crimeSceneDate));

  const selectedPanchWitnessList =
    panchWitnessList && panchWitnessList.length > 0
      ? panchWitnessList?.filter((x) => x.userDate === crimeSceneDate)
      : [];
  const selectedMaterialObjectList =
    materialObjectList && materialObjectList.length > 0
      ? materialObjectList?.filter((x) => x.userDate === crimeSceneDate)
      : [];

  const showConfirm = () => {
    confirm({
      title:
        "Please Add Panch Witness and Crime classification in order to generate crime detail form.",
      icon: <ExclamationCircleOutlined />,
      width: 500,
    });
  };

  const generateCrimeDetails = async () => {
    if (isEmpty(panchWitnessList) || isEmpty(crimeclassification_)) {
      showConfirm();
    } else {
      setIsModalVisible(true);
    }
  };

  const handleUpload = (options) => {
    if (cdfUploadFileListState.length > 0) {
      const mediaFormData = new FormData();
      cdfUploadFileListState.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append(
        "folderPath",
        `${crimeId}/${folderName.CRIMESCENE}/file`
      );
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          setCdfUploadFileListState([]);
          if (response.data.success) {
            hideModal();
            const { data } = response?.data;
            const payloadData = first(data);
            setImageUpload([payloadData]);
            const tpayload = {
              crimeSceneId: crimeId,
              action: folderName.CRIMESCENE,
              actionSubType: folderName.CRIMESCENE,
              templates: [
                {
                  category: "uploadCdf",
                  mimeType: payloadData.mimeType,
                  name: payloadData.name,
                  url: payloadData.url,
                  templateCode: payloadData.name,
                  templateName: payloadData.name,
                  fileId: payloadData?.id,
                },
              ],
            };
            dispatch(uploadTemplates(config.templatesUpload, tpayload));
            const payload = {
              crimeSceneOffenceDate: crimeSceneDate,
              crimeId: crimeId,
              uploads: {
                category: "",
                mimeType: payloadData.mimeType,
                name: payloadData.name,
                url: payloadData.url,
                fileId: payloadData?.id,
              },
            };
            dispatch(uploadCDFSheet(config.uploadCrimeScene, payload));
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          setCdfUploadFileListState([]);
          openNotificationWithIcon("error", "Uploading Went Wrong");
          options.onError("ok");
        });
    }
  };

  const validationExceptionList = [
    "Accident Classification",
    "Severity of accident",
    "Surface Road ",
    "Surface Condition",
    "Traffic Control Type",
    "Complexion",
    "Height in cms",
    "Gender",
    "Teeth",
    "Body Built Type",
    "Color of Hairs",
    "Beard",
    "Color of Eyes",
    "Approximate age",
    "Moles",
    "Deformities Type",
    "Deformities",
    "Tatoo marks",
    "Clothes Worn",
    "Visible injuries on the body",
    "Any valuables on the body",
    "Whether Challenged",
    "Languages Speak",
    "Languages Write",
    "Mustaches",
    "TRNO",
    "Registration No",
    "Chaisis No",
    "Engine No",
  ];

  return (
    <>
      <div className="contentHeaderContainer" style={{ paddingBottom: 0 }}>
        <div style={styles.widgetPageStyle}>
          <h2 className="pageTitle">Crime Scene</h2>
          {newSceneOfOffence === true ? (
            <div style={{ marginLeft: 40, marginTop: 5, fontSize: 16 }}>
              <label style={{ paddingRight: 10 }}>
                Date & Time of visit of Crime Scene
              </label>{" "}
              <DatePicker
                showTime
                format={DATE_TIME_FORMAT_WITHOUT_SECONDS}
                placeholder="Select Date & Time"
                onChange={(date) => setCrimeSceneDate(date)}
                disabledDate={disableFutureDates}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        {!isEmpty(crimeLocation) &&
        crimeLocation.length > 0 &&
        newSceneOfOffence === false ? (
          <div style={{ marginLeft: 20, marginTop: 5, fontSize: 16 }}>
            <Form form={header}>
              <Form.Item
                name="crimeSceneFormDate"
                label="Select Scene of Offence"
              >
                {renderFieldsWithDropDown(
                  crimeDates,
                  onChangeSetCrimeDate,
                  handleSearch,
                  serchText,
                  222,
                  false
                )}
              </Form.Item>
            </Form>
          </div>
        ) : null}
        {selectedCrimeLocation && !isUndefined(selectedCrimeLocation) ? (
          <>
            <Button
              type="primary"
              className="saveButton"
              style={{ width: 215, marginRight: 5, fontSize: 14 }}
              onClick={generateCrimeDetails}
              disabled={isFetching}
            >
              Generate Crime Details Form
            </Button>
            <Upload
              fileList={imageUpload}
              accept="application/msword, application/pdf, image/*"
              onChange={async (info) => {
                await setCdfUploadFileListState(info.fileList);
              }}
              customRequest={(options) => handleUpload(options)}
              multiple={false}
              disabled={true}
            >
              <Button
                type="primary"
                className="saveButton"
                style={{ width: 150, marginRight: 5, fontSize: 14 }}
                onClick={showUploadDialog}
                disabled={
                  isEmpty(panchWitnessList) || isEmpty(crimeclassification_)
                }
              >
                Upload CDF
              </Button>
            </Upload>
            <Modal
              header={null}
              visible={confirmModalVisible}
              onOk={hideModal}
              onCancel={hideModal}
              footer={[
                <span
                  type="primary"
                  onClick={hideModal}
                  style={{ marginRight: 10 }}
                  className="popupLink"
                >
                  Cancel
                </span>,
                <Upload
                  fileList={imageUpload}
                  accept="application/msword, application/pdf, image/*"
                  onChange={async (info) => {
                    await setCdfUploadFileListState(info.fileList);
                  }}
                  customRequest={(options) => handleUpload(options)}
                  multiple={false}
                >
                  <Button
                    type="primary"
                    className="saveButton"
                    style={{ width: 180, marginRight: 5 }}
                  >
                    Select File
                  </Button>
                </Upload>,
              ]}
            >
              <Row gutter={24}>
                <Col span={2} style={{ fontSize: 25 }}>
                  <ExclamationCircleOutlined style={{ color: "#FAB428" }} />
                </Col>
                <Col span={20} style={{ fontSize: 16 }}>
                  Are you sure you want to upload CDF? This process can not be
                  reverted.
                </Col>
              </Row>
            </Modal>
          </>
        ) : null}
        <Button
          type="primary"
          className="saveButton"
          style={{ width: 205, marginRight: 5 }}
          onClick={createScene}
          disabled={disableForm}
        >
          Add New Scene of Offence
        </Button>
      </div>
      {!isNull(crimeSceneDate) && newSceneOfOffence === false ? (
        <div style={{ textAlign: "center", fontSize: 16, marginRight: 50 }}>
          <label>
            Date & Time of visit of Crime Scene:{" "}
            <b>
              {" "}
              {crimeSceneDate
                ? moment(crimeSceneDate).format(
                    DATE_TIME_FORMAT_WITHOUT_SECONDS
                  )
                : null}{" "}
            </b>
          </label>
        </div>
      ) : null}
      <div className="formDetails">
        {isFetching ? (
          <Loader />
        ) : (
          <Collapse
            accordion
            defaultActiveKey={["1"]}
            expandIconPosition={"right"}
            expandIcon={({ isActive }) => (
              <DoubleRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel
              className="panelHeader"
              header={getPanelTitle("Scene of Offence")}
              key="1"
            >
              <Form form={sceneofoffenseForm} layout="vertical">
                {crimeLocation && (
                  <div style={styles.widgetPageStyle}>
                    <Col span={18}>
                      <CrimeLocation
                        currentData={editSceneofOffenseObj}
                        crimeSceneDate={crimeSceneDate}
                        handleSubmit={handleCrimeLocationSubmit}
                        resetEdit={() => setEditSceneofOffenseObj(null)}
                        viewSceneofOffense={viewSceneofOffense || disableForm}
                        setViewSceneofOffense={setViewSceneofOffense}
                        sceneofoffenseForm={sceneofoffenseForm}
                        showButton={true}
                      />
                    </Col>
                    <Col span={6}>
                      <SceneofOffenseList
                        moduleTitle="Scene of Offence"
                        isDisplayed={false}
                        minHeight={350}
                        showRecords={true}
                        records={getSelectedCrimeLocation()}
                        editSceneofOffense={handleEditSceneOfOffense}
                        selectedRecord={editSceneofOffenseObj}
                        setViewSceneofOffense={setViewSceneofOffense}
                      />
                    </Col>
                  </div>
                )}
              </Form>
            </Panel>
            {!isEmpty(crimeLocation) &&
            crimeSceneDate &&
            crimeLocation.length > 0 &&
            newSceneOfOffence === false ? (
              <>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Panch Witness")}
                  key="2"
                >
                  <Form form={panchWitnessForm} layout="vertical">
                    <div style={styles.widgetPageStyle}>
                      <Col span={18}>
                        <Button
                          className={
                            selectedWitnessButton === "Panch Witness"
                              ? "witnessButtonActive"
                              : "witnessButtonInActive"
                          }
                          shape="round"
                          style={{ marginBottom: 10 }}
                          onClick={() =>
                            setSelectedWitnessButton("Panch Witness")
                          }
                        >
                          Panch Witness
                        </Button>
                        <span className="leftRightPad">OR</span>
                        <Button
                          className={
                            selectedWitnessButton === "Police Proceedings"
                              ? "witnessButtonActive"
                              : "witnessButtonInActive"
                          }
                          shape="round"
                          onClick={() =>
                            setSelectedWitnessButton("Police Proceedings")
                          }
                          disabled
                        >
                          Police Proceedings
                        </Button>
                        <PanchWitness
                          crimeSceneDate={crimeSceneDate}
                          handleSubmit={handlePanchWitnessSubmit}
                          setInputList={setPunchwitnessInputList}
                          currentData={editPanchWitnessObj}
                          resetEdit={() => seteditPanchWitnessObj(null)}
                          viewPanchWitness={viewPanchWitness || disableForm}
                          setViewPanchWitness={setViewPanchWitness}
                          PanchWitnessForm={panchWitnessForm}
                          showButton={true}
                          isInvestigation={false}
                        />
                      </Col>
                      <Col span={6}>
                        <PanchWitnessList
                          isDisplayed={false}
                          inputFileList={panchWitnessFileList}
                          handleFileChange={handlePanchWitnessUpload}
                          minHeight={750}
                          showRecords={true}
                          records={
                            panchWitnessList && panchWitnessList.length > 0
                              ? panchWitnessList
                              : []
                          }
                          editPanchWitness={editPanchWitness}
                          selectedRecord={editPanchWitnessObj}
                          setViewPanchWitness={setViewPanchWitness}
                          disableEdit={disableForm}
                        />
                      </Col>
                    </div>
                  </Form>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Witness Details")}
                  key="3"
                >
                  <Form form={witnessDetailsForm} layout="vertical">
                    <div style={styles.widgetPageStyle}>
                      <Col span={18} style={{ padding: 10 }}>
                        <WitnessDetails
                          crimeSceneDate={crimeSceneDate}
                          handleSubmit={handleWitnessSubmit}
                          setInputList={setWitnessDetailsInputList}
                          currentData={editWitnessDetailsObj}
                          resetEdit={() => setEditWitnessDetailsObj(null)}
                          viewWitnessDetails={viewWitnessDetails || disableForm}
                          setViewWitnessDetails={setViewWitnessDetails}
                          WitnessDetailsForm={witnessDetailsForm}
                          showButton={true}
                          isInvestigation={false}
                        />
                      </Col>
                      <Col span={6}>
                        <div style={{ marginLeft: 10, marginBottom: 20 }}>
                          <UploadForm
                            colWidth={22}
                            enableMediaManager={true}
                            setInputFileList={setInputFileList}
                            selectedCategory="witnessDetails"
                            setSelectedCategory={
                              setSelectedWitnessDetailsCategory
                            }
                            disabled={viewWitnessDetails || disableForm}
                          />
                        </div>
                        {!isEmpty(witnessStatementList) ? (
                          <>
                            <Button
                              style={{ marginTop: "40px", width: "100%" }}
                              onClick={() =>
                                setIsWitnessDetailsModalVisible(true)
                              }
                            >
                              {witnessStatementList &&
                              witnessStatementList.length > 0
                                ? witnessStatementList.length
                                : 0}{" "}
                              Witness Details Records
                            </Button>
                            <Modal
                              title="Witness Details Records"
                              visible={isWitnessDetailsModalVisible}
                              onOk={() =>
                                setIsWitnessDetailsModalVisible(false)
                              }
                              onCancel={() =>
                                setIsWitnessDetailsModalVisible(false)
                              }
                              style={{ minWidth: "95vw" }}
                              footer={null}
                            >
                              <div
                                style={{ maxHeight: 650, overflowY: "auto" }}
                              >
                                <SavedWitnessDetailsRecords
                                  dataSource={getSavedWitnessDetailsData(
                                    witnessStatementList
                                  )}
                                  editDetails={handleEditWitnessDetails}
                                  setViewDetails={setViewWitnessDetails}
                                  selectedRecord={editWitnessDetailsObj}
                                  isMedia={false}
                                  recordVisible={
                                    setIsWitnessDetailsModalVisible
                                  }
                                  disableForm={disableForm}
                                  setSelectedSiderMenu={
                                    props.setSelectedSiderMenu
                                  }
                                />
                              </div>
                            </Modal>
                          </>
                        ) : null}
                      </Col>
                    </div>
                  </Form>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Crime Scene Photographs")}
                  key="4"
                >
                  <div style={styles.widgetPageStyle}>
                    <Col span={24}>
                      <CrimeScenePhotographs
                        crimeSceneDate={crimeSceneDate}
                        handleSubmit={handlePhotographsSubmit}
                        photosList={crimeScenePhotographsList}
                        disable={disableForm}
                      />
                    </Col>
                  </div>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Expert Team Details")}
                  key="5"
                >
                  <div style={styles.widgetPageStyle}>
                    <Col span={18}>
                      <ExpertTeamDetails
                        expertTeamForm={expertTeamForm}
                        crimeSceneDate={crimeSceneDate}
                        handleSubmit={handleExpertTeamSubmit}
                        disableEdit={viewExpertTeamDetails || disableForm}
                        setViewDetails={setViewExpertTeamDetails}
                      />
                    </Col>
                    <Col span={6}>
                      <div style={{ marginLeft: 15, marginBottom: 15 }}>
                        <UploadForm
                          colWidth={22}
                          enableMediaManager={true}
                          setInputFileList={setInputFileList}
                          selectedCategory="expertTeam"
                          setSelectedCategory={setSelectedExpertTeamCategory}
                          disabled={viewExpertTeamDetails || disableForm}
                        />
                      </div>
                      {!isEmpty(expertTeamList) ? (
                        <ExpertTeamSavedRecords
                          dataSource={getSavedExpertTeamData(expertTeamList)}
                          editDetails={handleEditExpertTeam}
                          setViewDetails={setViewExpertTeamDetails}
                          selectedRecord={editExpertTeamObj}
                        />
                      ) : null}
                    </Col>
                  </div>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Rough Sketch")}
                  key="6"
                >
                  <div style={styles.widgetPageStyle}>
                    <Col span={18}>
                      <RoughSketch
                        crimeSceneDate={crimeSceneDate}
                        handleSubmit={handleRoughSketchUpload}
                        displayPhotos={roughSketchPhotos}
                        setDisplayPhotos={setRoughSketchPhotos}
                        roughSketchFiles={roughSketchFiles}
                        disabled={disableForm}
                      />
                    </Col>
                    <Col span={6}>
                      <RoughSketchUpload
                        minHeight={300}
                        records={roughSketchList}
                        setInputFileList={setRoughSketchFiles}
                        disabled={disableForm}
                        fileList={roughSketchFiles}
                      />
                    </Col>
                  </div>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Material Objects")}
                  key="7"
                >
                  <Form form={materialObjectForm} layout="vertical">
                    <div style={styles.widgetPageStyle}>
                      <Col span={18}>
                        <MaterialObjects
                          crimeSceneDate={crimeSceneDate}
                          handleSubmit={handleMaterialObjectSubmit}
                          currentData={editMaterialObjectObj}
                          resetEdit={() => seteditMaterialObjectObj(null)}
                          viewMaterialObjectDetails={
                            viewMaterialObjectDetails || disableForm
                          }
                          setViewMaterialObjectDetails={
                            setViewMaterialObjectDetails
                          }
                          showButton={true}
                          MaterialObjectsForm={materialObjectForm}
                          addAddress={setAddAddress}
                          address={addAddress}
                          setSelectedSiderMenu={(value) =>
                            props.setSelectedSiderMenu(value)
                          }
                          fileList={
                            editMaterialObjectObj?._id &&
                            savedSeizureReportURL !== ""
                              ? selectedSeizureReport
                              : seizureReport
                          }
                          actionName={setSeizureReport}
                          disableUpload={
                            viewMaterialObjectDetails ||
                            !isEmpty(seizureReport) ||
                            disableForm
                          }
                        />
                      </Col>
                      <Col span={6}>
                        <div style={{ marginLeft: 15 }}>
                          <UploadForm
                            colWidth={22}
                            enableMediaManager={true}
                            setInputFileList={setInputFileList}
                            selectedCategory="materialObject"
                            setSelectedCategory={setSelectedMaterialCategory}
                            disabled={viewMaterialObjectDetails || disableForm}
                          />
                        </div>
                        {!isUndefined(materialObjectList) &&
                        !isEmpty(materialObjectList) ? (
                          <>
                            <Button
                              style={{ marginTop: "40px", width: "100%" }}
                              onClick={() =>
                                setIsMaterialObjectModalVisible(true)
                              }
                            >
                              {materialObjectList &&
                              materialObjectList.length > 0
                                ? materialObjectList.length
                                : 0}{" "}
                              Material Objects Records
                            </Button>
                            <Modal
                              title="Material Objects Records"
                              visible={isMaterialObjectModalVisible}
                              onOk={() =>
                                setIsMaterialObjectModalVisible(false)
                              }
                              onCancel={() =>
                                setIsMaterialObjectModalVisible(false)
                              }
                              style={{ minWidth: "95vw" }}
                              footer={null}
                            >
                              <div
                                style={{ maxHeight: 650, overflowY: "auto" }}
                              >
                                <SavedRecords
                                  dataSource={getSavedMaterialObjectData(
                                    materialObjectList
                                  )}
                                  editDetails={handleEditMaterialObject}
                                  setViewDetails={setViewMaterialObjectDetails}
                                  selectedRecord={editMaterialObjectObj}
                                  visibleRecords={
                                    setIsMaterialObjectModalVisible
                                  }
                                />
                              </div>
                            </Modal>
                          </>
                        ) : null}
                      </Col>
                    </div>
                  </Form>
                </Panel>
                <Panel
                  className="panelHeader"
                  header={getPanelTitle("Crime Classification")}
                  key="8"
                >
                  <div style={styles.widgetPageStyle}>
                    <CrimeClassification
                      crimeSceneDate={crimeSceneDate}
                      handleSubmit={handleCrimeClassificationSubmit}
                      currentData={crimeclassification_}
                      disableEdit={disableForm}
                      validationExceptionList={validationExceptionList}
                      setShowVehicleDetails={setShowVehicleDetails}
                      vehicleInfo={vehiclesDetails}
                      setVehiclesDetails={setVehiclesDetails}
                    />
                  </div>
                </Panel>
              </>
            ) : null}
          </Collapse>
        )}
        {isModalVisible && (
          <PrintCrimeModal
            title="CRIME DETAIL FORM"
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            witnessStatementList={witnessStatementList}
            selectedCrimeLocation={selectedCrimeLocation}
            panchWitnessList={selectedPanchWitnessList}
            crimeSceneDate={crimeSceneDate}
            materialObjectList={selectedMaterialObjectList}
            roughSketchPhotos={roughSketchPhotos}
          />
        )}
        {!isEmpty(vehiclePopupDetails) && (
          <VehicaleDetalsPopUp
            setShowVehicleDetails={setShowVehicleDetails}
            showVehicleDetails={showVehicleDetails}
            vehiclesDetails={vehiclePopupDetails}
            setVehiclePopupDetails={setVehiclePopupDetails}
            setVehiclesDetails={setVehiclesDetails}
            handleVehicleDetailsAdd={handleVehicleDetailsAdd}
          />
        )}
      </div>
    </>
  );
}
