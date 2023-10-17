import { useEffect, useState } from "react";
import {
  Col,
  Form,
  Card,
  Row,
  DatePicker,
  Input,
  Modal,
  Divider,
  Checkbox,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import masterDataActions from "@redux/masterData/actions";
import { config } from "@config/site.config";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import { isUndefined } from "lodash";
import moment from "moment";
import { masterDataType, DATE_FORMAT } from "../../../fir-util";
import { arrestForms } from "../const";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
    width: "100%",
  },
};

export default function IntimationOfInterest(props) {
  const dispatch = useDispatch();
  const {
    renderFieldsWithDropDown,
    disabled,
    checkFields,
    selectedRecord,
    form,
    setPerson,
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personForm] = Form.useForm();
  const [inputList, setInputList] = useState([]);
  const [age, setAge] = useState("");
  const [permanentAddress, setPermanentAddress] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPermanentState, setSelectedPermanentState] = useState("");
  const [resetFiles, setResetFiles] = useState(false);
  const { getRelationTypeList, getModeOfIntemationList } = masterDataActions;
  const { relationTypeList, modeOfIntemationList } = useSelector(
    (state) => state.MasterData
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (selectedRecord?.selectPerson) {
      const {
        personalDetails,
        presentAddress,
        dateCreated,
        _id,
        contactDetails,
        sameAsPresent,
        permanentAddress,
      } = selectedRecord?.selectPerson;
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
      setSelectedState(stateUt);
      setSelectedPermanentState(permanentAddress?.stateUt);
      setPermanentAddress(sameAsPresent);
      form.setFieldsValue({
        selectPerson: (name ? name : "") + " " + (surname ? surname : ""),
      });
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
    }
  }, [selectedRecord]);

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setPerson(values);
    let nameSurname =
      values?.name + " " + (values?.surname ? values?.surname : "");
    form.setFieldsValue({
      selectPerson: nameSurname,
    });
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getRelationTypeList(`${url}/${masterDataType.RELATION_TYPE}`));
    dispatch(
      getModeOfIntemationList(`${url}/${masterDataType.MODE_OF_INTEMATION}`)
    );
  }, []);

  const displayFormItems = (name) => {
    switch (name) {
      case "relationToAccused":
        return renderFieldsWithDropDown(
          relationTypeList,
          null,
          200,
          false,
          disabled
        );
      case "selectPerson":
        return renderFieldsWithDropDown([], null, 200, false, disabled);
      case "modeOfIntimation":
        return renderFieldsWithDropDown(
          modeOfIntemationList,
          null,
          200,
          false,
          disabled
        );
      case "intimatedDate":
        return (
          <DatePicker
            format={DATE_FORMAT}
            style={{ width: 200 }}
            disabled={disabled}
            onChange={checkFields}
          />
        );
      default:
        return <Input disabled={disabled} />;
    }
  };

  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      <h3>
        <b>Arrest Intimation</b>
      </h3>{" "}
      <br />
      <Row glutter={24}>
        {arrestForms.intimationOfArrest.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 10 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                style={{ paddingRight: 20 }}
              >
                {displayFormItems(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span className="linkStyle" onClick={showModal}>
                  {s.actionName}
                </span>
              )}
            </Col>
          );
        })}
      </Row>
      <Modal
        title="Add Person"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        okText="Add"
      >
        <Form form={personForm} layout="vertical">
          <div>
            <Col span={24}>
              <StandardPersonalForm
                colWidth={8}
                changeValue={checkFields}
                disabled={disabled}
                age={age}
                setAge={setAge}
                formName={personForm}
              />
              <Divider />
              <div className="heading">Present Address</div>
              <StandardAddressForm
                colWidth={8}
                changeValue={checkFields}
                disabled={disabled}
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
                      disabled={disabled}
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
                  disabled={disabled}
                  selectedPermanentState={selectedPermanentState}
                  setSelectedPermanentState={setSelectedPermanentState}
                />
              )}
              <Divider />
              <StandardContactForm
                colWidth={8}
                changeValue={checkFields}
                disabled={disabled}
              />
              <Divider />
              <StandardIdentityForm
                colWidth={8}
                changeValue={checkFields}
                setidentityList={setInputList}
                form={personForm}
                currentData={selectedRecord}
                disabled={disabled}
                resetFiles={resetFiles}
                setResetFiles={setResetFiles}
              />
            </Col>
          </div>
        </Form>
      </Modal>
    </Card>
  );
}
