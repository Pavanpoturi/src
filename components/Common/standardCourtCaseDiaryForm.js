/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Row, Col, Form, Radio, Input, Space, Select, Button } from "antd";
import { isUndefined, isEmpty, isNull } from "lodash";
import {
  renderFieldsWithDropDown,
  masterDataType,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import AddPerson from "@containers/FirDetails/Investigation/CommonForms/AddPerson";
import { rankNameList } from "@containers/FirDetails/CourtAndProsecution/const";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { config } from "@config/site.config";
import { CaretDownOutlined } from "@ant-design/icons";
import moment from "moment";
const Option = Select.Option;

export default function StandardCourtCaseDiaryForm({
  form,
  disableForm,
  setSelectedPerson,
  age,
  setAge,
  setInputList,
  serchText,
  handleSearch,
  setIODetails,
  caseDiaryData,
  ioPresent,
  setIOPresent,
  ppPresent,
  setPPPresent,
  defenseCounsel,
  setDefenseCounsel,
  setRank,
}) {
  const [personForm] = Form.useForm();
  const selectedFir = loadState("selectedFir");
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const { getStaffList } = masterDataActions;
  const { staffList } = useSelector((state) => state.MasterData);

  useEffect(() => {
    dispatch(getStaffList(`${config.getMasterData}/${masterDataType.STAFF}`));
  }, [dispatch]);

  useEffect(() => {
    if (!!caseDiaryData ? Object.keys(caseDiaryData)?.length !== 0 : false) {
      const iODetatils = staffList?.find(
        (item) => item?.paoCode === caseDiaryData?.ioCode
      );
      if (!!setIODetails) {
        setIODetails(!!iODetatils ? iODetatils : {});
        setRank(iODetatils?.rankName);
      }
      setSelectedPerson(caseDiaryData?.personDefenseCounsel);
      setIsModalVisible(false);
      setIOPresent(caseDiaryData?.isIOPresent);
      setPPPresent(caseDiaryData?.isPPPresent);
      setDefenseCounsel(caseDiaryData?.isDefenseCounselPresent);
      form.setFieldsValue({
        IOName: caseDiaryData?.ioCode,
      });
      const { personalDetails = {} } =
        !isNull(caseDiaryData?.personDefenseCounsel) &&
        !isUndefined(caseDiaryData?.personDefenseCounsel) &&
        caseDiaryData?.personDefenseCounsel;
      if (!isEmpty(personalDetails)) {
        const { name = "", surname = "" } = personalDetails;
        form.setFieldsValue({
          defenseCouncilName: `${name} ${surname}`,
        });
      }
      if (
        !isUndefined(caseDiaryData?.personDefenseCounsel) &&
        !isNull(caseDiaryData?.personDefenseCounsel) &&
        !isEmpty(caseDiaryData?.personDefenseCounsel)
      ) {
        const {
          personalDetails,
          presentAddress,
          dateCreated,
          _id,
          contactDetails,
          sameAsPresent,
          permanentAddress,
        } = caseDiaryData?.personDefenseCounsel;
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
          relationType,
          fatherHusbandGuardianName,
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
        personForm.setFieldsValue({
          lastupdateddatetime: moment(new Date(dateCreated)).isValid()
            ? moment(new Date(dateCreated))
            : "",
          id: _id,
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
        });
        setSelectedPerson(caseDiaryData?.personDefenseCounsel);
      }
    }
  }, [caseDiaryData]);

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    setIsModalVisible(false);
    form.setFieldsValue({
      defenseCouncilName:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const checkFields = async () => {
    const values = await form.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleSelect = (data) => {
    const iODetatils = staffList?.find((item) => item?.paoCode === data);
    setIODetails(iODetatils);
    setRank(iODetatils?.rankName);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row gutter={24} style={{ marginTop: 20 }}>
        <Col span={5}>
          <p style={{ fontSize: 16 }}>IO present?</p>
        </Col>
        <Col span={4}>
          <Form.Item name="presentIO">
            <Radio.Group
              buttonStyle="solid"
              disabled={disableForm}
              onChange={(e) => setIOPresent(e.target.value)}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {ioPresent === "Yes" ? (
          <>
            <Col span={5}>
              <Form.Item name="IOName">
                <Select
                  suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
                  showSearch
                  allowClear
                  showArrow
                  onSearch={handleSearch}
                  onChange={(data) => handleSelect(data)}
                  style={{ width: 230 }}
                  disabled={true}
                  placeholder="Name of the IO"
                  defaultValue={selectedFir?.briefFacts?.ioAssignedName}
                >
                  <Option label={selectedFir?.briefFacts?.ioAssignedName}>
                    {selectedFir?.briefFacts?.ioAssignedName}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Input
                style={{ width: 230, fontWeight: "bold", fontSize: 16 }}
                disabled={true}
                value={selectedFir?.briefFacts?.ioAssignedRank}
              />
            </Col>
          </>
        ) : null}
      </Row>
      <Row gutter={24}>
        <Col span={5}>
          <p style={{ fontSize: 16 }}>PP Present?</p>
        </Col>
        <Col span={4}>
          <Form.Item name="presentPP">
            <Radio.Group
              disabled={disableForm}
              onChange={(e) => setPPPresent(e.target.value)}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {ppPresent === "Yes" ? (
          <>
            <Col span={5}>
              <Form.Item name="APPOName">
                <Input
                  onChange={checkFields}
                  disabled={disableForm}
                  style={{ width: 230 }}
                  placeholder="Name of the APPO"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="rank">
                {renderFieldsWithDropDown(
                  rankNameList,
                  null,
                  handleSearch,
                  serchText,
                  230,
                  disableForm,
                  "",
                  "Select Rank"
                )}
              </Form.Item>
            </Col>
          </>
        ) : null}
      </Row>
      <Row gutter={24}>
        <Col span={5}>
          <p style={{ fontSize: 16 }}>Defense Counsel Present?</p>
        </Col>
        <Col span={4}>
          <Form.Item name="defenseCounselPresent">
            <Radio.Group
              disabled={disableForm}
              onChange={(e) => setDefenseCounsel(e.target.value)}
            >
              <Radio value={"Yes"}>Yes</Radio>
              <Radio value={"No"}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
        {defenseCounsel === "Yes" ? (
          <>
            <Col span={4}>
              <Form.Item name="defenseCouncilName">
                <Input
                  onChange={checkFields}
                  disabled={true}
                  style={{ width: 230 }}
                  placeholder="Name of Defense Council"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <div
                class="linkStyle"
                onClick={() => setIsModalVisible(true)}
                style={{
                  color: "#02599C",
                  cursor: "pointer",
                  marginLeft: 55,
                  fontSize: 16,
                  marginTop: 3,
                }}
              >
                Add Person
              </div>
            </Col>
          </>
        ) : null}
      </Row>
      {isModalVisible ? (
        <AddPerson
          title="Add Person Details"
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          formName={personForm}
          checkFields={checkFields}
          disabled={disableForm}
          setInputList={setInputList}
          editObj={null}
          age={age}
          setAge={setAge}
        />
      ) : null}
    </Space>
  );
}
