import { useState } from "react";
import { Modal, Form, Col, Divider, Checkbox, Button, Card, Row } from "antd";
import StandardPersonalForm from "@components/Common/standardPersonalForm";
import StandardAddressForm from "@components/Common/standardAddressForm";
import StandardContactForm from "@components/Common/standardContactForm";
import StandardPermanentAddressForm from "@components/Common/standardPermanentAddressForm";
import SavedSuretyRecords from "./SavedSuretyRecords";
import { isEmpty } from "lodash";
export default function AddSuretyDetails({
  title,
  isModalVisible,
  handleOk,
  handleCancel,
  formName,
  checkFields,
  disabled,
  suretyList,
  setviewEditObj,
  setviewEditObjIndex,
  setviewSuretyClicked,
  seteditSuretyClicked,
  age,
  setAge,
  setIsAddAnotherSuretyDetails,
}) {
  const [permanentAddress, setPermanentAddress] = useState(false);

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      width="85vw"
      footer={[
        <Button style={{ border: "transparent", float: "left" }}>
          <Checkbox
            style={{ color: "#949494", fontWeight: 300 }}
            disabled={disabled}
            onChange={(e) => setIsAddAnotherSuretyDetails(e.target.checked)}
          >
            Add Another
          </Checkbox>
        </Button>,
        <Button type="primary" onClick={handleOk} disabled={disabled}>
          Add
        </Button>,
        <Button onClick={handleCancel}>Cancel</Button>,
      ]}
    >
      <Row>
        <Card style={{ width: "75%" }} className="cardLeftStyle">
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
                />
                <Divider />
                <div className="heading">Present Address</div>
                <StandardAddressForm
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={disabled}
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
                    colWidth={8}
                    changeValue={checkFields}
                    disabled={disabled}
                  />
                )}
                <Divider />
                <StandardContactForm
                  colWidth={8}
                  changeValue={checkFields}
                  disabled={disabled}
                />
              </Col>
            </div>
          </Form>
        </Card>
        <Card style={{ width: "25%" }} className="right-section cardRightStyle">
          {!isEmpty(suretyList) ? (
            <div style={{ marginTop: 30 }}>
              <SavedSuretyRecords
                suretyList={suretyList}
                setviewEditObj={setviewEditObj}
                setviewEditObjIndex={setviewEditObjIndex}
                setviewSuretyClicked={setviewSuretyClicked}
                seteditSuretyClicked={seteditSuretyClicked}
                disable={false}
              />
            </div>
          ) : null}
        </Card>
      </Row>
    </Modal>
  );
}
