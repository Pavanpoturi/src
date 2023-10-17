import { Modal, Form, Col, Row, Input } from "antd";
import { placeOfAddressForm } from "./const";
import { textFieldRules } from "@components/Common/formOptions";

export default function AddAddress({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
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
        <Row gutter={24}>
          {placeOfAddressForm.map((s, i) => {
            return (
              <Col span={8} key={i} style={{ marginBottom: 10 }}>
                <Form.Item name={s.name} label={s.label}>
                  <Input
                    maxLength={textFieldRules.maxLength}
                    disabled={disabled}
                  />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </Modal>
  );
}
