/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import {
  shelterFormName,
  preparationOfOffenceNameList,
  afterOffenceNameList,
  addressNameList,
} from "./const";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";

export default function Shelter({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const [shelterForm] = Form.useForm();
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [serchText, setSerchText] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const addMoreDetails = async () => {
    const values = await shelterForm.validateFields();
    const result = {
      address: values.address,
      prepOffence: values.prepOffence,
      afterOffence: values.afterOffence,
      remarks: values.remarks,
      regularResidencyOthers: values?.regularResidencyOthers,
    };
    setDataSource([...dataSource, result]);
    shelterForm.resetFields();
    setSelectedAddress("");
  };

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      shelterForm.setFieldsValue({
        address: values.address,
        prepOffence: values.prepOffence,
        afterOffence: values.afterOffence,
        remarks: values.remarks,
        regularResidencyOthers: values?.regularResidencyOthers,
      });
      setSelectedAddress(values.address);
    }
  };

  const updateRecord = async () => {
    const values = await shelterForm.validateFields();
    const updatedRecord = {
      address: values.address,
      prepOffence: values.prepOffence,
      afterOffence: values.afterOffence,
      remarks: values.remarks,
      regularResidencyOthers: values?.regularResidencyOthers,
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
    shelterForm.resetFields();
    setSelectedAddress("");
    setIsEdit(false);
    setSelectedIndex("");
  };

  const columns = [
    {
      title: "Regular Residence",
      dataIndex: "address",
      rowKey: "address",
      render: (address) => (
        <span className="tableRowText wordWrap">{address}</span>
      ),
    },
    {
      title: "Other Regular Residence",
      dataIndex: "regularResidencyOthers",
      rowKey: "regularResidencyOthers",
      render: (regularResidencyOthers) => (
        <span className="tableRowText wordWrap">{regularResidencyOthers}</span>
      ),
    },
    {
      title: "Preparation of Offence",
      dataIndex: "prepOffence",
      rowKey: "prepOffence",
      render: (prepOffence) => (
        <span className="tableRowText wordWrap">{prepOffence}</span>
      ),
    },
    {
      title: "After Offence",
      dataIndex: "afterOffence",
      rowKey: "afterOffence",
      render: (afterOffence) => (
        <span className="tableRowText wordWrap">{afterOffence}</span>
      ),
    },
    {
      title: "Remarks",
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
              editRecords(index);
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
        <Col span={6} key={i}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "prepOffence":
        return renderFieldsWithDropDown(
          preparationOfOffenceNameList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "afterOffence":
        return renderFieldsWithDropDown(
          afterOffenceNameList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "address":
        return renderFieldsWithDropDown(
          addressNameList,
          setSelectedAddress,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      default:
        return (
          <Input
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
      shelterForm.resetFields();
      setSelectedAddress("");
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      shelter: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      shelter: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={shelterForm} layout="vertical">
        <Row gutter={24}>
          {displayState(shelterFormName, displayFields)}

          {selectedAddress === "Others"
            && (<Col span={6} style={{ marginTop: 10 }}>
              <Form.Item name="regularResidencyOthers" label="Other Regular Residence">
                <Input
                  style={{ width: 250 }}
                  maxLength={textFieldRules.maxLength}
                  disabled={disableForm}
                />
              </Form.Item>
            </Col>)}

          <Col style={{ marginBottom: 20, marginTop: 10 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={disableForm}
            />
          </Col>
        </Row>
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
