/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { loadState } from "@lib/helpers/localStorage";
import { gangFormationFormList } from "./const";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";

export default function GangFormation({
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
  const [gangForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { jailsNameList } = useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await gangForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const addMoreDetails = async () => {
    const values = await gangForm.validateFields();
    const result = {
      isAddOrSplit: values.isAddOrSplit === "Yes" ? true : false,
      name: values.name,
      address: values.address,
      historyPS: values.historyPS,
      historyUnit: values.historyUnit,
      historyState: values.historyState,
      lodgedJails: values.lodgedJails,
    };
    setDataSource([...dataSource, result]);
    gangForm.resetFields();
    checkFields();
  };

  const editRecords = (index) => {
    const values = dataSource[index];
    if (values) {
      gangForm.setFieldsValue({
        isAddOrSplit: values.isAddOrSplit === true ? "Yes" : "No",
        name: values.name,
        address: values.address,
        historyPS: values.historyPS,
        historyUnit: values.historyUnit,
        historyState: values.historyState,
        lodgedJails: values.lodgedJails,
      });
    }
  };

  const updateRecord = async () => {
    const values = await gangForm.validateFields();
    const updatedRecord = {
      isAddOrSplit: values.isAddOrSplit === "Yes" ? true : false,
      name: values.name,
      address: values.address,
      historyPS: values.historyPS,
      historyUnit: values.historyUnit,
      historyState: values.historyState,
      lodgedJails: values.lodgedJails,
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
    gangForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Addition / Split",
      dataIndex: "isAddOrSplit",
      rowKey: "isAddOrSplit",
      render: (isAddOrSplit) => (
        <span className="tableRowText wordWrap">
          {isAddOrSplit ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      rowKey: "name",
      render: (name) => <span className="tableRowText wordWrap">{name}</span>,
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
      title: "Previous PS History",
      dataIndex: "historyPS",
      rowKey: "historyPS",
      render: (historyPS) => (
        <span className="tableRowText wordWrap">{historyPS}</span>
      ),
    },
    {
      title: "Previous Unit History",
      dataIndex: "historyUnit",
      rowKey: "historyUnit",
      render: (historyUnit) => (
        <span className="tableRowText wordWrap">{historyUnit}</span>
      ),
    },
    {
      title: "Previous State History",
      dataIndex: "historyState",
      rowKey: "historyState",
      render: (historyState) => (
        <span className="tableRowText wordWrap">{historyState}</span>
      ),
    },
    {
      title: "Jail where lodged",
      dataIndex: "lodgedJails",
      rowKey: "lodgedJails",
      render: (lodgedJails) => (
        <span className="tableRowText wordWrap">{lodgedJails}</span>
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
        <Col span={8} key={i} style={{ marginBottom: 10 }}>
          <Form.Item name={s.name} label={s.label}>
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "isAddOrSplit":
        return renderFieldsWithDropDown(
          [{ label: "Yes" }, { label: "No" }],
          null,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "lodgedJails":
        return renderFieldsWithDropDown(
          jailsNameList,
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
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      gangFormation: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      gangFormation: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={gangForm} layout="vertical">
        <Row gutter={24}>
          {displayState(gangFormationFormList, displayFields)}
          <Col style={{ marginBottom: 20, padding: 0 }}>
            <AddUpdateButton
              isEdit={isEdit}
              updateRecord={updateRecord}
              addMoreDetails={addMoreDetails}
              disabled={!formValid || disableForm}
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
