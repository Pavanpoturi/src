import { Row, Col, Form, Input } from "antd";

import { useSelector } from "react-redux";
const { TextArea } = Input;

export default function Miscellaneous({ viewClicked }) {
  const { savedFir } = useSelector((state) => state.createFIR);

  const disableForm =
    savedFir?.caseStatus === "Disposal" ||
    savedFir?.isTransferOfCaseFile === true ||
    savedFir?.isChargeSheetTakenOrFiled === true;
  return (
    <div style={{ marginTop: "24px" }}>
      <Row>
        <Col span={20}>
          <Form.Item name="misDescription" label="Description">
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
