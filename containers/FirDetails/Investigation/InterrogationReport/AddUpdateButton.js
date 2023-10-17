/* eslint-disable array-callback-return */
import { Col, Button } from "antd";
import { SaveOutlined, PlusOutlined } from "@ant-design/icons";

export default function AddUpdateButton({
  isEdit,
  updateRecord,
  addMoreDetails,
  disabled,
}) {
  return (
    <Col>
      {isEdit ? (
        <Button
          className="saveButton"
          size="large"
          onClick={updateRecord}
          style={{ marginTop: 20, width: 150 }}
          icon={<SaveOutlined className="saveButtonIcon" />}
        >
          Update Record
        </Button>
      ) : (
        <Button
          className="saveButton"
          size="large"
          onClick={addMoreDetails}
          style={{ marginTop: 25, width: 150 }}
          disabled={disabled}
          icon={<PlusOutlined className="saveButtonIcon" />}
        >
          Add More
        </Button>
      )}
    </Col>
  );
}
