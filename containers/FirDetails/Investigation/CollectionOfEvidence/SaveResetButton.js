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
        <span className="linkStyle resetLink" onClick={onReset}>Reset</span>
      </Form.Item>
    </>
  );
}
