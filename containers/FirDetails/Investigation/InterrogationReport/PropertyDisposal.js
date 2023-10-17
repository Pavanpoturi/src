/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import {
  renderFieldsWithDropDown,
  getPersonDetails,
  getAccuseds,
  accusedLists,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { CaretDownOutlined } from "@ant-design/icons";
import {
  disposalOfPropertyForm,
  disposedByList,
  disposableType,
} from "./const";
import AddPerson from "../CommonForms/AddPerson";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";

const Option = Select.Option;

export default function PropertyDisposal({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  suspectAccusedList,
}) {
  const dispatch = useDispatch();
  const [propertyDisposalForm] = Form.useForm();
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [addPersonForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [serchText, setSerchText] = useState("");
  const [addPersonModalVisible, setAddPersonModalVisible] = useState(false);
  const [addPersonInputList, setAddPersonInputList] = useState([]);
  const [addPersonage, setAddPersonAge] = useState("");
  const [addPerson, setAddPerson] = useState("");
  const [selectType, setSelectType] = useState("");

  const getDropdownData = () => {
    if (selectType === "Accused" || selectType === "Co-Accused") {
      return getAccuseds(accusedLists(suspectAccusedList));
    } else {
      return [];
    }
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await propertyDisposalForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    propertyDisposalForm.setFieldsValue({
      receiver:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setIsModalVisible(false);
  };

  const handleAddPerson = async () => {
    const values = await addPersonForm.validateFields();
    setAddPerson(values);
    propertyDisposalForm.setFieldsValue({
      disposedPerson:
        (values?.name ? values?.name : "") +
        " " +
        (values?.surname ? values?.surname : ""),
    });
    setAddPersonModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setAddPersonModalVisible(false);
  };

  const addMoreDetails = async () => {
    const values = await propertyDisposalForm.validateFields();
    const result = {
      disposedType: values.disposedType,
      disposedPerson: values.disposedPerson,
      disposedBy: values.disposedBy,
      receiver: getPersonDetails(selectedPerson, inputList, []),
      selectPerson: getPersonDetails(addPerson, addPersonInputList, []),
      address: values.address,
      other: values.other,
    };
    setDataSource([...dataSource, result]);
    propertyDisposalForm.resetFields();
    personForm.resetFields();
    addPersonForm.resetFields();
    setSelectedPerson("");
    setAddPerson("");
    setSelectType("");
    checkFields();
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  useEffect(() => {
    if (addPersonModalVisible === true) {
      addPersonForm.setFieldsValue(addPerson);
    }
  }, [addPersonModalVisible]);

  const editRecords = (item, index) => {
    const values = dataSource[index];
    setSelectType(item?.disposedType);
    if (item?.receiver || item?.selectPerson) {
      let n1 = getAddPersonFormValues(item?.receiver);
      let n2 = getAddPersonFormValues(item?.selectPerson);
      setSelectedPerson(n1);
      setAddPerson(n2);
    } else {
      setSelectedPerson("");
      setAddPerson("");
    }
    if (values) {
      propertyDisposalForm.setFieldsValue({
        disposedType: values.disposedType,
        disposedPerson: values.disposedPerson,
        disposedBy: values.disposedBy,
        receiver: item?.receiver?.personalDetails?.name,
        address: values.address,
        other: values.other,
      });
    }
  };

  const updateRecord = async () => {
    const values = await propertyDisposalForm.validateFields();
    const updatedRecord = {
      disposedType: values.disposedType,
      disposedPerson: values.disposedPerson,
      disposedBy: values.disposedBy,
      receiver: getPersonDetails(selectedPerson, inputList, []),
      selectPerson: getPersonDetails(addPerson, addPersonInputList, []),
      address: values.address,
      other: values.other,
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
    propertyDisposalForm.resetFields();
    personForm.resetFields();
    addPersonForm.resetFields();
    setSelectedPerson("");
    setSelectType("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Disposed Type",
      dataIndex: "disposedType",
      rowKey: "disposedType",
      render: (disposedType) => (
        <span className="tableRowText wordWrap">{disposedType}</span>
      ),
    },
    {
      title: "Disposed Person",
      dataIndex: "disposedPerson",
      rowKey: "disposedPerson",
      render: (disposedPerson) => (
        <span className="tableRowText wordWrap">{disposedPerson}</span>
      ),
    },
    {
      title: "How Disposed",
      dataIndex: "disposedBy",
      rowKey: "disposedBy",
      render: (disposedBy) => (
        <span className="tableRowText wordWrap">{disposedBy}</span>
      ),
    },
    {
      title: "Receiver Name",
      dataIndex: "receiver",
      rowKey: "receiver",
      render: (_value, item) => {
        const personalDetails = item?.receiver?.personalDetails;
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

  const displayState = (data, actionName) => {
    return data.map((s, i) => {
      return (
        <Col span={6} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
          {s.actionLink && (
            <span
              className="linkStyle"
              onClick={() => {
                if (s.name === "receiver") {
                  setIsModalVisible(true);
                } else if (s.name === "disposedPerson") {
                  setAddPersonModalVisible(true);
                }
              }}
            >
              {selectType === "Relative" || selectType === "Friend"
                ? s.actionName
                : null}
              {s.actionname}
            </span>
          )}
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "disposedType":
        return renderFieldsWithDropDown(
          disposableType,
          (value) => {
            setSelectType(value);
            getDropdownData();
            propertyDisposalForm.setFieldsValue({
              disposedPerson: "",
            });
          },
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "disposedPerson":
        return (
          <Select
            suffixIcon={<CaretDownOutlined className="dropDownIcon" />}
            showSearch
            style={{ width: 250 }}
            onSearch={handleSearch}
            filterOption={(input, option) =>
              serchText &&
              option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={disableForm}
          >
            {!isEmpty(getDropdownData()) &&
              getDropdownData().map((item, index) => (
                <Option key={index} value={item.label} label={item.label}>
                  {item.label}
                </Option>
              ))}
          </Select>
        );
      case "disposedBy":
        return renderFieldsWithDropDown(
          disposedByList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      default:
        return (
          <Input
            onChange={checkFields}
            style={{ width: 250 }}
            maxLength={textFieldRules.maxLength}
            disabled={disableForm}
          />
        );
    }
  };

  useEffect(() => {
    if (selectedObjId) {
      setDataSource(selectedRecord);
    } else {
      propertyDisposalForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      propertyDisposal: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      propertyDisposal: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={propertyDisposalForm} layout="vertical">
        <Row gutter={24}>
          {displayState(disposalOfPropertyForm, displayFields)}
          <Col style={{ marginBottom: 20, padding: 0 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={!formValid || disableForm}
            />
          </Col>
        </Row>
        {isModalVisible ? (
          <AddPerson
            title="Add Receiver Details"
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

        {addPersonModalVisible ? (
          <AddPerson
            title="Add Person Details"
            isModalVisible={addPersonModalVisible}
            handleOk={handleAddPerson}
            handleCancel={handleCancel}
            formName={addPersonForm}
            checkFields={checkFields}
            disabled={disableForm}
            setInputList={setAddPersonInputList}
            editObj={addPerson}
            age={addPersonage}
            setAge={setAddPersonAge}
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
