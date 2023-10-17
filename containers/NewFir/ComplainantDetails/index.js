import { Col, Divider, Form, Checkbox, Button, Row, Card } from "antd";
import { isUndefined, isEmpty, first, isArray } from "lodash";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import { useState, useEffect } from "react";
import moment from "moment";
import { config } from "@config/site.config";
import UploadForm from "@components/Common/uploadForm";
import axios from "axios";
import {
  getPersonDetails,
  getMediaUploadError,
  getMediaPayload,
  DATE_FORMAT_MM,
  updatePersonDetails,
} from "../../FirDetails/fir-util";
import createFIRActions from "@redux/createFir/actions";
import ComplainantList from "./ComplainantList";
import { spinAlert } from "@containers/media-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
    marginTop: 10,
  },
};

export default function ComplainantDetails({
  isInvestigation,
  disable,
  crimeId,
  openNotificationWithIcon,
  firType,
  isConsumed,
}) {
  const dispatch = useDispatch();
  const [complainantForm] = Form.useForm();
  const [isFormUploading, setIsFormUploading] = useState(false);
  const [formValid, SetFormValid] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [complainantDetailsInputList, setComplainantDetailsInputList] =
    useState([]);
  const [inputFileList, setInputFileList] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("ComplainantDetails");
  const [editComplainantDetailsObj, setEditComplainantDetailsObj] =
    useState(null);
  const [viewComplainantDetails, setViewComplainantDetails] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [age, setAge] = useState("");
  const [resetFiles, setResetFiles] = useState(false);
  const [isEditRecord, setIsEditRecord] = useState(false);
  const { addComplainant } = createFIRActions;
  const { savedFir, updateActionType } = useSelector(
    (state) => state.createFIR
  );
  const isComplainantExist =
    savedFir && !isEmpty(savedFir?.complainantDetails) && !isEditRecord;

  const reset = () => {
    complainantForm.resetFields();
    setAge("");
    setResetFiles(true);
    setEditComplainantDetailsObj(null);
    setViewComplainantDetails(false);
    setIsEditRecord(false);
  };

  useEffect(() => {
    if (updateActionType === "ADD_COMPLAINANT_SUCCESS") {
      reset();
    }
  }, [updateActionType]);

  const checkFields = async () => {
    const values = await complainantForm.validateFields();
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

  const handleEditComplainantDetails = (value) => {
    setEditComplainantDetailsObj(value);
    setViewComplainantDetails(false);
    if (value && value?.person) {
      const {
        personalDetails,
        presentAddress,
        contactDetails,
        sameAsPresent,
        permanentAddress,
      } = value?.person;
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
      complainantForm.setFieldsValue({
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        gender: gender,
        dateOfBirth:
          !isEmpty(dateOfBirth) && moment(dateOfBirth).isValid()
            ? moment(dateOfBirth)
            : null,
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
        isVictim: value?.isVictim,
      });
    }
  };

  const getCommonPayload = (complainantDetails) => {
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
      victimDetails: savedFir?.victimDetails,
      complainantDetails: complainantDetails,
      stolenProperties: savedFir?.stolenProperties,
    };
    return payload;
  };

  const submit = async () => {
    const values = await complainantForm.validateFields();
    const mediaFormData = new FormData();
    inputFileList.forEach((file) => {
      mediaFormData.append("file", file.originFileObj);
    });
    mediaFormData.append("prefixFolder", crimeId);
    mediaFormData.append("folderPath", `${crimeId}/complainantDetails/media`);

    if (!isEmpty(inputFileList)) {
      setIsFormUploading(true);
      axios
        .post(`${config.fileUpload}/upload`, mediaFormData)
        .then((res) => {
          if (res.status === 200) {
            const { data } = res.data;

            const existingMedia =
              !isUndefined(editComplainantDetailsObj?.person) &&
              !isEmpty(editComplainantDetailsObj?.person?.media)
                ? editComplainantDetailsObj?.person?.media
                : [];

            if (editComplainantDetailsObj?.person?._id) {
              const updatePayload = [
                {
                  person: updatePersonDetails(
                    values,
                    complainantDetailsInputList,
                    getMediaPayload(
                      [...data, ...existingMedia],
                      selectedCategory
                    ),
                    editComplainantDetailsObj?.person?._id
                  ),
                  isVictim: values?.isVictim ? values?.isVictim : false,
                },
              ];
              const payload = getCommonPayload(updatePayload);
              //removing complainant from victims
              if (
                values?.isVictim === false &&
                payload?.victimDetails &&
                isArray(payload?.victimDetails) &&
                payload?.victimDetails.length > 0
              ) {
                let n1 = payload?.victimDetails.filter(
                  (ele) =>
                    ele?.person?._id !== editComplainantDetailsObj?.person?._id
                );
                payload.victimDetails = n1;
              }
              dispatch(addComplainant(config.updateFIR, payload));
            } else {
              const addCompPayload = [
                {
                  person: getPersonDetails(
                    values,
                    complainantDetailsInputList,
                    getMediaPayload(data, selectedCategory)
                  ),
                  isVictim: values?.isVictim ? values?.isVictim : false,
                },
              ];
              const payload = getCommonPayload(addCompPayload);
              dispatch(addComplainant(config.updateFIR, payload));
            }
            setIsFormUploading(false);
          }
        })
        .catch((err) => {
          getMediaUploadError(err, openNotificationWithIcon);
        });
    } else if (isEmpty(inputFileList)) {
      const existingMedia =
        !isUndefined(editComplainantDetailsObj?.person) &&
        !isEmpty(editComplainantDetailsObj?.person?.media)
          ? editComplainantDetailsObj?.person?.media
          : [];
      if (editComplainantDetailsObj?.person?._id) {
        const updatePayload = [
          {
            person: updatePersonDetails(
              values,
              complainantDetailsInputList,
              existingMedia,
              editComplainantDetailsObj?.person?._id
            ),
            isVictim: values?.isVictim ? values?.isVictim : false,
          },
        ];
        const payload = getCommonPayload(updatePayload);
        //removing complainant from victims
        if (
          values?.isVictim === false &&
          payload?.victimDetails &&
          isArray(payload?.victimDetails) &&
          payload?.victimDetails.length > 0
        ) {
          let n1 = payload?.victimDetails.filter(
            (ele) => ele?.person?._id !== editComplainantDetailsObj?.person?._id
          );
          payload.victimDetails = n1;
        }
        dispatch(addComplainant(config.updateFIR, payload));
      } else {
        const addCompPayload = [
          {
            person: getPersonDetails(
              values,
              complainantDetailsInputList,
              existingMedia
            ),
            isVictim: values?.isVictim ? values?.isVictim : false,
          },
        ];
        const payload = getCommonPayload(addCompPayload);
        dispatch(addComplainant(config.updateFIR, payload));
      }
    }
  };

  return (
    <Card style={{ padding: 10 }}>
      <Form form={complainantForm} layout="vertical">
        <Row glutter={24}>
          <Col span={18}>
            <StandardPersonalForm
              showMoreOption={false}
              colWidth={8}
              changeValue={checkFields}
              disabled={viewComplainantDetails || disable || isComplainantExist}
              age={age}
              setAge={setAge}
              formName={complainantForm}
              validationFields={["Name", "Gender", "Nationality"]}
            />
            <Divider />
            <div className="heading">Present Address</div>
            <StandardAddressForm
              showMoreOption={false}
              colWidth={8}
              changeValue={checkFields}
              disabled={viewComplainantDetails || disable || isComplainantExist}
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
                    disabled={
                      viewComplainantDetails || disable || isComplainantExist
                    }
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
                disabled={
                  viewComplainantDetails || disable || isComplainantExist
                }
                selectedPermanentState={selectedPermanentState}
                setSelectedPermanentState={setSelectedPermanentState}
              />
            )}
            <Divider />
            <StandardContactForm
              colWidth={6}
              changeValue={checkFields}
              disabled={viewComplainantDetails || disable || isComplainantExist}
            />
            <Divider />
            <StandardIdentityForm
              colWidth={6}
              changeValue={checkFields}
              setidentityList={setComplainantDetailsInputList}
              disabled={viewComplainantDetails || disable || isComplainantExist}
              currentData={editComplainantDetailsObj}
              form={complainantForm}
              resetFiles={resetFiles}
              setResetFiles={setResetFiles}
            />
          </Col>
          <Col span={6}>
            <div style={{ marginLeft: 10, marginBottom: 20 }}>
              <UploadForm
                colWidth={22}
                enableMediaManager={true}
                setInputFileList={setInputFileList}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                disabled={
                  viewComplainantDetails || disable || isComplainantExist
                }
              />
            </div>
            {!isUndefined(savedFir) &&
            !isEmpty(savedFir?.complainantDetails) ? (
              <ComplainantList
                minHeight={750}
                records={savedFir?.complainantDetails}
                editDetails={handleEditComplainantDetails}
                selectedRecord={editComplainantDetailsObj}
                setViewDetails={setViewComplainantDetails}
                setIsEditRecord={setIsEditRecord}
                disable={disable}
              />
            ) : null}
          </Col>
        </Row>
        <Col span={8} style={{ marginTop: 15 }}>
          <Form.Item name="isVictim" valuePropName="checked">
            <Checkbox
              onChange={checkFields}
              disabled={viewComplainantDetails || disable || isComplainantExist}
            >
              Is Victim ?
            </Checkbox>
          </Form.Item>
        </Col>
      </Form>
      <Divider />
      <Row>
        <Col span={4}>
          <Button
            type="primary"
            className="submitButton"
            icon={<SaveOutlined className="saveButtonIcon" />}
            disabled={
              viewComplainantDetails ||
              disable ||
              isComplainantExist ||
              isFormUploading
            }
            onClick={submit}
          >
            SAVE
          </Button>
        </Col>
        <Col>
          {isFormUploading &&
            spinAlert(
              "Saving Complainant Details...",
              "Saving Complainant Details. Please wait!!"
            )}
        </Col>
      </Row>
    </Card>
  );
}
