/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { isEmpty, first } from "lodash";
import { modusOperandiFormList } from "./const";
import TableRecords from "./TableRecords";
import AddUpdateButton from "./AddUpdateButton";

export default function ModusOperandi({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  validationFieldsStatus,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [modusOperandiForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [selectedMajorHead, setSelectedMajorHead] = useState("");
  const [serchText, setSerchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState("");
  const { majorHeadList, minorHeadList } = useSelector(
    (state) => state.MasterData
  );

  const checkFields = async () => {
    const values = await modusOperandiForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const majorHeadCode =
    !isEmpty(majorHeadList) &&
    first(majorHeadList.filter((s) => s.label === selectedMajorHead))?.code;
  const filteredMinorHeadList =
    majorHeadCode &&
    !isEmpty(minorHeadList) &&
    minorHeadList.filter((s) => s.code === majorHeadCode);

  const onMajorHeadChange = (val) => {
    setSelectedMajorHead(val);
    modusOperandiForm.setFieldsValue({
      crimeSubHead: "",
    });
    checkFields();
  };

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const addMoreDetails = async () => {
    const values = await modusOperandiForm.validateFields();
    setDataSource([...dataSource, values]);
    modusOperandiForm.resetFields();
    checkFields();
  };

  const editRecords = (index) => {
    const selectedRecord = dataSource[index];
    if (selectedRecord) {
      modusOperandiForm.setFieldsValue({
        crimeHead: selectedRecord.crimeHead,
        crimeSubHead: selectedRecord.crimeSubHead,
        modusOperandi: selectedRecord.modusOperandi,
      });
    }
  };

  const updateRecord = async () => {
    const values = await modusOperandiForm.validateFields();
    const updatedRecord = {
      crimeHead: values.crimeHead,
      crimeSubHead: values.crimeSubHead,
      modusOperandi: values.modusOperandi,
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
    modusOperandiForm.resetFields();
    setIsEdit(false);
    setSelectedIndex("");
    checkFields();
  };

  const columns = [
    {
      title: "Crime Head",
      dataIndex: "crimeHead",
      rowKey: "crimeHead",
      render: (crimeHead) => (
        <span className="tableRowText wordWrap">{crimeHead}</span>
      ),
    },
    {
      title: "Crime Sub-Head",
      dataIndex: "crimeSubHead",
      rowKey: "crimeSubHead",
      render: (crimeSubHead) => (
        <span className="tableRowText wordWrap">{crimeSubHead}</span>
      ),
    },
    {
      title: "MO",
      dataIndex: "modusOperandi",
      rowKey: "modusOperandi",
      render: (modusOperandi) => (
        <span className="tableRowText wordWrap">{modusOperandi}</span>
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
        <Col span={8} key={i}>
          <Form.Item
            name={s.name}
            label={s.label}
            rules={[{ required: validationFieldsStatus }]}
          >
            {actionName(s.name)}
          </Form.Item>
        </Col>
      );
    });
  };

  const displayFields = (name) => {
    switch (name) {
      case "crimeHead":
        return renderFieldsWithDropDown(
          majorHeadList,
          onMajorHeadChange,
          handleSearch,
          serchText,
          250,
          disableForm
        );
      case "crimeSubHead":
        return renderFieldsWithDropDown(
          filteredMinorHeadList,
          null,
          handleSearch,
          serchText,
          250,
          disableForm || selectedMajorHead === ""
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
      modusOperandiForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = () => {
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      modusOperandiList: dataSource,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      modusOperandiList: dataSource,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={modusOperandiForm} layout="vertical">
        <Row gutter={24}>
          {displayState(modusOperandiFormList, displayFields)}
          <Col style={{ marginBottom: 20, marginTop: 10 }}>
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
