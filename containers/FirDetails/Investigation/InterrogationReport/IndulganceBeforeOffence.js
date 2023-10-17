/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { renderFieldsWithDropDown } from "@containers/FirDetails/fir-util";
import { SaveOutlined } from "@ant-design/icons";
import { loadState } from "@lib/helpers/localStorage";
import { textFieldRules } from "@components/Common/formOptions";
import { indulganceBeforeOffenceNameList } from "./const";

export default function IndulganceBeforeOffence({
  disabled,
  selectedAccused,
  selectedObjId,
  selectedRecord,
  disableForm,
  addDetails,
  updateDetails,
}) {
  const crimeId = loadState("selectedFirId");
  const dispatch = useDispatch();
  const [indulganceForm] = Form.useForm();
  const [selectedIndulgance, setSelectedIndulgance] = useState("");
  const [serchText, setSerchText] = useState("");

  const handleSearch = (text) => {
    setSerchText(text);
  };

  const onSelectedIndulganceChanges = (val) => {
    setSelectedIndulgance(val);
  };

  const getFormFields = (values) => {
    const result = {
      indulganceType: values?.indulganceType,
      otherIndulganceType: values?.otherIndulganceType,
    };
    return result;
  };

  useEffect(() => {
    if (selectedObjId) {
      setSelectedIndulgance(selectedRecord?.indulganceType);
      indulganceForm.setFieldsValue({ ...getFormFields(selectedRecord) });
    } else {
      indulganceForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await indulganceForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      indulganceBeforeOffence: getFormFields(values),
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      indulganceBeforeOffence: getFormFields(values),
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={indulganceForm} layout="vertical">
        <Row gutter={24}>
          <Col span={8} style={{ marginBottom: 20 }}>
            <Form.Item name="indulganceType" label="Indulgence Before Offence">
              {renderFieldsWithDropDown(
                indulganceBeforeOffenceNameList,
                onSelectedIndulganceChanges,
                handleSearch,
                serchText,
                300,
                disableForm
              )}
            </Form.Item>
          </Col>
          {selectedIndulgance === "Others" ? (
            <Col span={8} style={{ marginBottom: 20 }}>
              <Form.Item name="otherIndulganceType" label="Other">
                <Input
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
