/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import AddPerson from "../CommonForms/AddPerson";
import {
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { useDispatch } from "react-redux";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { suretiesFormList } from "./const";
import TableRecords from "./TableRecords";
import { isEmpty } from "lodash";
import AddUpdateButton from "./AddUpdateButton";
import { loadState } from "@lib/helpers/localStorage";

export default function Sureties({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const dispatch = useDispatch();
  const [suretiesForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const crimeId = loadState("selectedFirId");
  const [personForm] = Form.useForm();
  const [age, setAge] = useState("");
  const [inputList, setInputList] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  const checkFields = async () => {
    const values = await suretiesForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    suretiesForm.setFieldsValue({
      suretyPerson:
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
    const values = await suretiesForm.validateFields();
    const result = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      suretyPerson: getPersonDetails(selectedPerson, inputList, []),
      suretyAddress: values.suretyAddress,
      sureties: values.sureties,
      residencyType: values.residencyType,
      suretyNature: values.suretyNature,
    };
    setDataSource([...dataSource, result]);
    suretiesForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    checkFields();
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  const editRecords = (item, index) => {
    const values = dataSource[index];
    if (item?.suretyPerson) {
      let n1 = getAddPersonFormValues(item?.suretyPerson);
      setSelectedPerson(n1);
    } else {
      setSelectedPerson("");
    }

    if (values) {
      suretiesForm.setFieldsValue({
        distDivision: values.distDivision,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        scCCNum: values.scCCNum,
        suretyPerson: item?.suretyPerson?.personalDetails?.name,
        suretyAddress: values.suretyAddress,
        sureties: values.sureties,
        residencyType: values.residencyType,
        suretyNature: values.suretyNature,
      });
    }
  };

  const updateRecord = async () => {
    const values = await suretiesForm.validateFields();
    const updatedRecord = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      suretyPerson: getPersonDetails(selectedPerson, inputList, []),
      suretyAddress: values.suretyAddress,
      sureties: values.sureties,
      residencyType: values.residencyType,
      suretyNature: values.suretyNature,
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
    suretiesForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Dist / Division",
      dataIndex: "distDivision",
      rowKey: "distDivision",
      render: (distDivision) => (
        <span className="tableRowText wordWrap">{distDivision}</span>
      ),
    },
    {
      title: "P.S.",
      dataIndex: "psCode",
      rowKey: "psCode",
      render: (psCode) => (
        <span className="tableRowText wordWrap">{psCode}</span>
      ),
    },
    {
      title: "Cr.No.",
      dataIndex: "crimeNum",
      rowKey: "crimeNum",
      render: (crimeNum) => (
        <span className="tableRowText wordWrap">{crimeNum}</span>
      ),
    },
    {
      title: "Section Of Law",
      dataIndex: "lawSection",
      rowKey: "lawSection",
      render: (lawSection) => (
        <span className="tableRowText wordWrap">{lawSection}</span>
      ),
    },
    {
      title: "SC / CC No",
      dataIndex: "scCCNum",
      rowKey: "scCCNum",
      render: (scCCNum) => (
        <span className="tableRowText wordWrap">{scCCNum}</span>
      ),
    },
    {
      title: "Surety Name",
      dataIndex: "suretyPerson",
      rowKey: "suretyPerson",
      render: (_value, item) => {
        const personalDetails = item?.suretyPerson?.personalDetails;
        const personName = personalDetails?.name
          ? personalDetails?.name
          : " " + personalDetails?.surname
          ? personalDetails?.surname
          : "";
        return <span className="tableRowText wordWrap">{personName}</span>;
      },
    },
    {
      title: "Surety Address",
      dataIndex: "suretyAddress",
      rowKey: "suretyAddress",
      render: (suretyAddress) => (
        <span className="tableRowText wordWrap">{suretyAddress}</span>
      ),
    },
    {
      title: "Residency Type",
      dataIndex: "residencyType",
      rowKey: "residencyType",
      render: (residencyType) => (
        <span className="tableRowText wordWrap">{residencyType}</span>
      ),
    },
    {
      title: "Nature of Surety",
      dataIndex: "suretyNature",
      rowKey: "suretyNature",
      render: (suretyNature) => (
        <span className="tableRowText wordWrap">{suretyNature}</span>
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
      suretiesForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      sureties: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      sureties: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={suretiesForm} layout="vertical">
        <Row gutter={24}>
          <Col style={{ marginTop: 10 }}>
            <Row gutter={24}>
              {suretiesFormList.map((s, i) => {
                return (
                  <Col span={6} key={i} style={{ marginBottom: 10 }}>
                    <Form.Item name={s.name} label={s.label}>
                      <Input
                        onChange={checkFields}
                        style={{ width: 250 }}
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
              <Col style={{ marginBottom: 20, padding: 0 }}>
                <AddUpdateButton
                  isEdit={isEdit}
                  updateRecord={updateRecord}
                  addMoreDetails={addMoreDetails}
                  disabled={!formValid || disableForm}
                />
              </Col>
            </Row>
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
