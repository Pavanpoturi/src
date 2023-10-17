import { Row, Col, Form, Input } from "antd";

import { useSelector } from "react-redux";
const { TextArea } = Input;

export default function ElectricalAndElectronicGoods({ viewClicked }) {
  const { savedFir } = useSelector((state) => state.createFIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;

  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="elecMake" label="Make">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="elecModel" label="Model">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ padding: "12px" }}>
          <Form.Item name="elecQuantity" label="Quantity">
            <Input
              placeholder="Enter here"
              disabled={viewClicked || disableForm}
            />
          </Form.Item>
        </Col>
        <Col span={20}>
          <Form.Item name="elecRemarks" label="Remarks">
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
