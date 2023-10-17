import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Radio, Checkbox, DatePicker, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { config } from "@config/site.config";
import moment from "moment";
import {
  masterDataType,
  DATE_TIME_FORMAT,
  getStaffsDetails,
  getPersonDetails,
} from "@containers/FirDetails/fir-util";
import { arrrestPersonQuestions } from "@components/Common/formOptions";
import { isEmpty, size, isBoolean, isUndefined, first, isArray } from "lodash";
import { textAreaRules, textFieldRules } from "@components/Common/formOptions";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { disableFutureDates } from "@components/Common/helperMethods";
import RCHospitalDetailsForm from "./ArrestSubForms/RCHospitalDetailsForm";
import ArrestPersonQuestions from "./ArrestSubForms/ArrestPersonQuestions";
import IntimationOfInterest from "./ArrestSubForms/IntimationOfInterest";
import IntimationReceived from "./ArrestSubForms/IntimationReceived";
import PoliceCustodyDetails from "./ArrestSubForms/PoliceCustodyDetails";
import BailOrderDetails from "./ArrestSubForms/BailOrderDetails";
import MedicalExamination from "../CommonForms/MedicalExamination";
import { isOptionTrue, arrestOption } from "./utils";
import OtherStateSelected from "./ArrestSubForms/OtherStateSelected";
import AddSuretyDetails from "../CommonForms/AddSuretyDetails";

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

