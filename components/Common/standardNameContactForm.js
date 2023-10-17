import { Form, Input, Button, Col, List, Divider } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { useState, useEffect } from "react";
import IntlMessages from "@components/utility/intlMessages";
import { textFieldRules } from "@components/Common/formOptions";

export default function NameContactForm({
  existingData,
  onSubmit,
  onRemove,
  listTitle,
  showLink,
  buttonTitle,
  disableEdit,
}) {
  const [showForm, setShowForm] = useState(false);
  const [names, setNames] = useState([]);
  const [form] = Form.useForm();
  const [formValid, SetFormValid] = useState(false);
  const [onremove, SetOnRemove] = useState(false);

  useEffect(() => {
    if (!onremove) {
      setNames(existingData);
    }
  }, [onremove]);

  const handleSubmit = (values) => {
    values.internalFlag = false;
    setNames([...names, values]);
    onSubmit(values);
    form.resetFields();
    SetFormValid(false);
    SetOnRemove(true);
  };
  const checkFields = async () => {
    const values = await form.validateFields();
    SetFormValid(
      !Object.values(values).some((v) => v == null || v.trim() === "")
    );
  };
  const removeName = (each) => {
    let currentvalue = [...names];
    currentvalue.splice(currentvalue.indexOf(each), 1);
    setNames(currentvalue);
    onRemove(each);
    SetOnRemove(true);
  };

  return (
    <div style={{ marginBottom: 15 }}>
      {!isEmpty(names) && (
        <>
          <List
            header={<div>{!isEmpty(names) ? listTitle : ""}</div>}
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={names}
            renderItem={(item) =>
              !item.internalFlag && (
                <List.Item
                  actions={[
                    !disableEdit && (
                      <DeleteOutlined
                        onClick={() => removeName(item)}
                        style={{ color: "red" }}
                      />
                    ),
                  ]}
                  className="wordBreak"
                >
                  <Col span={8}>{item.firstname}</Col>
                  <Col span={8}>{item.surname}</Col>
                </List.Item>
              )
            }
          />
          <Divider />
        </>
      )}
      {(showForm || (existingData && existingData.length > 0) || !showLink) &&
      !disableEdit ? (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="firstname"
            label="Name"
            key="Full Name"
            style={{ marginBottom: 5 }}
            rules={[textFieldRules.textFieldMaxLength]}
          >
            <Input
              style={{ width: 300 }}
              onChange={checkFields}
              maxLength={textFieldRules.maxLength}
              required
            />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Surname"
            key="Sur Name"
            style={{ marginBottom: 5 }}
            rules={[textFieldRules.textFieldMaxLength]}
          >
            <Input
              style={{ width: 300 }}
              onChange={checkFields}
              maxLength={textFieldRules.maxLength}
              required
            />
          </Form.Item>
          <Form.Item>
            <div style={{ padding: "10px 0" }}>
              <div className="buttonsView" style={{ padding: "10px 0" }}>
                <Button
                  className="submitButton"
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={!formValid}
                >
                  <IntlMessages id="page.submit" />
                </Button>
                <Button type="text" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Form.Item>
        </Form>
      ) : (
        showLink &&
        !disableEdit && (
          <Button
            type="link"
            onClick={() => setShowForm(true)}
            style={{ padding: !isEmpty(names) ? "10%" : "25%" }}
            className="addExternalLink"
          >
            <div className="addExternalLinkText">Click to {buttonTitle}</div>
          </Button>
        )
      )}
    </div>
  );
}
