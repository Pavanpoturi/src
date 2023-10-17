/* eslint-disable array-callback-return */
import { Row, Card, Col, Form, Divider, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { config } from "@config/site.config";
import { useDispatch } from "react-redux";
import { loadState } from "@lib/helpers/localStorage";
import { renderFieldsWithMultipleDropDown } from "@containers/FirDetails/fir-util";
import { SaveOutlined } from "@ant-design/icons";
import { regularHabitsNameList } from "./const";
import { isUndefined } from "lodash";

export default function RegularHabits({
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
  const [regularHabbitsForm] = Form.useForm();
  const [serchText, setSerchText] = useState("");
  const [selectedRegularHabbits, setSelectedRegularHabbits] = useState([]);

  const handleSearch = (text) => {
    setSerchText(text);
  };

  useEffect(() => {
    if (selectedObjId) {
      setSelectedRegularHabbits(selectedRecord?.regularHabits);
      regularHabbitsForm.setFieldsValue({
        regularHabits: selectedRecord?.regularHabits,
        regularHabitsOthers: selectedRecord?.regularHabitsOthers,
      });
    } else {
      regularHabbitsForm.resetFields();
    }
  }, [selectedObjId, selectedRecord]);

  const submit = async () => {
    const values = await regularHabbitsForm.validateFields();
    const addPayload = {
      crimeId: crimeId,
      person: selectedAccused,
      regularHabits: values?.regularHabits,
      regularHabitsOthers: values?.regularHabitsOthers,
    };

    const updatePayload = {
      crimeId: crimeId,
      _id: selectedObjId,
      person: selectedAccused,
      regularHabits: values?.regularHabits,
      regularHabitsOthers: values?.regularHabitsOthers,
    };

    if (selectedObjId) {
      dispatch(updateDetails(config.interrogation, updatePayload));
    } else {
      dispatch(addDetails(config.interrogation, addPayload));
    }
  };

  return (
    <Card style={{ width: "100%" }} className="cardLeftStyle">
      <Form form={regularHabbitsForm} layout="vertical">
        <Row gutter={24}>
          <Col span={8} style={{ marginBottom: 20 }}>
            <Form.Item name="regularHabits" label="Regular Habits">
              {renderFieldsWithMultipleDropDown(
                regularHabitsNameList,
                setSelectedRegularHabbits,
                handleSearch,
                serchText,
                300,
                disableForm
              )}
            </Form.Item>
          </Col>
          {(!isUndefined(selectedRegularHabbits) && selectedRegularHabbits.includes("Others"))
            && (<Col span={8} style={{ marginBottom: 20 }}>
              <Form.Item name="regularHabitsOthers" label="Other Regular Habits">
                <Input
                  style={{ width: 300 }}
                  disabled={disableForm}
                />
              </Form.Item>
            </Col>)
          }
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
