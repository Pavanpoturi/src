import { useState, useEffect } from "react";
import { Form, Input, Row, Col, Card, Select, DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { CaretDownOutlined } from "@ant-design/icons";
import { config } from "@config/site.config";
import moment from "moment";
import { isEmpty, isUndefined } from "lodash";
import AddProfessional from "@containers/FirDetails/Investigation/CommonForms/AddProfessional";
import {
  witnessTypeOptions,
  officialWitnessSubType,
  panchWitnessSubtype,
  relationNameList,
  recordedAtPlace,
} from "@containers/const";
import {
  getStaffsDetails,
  masterDataType,
  getPersonDetails,
  DATE_TIME_FORMAT,
} from "@containers/FirDetails/fir-util";
import {
  textFieldRules,
  witnessDetailsSet1,
  witnessDetailsSet2,
  witnessDetailsSet2Panch,
  witnessDetailsBaseForm,
} from "./formOptions";
import { setRules, disableFutureDates } from "./helperMethods";

const Option = Select.Option;

const optionType = {
  WITNESS_STRENGTH: "WITNESS_STRENGTH",
  WITNESSCATEGORY: "WITNESS_CATEGORY",
  STATEMENTRECORDEDBY: "STATEMENT_RECORDED_BY",
};

export default function StandardWitnessDetailsForm({
  showMoreOption,
  changeValue,
  disabled,
  selectedWitnessType,
  setSelectedWitnessType,
  selectedPlaceOfRecordings,
  setSelectedPlaceOfRecordings,
  formName,
  selectedstatementRecordedBy,
  setSelectedstatementRecordedBy,
  setProfessionalDetails,
  professionalForm,
  selectedSubTypeWitness,
  setSelectedSubTypeWitness,
  selectedSubTypePanchWitness,
  setSelectedSubTypePanchWitness,
  selectedRecord,
  showFormFields,
}) {
  const [serchText, setSerchText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showFormField, setShowFormFiled] = useState(true);
  const [showReExaminatioFormField, setShowReExaminatioFormField] =
    useState(true);
  const [reExaminationData, setReExaminationData] = useState([]);
  const [reExaminationObj, setReExaminationObj] = useState({});
  const { savedFir } = useSelector((state) => state.createFIR);
  const [isProfessionalModalVisible, setIsProfessionalModalVisible] =
    useState(false);
  const dispatch = useDispatch();
  const isOfficialWitnessOrExpert =
    selectedWitnessType === "Official witnesses / Experts";
  const isPanchWitness = selectedWitnessType === "Panch witness";

  const subTypeList = [
    "FIR issued SHO",
    "Investigating Officer",
    "Lady Medical officer",
    "Medical Certificate doctor",
    "Motor vehicle Inspector",
    "M R O / Tahsildar",
    "Potency doctor",
    "PME doctor",
  ];

  useEffect(() => {
    if (
      selectedSubTypeWitness !== "" &&
      subTypeList.includes(selectedSubTypeWitness)
    ) {
      setShowFormFiled(false);
    } else {
      setShowFormFiled(true);
    }
    if (showFormFields === false) {
      setShowReExaminatioFormField(false);
    } else {
      setShowReExaminatioFormField(true);
    }
    if (selectedRecord !== 0 && !!selectedRecord === true) {
      setReExaminationData(selectedRecord);
    } else {
      setReExaminationData([]);
    }
  }, [selectedSubTypeWitness, selectedRecord]);

  const getVictimList = () => {
    let list = [];
    savedFir &&
      !isUndefined(savedFir?.victimDetails) &&
      !isEmpty(savedFir?.victimDetails) &&
      // eslint-disable-next-line array-callback-return
      savedFir?.victimDetails.map((item) => {
        const { person } = item;
        const result = {
          label: `${person?.personalDetails?.name || ""} ${
            person?.personalDetails?.surname || ""
          }`,
          _id: person?._id,
          permanentAddress: person?.permanentAddress,
          personalDetails: person?.personalDetails,
          presentAddress: person?.presentAddress,
          contactDetails: person?.contactDetails,
        };
        list.push(result);
      });
    return list;
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const { witnessStrengthList, statementRecordList, witnessCategoryList } =
    useSelector((state) => state.MasterData);
  const { staffList } = useSelector((state) => state.MasterData);
  const {
    getStaffList,
    getWitnessStrengthList,
    getStatementRecords,
    getWitnessCategories,
  } = masterDataActions;
  const staffMembersList = staffList && getStaffsDetails(staffList);

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getWitnessStrengthList(`${url}/${optionType.WITNESS_STRENGTH}`));
    dispatch(getWitnessCategories(`${url}/${optionType.WITNESSCATEGORY}`));
    dispatch(getStatementRecords(`${url}/${optionType.STATEMENTRECORDEDBY}`));
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  }, [dispatch]);

  const handleProfessionalOk = async () => {
    const values = await professionalForm.validateFields();
    const professionalDetails = getPersonDetails(values, []);
    let { personalDetails } = professionalDetails;
    personalDetails.createdFrom = "Witness Examination";
    personalDetails.createdFor = "Professional";
    setProfessionalDetails(professionalDetails);
    formName.setFieldsValue({
      statementRecordedByOther:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsProfessionalModalVisible(false);
  };

  const handleProfessionalCancel = () => {
    setIsProfessionalModalVisible(false);
  };

  const renderFieldsWithDropDown = (menuOptions, selectAction, mode = "") => {
    return (
      <Select
        suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
        showSearch
        onSearch={handleSearch}
        style={{ width: 250 }}
        filterOption={(input, option) =>
          serchText &&
          option?.props?.label
            ?.toString()
            ?.toLowerCase()
            ?.indexOf(input.toString().toLowerCase()) >= 0
        }
        onSelect={(item) => {
          selectAction && selectAction(item);
        }}
        disabled={disabled}
        mode={mode}
      >
        {menuOptions &&
          menuOptions.length &&
          menuOptions.map((item, index) => (
            <Option key={index} value={item.label} label={item.label}>
              {item.label}
            </Option>
          ))}
      </Select>
    );
  };

  const displayFormItems = (name) => {
    switch (name) {
      case "typeOfWitness":
        return renderFieldsWithDropDown(
          witnessTypeOptions,
          setSelectedWitnessType
        );
      case "categoryOfWitness":
        return renderFieldsWithDropDown(witnessCategoryList, null);
      case "statementRecordedBy":
        return renderFieldsWithDropDown(
          statementRecordList,
          setSelectedstatementRecordedBy
        );
      case "recordedOnDatetime":
        return (
          <DatePicker
            disabledDate={disableFutureDates}
            format={DATE_TIME_FORMAT}
            showTime={true}
            style={{ width: 250 }}
            disabled={disabled}
          />
        );
      case "selectScribe":
        return renderFieldsWithDropDown(staffMembersList, null);
      case "relationToVictim":
        return renderFieldsWithDropDown(relationNameList, null);
      case "selectVictim":
        return renderFieldsWithDropDown(getVictimList(), null);
      case "strengthOfWitness":
        return renderFieldsWithDropDown(witnessStrengthList, null);
      default:
        return (
          <Input
            onChange={changeValue}
            maxLength={textFieldRules.maxLength}
            disabled={disabled || name === "witnessCode"}
            style={{ width: 250 }}
          />
        );
    }
  };

  const handleChange = async (data, name, i) => {
    var reExaminationValues = JSON.parse(JSON.stringify(reExaminationData));
    if (showReExaminatioFormField === true && reExaminationData.length !== 0) {
      Object.assign(reExaminationValues[i], { [name]: data });
      reExaminationValues.splice(i, 1, reExaminationValues[i]);
      setReExaminationData(reExaminationValues);
      changeValue(reExaminationValues);
    } else {
      const values = { ...reExaminationObj };
      setReExaminationObj({ ...values, [name]: data });
      changeValue({ ...values, [name]: data }, reExaminationValues);
    }
  };

  return (
    <div>
      <Row
        gutter={24}
        className={!showMore && showMoreOption ? "showLess" : ""}
      >
        {witnessDetailsBaseForm.map((s, i) => {
          const isLabel = s.label === "Type Of Witness";
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[...setRules(s.type), { required: isLabel }]}
              >
                {displayFormItems(s.name)}
              </Form.Item>
            </Col>
          );
        })}
        {isOfficialWitnessOrExpert ? (
          <Col span={8} style={{ marginBottom: 10 }}>
            <Form.Item name="subTypeOfWitness" label="SubType Of Witness">
              {renderFieldsWithDropDown(
                officialWitnessSubType,
                setSelectedSubTypeWitness
              )}
            </Form.Item>
          </Col>
        ) : null}

        {isPanchWitness ? (
          <Col span={8} style={{ marginBottom: 10 }}>
            <Form.Item name="panchSubTypeOfWitness" label="SubType Of Witness">
              {renderFieldsWithDropDown(
                panchWitnessSubtype,
                setSelectedSubTypePanchWitness,
                "multiple"
              )}
            </Form.Item>
          </Col>
        ) : null}

        {showFormField && showReExaminatioFormField ? (
          <>
            {witnessDetailsSet1.map((s, i) => {
              const isLabel = s.label === "Statement Recorded by";
              return (
                <Col span={8} key={i} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name={s.name}
                    label={s.label}
                    rules={[setRules(s.type), { required: isLabel }]}
                  >
                    {displayFormItems(s.name)}
                  </Form.Item>
                </Col>
              );
            })}{" "}
          </>
        ) : (
          ""
        )}
        {selectedstatementRecordedBy === "Any Other" ? (
          <Col span={8} style={{ marginBottom: 10 }}>
            <Form.Item
              name="statementRecordedByOther"
              label="Statement Recorded by Other"
            >
              {renderFieldsWithDropDown([], null)}
            </Form.Item>
            <div
              className="linkStyle"
              onClick={() => setIsProfessionalModalVisible(true)}
            >
              Add Professional
            </div>
          </Col>
        ) : null}
        {showFormField && showReExaminatioFormField ? (
          <>
            <Col span={8} style={{ marginBottom: 10 }}>
              <Form.Item
                name="recordedAtPlace"
                label="Place of Recording Statement"
              >
                {renderFieldsWithDropDown(
                  recordedAtPlace,
                  setSelectedPlaceOfRecordings
                )}
              </Form.Item>
            </Col>{" "}
          </>
        ) : (
          ""
        )}
        {selectedPlaceOfRecordings === "Others" ? (
          <Col span={8} style={{ marginBottom: 10 }}>
            <Form.Item
              name="anyOtherPlace"
              label="Any Other Place (Please Specify)"
            >
              <Input
                onChange={changeValue}
                maxLength={textFieldRules.maxLength}
                disabled={disabled}
                style={{ width: 250 }}
              />
            </Form.Item>
          </Col>
        ) : null}
        {showFormField && showReExaminatioFormField ? (
          <>
            {selectedWitnessType === "Panch witness" ? (
              <>
                {witnessDetailsSet2Panch.map((s, i) => {
                  return (
                    <Col span={8} key={i} style={{ marginBottom: 10 }}>
                      <Form.Item
                        name={s.name}
                        label={s.label}
                        rules={setRules(s.type)}
                      >
                        {displayFormItems(s.name)}
                      </Form.Item>
                    </Col>
                  );
                })}
              </>
            ) : (
              <>
                {witnessDetailsSet2.map((s, i) => {
                  const isLabel =
                    s.label === "Date & Time of Recording Statement";
                  if (
                    (isOfficialWitnessOrExpert &&
                      s.name === "recordedOnDatetime") ||
                    (isOfficialWitnessOrExpert &&
                      s.name === "strengthOfWitness")
                  ) {
                    return (
                      <Col span={8} key={i} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name={s.name}
                          label={s.label}
                          rules={setRules(s.type)}
                        >
                          {displayFormItems(s.name)}
                        </Form.Item>
                      </Col>
                    );
                  } else if (
                    selectedWitnessType !== "Official witnesses / Experts"
                  ) {
                    const isLabel =
                      s.label === "Date & Time of Recording Statement";
                    return (
                      <Col span={8} key={i} style={{ marginBottom: 10 }}>
                        <Form.Item
                          name={s.name}
                          label={s.label}
                          rules={[...setRules(s.type), { required: isLabel }]}
                        >
                          {displayFormItems(s.name)}
                        </Form.Item>
                      </Col>
                    );
                  }
                })}
              </>
            )}
          </>
        ) : (
          ""
        )}
        <div>
          {showReExaminatioFormField === true ? (
            <>
              {reExaminationData.length !== 0 ? (
                <>
                  <Row gutter={24}>
                    <Col
                      span={24}
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        marginLeft: 20,
                      }}
                    >
                      Re Examination Details
                    </Col>
                  </Row>
                  {reExaminationData?.map((data, i) => {
                    console.log("reExaminationData", reExaminationData);
                    return (
                      <Card
                        className="card-style"
                        style={{
                          margin: "17px",
                          width: "95%",
                          marginBottom: "10px",
                        }}
                      >
                        <Row gutter={24}>
                          <Col span={8}>
                            <Form.Item label="Proceeding No.">
                              <Input
                                onChange={(event) =>
                                  handleChange(
                                    event.target.value,
                                    "proceedingNo",
                                    i
                                  )
                                }
                                style={{ width: 222 }}
                                maxLength={textFieldRules.maxLength}
                                value={data?.proceedingNo}
                                disabled={disabled}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Proceeding Date">
                              <DatePicker
                                format={DATE_TIME_FORMAT}
                                placeholder="Select Date & Time"
                                onChange={(event) =>
                                  handleChange(event, "proceedingDate", i)
                                }
                                value={
                                  moment(
                                    new Date(data?.proceedingDate)
                                  ).isValid()
                                    ? moment(new Date(data?.proceedingDate))
                                    : ""
                                }
                                style={{ width: 222 }}
                                disabled={disabled}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Reasons for Re-examination">
                              <Input
                                onChange={(event) =>
                                  handleChange(event.target.value, "reason", i)
                                }
                                style={{ width: 222 }}
                                value={data?.reason}
                                maxLength={textFieldRules.maxLength}
                                disabled={disabled}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Date & Time of Recording Statement">
                              <DatePicker
                                format={DATE_TIME_FORMAT}
                                placeholder="Select Date & Time"
                                onChange={(event) =>
                                  handleChange(event, "recordingStmtDate", i)
                                }
                                style={{ width: 222 }}
                                value={
                                  moment(
                                    new Date(data?.recordingStmtDate)
                                  ).isValid()
                                    ? moment(new Date(data?.recordingStmtDate))
                                    : ""
                                }
                                disabled={disabled}
                              />
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Statement Recorded by">
                              <Select
                                suffixIcon={
                                  <CaretDownOutlined className="dropDownIcon" />
                                }
                                showSearch
                                onSearch={handleSearch}
                                value={data?.stmtRecordedBy}
                                style={{ width: 250 }}
                                filterOption={(input, option) =>
                                  serchText &&
                                  option?.props?.label
                                    ?.toString()
                                    ?.toLowerCase()
                                    ?.indexOf(input.toString().toLowerCase()) >=
                                    0
                                }
                                onSelect={(item) => {
                                  handleChange(item, "stmtRecordedBy", i);
                                }}
                                disabled={disabled}
                              >
                                {statementRecordList &&
                                  statementRecordList.length &&
                                  statementRecordList.map((item, index) => (
                                    <Option
                                      key={index}
                                      value={item.label}
                                      label={item.label}
                                    >
                                      {item.label}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="Strength of Witness">
                              <Select
                                suffixIcon={
                                  <CaretDownOutlined className="dropDownIcon" />
                                }
                                showSearch
                                onSearch={handleSearch}
                                value={data?.strengthOfWitness}
                                style={{ width: 250 }}
                                filterOption={(input, option) =>
                                  serchText &&
                                  option?.props?.label
                                    ?.toString()
                                    ?.toLowerCase()
                                    ?.indexOf(input.toString().toLowerCase()) >=
                                    0
                                }
                                onSelect={(data) =>
                                  handleChange(data, "strengthOfWitness", i)
                                }
                                disabled={disabled}
                              >
                                {witnessStrengthList &&
                                  witnessStrengthList.length &&
                                  witnessStrengthList.map((item, index) => (
                                    <Option
                                      key={index}
                                      value={item.label}
                                      label={item.label}
                                    >
                                      {item.label}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            <>
              <Row gutter={24}>
                <Col
                  span={24}
                  style={{ fontSize: 16, fontWeight: "bold", marginLeft: 20 }}
                >
                  Re Examination Details
                </Col>
              </Row>
              <Card
                className="card-style"
                style={{ margin: "17px", width: "95%", marginBottom: "10px" }}
              >
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="Proceeding No.">
                      <Input
                        onChange={(event) =>
                          handleChange(event.target.value, "proceedingNo")
                        }
                        style={{ width: 222 }}
                        maxLength={textFieldRules.maxLength}
                        value={reExaminationObj?.proceedingNo}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Proceeding Date">
                      <DatePicker
                        format={DATE_TIME_FORMAT}
                        placeholder="Select Date & Time"
                        onChange={(event) =>
                          handleChange(event, "proceedingDate")
                        }
                        value={
                          moment(
                            new Date(reExaminationObj?.proceedingDate)
                          ).isValid()
                            ? moment(new Date(reExaminationObj?.proceedingDate))
                            : ""
                        }
                        style={{ width: 222 }}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Reasons for Re-examination">
                      <Input
                        onChange={(event) =>
                          handleChange(event.target.value, "reason")
                        }
                        style={{ width: 222 }}
                        value={reExaminationObj?.reason}
                        maxLength={textFieldRules.maxLength}
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Date & Time of Recording Statement">
                      <DatePicker
                        format={DATE_TIME_FORMAT}
                        placeholder="Select Date & Time"
                        onChange={(event) =>
                          handleChange(event, "recordingStmtDate")
                        }
                        style={{ width: 222 }}
                        value={
                          moment(
                            new Date(reExaminationObj?.recordingStmtDate)
                          ).isValid()
                            ? moment(
                                new Date(reExaminationObj?.recordingStmtDate)
                              )
                            : ""
                        }
                        disabled={disabled}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      // name="stmtRecordedBy"
                      label="Statement Recorded by"
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        value={reExaminationObj?.stmtRecordedBy}
                        style={{ width: 250 }}
                        filterOption={(input, option) =>
                          serchText &&
                          option?.props?.label
                            ?.toString()
                            ?.toLowerCase()
                            ?.indexOf(input.toString().toLowerCase()) >= 0
                        }
                        onSelect={(item) => {
                          handleChange(item, "stmtRecordedBy");
                        }}
                        disabled={disabled}
                      >
                        {statementRecordList &&
                          statementRecordList.length &&
                          statementRecordList.map((item, index) => (
                            <Option
                              key={index}
                              value={item.label}
                              label={item.label}
                            >
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      // name="strengthOfWitness"
                      label="Strength of Witness"
                    >
                      <Select
                        suffixIcon={
                          <CaretDownOutlined className="dropDownIcon" />
                        }
                        showSearch
                        onSearch={handleSearch}
                        value={reExaminationObj?.strengthOfWitness}
                        style={{ width: 250 }}
                        filterOption={(input, option) =>
                          serchText &&
                          option?.props?.label
                            ?.toString()
                            ?.toLowerCase()
                            ?.indexOf(input.toString().toLowerCase()) >= 0
                        }
                        onSelect={(data) =>
                          handleChange(data, "strengthOfWitness")
                        }
                        disabled={disabled}
                      >
                        {witnessStrengthList &&
                          witnessStrengthList.length &&
                          witnessStrengthList.map((item, index) => (
                            <Option
                              key={index}
                              value={item.label}
                              label={item.label}
                            >
                              {item.label}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
      </Row>
      {isProfessionalModalVisible ? (
        <AddProfessional
          title="Add Professional Details"
          isModalVisible={isProfessionalModalVisible}
          handleOk={handleProfessionalOk}
          handleCancel={handleProfessionalCancel}
          formName={professionalForm}
          checkFields={changeValue}
          disabled={disabled}
        />
      ) : null}
      {showMoreOption && !showMore && (
        <div onClick={() => setShowMore(true)} className="linkStyle">
          more details
        </div>
      )}
    </div>
  );
}
