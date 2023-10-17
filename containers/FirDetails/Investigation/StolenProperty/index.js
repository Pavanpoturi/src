/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import moment from "moment";
import { disableFutureDates } from "@components/Common/helperMethods";
import Loader from "@components/utility/loader";
import { config } from "@config/site.config";
import axios from "axios";
import UploadForm from "@components/Common/uploadForm";
import firActions from "@redux/fir/actions";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  notification,
  Modal,
  Divider,
} from "antd";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  getAccuseds,
  DATE_TIME_FORMAT,
  folderName,
  masterDataType,
  getStaffsDetails,
  renderFieldsWithDropDown,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import stolenPropertyActions from "@redux/investigations/stolenProperty/actions";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import { getAuditHistoryPayload } from "@containers/const";
import auditHistoryActions from "@redux/auditHistory/actions";
import { getFileById } from "@containers/media-util";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";
import { isEmpty, first, isUndefined, toNumber } from "lodash";
import masterDataActions from "@redux/masterData/actions";
import {
  StolenPropertyTemplates,
  SeizureReportTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
  mainCategories,
  belongsToWhom,
  propertyStatus,
  propertyRecoveredFrom,
  placeOfRecovery,
  natureOFStolenArms,
  natureOFStolenAuto,
  natureOFStolenCoins,
  natureOFStolenCultural,
  natureOFStolenDoucments,
  natureOFStolenDrugs,
  natureOFStolenElectrical,
  natureOFStolenExplosives,
  natureOFStolenJewellery,
  natureOFStolenMis,
} from "./const";
import { ModuleWrapper } from "../CommonDetails/styles";
import AddAddress from "../CommonForms/AddAddress";
import ContentHeader from "../../ContentHeader";
import TemplatesModal from "../CommonForms/TemplatesModal";
import SavedRecords from "./SavedRecords";
import VehicaleDetalsPopUp from "./VehicaleDetalsPopUp";
import GenerateStolenPropertyCategories from "./StolenPropertyCategories";

const Option = Select.Option;

