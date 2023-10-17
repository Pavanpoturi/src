import { Col, Divider, Form, Button, Input } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import StandardExpertTeamDetailsForm from "@components/Common/standardExpertTeamDetailsForm";
import { textAreaRules } from "@components/Common/formOptions";
import { setRules } from "@components/Common/helperMethods";

const { TextArea } = Input;
const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function ExpertTeamDetails({
  expertTeamForm,
  crimeSceneDate,
  handleSubmit,
  disableEdit,
  setViewDetails,
}) {
  const [formValid, setFormValid] = useState(false);

  const checkFields = async () => {
    const values = await expertTeamForm.validateFields();
    setFormValid(
      !Object.values(values).every(
        (v) => v == null || (typeof v === "string" && v.trim() === "")
      )
    );
  };

  const submit = async () => {
    const values = await expertTeamForm.validateFields();
    handleSubmit(values);
    expertTeamForm.resetFields();
    setFormValid(false);
  };

  const reset = () => {
    expertTeamForm.resetFields();
    setViewDetails(false);
  };

  return (
    <Form
      form={expertTeamForm}
      labelCol={{
        span: 100,
      }}
      wrapperCol={{
        span: 100,
      }}
      layout="vertical"
    >
      <div className="widgetPageStyle">
        <Col span={22}>
          <div style={styles.widgetPageStyle}>
            <div>
              <StandardExpertTeamDetailsForm
                changeValue={checkFields}
                disabled={disableEdit}
              />
            </div>
            <div>
              <Form.Item
                name="initialObservation"
                label="Initial Observation"
                rules={setRules("textareaxt")}
              >
                <TextArea
                  style={{ width: 500, height: 400 }}
                  rows={100}
                  columns={10}
                  maxLength={textAreaRules.maxLength}
                  disabled={disableEdit}
                />
              </Form.Item>
            </div>
          </div>
        </Col>
      </div>
      <Divider />
      <Form.Item>
        <Button
          type="primary"
          className="saveButton"
          size="large"
          icon={<SaveOutlined className="saveButtonIcon" />}
          disabled={!crimeSceneDate || disableEdit}
          onClick={submit}
        >
          SAVE
        </Button>
        <span className="linkStyle resetLink" onClick={reset}>
          Reset
        </span>
      </Form.Item>
    </Form>
  );
}