export default function ArrestContainer(props) {
  const {
    selectedArrestValue = "",
    accusedPersonalDetails,
    arrestOptions = [],
    setSelectedArrestType,
    renderFieldsWithDropDown,
    arrestTypeData = [],
    showMedicalExamination = true,
    isRapeCase = false,
    checkFields,
    viewArrestDetails,
    selectedRecord,
    goToArrest,
    form,
    setDateTimeOfCustody,
    setDateAndTimeOfArrest,
    dateAndTimeOfArrestIsValid,
    setOtherStateSelected,
    otherStateSelected,
    setPerson,
    isInjured,
    setIsInjured,
    setSelectedSiderMenu,
    disableTypeOption,
    fileList,
    actionName,
    disableUpload,
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
    submit,
    setAge,
    inputList,
    setInputList,
    setUploadCourtConditionsUrl,
    bailOrderFileList,
  } = props;
  const dispatch = useDispatch();
  const [selectedArrestOnSurrender, setSelectedSrrestOnSurrender] =
    useState("");
  const [isAddAnotherSuretyDetails, setIsAddAnotherSuretyDetails] =
    useState(false);
  const [viewSuretyClicked, setviewSuretyClicked] = useState(false);
  const [editSuretyClicked, seteditSuretyClicked] = useState(false);

  const data = new Array(arrrestPersonQuestions.length);
  data.fill(false);
  const [questionsBoolen, setQuestionsBoolen] = useState(data);
  data.fill("");
  const [questionDetails, setQuestionDetails] = useState(data);

  const { staffList, rankList, courtsFromPSList } = useSelector(
    (state) => state.MasterData
  );
  const { getRanks, getStaffList } = masterDataActions;
  const isArrestByPolice = isOptionTrue(selectedArrestValue, arrestOptions, 0);
  const isArrestByAnotherPolice = isOptionTrue(
    selectedArrestValue,
    arrestOptions,
    1
  );
  const isArrestOnAnticipatoryBail = isOptionTrue(
    selectedArrestValue,
    arrestOptions,
    2
  );

  const isArrestOnSurrender = isOptionTrue(
    selectedArrestValue,
    arrestOptions,
    3
  );

  const staffMembersList = staffList && getStaffsDetails(staffList);

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getRanks(`${url}/${masterDataType.RANK}`));
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  }, []);

  useEffect(() => {
    if (isArrestOnSurrender) {
      let surrenderType = "";
      if (selectedRecord?.arrestOnSurrenderInPoliceStation.arrest) {
        surrenderType = arrestOption.ARREST;
      }
      if (
        selectedRecord?.arrestOnSurrenderInPoliceStation.releasedOnStationBail
      ) {
        surrenderType = "Released On Station Bail";
      }
      if (selectedRecord?.arrestOnSurrenderInPoliceStation.issue41ANotice) {
        surrenderType = "Issue 41A Cr.P.C Notice";
      }
      setSelectedSrrestOnSurrender(surrenderType);
    }
  }, [isArrestOnSurrender]);

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

  const arrestOnSurrenderOnChange = (e) => {
    setSelectedSrrestOnSurrender(e.target.value);
  };

  const dateTimeOfCustodyChange = (date, _dateString) => {
    const dateTimeOfCustody = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setDateTimeOfCustody(dateTimeOfCustody);
    checkFields();
  };

  const dateAndTimeOfArrestChange = (date, _dateString) => {
    const dateTimeOfArrest = moment(date).format("YYYY-MM-DD HH:mm:ss");
    setDateAndTimeOfArrest(dateTimeOfArrest);
    checkFields();
  };

  const courtNames =
    courtsFromPSList &&
    isArray(courtsFromPSList) &&
    !isEmpty(courtsFromPSList) &&
    courtsFromPSList.map(({ court }) => ({ label: court }));

  const displayFormItemsByName = (name) => {
    switch (name) {
      case "dateTimeOfCustody":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={dateTimeOfCustodyChange}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewArrestDetails}
          />
        );
      case "courtName":
        return renderFieldsWithDropDown(
          courtNames,
          null,
          null,
          false,
          viewArrestDetails
        );
      case "dateAndTimeOfArrest":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={dateAndTimeOfArrestChange}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewArrestDetails}
          />
        );
      case "dateTimeOfArrestByOtherPolice":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewArrestDetails}
          />
        );
      case "dateAndTimeOfSurrender":
        return (
          <DatePicker
            showTime
            format={DATE_TIME_FORMAT}
            placeholder="Select Date & Time"
            onChange={checkFields}
            style={{ width: 220 }}
            disabledDate={disableFutureDates}
            disabled={viewArrestDetails}
          />
        );
      case "apprehendedBy":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          null,
          false,
          viewArrestDetails
        );
      case "iOAssistedBy":
        return renderFieldsWithDropDown(
          staffMembersList,
          null,
          null,
          false,
          viewArrestDetails
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 220 }}
            maxLength={textFieldRules.maxLength}
            disabled={viewArrestDetails || name === "accusedCode"}
          />
        );
    }
  };

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
        let n2 = [...selectedSuretyDetails];
        const payloadData = first(payload);
        n2[viewEditObjIndex - 1] = payloadData;
        updatedResult = [...n2];
      } else {
        updatedResult = [...selectedSuretyDetails, ...payload];
      }

      if (isAddAnotherSuretyDetails) {
        suretyDetailsForm.resetFields();
        await setSelectedSuretyDetails(updatedResult);
      } else {
        if (isEmpty(selectedSuretyDetails)) {
          await setSelectedSuretyDetails(payload);
          await setIsSuretyDetailsModalVisible(false);
        } else {
          await setSelectedSuretyDetails(updatedResult);
          await setIsSuretyDetailsModalVisible(false);
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

  const suretyDetailsArrestByPoliceCount = selectedSuretyDetails;
  const suretyDetailsAnticipatoryCount = selectedSuretyDetails;
  const suretyDetailsSurrenderInPSCount = selectedSuretyDetails;

  const handleAddedSuretyDetails = (suretyList) => {
    setIsSuretyDetailsModalVisible(true);
  };

  return (
    <div>
      <div className="widgetPageStyle">
        <Card
          className="widgetCardStyle"
          style={{ marginTop: "20px", width: "100%" }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="arrestType" label="Type of Arrest">
                {renderFieldsWithDropDown(
                  arrestOptions,
                  setSelectedArrestType,
                  null,
                  null,
                  selectedRecord?._id || viewArrestDetails || disableTypeOption
                )}
              </Form.Item>
            </Col>
            {arrestTypeData.map((s, i) => {
              const isLabel =
                s.label === "Place of Arrest" ||
                s.label === "Arrested On" ||
                s.label === "Place of Taken into Custody" ||
                s.label === "Taken into Custody On" ||
                s.label === "Apprehended By" ||
                s.label === "Arrested By other Police On";
              return (
                <Col span={8} key={i} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name={s.name}
                    label={s.label}
                    rules={[
                      {
                        required: isLabel,
                      },
                    ]}
                  >
                    {displayFormItemsByName(s.name)}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
          {isBoolean(dateAndTimeOfArrestIsValid) &&
          !dateAndTimeOfArrestIsValid ? (
            <div className="ant-form-item-explain-error">
              Date of Arrest should be later than Date of Taken into Custody
            </div>
          ) : null}
          {(isArrestByAnotherPolice || isArrestOnAnticipatoryBail) && (
            <div className="widgetPageStyle" style={{ marginTop: 20 }}>
              <Col span={6} style={{ marginBottom: 10 }}>
                <Form.Item name="isInjured" label="Is Injured?">
                  <Radio.Group
                    buttonStyle="solid"
                    disabled={viewArrestDetails}
                    onChange={(e) => setIsInjured(e.target.value)}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              {isInjured && (
                <Col span={18}>
                  <Form.Item
                    name="descriptionOfInjuries"
                    label="Description of Injuries"
                    rules={[textAreaRules.textAreaMaxLength]}
                  >
                    <TextArea
                      style={{ height: "100px" }}
                      maxLength={textAreaRules.maxLength}
                      disabled={viewArrestDetails}
                    />
                  </Form.Item>
                </Col>
              )}
            </div>
          )}
          {isArrestOnSurrender && (
            <div style={styles.widgetColumnStyle}>
              <Col span={12}>
                <Form.Item
                  name="dateOfSurrender"
                  label="Date of Surrender in PS"
                >
                  <DatePicker
                    showTime
                    format={DATE_TIME_FORMAT}
                    placeholder="Select Date & Time"
                    style={{ width: 200 }}
                    disabledDate={disableFutureDates}
                    disabled={viewArrestDetails}
                  />
                </Form.Item>
              </Col>
              <Form.Item name="arrestSurrenderType" style={{ marginTop: 10 }}>
                <Radio.Group buttonStyle="solid" disabled={viewArrestDetails}>
                  <Radio
                    value="Arrest"
                    onChange={arrestOnSurrenderOnChange}
                    style={{ paddingRight: 50 }}
                  >
                    Arrest
                  </Radio>
                  <Radio
                    value="Released On Station Bail"
                    onChange={arrestOnSurrenderOnChange}
                    style={{ paddingRight: 50 }}
                  >
                    Released On Station Bail
                  </Radio>
                  <Radio
                    value="Issue 41A Cr.P.C Notice"
                    onChange={arrestOnSurrenderOnChange}
                  >
                    Issue 41A Cr.P.C Notice
                  </Radio>
                </Radio.Group>
              </Form.Item>
              <div className="widgetPageStyle">
                <div style={{ marginTop: 20 }}>
                  {selectedArrestOnSurrender === "Arrest" && (
                    <div className="linkStyle" onClick={goToArrest}>
                      Follow Arrest
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 20 }}>
                  {selectedArrestOnSurrender === "Released On Station Bail" && (
                    <div>
                      <div style={styles.widgetPageStyle}>
                        <div>
                          <Form.Item
                            name="intimationToSeniorOfficer"
                            valuePropName="checked"
                          >
                            <Checkbox
                              onChange={checkFields}
                              disabled={viewArrestDetails}
                            />
                          </Form.Item>
                        </div>
                        <div style={{ paddingTop: 5 }}>
                          <span
                            style={{
                              paddingLeft: 5,
                              verticalAlign: "text-bottom",
                            }}
                          >
                            Intimation to Senior Officer
                          </span>
                        </div>
                      </div>
                      <Row style={{ marginTop: 20 }}>
                        <div
                          className="popupLink"
                          onClick={() =>
                            handleAddedSuretyDetails(
                              suretyDetailsSurrenderInPSCount
                            )
                          }
                        >
                          Add Sureties Details
                        </div>
                      </Row>
                      {!isEmpty(suretyDetailsSurrenderInPSCount) ? (
                        <Row style={{ marginTop: 10 }}>
                          <div
                            className="popupLink"
                            onClick={() =>
                              handleAddedSuretyDetails(
                                suretyDetailsSurrenderInPSCount
                              )
                            }
                          >
                            {`${size(
                              suretyDetailsSurrenderInPSCount
                            )} Sureties Added`}
                          </div>
                        </Row>
                      ) : null}
                      <Form.Item
                        style={{ marginTop: 20 }}
                        name="stationBailDate"
                        label="Date & Time when Released on Station Bail"
                      >
                        <DatePicker
                          showTime
                          format={DATE_TIME_FORMAT}
                          placeholder="Select Date & Time"
                          style={{ width: 200 }}
                          disabled={viewArrestDetails}
                        />
                      </Form.Item>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 20 }}>
                  {selectedArrestOnSurrender === "Issue 41A Cr.P.C Notice" && (
                    <div
                      className="linkStyle"
                      onClick={() => setSelectedSiderMenu("crPcNotice41A")}
                    >
                      Follow 41A Cr.P.C Notice
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
      {isArrestByPolice && (
        <IntimationOfInterest
          renderFieldsWithDropDown={renderFieldsWithDropDown}
          disabled={viewArrestDetails}
          checkFields={checkFields}
          setPerson={setPerson}
          form={form}
          selectedRecord={selectedRecord?.arrestByPolice?.intimationOfArrest}
        />
      )}
      {isArrestByAnotherPolice && (
        <>
          <IntimationReceived
            renderFieldsWithDropDown={renderFieldsWithDropDown}
            disabled={viewArrestDetails}
            checkFields={checkFields}
            form={form}
          />
          <OtherStateSelected
            renderFieldsWithDropDown={renderFieldsWithDropDown}
            disabled={viewArrestDetails}
            checkFields={checkFields}
            setOtherStateSelected={setOtherStateSelected}
            otherStateSelected={otherStateSelected}
            selectedRecord={selectedRecord}
          />
          {selectedRecord && (
            <PoliceCustodyDetails
              disabled={viewArrestDetails}
              checkFields={checkFields}
            />
          )}
        </>
      )}
      {isArrestOnAnticipatoryBail && (
        <>
          <BailOrderDetails
            renderFieldsWithDropDown={renderFieldsWithDropDown}
            checkFields={checkFields}
            disabled={viewArrestDetails}
            form={form}
            setUploadCourtConditionsUrl={setUploadCourtConditionsUrl}
            bailOrderFileList={bailOrderFileList}
          />
          <Row style={{ marginTop: 20 }}>
            <div
              className="popupLink"
              onClick={() =>
                handleAddedSuretyDetails(suretyDetailsAnticipatoryCount)
              }
            >
              Add Sureties Details
            </div>
          </Row>
          {!isEmpty(suretyDetailsAnticipatoryCount) ? (
            <Row style={{ marginTop: 10 }}>
              <div
                className="popupLink"
                onClick={() =>
                  handleAddedSuretyDetails(suretyDetailsAnticipatoryCount)
                }
              >
                {`${size(suretyDetailsAnticipatoryCount)} Sureties Added`}
              </div>
            </Row>
          ) : null}
        </>
      )}
      {isArrestByPolice && (
        <>
          <Card className="widgetCardStyle" style={{ marginTop: 20 }}>
            {showMedicalExamination && (
              <MedicalExamination
                checkFields={checkFields}
                disabled={viewArrestDetails}
                setIsInjured={setIsInjured}
                isInjured={isInjured}
                form={form}
                selectedRecord={selectedRecord?.arrestByPolice}
                fileList={fileList}
                actionName={actionName}
                disableUpload={disableUpload}
              />
            )}
          </Card>
          {isRapeCase && (
            <>
              <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
                <h6>
                  <b>Rape Case</b>
                </h6>{" "}
                <br />
                {isRapeCase && (
                  <Row glutter={24}>
                    <Col
                      span={6}
                      style={{ marginBottom: 10, paddingRight: 140 }}
                    >
                      <Form.Item
                        name="escortPC"
                        label="Escort PC"
                        rules={[textFieldRules.textFieldMaxLength]}
                        disabled={viewArrestDetails}
                        style={{ width: 200 }}
                      >
                        {renderFieldsWithDropDown(staffMembersList, null, 200)}
                      </Form.Item>
                    </Col>
                    <RCHospitalDetailsForm
                      checkFields={checkFields}
                      disabled={viewArrestDetails}
                    />
                  </Row>
                )}
              </Card>
              {accusedPersonalDetails &&
                accusedPersonalDetails?.personalDetails?.gender ===
                  "Female" && (
                  <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
                    <h6>
                      <b>Female Arrest?</b>
                    </h6>{" "}
                    <br />
                    <Row glutter={24}>
                      <Col span={8} />
                      <Col
                        span={10}
                        style={{ marginBottom: 10, paddingRight: 130 }}
                      >
                        <Form.Item name="officerName" label="Officer name">
                          {renderFieldsWithDropDown(
                            staffMembersList,
                            null,
                            220
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6} style={{ marginBottom: 10 }}>
                        <Form.Item name="rank" label="Rank">
                          {renderFieldsWithDropDown(rankList, null, 220)}
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                )}
            </>
          )}
          <ArrestPersonQuestions
            disabled={viewArrestDetails}
            checkFields={checkFields}
            suretyDetailsArrestByPoliceCount={suretyDetailsArrestByPoliceCount}
            questionDetails={questionDetails}
            setQuestionDetails={setQuestionDetails}
            questionsBoolen={questionsBoolen}
            setQuestionsBoolen={setQuestionsBoolen}
            selectedRecord={selectedRecord}
          />
          <Row style={{ marginTop: 20 }}>
            <div
              className="popupLink"
              onClick={() =>
                handleAddedSuretyDetails(suretyDetailsArrestByPoliceCount)
              }
            >
              Add Sureties Details
            </div>
          </Row>
          {!isEmpty(suretyDetailsArrestByPoliceCount) ? (
            <Row style={{ marginTop: 10 }}>
              <div
                className="popupLink"
                onClick={() =>
                  handleAddedSuretyDetails(suretyDetailsArrestByPoliceCount)
                }
              >
                {`${size(suretyDetailsArrestByPoliceCount)} Sureties Added`}
              </div>
            </Row>
          ) : null}
        </>
      )}
      {isSuretyDetailsModalVisible ? (
        <AddSuretyDetails
          title="Surety Details"
          isModalVisible={isSuretyDetailsModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={suretyDetailsForm}
          checkFields={checkFields}
          disabled={viewArrestDetails || viewSuretyClicked}
          suretyList={selectedSuretyDetails}
          setviewEditObj={setviewEditObj}
          setviewEditObjIndex={setviewEditObjIndex}
          setviewSuretyClicked={setviewSuretyClicked}
          seteditSuretyClicked={seteditSuretyClicked}
          age={age}
          setAge={setAge}
          setIsAddAnotherSuretyDetails={setIsAddAnotherSuretyDetails}
        />
      ) : null}
    </div>
  );
}
