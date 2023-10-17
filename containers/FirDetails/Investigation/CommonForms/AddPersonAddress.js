import { Modal, Form, Col } from "antd";
import StandardAddressForm from "@components/Common/standardAddressForm";

export default function AddPersonAddress({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  checkFields,
  disabled,
}) {
  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
      okText="Add"
    >
      <Form form={formName} layout="vertical">
        <div>
          <Col span={24}>
            <StandardAddressForm
              colWidth={8}
              changeValue={checkFields}
              disabled={disabled}
            />
          </Col>
        </div>
      </Form>
    </Modal>
  );
}
