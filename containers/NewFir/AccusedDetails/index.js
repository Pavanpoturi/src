import {
  Col,
  Divider,
  Form,
  Checkbox,
  Button,
  Input,
  Row,
  Modal,
  Upload,
  Card,
} from "antd";
import {
  built,
  eyes,
  hair,
  face,
  color,
  teeth,
  nose,
  beard,
  mustaches,
} from "./const";
import HotTags from "../HotTags";
import { CameraFilled, SaveOutlined } from "@ant-design/icons";
import {
  renderFieldsWithDropDown,
  DATE_FORMAT_MM,
  getPersonDetails,
  getMediaUploadError,
  getMediaPayload,
  getSavedDataResult,
} from "@containers/FirDetails/fir-util";
import { useDispatch, useSelector } from "react-redux";
import UploadForm from "@components/Common/uploadForm";
import { isUndefined, first, isEmpty, isNull, isArray } from "lodash";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import { useState, useEffect } from "react";
import moment from "moment";
import { textFieldRules } from "@components/Common/formOptions";
import { config } from "@config/site.config";
import axios from "axios";
import { notification } from "antd";
import SavedRecords from "../SavedRecords";
import createFIRActions from "@redux/createFir/actions";
import { accusedTypes } from "../const";
import { spinAlert } from "@containers/media-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};

