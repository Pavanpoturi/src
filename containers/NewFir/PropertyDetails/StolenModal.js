/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import axios from "axios";
import UploadForm from "@components/Common/uploadForm";
import AddAddress from "@containers/FirDetails/Investigation/CommonForms/AddAddress";
import ArmsAndAmmunition from "../../stolenProperty/Arms&Ammunition";
import Automobiles from "../../stolenProperty/Automobiles";
import CoinsAndCurrency from "../../stolenProperty/CoinsAndCurrency";
import CulturalProperty from "../../stolenProperty/CulturalProperty";
import DocumentsAndValuableSecurities from "../../stolenProperty/DocumentsAndValuableSecurities";
import DrugsNarcotics from "../../stolenProperty/DrugsNarcotics";
import ElectricalandElectronicGoods from "../../stolenProperty/ElectricalAndElectronicGoods";
import Explosive from "../../stolenProperty/Explosives";
import Jewellery from "../../stolenProperty/Jewellery";
import Miscellaneous from "../../stolenProperty/Miscellaneous";
import VehicleDetailsCard from "../../stolenProperty/VehicleDetailsCard";
import {
  Row,
  Card,
  Col,
  Form,
  Input,
  Select,
  Button,
  notification,
  Checkbox,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { CaretDownOutlined, SaveOutlined } from "@ant-design/icons";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { ModuleWrapper } from "@containers/FirDetails/Investigation/CommonDetails/styles";
import {
  StolenPropertyTemplates,
  getDataForDocument,
  getHTMLFromTemplate,
  mainCategories,
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
} from "@containers/FirDetails/Investigation/StolenProperty/const";
import TemplatesModal from "@containers/FirDetails/Investigation/CommonForms/TemplatesModal";
import DisplayReportGenerations from "@containers/FirDetails/CommonSections/DisplayReportGenerations";
import SavedRecords from "./SavedRecords";
import { isEmpty, first, isUndefined, toNumber } from "lodash";
import { belongsToWhom } from "./const";
import { isNull } from "lodash";
import stolenPropertyActions from "@redux/investigations/stolenProperty/actions";
import createFIRActions from "@redux/createFir/actions";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";

const { TextArea } = Input;

export default function StolenProperty({
  crimeId,
  isStolenVisible,
  setIsStolenVisible,
  stolenHandleCancel,
  disable,
  payloadList,
  setPayloadList,
  particularOfPropertyState,
  setparticularOfPropertyState,
  settotalEstimatedValueRsState,
}) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [addressForm] = Form.useForm();
  const [formValid, setFormValid] = useState(true);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("stolenProperty");
  const [searchText, setSearchText] = useState("");
  const [selectedTemplateName, setSelectedTemplateName] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [addressDetails, setAddressDetails] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [armsInsuranceCertificateMedia, setarmsInsuranceCertificateMedia] =
    useState([]);
  const [
    uploadedarmsInsuranceCertificateMedia,
    setuploadedarmsInsuranceCertificateMedia,
  ] = useState({});
  const [culInsuranceCertificateMedia, setculInsuranceCertificateMedia] =
    useState([]);
  const [
    uploadedculInsuranceCertificateMedia,
    setuploadedculInsuranceCertificateMedia,
  ] = useState({});
  const [asiCertificateMedia, setasiCertificateMedia] = useState([]);
  const [uploadedasiCertificateMedia, setuploadedasiCertificateMedia] =
    useState({});
  const [labAnalysisMedia, setlabAnalysisMedia] = useState([]);
  const [uploadedlabAnalysisMedia, setuploadedlabAnalysisMedia] = useState({});
  const [drugReportMedia, setdrugReportMedia] = useState([]);
  const [uploadeddrugReportMedia, setuploadeddrugReportMedia] = useState({});
  const [isTemplateModalVisible, setTemplateIsModalVisible] = useState(false);
  const [vieiwClicked, setvieiwClicked] = useState(false);
  const [editClicked, seteditClicked] = useState(false);
  const [selectedStolenProperty, setselectedStolenProperty] = useState({});
  const [propertyCategoryState, setpropertyCategoryState] = useState("");
  const [natureOFStolenState, setnatureOFStolenState] = useState([]);
  const [labAnalysisSelected, setlabAnalysisSelected] = useState(false);
  const [drugGangSelected, setdrugGangSelected] = useState(false);
  const [selectedStolenPropertyIndex, setselectedStolenPropertyIndex] =
    useState("");
  const [interrogationDoneSelected, setinterrogationDoneSelected] =
    useState(false);
  const [ndpsSelected, setNDPSSelected] = useState(false);
  const [isAddAnotherStolen, setisAddAnotherStolen] = useState(false);
  const [vehicleInfo, setVehicleInfo] = useState({});
  const { getFIRData } = createFIRActions;
  const { deleteStolenPropertyDetails, resetActionType } =
    stolenPropertyActions;
  const { actionType, errorMessage, successMessage } = useSelector(
    (state) => state.stolenProperty
  );
  const isSuccess = actionType === "DELETE_STOLEN_PROPERTY_SUCCESS";
  const isError = actionType === "DELETE_STOLEN_PROPERTY_ERROR";

  useEffect(() => {
    if (isSuccess || isError) {
      if (successMessage === "Stolen Property Successfully Deleted") {
        dispatch(resetActionType());
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (propertyCategoryState === "armsAndAmmunition") {
      setnatureOFStolenState(natureOFStolenArms);
    }
    if (propertyCategoryState === "automobiles") {
      setnatureOFStolenState(natureOFStolenAuto);
    }
    if (propertyCategoryState === "coinsandCurrency") {
      setnatureOFStolenState(natureOFStolenCoins);
    }
    if (propertyCategoryState === "culturalProperty") {
      setnatureOFStolenState(natureOFStolenCultural);
    }
    if (propertyCategoryState === "documentsandValuableSecurities") {
      setnatureOFStolenState(natureOFStolenDoucments);
    }
    if (propertyCategoryState === "drugsNarcotics") {
      setnatureOFStolenState(natureOFStolenDrugs);
    }
    if (propertyCategoryState === "electricalandElectronicGoods") {
      setnatureOFStolenState(natureOFStolenElectrical);
    }
    if (propertyCategoryState === "explosives") {
      setnatureOFStolenState(natureOFStolenExplosives);
    }
    if (propertyCategoryState === "jewellery") {
      setnatureOFStolenState(natureOFStolenJewellery);
    }
    if (propertyCategoryState === "miscellaneous") {
      setnatureOFStolenState(natureOFStolenMis);
    }
  }, [propertyCategoryState]);

  const handleTemplateCancel = () => {
    setTemplateIsModalVisible(false);
  };

  //for total Estimate sum
  useEffect(() => {
    getTotalEstimatedValue();
  }, [payloadList]);

  const handleDeleteStolen = (index, stolenProperty) => {
    if (stolenProperty?._id) {
      let deletePayload = {
        crimeId: crimeId,
        stolenPropertyId: stolenProperty?._id,
      };
      dispatch(
        deleteStolenPropertyDetails(config.deleteStolenProperty, deletePayload)
      );
    } else {
      payloadList.splice(index, 1);
      setPayloadList([...payloadList]);
    }
  };

  const getTotalEstimatedValue = () => {
    let sum = 0;
    if (payloadList.length > 0) {
      payloadList.forEach((ele) =>
        ele?.estimateValue && parseFloat(ele?.estimateValue) > 0
          ? (sum = sum + parseFloat(ele?.estimateValue))
          : sum
      );
    }
    form.setFieldsValue({ totalEstimatedValueRs: sum });
    settotalEstimatedValueRsState(sum);
  };

  useEffect(() => {
    form.setFieldsValue({ particularOfProperty: particularOfPropertyState });
  }, [particularOfPropertyState]);

  const submit = async () => {
    const values = await form.validateFields();
    const recoveredValue = !isEmpty(values?.recoveredValue)
      ? toNumber(values?.recoveredValue)
      : 0;
    const estimateValue = toNumber(values?.estimateValue);
    if (toNumber(recoveredValue || 0) <= toNumber(estimateValue || 0)) {
      const addPayload = {
        propertyStatus: values.propertyStatus,
        isInitialFir: true,
        propertytCategory: values.propertytCategory,
        natureofStolen: values.natureOfStolenProperty,
        belongsToWhom: values.belongsToWhom,
        estimateValue: parseFloat(values.estimateValue),
        recoveredValue: parseFloat(values.recoveredValue),
        particularOfProperty: particularOfPropertyState,
        armsAndAmmunition: [
          {
            manufacturer: values.armsManufacturer,
            armsCategory: values.armspropertytCategory,
            made: values.armsMade,
            licensed: values.armsLicensed,
            isManufacturingUnit: values.armsisManufacturingUnit,
            sourceOfArm: values.sourceOfArm,
            countryOfDesign: values.countryOfDesign,
            weaponNumber: values.weaponNumber,
            insuranceCertificateNo: values.armsInsuranceCerNo,
            model: values.armsModel,
            bore: values.armsBore,
            quantity: values.armsQuantity,
            specialMarksOfIdentification:
              values.armsspecialMarksOfIdentification,
            nameOfInsuranceCompany: values.armsNameOfInsurance,
            remarks: values.armsRemarks,
            insuranceCertificateMedia: uploadedarmsInsuranceCertificateMedia,
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
            asiCertificateMedia: uploadedasiCertificateMedia,
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
            address: addressDetails,
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
            drugReportMedia: uploadeddrugReportMedia,
            labAnalysisMedia: uploadedlabAnalysisMedia,
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
      };

      if (selectedStolenProperty?._id) {
        addPayload._id = selectedStolenProperty._id;
      }

      let updatedResult = [];
      if (selectedStolenPropertyIndex) {
        console.log(selectedStolenPropertyIndex, addPayload);
        let n2 = [...payloadList];
        n2[selectedStolenPropertyIndex - 1] = addPayload;
        updatedResult = [...n2];
      } else {
        isEmpty(payloadList)
          ? (updatedResult = [addPayload])
          : (updatedResult = [...payloadList, addPayload]);
      }
      if (isAddAnotherStolen) {
        form.resetFields();
        setPayloadList(updatedResult);
      } else {
        if (isEmpty(payloadList)) {
          form.resetFields();
          setPayloadList([addPayload]);
          setIsStolenVisible(false);
        } else {
          form.resetFields();
          setPayloadList(updatedResult);
          setIsStolenVisible(false);
        }
      }
      setpropertyCategoryState("");
      setselectedStolenProperty("");
      setselectedStolenPropertyIndex("");
      form.setFieldsValue({ particularOfProperty: particularOfPropertyState });
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

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v === null || v === ""));
  };

  useEffect(() => {
    if (!isNull(selectedStolenProperty)) {
      setpropertyCategoryState(selectedStolenProperty?.propertytCategory);
      const addressDetails =
        !isEmpty(selectedStolenProperty?.drugsNarcotics) &&
        first(selectedStolenProperty?.drugsNarcotics)?.address;
      if (addressDetails) {
        form.setFieldsValue({
          drugsAdress:
            (addressDetails?.houseNo ? addressDetails?.houseNo : "") +
            " " +
            (addressDetails?.streetRoadNo
              ? addressDetails?.address?.streetRoadNo
              : "") +
            " " +
            (addressDetails?.wardColony ? addressDetails?.wardColony : ""),
        });
      } else {
        form.setFieldsValue({
          drugsAdress: addressDetails?.address,
        });
      }
      addressForm.setFieldsValue({
        houseNo: addressDetails?.houseNo,
        areaMandal: addressDetails?.areaMandal,
        district: addressDetails?.district,
        landmarkMilestone: addressDetails?.address?.landmarkMilestone,
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
        P_landmarkMilestone: addressDetails?.address?.P_landmarkMilestone,
        p_localityVillage: addressDetails?.address?.p_localityVillage,
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
      const coisnAndCurrency =
        selectedStolenProperty &&
        !isEmpty(selectedStolenProperty?.coisnAndCurrency) &&
        first(selectedStolenProperty?.coisnAndCurrency);
      const automobiles =
        selectedStolenProperty &&
        !isEmpty(selectedStolenProperty?.automobiles) &&
        first(selectedStolenProperty?.automobiles);
      if (!isUndefined(automobiles?.chassisNo)) {
        setVehicleInfo(automobiles);
      }
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
      //setting particularOfPropertyState value same for all records to show in print fir
      setparticularOfPropertyState(
        particularOfPropertyState
          ? particularOfPropertyState
          : selectedStolenProperty?.particularOfProperty
      );
      form.setFieldsValue({
        propertyStatus: selectedStolenProperty?.propertyStatus,
        propertytCategory: selectedStolenProperty?.propertytCategory,
        natureOfStolenProperty: selectedStolenProperty?.natureofStolen,
        belongsToWhom: selectedStolenProperty?.belongsToWhom,
        estimateValue: selectedStolenProperty?.estimateValue,
        recoveredValue: selectedStolenProperty?.recoveredValue,
        particularOfProperty: particularOfPropertyState
          ? particularOfPropertyState
          : selectedStolenProperty?.particularOfProperty,
        armsManufacturer: armsAndAmmunition?.manufacturer,
        armspropertytCategory: armsAndAmmunition?.armsCategory,
        armsMade: armsAndAmmunition?.made,
        armsLicensed: armsAndAmmunition?.licensed,
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
        specialIdentifiactionDetails: automobiles?.specialIdentifiaction,
        countryOfOrigin: coisnAndCurrency?.countryOfOrigin,
        denomination: coisnAndCurrency?.denomination,
        series: coisnAndCurrency?.series,
        quality: coisnAndCurrency?.quality,
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
        misDescription:
          !isEmpty(selectedStolenProperty?.miscellaneous) &&
          first(selectedStolenProperty?.miscellaneous)?.description,
      });

      if (armsAndAmmunition?.insuranceCertificateMedia) {
        setuploadedarmsInsuranceCertificateMedia(
          armsAndAmmunition?.insuranceCertificateMedia
        );
      }
      if (culturalProperty?.insuranceCertificateMedia) {
        setuploadedculInsuranceCertificateMedia(
          culturalProperty?.insuranceCertificateMedia
        );
      }
      if (drugsNarcotics?.drugReportMedia) {
        setuploadeddrugReportMedia(drugsNarcotics?.drugReportMedia);
      }
      if (drugsNarcotics?.labAnalysisMedia) {
        setuploadedlabAnalysisMedia(drugsNarcotics?.labAnalysisMedia);
      }
      setNDPSSelected(drugsNarcotics?.whetherNotice);
      setlabAnalysisSelected(drugsNarcotics?.whetherLab);
      setdrugGangSelected(drugsNarcotics?.whetherDrugSyndicate);
      setinterrogationDoneSelected(drugsNarcotics?.whetherInterrogation);
    }
  }, [selectedStolenProperty]);

  const handleUpload = (options, params1, params2, params3) => {
    if (params1.length > 0) {
      const mediaFormData = new FormData();
      params1.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", "newFIr");
      mediaFormData.append("folderPath", `newFIR/StolenProperty/media`);

      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((response) => {
          console.log(response.data);
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
          console.log(err);
          openNotificationWithIcon("error", "Uploaing Went Wrong");
          options.onError("ok");
        });
    }
  };

  const handleAddressOk = async () => {
    const values = await addressForm.validateFields();
    form.setFieldsValue({
      drugsAdress:
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

  const renderDropdownFields = (data) => (
    <Select
      allowClear
      suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
      showSearch
      onSearch={handleSearch}
      filterOption={(input, option) =>
        searchText &&
        option.props?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      disabled={vieiwClicked || disable}
      placeholder="Select"
    >
      {!isEmpty(data) &&
        data.map((item, _index) => (
          <Select.Option key={item} value={item} label={item}>
            {item}
          </Select.Option>
        ))}
    </Select>
  );
  const displayContent = (data) => {
    // eslint-disable-next-line default-case
    switch (data) {
      case "armsAndAmmunition":
        return (
          <ArmsAndAmmunition
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
            handleUpload={handleUpload}
            armsInsuranceCertificateMedia={armsInsuranceCertificateMedia}
            setarmsInsuranceCertificateMedia={(item) =>
              setarmsInsuranceCertificateMedia(item)
            }
            setuploadedarmsInsuranceCertificateMedia={
              setuploadedarmsInsuranceCertificateMedia
            }
          />
        );
      case "automobiles":
        return (
          <Automobiles
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "coinsandCurrency":
        return (
          <CoinsAndCurrency
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "culturalProperty":
        return (
          <CulturalProperty
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
            handleUpload={handleUpload}
            setculInsuranceCertificateMedia={(item) =>
              setculInsuranceCertificateMedia(item)
            }
            culInsuranceCertificateMedia={culInsuranceCertificateMedia}
            setuploadedculInsuranceCertificateMedia={
              setuploadedculInsuranceCertificateMedia
            }
            setasiCertificateMedia={(item) => setasiCertificateMedia(item)}
            asiCertificateMedia={asiCertificateMedia}
            setuploadedasiCertificateMedia={setuploadedasiCertificateMedia}
          />
        );
      case "documentsandValuableSecurities":
        return (
          <DocumentsAndValuableSecurities
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "drugsNarcotics":
        return (
          <DrugsNarcotics
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
            handleUpload={handleUpload}
            setIsAddressModalVisible={(item) => setIsAddressModalVisible(item)}
            setNDPSSelected={(item) => setNDPSSelected(item)}
            setlabAnalysisSelected={(item) => setlabAnalysisSelected(item)}
            labAnalysisSelected={labAnalysisSelected}
            setlabAnalysisMedia={(item) => setlabAnalysisMedia(item)}
            labAnalysisMedia={labAnalysisMedia}
            setuploadedlabAnalysisMedia={setuploadedlabAnalysisMedia}
            setdrugGangSelected={(item) => setdrugGangSelected(item)}
            drugGangSelected={drugGangSelected}
            setinterrogationDoneSelected={(item) =>
              setinterrogationDoneSelected(item)
            }
            interrogationDoneSelected={interrogationDoneSelected}
            setdrugReportMedia={(item) => setdrugReportMedia(item)}
            drugReportMedia={drugReportMedia}
            setuploadeddrugReportMedia={setuploadeddrugReportMedia}
          />
        );
      case "electricalandElectronicGoods":
        return (
          <ElectricalandElectronicGoods
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "explosives":
        return (
          <Explosive
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "jewellery":
        return (
          <Jewellery
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
      case "miscellaneous":
        return (
          <Miscellaneous
            disable={disable}
            vieiwClicked={vieiwClicked}
            changeValue={checkFields}
          />
        );
    }
  };

  const reportData = getDataForDocument(
    editClicked,
    selectedFileName,
    addressDetails,
    selectedStolenProperty
  );

  return (
    <ModuleWrapper>
      <Row>
        <Card style={{ width: "70%" }} className="cardLeftStyleStolen">
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
                      {renderDropdownFields([
                        "Involved",
                        "Lost",
                        "Seized",
                        "Stolen",
                        "Others",
                      ])}
                    </Form.Item>
                  </Col>
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
                          searchText &&
                          option.props?.label
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={vieiwClicked || disable}
                        onChange={(e) => {
                          if (e) {
                            setpropertyCategoryState(e);
                          } else {
                            setpropertyCategoryState("");
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
                      {renderDropdownFields(natureOFStolenState)}
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
                      {renderFieldsWithDropDown(
                        belongsToWhom,
                        null,
                        handleSearch,
                        searchText,
                        250,
                        vieiwClicked || disable
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="estimateValue"
                      label="Estimated Value (Rs.)"
                      rules={[
                        {
                          required: true,
                          pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                          message: "Numbers Only",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter here"
                        disabled={vieiwClicked || disable}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ padding: "12px" }}>
                    <Form.Item
                      name="recoveredValue"
                      label="Recovered Value (Rs.)"
                      rules={[
                        {
                          pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                          message: "Numbers Only",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter here"
                        disabled={vieiwClicked || disable}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                {displayContent(propertyCategoryState)}
              </Card>
              {propertyCategoryState === "automobiles" && (
                <VehicleDetailsCard
                  disable={disable}
                  viewClicked={vieiwClicked}
                  vehicleInfo={vehicleInfo}
                  setVehicleInfo={setVehicleInfo}
                />
              )}
            </Col>
          </Form>
        </Card>
        <Card
          style={{ width: "30%" }}
          className="right-section cardRightStyleStolen"
        >
          <UploadForm
            colWidth={22}
            enableMediaManager={true}
            setInputFileList={setInputFileList}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            disabled={vieiwClicked || disable}
          />
          {ndpsSelected ? (
            <DisplayReportGenerations
              templateLists={StolenPropertyTemplates}
              showModal={showModal}
              selectedRecord={selectedStolenProperty}
              selectedModule="stolenProperty"
            />
          ) : null}

          {!isEmpty(payloadList) ? (
            <div style={{ marginTop: 30 }}>
              <SavedRecords
                stolenPropertyApiList={payloadList}
                setselectedStolenProperty={setselectedStolenProperty}
                setvieiwClicked={setvieiwClicked}
                seteditClicked={seteditClicked}
                setFormValid={setFormValid}
                selectedRecord={selectedStolenProperty}
                setselectedStolenPropertyIndex={setselectedStolenPropertyIndex}
                isMedia={false}
                disable={disable}
                handleDeleteStolen={handleDeleteStolen}
              />
            </div>
          ) : null}
        </Card>

        <Card style={{ width: "100%", marginTop: "2%" }}>
          <Form form={form} layout="vertical" disabled={true}>
            <Row style={{ width: "70%" }}>
              <Col span={8} style={{ padding: "12px" }}>
                <Form.Item
                  name="totalEstimatedValueRs"
                  label="Total Estimated Value (Rs.)"
                  defaultValue={"1000"}
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
              <Col span={16} style={{ padding: "12px" }}>
                <Form.Item
                  name="particularOfProperty"
                  label="Particular of Property"
                  onChange={(e) => {
                    setparticularOfPropertyState(e.target.value);
                  }}
                >
                  <TextArea
                    placeholder="Enter here"
                    disabled={vieiwClicked || disable}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Row>

      {isAddressModalVisible ? (
        <AddAddress
          title="Add Address"
          isModalVisible={isAddressModalVisible}
          handleOk={handleAddressOk}
          handleCancel={handleAddressCancel}
          formName={addressForm}
          checkFields={checkFields}
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
      <br />
      <Checkbox
        style={{ color: "#949494", fontWeight: 300 }}
        disabled={disable}
        onChange={(e) => setisAddAnotherStolen(e.target.checked)}
      >
        Add Another
      </Checkbox>
      <span
        className="linkStyle resetLink"
        onClick={() => {
          stolenHandleCancel();
          form.resetFields();
          setIsStolenVisible(false);
          setselectedStolenProperty("");
          setselectedStolenPropertyIndex("");
          setpropertyCategoryState("");
          dispatch(crimeSceneActions.resetVehicleData());
          setVehicleInfo({});
        }}
        style={{ marginLeft: 10, float: "right" }}
      >
        Cancel
      </span>
      <Button
        type="primary"
        className="saveButton"
        icon={<SaveOutlined className="saveButtonIcon" />}
        disabled={disable}
        onClick={submit}
        style={{ float: "right" }}
      >
        Add
      </Button>
    </ModuleWrapper>
  );
}
