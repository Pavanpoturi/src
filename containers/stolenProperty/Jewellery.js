import { Row, Col, Form, Input } from "antd";

const { TextArea } = Input;

export default function Jewellery({ disable, vieiwClicked, changeValue }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="jewQuantity"
            label="Quantity"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="jewWeight"
            label="Weight (gms)"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                message: "Numbers Only",
              },
            ]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item
            name="jewDescription"
            label="Description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
