import { Row, Col, Form, Input } from "antd";
import { useSelector } from "react-redux";

const { TextArea } = Input;

export default function Automobiles({ viewClicked }) {
  const { savedFir } = useSelector((state) => state.createFIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={12}>
          <Form.Item
            name="registrationNumber"
            label="Registration No/Chasis No/Engine No of the Vehicle"
            style={{ marginBottom: 10 }}
          >
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item
            name="specialIdentifiactionDetails"
            label="Special Identification Details"
            style={{ marginBottom: 10 }}
          >
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
