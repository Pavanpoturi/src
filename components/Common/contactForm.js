import { Form, Input, Row, Col } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import ButtonForm from "@components/Common/buttonForm";
import IntlMessages from "@components/utility/intlMessages";
import { textFieldRules, textAreaRules } from "@components/Common/formOptions";
const { TextArea } = Input;

const getFields = (each) => {
  return each.fields.map((s, i) => {
    return (
      <Col span={12} key={i} style={{ marginBottom: 5 }}>
        <Form.Item name={`field-${i}`} label={s} rules={[textFieldRules.textFieldMaxLength]}>
          <Input maxLength={textFieldRules.maxLength} />
        </Form.Item>
      </Col>
    );
  });
};

export default function ContactForm(props) {
  const { fieldsData, primaryButtonText, generateInvoice, hideButton } = props;
  return (
    <div style={{ marginBottom: 15 }}>
      {fieldsData &&
        fieldsData.map((each, i) => (
          <div>
            {each.title && <label className="titleStyle">{each.title}</label>}
            {each.fields.length > 2 && (
              <Form form={props.form} layout="vertical">
                <Row gutter={24}>{getFields(each)}</Row>
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
                    <div key={each.textArea} style={{ marginTop: 10 }}>
                      <label className="titleStyle">{each.checkBox.name}</label>
                      <div className="leftRightComponent">
                        <Checkbox>
                          <IntlMessages id="page.presentAddress" />
                        </Checkbox>
                      </div>
                    </div>
                  )}
                </Row>
              </Form>
            )}
          </div>
        ))}

      {!hideButton && (
        <div style={{ paddingTop: 15 }}>
          <ButtonForm
            primaryButtonText={primaryButtonText}
            generateInvoice={generateInvoice}
          />
        </div>
      )}
    </div>
  );
}
