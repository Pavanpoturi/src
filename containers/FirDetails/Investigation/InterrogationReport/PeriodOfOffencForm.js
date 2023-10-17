/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { periodOfOffencNameList } from "./const";
import { loadState } from "@lib/helpers/localStorage";

export default function PeriodOfOffencForm({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
  validationCommisionOfOffence,
}) {
  const dispatch = useDispatch();
  const crimeId = loadState("selectedFirId");
  const [periodOfOffnceForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [seectedOffence, setSelectedOffence] = useState("");
  const [serchText, setSerchText] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await periodOfOffnceForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onSelectedOffenceChanges = (val) => {
    setSelectedOffence(val);
  };

  const getFormFields = (values) => {
    const result = {
      offenceTime: values?.offenceTime,
      otherOffenceTime: values?.otherOffenceTime,
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      setSelectedOffence(selectedRecord?.offenceTime);
      periodOfOffnceForm.setFieldsValue({ ...getFormFields(selectedRecord) });
    } else {
      periodOfOffnceForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await periodOfOffnceForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      periodOfOffence: getFormFields(values),
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      periodOfOffence: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={periodOfOffnceForm} layout="vertical">
        <Row gutter={24}>
          <Col span={8} style={{ marginBottom: 20 }}>
            <Form.Item
              name="offenceTime"
              label="Commission Of Offence"
              rules={[{ required: validationCommisionOfOffence }]}
            >
              {renderFieldsWithDropDown(
                periodOfOffencNameList,
                onSelectedOffenceChanges,
                handleSearch,
                serchText,
                300,
                disableForm
              )}
            </Form.Item>
          </Col>
          {seectedOffence === "Other" ? (
            <Col span={8} style={{ marginBottom: 20 }}>
              <Form.Item name="otherOffenceTime" label="Other">
                <Input
                  onChange={checkFields}
                  style={{ width: 300 }}
                  maxLength={textFieldRules.maxLength}
                  disabled={disableForm}
                />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
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
