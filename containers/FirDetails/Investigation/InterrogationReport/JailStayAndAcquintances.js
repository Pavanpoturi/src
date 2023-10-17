/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input, DatePicker } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import {
  DATE_FORMAT,
  renderFieldsWithDropDown,
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";
import { jailStayFormList } from "./const";
import AddPerson from "../CommonForms/AddPerson";

const { RangePicker } = DatePicker;

export default function JailStayAndAcquintances({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [jailStayForm] = Form.useForm();
  const [serchText, setSerchText] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { jailsNameList } = useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  const checkFields = async () => {
    const values = await jailStayForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    jailStayForm.setFieldsValue({
      acquaintanceName:
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
    const values = await jailStayForm.validateFields();
    const result = {
      jailStayPeriod: values.jailStayPeriod,
      name: values.name,
      acquaintanceName: getPersonDetails(selectedPerson, inputList, []),
      acquaintanceAddress: values.acquaintanceAddress,
      crimeNature: values.crimeNature,
      remandedPSCode: values.remandedPSCode,
      remarks: values.remarks,
    };
    setDataSource([...dataSource, result]);
    jailStayForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    checkFields();
  };

  const editRecords = (item, index) => {
    const values = dataSource[index];
    if (item?.acquaintanceName) {
      let n1 = getAddPersonFormValues(item?.acquaintanceName);
      setSelectedPerson(n1);
    } else {
      setSelectedPerson("");
    }

    if (values) {
      const dateList = [];
      const jailStayPeriod = values?.jailStayPeriod;
      if (
        jailStayPeriod?.length > 0 &&
        jailStayPeriod[0] &&
        jailStayPeriod[1]
      ) {
        dateList.push(
          moment(new Date(jailStayPeriod[0])).isValid()
            ? moment(new Date(jailStayPeriod[0]))
            : ""
        );
        dateList.push(
          moment(new Date(jailStayPeriod[1])).isValid()
            ? moment(new Date(jailStayPeriod[1]))
            : ""
        );
      }
      jailStayForm.setFieldsValue({
        jailStayPeriod: dateList,
        name: values.name,
        acquaintanceName: item?.acquaintanceName?.personalDetails?.name,
        acquaintanceAddress: values.acquaintanceAddress,
        crimeNature: values.crimeNature,
        remandedPSCode: values.remandedPSCode,
        remarks: values.remarks,
      });
    }
  };

  const updateRecord = async () => {
    const values = await jailStayForm.validateFields();
    const updatedRecord = {
      jailStayPeriod: values.jailStayPeriod,
      name: values.name,
      acquaintanceName: getPersonDetails(selectedPerson, inputList, []),
      acquaintanceAddress: values.acquaintanceAddress,
      crimeNature: values.crimeNature,
      remandedPSCode: values.remandedPSCode,
      remarks: values.remarks,
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
    jailStayForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Jail Stay Period",
      dataIndex: "jailStayPeriod",
      rowKey: "jailStayPeriod",
      render: (jailStayPeriod) => {
        return (
          <>
            <span className="tableRowText wordWrap">
              {jailStayPeriod.length > 0
                ? moment(jailStayPeriod[0]).format(DATE_FORMAT)
                : ""}
            </span>
            <span className="tableRowText wordWrap">
              {jailStayPeriod.length > 0
                ? moment(jailStayPeriod[1]).format(DATE_FORMAT)
                : ""}
            </span>
          </>
        );
      },
    },
    {
      title: "Jail Name",
      dataIndex: "name",
      rowKey: "name",
      render: (name) => <span className="tableRowText wordWrap">{name}</span>,
    },
    {
      title: "Acquaintance Name",
      dataIndex: "acquaintanceName",
      rowKey: "acquaintanceName",
      render: (_value, item) => {
        const personalDetails = item?.acquaintanceName?.personalDetails;
        const personName = personalDetails?.name
          ? personalDetails?.name
          : " " + personalDetails?.surname
          ? personalDetails?.surname
          : "";
        return <span className="tableRowText wordWrap">{personName}</span>;
      },
    },
    {
      title: "Acquaintance Address",
      dataIndex: "acquaintanceAddress",
      rowKey: "acquaintanceAddress",
      render: (acquaintanceAddress) => (
        <span className="tableRowText wordWrap">{acquaintanceAddress}</span>
      ),
    },
    {
      title: "Nature of crime involved",
      dataIndex: "crimeNature",
      rowKey: "crimeNature",
      render: (crimeNature) => (
        <span className="tableRowText wordWrap">{crimeNature}</span>
      ),
    },
    {
      title: "Remanded from which PS",
      dataIndex: "remandedPSCode",
      rowKey: "remandedPSCode",
      render: (remandedPSCode) => (
        <span className="tableRowText wordWrap">{remandedPSCode}</span>
      ),
    },
    {
      title: "Remarks (related to MO)",
      dataIndex: "remarks",
      rowKey: "remarks",
      render: (remarks) => (
        <span className="tableRowText wordWrap">{remarks}</span>
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
        <Col span={8} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
          {s.actionLink && (
            <span className="linkStyle" onClick={() => setIsModalVisible(true)}>
              {s.actionName}
            </span>
          )}
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "name":
        return renderFieldsWithDropDown(
          jailsNameList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "jailStayPeriod":
        return (
          <RangePicker
            format={DATE_FORMAT}
            style={{ width: 250 }}
            disabled={disableForm}
          />
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
      jailStayForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      jailStay: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      jailStay: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={jailStayForm} layout="vertical">
        <Row gutter={24}>
          {displayState(jailStayFormList, displayFields)}
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
