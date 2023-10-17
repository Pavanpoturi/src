import { Card, Row, Col, Form, Checkbox, Input, DatePicker, Radio } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { surrenderInCourt } from "@components/Common/formOptions";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { setRules } from "@components/Common/helperMethods";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { disableFutureDates } from "@components/Common/helperMethods";
import { isEmpty, size, first, isUndefined, isArray } from "lodash";
import {
  DATE_TIME_FORMAT,
  DATE_FORMAT,
  getPersonDetails,
  getDaysOfWeeks,
} from "../../fir-util";
import AddSuretyDetails from "../CommonForms/AddSuretyDetails";

const { RangePicker } = DatePicker;

const styles = {
  widgetColumnStyle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    overflow: "hidden",
    marginTop: 20,
  },
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function SurrenderInCourt(props) {
  const {
    renderFieldsWithDropDown,
    checkFields,
    selectedRecord,
    disabled,
    form,
    suretyDetailsForm,
    selectedSuretyDetails,
    setSelectedSuretyDetails,
    isSuretyDetailsModalVisible,
    setIsSuretyDetailsModalVisible,
    viewEditObj,
    setviewEditObj,
    viewEditObjIndex,
    setviewEditObjIndex,
    age,
    setAge,
    inputList,
    setInputList,
  } = props;
  const { courtsFromPSList, jailsNameList } = useSelector(
    (state) => state.MasterData
  );
  const [selectedSurrenderinCourtType, setSelectedSurrenderinCourtType] =
    useState("");
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);

  useEffect(() => {
    if (selectedRecord?.surrenderInCourt?.sendToJudicialCustody) {
      setSelectedSurrenderinCourtType("judicialcustody");
    }
    if (selectedRecord?.surrenderInCourt?.releasedOnBail) {
      setSelectedSurrenderinCourtType("releasedonbail");
    }
  }, [selectedRecord]);

  useEffect(() => {
    if (viewEditObj) {
      const {
        personalDetails,
        presentAddress,
        permanentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
      } = viewEditObj.person;
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
      suretyDetailsForm.setFieldsValue({
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
        userDate: moment(new Date(viewEditObj.userDate)).isValid()
          ? moment(new Date(viewEditObj.userDate))
          : "",
      });
    }
  }, [viewEditObj]);

  const handleOk = async () => {
    const values = await suretyDetailsForm.validateFields();
    if (values?.name || values?.surname) {
      const payload = [
        {
          person: getPersonDetails(values, inputList, []),
          suretyDocURL: {
            url: "",
            category: "",
            team: "",
            mimeType: "",
            FileId: "",
          },
        },
      ];
      let updatedResult = [];
      if (viewEditObjIndex) {
        let n1 = [...selectedSuretyDetails];
        let n2 = [...selectedSuretyDetails];
        const payloadData = first(payload);
        n2[viewEditObjIndex - 1] = payloadData;
        updatedResult = [...n2];
      } else {
        updatedResult = [...selectedSuretyDetails, ...payload];
      }
      if (isAddAnotherSuretyDetails) {
        suretyDetailsForm.resetFields();
        setSelectedSuretyDetails(updatedResult);
      } else {
        if (isEmpty(selectedSuretyDetails)) {
          setSelectedSuretyDetails(payload);
          setIsSuretyDetailsModalVisible(false);
        } else {
          setSelectedSuretyDetails(updatedResult);
          setIsSuretyDetailsModalVisible(false);
        }
      }
    }
    suretyDetailsForm.resetFields();
    setviewEditObj("");
    setviewEditObjIndex("");
  };

  const handleCancel = () => {
    setIsSuretyDetailsModalVisible(false);
    setIsAddAnotherSuretyDetails(false);
    suretyDetailsForm.resetFields();
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayFormItems = (name) => {
    switch (name) {
      case "numberOfDays":
        return (
          <Input
            onChange={checkFields}
            type="number"
            style={{ width: 100 }}
            maxLength={10}
            disabled={disabled}
          />
        );
      case "dateTimeJudicialcustody":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            disabled={disabled}
            onChange={checkFields}
          />
        );
      case "JailName":
        return renderFieldsWithDropDown(
          jailsNameList,
          null,
          200,
          null,
          disabled,
          null
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          200,
          null,
          disabled,
          null
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 200 }}
            maxLength={textFieldRules.maxLength}
            disabled={disabled}
          />
        );
    }
  };

  function onChange(e) {
    checkFields();
    setSelectedSurrenderinCourtType(e.target.value);
  }

  function onChangeIO(val) {
    checkFields();
    setToAppearBeforeIo(val);
  }

  const suretyDetailsCount = selectedSuretyDetails;

  const handleAddedSuretyDetails = (suretyList) => {
    setIsSuretyDetailsModalVisible(true);
  };

  return (
    <>
      <div className="widgetPageStyle">
        <Card style={{ marginTop: 20, width: "100%" }}>
          <Row glutter={24}>
            <Col span={8} style={{ marginBottom: 10 }}>
              <Form.Item name="courtName" label="Court Name">
                {renderFieldsWithDropDown(
                  courtNames,
                  null,
                  250,
                  null,
                  disabled,
                  null
                )}
              </Form.Item>
            </Col>
            <Col span={8} style={{ marginBottom: 10, marginLeft: 40 }}>
              <Form.Item
                name="dateTime"
                label="Surrendered in Court On"
                style={{ marginBottom: 10 }}
              >
                <DatePicker
                  disabled={disabled}
                  onChange={checkFields}
                  showTime
                  format={DATE_TIME_FORMAT}
                  placeholder="Select Date & Time"
                  style={{ width: 200 }}
                  disabledDate={disableFutureDates}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="surrenderInCourtType" style={{ marginBottom: 20 }}>
            <Radio.Group
              buttonStyle="solid"
              onChange={onChange}
              disabled={disabled}
            >
              <Radio value="judicialcustody" style={{ paddingRight: 100 }}>
                Send to Judicial Custody
              </Radio>
              <Radio value="releasedonbail">Released on Bail</Radio>
            </Radio.Group>
          </Form.Item>
          <Row glutter={24}>
            {
              <Col span={7} style={{ marginBottom: 10, paddingRight: 10 }}>
                {selectedSurrenderinCourtType === "judicialcustody" &&
                  surrenderInCourt.map((s, i) => {
                    return (
                      <Form.Item
                        key={i}
                        name={s.name}
                        label={s.label}
                        rules={setRules(s.type)}
                        style={{ marginBottom: 10 }}
                      >
                        {displayFormItems(s.name)}
                      </Form.Item>
                    );
                  })}
              </Col>
            }
            {selectedSurrenderinCourtType === "releasedonbail" && (
              <Col span={17}>
                <Row>
                  <Col span={16}>
                    <Form.Item
                      name="conditionsImposed"
                      label="Conditions Imposed"
                      rules={[textAreaRules.textAreaMaxLength]}
                    >
                      <TextArea
                        style={{ height: "100px" }}
                        maxLength={textAreaRules.maxLength}
                        onChange={checkFields}
                        disabled={disabled}
                      />
                    </Form.Item>

                    <Form.Item
                      name="disNumberOfCourt"
                      label="DIS Number of Court"
                      style={{ marginBottom: 10 }}
                      rules={[textFieldRules.textFieldMaxLength]}
                    >
                      <Input
                        onChange={checkFields}
                        style={{ width: 200 }}
                        maxLength={textFieldRules.maxLength}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8} style={{ marginTop: 20, paddingLeft: 15 }}>
                    <Row>
                      <div style={styles.widgetPageStyle}>
                        <div>
                          <Form.Item
                            name="toAppearBeforeIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={disabled}
                              onChange={(e) => onChangeIO(e.target.checked)}
                            />
                          </Form.Item>
                        </div>
                        <div>
                          <span
                            style={{
                              paddingLeft: 5,
                              verticalAlign: "text-bottom",
                              paddingTop: 10,
                            }}
                          >
                            To appear before IO?
                          </span>
                        </div>
                      </div>
                      <div style={styles.widgetPageStyle}>
                        <div>
                          <Form.Item
                            name="cooperateWithIo"
                            valuePropName="checked"
                          >
                            <Checkbox
                              disabled={disabled}
                              onChange={checkFields}
                            />
                          </Form.Item>
                        </div>
                        <div>
                          <span
                            style={{
                              paddingLeft: 5,
                              verticalAlign: "text-bottom",
                              paddingTop: 10,
                            }}
                          >
                            Co-operate with IO
                          </span>
                        </div>
                      </div>
                      {toAppearBeforeIo ||
                      form.getFieldValue()?.toAppearBeforeIo ? (
                        <>
                          <Form.Item
                            name="selectDaysOfWeek"
                            label="Select Days Of Week"
                          >
                            {renderFieldsWithDropDown(
                              getDaysOfWeeks,
                              null,
                              200,
                              null,
                              false,
                              "multiple"
                            )}
                          </Form.Item>
                          <Form.Item name="selectPeriod" label="Select Period">
                            <RangePicker
                              format={DATE_FORMAT}
                              style={{ width: 220 }}
                              disabled={disabled}
                            />
                          </Form.Item>
                        </>
                      ) : null}
                    </Row>
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        </Card>
        {isSuretyDetailsModalVisible ? (
          <AddSuretyDetails
            title="Surety Details"
            isModalVisible={isSuretyDetailsModalVisible}
            handleOk={handleOk}
            handleCancel={handleCancel}
            formName={suretyDetailsForm}
            checkFields={checkFields}
            disabled={viewSuretyClicked || disabled}
            setInputList={setInputList}
            suretyList={selectedSuretyDetails}
            viewSuretyClicked={viewSuretyClicked}
            editSuretyClicked={editSuretyClicked}
            setviewEditObj={setviewEditObj}
            setviewEditObjIndex={setviewEditObjIndex}
            setviewSuretyClicked={setviewSuretyClicked}
            seteditSuretyClicked={seteditSuretyClicked}
            editObj={null}
            age={age}
            setAge={setAge}
            setIsAddAnotherSuretyDetails={setIsAddAnotherSuretyDetails}
          />
        ) : null}
      </div>
      <Row style={{ marginTop: 50 }}>
        <div
          className="popupLink"
          onClick={() => handleAddedSuretyDetails(suretyDetailsCount)}
        >
          Add Sureties Details
        </div>
      </Row>
      {!isEmpty(suretyDetailsCount) ? (
        <Row style={{ marginTop: 10 }}>
          <div
            className="popupLink"
            onClick={() => handleAddedSuretyDetails(suretyDetailsCount)}
          >
            {`${size(suretyDetailsCount)} Sureties Added`}
          </div>
        </Row>
      ) : null}
    </>
  );
}
