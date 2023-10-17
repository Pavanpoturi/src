import { Form, Input, Button, Row, Col } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import IntlMessages from "@components/utility/intlMessages";
import { textAreaRules, textFieldRules } from "./formOptions";
const { TextArea } = Input;

const getFields = (each, span) => {
  return each.fields.map((s, i) => {
    return (
      <Col span={span} key={i} style={{ marginBottom: 5 }}>
        <Form.Item name={`field-${i}`} label={s} rules={[textFieldRules.textFieldMaxLength]}>
          <Input maxLength={textFieldRules.maxLength} />
        </Form.Item>
      </Col>
    );
  });
};

export default function PersonDetailsForm(props) {
  return (
    <div style={{marginBottom: 15}}>
      {props.fieldsData &&
        props.fieldsData.map((each, i) => (
          <div>
            <label className="titleStyle">{each.title}</label>
            {each.fields.length > 2 && (
              <Form form={props.form} layout="vertical">
                <Row gutter={24}>{getFields(each, props.colSpan)}</Row>
                <Row>
                  {each.textArea && (
                    <Form.Item
                      label={each.textArea}
                      key={each.textArea}
                      style={{ marginBottom: 5, width: 1000 }}
                      rules={[textAreaRules.textAreaMaxLength]}
                    >
                       <TextArea rows={4} columns={3} maxLength={textAreaRules.maxLength} />
                    </Form.Item>
                  )}
                </Row>
                <Row>
                  {each.checkBox && (
                    <Form.Item label={each.checkBox.name} key={each.textArea}>
                      <div className="leftRightComponent">
                        <Checkbox>
                          <IntlMessages id="page.presentAddress" />
                        </Checkbox>
                      </div>
                    </Form.Item>
                  )}
                </Row>
              </Form>
            )}
          </div>
        ))}
      {!props.hideButton && (
        <div style={{ padding: 10 }}>
          <Button type="primary" className="submitButton">
            Submit
          </Button>
          <Button type="text">Cancel</Button>
        </div>
      )}
    </div>
  );
}
