import { Row, Col, Form, Input } from "antd";

const { TextArea } = Input;

export default function miscellaneous({ disable, vieiwClicked, changeValue }) {
  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item name="misDescription" label="Description">
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
