/* eslint-disable array-callback-return */
import {
  Col,
  Divider,
  Form,
  Button,
  Radio,
  Row,
  Input,
  Checkbox,
  Upload,
  notification,
} from "antd";
import { SaveOutlined, CameraFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import Loader from "@components/utility/loader";
import { isUndefined, isEmpty, uniqBy, first, isArray } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import StandardCrimeClassificationForm from "@components/Common/standardCrimeClassificationForm";
import { config } from "@config/site.config";
import { textFieldRules } from "@components/Common/formOptions";
import AddPerson from "../Investigation/CommonForms/AddPerson";
import {
  renderFieldsWithMultipleDropDown,
  renderFieldsWithDropDown,
  tattosMarkList,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import axios from "axios";
import {
  roadAccidentDetailsForm,
  roadDetails,
  vehicleDetails,
  otherClassification,
  otherClassification2,
  languageList,
  whetherList,
} from "./const";
import crimeSceneActions from "@redux/investigations/crimeScene/actions";
const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  crimeClassificationRadioBtn: {
    marginRight: 20,
    width: 250,
  },
};

const whetherDeadBodyList = [
  {
    _id: "Killed at spot",
    label: "Killed at spot",
  },
  {
    _id: "Killed at somewhere and brought",
    label: "Killed at somewhere and brought",
  },
];

const optionType = {
  CRIME_CLASSIFICATION: "CRIME_CLASSIFICATION",
  MAJOR_HEAD: "MAJOR_HEAD",
  MINOR_HEAD: "MINOR_HEAD",
  ROAD_ACCIDENT: "ROAD_ACCIDENT",
  BODY_TYPE: "BODY_TYPE",
  BEARD: "BEARD",
  HAIR_COLOR: "HAIR_COLOR",
  EYE_COLOR: "EYE_COLOR",
  COMPLEXION: "COMPLEXION",
  DEFORMITIES: "DEFORMITIES",
  MOLES: "MOLES",
  MUSTACHES: "MUSTACHES",
  TEETH: "TEETH",
  GENDER: "GENDER",
};

export default function CrimeClassification({
  crimeSceneDate,
  handleSubmit,
  currentData,
  disableEdit,
  validationExceptionList = [],
  setShowVehicleDetails,
  vehicleInfo,
  setVehiclesDetails,
}) {
  const [form] = Form.useForm();
  const [personForm] = Form.useForm();
  const [formValid, SetFormValid] = useState(false);
  const [isMviInspection, setIsmviInspection] = useState(false);
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [classificationType, setClassificationType] = useState("");
  const [deadBodyidentified, setdeadBodyidentified] = useState("Unidentified");
  const [selectedMajorHead, setSelectedMajorHead] = useState("");
  const [stateWhetherWalletOrId, setstateWhetherWalletOrId] = useState(false);
  const [knownChecked, setknownChecked] = useState(false);
  const [statePhotoGraphsTaken, setstatePhotoGraphsTaken] = useState(false);
  const [deformitiesType, setDeformitiesType] = useState("");
  const [photographsTaken, setphotographsTaken] = useState([]);
  const [age, setAge] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [uploadedphotographsTaken, setuploadedphotographsTaken] = useState({});
  const { getVehicleData } = crimeSceneActions;
  const {
    getCrimeClassificationList,
    getMajorHeadList,
    getMinorHeadList,
    getRoadAccidentList,
    getMolesList,
    getDeformitiesList,
    getComplexionList,
    getEyeColorList,
    getHairColorList,
    getBodyTypeList,
    getTeethList,
    getMustachesList,
    getBeardList,
    getGendersList,
  } = masterDataActions;
  const {
    majorHeadList,
    minorHeadList,
    crimeClassificationList,
    roadAccidentList,
    bodyTypeList,
    hairColorList,
    gendersList,
    eyeColorList,
    molesList,
    deformitiesList,
    complexionList,
    teethList,
    mustachesList,
    beardList,
  } = useSelector((state) => state.MasterData);
  const { isFetching, actionType, errorMessage } = useSelector(
    (state) => state.CrimeScene
  );
  const { savedFir } = useSelector((state) => state.createFIR);

  const majorHeadCode =
    !isEmpty(majorHeadList) &&
    first(majorHeadList.filter((s) => s.label === selectedMajorHead))?.code;
  const filteredMinorHeadList =
    majorHeadCode &&
    !isEmpty(minorHeadList) &&
    minorHeadList.filter((s) => s.code === majorHeadCode);

  function setFormData(data) {
    if (data) {
      const {
        classification,
        majorHead,
        minorHead,
        deadBody,
        bodyAt,
        pmeConducted,
      } = !isUndefined(data) && data;
      const {
        approxAge,
        complexion,
        deformities,
        deformitiesType,
        eyeColor,
        gender,
        hairColor,
        height,
        killSpotBrought,
        bodyBuiltType,
        teeth,
        beard,
        mustache,
        moles,
        state,
        tailorMarksDetails,
        tattoo,
        valuables,
        visibleInjuries,
        photographsTaken,
        photographs,
        fingerPrintTaken,
        walletFound,
        wallet,
      } = !isUndefined(deadBody) && deadBody;
      if (classification) {
        setClassificationType(classification);
      } else if (savedFir?.firDetail?.crimeType) {
        setClassificationType(savedFir.firDetail.crimeType);
      }
      if (photographs) {
        setphotographsTaken(photographs);
      }
      const roadAccident =
        !isUndefined(data?.roadAccident) && data?.roadAccident;
      setDeformitiesType(data?.other?.deformitiesType);
      setknownChecked(roadAccident?.driverDetails?.known);
      setstateWhetherWalletOrId(walletFound || data?.other?.walletOrIdFound);
      setSelectedPerson(roadAccident?.personDetails);
      setSelectedMajorHead(majorHead);
      setVehiclesDetails(roadAccident?.vehicleDetailsNew);
      form.setFieldsValue({
        classification: classification
          ? classification
          : savedFir.firDetail.crimeType,
        majorHead: majorHead
          ? majorHead
          : first(savedFir?.firDetail?.majorMinorClassification)?.majorHead,
        minorHead: minorHead
          ? minorHead
          : first(savedFir?.firDetail?.majorMinorClassification)?.minorHead,
        state: state,
        height: height || data?.other?.height,
        complexion: complexion || data?.other?.complexion,
        whether: data?.other?.whether,
        eyeColor: eyeColor || data?.other?.eyeColor,
        hairColor: hairColor || data?.other?.hairColor,
        clothsWorn: data?.other?.clothsWorn,
        visibleInjuries: visibleInjuries || data?.other?.visibleInjuries,
        anyValuables: data?.other?.anyValuables,
        walletOrIdFoundText: wallet || data?.other?.walletOrIdFoundText,
        walletOrIdFound: walletFound || data?.other?.walletOrIdFound,
        whetherFingerPrintsTaken: fingerPrintTaken,
        whetherPhotographsTaken: photographsTaken,
        approxAge: approxAge,
        teeth: teeth || data?.other?.teeth,
        beard: beard || data?.other?.beard,
        mustache: mustache,
        gender: gender || data?.other?.gender,
        moles: moles || data?.other?.moles,
        tattooMarks: tattoo || data?.other?.tattooMarks,
        deformities: deformities || data?.other?.deformities,
        deformitiesType: deformitiesType || data?.other?.deformitiesType,
        bodyBuiltType: bodyBuiltType || data?.other?.bodyBuiltType,
        approximateAge: data?.other?.approximateAge,
        languagesSpeak: data?.other?.languagesSpeak,
        languagesWrite: data?.other?.languagesWrite,
        tattoo: tattoo,
        valuables: valuables,
        tailorMarksDetails: tailorMarksDetails,
        killSpotBrought: killSpotBrought,
        bodyAt: bodyAt,
        pmeConducted: pmeConducted,
        accidentClassification: roadAccident?.accidentClassification,
        accidentLocation: roadAccident?.accidentLocation,
        accidentType: roadAccident?.accidentType,
        areaType: roadAccident?.areaType,
        causeOfAccident: roadAccident?.causeOfAccident,
        faultOfDriver: roadAccident?.faultOfDriver,
        maneuver: roadAccident?.maneuver,
        nature: roadAccident?.nature,
        severity: roadAccident?.severity,
        vehicleDetails: roadAccident?.vehicleDetails,
        victimManeuver: roadAccident?.victimManeuver,
        victimNature: roadAccident?.victimNature,
        weatherCondition: roadAccident?.weatherCondition,
        junctionType: roadAccident?.roadDetails?.junctionType,
        roadSurface: roadAccident?.roadDetails?.roadSurface,
        roadType: roadAccident?.roadDetails?.roadType,
        surfaceCarriageWayWidth:
          roadAccident?.roadDetails?.surfaceCarriageWayWidth,
        surfaceCondition: roadAccident?.roadDetails?.surfaceCondition,
        surfaceHorizontalFeatures:
          roadAccident?.roadDetails?.surfaceHorizontalFeatures,
        surfaceNature: roadAccident?.roadDetails?.surfaceNature,
        surfaceVerticalFeatures:
          roadAccident?.roadDetails?.surfaceVerticalFeatures,
        trafficControlType: roadAccident?.roadDetails?.trafficControlType,
        hasAnyDeformities: roadAccident?.driverDetails?.hasAnyDeformities,
        isDriverLeftHanded: roadAccident?.driverDetails?.isDriverLeftHanded,
        known: roadAccident?.driverDetails?.known,
        licenseCancelledOrSuspended:
          roadAccident?.driverDetails?.licenseCancelledOrSuspended,
        licenseType: roadAccident?.driverDetails?.licenseType,
        personDrivingVehicle: roadAccident?.driverDetails?.personDrivingVehicle,
        documentsIfAny:
          roadAccident?.driverDetails?.otherInformation?.documentsIfAny,
        mviInspection:
          roadAccident?.driverDetails?.otherInformation?.mviInspection,
        noMviReason: roadAccident?.driverDetails?.otherInformation?.noMviReason,
        tripSheetsIfAny:
          roadAccident?.driverDetails?.otherInformation?.tripSheetsIfAny,
      });
      setIsmviInspection(
        roadAccident?.driverDetails?.otherInformation?.mviInspection
      );
    }
  }

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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

  useEffect(() => {
    setFormData(currentData);
  }, [currentData]);

  useEffect(() => {
    if (!isFetching) {
      if (actionType === "FETCH_VEHICLE_SUCCESS") {
        openNotificationWithIcon("success", "Successfully Fetched Details");
      } else if (
        actionType === "FETCH_VEHICLE_ERROR" &&
        !isEmpty(errorMessage)
      ) {
        openNotificationWithIcon("error", errorMessage);
        setShowVehicleDetails(false);
      }
    }
  }, [actionType, isFetching]);

  const checkFields = async () => {
    const values = await form.validateFields();
    SetFormValid(
      !Object.values(values).every(
        (v) => v == null || (typeof v === "string" && v.trim() === "")
      )
    );
  };

  const onCrimeClassificationChange = (val) => {
    setClassificationType(val);
    checkFields();
  };

  const onMajorHeadChange = (val) => {
    setSelectedMajorHead(val);
    form.setFieldsValue({
      minorHead: "",
    });
    checkFields();
  };

  const submit = async () => {
    const values = await form.validateFields();
    handleSubmit(
      { ...values, vehicleDetailsNew: vehicleInfo },
      classificationType,
      photographsTaken,
      selectedPerson
    );
    SetFormValid(false);
    form.resetFields();
  };

  const reset = () => {
    form.resetFields();
    SetFormValid(false);
    setFormData(currentData);
  };

  const [serchText, setSerchText] = useState("");
  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(
      getCrimeClassificationList(`${url}/${optionType.CRIME_CLASSIFICATION}`)
    );
    dispatch(getGendersList(`${url}/${optionType.GENDER}`));
    dispatch(getMajorHeadList(`${url}/${optionType.MAJOR_HEAD}`));
    dispatch(getMinorHeadList(`${url}/${optionType.MINOR_HEAD}`));
    dispatch(getRoadAccidentList(`${url}/${optionType.ROAD_ACCIDENT}`));
    dispatch(getMolesList(`${url}/${optionType.MOLES}`));
    dispatch(getDeformitiesList(`${url}/${optionType.DEFORMITIES}`));
    dispatch(getComplexionList(`${url}/${optionType.COMPLEXION}`));
    dispatch(getEyeColorList(`${url}/${optionType.EYE_COLOR}`));
    dispatch(getHairColorList(`${url}/${optionType.HAIR_COLOR}`));
    dispatch(getBodyTypeList(`${url}/${optionType.BODY_TYPE}`));
    dispatch(getTeethList(`${url}/${optionType.TEETH}`));
    dispatch(getBeardList(`${url}/${optionType.BEARD}`));
    dispatch(getMustachesList(`${url}/${optionType.MUSTACHES}`));
  }, []);

  const getDeformitiesTypeList = () => {
    let arr = [];
    deformitiesList &&
      !isEmpty(deformitiesList) &&
      deformitiesList.map((item) => {
        const result = {
          label: item?.type,
          _id: item?._id,
        };
        arr.push(result);
      });
    return uniqBy(arr, "label");
  };

  const getDeformitiesDropdownList = () => {
    let arr = [];
    const list =
      !isEmpty(deformitiesList) &&
      deformitiesList.filter((s) => s.type === deformitiesType);
    list &&
      list.map((item) => {
        const result = {
          label: item?.sub_type,
          _id: item?._id,
          type: item?.type,
        };
        arr.push(result);
      });
    return arr;
  };
  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const handleUpload = (options, params1, params2, params3) => {
    if (params1.length > 0) {
      const mediaFormData = new FormData();
      params1.forEach((file) => {
        mediaFormData.append("file", file.originFileObj);
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append(
        "folderPath",
        `${crimeId}/crimeClass_bodilyOffence/media`
      );

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

  const displayState = (data, actionName) => {
    return (
      <Row className="custody-reasons-row">
        {data.map((s, i) => {
          const isLabel =
            isArray(validationExceptionList) &&
            validationExceptionList.indexOf(s.label) === -1
              ? true
              : false;
          return (
            <Col span={6} key={i} style={{ marginBottom: 20 }}>
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
            </Col>
          );
        })}
      </Row>
    );
  };

  const filterDropdownValues = (entity) =>
    roadAccidentList.filter((s) => s.entity === entity);
  const getDropdownList = (data) => {
    let arr = [];
    !isEmpty(data) &&
      data.map((item) => {
        const result = {
          label: item?.entity_value,
          name: item?.entity,
        };
        arr.push(result);
      });
    return arr;
  };

  const onDeformitiesTypeChange = (val) => {
    setDeformitiesType(val);
    form.setFieldsValue({
      deformities: "",
    });
    checkFields();
  };

  const displayFields = (name) => {
    switch (name) {
      case "accidentType":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("accidentType")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "accidentClassification":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("accidentClassification")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "accidentLocation":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("accidentLocation")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "severity":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("severity")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "maneuver":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("maneuver")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "victimManeuver":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("victimManeuver")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "areaType":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("areaType")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "weatherCondition":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("weatherCondition")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "causeOfAccident":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("causeOfAccident")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "faultOfDriver":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("faultOfDriver")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "nature":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("nature")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "victimNature":
        return renderFieldsWithMultipleDropDown(
          getDropdownList(filterDropdownValues("victimNature")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "roadType":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("roadType")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "roadSurface":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("roadSurface")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "surfaceCondition":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("surfaceCondition")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "surfaceNature":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("surfaceNature")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "surfaceHorizontalFeatures":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("surfaceHorizontalFeatures")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "surfaceVerticalFeatures":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("surfaceVerticalFeatures")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "surfaceCarriageWayWidth":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("surfaceCarriageWayWidth")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "junctionType":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("junctionType")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "trafficControlType":
        return renderFieldsWithDropDown(
          getDropdownList(filterDropdownValues("trafficControlType")),
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "complexion":
        return renderFieldsWithDropDown(
          complexionList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "bodyBuiltType":
        return renderFieldsWithDropDown(
          bodyTypeList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "hairColor":
        return renderFieldsWithDropDown(
          hairColorList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "gender":
        return renderFieldsWithDropDown(
          gendersList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "teeth":
        return renderFieldsWithDropDown(
          teethList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "mustache":
        return renderFieldsWithDropDown(
          mustachesList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "beard":
        return renderFieldsWithDropDown(
          beardList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "eyeColor":
        return renderFieldsWithDropDown(
          eyeColorList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "whetherDeadBodyApprears":
        return renderFieldsWithDropDown(
          whetherDeadBodyList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "whether":
        return renderFieldsWithDropDown(
          whetherList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "moles":
        return renderFieldsWithDropDown(
          molesList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "deformitiesType":
        return renderFieldsWithDropDown(
          getDeformitiesTypeList(),
          onDeformitiesTypeChange,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "deformities":
        return renderFieldsWithDropDown(
          getDeformitiesDropdownList(),
          null,
          handleSearch,
          serchText,
          220,
          isUndefined(deformitiesType) || disableEdit
        );
      case "tattooMarks":
        return renderFieldsWithDropDown(
          tattosMarkList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "clothsWorn":
        return renderFieldsWithDropDown(
          [],
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "languagesSpeak":
        return renderFieldsWithMultipleDropDown(
          languageList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      case "languagesWrite":
        return renderFieldsWithMultipleDropDown(
          languageList,
          null,
          handleSearch,
          serchText,
          220,
          disableEdit
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableEdit}
          />
        );
    }
  };

  const renderBodilyOffence = () => {
    return (
      <>
        {selectedMajorHead === "Murder (Homicide)" ||
        selectedMajorHead === "Unknown Deadbody" ||
        selectedMajorHead === "Culpable Homicide Not Amounting To Murder" ? (
          <>
            <Divider />
            <div style={{ paddingBottom: 20 }}>
              <Form.Item name="state" label="Dead Body?">
                <Radio.Group
                  buttonStyle="solid"
                  style={{ marginTop: 15 }}
                  onChange={(e) => {
                    setdeadBodyidentified(e.target.value);
                    checkFields();
                  }}
                >
                  <Radio.Button
                    style={styles.crimeClassificationRadioBtn}
                    value="Identified"
                    disabled={disableEdit}
                  >
                    Identified
                  </Radio.Button>
                  <Radio.Button
                    style={styles.crimeClassificationRadioBtn}
                    value="Unidentified"
                    disabled={disableEdit}
                  >
                    Unidentified
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            {deadBodyidentified === "Unidentified" ? (
              <>
                <div className="widgetPageStyle">
                  <Col span={20}>
                    <StandardCrimeClassificationForm
                      colWidth={10}
                      changeValue={checkFields}
                      disabled={disableEdit}
                      deformitiesList={getDeformitiesDropdownList()}
                      complexionList={complexionList}
                      eyeColorList={eyeColorList}
                      hairColorList={hairColorList}
                      bodyTypeList={bodyTypeList}
                      beardList={beardList}
                      teethList={teethList}
                      mustachesList={mustachesList}
                      molesList={molesList}
                      tattosMarkList={tattosMarkList}
                      whetherDeadBodyList={whetherDeadBodyList}
                      getDeformitiesTypeList={getDeformitiesTypeList()}
                      onDeformitiesTypeChange={onDeformitiesTypeChange}
                    />
                  </Col>
                </div>
                <Divider />
                <Row gutter={24}>
                  <Col span={12} style={{ marginBottom: 10 }}>
                    <Form.Item
                      name="walletOrIdFound"
                      label="Any Wallet Or Id Proof Found?"
                    >
                      <Radio.Group
                        disabled={disableEdit}
                        onChange={(e) =>
                          setstateWhetherWalletOrId(e.target.value)
                        }
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={12} style={{ marginBottom: 10 }}>
                    <Form.Item
                      name="walletOrIdFoundText"
                      label="Wallet Or Id Proof Details"
                    >
                      <Input
                        onChange={checkFields}
                        style={{ width: 300 }}
                        maxLength={textFieldRules.maxLength}
                        disabled={!stateWhetherWalletOrId}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12} style={{ marginBottom: 10 }}>
                    <Form.Item
                      name="whetherPhotographsTaken"
                      label="Whether Photographs Taken?"
                    >
                      <Radio.Group
                        disabled={disableEdit}
                        onChange={(e) =>
                          setstatePhotoGraphsTaken(e.target.value)
                        }
                      >
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={12} style={{ marginBottom: 10 }}>
                    <Form.Item>
                      {statePhotoGraphsTaken ? (
                        <>
                          <Upload
                            onChange={async (info) => {
                              await setphotographsTaken(info.fileList);
                            }}
                            customRequest={(options) =>
                              handleUpload(
                                options,
                                photographsTaken,
                                setphotographsTaken,
                                setuploadedphotographsTaken
                              )
                            }
                            multiple={false}
                            maxCount={1}
                          >
                            <Button
                              className="saveButton"
                              style={{ width: "100%" }}
                            >
                              <div style={{ display: "flex" }}>
                                <div>
                                  <CameraFilled />
                                </div>
                                <div style={{ marginLeft: "12px" }}>
                                  Upload Photographs
                                </div>
                              </div>
                            </Button>
                          </Upload>
                        </>
                      ) : null}{" "}
                    </Form.Item>
                  </Col>

                  <Col span={12} style={{ marginBottom: 10 }}>
                    <Form.Item
                      name="whetherFingerPrintsTaken"
                      label="Whether Finger Prints Taken And Sent To FPB?"
                    >
                      <Radio.Group disabled={disableEdit}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
              </>
            ) : null}
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  const renderRoadAccidents = () => {
    return (
      <>
        <Col span={24} style={{ padding: 10 }}>
          <Col>
            <Divider>
              <span style={{ fontWeight: "bold" }}>Road Accident Details</span>
            </Divider>
            {displayState(roadAccidentDetailsForm, displayFields)}
            <Divider>
              <span style={{ fontWeight: "bold" }}>Road Details</span>
            </Divider>
            {displayState(roadDetails, displayFields)}
            <Divider>
              <span style={{ fontWeight: "bold" }}>Vehicle Details</span>
            </Divider>
            <center>
              <p style={{ marginBottom: "10px", fontWeight: "bold" }}>
                (Search using one or multiple parameters)
              </p>
            </center>
            {isFetching && <Loader />}
            <Form
              name="vehicleDetailsForm"
              onFinish={handleFetch}
              layout="vertical"
            >
              {displayState(vehicleDetails, displayFields)}
              <Row gutter={24} justify="end" style={{ marginRight: "55px" }}>
                <Col span={4}>
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      type="primary"
                      className="saveButton"
                      size="large"
                      disabled={!crimeSceneDate || disableEdit || isFetching}
                      style={{ width: "160px" }}
                    >
                      Fetch Details
                    </Button>
                  </Form.Item>
                </Col>
                {!isEmpty(vehicleInfo) && (
                  <Col span={4}>
                    <Button
                      type="primary"
                      className="stepsButtonActive"
                      size="large"
                      disabled={!crimeSceneDate || disableEdit || isFetching}
                      onClick={() => setShowVehicleDetails("view")}
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
            <Divider>
              <span style={{ fontWeight: "bold" }}>Driver Details</span>
            </Divider>
            <Row gutter={24}>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="known" label="Known?">
                    <Radio.Group
                      disabled={disableEdit}
                      onChange={(e) => setknownChecked(e.target.value)}
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>

              <Col style={{ marginLeft: 30 }}>
                <Form.Item name="licenseType" label="Licence type of driver">
                  {renderFieldsWithDropDown(
                    getDropdownList(filterDropdownValues("licenseType")),
                    null,
                    handleSearch,
                    serchText,
                    220,
                    false
                  )}
                </Form.Item>
              </Col>
              <Col style={{ marginLeft: 20 }}>
                <Form.Item
                  name="personDrivingVehicle"
                  label="Person driving the vehicle"
                >
                  {renderFieldsWithDropDown(
                    getDropdownList(
                      filterDropdownValues("personDrivingVehicle")
                    ),
                    null,
                    handleSearch,
                    serchText,
                    220,
                    false
                  )}
                </Form.Item>
              </Col>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  {knownChecked ? (
                    <Form.Item
                      name="addDriverDetails"
                      label="Add Driver Details"
                      disabled={true}
                      onClick={() => setIsModalVisible(true)}
                    >
                      <div style={{ color: "blue" }}>Add Person</div>
                    </Form.Item>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="isDriverLeftHanded" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Is the driver left handed
                    </span>
                  </div>
                </div>
              </Col>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item
                    name="licenseCancelledOrSuspended"
                    valuePropName="checked"
                  >
                    <Checkbox />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Was the licence of the driver previously cancelled or
                      suspended
                    </span>
                  </div>
                </div>
              </Col>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="hasAnyDeformities" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Has the driver have any deformities
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <Divider>
              <span style={{ fontWeight: "bold" }}>Other Information's</span>
            </Divider>
            <Row gutter={24}>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="mviInspection" valuePropName="checked">
                    <Checkbox
                      onChange={(e) => setIsmviInspection(e.target.checked)}
                    />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Was the vehicle sent for MVI inspection
                    </span>
                  </div>
                </div>
              </Col>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="tripSheetsIfAny" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Any trip sheets of vehicle seized
                    </span>
                  </div>
                </div>
              </Col>
              <Col style={{ marginTop: 20, marginLeft: 10 }}>
                <div style={styles.widgetPageStyle}>
                  <Form.Item name="documentsIfAny" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <div style={{ paddingTop: 5 }}>
                    <span
                      style={{
                        paddingLeft: 10,
                        verticalAlign: "text-bottom",
                        fontSize: 16,
                      }}
                    >
                      Any other documents related to the vehicle seized
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              {!isMviInspection ? (
                <Col style={{ marginLeft: 10 }}>
                  <Form.Item
                    name="noMviReason"
                    label="Reason for No MVI inspection"
                  >
                    <Input
                      onChange={checkFields}
                      style={{ width: 300 }}
                      maxLength={textFieldRules.maxLength}
                    />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Col>
        </Col>
      </>
    );
  };

  const renderOther = () => {
    return (
      <>
        {selectedMajorHead === "Missing Person" ||
        selectedMajorHead === "Unknown Deadbody" ? (
          <>
            <Col span={24} style={{ padding: 10 }}>
              <Col>
                <Divider>Other Classification</Divider>
                {displayState(otherClassification, displayFields)}
                {selectedMajorHead === "Missing Person" ? (
                  <>{displayState(otherClassification2, displayFields)}</>
                ) : (
                  ""
                )}
                <Col span={8} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name="walletOrIdFound"
                    label="Any Wallet Or Id Proof Found?"
                  >
                    <Radio.Group
                      disabled={disableEdit}
                      onChange={(e) =>
                        setstateWhetherWalletOrId(e.target.value)
                      }
                    >
                      <Radio value={true}>Yes</Radio>
                      <Radio value={false}>No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>

                <Col span={8} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name="walletOrIdFoundText"
                    label="Wallet Or Id Proof Details"
                  >
                    <Input
                      onChange={checkFields}
                      style={{ width: 300 }}
                      maxLength={textFieldRules.maxLength}
                      disabled={!stateWhetherWalletOrId}
                    />
                  </Form.Item>
                </Col>
              </Col>
            </Col>
          </>
        ) : (
          ""
        )}
      </>
    );
  };

  return (
    <Form form={form} layout="vertical">
      <div style={styles.widgetPageStyle}>
        <Row gutter={24}>
          <Col span={8} style={{ marginBottom: 10 }}>
            <Form.Item name="classification" label="Crime Classification">
              {renderFieldsWithDropDown(
                crimeClassificationList,
                onCrimeClassificationChange,
                handleSearch,
                serchText,
                300,
                disableEdit
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="majorHead" label="Major Head">
              {renderFieldsWithDropDown(
                majorHeadList,
                onMajorHeadChange,
                handleSearch,
                serchText,
                300,
                disableEdit
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="minorHead" label="Minor Head">
              {renderFieldsWithDropDown(
                filteredMinorHeadList,
                null,
                handleSearch,
                serchText,
                300,
                isUndefined(selectedMajorHead) ||
                  selectedMajorHead === "" ||
                  disableEdit
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
      {classificationType === "Bodily Offence" && renderBodilyOffence()}
      {classificationType === "Road Accidents" && renderRoadAccidents()}
      {classificationType === "Other" && renderOther()}
      <Divider />
      <Form.Item style={{ marginTop: 15 }}>
        <Button
          type="primary"
          className="saveButton"
          size="large"
          icon={<SaveOutlined className="saveButtonIcon" />}
          disabled={!crimeSceneDate || disableEdit}
          onClick={submit}
        >
          SAVE
        </Button>
        <span className="linkStyle resetLink" onClick={reset}>
          Reset
        </span>
      </Form.Item>
      {isModalVisible ? (
        <AddPerson
          title="Add Person Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={false}
          setInputList={setInputList}
          editObj={null}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </Form>
  );
}