export default function AccusedDetails({
  crimeId,
  isInvestigation,
  disable,
  firType,
  isConsumed,
}) {
  const [accusedForm] = Form.useForm();
  const [isFormUploading, setIsFormUploading] = useState(false);
  const dispatch = useDispatch();
  const [formValid, SetFormValid] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [age, setAge] = useState("");
  const [resetFiles, setResetFiles] = useState(false);
  const [selectedAccused, setSelectedAccused] = useState("");
  const [isAccusedVisible, setIsAccusedVisible] = useState(false);
  const [checkedBuilt, setCheckedBuilt] = useState({});
  const [checkedEyes, setCheckedEyes] = useState({});
  const [checkedHair, setCheckedHair] = useState({});
  const [checkedFace, setCheckedFace] = useState({});
  const [checkedColor, setCheckedColor] = useState({});
  const [checkedTeeth, setCheckedTeeth] = useState({});
  const [checkedNose, setCheckedNose] = useState({});
  const [checkedBeard, setCheckedBeard] = useState({});
  const [checkedMustache, setCheckedMustache] = useState({});
  const [earValue, setEarValue] = useState("");
  const [leucodemaValue, setLeucodemaValue] = useState("");
  const [moleValue, setMoleValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [identificationUpload, setUploadIdentification] = useState([]);
  const [deformatiesUpload, setUploadDeformaties] = useState([]);
  const [languageUpload, setUploadLanguage] = useState([]);
  const [burnMarkUpload, setUploadBurnMark] = useState([]);
  const [tattoUpload, setUploadTatto] = useState([]);
  const [scarUpload, setUploadScar] = useState([]);
  const [savedIdentificationUpload, setSavedUploadIdentification] = useState(
    []
  );
  const [savedDeformatiesUpload, setSavedUploadDeformaties] = useState([]);
  const [savedLanguageUpload, setSavedUploadLanguage] = useState([]);
  const [savedBurnMarkUpload, setSavedUploadBurnMark] = useState([]);
  const [savedTattoUpload, setSavedUploadTatto] = useState([]);
  const [savedScarUpload, setSavedUploadScar] = useState([]);

  const [physicalFeatureData, setPhysicalFeatureData] = useState({});
  const [existingPhysicalFeatureData, setExistingPhysicalFeatureData] =
    useState({});
  const [inputFileList, setInputFileList] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("AccusedDetails");
  const [accusedDetailsInputList, setAccusedDetailsInputList] = useState([]);
  const [viewAccusedDetails, setViewAccusedDetails] = useState(false);
  const [editAccusedDetailsObj, setEditAccusedDetailsObj] = useState(null);
  const [selectedAccusedIndex, setSelectedAccusedIndex] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const { actionType, successMessage, errorMessage } = useSelector(
    (state) => state.SuspectAccused
  );
  const { deletePersonDetails, resetActionType } = suspectAccusedAction;

  const { savedFir, updateActionType } = useSelector(
    (state) => state.createFIR
  );
  const { addAccusedDetails, getFIRData } = createFIRActions;

  const checkFields = async () => {
    const values = await accusedForm.validateFields();
    if (isInvestigation && values && !values.userDate) {
      SetFormValid(false);
    } else {
      SetFormValid(
        !Object.values(values).every(
          (v) => v == null || (typeof v === "string" && v.trim() === "")
        )
      );
    }
  };

  const reset = () => {
    accusedForm.resetFields();
    setAge("");
    setResetFiles(true);
    setViewAccusedDetails(false);
    setSelectedAccused("");
    setSelectedAccusedIndex("");
    setEditAccusedDetailsObj(null);
  };

  const isSuccess = actionType === "DELETE_PERSON_SUCCESS";

  const isError = actionType === "DELETE_PERSON_ERROR";

  useEffect(() => {
    console.log(successMessage, errorMessage, isSuccess, isError);
    if (isSuccess || isError) {
      if (successMessage === "Deleted Person successfully") {
        dispatch(resetActionType());
        reset();
        dispatch(getFIRData(`${config.getFIR}?crimeId=${crimeId}`));
      } else if (errorMessage) {
        openNotificationWithIcon("error", errorMessage);
        dispatch(resetActionType());
      }
    }
  }, [actionType]);

  useEffect(() => {
    if (updateActionType === "ADD_ACCUSED_DETAILS_SUCCESS") {
      reset();
    }
  }, [updateActionType]);

  const deletePersonDetailsFromFir = (personID) => {
    let deletePayload = {
      crimeId: crimeId,
      personId: personID,
      deletePersonRef: false,
    };
    dispatch(deletePersonDetails(config.deletePersonDetails, deletePayload));
  };

  useEffect(() => {
    if (
      !isEmpty(savedFir) &&
      !isNull(savedFir) &&
      !isEmpty(savedFir?.accusedDetails)
    ) {
      const filterAccusedDetails =
        !isEmpty(savedFir?.accusedDetails) &&
        savedFir?.accusedDetails.filter(
          (s) => s.isSuspectOrAccused === "No Accused"
        );
      if (filterAccusedDetails?.length > 0) {
        const noAccused = first(filterAccusedDetails);
        setSelectedAccused(noAccused?.isSuspectOrAccused);
        accusedForm.setFieldsValue({
          accused_type: noAccused?.isSuspectOrAccused,
        });
        setEditAccusedDetailsObj(noAccused);
        setSelectedAccusedIndex(0);
      }
    }
  }, [savedFir]);

  const handleEditAccusedDetails = (value, index) => {
    setInputFileList(value?.person?.media);
    setEditAccusedDetailsObj(value);
    setSelectedAccusedIndex(index);
    if (value) {
      const { isSuspectOrAccused, physicalFeatures } = value;
      const {
        beard,
        build,
        burnMarksUpload,
        color,
        deformitiesOrPeculiaritiesUpload,
        ear,
        eyes,
        face,
        hair,
        identificationMarksUpload,
        languageOrDialectUpload,
        leucodema,
        mole,
        mustache,
        nose,
        scarUpload,
        tattooUpload,
        teeth,
      } = !isUndefined(value?.physicalFeatures) && value?.physicalFeatures;
      setPhysicalFeatureData(physicalFeatures);
      setExistingPhysicalFeatureData(physicalFeatures);
      setCheckedBuilt(build);
      setCheckedEyes(eyes);
      setCheckedHair(hair);
      setCheckedFace(face);
      setCheckedColor(color);
      setCheckedTeeth(teeth);
      setCheckedNose(nose);
      setCheckedBeard(beard);
      setCheckedMustache(mustache);
      setEarValue(ear);
      setLeucodemaValue(leucodema);
      setMoleValue(mole);
      setUploadIdentification(identificationMarksUpload);
      setUploadDeformaties(deformitiesOrPeculiaritiesUpload);
      setUploadLanguage(languageOrDialectUpload);
      setUploadBurnMark(burnMarksUpload);
      setUploadTatto(tattooUpload);
      setUploadScar(scarUpload);
      setSavedUploadIdentification(identificationMarksUpload);
      setSavedUploadDeformaties(deformitiesOrPeculiaritiesUpload);
      setSavedUploadLanguage(languageOrDialectUpload);
      setSavedUploadBurnMark(burnMarksUpload);
      setSavedUploadTatto(tattooUpload);
      setSavedUploadScar(scarUpload);
      const {
        personalDetails,
        presentAddress,
        contactDetails,
        sameAsPresent,
        permanentAddress,
      } = !isUndefined(value?.person) && value?.person;
      const {
        name,
        surname,
        alias,
        gender,
        dateOfBirth,
        age,
        occupation,
        educationQualification,
        caste,
        subCaste,
        religion,
        nationality,
        fatherHusbandGuardianName,
        relationType,
      } = !isUndefined(personalDetails) && personalDetails;
      const {
        houseNo,
        streetRoadNo,
        wardColony,
        landmarkMilestone,
        localityVillage,
        areaMandal,
        district,
        stateUt,
        residencyType,
        pinCode,
      } = !isUndefined(presentAddress) && presentAddress;
      setSelectedState(stateUt);
      setSelectedPermanentState(permanentAddress?.stateUt);
      setPermanentAddress(sameAsPresent);
      setSelectedAccused(isSuspectOrAccused);
      accusedForm.setFieldsValue({
        accused_type: isSuspectOrAccused,
        ear: ear,
        leucodema: leucodema,
        mustache: mustache,
        mole: mole,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        gender: gender,
        dateOfBirth:
          !isEmpty(dateOfBirth) && moment(dateOfBirth).isValid()
            ? moment(dateOfBirth)
            : "",
        occupation: occupation,
        age: age,
        educationQualification: educationQualification,
        caste: caste,
        subCaste: subCaste,
        religion: religion,
        nationality: nationality,
        houseNo: houseNo,
        streetRoadNo: streetRoadNo,
        wardColony: wardColony,
        landmarkMilestone: landmarkMilestone,
        localityVillage: localityVillage,
        areaMandal: areaMandal,
        district: district,
        stateUt: stateUt,
        residencyType: residencyType,
        pinCode: pinCode,
        sameAsPresent: sameAsPresent,
        p_houseNo: permanentAddress?.houseNo,
        p_streetRoadNo: permanentAddress?.streetRoadNo,
        p_wardColony: permanentAddress?.wardColony,
        p_landmarkMilestone: permanentAddress?.landmarkMilestone,
        p_localityVillage: permanentAddress?.localityVillage,
        p_areaMandal: permanentAddress?.areaMandal,
        p_district: permanentAddress?.district,
        p_stateUt: permanentAddress?.stateUt,
        p_residencyType: permanentAddress?.residencyType,
        p_pinCode: permanentAddress?.pinCode,
        phoneNumber: contactDetails[0]?.phoneNumber,
        emailId: contactDetails[0]?.emailId,
      });
    }
  };

  const openaccusedModal = () => {
    setIsAccusedVisible(true);
  };

  const getFeatureText = (e, name) => {
    if (name === "ear") {
      setEarValue(e.target.value);
    } else if (name === "leucodema") {
      setLeucodemaValue(e.target.value);
    } else if (name === "mole") {
      setMoleValue(e.target.value);
    }
  };

  const getPhysicalFeatureTags = (tagName, tagKey) => {
    const existingFeature =
      !isUndefined(existingPhysicalFeatureData) &&
      existingPhysicalFeatureData[tagKey];
    return isUndefined(tagName) ? existingFeature : tagName;
  };

  const physicalFeaturesPayload = {
    build: getPhysicalFeatureTags(checkedBuilt?.tag, "build"),
    eyes: getPhysicalFeatureTags(checkedEyes?.tag, "eyes"),
    hair: getPhysicalFeatureTags(checkedHair?.tag, "hair"),
    face: getPhysicalFeatureTags(checkedFace?.tag, "face"),
    color: getPhysicalFeatureTags(checkedColor?.tag, "color"),
    teeth: getPhysicalFeatureTags(checkedTeeth?.tag, "teeth"),
    nose: getPhysicalFeatureTags(checkedNose?.tag, "nose"),
    beard: getPhysicalFeatureTags(checkedBeard?.tag, "beard"),
    mustache: getPhysicalFeatureTags(checkedMustache?.tag, "mustache"),
    ear: earValue ? earValue : "",
    leucodema: leucodemaValue ? leucodemaValue : "",
    mole: moleValue ? moleValue : "",
    identificationMarksUpload: getPhysicalFeatureTags(
      identificationUpload,
      "identificationMarksUpload"
    ),
    deformitiesOrPeculiaritiesUpload: getPhysicalFeatureTags(
      deformatiesUpload,
      "deformitiesOrPeculiaritiesUpload"
    ),
    languageOrDialectUpload: getPhysicalFeatureTags(
      languageUpload,
      "languageOrDialectUpload"
    ),
    burnMarksUpload: getPhysicalFeatureTags(burnMarkUpload, "burnMarksUpload"),
    scarUpload: getPhysicalFeatureTags(scarUpload, "scarUpload"),
    tattooUpload: getPhysicalFeatureTags(tattoUpload, "tattooUpload"),
  };

  const accusedHandleOk = () => {
    setPhysicalFeatureData(physicalFeaturesPayload);
    setIsAccusedVisible(false);
  };

  const accusedHandleCancel = () => {
    setIsAccusedVisible(false);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const getCommonPayload = (accusedDetails) => {
    let noAccussedPayload = accusedDetails.filter(
      (s) => s.isSuspectOrAccused === "No Accused"
    );
    if (noAccussedPayload && noAccussedPayload.length > 0) {
      accusedDetails = noAccussedPayload;
    }
    const firDetail = savedFir?.firDetail;
    const payload = {
      crimeId: savedFir?._id,
      preCrimeId: savedFir?.preCrime?._id,
      crimeSceneId: savedFir?.crimeScene,
      planOfActionId: savedFir?.planOfAction,
      crimeLocationId: savedFir?.crimeLocationId,
      firType: firType,
      isDraft: !isUndefined(isConsumed) ? true : savedFir?.isDraft,
      firDetail: {
        crimeType: firDetail?.crimeType,
        crimeSubType: firDetail?.crimeSubType,
        petitionNo: firDetail?.petitionNo,
        gravity: firDetail?.gravity,
        actsAndSections: firDetail?.actsAndSections,
        majorMinorClassification: firDetail?.majorMinorClassification,
        occurenceOfOffence: firDetail?.occurenceOfOffence,
        placeOfOccurence: firDetail?.placeOfOccurence,
        briefFacts: firDetail?.briefFacts,
        uploadDocuments: firDetail?.uploadDocuments,
        crimeShownBy: !isEmpty(savedFir?.complainantDetails)
          ? first(savedFir?.complainantDetails).person?.personalDetails?.name
          : "",
        firNum: firDetail?.firNum,
        district: firDetail?.district,
        districtCode: firDetail?.districtCode,
        firStatus: firDetail?.firStatus,
        psCode: firDetail?.psCode,
        psName: firDetail?.psName,
        dateOfReport: firDetail?.dateOfReport,
        firRegnum: firDetail?.firRegnum,
        lastmodifieddate: moment().format(DATE_FORMAT_MM),
        isRelatedToLicense: firDetail?.isRelatedToLicense,
        isSentToCourt: firDetail?.isSentToCourt,
        sentToCourtAt: firDetail?.sentToCourtAt,
        licenseNo: firDetail?.licenseNo,
        isPropertyStolen: firDetail?.isPropertyStolen,
      },
      preCrime: {
        patrolCarsBlueColts: false,
        toolkit: false,
      },
      accusedDetails: accusedDetails,
      victimDetails: savedFir?.victimDetails,
      complainantDetails: savedFir?.complainantDetails,
      stolenProperties: savedFir?.stolenProperties,
    };
    return payload;
  };

  const submit = async () => {
    const values = await accusedForm.validateFields();
    var fileData = [];
    var fileSeavedData = [];
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      if (!file._id === false && !file.id === false) {
        mediaFormData.append("file", file.originFileObj);
        fileSeavedData.push(file);
      } else {
        fileData.push(file);
      }
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append("folderPath", `${crimeId}/accusedDetails/media`);
    if (!isEmpty(inputFileList) && !isEmpty(fileSeavedData)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;

            const existingMedia =
              !isUndefined(editAccusedDetailsObj?.person) &&
              !isEmpty(editAccusedDetailsObj?.person?.media)
                ? editAccusedDetailsObj?.person?.media
                : [];

            const accusedPayload = {
              isSuspectOrAccused: values.accused_type,
              physicalFeatures: physicalFeatureData,
              person: getPersonDetails(
                values,
                accusedDetailsInputList,
                getMediaPayload([...data, ...existingMedia], selectedCategory)
              ),
            };
            const existingAccused = savedFir?.accusedDetails;
            if (selectedAccusedIndex !== "") {
              const updatedObj = !isEmpty(existingAccused) && {
                ...existingAccused[selectedAccusedIndex],
                ...accusedPayload,
              };
              const updatedRecords = !isEmpty(existingAccused) && [
                ...existingAccused.slice(0, selectedAccusedIndex),
                updatedObj,
                ...existingAccused.slice(selectedAccusedIndex + 1),
              ];
              const payload = getCommonPayload(updatedRecords);
              dispatch(addAccusedDetails(config.updateFIR, payload));
              setSelectedAccusedIndex("");
            } else {
              const existingAccusedDetails = [
                ...existingAccused,
                ...[accusedPayload],
              ];
              const payload = getCommonPayload(existingAccusedDetails);
              dispatch(addAccusedDetails(config.updateFIR, payload));
              setSelectedAccusedIndex("");
            }
            setIsFormUploading(false);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (!isEmpty(fileData)) {
      const data = fileData;
      const existingMedia =
        !isUndefined(editAccusedDetailsObj?.person) &&
        !isEmpty(editAccusedDetailsObj?.person?.media)
          ? editAccusedDetailsObj?.person?.media
          : [];

      const accusedPayload = {
        isSuspectOrAccused: values.accused_type,
        physicalFeatures: physicalFeatureData,
        person: getPersonDetails(
          values,
          accusedDetailsInputList,
          getMediaPayload([...data], selectedCategory)
        ),
      };
      const existingAccused = savedFir?.accusedDetails;
      if (selectedAccusedIndex !== "") {
        const updatedObj = !isEmpty(existingAccused) && {
          ...existingAccused[selectedAccusedIndex],
          ...accusedPayload,
        };
        const updatedRecords = !isEmpty(existingAccused) && [
          ...existingAccused.slice(0, selectedAccusedIndex),
          updatedObj,
          ...existingAccused.slice(selectedAccusedIndex + 1),
        ];
        const payload = getCommonPayload(updatedRecords);
        dispatch(addAccusedDetails(config.updateFIR, payload));
        setSelectedAccusedIndex("");
      } else {
        const existingAccusedDetails = [
          ...existingAccused,
          ...[accusedPayload],
        ];
        const payload = getCommonPayload(existingAccusedDetails);
        dispatch(addAccusedDetails(config.updateFIR, payload));
        setSelectedAccusedIndex("");
      }
      setIsFormUploading(false);
    } else if (isEmpty(inputFileList)) {
      setIsFormUploading(false);
      const existingMedia =
        !isUndefined(editAccusedDetailsObj?.person) &&
        !isEmpty(editAccusedDetailsObj?.person?.media)
          ? editAccusedDetailsObj?.person?.media
          : [];
      const accusedPayload = {
        isSuspectOrAccused: values.accused_type,
        physicalFeatures: physicalFeatureData,
        person: getPersonDetails(
          values,
          accusedDetailsInputList,
          existingMedia
        ),
      };
      const existingAccused = savedFir?.accusedDetails;
      if (selectedAccusedIndex !== "") {
        const updatedObj = !isEmpty(existingAccused) && {
          ...existingAccused[selectedAccusedIndex],
          ...accusedPayload,
        };
        const updatedRecords = !isEmpty(existingAccused) && [
          ...existingAccused.slice(0, selectedAccusedIndex),
          updatedObj,
          ...existingAccused.slice(selectedAccusedIndex + 1),
        ];
        const payload = getCommonPayload(updatedRecords);
        dispatch(addAccusedDetails(config.updateFIR, payload));
        setSelectedAccusedIndex("");
      } else {
        const existingAccusedDetails = [
          ...existingAccused,
          ...[accusedPayload],
        ];
        const payload = getCommonPayload(existingAccusedDetails);
        dispatch(addAccusedDetails(config.updateFIR, payload));
        setSelectedAccusedIndex("");
      }
    }
  };

  const displayAccusedUpload = (title, category, setAction, fileList) => {
    const fileData =
      !isNull(editAccusedDetailsObj) && !isUndefined(fileList)
        ? [fileList]
        : undefined;
    return (
      <Row gutter={24}>
        <Col span={6}>
          <strong>{title}</strong>
        </Col>
        <Col span={12}></Col>
        <Col span={6}>
          <Upload
            fileList={fileData}
            customRequest={(options) => {
              let formData = new FormData();
              formData.append("file", options.file);
              formData.append("prefixFolder", crimeId);
              formData.append(
                "folderPath",
                `${crimeId}/${category + `_ACCUSED`}/file`
              );
              setIsUploading(true);
              axios
                .post(`${config.fileUpload}/upload`, formData)
                .then((res) => {
                  if (res.status === 200) {
                    const { data } = res.data;
                    const payloadData = first(data);
                    const payload = {
                      category: category,
                      mimeType: payloadData.mimeType,
                      name: payloadData.name,
                      url: payloadData.url,
                      fileId: payloadData?.id,
                    };
                    setAction(payload);
                    setIsUploading(false);
                    setTimeout(() => {
                      options.onSuccess("ok");
                    }, 0);
                  }
                })
                .catch((err) => {
                  if (err && err?.response?.status === 400) {
                    const errorDetails = JSON.parse(
                      err.response?.data?.error.description
                    );
                    const errorKey = errorDetails?.error?.errorKey;
                    setIsUploading(false);
                    openNotificationWithIcon("error", errorKey);
                    setTimeout(() => {
                      options.onError("ok");
                    }, 0);
                  }
                });
            }}
            multiple={false}
          >
            <Button
              type="primary"
              className="submitButton"
              style={{ marginTop: 22, width: 180 }}
              disabled={disable || isUploading || viewAccusedDetails}
              icon={<CameraFilled style={{ float: "left" }} />}
            >
              Upload
            </Button>
          </Upload>
        </Col>
      </Row>
    );
  };

  const accusedModal = () => {
    return (
      <Modal
        title="Physical Features"
        visible={isAccusedVisible}
        onOk={accusedHandleOk}
        onCancel={accusedHandleCancel}
        width={1000}
        okText="Save & Close"
        footer={[
          <Button
            type="primary"
            className="saveButton"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={() => accusedHandleOk()}
            disabled={disable || isUploading || viewAccusedDetails}
          >
            Save
          </Button>,
        ]}
      >
        <Row>
          <HotTags
            tagsData={built}
            name="Built"
            checkedData={setCheckedBuilt}
            checked={checkedBuilt}
          />
          <HotTags
            tagsData={eyes}
            name="Eyes"
            checkedData={setCheckedEyes}
            checked={checkedEyes}
          />
          <HotTags
            tagsData={hair}
            name="Hair"
            checkedData={setCheckedHair}
            checked={checkedHair}
          />
          <HotTags
            tagsData={face}
            name="Face"
            checkedData={setCheckedFace}
            checked={checkedFace}
          />
          <HotTags
            tagsData={color}
            name="Color"
            checkedData={setCheckedColor}
            checked={checkedColor}
          />
          <HotTags
            tagsData={teeth}
            name="Teeth"
            checkedData={setCheckedTeeth}
            checked={checkedTeeth}
          />
          <HotTags
            tagsData={nose}
            name="Nose"
            checkedData={setCheckedNose}
            checked={checkedNose}
          />
          <HotTags
            tagsData={beard}
            name="Beard"
            checkedData={setCheckedBeard}
            checked={checkedBeard}
          />
          <HotTags
            tagsData={mustaches}
            name="Mustaches"
            checkedData={setCheckedMustache}
            checked={checkedMustache}
          />
        </Row>
        <Row>
          <Col span={6}>
            <strong>Ear</strong>
          </Col>
          <Col span={18}>
            <Form.Item name="ear">
              <Input
                onChange={(e) => getFeatureText(e, "ear")}
                style={{ width: 222 }}
                maxLength={textFieldRules.maxLength}
                disabled={disable || viewAccusedDetails}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <strong>Leucoderma</strong>
          </Col>
          <Col span={18}>
            <Form.Item name="leucodema">
              <Input
                onChange={(e) => getFeatureText(e, "leucodema")}
                style={{ width: 222 }}
                maxLength={textFieldRules.maxLength}
                disabled={disable || viewAccusedDetails}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <strong>Mole</strong>
          </Col>
          <Col span={18}>
            <Form.Item name="mole">
              <Input
                onChange={(e) => getFeatureText(e, "mole")}
                style={{ width: 222 }}
                maxLength={textFieldRules.maxLength}
                disabled={disable || viewAccusedDetails}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          {isUploading ? (
            <>
              <Col span={6} />
              <Col span={12} style={{ marginTop: 25 }}>
                {spinAlert(
                  "Uploading...",
                  "File upload is in progress. Please wait!!"
                )}
              </Col>
            </>
          ) : null}
        </Row>
        {displayAccusedUpload(
          "Identification Marks",
          "physicalFeatures",
          setUploadIdentification,
          identificationUpload,
          savedIdentificationUpload
        )}
        {displayAccusedUpload(
          "Deformaties/Peculiarities",
          "physicalFeatures",
          setUploadDeformaties,
          deformatiesUpload,
          savedDeformatiesUpload
        )}
        {displayAccusedUpload(
          "Language/Dialect",
          "physicalFeatures",
          setUploadLanguage,
          languageUpload,
          savedLanguageUpload
        )}
        {displayAccusedUpload(
          "Burn Mark",
          "physicalFeatures",
          setUploadBurnMark,
          burnMarkUpload,
          savedBurnMarkUpload
        )}
        {displayAccusedUpload(
          "Scar",
          "physicalFeatures",
          setUploadScar,
          scarUpload,
          savedScarUpload
        )}
        {displayAccusedUpload(
          "Tatto",
          "physicalFeatures",
          setUploadTatto,
          tattoUpload,
          savedTattoUpload
        )}
      </Modal>
    );
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onAccusedTypeChange = (value) => {
    setSelectedAccused(value);
    setUploadIdentification([]);
    setUploadDeformaties([]);
    setUploadLanguage([]);
    setUploadBurnMark([]);
    setUploadTatto([]);
    setUploadScar([]);
    setSavedUploadIdentification([]);
    setSavedUploadDeformaties([]);
    setSavedUploadLanguage([]);
    setSavedUploadBurnMark([]);
    setSavedUploadTatto([]);
    setSavedUploadScar([]);
    setCheckedBuilt({});
    setCheckedEyes({});
    setCheckedHair({});
    setCheckedFace({});
    setCheckedColor({});
    setCheckedTeeth({});
    setCheckedNose({});
    setCheckedBeard({});
    setCheckedMustache({});
    setEditAccusedDetailsObj(null);
    setEarValue("");
    setLeucodemaValue("");
    setMoleValue("");
    setPhysicalFeatureData({});
    setExistingPhysicalFeatureData({});
    accusedForm.setFieldsValue({
      ear: "",
      leucodema: "",
      mustache: "",
      mole: "",
    });
  };

  const filterAccusedDetails =
    !isEmpty(savedFir?.accusedDetails) &&
    savedFir?.accusedDetails.filter(
      (s) => s.isSuspectOrAccused !== "No Accused"
    );

  const getSavedData = () => {
    let savedData = [];
    !isEmpty(filterAccusedDetails) &&
      // eslint-disable-next-line array-callback-return
      filterAccusedDetails.map((data) => {
        const { personalDetails, presentAddress, media } =
          !isUndefined(data?.person) && !isNull(data?.person) && data?.person;

        savedData.push(
          getSavedDataResult(data, personalDetails, presentAddress, media)
        );
      });
    return savedData;
  };

  const renderPhysicalFeatureLink = () => (
    <Col span={6} style={{ marginLeft: 15, marginTop: 30 }}>
      <span
        type="primary"
        className="popupLink resetLink"
        onClick={openaccusedModal}
      >
        {viewAccusedDetails
          ? "View Physical Features"
          : "Enter Physical Features"}
      </span>
      {accusedModal()}
    </Col>
  );

  return (
    <Card style={{ padding: 10 }}>
      <Form form={accusedForm} layout="vertical">
        <Row span={24}>
          <Col span={18}>
            <Row span={24}>
              <Col span={4} style={{ marginBottom: 20 }}>
                <Form.Item
                  name="accused_type"
                  label="Accused Type"
                  rules={[
                    {
                      required: true,
                      message: "Please Select Accused Type!!",
                    },
                  ]}
                >
                  {renderFieldsWithDropDown(
                    accusedTypes,
                    onAccusedTypeChange,
                    handleSearch,
                    serchText,
                    null,
                    disable || viewAccusedDetails
                  )}
                </Form.Item>
              </Col>
              {selectedAccused !== "" &&
                selectedAccused !== "Known" &&
                selectedAccused !== "No Accused" &&
                selectedAccused !== "Respondent" &&
                renderPhysicalFeatureLink()}
            </Row>
            {selectedAccused !== "" &&
            selectedAccused !== "No Accused" &&
            selectedAccused !== "Unknown" ? (
              <Col span={24}>
                <StandardPersonalForm
                  showMoreOption={false}
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewAccusedDetails || disable}
                  age={age}
                  setAge={setAge}
                  formName={accusedForm}
                  validationFields={["Name", "Gender", "Nationality"]}
                />
                <Divider />
                <div className="heading">Present Address</div>
                <StandardAddressForm
                  showMoreOption={false}
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewAccusedDetails || disable}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  personType="Accused"
                />
                <Divider />
                <div style={styles.widgetPageStyle}>
                  <div>
                    <span className="heading" style={{ marginRight: 20 }}>
                      Permanent Address
                    </span>
                  </div>
                  <div style={{ marginRight: 10 }}>
                    <Form.Item
                      name="sameAsPresent"
                      valuePropName="checked"
                      onChange={checkFields}
                    >
                      <Checkbox
                        style={{ color: "#949494", fontWeight: 300 }}
                        disabled={viewAccusedDetails || disable}
                        onChange={(e) => setPermanentAddress(e.target.checked)}
                      />
                    </Form.Item>
                  </div>
                  <div style={{ marginTop: 2 }}>
                    <label className="heading">Use same as Present</label>
                  </div>
                </div>
                {!permanentAddress && (
                  <StandardPermanentAddressForm
                    showMoreOption={false}
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={viewAccusedDetails || disable}
                    selectedPermanentState={selectedPermanentState}
                    setSelectedPermanentState={setSelectedPermanentState}
                    personType="Accused"
                  />
                )}
                <Divider />
                <StandardContactForm
                  colWidth={6}
                  changeValue={checkFields}
                  disabled={viewAccusedDetails || disable}
                />
                <Divider />
                <StandardIdentityForm
                  colWidth={6}
                  changeValue={checkFields}
                  setidentityList={setAccusedDetailsInputList}
                  disabled={viewAccusedDetails || disable}
                  currentData={editAccusedDetailsObj}
                  form={accusedForm}
                  resetFiles={resetFiles}
                  setResetFiles={setResetFiles}
                />
              </Col>
            ) : null}
          </Col>
          <Col span={6}>
            <div style={{ marginLeft: 10, marginBottom: 20 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewAccusedDetails || disable}
                inputFileList={inputFileList}
              />
            </div>
            {!isEmpty(savedFir?.accusedDetails) &&
            editAccusedDetailsObj?.isSuspectOrAccused !== "No Accused" ? (
              <>
                {filterAccusedDetails &&
                isArray(filterAccusedDetails) &&
                filterAccusedDetails.length > 0 ? (
                  <Button
                    style={{ marginTop: "40px", width: "100%" }}
                    onClick={() => setIsRecordsModalVisible(true)}
                  >
                    {filterAccusedDetails.length > 0
                      ? filterAccusedDetails.length
                      : 0}{" "}
                    Accused Detail Records
                  </Button>
                ) : null}

                <Modal
                  title="Accused Detail Records"
                  visible={isRecordsModalVisible}
                  onOk={() => setIsRecordsModalVisible(false)}
                  onCancel={() => setIsRecordsModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={getSavedData()}
                      editDetails={handleEditAccusedDetails}
                      setViewDetails={setViewAccusedDetails}
                      selectedRecord={editAccusedDetailsObj}
                      isMedia={true}
                      recordVisible={setIsRecordsModalVisible}
                      isVictim={false}
                      typeLabel="Accused Type"
                      disable={disable}
                      deletePersonDetailsFromFir={deletePersonDetailsFromFir}
                    />
                  </div>
                </Modal>
              </>
            ) : null}
          </Col>
        </Row>
      </Form>
      <Divider />
      {!disable ? (
        <Row>
          <Col span={4}>
            <Button
              type="primary"
              className="submitButton"
              icon={<SaveOutlined className="saveButtonIcon" />}
              disabled={
                disable ||
                selectedAccused === "" ||
                viewAccusedDetails ||
                isFormUploading
              }
              onClick={submit}
            >
              SAVE
            </Button>
            <span
              className="linkStyle resetLink"
              onClick={reset}
              style={{ marginLeft: 15 }}
            >
              Reset
            </span>
          </Col>
          <Col>
            {isFormUploading &&
              spinAlert(
                "Saving Accused Details...",
                "Saving Accused Details. Please wait!!"
              )}
          </Col>
        </Row>
      ) : null}
    </Card>
  );
}
