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
  Spin,
  Alert,
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
} from "../AccusedDetails/const";
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
import { UploadFormWithRestriction } from "@components/Common/uploadForm";
import { isUndefined, first, isEmpty, isNull, isArray } from "lodash";
import StandardAddressForm from "@components/Common/standardAddressForm";
import suspectAccusedAction from "@redux/investigations/suspectAccused/actions";
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
import { victimTypes } from "../const";
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

export default function VictimDetails({
  crimeId,
  isInvestigation,
  disable,
  firType,
  isConsumed,
}) {
  const [victimForm] = Form.useForm();
  const dispatch = useDispatch();
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [formValid, SetFormValid] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [isRecordsModalVisible, setIsRecordsModalVisible] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [age, setAge] = useState("");
  const [resetFiles, setResetFiles] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState("");
  const [isVictimVisible, setIsVictimVisible] = useState(false);
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
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
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
  const [selectedCategory, setSelectedCategory] = useState("VictimDetails");
  const [victimDetailsInputList, setVictimDetailsInputList] = useState([]);
  const [viewVictimDetails, setViewVictimDetails] = useState(false);
  const [editVictimDetailsObj, setEditVictimDetailsObj] = useState(null);
  const [selectedVictimIndex, setSelectedVictimIndex] = useState("");
  const { actionType, successMessage, errorMessage } = useSelector(
    (state) => state.SuspectAccused
  );
  const { deletePersonDetails, resetActionType } = suspectAccusedAction;

  const { savedFir, updateActionType } = useSelector(
    (state) => state.createFIR
  );
  const { addVictimDetails, getFIRData } = createFIRActions;

  const checkFields = async () => {
    const values = await victimForm.validateFields();
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
    victimForm.resetFields();
    setAge("");
    setResetFiles(true);
    setViewVictimDetails(false);
    setSelectedVictim("");
    setSelectedVictimIndex("");
    setEditVictimDetailsObj(null);
    setInputFileList([]);
  };

  const isSuccess = actionType === "DELETE_PERSON_SUCCESS";

  const isError = actionType === "DELETE_PERSON_ERROR";

  useEffect(() => {
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

  const deletePersonDetailsFromFir = (personID) => {
    let deletePayload = {
      crimeId: crimeId,
      personId: personID,
      deletePersonRef: false,
    };
    dispatch(deletePersonDetails(config.deletePersonDetails, deletePayload));
  };

  useEffect(() => {
    if (updateActionType === "ADD_VICTIM_DETAILS_SUCCESS") {
      reset();
    }
  }, [updateActionType]);

  const handleEditVictimDetails = (value, index) => {
    setEditVictimDetailsObj(value);
    setInputFileList(value?.person?.media);
    setSelectedVictimIndex(index);
    if (value) {
      const { victimType, physicalFeatures } = value;
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
      const selectedVictimType = isArray(victimType)
        ? first(victimType)
        : victimType;
      setSelectedVictim(selectedVictimType);
      victimForm.setFieldsValue({
        victim_type: victimType,
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

  const openVictimModal = () => {
    setIsVictimVisible(true);
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

  const victimHandleOk = () => {
    setPhysicalFeatureData(physicalFeaturesPayload);
    setIsVictimVisible(false);
  };

  const victimHandleCancel = () => {
    setIsVictimVisible(false);
  };

  const openNotificationWithIcon = (type, message) => {
    return notification[type]({
      message: message,
    });
  };

  const getCommonPayload = (victimDetails) => {
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
      accusedDetails: savedFir?.accusedDetails,
      victimDetails: victimDetails,
      complainantDetails: savedFir?.complainantDetails,
      stolenProperties: savedFir?.stolenProperties,
    };
    return payload;
  };

  const submit = async () => {
    if (
      (selectedVictim === "Unknown Dead Body" && inputFileList.length === 0) ||
      (selectedVictim === "Missing" && inputFileList.length === 0)
    ) {
      openNotificationWithIcon(
        "error",
        `Upload  ${
          selectedVictim === "Missing"
            ? selectedVictim + " person"
            : selectedVictim
        } Photo`
      );
    } else {
      const values = await victimForm.validateFields();
      let unUploadedFiles = [];
      const mediaFormData = new FormData();
      var mediaData = [];
      inputFileList.forEach((file) => {
        if (isUndefined(file?._id)) {
          mediaFormData.append("file", file.originFileObj);
          unUploadedFiles.push(file);
        } else {
          mediaData.push(file);
        }
      });
      mediaFormData.append("prefixFolder", crimeId);
      mediaFormData.append("folderPath", `${crimeId}/victimDetails/media`);
      if (!isEmpty(unUploadedFiles)) {
        setIsFormUploading(true);
        axios
          .post(`${config.fileUpload}/upload`, mediaFormData)
          .then((res) => {
            if (res.status === 200) {
              const { data } = res.data;
              const victimPayload = {
                victimType: values.victim_type,
                physicalFeatures:
                  values.victim_type === "Victim" ||
                  values.victim_type === "Deceased"
                    ? {}
                    : physicalFeatureData,
                person: getPersonDetails(
                  values,
                  victimDetailsInputList,
                  getMediaPayload([...mediaData, ...data], selectedCategory)
                ),
              };
              const existingVictim = savedFir?.victimDetails;
              if (selectedVictimIndex !== "") {
                const updatedObj = !isEmpty(existingVictim) && {
                  ...existingVictim[selectedVictimIndex],
                  ...victimPayload,
                };
                const updatedRecords = !isEmpty(existingVictim) && [
                  ...existingVictim.slice(0, selectedVictimIndex),
                  updatedObj,
                  ...existingVictim.slice(selectedVictimIndex + 1),
                ];
                const payload = getCommonPayload(updatedRecords);
                dispatch(addVictimDetails(config.updateFIR, payload));
                setSelectedVictimIndex("");
              } else {
                const existingVictimDetails = [
                  ...existingVictim,
                  ...[victimPayload],
                ];
                const payload = getCommonPayload(existingVictimDetails);
                dispatch(addVictimDetails(config.updateFIR, payload));
                setSelectedVictimIndex("");
              }
              setIsFormUploading(false);
            }
          })
          .catch((err) => {
            getMediaUploadError(err, openNotificationWithIcon);
            setIsFormUploading(false);
          });
      } else {
        const existingMedia =
          !isUndefined(editVictimDetailsObj?.person) &&
          !isEmpty(editVictimDetailsObj?.person?.media)
            ? editVictimDetailsObj?.person?.media
            : [];
        const victimPayload = {
          victimType: values.victim_type,
          physicalFeatures:
            values.victim_type === "Victim" || values.victim_type === "Deceased"
              ? {}
              : physicalFeatureData,
          person: getPersonDetails(
            values,
            victimDetailsInputList,
            existingMedia
          ),
        };
        const existingVictim = savedFir?.victimDetails;
        if (selectedVictimIndex !== "") {
          const updatedObj = !isEmpty(existingVictim) && {
            ...existingVictim[selectedVictimIndex],
            ...victimPayload,
          };
          const updatedRecords = !isEmpty(existingVictim) && [
            ...existingVictim.slice(0, selectedVictimIndex),
            updatedObj,
            ...existingVictim.slice(selectedVictimIndex + 1),
          ];
          const payload = getCommonPayload(updatedRecords);
          dispatch(addVictimDetails(config.updateFIR, payload));
          setSelectedVictimIndex("");
        } else {
          const existingVictimDetails = [...existingVictim, ...[victimPayload]];
          const payload = getCommonPayload(existingVictimDetails);
          dispatch(addVictimDetails(config.updateFIR, payload));
          setSelectedVictimIndex("");
        }
      }
    }
  };

  const displayVictimUpload = (title, category, setAction, fileList) => {
    const fileData =
      !isNull(editVictimDetailsObj) && !isUndefined(fileList)
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
                `${crimeId}/${category + `_VICTIM`}/file`
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
              disabled={disable || isUploading || viewVictimDetails}
              icon={<CameraFilled style={{ float: "left" }} />}
            >
              Upload
            </Button>
          </Upload>
        </Col>
      </Row>
    );
  };

  const victimModal = () => {
    return (
      <Modal
        title="Physical Features"
        visible={isVictimVisible}
        onOk={victimHandleOk}
        onCancel={victimHandleCancel}
        width={1000}
        okText="Save & Close"
        footer={[
          <Button
            type="primary"
            className="saveButton"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={() => victimHandleOk()}
            disabled={disable || isUploading || viewVictimDetails}
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
                disabled={disable || viewVictimDetails}
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
                disabled={disable || viewVictimDetails}
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
                disabled={disable || viewVictimDetails}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }}>
          {isUploading ? (
            <>
              <Col span={6} />
              <Col span={12} style={{ marginTop: 25 }}>
                <Spin tip="Uploading...">
                  <Alert
                    message="File upload is in progress. Please wait!!"
                    type="info"
                  />
                </Spin>
              </Col>
            </>
          ) : null}
        </Row>
        {displayVictimUpload(
          "Identification Marks",
          "physicalFeatures",
          setUploadIdentification,
          identificationUpload,
          savedIdentificationUpload
        )}
        {displayVictimUpload(
          "Deformaties/Peculiarities",
          "physicalFeatures",
          setUploadDeformaties,
          deformatiesUpload,
          savedDeformatiesUpload
        )}
        {displayVictimUpload(
          "Language/Dialect",
          "physicalFeatures",
          setUploadLanguage,
          languageUpload,
          savedLanguageUpload
        )}
        {displayVictimUpload(
          "Burn Mark",
          "physicalFeatures",
          setUploadBurnMark,
          burnMarkUpload,
          savedBurnMarkUpload
        )}
        {displayVictimUpload(
          "Scar",
          "physicalFeatures",
          setUploadScar,
          scarUpload,
          savedScarUpload
        )}
        {displayVictimUpload(
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

  const onVictimTypeChange = (value) => {
    setSelectedVictim(value);
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
    // setSelectedVictimIndex("");
    setEditVictimDetailsObj(null);
    setEarValue("");
    setLeucodemaValue("");
    setMoleValue("");
    setPhysicalFeatureData({});
    setExistingPhysicalFeatureData({});
    victimForm.setFieldsValue({
      ear: "",
      leucodema: "",
      mustache: "",
      mole: "",
    });
  };

  const getSavedData = () => {
    let savedData = [];
    isArray(savedFir?.victimDetails);
    !isEmpty(savedFir?.victimDetails) &&
      // eslint-disable-next-line array-callback-return
      savedFir?.victimDetails.map((data) => {
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
        onClick={openVictimModal}
      >
        {viewVictimDetails
          ? "View Physical Features"
          : "Enter Physical Features"}
      </span>
      {victimModal()}
    </Col>
  );

  const complainantDetails =
    !isEmpty(savedFir?.complainantDetails) &&
    first(savedFir?.complainantDetails);

  return (
    <Card style={{ padding: 10 }}>
      <Form form={victimForm} layout="vertical">
        <Row span={24}>
          <Col span={18}>
            <Row span={24}>
              <Col span={6} style={{ marginBottom: 20 }}>
                <Form.Item name="victim_type" label="Victim Type">
                  {renderFieldsWithDropDown(
                    victimTypes,
                    onVictimTypeChange,
                    handleSearch,
                    serchText,
                    222,
                    disable ||
                      viewVictimDetails ||
                      !isNull(editVictimDetailsObj) ||
                      !isEmpty(editVictimDetailsObj)
                  )}
                </Form.Item>
              </Col>
              {selectedVictim !== "" &&
                selectedVictim !== "Victim" &&
                selectedVictim !== "Deceased" &&
                renderPhysicalFeatureLink()}
            </Row>
            {selectedVictim !== "" && selectedVictim !== "Unknown Dead Body" ? (
              <Col span={24}>
                <StandardPersonalForm
                  showMoreOption={false}
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewVictimDetails || disable}
                  age={age}
                  setAge={setAge}
                  formName={victimForm}
                />
                <Divider />
                <div className="heading">Present Address</div>
                <StandardAddressForm
                  showMoreOption={false}
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={viewVictimDetails || disable}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
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
                        disabled={viewVictimDetails || disable}
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
                    disabled={viewVictimDetails || disable}
                    selectedPermanentState={selectedPermanentState}
                    setSelectedPermanentState={setSelectedPermanentState}
                  />
                )}
                <Divider />
                <StandardContactForm
                  colWidth={6}
                  changeValue={checkFields}
                  disabled={viewVictimDetails || disable}
                />
                <Divider />
                <StandardIdentityForm
                  colWidth={6}
                  changeValue={checkFields}
                  setidentityList={setVictimDetailsInputList}
                  disabled={viewVictimDetails || disable}
                  currentData={editVictimDetailsObj}
                  form={victimForm}
                  resetFiles={resetFiles}
                  setResetFiles={setResetFiles}
                />
              </Col>
            ) : null}
          </Col>
          <Col span={6}>
            <div style={{ marginLeft: 10, marginBottom: 20 }}>
              <UploadFormWithRestriction
                colWidth={22}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={viewVictimDetails || disable}
                inputFileList={inputFileList}
                isRequired={
                  selectedVictim === "Unknown Dead Body" ||
                  selectedVictim === "Missing"
                }
                isRestricted={
                  selectedVictim === "Unknown Dead Body" ||
                  selectedVictim === "Missing"
                }
              />
            </div>
            {!isEmpty(savedFir?.victimDetails) ? (
              <>
                <Button
                  style={{ marginTop: "40px", width: "100%" }}
                  onClick={() => setIsRecordsModalVisible(true)}
                >
                  {savedFir?.victimDetails && savedFir?.victimDetails.length > 0
                    ? savedFir?.victimDetails.length
                    : 0}{" "}
                  Victim Detail Records
                </Button>
                <Modal
                  title="Victim Detail Records"
                  visible={isRecordsModalVisible}
                  onOk={() => setIsRecordsModalVisible(false)}
                  onCancel={() => setIsRecordsModalVisible(false)}
                  style={{ minWidth: "95vw" }}
                  footer={null}
                >
                  <div style={{ maxHeight: 650, overflowY: "auto" }}>
                    <SavedRecords
                      dataSource={getSavedData()}
                      editDetails={handleEditVictimDetails}
                      setViewDetails={setViewVictimDetails}
                      selectedRecord={editVictimDetailsObj}
                      isMedia={true}
                      recordVisible={setIsRecordsModalVisible}
                      isVictim={true}
                      typeLabel="Victim Type"
                      disable={disable}
                      complainantDetails={complainantDetails}
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
                selectedVictim === "" ||
                viewVictimDetails ||
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
                "Saving Victim Details...",
                "Saving Victim Details. Please wait!!"
              )}
          </Col>
        </Row>
      ) : null}
    </Card>
  );
}
