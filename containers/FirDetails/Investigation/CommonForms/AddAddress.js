import { useState } from "react";
import { Modal, Form, Col, Checkbox, Divider } from "antd";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";

export default function AddAddress({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  checkFields,
  disabled,
  selectedState,
  setSelectedState,
  selectedPermanentState,
  setSelectedPermanentState,
}) {
  const [permanentAddress, setPermanentAddress] = useState(false);

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
            <div className="heading">Present Address</div>
            <StandardAddressForm
              colWidth={8}
              changeValue={checkFields}
              disabled={disabled}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
            <Divider />
            <div>
              <span className="heading" style={{ marginRight: 20 }}>
                Permanent Address
              </span>
            </div>
            <Form.Item
              name="sameAsPresent"
              valuePropName="checked"
              onChange={checkFields}
            >
              <Checkbox
                style={{ color: "#949494", fontWeight: 300 }}
                disabled={disabled}
                onChange={(e) => setPermanentAddress(e.target.checked)}
              >
                Use same as Present
              </Checkbox>
            </Form.Item>
            {!permanentAddress && (
              <StandardPermanentAddressForm
                showMoreOption={true}
                colWidth={8}
                changeValue={checkFields}
                disabled={disabled}
                selectedPermanentState={selectedPermanentState}
                setSelectedPermanentState={setSelectedPermanentState}
              />
            )}
          </Col>
        </div>
      </Form>
    </Modal>
  );
}
