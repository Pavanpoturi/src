/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, Radio } from "antd";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import {
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { localContactsForm } from "./const";
import TableRecords from "./TableRecords";
import { isEmpty } from "lodash";
import AddUpdateButton from "./AddUpdateButton";
import AddPerson from "../CommonForms/AddPerson";

export default function LocalContacts({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  editInterrogationObj,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localContactForm] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [radioValue, setRadioValue] = useState();

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);
  useEffect(() => {
    localContactForm.setFieldsValue({
      whetherLocalContacts: editInterrogationObj?.whetherLocalContacts,
    });
    setRadioValue(editInterrogationObj?.whetherLocalContact);
  }, [editInterrogationObj]);
  const checkFields = async () => {
    const values = await localContactForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    localContactForm.setFieldsValue({
      person:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const addMoreDetails = async () => {
    const values = await localContactForm.validateFields();
    const result = {
      whetherLocalContacts: values.whetherLocalContacts,
      town: values.town,
      psLimits: values.psLimits,
      person: getPersonDetails(selectedPerson, inputList, []),
      address: values.address,
    };
    setDataSource([...dataSource, result]);
    localContactForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    checkFields();
  };

  const editRecords = (item, index) => {
    const selectedRecord = dataSource[index];
    if (item?.person) {
      let n1 = getAddPersonFormValues(item?.person);
      setSelectedPerson(n1);
    } else {
      setSelectedPerson("");
    }
    setRadioValue(selectedRecord.whetherLocalContacts);
    if (selectedRecord) {
      localContactForm.setFieldsValue({
        whetherLocalContacts: selectedRecord.whetherLocalContacts,
        town: selectedRecord.town,
        psLimits: selectedRecord.psLimits,
        person: item?.person?.personalDetails?.name,
        address: selectedRecord.address,
      });
    }
  };

  const updateRecord = async () => {
    const values = await localContactForm.validateFields();
    const updatedRecord = {
      whetherLocalContacts: values.whetherLocalContacts,
      town: values.town,
      psLimits: values.psLimits,
      person: getPersonDetails(selectedPerson, inputList, []),
      address: values.address,
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
    localContactForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Town / City / Village",
      dataIndex: "town",
      rowKey: "town",
      render: (town) => <span className="tableRowText wordWrap">{town}</span>,
    },
    {
      title: "In which PS Jurisdiction",
      dataIndex: "psLimits",
      rowKey: "psLimits",
      render: (psLimits) => (
        <span className="tableRowText wordWrap">{psLimits}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "person",
      rowKey: "person",
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
      title: "Address",
      dataIndex: "address",
      rowKey: "address",
      render: (address) => (
        <span className="tableRowText wordWrap">{address}</span>
      ),
    },
    {
      title: "Whether any Local Contacts",
      dataIndex: "whetherLocalContacts",
      rowKey: "whetherLocalContacts",
      render: (whetherLocalContacts) => (
        <span className="tableRowText wordWrap">
          {whetherLocalContacts ? "Yes" : "No"}
        </span>
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

  useEffect(() => {
    if (selectedObjId) {
      setDataSource(selectedRecord);
    } else {
      localContactForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      localContacts: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      localContacts: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  const validationFields = {
    personalValidationFields: [
      "Name",
      "Surname",
      "Father/Spouse/Guardian/Mother Name",
      "Date & Time Of Seizure",
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
      <Form form={localContactForm} layout="vertical">
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="whetherLocalContacts"
              label="Whether any Local Contacts?"
              style={{ marginLeft: 10 }}
            >
              <Radio.Group
                onChange={(e) => setRadioValue(e.target.value)}
                disabled={disableForm}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          {radioValue &&
            localContactsForm.map((s, i) => {
              return (
                <Col span={8} key={i} style={{ marginBottom: 20 }}>
                  <Form.Item name={s.name} label={s.label}>
                    <Input
                      onChange={checkFields}
                      style={{ width: 300 }}
                      maxLength={textFieldRules.maxLength}
                      disabled={disableForm}
                    />
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
          <AddUpdateButton
            isEdit={isEdit}
            updateRecord={updateRecord}
            addMoreDetails={addMoreDetails}
            disabled={disableForm}
          />
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
            disabled={disabled || isEmpty(dataSource) || disableForm}
          >
            SAVE
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
