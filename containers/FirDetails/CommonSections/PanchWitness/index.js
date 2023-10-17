import { useState, useEffect } from "react";
import moment from "moment";
import { Col, Divider, Form, Checkbox, Button } from "antd";
import { isUndefined } from "lodash";
import { useSelector } from "react-redux";
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

export default function PanchWitness({
  crimeSceneDate,
  handleSubmit,
  setInputList,
  currentData,
  resetEdit,
  viewPanchWitness,
  setViewPanchWitness,
  PanchWitnessForm,
  showButton,
  setformValidFlag,
  isInvestigation,
}) {
  const [formValid, SetFormValid] = useState(false);
  const [age, setAge] = useState("");
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [resetFiles, setResetFiles] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");

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
    const values = await PanchWitnessForm.validateFields();
    if (isInvestigation && values && !values.userDate) {
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

  useEffect(() => {
    if (currentData) {
      const {
        personalDetails,
        presentAddress,
        permanentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
      } = currentData.person;
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
        createdFrom,
        createdFor,
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
      PanchWitnessForm.setFieldsValue({
        lastupdateddatetime: moment(new Date(dateCreated)).isValid()
          ? moment(new Date(dateCreated))
          : "",
        id: _id,
        name: name,
        surname: surname,
        aliasName: alias,
        relationType: relationType,
        fatherHusbandGuardianName: fatherHusbandGuardianName,
        createdFrom: createdFrom,
        createdFor: createdFor,
        gender: gender,
        dateOfBirth: moment(new Date(dateOfBirth)).isValid()
          ? moment(new Date(dateOfBirth))
          : "",
        age: age,
        occupation: occupation,
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
          : "",
      });
    }
  }, [currentData]);

  const submit = async () => {
    const values = await PanchWitnessForm.validateFields();
    handleSubmit(values);
    SetFormValid(false);
    PanchWitnessForm.resetFields();
    setAge("");
    setResetFiles(true);
    resetEdit();
    setViewPanchWitness(false);
  };

  const reset = () => {
    PanchWitnessForm.resetFields();
    setInputList(null);
    setAge("");
    setResetFiles(true);
    resetEdit();
    setViewPanchWitness(false);
  };

  return (
    <>
      <div className="widgetPageStyle">
        <Col span={24}>
          <StandardPersonalForm
            showMoreOption={true}
            colWidth={8}
            changeValue={checkFields}
            disabled={viewPanchWitness || disableForm}
            age={age}
            setAge={setAge}
            formName={PanchWitnessForm}
          />
          <Divider />
          <div className="heading">Present Address</div>
          <StandardAddressForm
            showMoreOption={true}
            colWidth={8}
            changeValue={checkFields}
            disabled={viewPanchWitness || disableForm}
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
                  disabled={viewPanchWitness || disableForm}
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
              disabled={viewPanchWitness || disableForm}
              selectedPermanentState={selectedPermanentState}
              setSelectedPermanentState={setSelectedPermanentState}
            />
          )}
          <Divider />
          <StandardContactForm
            colWidth={7}
            changeValue={checkFields}
            disabled={viewPanchWitness || disableForm}
          />
          <Divider />
          <StandardIdentityForm
            colWidth={7}
            changeValue={checkFields}
            setidentityList={setInputList}
            disabled={viewPanchWitness || disableForm}
            currentData={currentData}
            form={PanchWitnessForm}
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
                !crimeSceneDate || !formValid || viewPanchWitness || disableForm
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
