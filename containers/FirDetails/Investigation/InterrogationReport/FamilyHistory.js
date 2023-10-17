/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Row, Card, Col, Form, Input, Divider, Button } from "antd";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import {
  renderFieldsWithDropDown,
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { relationNameList } from "@containers/const";
import {
  familyHistoryForm,
  criminalBackgroundNameList,
  aliveDeadNameList,
} from "./const";
import AddPerson from "../CommonForms/AddPerson";
import AddUpdateButton from "./AddUpdateButton";
import TableRecords from "./TableRecords";

export default function FamilyHistory({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const dispatch = useDispatch();
  const [familyHistorForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    familyHistorForm.setFieldsValue({
      name:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 20 }}>
              <Form.Item name={s.name} label={s.label}>
                {actionName(s.name)}
              </Form.Item>
              {s.actionLink && (
                <span
                  className="linkStyle"
                  onClick={() => setIsModalVisible(true)}
                >
                  {s.actionName}
                </span>
              )}
            </Col>
          );
        })}
      </Row>
    );
  };
  const editRecords = async (item, index) => {
    if (item?.person) {
      let n1 = getAddPersonFormValues(item?.person);
      setSelectedPerson(n1);
    } else {
      setSelectedPerson("");
    }

    familyHistorForm.setFieldsValue({
      relation: item?.relation,
      criminalBackground:
        item?.criminalBackground && item?.criminalBackground === true
          ? "Yes"
          : "No",
      isAlive: item?.isAlive && item?.isAlive === true ? "Alive" : "Dead",
      name: item?.person?.personalDetails?.name,
      familyStayTogether:
        item?.familyStayTogether && item?.familyStayTogether === true
          ? "Yes"
          : "No",
      familyMemberPeculiarity: item?.familyMemberPeculiarity,
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "relation":
        return renderFieldsWithDropDown(
          relationNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "criminalBackground":
        return renderFieldsWithDropDown(
          criminalBackgroundNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "isAlive":
        return renderFieldsWithDropDown(
          aliveDeadNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 300 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm}
          />
        );
    }
  };

  const checkFields = async () => {
    const values = await familyHistorForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await familyHistorForm.validateFields();
    const result = {
      relation: values?.relation,
      criminalBackground: values?.criminalBackground === "Yes" ? true : false,
      isAlive: values?.isAlive === "Alive" ? true : false,
      person: getPersonDetails(selectedPerson, inputList, []),
      name:
        (selectedPerson?.name ? selectedPerson?.name : "") +
        " " +
        (selectedPerson?.surname ? selectedPerson?.surname : ""),
      familyStayTogether: values?.familyStayTogether === "Yes" ? true : false,
      familyMemberPeculiarity: values?.familyMemberPeculiarity,
    };
    setDataSource([...dataSource, result]);
    familyHistorForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    checkFields();
  };

  const updateRecord = async () => {
    const values = await familyHistorForm.validateFields();
    const updatedRecord = {
      relation: values?.relation,
      criminalBackground: values?.criminalBackground === "Yes" ? true : false,
      isAlive: values?.isAlive === "Alive" ? true : false,
      person: getPersonDetails(selectedPerson, inputList, []),
      name:
        (selectedPerson?.name ? selectedPerson?.name : "") +
        " " +
        (selectedPerson?.surname ? selectedPerson?.surname : ""),
      familyStayTogether: values?.familyStayTogether === "Yes" ? true : false,
      familyMemberPeculiarity: values?.familyMemberPeculiarity,
    };
    const updatedObj = {
      ...dataSource[selectedIndex],
      ...updatedRecord,
    };
    const updatedRecords = [
      ...dataSource.slice(0, selectedIndex),
      updatedObj,
      ...dataSource.slice(selectedIndex + 1),
    ];

    setDataSource(updatedRecords);
    familyHistorForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  useEffect(() => {
    if (selectedObjId) {
      familyHistorForm.resetFields();
      setDataSource(selectedRecord);
    }
  }, [selectedObjId, selectedRecord]);

  const columns = [
    {
      title: "Relation Type",
      dataIndex: "relation",
      rowKey: "relation",
      render: (relation) => (
        <span className="tableRowText wordWrap">{relation}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      rowKey: "name",
      render: (_value, item) => {
        const personalDetails = item?.person?.personalDetails;
        const personName = personalDetails?.name
          ? personalDetails?.name
          : " " + personalDetails?.surname
          ? personalDetails?.surname
          : "";
        return <span className="tableRowText wordWrap">{personName}</span>;
      },
    },
    {
      title: "Criminal Background",
      dataIndex: "criminalBackground",
      rowKey: "criminalBackground",
      render: (criminalBackground) => (
        <span className="tableRowText wordWrap">
          {criminalBackground ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Is Alive",
      dataIndex: "isAlive",
      rowKey: "isAlive",
      render: (isAlive) => (
        <span className="tableRowText wordWrap">
          {isAlive ? "Alive" : "Dead"}
        </span>
      ),
    },
    {
      title: "Family Stay Together",
      dataIndex: "familyStayTogether",
      rowKey: "familyStayTogether",
      render: (familyStayTogether) => (
        <span className="tableRowText wordWrap">
          {familyStayTogether ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Family Member Peculiarity",
      dataIndex: "familyMemberPeculiarity",
      rowKey: "familyMemberPeculiarity",
      render: (familyMemberPeculiarity) => (
        <span className="tableRowText wordWrap">{familyMemberPeculiarity}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      rowKey: "actions",
      render: (_value, _item, index) => {
        return (
          <div
            key={index}
            className="updateRecord"
            onClick={() => {
              editRecords(_item, index);
              setIsEdit(true);
              setSelectedIndex(index);
            }}
          >
            Update
          </div>
        );
      },
    },
  ];

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      familyHistory: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      familyHistory: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(`${config.interrogation}/update`, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  const validationFields = {
    personalValidationFields: [
      "Name",
      "Surname",
      "Father/Spouse/Guardian/Mother Name",
      "Gender",
      "Occupation",
      "Caste",
      "Educational Qualification",
      "Age",
    ],
    addressValidationFields: [
      "House No",
      "Ward/Colony",
      "Landmark/Milestone",
      "State/UT",
      "District",
      "Area/Mandal",
      "Locality/Village",
    ],
    contactValidationFields: ["Phone Number"],
    permanentValidationFields: [
      "House No",
      "Ward/Colony",
      "Landmark/Milestone",
      "State/UT",
      "District",
      "Area/Mandal",
      "Locality/Village",
    ],
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={familyHistorForm} layout="vertical">
        {displayState(familyHistoryForm, displayFields)}
        <Col span={24} style={{ padding: 10 }}>
          <Form.Item
            name="familyStayTogether"
            label="Does the family members stay together"
          >
            {renderFieldsWithDropDown(
              criminalBackgroundNameList,
              null,
              handleSearch,
              serchText,
              300,
              disableForm
            )}
          </Form.Item>
        </Col>
        <Col span={24} style={{ padding: 10 }}>
          <Form.Item
            name="familyMemberPeculiarity"
            label="Peculiarities of family members, If any"
          >
            <Input
              onChange={checkFields}
              style={{ width: 300 }}
              maxLength={textFieldRules.maxLength}
              disabled={disableForm}
            />
          </Form.Item>
        </Col>
        <Col style={{ marginBottom: 20, padding: 0 }}>
          <AddUpdateButton
            isEdit={isEdit}
            updateRecord={updateRecord}
            addMoreDetails={addMoreDetails}
            disabled={!formValid || disableForm}
          />
        </Col>
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
            editObj={selectedPerson}
            age={age}
            setAge={setAge}
            validationFields={validationFields}
            identityFieldsStatus={false}
          />
        ) : null}
        {!isEmpty(dataSource) && (
          <div style={{ padding: 10 }}>
            <TableRecords
              dataSource={dataSource}
              columns={columns}
              selectedIndex={selectedIndex}
            />
          </div>
        )}
        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="saveButton"
            size="large"
            icon={<SaveOutlined className="saveButtonIcon" />}
            onClick={submit}
            disabled={disabled || disableForm}
          >
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
