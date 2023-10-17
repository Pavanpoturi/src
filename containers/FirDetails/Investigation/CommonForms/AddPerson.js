import { useState } from "react";
import { Modal, Form, Col, Divider, Checkbox } from "antd";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardIdentityForm from "@components/Common/standardIdentityForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";

export default function AddPerson({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  checkFields,
  disabled,
  setInputList,
  editObj,
  age,
  setAge,
  validationFields,
  identityFieldsStatus,
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
            <StandardPersonalForm
              colWidth={8}
              changeValue={checkFields}
              disabled={disabled}
              age={age}
              setAge={setAge}
              formName={formName}
              validationFields={validationFields?.personalValidationFields}
            />
            <Divider />
            <div className="heading">Present Address</div>
            <StandardAddressForm
              colWidth={8}
              changeValue={checkFields}
              disabled={disabled}
              validationFields={validationFields?.addressValidationFields}
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
                validationFields={validationFields?.permanentValidationFields}
              />
            )}
            <Divider />
            <StandardContactForm
              colWidth={8}
              changeValue={checkFields}
              disabled={disabled}
              validationFields={validationFields?.contactValidationFields}
            />
            <Divider />
            <StandardIdentityForm
              colWidth={8}
              changeValue={checkFields}
              setidentityList={setInputList}
              form={formName}
              currentData={editObj?._id && editObj?.intimationGivenTo}
              disabled={disabled}
              identityFieldsStatus={identityFieldsStatus}
            />
          </Col>
        </div>
      </Form>
    </Modal>
  );
}
