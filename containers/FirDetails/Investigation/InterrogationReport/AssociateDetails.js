/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, Radio } from "antd";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import {
  renderFieldsWithDropDown,
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty, isArray } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { relationNameList } from "@containers/const";
import AddUpdateButton from "./AddUpdateButton";
import AddPerson from "../CommonForms/AddPerson";
import { associateDetailsForm } from "./const";
import TableRecords from "./TableRecords";

export default function AssociateDetails({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  validationFields = [],
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [associateDetailForm] = Form.useForm();
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [showGangFieldsVisible, setShowGangFieldsVisible] = useState(false);

  const checkFields = async () => {
    const values = await associateDetailForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    associateDetailForm.setFieldsValue({
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
    const values = await associateDetailForm.validateFields();
    const result = {
      whetherPartOfAnyGang: values.whetherPartOfAnyGang,
      gang: values.gang,
      person: getPersonDetails(selectedPerson, inputList, []),
      relation: values.relation,
    };
    setDataSource([...dataSource, result]);
    associateDetailForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setShowGangFieldsVisible(false);
    checkFields();
  };

  const updateRecord = async () => {
    const values = await associateDetailForm.validateFields();
    const updatedRecord = {
      whetherPartOfAnyGang: values.whetherPartOfAnyGang,
      gang: values.gang,
      person: getPersonDetails(selectedPerson, inputList, []),
      relation: values.relation,
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
    associateDetailForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    setShowGangFieldsVisible(false);
    checkFields();
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  const editRecords = (item, _index) => {
    if (item?.person) {
      let n1 = getAddPersonFormValues(item?.person);
      setSelectedPerson(n1);
      setShowGangFieldsVisible(item?.whetherPartOfAnyGang);
    } else {
      setSelectedPerson("");
    }

    associateDetailForm.setFieldsValue({
      gang: item.gang,
      person: item?.person?.personalDetails?.name,
      relation: item.relation,
      whetherPartOfAnyGang: item.whetherPartOfAnyGang,
    });
  };

  const columns = [
    {
      title: "Whether part of any Gang",
      dataIndex: "whetherPartOfAnyGang",
      rowKey: "whetherPartOfAnyGang",
      render: (whetherPartOfAnyGang) => (
        <span className="tableRowText wordWrap">
          {whetherPartOfAnyGang ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Gang",
      dataIndex: "gang",
      rowKey: "gang",
      render: (gang) => <span className="tableRowText wordWrap">{gang}</span>,
    },
    {
      title: "Member Name",
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
      title: "Relation",
      dataIndex: "relation",
      rowKey: "relation",
      render: (relation) => (
        <span className="tableRowText wordWrap">{relation}</span>
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
    }
  }, [selectedObjId, selectedRecord]);

  const showGangFields = (e) => {
    const value = e?.target?.value;
    setShowGangFieldsVisible(value);
    checkFields();
  };

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      associateDetails: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      associateDetails: dataSource,
    };
    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={associateDetailForm} layout="vertical">
        <Row gutter={24}>
          <Col span={6} style={{ marginTop: 10 }}>
            <span style={{ fontSize: 16 }}>Whether part of any Gang ?</span>
          </Col>
          <Col span={4} style={{ marginTop: 10 }}>
            <Form.Item name="whetherPartOfAnyGang">
              <Radio.Group onChange={(e) => showGangFields(e)}>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {showGangFieldsVisible ? (
          <Row gutter={24} style={{ marginTop: 20 }}>
            {associateDetailsForm.map((s, i) => {
              const isLabel =
                isArray(validationFields) &&
                validationFields.indexOf(s.label) >= 0;
              return (
                <Col
                  span={8}
                  key={i}
                  style={{ marginBottom: 20, marginTop: 10 }}
                >
                  <Form.Item
                    name={s.name}
                    label={s.label}
                    rules={[{ required: isLabel }]}
                  >
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
            <Col style={{ padding: 10 }}>
              <Form.Item
                name="relation"
                label="Relationship"
                rules={[{ required: true }]}
              >
                {renderFieldsWithDropDown(
                  relationNameList,
                  null,
                  handleSearch,
                  serchText,
                  300,
                  disableForm
                )}
              </Form.Item>
            </Col>
          </Row>
        ) : null}
        <Row>
          <AddUpdateButton
            isEdit={isEdit}
            updateRecord={updateRecord}
            addMoreDetails={addMoreDetails}
            disabled={!formValid || disableForm}
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
