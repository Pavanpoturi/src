import { Row, Col, Form, Input } from "antd";

import { useSelector } from "react-redux";
const { TextArea } = Input;

export default function Jewellery({ viewClicked }) {
  const { savedFir } = useSelector((state) => state.createFIR);
  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="jewQuantity" label="Quantity">
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="jewWeight"
            label="Weight (gms)"
            rules={[
              {
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="jewDescription" label="Description">
            <TextArea
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
