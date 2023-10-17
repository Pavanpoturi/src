/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { Row, Card, Col, Form, Input, Divider, Button } from "antd";
import { config } from "@config/site.config";
import { useDispatch, useSelector } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import masterDataActions from "@redux/masterData/actions";
import {
  socioEconomicForm,
  livingStatusNameList,
  maritalStatusNameList,
  educationDetailsNameList,
  incomeGroupNameList,
} from "./const";

export default function SocioEconomic({
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
  const [socioForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [serchText, setSerchText] = useState("");
  const { getOccupationList } = masterDataActions;
  const { occupationList } = useSelector((state) => state.MasterData);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await socioForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  useEffect(() => {
    const url = config.getMasterData;
    dispatch(getOccupationList(`${url}/OCCUPATION`));
  }, []);

  const displayState = (data, actionName) => {
    return (
      <Row gutter={24}>
        {data.map((s, i) => {
          return (
            <Col span={8} key={i} style={{ marginBottom: 20 }}>
              <Form.Item
                name={s.name}
                label={s.label}
                rules={[{ required: true }]}
              >
                {actionName(s.name)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    );
  };

  const displayFields = (name) => {
    switch (name) {
      case "livingStatus":
        return renderFieldsWithDropDown(
          livingStatusNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "maritalStatus":
        return renderFieldsWithDropDown(
          maritalStatusNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "education":
        return renderFieldsWithDropDown(
          educationDetailsNameList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "occupation":
        return renderFieldsWithDropDown(
          occupationList,
          null,
          handleSearch,
          serchText,
          300,
          disableForm
        );
      case "incomeGroup":
        return renderFieldsWithDropDown(
          incomeGroupNameList,
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

  const getFormFields = (values) => {
    const result = {
      livingStatus: values?.livingStatus,
      maritalStatus: values?.maritalStatus,
      education: values?.education,
      occupation: values?.occupation,
      incomeGroup: values?.incomeGroup,
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      socioForm.setFieldsValue({ ...getFormFields(selectedRecord) });
    } else {
      socioForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await socioForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      socioEconomic: getFormFields(values),
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      socioEconomic: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={socioForm} layout="vertical">
        {displayState(socioEconomicForm, displayFields)}
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
