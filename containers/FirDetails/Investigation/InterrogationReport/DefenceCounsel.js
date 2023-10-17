/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import {
  getPersonDetails,
  getAddPersonFormValues,
} from "@containers/FirDetails/fir-util";
import { loadState } from "@lib/helpers/localStorage";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { defenceCounselFormList } from "./const";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";
import AddPerson from "../CommonForms/AddPerson";

export default function DefenceCounsel({
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
  const [defenceCounselForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");

  const checkFields = async () => {
    const values = await defenceCounselForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const handleOk = async () => {
    const values = await personForm.validateFields();
    setSelectedPerson(values);
    defenceCounselForm.setFieldsValue({
      defenceCounselPerson:
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
    const values = await defenceCounselForm.validateFields();
    const result = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      defenceCounselPerson: getPersonDetails(selectedPerson, inputList, []),
      defenceCounselAddress: values.defenceCounselAddress,
      defenceCounselPhone: values.defenceCounselPhone,
      assistance: values.assistance,
    };
    setDataSource([...dataSource, result]);
    defenceCounselForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    checkFields();
  };

  const updateRecord = async () => {
    const values = await defenceCounselForm.validateFields();
    const updatedRecord = {
      distDivision: values.distDivision,
      psCode: values.psCode,
      crimeNum: values.crimeNum,
      lawSection: values.lawSection,
      scCCNum: values.scCCNum,
      defenceCounselPerson: getPersonDetails(selectedPerson, inputList, []),
      defenceCounselAddress: values.defenceCounselAddress,
      defenceCounselPhone: values.defenceCounselPhone,
      assistance: values.assistance,
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
    defenceCounselForm.resetFields();
    personForm.resetFields();
    setSelectedPerson("");
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  useEffect(() => {
    if (isModalVisible === true) {
      personForm.setFieldsValue(selectedPerson);
    }
  }, [isModalVisible]);

  const editRecords = (item, index) => {
    const values = dataSource[index];
    if (item?.defenceCounselPerson) {
      let n1 = getAddPersonFormValues(item?.defenceCounselPerson);
      setSelectedPerson(n1);
    } else {
      setSelectedPerson("");
    }

    if (values) {
      defenceCounselForm.setFieldsValue({
        distDivision: values.distDivision,
        psCode: values.psCode,
        crimeNum: values.crimeNum,
        lawSection: values.lawSection,
        scCCNum: values.scCCNum,
        defenceCounselPerson: item?.defenceCounselPerson?.personalDetails?.name,
        defenceCounselAddress: values.defenceCounselAddress,
        defenceCounselPhone: values.defenceCounselPhone,
        assistance: values.assistance,
      });
    }
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
      title: "Defence Counsel Name",
      dataIndex: "defenceCounselPerson",
      rowKey: "defenceCounselPerson",
      render: (_value, item) => {
        const personalDetails = item?.defenceCounselPerson?.personalDetails;
        const personName = personalDetails?.name
          ? personalDetails?.name
          : " " + personalDetails?.surname
          ? personalDetails?.surname
          : "";
        return <span className="tableRowText wordWrap">{personName}</span>;
      },
    },
    {
      title: "Defence Counsel Address",
      dataIndex: "defenceCounselAddress",
      rowKey: "defenceCounselAddress",
      render: (defenceCounselAddress) => (
        <span className="tableRowText wordWrap">{defenceCounselAddress}</span>
      ),
    },
    {
      title: "Defence Counsel Phone No",
      dataIndex: "defenceCounselPhone",
      rowKey: "defenceCounselPhone",
      render: (defenceCounselPhone) => (
        <span className="tableRowText wordWrap">{defenceCounselPhone}</span>
      ),
    },
    {
      title: "Assistance Bail / Trial",
      dataIndex: "assistance",
      rowKey: "assistance",
      render: (assistance) => (
        <span className="tableRowText wordWrap">{assistance}</span>
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

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      defenceCounsel: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      defenceCounsel: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={defenceCounselForm} layout="vertical">
        <Row gutter={24}>
          {defenceCounselFormList.map((s, i) => {
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
