import { Card, Row, Col, Form, Input, DatePicker, Checkbox } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { isEmpty, size, first, isUndefined, isArray } from "lodash";
import AddSuretyDetails from "../CommonForms/AddSuretyDetails";
import { disableFutureDates } from "@components/Common/helperMethods";
import moment from "moment";
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  getPersonDetails,
  getDaysOfWeeks,
} from "@containers/FirDetails/fir-util";

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
export default function SurrenderBeforeCourt(props) {
  const {
    renderFieldsWithDropDown,
    checkFields,
    selectedRecord,
    disabled,
    form,
    selectedSuretyDetails,
    setSelectedSuretyDetails,
    isSuretyDetailsModalVisible,
    setIsSuretyDetailsModalVisible,
    suretyDetailsForm,
    inputList,
    setInputList,
    viewEditObj,
    setviewEditObj,
    viewEditObjIndex,
    setviewEditObjIndex,
    age,
    setAge,
  } = props;

  const { courtsFromPSList } = useSelector((state) => state.MasterData);
  const [toAppearBeforeIo, setToAppearBeforeIo] = useState(false);
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);
  function onChangeIO(val) {
    checkFields();
    setToAppearBeforeIo(val);
  }

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
            fileId: "",
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

  const suretyDetailsSurrenderBeforeCourtCount = selectedSuretyDetails;

  const handleAddedSuretyDetails = (suretyList) => {
    setIsSuretyDetailsModalVisible(true);
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  return (
    <div className="widgetPageStyle">
      <Card style={{ marginTop: 20, width: "100%" }}>
        <Row glutter={24}>
          <Col span={8}>
            <Form.Item
              name="bailName"
              label="Name of the Court Granted Bail"
              style={{ marginBottom: 20 }}
            >
              {renderFieldsWithDropDown(courtNames, null, 220, false, disabled)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="dateTime"
              label="Surrendered On"
              style={{ marginBottom: 10 }}
            >
              <DatePicker
                disabled={disabled}
                onChange={checkFields}
                showTime
                format={DATE_TIME_FORMAT}
                placeholder="Select Date & Time"
                style={{ width: 220 }}
                disabledDate={disableFutureDates}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="highCourtCRLNo"
              label="Crl MP/WP No. of High Court"
              style={{ marginBottom: 20 }}
              rules={[textFieldRules.textFieldMaxLength]}
            >
              <Input
                style={{ width: 220 }}
                disabled={disabled}
                onChange={checkFields}
                maxLength={textFieldRules.maxLength}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row glutter={24}>
          <Col span={8}>
            <Form.Item
              name="surrenderDateInLowerCourt"
              label="Surrendered in Lower Court On"
              style={{ marginBottom: 10 }}
            >
              <DatePicker
                format={DATE_FORMAT}
                style={{ width: 220 }}
                disabled={disabled}
                onChange={checkFields}
              />
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
            <Form.Item
              name="lowerCourtName"
              label="Name of the Lower Court"
              style={{ marginBottom: 20 }}
            >
              {renderFieldsWithDropDown(courtNames, null, 220, false, disabled)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="courtDISNo"
              label="DIS Number of Court"
              style={{ marginBottom: 10 }}
              rules={[textFieldRules.textFieldMaxLength]}
            >
              <Input
                style={{ width: 220 }}
                maxLength={textFieldRules.maxLength}
                disabled={disabled}
                onChange={checkFields}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row glutter={24}>
          <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
            <Form.Item
              name="disDate"
              label="Date of DIS"
              style={{ marginBottom: 10 }}
            >
              <DatePicker
                format={DATE_FORMAT}
                disabled={disabled}
                onChange={checkFields}
                style={{ width: 220 }}
              />
            </Form.Item>
          </Col>
          <Col span={15}>
            <Form.Item
              name="bailConditionsImposed"
              label="Conditions Imposed"
              rules={[textAreaRules.textAreaMaxLength]}
            >
              <TextArea
                style={{ height: 100 }}
                disabled={disabled}
                onChange={checkFields}
                maxLength={textAreaRules}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={{ marginTop: 20 }}>
          <Col span={8}>
            <Form.Item name="toAppearBeforeIo" valuePropName="checked">
              <Checkbox
                disabled={disabled}
                onChange={(e) => onChangeIO(e.target.checked)}
              >
                To appear before IO?
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cooperateWithIo" valuePropName="checked">
              <Checkbox disabled={disabled} onChange={checkFields}>
                Co-operate with IO
              </Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {toAppearBeforeIo || form.getFieldValue()?.toAppearBeforeIo ? (
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col>
              <Form.Item name="selectDaysOfWeek" label="Select Days Of Week">
                {renderFieldsWithDropDown(
                  getDaysOfWeeks,
                  null,
                  220,
                  null,
                  false,
                  "multiple"
                )}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="selectPeriod" label="Select Period">
                <RangePicker
                  format={DATE_FORMAT}
                  style={{ width: 220 }}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </Row>
        ) : null}
        <Row style={{ marginTop: 20 }}>
          <div
            className="popupLink"
            onClick={() =>
              handleAddedSuretyDetails(suretyDetailsSurrenderBeforeCourtCount)
            }
          >
            Add Sureties Details
          </div>
        </Row>
        {!isEmpty(suretyDetailsSurrenderBeforeCourtCount) ? (
          <Row style={{ marginTop: 10 }}>
            <div
              className="popupLink"
              onClick={() =>
                handleAddedSuretyDetails(suretyDetailsSurrenderBeforeCourtCount)
              }
            >
              {`${size(suretyDetailsSurrenderBeforeCourtCount)} Sureties Added`}
            </div>
          </Row>
        ) : null}
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
      </Card>
    </div>
  );
}