export default function StolenProperty({ setSelectedSiderMenu }) {
  const [form] = Form.useForm();
  const { getStaffList } = masterDataActions;
  const dispatch = useDispatch();
  const [addressForm] = Form.useForm();
  const { savedFir } = useSelector((state) => state.createFIR);
  const [formValid, setFormValid] = useState(true);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const { suspectAccusedList } = useSelector((state) => state.SuspectAccused);
  const [inputFileList, setInputFileList] = useState([]);
  const [propertyStatusState, setPropertyStatusState] = useState("");
  const { createAuditHistory } = auditHistoryActions;
  const [selectedCategory, setSelectedCategory] = useState("stolenProperty");
  const [serchText, setSerchText] = useState("");
  const crimeId = loadState("selectedFirId");
  const selectedFir = loadState("selectedFir");
  const currentUser = loadState("currentUser");
  const [firDetails, setFirDetails] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const { getAccusedList } = suspectAccusedAction;
  const [addAnother, setAddAnother] = useState(false);
  const [addressDetails, setAddressDetails] = useState([]);
  const [seizureReportMedia, setSeizureReportMedia] = useState([]);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const { getVehicleData } = crimeSceneActions;
  const { isLoading } = useSelector((state) => state.CrimeScene);
  const [uploadedSeizureReportMedia, setUploadedSeizureReportMedia] = useState(
    []
  );
  const [selectedSeizureReportMedia, setSelectedSeizureReportMedia] = useState(
    []
  );
  useEffect(() => {
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  }, []);
  const { staffList } = useSelector((state) => state.MasterData);
  const staffMembersList = staffList && getStaffsDetails(staffList);
  const {
    vehicleDetails,
    vehicleActionType,
    vehicleIsFetching,
    vehicleErrorMessage,
  } = useSelector((state) => {
    return {
      vehicleDetails: state.CrimeScene.vehicleDetails,
      vehicleActionType: state.CrimeScene.actionType,
      vehicleIsFetching: state.CrimeScene.isFetching,
      vehicleErrorMessage: state.CrimeScene.errorMessage,
    };
  });

  const [
    uploadedArmsInsuranceCertificateMedia,
    setUploadedArmsInsuranceCertificateMedia,
  ] = useState([]);

  const [
    uploadedculInsuranceCertificateMedia,
    setUploadedCulInsuranceCertificateMedia,
  ] = useState([]);

  const [uploadedAsiCertificateMedia, setUploadedAsiCertificateMedia] =
    useState([]);

  const [uploadedLabAnalysisMedia, setUploadedLabAnalysisMedia] = useState([]);
  const [uploadedDrugReportMedia, setUploadedDrugReportMedia] = useState([]);
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [pwList, setPwList] = useState([]);
  const [viewClicked, setViewClicked] = useState(false);
  const [editClicked, setEditClicked] = useState(false);
  const [selectedStolenProperty, setSelectedStolenProperty] = useState({});
  const [propertyCategoryState, setpropertyCategoryState] = useState("");
  const [propertyCategoryNameState, setPropertyCategoryNameState] =
    useState("");
  const [natureOFStolenState, setNatureOFStolenState] = useState([]);
  const [selectedPropertyRecoveredFrom, setSelectedPropertyRecoveredFrom] =
    useState("");
  const [labAnalysisSelected, setlabAnalysisSelected] = useState(false);
  const [drugGangSelected, setDrugGangSelected] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [interrogationDoneSelected, setInterrogationDoneSelected] =
    useState(false);
  const [ndpsSelected, setNDPSSelected] = useState(false);
  const [stolenPropertyApiList, setStolenPropertyApiList] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState({});
  const [vehicleDetailsPopUp, setVehicleDetailsPopUp] = useState({});

  useEffect(() => {
    if (!isUndefined(vehicleDetails) && !isEmpty(vehicleDetails)) {
      if (showVehicleDetails === "fetch") {
        setVehicleDetailsPopUp(vehicleDetails);
      }
    }
  }, [vehicleDetails]);
  const {
    actionType,
    errorMessage,
    isFetching,
    stolenPropertyList,
    successMessage,
  } = useSelector((state) => state.stolenProperty);
  const { panchWitnessList } = useSelector((state) => state.FIR);
  const { fetchPanchWitnessList } = firActions;
  const {
    updateStolenPropertyDetails,
    addStolenPropertyDetails,
    getStolenPropertyList,
    resetActionType,
  } = stolenPropertyActions;

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  useEffect(() => {
    let panchList = [];
    panchWitnessList &&
      panchWitnessList.length &&
      panchWitnessList.forEach((pw) => {
        const { personalDetails } = pw.person;
        const label = `${personalDetails.name} ${
          personalDetails.surname || ""
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
    fetchAccusedList();
    dispatch(
      fetchPanchWitnessList(
        `${config.getPostCrimeSceneDetails}/PUNCHWITNESS/?crimeId=${crimeId}`
      )
    );
    getCasePropertyList();
  }, []);

  useEffect(() => {
    let result = [];
    stolenPropertyList.length > 0 &&
      stolenPropertyList.forEach((ele) => {
        if (ele.propertyStatus) {
          result.push(ele);
        }
      });
    setStolenPropertyApiList(result);
  }, [stolenPropertyList]);

  useEffect(() => {
    if (propertyCategoryState === "armsAndAmmunition") {
      setNatureOFStolenState(natureOFStolenArms);
    }
    if (propertyCategoryState === "automobiles") {
      setNatureOFStolenState(natureOFStolenAuto);
    }
    if (propertyCategoryState === "coinsandCurrency") {
      setNatureOFStolenState(natureOFStolenCoins);
    }
    if (propertyCategoryState === "culturalProperty") {
      setNatureOFStolenState(natureOFStolenCultural);
    }
    if (propertyCategoryState === "documentsandValuableSecurities") {
      setNatureOFStolenState(natureOFStolenDoucments);
    }
    if (propertyCategoryState === "drugsNarcotics") {
      setNatureOFStolenState(natureOFStolenDrugs);
    }
    if (propertyCategoryState === "electricalandElectronicGoods") {
      setNatureOFStolenState(natureOFStolenElectrical);
    }
    if (propertyCategoryState === "explosives") {
      setNatureOFStolenState(natureOFStolenExplosives);
    }
    if (propertyCategoryState === "jewellery") {
      setNatureOFStolenState(natureOFStolenJewellery);
    }
    if (propertyCategoryState === "miscellaneous") {
      setNatureOFStolenState(natureOFStolenMis);
    }
  }, [propertyCategoryState]);

  const getCasePropertyList = () => {
    dispatch(
      getStolenPropertyList(`${config.stolenProperty}/?crimeId=${crimeId}`)
    );
  };

  const isSuccess =
    actionType === "ADD_STOLEN_PROPERTY_SUCCESS" ||
    actionType === "UPDATE_STOLEN_PROPERTY_SUCCESS";

  const isError =
    actionType === "ADD_STOLEN_PROPERTY_ERROR" ||
    actionType === "UPDATE_STOLEN_PROPERTY_ERROR";

  const fetchAccusedList = () => {
    dispatch(
      getAccusedList(
        `${config.getPostCrimeSceneDetails}/ACCUSED/?crimeId=${crimeId}`
      )
    );
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const getAccusedDropdownData = () => getAccuseds(suspectAccusedList);

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const auditHistoryEntry = () => {
    const auditType =
      actionType === "ADD_STOLEN_PROPERTY_SUCCESS"
        ? "Stolen Property Created"
        : "Stolen Property Updated";
    dispatch(
      createAuditHistory(
        config.createAudits,
        getAuditHistoryPayload(
          crimeId,
          "investigation/stolenProperty",
          auditType
        )
      )
    );
  };

  useEffect(() => {
    if (isSuccess || isError) {
      if (
        successMessage === "Stolen Property Successfully Added" ||
        successMessage === "Stolen Property Successfully Updated"
      ) {
        openNotificationWithIcon("success", successMessage);
        auditHistoryEntry();
        form.resetFields();
        setSeizureReportMedia([]);
        setSelectedSeizureReportMedia([]);
        setUploadedDrugReportMedia([]);
        setUploadedLabAnalysisMedia([]);
        setUploadedAsiCertificateMedia([]);
        setUploadedCulInsuranceCertificateMedia([]);
        setUploadedArmsInsuranceCertificateMedia([]);
        setUploadedSeizureReportMedia([]);
        setSelectedPropertyRecoveredFrom("");
        setInterrogationDoneSelected(false);
        setDrugGangSelected(false);
        setlabAnalysisSelected(false);
        setpropertyCategoryState("");
        setPropertyCategoryNameState("");
        setInputFileList([]);
        setNDPSSelected(false);
        getCasePropertyList();
        dispatch(resetActionType());
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (!vehicleIsFetching) {
      if (vehicleActionType === "FETCH_VEHICLE_SUCCESS") {
        openNotificationWithIcon("success", "Successfully Fetched Details");
      } else if (
        vehicleActionType === "FETCH_VEHICLE_ERROR" &&
        !isEmpty(vehicleErrorMessage)
      ) {
        openNotificationWithIcon("error", vehicleErrorMessage);
        setShowVehicleDetails(false);
      }
    }
  }, [vehicleActionType, vehicleIsFetching]);

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  const disableEstimatedProperty = () => {
    let result = false;
    if (
      selectedStolenProperty?.isInitialFir &&
      selectedStolenProperty?.propertyStatus === "Stolen" &&
      propertyStatusState === "Stolen"
    ) {
      result = true;
    }
    if (
      !selectedStolenProperty?.isInitialFir &&
      selectedStolenProperty?.propertyStatus === "Recovered"
    ) {
      result = true;
    }
    if (
      (!selectedStolenProperty?.isInitialFir &&
        selectedStolenProperty?.propertyStatus === "Recovered") ||
      propertyStatusState === "Recovered"
    ) {
      result = true;
    }
    if (
      (!selectedStolenProperty?.isInitialFir &&
        propertyStatusState !== "Recovered" ) 
    ) {
      result = false;
    }

    return result;
  };

  const disableRecoverProperty =
    (selectedStolenProperty?.isInitialFir &&
      selectedStolenProperty?.propertyStatus === "Stolen" &&
      propertyStatusState === "Stolen") ||
    (!selectedStolenProperty?.isInitialFir && propertyStatusState === "Stolen");
  const submit = async () => {
    const values = await form.validateFields();
    const recoveredValue = !isEmpty(values?.recoveredValue)
      ? toNumber(values?.recoveredValue)
      : 0;
    const estimateValue = toNumber(values?.estimateValue);
    if (
      estimateValue
        ? toNumber(recoveredValue || 0) <= toNumber(estimateValue || 0)
        : true
    ) {
      if (inputFileList.length > 0) {
        const mediaFormData = new FormData();
        inputFileList.forEach((file) => {
          mediaFormData.append("file", file.originFileObj);
        });
        mediaFormData.append("prefixFolder", crimeId);
        mediaFormData.append(
          "folderPath",
          `${crimeId}/${folderName.STOLENPROPERTY}/file`
        );
        axios
          .post(`${config.fileUpload}/upload`, mediaFormData)
          .then((response) => {
            if (response.data.success === true) {
              const existingMedia =
                !isUndefined(selectedStolenProperty) &&
                !isEmpty(selectedStolenProperty?.media)
                  ? selectedStolenProperty?.media
                  : [];

              const payload = response?.data?.data.map((image) => ({
                category: "",
                mimeType: image.mimeType,
                name: image.name,
                url: image.url,
                fileId: image?.id,
              }));
              createtipAccusedPayload({
                ...values,
                stolenPropertyMedia: [...payload, ...existingMedia],
              });
            }
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Upload Went Wrong");
          });
      } else {
        createtipAccusedPayload(values);
      }
    } else {
      openNotificationWithIcon(
        "error",
        "Recovered Value can not be more than Estimated Value."
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

  useEffect(() => {
    setpropertyCategoryState(selectedStolenProperty?.propertytCategory);
    setPropertyCategoryNameState(selectedStolenProperty?.propertytCategoryName);
    const addressDetails = selectedStolenProperty?.addressDetails;
    setAddressDetails(addressDetails);
    setPropertyStatusState(selectedStolenProperty.propertyStatus);
    if (addressDetails?.houseNo) {
      form.setFieldsValue({
        placeOfRecovery:
          (addressDetails?.houseNo ? addressDetails?.houseNo : "") +
          " " +
          (addressDetails?.streetRoadNo ? addressDetails?.streetRoadNo : "") +
          " " +
          (addressDetails?.wardColony ? addressDetails?.wardColony : ""),
      });
    } else {
      form.setFieldsValue({
        placeOfRecovery: selectedStolenProperty.placeOfRecovery,
      });
    }
    addressForm.setFieldsValue({
      houseNo: addressDetails?.houseNo,
      areaMandal: addressDetails?.areaMandal,
      district: addressDetails?.district,
      landmarkMilestone: addressDetails?.landmarkMilestone,
      localityVillage: addressDetails?.localityVillage,
      pinCode: addressDetails?.pinCode,
      residencyType: addressDetails?.residencyType,
      stateUt: addressDetails?.stateUt,
      streetRoadNo: addressDetails?.streetRoadNo,
      wardColony: addressDetails?.wardColony,
      sameAsPresent: addressDetails?.sameAsPresent,
      p_houseNo: addressDetails?.p_houseNo,
      p_areaMandal: addressDetails?.p_areaMandal,
      p_district: addressDetails?.p_district,
      P_landmarkMilestone: addressDetails?.P_landmarkMilestone,
      p_localityVillage: addressDetails?.p_localityVillage,
      p_pinCode: addressDetails?.p_pinCode,
      p_residencyType: addressDetails?.p_residencyType,
      p_stateUt: addressDetails?.p_stateUt,
      p_streetRoadNo: addressDetails?.p_streetRoadNo,
      p_wardColony: addressDetails?.p_wardColony,
    });
    const armsAndAmmunition =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.armsAndAmmunition) &&
      first(selectedStolenProperty?.armsAndAmmunition);
    const automobiles =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.automobiles) &&
      first(selectedStolenProperty?.automobiles);
    if (!isUndefined(automobiles?.chassisNo)) {
      setVehicleInfo(automobiles);
    }
    const coisnAndCurrency =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.coisnAndCurrency) &&
      first(selectedStolenProperty?.coisnAndCurrency);
    const culturalProperty =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.culturalProperty) &&
      first(selectedStolenProperty?.culturalProperty);
    const drugsNarcotics =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.drugsNarcotics) &&
      first(selectedStolenProperty?.drugsNarcotics);
    const jewellery =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.jewellery) &&
      first(selectedStolenProperty?.jewellery);
    const electricalElectonicGoods =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.electricalElectonicGoods) &&
      first(selectedStolenProperty?.electricalElectonicGoods);
    const explosives =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.explosives) &&
      first(selectedStolenProperty?.explosives);
    const documentsAndValuables =
      selectedStolenProperty &&
      !isEmpty(selectedStolenProperty?.documentsAndValuables) &&
      first(selectedStolenProperty?.documentsAndValuables);
    form.setFieldsValue({
      propertyStatus: selectedStolenProperty.propertyStatus,
      propertyRecoveredFrom: selectedStolenProperty.propertyRecoveredFrom,
      selectAccused: selectedStolenProperty.accusedId,
      iOAssistedBy: selectedStolenProperty.iOAssistedBy,
      panchWitness: selectedStolenProperty.panchWitness,
      dateOfSeizure:
        !isEmpty(selectedStolenProperty?.dateOfSeizure) &&
        moment(selectedStolenProperty.dateOfSeizure).isValid()
          ? moment(selectedStolenProperty.dateOfSeizure)
          : "",
      propertytCategory: selectedStolenProperty.propertytCategory,
      propertytCategoryName: selectedStolenProperty.propertytCategoryName,
      natureOfStolenProperty: selectedStolenProperty.natureofStolen,
      belongsToWhom: selectedStolenProperty.belongsToWhom,
      estimateValue: selectedStolenProperty.estimateValue,
      recoveredValue: selectedStolenProperty.recoveredValue,
      armsManufacturer: armsAndAmmunition?.manufacturer,
      armspropertytCategory: armsAndAmmunition?.armsCategory,
      armsMade: armsAndAmmunition?.made,
      armsLicensed: armsAndAmmunition?.licensed,
      licenceNo: armsAndAmmunition?.licenceNo,
      expiryDate: moment(new Date(armsAndAmmunition?.expiryDate)).isValid()
        ? moment(new Date(armsAndAmmunition?.expiryDate))
        : "",
      licenceIssuedBy: armsAndAmmunition?.licenceIssuedBy,
      manufacturingUnitName: armsAndAmmunition?.manufacturingUnitName,
      armsisManufacturingUnit: armsAndAmmunition?.isManufacturingUnit,
      sourceOfArm: armsAndAmmunition?.sourceOfArm,
      countryOfDesign: armsAndAmmunition?.countryOfDesign,
      weaponNumber: armsAndAmmunition?.weaponNumber,
      armsInsuranceCerNo: armsAndAmmunition?.insuranceCertificateNo,
      armsModel: armsAndAmmunition?.model,
      armsBore: armsAndAmmunition?.bore,
      armsQuantity: armsAndAmmunition?.quantity,
      armsspecialMarksOfIdentification:
        armsAndAmmunition?.specialMarksOfIdentification,
      armsNameOfInsurance: armsAndAmmunition?.nameOfInsuranceCompany,
      armsRemarks: armsAndAmmunition?.remarks,
      registrationNumber: automobiles?.registrationNumber,
      specialIdentifiactionDetails: automobiles?.specialIdentifiaction,
      countryOfOrigin: coisnAndCurrency?.countryOfOrigin,
      denomination: coisnAndCurrency?.denomination,
      series: coisnAndCurrency?.series,
      quality: coisnAndCurrency?.quality,
      CoinsQuantity: coisnAndCurrency?.quantity,
      numberOfPiecesOfCurrency: coisnAndCurrency?.numberOfPiecesOfCurrency,
      serialNumber: coisnAndCurrency?.serialNumber,
      waterMark: coisnAndCurrency?.waterMark,
      flouroscence: coisnAndCurrency?.flouroscence,
      securityThread: coisnAndCurrency?.securityThread,
      cracklingSound: coisnAndCurrency?.cracklingSound,
      coinsRemarks: coisnAndCurrency?.remarks,
      materialUsed: culturalProperty?.material,
      nomenclature: culturalProperty?.nomenclature,
      height: culturalProperty?.height,
      depth: culturalProperty?.depth,
      breadth: culturalProperty?.breadth,
      weight: culturalProperty?.weight,
      photographCollected: culturalProperty?.photographCollected,
      culasiCertificateNo: culturalProperty?.asiCertificateNo,
      culinsuranceCertificateNO: culturalProperty?.insuranceCertificateNO,
      culnameOfInsurance: culturalProperty?.nameOfInsurance,
      ageADBC: culturalProperty?.ageADBC,
      culSpecialDetails: culturalProperty?.SpecialDetails,
      culRemarks: culturalProperty?.remarks,
      documentNo: documentsAndValuables?.documentNo,
      documentParticulars: documentsAndValuables?.documentParticulars,
      drugsQuantity: drugsNarcotics?.weight,
      weightIn: drugsNarcotics?.weightIn,
      drugslocationType: drugsNarcotics?.locationType,
      optimiumArea: drugsNarcotics?.optimiumArea,
      plantsNumber: drugsNarcotics?.plantsNumber,
      drugsAdress: drugsNarcotics?.address,
      noOfPackets: drugsNarcotics?.noOfPackets,
      cultivationType: drugsNarcotics?.cultivationType,
      areaAcres: drugsNarcotics?.areaAcres,
      potentialYields: drugsNarcotics?.potentialYields,
      agencyName: drugsNarcotics?.agencyName,
      noticeNDPSACt: drugsNarcotics?.whetherNotice,
      labAnalysis: drugsNarcotics?.whetherLab,
      drugSyndicate: drugsNarcotics?.whetherDrugSyndicate,
      nameOfGang: drugsNarcotics?.gangName,
      whetherTrafficker: drugsNarcotics?.whetherTrafficker,
      whetherCarrier: drugsNarcotics?.whetherCarrier,
      whetherPeddler: drugsNarcotics?.whetherPeddler,
      whetherAddict: drugsNarcotics?.whetherAddict,
      whetherInterrogation: drugsNarcotics?.whetherInterrogation,
      drugsRemarks: drugsNarcotics?.remarks,
      elecMake: electricalElectonicGoods?.make,
      elecModel: electricalElectonicGoods?.model,
      elecQuantity: electricalElectonicGoods?.quantity,
      elecRemarks: electricalElectonicGoods?.remarks,
      explosiveChemicals: explosives?.chemicals,
      explosiveQuantity: explosives?.quantity,
      exploISManufac: explosives?.isManufacturingUnit,
      sourceOfExplosives: explosives?.sourceOfExplosives,
      exploParticulars: explosives?.particulars,
      jewQuantity: jewellery?.quantity,
      jewWeight: jewellery?.weight,
      jewDescription: jewellery?.description,
      misDescription: first(selectedStolenProperty?.miscellaneous)?.description,
    });
    const seizureReportMedia = selectedStolenProperty?.seizureReportMedia;
    if (Array.isArray(seizureReportMedia)) {
      for (let i = 0; i < seizureReportMedia.length; i++) {
        if (seizureReportMedia[i] && seizureReportMedia[i]?.name !== "") {
          setSelectedSeizureReportMedia((pev) => [
            ...pev,
            {
              url: seizureReportMedia[i]?.url,
              name: seizureReportMedia[i]?.name,
              fileId: seizureReportMedia[i]?.id,
            },
          ]);
        } else {
          setSelectedSeizureReportMedia([]);
        }
      }
    } else {
      setSelectedSeizureReportMedia([]);
    }
    if (armsAndAmmunition?.insuranceCertificateMedia) {
      setUploadedArmsInsuranceCertificateMedia(
        armsAndAmmunition?.insuranceCertificateMedia
      );
    }

    if (culturalProperty?.insuranceCertificateMedia) {
      setUploadedCulInsuranceCertificateMedia(
        culturalProperty?.insuranceCertificateMedia
      );
    }

    if (culturalProperty?.asiCertificateMedia) {
      setUploadedAsiCertificateMedia(culturalProperty?.asiCertificateMedia);
    }

    if (drugsNarcotics?.drugReportMedia) {
      setUploadedDrugReportMedia(drugsNarcotics?.drugReportMedia);
    }

    if (drugsNarcotics?.labAnalysisMedia) {
      setUploadedLabAnalysisMedia(drugsNarcotics?.labAnalysisMedia);
    }

    setNDPSSelected(drugsNarcotics?.whetherNotice);
    setlabAnalysisSelected(drugsNarcotics?.whetherLab);
    setDrugGangSelected(drugsNarcotics?.whetherDrugSyndicate);
    setInterrogationDoneSelected(drugsNarcotics?.whetherInterrogation);
  }, [selectedStolenProperty]);

  const handleUpload = (options, params1, params2, params3) => {
    if (params1.length > 0) {
      const mediaFormData = new FormData();
      params1.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/StolenProperty/media`);

      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          params2([]);
          if (response.data.success) {
            params3(response.data.data[0]);
            openNotificationWithIcon(
              "success",
              `Uploaded ${response.data.data[0].name}`
            );
            options.onSuccess("ok");
          }
        })
        .catch((err) => {
          params2([]);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const createtipAccusedPayload = async (values) => {
    if (
      Array.isArray(selectedStolenProperty?.seizureReportMedia) &&
      selectedStolenProperty?.seizureReportMedia?.length !== 0
    ) {
      var seizureReportMediaData = selectedStolenProperty?.seizureReportMedia;
    } else {
      seizureReportMediaData = [];
    }
    if (Array.isArray(uploadedSeizureReportMedia)) {
      var seizureReportMedia = [
        ...seizureReportMediaData,
        uploadedSeizureReportMedia,
      ];
    } else {
      seizureReportMedia = [
        ...seizureReportMediaData,
        uploadedSeizureReportMedia,
      ];
    }
    const addPayload = {
      crimeId: crimeId,
      propertyStatus: values.propertyStatus,
      iOAssistedBy: values.iOAssistedBy,
      propertyRecoveredFrom: values.propertyRecoveredFrom,
      accusedId: values.selectAccused,
      placeOfRecovery: values.placeOfRecovery,
      panchWitness: values.panchWitness,
      dateOfSeizure: values.dateOfSeizure,
      propertytCategory: values.propertytCategory,
      propertytCategoryName: propertyCategoryNameState,
      natureofStolen: values.natureOfStolenProperty,
      belongsToWhom: values.belongsToWhom,
      estimateValue: values.estimateValue,
      recoveredValue: values.recoveredValue,
      seizureReportMedia: isEmpty(uploadedSeizureReportMedia)
        ? selectedStolenProperty?.seizureReportMedia
        : seizureReportMedia,
      addressDetails: addressDetails,
      armsAndAmmunition: [
        {
          manufacturer: values.armsManufacturer,
          armsCategory: values.armspropertytCategory,
          made: values.armsMade,
          licensed: values.armsLicensed,
          licenceNo: values.licenceNo,
          expiryDate: values.expiryDate,
          licenceIssuedBy: values.licenceIssuedBy,
          manufacturingUnitName: values.manufacturingUnitName,
          isManufacturingUnit: values.armsisManufacturingUnit,
          sourceOfArm: values.sourceOfArm,
          countryOfDesign: values.countryOfDesign,
          weaponNumber: values.weaponNumber,
          insuranceCertificateNo: values.armsInsuranceCerNo,
          model: values.armsModel,
          bore: values.armsBore,
          quantity: values.armsQuantity,
          specialMarksOfIdentification: values.armsspecialMarksOfIdentification,
          nameOfInsuranceCompany: values.armsNameOfInsurance,
          remarks: values.armsRemarks,
          insuranceCertificateMedia: uploadedArmsInsuranceCertificateMedia,
        },
      ],
      automobiles: [
        {
          type: vehicleInfo?.type,
          subClassification: vehicleInfo?.subClassification,
          make: vehicleInfo?.make,
          registrationNo: vehicleInfo?.registrationNo,
          chassisNo: vehicleInfo?.chassisNo,
          engineNo: vehicleInfo?.engineNo,
          manufactured: vehicleInfo?.manufactured,
          ownerFatherName: vehicleInfo?.ownerFatherName,
          registrationValidUpto: vehicleInfo?.registrationValidUpto,
          registeredAt: vehicleInfo?.registeredAt,
          registeredMobileNo: vehicleInfo?.registeredMobileNo,
          presentAddress: vehicleInfo?.presentAddress,
          permanentAddress: vehicleInfo?.permanentAddress,
          model: vehicleInfo?.model,
          fuel: vehicleInfo?.fuel,
          color: vehicleInfo?.color,
          registrationNumber: vehicleInfo?.registrationNumber,
          registrationDate: vehicleInfo?.registrationDate,
          ownerName: vehicleInfo?.ownerName,
          tmpRegistrationNo: vehicleInfo?.tmpRegistrationNo,
          specialIdentifiaction: values.specialIdentifiactionDetails,
        },
      ],
      coisnAndCurrency: [
        {
          countryOfOrigin: values.countryOfOrigin,
          denomination: values.denomination,
          series: values.series,
          quality: values.quality,
          quantity: values.CoinsQuantity,
          numberOfPiecesOfCurrency: values.numberOfPiecesOfCurrency,
          serialNumber: values.serialNumber,
          waterMark: values.waterMark,
          flouroscence: values.flouroscence,
          securityThread: values.securityThread,
          cracklingSound: values.cracklingSound,
          remarks: values.coinsRemarks,
        },
      ],
      culturalProperty: [
        {
          material: values.materialUsed,
          nomenclature: values.nomenclature,
          height: values.height,
          depth: values.depth,
          breadth: values.breadth,
          weight: values.weight,
          photographCollected: values.photographCollected,
          asiCertificateNo: values.culasiCertificateNo,
          insuranceCertificateNO: values.culinsuranceCertificateNO,
          nameOfInsurance: values.culnameOfInsurance,
          ageADBC: values.ageADBC,
          specialDetails: values.culSpecialDetails,
          remarks: values.culRemarks,
          insuranceCertificateMedia: uploadedculInsuranceCertificateMedia,
          asiCertificateMedia: uploadedAsiCertificateMedia,
        },
      ],
      documentsAndValuables: [
        {
          documentNo: values.documentNo,
          documentParticulars: values.documentParticulars,
        },
      ],
      drugsNarcotics: [
        {
          weight: values.drugsQuantity,
          weightIn: values.weightIn,
          locationType: values.drugslocationType,
          optimiumArea: values.optimiumArea,
          plantsNumber: values.plantsNumber,
          address: values.drugsAdress,
          noOfPackets: values.noOfPackets,
          cultivationType: values.cultivationType,
          areaAcres: values.areaAcres,
          potentialYields: values.potentialYields,
          agencyName: values.agencyName,
          gangName: values.nameOfGang,
          whetherNotice: values.noticeNDPSACt,
          whetherLab: values.labAnalysis,
          whetherDrugSyndicate: values.drugSyndicate,
          whetherTrafficker: values.whetherTrafficker,
          whetherCarrier: values.whetherCarrier,
          whetherPeddler: values.whetherPeddler,
          whetherAddict: values.whetherAddict,
          wheatherDetained: false,
          wheatherEmergency: false,
          whetherInterrogation: values.whetherInterrogation,
          remarks: values.drugsRemarks,
          drugReportMedia: uploadedDrugReportMedia,
          labAnalysisMedia: uploadedLabAnalysisMedia,
        },
      ],
      electricalElectonicGoods: [
        {
          make: values.elecMake,
          model: values.elecModel,
          quantity: values.elecQuantity,
          remarks: values.elecRemarks,
        },
      ],
      explosives: [
        {
          chemicals: values.explosiveChemicals,
          quantity: values.explosiveQuantity,
          isManufacturingUnit: values.exploISManufac,
          sourceOfExplosives: values.sourceOfExplosives,
          particulars: values.exploParticulars,
        },
      ],
      jewellery: [
        {
          quantity: values.jewQuantity,
          weight: values.jewWeight,
          description: values.jewDescription,
        },
      ],
      miscellaneous: [
        {
          description: values.misDescription,
        },
      ],
      media: values?.stolenPropertyMedia,
    };

    if (!editClicked) {
      dispatch(addStolenPropertyDetails(config.stolenProperty, addPayload));
    } else {
      addPayload._id = selectedStolenProperty._id;
      dispatch(updateStolenPropertyDetails(config.stolenProperty, addPayload));
    }
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v === null || v === ""));
    setFirDetails(values);
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    form.setFieldsValue({
      placeOfRecovery:
        (values?.houseNo ? values?.houseNo : "") +
        " " +
        (values?.streetRoadNo ? values?.streetRoadNo : "") +
        " " +
        (values?.wardColony ? values?.wardColony : ""),
    });
    setAddressDetails(values);
    setIsAddressModalVisible(false);
  };

  const handleAddressCancel = () => {
    setIsAddressModalVisible(false);
  };

  const handleDownload = (file) => {
    getFileById(file?.fileId, file?.name, file?.url);
  };

  const handleFetch = (values) => {
    let payload = {};
    if (!isUndefined(values?.tr) && values?.tr !== "") {
      payload = {
        type: "tr",
        value: values.tr,
      };
    } else if (
      !isUndefined(values?.registration) &&
      values?.registration !== ""
    ) {
      payload = {
        type: "registration",
        value: values.registration,
      };
    } else if (!isUndefined(values?.chassis) && values?.chassis !== "") {
      payload = {
        type: "chassis",
        value: values.chassis,
      };
    } else if (!isUndefined(values?.engine) && values?.engine !== "") {
      payload = {
        type: "engine",
        value: values.engine,
      };
    }
    if (!isEmpty(payload)) {
      setShowVehicleDetails("fetch");
      dispatch(
        getVehicleData(
          `${config.getVehicleInfo}?type=${payload?.type}&value=${payload?.value}`
        )
      );
    } else {
      openNotificationWithIcon(
        "warning",
        "Please Enter Anyone Of The Parameters"
      );
    }
  };

  const handleVehicleDetailsAdd = () => {
    if (!isEmpty(vehicleDetailsPopUp)) {
      setVehicleInfo(vehicleDetailsPopUp);
    }
    setShowVehicleDetails(false);
  };

  const handleDelete = () => {
    setVehicleInfo({});
    setShowVehicleDetails(false);
  };

  const reportData = getDataForDocument(
    editClicked,
    selectedFileName,
    selectedFir,
    currentUser,
    savedFir,
    firDetails,
    panchWitnessList,
    addressDetails,
    selectedStolenProperty
  );

  console.log("selectedStolenProperty", selectedStolenProperty);

  return (
    <ModuleWrapper>
      <ContentHeader
        headerTitle="Stolen Property"
        addAnother
        addAnotherText="Add Another"
        onSubmitClick={submit}
        isInvestigation={true}
        setAddAnother={setAddAnother}
        onCancel={() => setSelectedSiderMenu("investigation")}
        disableButton={viewClicked || disableForm}
      />
      {isFetching ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Card style={{ width: "75%" }} className="cardLeftStyle">
              <Form form={form} layout="vertical" disabled={true}>
                <Col>
                  <Card>
                    <Row>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="propertyStatus"
                          label="Property Status"
                          rules={[{ required: true }]}
                        >
                          <Select
                            allowClear
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
                            disabled={viewClicked || disableForm}
                            placeholder="Select"
                            onChange={(e) => {
                              setPropertyStatusState(e);
                            }}
                          >
                            {propertyStatus.map((item, _index) => (
                              <Select.Option
                                key={item}
                                value={item}
                                label={item}
                              >
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      {propertyStatusState !== "Lost" &&
                      propertyStatusState !== "Stolen" ? (
                        <>
                          <Col span={8} style={{ padding: "12px" }}>
                            <Form.Item
                              name="propertyRecoveredFrom"
                              label="Property Recovered From"
                            >
                              <Select
                                allowClear
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
                                disabled={viewClicked || disableForm}
                                placeholder="Select"
                                onChange={(e) =>
                                  setSelectedPropertyRecoveredFrom(e)
                                }
                              >
                                {propertyRecoveredFrom.map((item, _index) => (
                                  <Select.Option
                                    placeholder="Select"
                                    key={item}
                                    value={item}
                                    label={item}
                                  >
                                    {item}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8} style={{ padding: "12px" }}>
                            <Form.Item
                              name="selectAccused"
                              label="Select Accused"
                            >
                              <Select
                                allowClear
                                placeholder="Select"
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
                                disabled={
                                  selectedPropertyRecoveredFrom !== "Accused" ||
                                  disableForm
                                }
                              >
                                {!isEmpty(getAccusedDropdownData()) &&
                                  getAccusedDropdownData().map(
                                    (item, index) => (
                                      <Option
                                        key={index}
                                        value={item._id}
                                        label={item.label}
                                      >
                                        {item.label}
                                      </Option>
                                    )
                                  )}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8} style={{ padding: "12px" }}>
                            <Form.Item
                              name="placeOfRecovery"
                              label="Place Of Recovery/Seizure"
                            >
                              <Select
                                allowClear
                                placeholder="Select"
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
                                disabled={viewClicked || disableForm}
                              >
                                {placeOfRecovery.map((item, _index) => (
                                  <Select.Option
                                    placeholder="Select"
                                    key={item}
                                    value={item}
                                    label={item}
                                  >
                                    {item}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <div
                              className="link linkWithPointer"
                              onClick={() =>
                                setIsAddressModalVisible(
                                  disableForm ? false : true
                                )
                              }
                            >
                              Add Address
                            </div>
                          </Col>
                          <Col span={8} style={{ padding: "12px" }}>
                            <Form.Item
                              name="panchWitness"
                              label="Panch Witnesses"
                            >
                              <Select
                                allowClear
                                placeholder="Select"
                                suffixIcon={
                                  <CaretDownOutlined className="dropDownIcon" />
                                }
                                mode="multiple"
                                showSearch
                                onSearch={handleSearch}
                                filterOption={(input, option) =>
                                  serchText &&
                                  option.props.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                disabled={viewClicked || disableForm}
                              >
                                {pwList.map((item, index) => (
                                  <Select.Option
                                    key={index}
                                    value={item._id}
                                    label={item.label}
                                  >
                                    {item.label}
                                    {item?.createdFrom
                                      ? `(${item?.createdFrom})`
                                      : ""}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <div
                              className="link linkWithPointer"
                              onClick={() =>
                                setSelectedSiderMenu("panchWitness")
                              }
                            >
                              Add Panch Witness
                            </div>
                          </Col>
                          <Col span={8} style={{ padding: "12px" }}>
                            <Form.Item
                              name="dateOfSeizure"
                              label="Date & Time of Seizure"
                            >
                              <DatePicker
                                showTime
                                format={DATE_TIME_FORMAT}
                                placeholder="Select Date & Time"
                                style={{ width: 222 }}
                                disabledDate={disableFutureDates}
                                disabled={viewClicked || disableForm}
                              />
                            </Form.Item>
                          </Col>
                        </>
                      ) : null}
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="propertytCategory"
                          label="Property Category"
                          rules={[{ required: true }]}
                        >
                          <Select
                            allowClear
                            placeholder="Select"
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
                            disabled={viewClicked || disableForm}
                            onChange={(e, j) => {
                              if (e) {
                                setpropertyCategoryState(e);
                                setPropertyCategoryNameState(j.label);
                              } else {
                                setpropertyCategoryState("");
                                setPropertyCategoryNameState("");
                              }
                            }}
                          >
                            {mainCategories.map((item, index) => (
                              <Select.Option
                                key={index}
                                value={item.value}
                                label={item.label}
                              >
                                {item.label}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="natureOfStolenProperty"
                          label="Nature of Stolen Property"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder="Select"
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
                            disabled={viewClicked || disableForm}
                          >
                            {natureOFStolenState.map((item, _index) => (
                              <Select.Option
                                key={item}
                                value={item}
                                label={item}
                              >
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="belongsToWhom"
                          label="Belongs To Whom"
                          rules={[
                            {
                              required: true,
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            placeholder="Select"
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
                            disabled={viewClicked || disableForm}
                          >
                            {belongsToWhom.map((item, index) => (
                              <Option key={index} value={item} label={item}>
                                {item}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="estimateValue"
                          label="Estimated Value (Rs.)"
                          rules={
                            !disableEstimatedProperty()
                              ? [
                                  {
                                    required: true,
                                    pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                                    message: "Numbers Only",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input
                            placeholder="Enter here"
                            disabled={
                              viewClicked ||
                              disableForm ||
                              disableEstimatedProperty()
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8} style={{ padding: "12px" }}>
                        <Form.Item
                          name="recoveredValue"
                          label="Recovered Value (Rs.)"
                          rules={
                            !disableRecoverProperty
                              ? [
                                  {
                                    pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                                    message: "Numbers Only",
                                  },
                                ]
                              : []
                          }
                        >
                          <Input
                            placeholder="Enter here"
                            disabled={
                              viewClicked ||
                              disableForm ||
                              disableRecoverProperty
                            }
                          />
                        </Form.Item>
                      </Col>
                      {propertyStatusState === "Recovered" && (
                        <Col span={8} style={{ padding: "12px" }}>
                          <Form.Item name="iOAssistedBy" label="IO assisted by">
                            {renderFieldsWithDropDown(
                              staffMembersList,
                              null,
                              null,
                              false,
                              275,
                              false,
                              "",
                              "Select"
                            )}
                          </Form.Item>
                        </Col>
                      )}

                      {propertyStatusState !== "Lost" &&
                      propertyStatusState !== "Stolen" ? (
                        <Col span={8} style={{ padding: "12px" }}>
                          <Form.Item>
                            <Upload
                              fileList={
                                selectedStolenProperty?._id &&
                                selectedStolenProperty?.seizureReportMedia
                                  ?.name !== ""
                                  ? selectedSeizureReportMedia
                                  : seizureReportMedia
                              }
                              onPreview={handleDownload}
                              onChange={async (info) => {
                                await setSeizureReportMedia(info.fileList);
                              }}
                              customRequest={(options) =>
                                handleUpload(
                                  options,
                                  seizureReportMedia,
                                  setSeizureReportMedia,
                                  setUploadedSeizureReportMedia
                                )
                              }
                              multiple={false}
                              maxCount={1}
                            >
                              {/* <Button
                                className="saveButton"
                                disabled={
                                  seizureReportMedia.length === 1 ||
                                  viewClicked ||
                                  disableForm
                                }
                                style={{ width: 220, marginTop: 22 }}
                              >
                                <div style={{ display: "flex" }}>
                                  <div>
                                    <CameraFilled />
                                  </div>
                                  <div style={{ marginLeft: 12 }}>
                                    Upload Seizure Report
                                  </div>
                                </div>
                              </Button> */}
                            </Upload>
                          </Form.Item>
                        </Col>
                      ) : null}
                    </Row>

                    {GenerateStolenPropertyCategories(propertyCategoryState, {
                      setUploadedArmsInsuranceCertificateMedia,
                      viewClicked,
                      setUploadedCulInsuranceCertificateMedia,
                      setUploadedAsiCertificateMedia,
                      setUploadedLabAnalysisMedia,
                      setUploadedDrugReportMedia,
                      interrogationDoneSelected,
                      setInterrogationDoneSelected,
                      drugGangSelected,
                      setDrugGangSelected,
                      labAnalysisSelected,
                      setlabAnalysisSelected,
                      setIsAddressModalVisible,
                      setNDPSSelected,
                    })}
                  </Card>
                </Col>
              </Form>
              {isLoading && <Loader />}
              {propertyCategoryState === "automobiles" ? (
                <Card style={{ width: "100%", marginTop: "10px" }}>
                  <Form
                    name="vehicleDetailsForm"
                    layout="vertical"
                    onFinish={handleFetch}
                  >
                    <Divider>
                      <span style={{ fontWeight: "bold" }}>
                        Vehicle Details
                      </span>
                    </Divider>
                    <center>
                      <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        (Search using one or multiple parameters)
                      </p>
                    </center>
                    <Row gutter={24}>
                      <Col span={6}>
                        <Form.Item name="tr" label="TRNO">
                          <Input
                            placeholder="Enter TRNO"
                            disabled={viewClicked || disableForm}
                            style={{ width: 180 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="registration" label="Registration No">
                          <Input
                            placeholder="Enter Reg. No"
                            disabled={viewClicked || disableForm}
                            style={{ width: 180 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="chassis" label="Chaisis No">
                          <Input
                            placeholder="Enter Chaisis No"
                            disabled={viewClicked || disableForm}
                            style={{ width: 180 }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item name="engine" label="Engine No">
                          <Input
                            placeholder="Enter Engine No"
                            disabled={viewClicked || disableForm}
                            style={{ width: 180 }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row justify="end" style={{ marginTop: 15 }}>
                      <Col span={6}>
                        <Form.Item>
                          <Button
                            type="primary"
                            className="saveButton"
                            size="large"
                            disabled={viewClicked || disableForm || isFetching}
                            htmlType="submit"
                            style={{
                              width: "160px",
                            }}
                          >
                            Fetch Details
                          </Button>
                        </Form.Item>
                      </Col>
                      {!isEmpty(vehicleInfo) && (
                        <Col span={6}>
                          <Button
                            type="primary"
                            className="stepsButtonActive"
                            size="large"
                            disabled={isFetching}
                            onClick={() => {
                              setShowVehicleDetails("view");
                              setVehicleDetailsPopUp(vehicleInfo);
                            }}
                            style={{
                              backgroundColor: "#258C0B",
                              borderColor: "#258C0B",
                              width: "160px",
                            }}
                          >
                            View Details
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Form>
                </Card>
              ) : null}
            </Card>
            <Card
              style={{ width: "25%" }}
              className="right-section cardRightStyle"
            >
              <div style={{ padding: 10 }}>
                {ndpsSelected ? (
                  <DisplayReportGenerations
                    templateLists={StolenPropertyTemplates}
                    showModal={showModal}
                    selectedRecord={selectedStolenProperty}
                    selectedModule="stolenProperty"
                  />
                ) : (
                  <DisplayReportGenerations
                    templateLists={SeizureReportTemplates}
                    showModal={showModal}
                    selectedRecord={{ crimeId: crimeId }}
                    selectedModule="stolenProperty"
                  />
                )}
                <UploadForm
                  colWidth={22}
                  enableMediaManager={true}
                  setInputFileList={setInputFileList}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  disabled={viewClicked || disableForm}
                />

                {isFetching ? (
                  <Loader />
                ) : (
                  !isEmpty(stolenPropertyApiList) && (
                    <Button
                      style={{ marginTop: "40px", width: "100%" }}
                      onClick={() => setIsRecordsModalVisible(true)}
                    >
                      {stolenPropertyApiList && stolenPropertyApiList.length > 0
                        ? stolenPropertyApiList.length
                        : 0}{" "}
                      Stolen Record (s)
                    </Button>
                  )
                )}
              </div>
            </Card>
          </Row>
        </>
      )}

      <Modal
        title="Stolen Property Records"
        visible={isRecordsModalVisible}
        onOk={() => setIsRecordsModalVisible(false)}
        onCancel={() => setIsRecordsModalVisible(false)}
        style={{ minWidth: "95vw" }}
        footer={null}
      >
        <div style={{ maxHeight: 650, overflowY: "auto" }}>
          <SavedRecords
            stolenPropertyApiList={stolenPropertyApiList}
            setSelectedStolenProperty={setSelectedStolenProperty}
            setViewClicked={setViewClicked}
            setEditClicked={setEditClicked}
            setFormValid={setFormValid}
            selectedRecord={selectedStolenProperty}
            isMedia={false}
            setIsRecordsModalVisible={setIsRecordsModalVisible}
          />
        </div>
      </Modal>

      {isAddressModalVisible ? (
        <AddAddress
          title="Add Address"
          isModalVisible={isAddressModalVisible}
          handleOk={handleAddressOk}
          handleCancel={handleAddressCancel}
          formName={addressForm}
          checkFields={checkFields}
          disabled={viewClicked || disableForm}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedPermanentState={selectedPermanentState}
          setSelectedPermanentState={setSelectedPermanentState}
        />
      ) : null}
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
      <VehicaleDetalsPopUp
        setShowVehicleDetails={setShowVehicleDetails}
        showVehicleDetails={showVehicleDetails}
        vehicleInfo={vehicleInfo}
        setVehicleInfo={setVehicleInfo}
        disable={viewClicked || disableForm || isFetching}
        handleVehicleDetailsAdd={handleVehicleDetailsAdd}
        handleDelete={handleDelete}
        vehicleDetailsPopUp={vehicleDetailsPopUp}
        vehicleIsFetching={vehicleIsFetching}
      />
    </ModuleWrapper>
  );
}
