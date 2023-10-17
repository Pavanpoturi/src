import { Form, Input, Row, Col } from "antd";
import { standardContactForm } from "./formOptions";
import { isArray } from "lodash";

export default function StandardContactForm({
  colWidth,
  changeValue,
  disabled = false,
  validationFields = [],
}) {
  const displayFormItems = (name) => {
    switch (name) {
      case "phoneNumber":
        return (
          <Input
            onChange={changeValue}
            // minLength={14}
            // maxLength={14}
            disabled={disabled}
          />
        );
      case "emailId":
        return (
          <Input
            onChange={changeValue}
            type="email"
            maxLength={50}
            disabled={disabled}
          />
        );
      default:
        return (
          <Input onChange={changeValue} maxLength={150} disabled={disabled} />
        );
    }
  };

  return (
    <div>
      <Row gutter={24}>
        {standardContactForm.map((s, i) => {
          const isLabel =
            isArray(validationFields) && validationFields.indexOf(s.label) >= 0;
          return (
            <Col span={colWidth} key={i} style={{ marginBottom: 10 }}>
              {s.name === "emailId" ? (
                <Form.Item
                  name={s.name}
                  label={s.label}
                  rules={[
                    {
                      type: "email",
                      message: "Email ID is not valid",
                    },
                  ]}
                >
                  {displayFormItems(s.name)}
                </Form.Item>
              ) : (
                <>
                  {" "}
                  {s.name === "phoneNumber" ? (
                    <Form.Item
                      name={s.name}
                      label={s.label}
                      rules={[
                        {
                          required: isLabel,
                          pattern: new RegExp(
                            /^(((\+?\(91\))|0|((00|\+)?91))-?)?[5-9]\d{9}$/
                          ),
                          message: "Phone Number is not valid",
                        },
                      ]}
                    >
                      {displayFormItems(s.name)}
                    </Form.Item>
                  ) : (
                    <Form.Item name={s.name} label={s.label}>
                      {displayFormItems(s.name)}
                    </Form.Item>
                  )}
                </>
              )}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
