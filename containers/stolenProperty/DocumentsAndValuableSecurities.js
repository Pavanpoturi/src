import { Row, Col, Form, Input } from "antd";
const { TextArea } = Input;
export default function DocumentsAndValuableSecurities({
  disable,
  vieiwClicked,
  changeValue,
}) {
  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item
            name="documentNo"
            label="Document Number/Property Identification"
          >
            <Input
              placeholder="Enter here"
              disabled={vieiwClicked || disable}
              onChange={changeValue}
            />
          </Form.Item>
        </Col>
        <Col span={20} style={{ marginLeft: 12 }}>
          <Form.Item name="documentParticulars" label="Document Particulars">
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
