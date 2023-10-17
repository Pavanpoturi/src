import { Row, Col } from "antd";
import { useSelector } from "react-redux";

export default function ContentHeader({ headerTitle }) {
  const { collapsed } = useSelector((state) => state.App);
  return (
    <Row gutter={24}>
      <Col style={{ width: !collapsed ? "80%" : "24%" }}>
        <h3 className="pageTitle" style={{ color: "#454647" }}>
          {headerTitle}
        </h3>
      </Col>
    </Row>
  );
}
