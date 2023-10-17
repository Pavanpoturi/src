/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { textFieldRules } from "@components/Common/formOptions";
import { SaveOutlined } from "@ant-design/icons";
import { shareOfAmountSpentList } from "./const";

export default function ShareOfAmountSpent({
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
  const [shareOfAmountForm] = Form.useForm();
  const [formValid, setFormValid] = useState(false);
  const [selectedShareOfAmount, setSelectedShareOfAmount] = useState("");
  const [serchText, setSerchText] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const checkFields = async () => {
    const values = await shareOfAmountForm.validateFields();
    setFormValid(!Object.values(values).every((v) => v == null || v === ""));
  };

  const onSelectedShareOfAmountChanges = (val) => {
    setSelectedShareOfAmount(val);
  };

  const getFormFields = (values) => {
    const result = {
      shareOfAmountSpent: values?.shareOfAmountSpent,
      otherShareOfAmountSpent: values?.otherShareOfAmountSpent,
      remarks: values?.remarks,
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      setSelectedShareOfAmount(selectedRecord?.shareOfAmountSpent);
      shareOfAmountForm.setFieldsValue({ ...getFormFields(selectedRecord) });
    } else {
      shareOfAmountForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await shareOfAmountForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      shareOfAmount: getFormFields(values),
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      shareOfAmount: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={shareOfAmountForm} layout="vertical">
        <Row className="custody-reasons-row">
          <Col span={8} style={{ marginBottom: 20 }}>
            <Form.Item name="shareOfAmountSpent" label="Share Of Amount Spent">
              {renderFieldsWithDropDown(
                shareOfAmountSpentList,
                onSelectedShareOfAmountChanges,
                handleSearch,
                serchText,
                300,
                disableForm
              )}
            </Form.Item>
          </Col>
          {selectedShareOfAmount === "Others" ? (
            <Col span={8} style={{ marginBottom: 20 }}>
              <Form.Item
                name="otherShareOfAmountSpent"
                label="Other Share Of Amount Spent"
              >
                <Input
                  onChange={checkFields}
                  style={{ width: 300 }}
                  maxLength={textFieldRules.maxLength}
                  disabled={disableForm}
                />
              </Form.Item>
            </Col>
          ) : null}
          <Col span={8} style={{ marginBottom: 20 }}>
            <Form.Item name="remarks" label="Remarks">
              <Input
                onChange={checkFields}
                style={{ width: 300 }}
                maxLength={textFieldRules.maxLength}
                disabled={disableForm}
              />
            </Form.Item>
          </Col>
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
