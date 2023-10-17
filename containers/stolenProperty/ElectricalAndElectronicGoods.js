import { Row, Col, Form, Input } from "antd";

const { TextArea } = Input;

export default function ElectricalandElectronicGoods({
  disable,
  vieiwClicked,
  changeValue,
}) {
  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="elecMake" label="Make">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="elecModel" label="Model">
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="elecQuantity"
            label="Quantity"
            rules={[
              {
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item name="elecRemarks" label="Remarks">
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
