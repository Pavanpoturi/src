import { Form, Divider, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

export default function SaveResetButton({ onSubmit, disabled, onReset }) {
  return (
    <>
      <Divider />
      <Form.Item>
        <Button
          type="primary"
          className="saveButton"
          size="large"
          icon={<SaveOutlined className="saveButtonIcon" />}
          onClick={onSubmit}
          disabled={disabled}
        >
          SAVE
        </Button>
        <Button
          type="primary"
          className="saveButton"
          size="large"
          style={{ marginLeft: 20 }}
          icon={<SaveOutlined className="saveButtonIcon" />}
          onClick={onReset}
          disabled={disabled}
        >
          Reset
        </Button>
      </Form.Item>
    </>
  );
}
