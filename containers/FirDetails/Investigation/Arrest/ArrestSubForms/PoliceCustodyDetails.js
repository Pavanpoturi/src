import { Col, Input, Form, Card, Checkbox, Row, DatePicker } from "antd";
import { textFieldRules } from "@components/Common/formOptions";
import { DATE_FORMAT } from "@containers/FirDetails/fir-util";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function PoliceCustodyDetails(props) {
  const { disabled, checkFields } = props;
  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      <Row glutter={24}>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Row>
            <div style={styles.widgetPageStyle}>
              <div>
                <Form.Item
                  name="ptWarrantIssued"
                  valuePropName="checked"
                  style={{ marginBottom: 20 }}
                >
                  <Checkbox disabled={disabled} onChange={checkFields} />
                </Form.Item>
              </div>
              <div style={{ marginTop: 5 }}>
                <span
                  style={{
                    paddingLeft: 10,
                    verticalAlign: "text-bottom",
                  }}
                >
                  PT Warrant Issued?
                </span>
              </div>
            </div>
            <div style={styles.widgetPageStyle}>
              <div>
                <Form.Item
                  name="ptWarrantRegularized"
                  style={{ marginBottom: 20 }}
                  valuePropName="checked"
                >
                  <Checkbox disabled={disabled} onChange={checkFields} />
                </Form.Item>
              </div>
              <div style={{ marginTop: 5 }}>
                <span
                  style={{
                    paddingLeft: 10,
                    verticalAlign: "text-bottom",
                  }}
                >
                  PT Warrant Regularized?
                </span>
              </div>
            </div>
            <div style={styles.widgetPageStyle}>
              <div>
                <Form.Item
                  name="isPoliceCustodyRequired"
                  style={{ marginBottom: 20 }}
                  valuePropName="checked"
                >
                  <Checkbox disabled={disabled} onChange={checkFields} />
                </Form.Item>
              </div>
              <div style={{ marginTop: 5 }}>
                <span
                  style={{
                    paddingLeft: 10,
                    verticalAlign: "text-bottom",
                  }}
                >
                  Is Police Custody Required?
                </span>
              </div>
            </div>
          </Row>
        </Col>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Form.Item
            name="warrantIssuedDate"
            label="Issued Date"
            rules={[{ required: true }]}
            style={{ marginBottom: 10 }}
          >
            <DatePicker
              disabled={disabled}
              onChange={checkFields}
              format={DATE_FORMAT}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item
            name="warrantRegularizedDate"
            label="Regularized Date"
            style={{ marginBottom: 10 }}
          >
            <DatePicker
              disabled={disabled}
              onChange={checkFields}
              format={DATE_FORMAT}
              style={{ width: 200 }}
            />
          </Form.Item>
          <span className="linkStyle">Fill Police Custody Form</span>
        </Col>
        <Col span={8} style={{ marginBottom: 10, paddingRight: 10 }}>
          <Form.Item
            name="warrantorderNumber"
            label="Order No"
            style={{ marginBottom: 10 }}
            rules={[textFieldRules.textFieldMaxLength]}
          >
            <Input
              style={{ width: 200 }}
              maxLength={textFieldRules.maxLength}
              onChange={checkFields}
              disabled={disabled}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
