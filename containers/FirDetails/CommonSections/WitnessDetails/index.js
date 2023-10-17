import { useState, useEffect } from "react";
import moment from "moment";
import { Col, Divider, Form, Checkbox, Button } from "antd";
import { useSelector } from "react-redux";
import { isUndefined } from "lodash";
import { SaveOutlined } from "@ant-design/icons";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};
export default function WitnessDetails({
  crimeSceneDate,
  handleSubmit,
  currentData,
  resetEdit,
  setInputList,
  viewWitnessDetails,
  setViewWitnessDetails,
  WitnessDetailsForm,
  showButton,
  setformValidFlag,
  isInvestigation,
}) {
  const [formValid, SetFormValid] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [age, setAge] = useState("");
  const [resetFiles, setResetFiles] = useState(false);
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  function omitKeys(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

      target[i] = obj[i];
    }
    return target;
  }

  const checkFields = async () => {
    const values = await WitnessDetailsForm.validateFields();
    if (isInvestigation && values && !values.userDate) {
      SetFormValid(false);
      setformValidFlag(false);
    } else {
      SetFormValid(
        !Object.values(values).every(
          (v) => v == null || (typeof v === "string" && v.trim() === "")
        )
      );
      if (setformValidFlag) {
        var objExcludeUserDate = omitKeys(values, ["userDate"]);
        setformValidFlag(
          !Object.values(objExcludeUserDate).every(
            (v) => v == null || (typeof v === "string" && v.trim() === "")
          )
        );
      }
    }
  };

  const reset = () => {
    WitnessDetailsForm.resetFields();
    setAge("");
    setResetFiles(true);
    resetEdit();
    setViewWitnessDetails(false);
  };

  useEffect(() => {
    if (currentData) {
      const sameAsPresent =
        !isUndefined(currentData.person) && currentData?.person?.sameAsPresent;
      const personalDetails =
        !isUndefined(currentData?.person) &&
        !isUndefined(currentData?.person?.personalDetails) &&
        currentData?.person?.personalDetails;
      const presentAddress =
        !isUndefined(currentData?.person) &&
        !isUndefined(currentData?.person?.presentAddress) &&
        currentData?.person?.presentAddress;
      const permanentAddress =
        !isUndefined(currentData?.person) &&
        !isUndefined(currentData?.person?.permanentAddress) &&
        currentData?.person?.permanentAddress;
      const contactDetails =
        !isUndefined(currentData?.person) &&
        !isUndefined(currentData?.person?.contactDetails) &&
        currentData?.person?.contactDetails;
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
      WitnessDetailsForm.setFieldsValue({
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        gender: gender,
        dateOfBirth: moment(new Date(dateOfBirth)).isValid()
          ? moment(new Date(dateOfBirth))
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
        userDate: moment(new Date(currentData.userDate)).isValid()
          ? moment(new Date(currentData.userDate))
          : moment(new Date(currentData?.person?.userDate)).isValid()
          ? moment(new Date(currentData?.person?.userDate))
          : "",
      });
    }
  }, [currentData]);

  const submit = async () => {
    const values = await WitnessDetailsForm.validateFields();
    handleSubmit(values);
    WitnessDetailsForm.resetFields();
    setAge("");
    setResetFiles(true);
    SetFormValid(false);
    resetEdit();
    setViewWitnessDetails(false);
  };

  return (
    <>
      <div className="widgetPageStyle">
        <Col span={24}>
          <StandardPersonalForm
            showMoreOption={true}
            colWidth={8}
            changeValue={checkFields}
            disabled={viewWitnessDetails || disableForm}
            age={age}
            setAge={setAge}
            formName={WitnessDetailsForm}
          />
          <Divider />
          <div className="heading">Present Address</div>
          <StandardAddressForm
            showMoreOption={true}
            colWidth={8}
            changeValue={checkFields}
            disabled={viewWitnessDetails || disableForm}
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
                  disabled={viewWitnessDetails || disableForm}
                  onChange={(e) => setPermanentAddress(e.target.checked)}
                ></Checkbox>
              </Form.Item>
            </div>
            <div style={{ marginTop: 2 }}>
              <label className="heading">Use same as Present</label>
            </div>
          </div>
          {!permanentAddress && (
            <StandardPermanentAddressForm
              showMoreOption={true}
              colWidth={8}
              changeValue={checkFields}
              disabled={viewWitnessDetails || disableForm}
              selectedPermanentState={selectedPermanentState}
              setSelectedPermanentState={setSelectedPermanentState}
            />
          )}
          <Divider />
          <StandardContactForm
            colWidth={6}
            changeValue={checkFields}
            disabled={viewWitnessDetails || disableForm}
          />
          <Divider />
          <StandardIdentityForm
            colWidth={6}
            changeValue={checkFields}
            setidentityList={setInputList}
            disabled={viewWitnessDetails || disableForm}
            currentData={currentData}
            form={WitnessDetailsForm}
            resetFiles={resetFiles}
            setResetFiles={setResetFiles}
          />
        </Col>
      </div>
      {showButton && (
        <>
          <Divider />
          <Form.Item>
            <Button
              type="primary"
              className="saveButton"
              size="large"
              icon={<SaveOutlined className="saveButtonIcon" />}
              disabled={
                !crimeSceneDate ||
                !formValid ||
                viewWitnessDetails ||
                disableForm
              }
              onClick={submit}
            >
              SAVE
            </Button>
            <span className="linkStyle resetLink" onClick={reset}>
              Reset
            </span>
          </Form.Item>
        </>
      )}
    </>
  );
}
