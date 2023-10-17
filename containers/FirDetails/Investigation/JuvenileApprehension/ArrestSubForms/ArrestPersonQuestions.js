import { Col, Form, Radio, Card } from "antd";
import { arrrestPersonQuestions } from "@components/Common/formOptions";

const styles = {
  widgetPageStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    overflow: "hidden",
  },
};

export default function ArrestPersonQuestions(props) {
  const { disabled, checkFields } = props;
  return (
    <Card className="widgetPageStyle" style={{ marginTop: 20 }}>
      <h3>
        <b>
          Whether the arrested person, as per observation and known police
          records
        </b>
      </h3>
      <br />
      {arrrestPersonQuestions.map((s, i) => {
        return (
          <Col span={24} key={i} style={{ marginBottom: 10 }}>
            <div style={styles.widgetPageStyle}>
              <div>
                <Form.Item name={s.name}>
                  <Radio.Group
                    buttonStyle="solid"
                    disabled={disabled}
                    onChange={checkFields}
                  >
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
              <div style={{ paddingTop: 5 }}>
                <span style={{ marginLeft: 15, paddingTop: 10 }}>
                  {s.label}
                </span>
              </div>
            </div>
          </Col>
        );
      })}
    </Card>
  );
}
